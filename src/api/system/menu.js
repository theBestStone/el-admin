import request from '@/utils/request'
import common from '@/assets/js/common.js'
export function getMenusTree(data) {
  return request({
    url: common.base64DeCode('9D7D09752C78FF79E43556ACB5A148FFAC8712B0F7014D4B7C2C368959943DE6'),//'sys-menu/findChildrenMenuList',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function getMenus(params) {
  return request({
    url: common.base64DeCode('1A50634A2BB36E069C5281ABE7AB74EF'),//'api/menus',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF'),
    params
  })
}

export function getMenuSuperior() {
  return request({
    url: common.base64DeCode('7DDF4129AB22E9BA25CA9DC1799B889D97740452F42F9CF1B10BEA52C0504298'),//'sys-menu/findMenuTree',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}

export function getChild(data) {
  return request({
    url: common.base64DeCode('9D7D09752C78FF79E43556ACB5A148FF03DB9FE3B0BA7D636885029AF8CD5AD2'),//'sys-menu/findChildrenMenuIdList',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function buildMenus() {
  // return request({
  //   url: 'http://192.168.1.30:8080/mock/menu.json',
  //   method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  // })
}

export function add(data) {
  return request({
    url:  common.base64DeCode('0C1B1910915FCCADA8B7B5AD3820D529B62ADF7C74E4AEBBC7487A141D036CD4'),//'sys-menu/saveOrUpdate',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function del(ids) {
  return request({
    url: common.base64DeCode('28D95FD642A2A0F9E0D9E8FC5D98FDE05A7DE12B57192170B3B80DF8DBF1C650'),//'sys-menu/delMenu',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('0C1B1910915FCCADA8B7B5AD3820D529B62ADF7C74E4AEBBC7487A141D036CD4'),//'sys-menu/saveOrUpdate',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus, getChild }
