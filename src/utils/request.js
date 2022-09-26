import axios from 'axios'
import router from '@/router'
import { Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Config from '@/settings'
import Cookies from 'js-cookie'
import bus from '../views/common/bus'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})
//发送formdata的url
const formdataApiArr = ['api-auth']
//支持其他系统的api数组，默认api-manage
const publicPath = ['api-file', 'api-auth', 'api-openapi']
// request拦截器
service.interceptors.request.use(
  config => {
    // /anysign/gateway
    config.baseURL = config.baseURL + `/api-manage`
    if (publicPath.includes(config.url.substring(0, config.url.indexOf('/')))) {
      config.baseURL = config.baseURL.replace('api-manage', '')
    }
    if (getToken()) {
      let str = ''
      if (config.url.indexOf('?') !== -1) {
        str = '&'
      } else {
        str = '?'
      }
      config.url = config.url + str + 'access_token=' + getToken()
      // config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (formdataApiArr.includes(config.url.substring(0, config.url.indexOf('/')))) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      let data = response.data
    
      if (data.code == 200||data.access_token) {
       
        bus.$common.forMyCount(response);
        return  response.data
      }else if (data.code === 401){
        store.dispatch('LogOut').then(() => {
          // 用户登录界面提示
          Cookies.set('point', 401)
          location.reload()
        })
      } else {
        Notification.error({
          title:  data.message,
          duration: '3000'
        })
        throw response.data
         
      }
    } else {
      
      Promise.reject()
    }
    // return response.data
  },
  error => {
    // 兼容blob下载出错json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function(e) {
        const errorMsg = JSON.parse(reader.result).message
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    } else {
      let code = 0
 
      try {
        code = error.response.status
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Notification.error({
            title: '网络请求超时',
            duration: 5000
          })
          return Promise.reject(error)
        }
      }
      
      if (code) {
        if (code === 401) {
          store.dispatch('LogOut').then(() => {
            // 用户登录界面提示
            Cookies.set('point', 401)
            location.reload()
          })
        } else if (code === 403) {
          router.push({ path: '/401' })
        } else {
          const errorMsg = error.response.data.message
          if (errorMsg !== undefined) {
            Notification.error({
              title: errorMsg,
              duration: 5000
            })
          }
        }
      } else {
        Notification.error({
          title: '接口请求失败',
          duration: 5000
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
