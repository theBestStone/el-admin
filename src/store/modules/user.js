import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from '@/store'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password,userInfo.captchaVerification)
          .then(res => {
            setToken(res.access_token, rememberMe)
            commit('SET_TOKEN', res.access_token)
            // setUserInfo({ username: '焦帅兵' }, commit)
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit('SET_LOAD_MENUS', true)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            setUserInfo(res.data, commit)
            resolve(res.data)
          })
          .catch(() => {
            store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        // setUserInfo({ dataScopes: [], roles: ['admin'], user: { avatarName: 'avatar.jpeg', avatarPath: '/home/eladmin/avatar/avatar.jpeg', createTime: '2018-08-23 09:11:56', dept: { id: 2, name: '研发部' }, email: 'admin@el-admin.vip', enabled: true, gender: '男', id: 1, jobs: [{ id: 11, name: '全栈开发' }], nickName: '管理员', phone: '18888888888', pwdResetTime: '2020-05-03 16:38:31', roles: [{ dataScope: '全部', id: 1, level: 1, name: '超级管理员' }], updateBy: 'admin', updateTime: '2020-09-05 10:43:31', username: 'admin' } }, commit)
        // resolve({ dataScopes: [], roles: ['admin'], user: { avatarName: 'avatar.jpeg', avatarPath: '/home/eladmin/avatar/avatar.jpeg', createTime: '2018-08-23 09:11:56', dept: { id: 2, name: '研发部' }, email: 'admin@el-admin.vip', enabled: true, gender: '男', id: 1, jobs: [{ id: 11, name: '全栈开发' }], nickName: '管理员', phone: '18888888888', pwdResetTime: '2020-05-03 16:38:31', roles: [{ dataScope: '全部', id: 1, level: 1, name: '超级管理员' }], updateBy: 'admin', updateTime: '2020-09-05 10:43:31', username: 'admin' } })
        // getInfo()
        //   .then(res => {
        //     setUserInfo(res, commit)
        //     resolve(res)
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
      })
    },
    // 登出
    LogOut({ commit }) {
      logOut(commit)
      // return new Promise((resolve, reject) => {
      //   logout().then(res => {
      //     logOut(commit)
      //     resolve()
      //   }).catch(error => {
      //     logOut(commit)
      //     reject(error)
      //   })
      // })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const logOut = commit => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  console.log(res, 'res')
  if (res.menu2List.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.menu2List)
  }
  commit('SET_USER', res.user)
}

export default user
