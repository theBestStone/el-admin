import request from '@/utils/request'
// import { encrypt } from '@/utils/rsaEncrypt'
import common from '@/assets/js/common.js'
export function add(data) {
  return request({
    url: common.base64DeCode('6CFDEF9D137125D8B3C8063CAD7FA453BACC46B8AFE993A9476B3AD77A1D7FC7'),//'sys-user/addUser',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function del(ids) {
  return request({
    url: common.base64DeCode('403A0423A99EA3E8DCF4C1A37F4D91B79466C6EB04E5744F0688C564A260FC99'),//'sys-user/removeUser',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('1773633F4D8B85811F8A3137C1DFEF3E0044B068D3E91DE07030D01BA7A4382B'),//'sys-user/editUser',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function editUser(data) {
  return request({
    url: common.base64DeCode('4F7B2050B283B594C5EFC45253B4BCE86D3ED0EFFCE3942A975398486A378A95'),//'api/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: user.oldPass,
    newPass: user.newPass
  }
  return request({
    url: common.base64DeCode('858B25526B766761C298CB9CEC841DAB4A7EB3F56DF7B716E209477A323EB360'),//'api/users/updatePass/',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: form.pass,
    email: form.email
  }
  return request({
    url: common.base64DeCode('858B25526B766761C298CB9CEC841DAB9D27336CC80CE11B66BF6199BA8D9441')+ form.code,//'api/users/updateEmail/' + form.code,
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit, del }
