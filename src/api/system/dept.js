import request from '@/utils/request'
import common from '@/assets/js/common.js'
export function getDepts(params) {
  return request({
    url: common.base64DeCode('C0523DDD9E92CCCEA20D738B065C5022'),//'api/dept',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF'),
    params
  })
}

export function getDeptSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: common.base64DeCode('D9C500186E0E021560246D2793B4C5BB0C820E64598356EDB4A5476FB2415C77'),//'api/dept/superior',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function add(data) {
  return request({
    url: common.base64DeCode('38654832F0B596DF079A451A04E9277F'),//'sys-org/addOrg',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function del(ids) {
  return request({
    url: common.base64DeCode('7213CFBC79FF387600991AE142E7ABA247C6740C7F7D565F5B511EA0CC42FC35'),//'sys-org/removeOrg',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('774B5172E7B9D8330B79E66A2AC46BC8'),//'sys-org/editOrg',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function findOrgList(data) {
  return request({
    url: common.base64DeCode('54D6C7DCBDAFE1E1FD6B5135A6FF71D0ED0B9B4FA8E087BB15019A481BA6C511'),//'sys-org/findOrgList',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function findOrgByEntId(data) {
  return request({
    url: common.base64DeCode('A7EE4997D44DDB6798A0F6186C11B9FF0D850AE249AC102317BE703D5037F6CA'),//'sys-org/findOrgByEntId',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit, del, getDepts, getDeptSuperior, findOrgList, findOrgByEntId }
