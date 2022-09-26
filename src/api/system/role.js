import request from '@/utils/request'
import common from '@/assets/js/common.js'
// 获取所有的Role
export function getAll() {
  return request({
    url: common.base64DeCode('5F25F7F55EA47C8D369F34AD023C6FF1'),//'api/roles/all',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}
export function findRoleList(data) {
  return request({
    url: common.base64DeCode('389DD6FDBE9C6D0E8E01A1B8EBA726BBF820ACF594106DDB3A8102B18650BF8F'),//'sys-role/findRoleList',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function add(data) {
  return request({
    url: common.base64DeCode('CFA70BF2F519708D0950A6FE4C6DC21188F626F1AD7149CDDC585CC9736EF891'),//'sys-role/addRole',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function get(data) {
  return request({
    url: common.base64DeCode('389DD6FDBE9C6D0E8E01A1B8EBA726BB743D28E6EE5911DB9EAF6BF9743C7468'),//'sys-role/findRoleMenu',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function getLevel() {
  return request({
    url: common.base64DeCode('D5344958C9342B6B2AC8887C5230A75C'),//'api/roles/level',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}

export function del(ids) {
  return request({
    url: common.base64DeCode('AE23B315CB869416E8A52DEDBAF7CFC8C802B75C261948DE86A275B3053C15D8'),//'sys-role/delRole',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('7F7AFB602588E016EECC8A41D5F6B0BA0F890BBDD7B89A92586B2C3440334895'),//'sys-role/editRole',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function editMenu(data) {
  return request({
    url: common.base64DeCode('7F7AFB602588E016EECC8A41D5F6B0BA96848F2E969F99486D22EB9423D4A31E'),//'sys-role/editRoleMenu',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function chooseRole(data) {
  return request({
    url: common.base64DeCode('21CF23883AC8DE7E6C3C818695983232C6F5B6AFE922D0FF848C40D9F242A98B'),//'sys-user/chooseRole',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit, del, get, editMenu, getLevel, findRoleList, chooseRole }
