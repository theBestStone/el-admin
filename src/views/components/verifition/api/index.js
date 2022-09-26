/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

 import request from './../utils/axios' // 组件内部封装的axios
 // import request from "@/api/axios.js"       //调用项目封装的axios
 // import request from '@/utils/request';
 // 获取验证图片  以及token
 export function reqGet(data) {
   return request({
     url: 'L2FwaS1jYXB0Y2hhL2NhcHRjaGEvY2hpbGQvZ2V0',//'/api-captcha/captcha/child/get',
     method: 'cg9zda==',
     data
   })
 }
 
 // 滑动或者点选验证
 export function reqCheck(data) {
   return request({
     url:'L2FwaS1jYXB0Y2hhL2NhcHRjaGEvY2hpbGQvY2hlY2s=',// '/api-captcha/captcha/child/check',
     method: 'cg9zda==',
     data
   })
 }
 
 