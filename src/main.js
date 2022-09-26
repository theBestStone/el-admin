import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './views/common/i18n';
import store from './store';
import elementUIVerify from 'element-ui-verify';
import './assets/css/main.css'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import { getToken } from '@/utils/auth'; // getToken from cookie
// 数据字典
import dict from './components/Dict';
import './assets/css/icon.css';
import './assets/css/element-variables.scss';
// global css
import './assets/css/index.scss';
import './views/common/directives';
// 权限指令
import checkPer from '@/utils/permission';
import permission from './components/Permission';
import './assets/icons'; // icon
import util from './assets/js/util.js';
import router from './router/routers';
import './router/index'; // permission control
import JsonViewer from 'vue-json-viewer/ssr'
import 'vue-json-viewer/style.css'
import common from './assets/js/common.js'

Vue.prototype.$common = common;

// const routeObj = {
//     path: '/userManage',
//     component: () => import(/* webpackChunkName: "user" */ '@/views/system/user/index.vue'),
//     meta: { title: '用户管理' }
// };
// router.addRoute('home', routeObj);
// console.log(router);
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.prototype.$util = util;
Vue.use(ElementUI, {
    size: 'small'
});
// 这里注意必须得先use elementUI
Vue.use(elementUIVerify);
Vue.use(JsonViewer)

import verifyrules from './assets/js/verifyRule';
verifyrules.forEach(item => {
    //
    elementUIVerify.addRule(item.rule, item.ruleMethod);
});
Vue.use(checkPer);
Vue.use(dict);
Vue.use(permission);
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app');
