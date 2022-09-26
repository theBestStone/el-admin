import Vue from 'vue'
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/',
    component: resolve => require(['@/views/common/Home.vue'], resolve),
    redirect: '/dashboard',
    name: 'home',
    meta: { title: '自述文件' },
    children: [
      // {
      //     path: '/dashboard',
      //     component: (resolve) => require(['@/views/page/Dashboard.vue'], resolve),
      //     meta: { title: '系统首页' }
      // },
      {
        name: 'dashboard',
        // component: 'system/user/center',
        component: resolve => require(['@/views/system/user/center'], resolve),
        path: '/dashboard',
        icon: 'el-icon-lx-home',
        meta: { icon: 'el-icon-lx-home', noCache: true, title: '系统首页' }
      },
      {
        path: '/404',
        component: resolve => require(['@/views/page/404.vue'], resolve),
        meta: { title: '404' }
      }
      // {
      //     path: '/403','], resolve),
      //     meta: { title: '403' }
      // }
    ]
  },
  {
    path: '/login',
    component: resolve => require(['@/views/login.vue'], resolve),
    meta: { title: '登录' }
  }
]
export default new Router({
  mode: 'hash',
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

      //     component: (resolve) => require(['@/views/page/403.vue