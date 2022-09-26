import router from './routers'
import store from '@/store'
import { getToken } from '@/utils/auth' // getToken from cookie
// import { buildMenus } from '@/api/system/menu'
import { filterAsyncRouter } from '@/store/modules/permission'

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // if (to.meta.title) {
  //     document.title = to.meta.title + ' - ' + Config.title;
  // }

  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetInfo')
          .then(() => {
            // 拉取user_info
            // 动态路由，拉取菜单
            loadMenus(next, to)
          })
          .catch(() => {
            store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus')
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})
function filterMenu(menuData) {
  menuData.forEach((item, index) => {
    let tempobj = {
      name: item.menuUrl.substring(1) || item.icon,
      path: item.menuUrl || item.icon,
      meta: { icon: item.icon, title: item.menuName },
      children: item.childList
    }
    menuData[index] = tempobj
    if (item.childList && item.childList.length) {
      filterMenu(item.childList)
    } else {
      tempobj.component = item.moduleUrl
      tempobj.children = null
    }
  })
}
export const loadMenus = (next, to) => {
  let tempData = JSON.parse(JSON.stringify(store.getters.user.menuList))
  filterMenu(tempData)
  const sdata = JSON.parse(JSON.stringify(tempData))
  const rdata = JSON.parse(JSON.stringify(tempData))
  const sidebarRoutes = filterAsyncRouter(sdata)
  const rewriteRoutes = filterAsyncRouter(rdata, true)
  store.dispatch('GenerateRoutes', rewriteRoutes).then(() => {
    // 存储路由
    rewriteRoutes.forEach(route => {
      router.addRoute('home', route) // 动态添加可访问路由表
    })
    router.addRoute({ path: '*', redirect: '/404' })
    next({ ...to, replace: true })
  })
  store.dispatch('SetSidebarRouters', sidebarRoutes)

  // buildMenus().then(res => {
  //   console.log(res)
  //   const sdata = JSON.parse(JSON.stringify(res))
  //   const rdata = JSON.parse(JSON.stringify(res))
  //   const sidebarRoutes = filterAsyncRouter(sdata)
  //   const rewriteRoutes = filterAsyncRouter(rdata, true)
  //   store.dispatch('GenerateRoutes', rewriteRoutes).then(() => {
  //     // 存储路由
  //     rewriteRoutes.forEach(route => {
  //       router.addRoute('home', route) // 动态添加可访问路由表
  //     })
  //     router.addRoute({ path: '*', redirect: '/404' })
  //     next({ ...to, replace: true })
  //   })
  //   store.dispatch('SetSidebarRouters', sidebarRoutes)
  // })
}
export default router