import request from '@/utils/request'
import common from '@/assets/js/common.js'
export function getDicts() {
  return request({
    url: common.base64DeCode('29C335649DDC8BD8D0FF25CA876E1AD5CCEAC3CCF8911D3CB1750221E0059DF9'),//'sys-ent/findParentEntList',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}
export function findEntList(data) {
  return request({
    url: common.base64DeCode('C017E5452CB684C8451A70A0B4F7D0E3A57327E53DB2085CC4FF438676A67166'),//'sys-ent/findEntList',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function add(data) {
  return request({
    url: common.base64DeCode('555CF9EC2DB2BAAA67EA0FC3AF2BC5E1'),//'sys-ent/addEnt',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function del(ids) {
  return request({
    url: common.base64DeCode('5C68F555EEC077529DC5577CB1E729BB60BF720FAFC38169DBBD0D066F49CA49'),//'sys-ent/removeEnt',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('7FFB3FC5CECC1FA116A44DF638E35F54'),//'sys-ent/editEnt',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit, del, getDicts, findEntList }
