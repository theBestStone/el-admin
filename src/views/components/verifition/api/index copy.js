/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

import request from './../utils/axios' // 组件内部封装的axios
// import request from "@/api/axios.js"       //调用项目封装的axios

// 获取验证图片  以及token
export function reqGet(data) {
  return request({
    // anysign/gateway
    url: process.env.VUE_APP_BASE_API + '/api-captcha/captcha/get',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

// 滑动或者点选验证
export function reqCheck(data) {
  return request({
    // anysign/gateway
    url: process.env.VUE_APP_BASE_API + '/api-captcha/captcha/check',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
