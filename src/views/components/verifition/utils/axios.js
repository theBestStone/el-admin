import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_BASE_API
let Base64 = require('js-base64').Base64;
const service = axios.create({
  timeout: 40000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  },
})
service.interceptors.request.use(
  config => {
    config.url = Base64.decode(config.url).replace("%3F","?");
    
    if(config.method=='cg9zda=='){
      config.method = 'post'
    }else{
      config.method = 'get'
    }
    // config.method = Base64.decode(config.method)
   
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
   
    const res = response.data
    return res
  },
  error => {
  }
)
export default service
