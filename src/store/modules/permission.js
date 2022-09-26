import { constantRouterMap } from '@/router/routers';
import ParentView from '@/components/ParentView';

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: [],
        sidebarRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        },
        SET_SIDEBAR_ROUTERS: (state, routers) => {
            state.sidebarRouters = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes({ commit }, asyncRouter) {
            commit('SET_ROUTERS', asyncRouter);
        },
        SetSidebarRouters({ commit }, sidebarRouter) {
            commit('SET_SIDEBAR_ROUTERS', sidebarRouter);
        }
    }
};

export const filterAsyncRouter = (routers, isRewrite = false) => {
    // 遍历后台传来的路由字符串，转换为组件对象

    if (isRewrite && routers.length > 0) {
        let childrens = [];
        return filterChildren(routers, childrens);
    }

    // return routers.filter(router => {
    //     if (isRewrite && router.children) {
    //         router.children = filterChildren(router.children);
    //         console.log(router.children);
    //     }
    //     if (router.component) {
    //         if (router.component === 'Layout') {
    //             // Layout组件特殊处理
    //             router.component = 'Layout';
    //         } else if (router.component === 'ParentView') {
    //             router.component = ParentView;
    //         } else {
    //             const component = router.component;
    //             router.component = loadView(component);
    //         }
    //     }
    //     if (router.children && router.children.length) {
    //         router.children = filterAsyncRouter(router.children, router, isRewrite);
    //     }
    //     return true;
    // });
};
function filterChildren(router, childrens) {
    router.forEach(el => {
        if (el.children) {
            filterChildren(el.children, childrens);
        } else {
            if (el.component) {
                el.component = loadView(el.component);
            }
            childrens.push(el);
        }
    });
    return childrens;
}

export const loadView = view => {
    return resolve => require([`@/views/${view}`], resolve);
};

export default permission;
