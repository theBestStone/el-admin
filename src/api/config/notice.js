import request from '@/utils/request'
import common from '@/assets/js/common.js'
export function getDepts(params) {
  return request({
    url:common.base64DeCode('C0523DDD9E92CCCEA20D738B065C5022'),// 'api/dept',
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
    url: common.base64DeCode('01910BFBB2E05E78C788484031364623'),//'open/notice/add',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function del(ids) {
  return request({
    url: common.base64DeCode('AB1BEAE73552ACF0FCDB49DE964A0EE9'),//'open/notice/del',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('1CE944A9901DD68363172E28E58AFE881C2E63E732C3AA3853BF3B6BCAC4A080'),//'open/notice/update',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function getNoticebyId(id) {
  return request({
    url: common.base64DeCode('B7B807959D608B84505BAA3F58172958291D573C291AC7F24D6A6C4B8FC02691')+id,//`open/notice/get/${id}`,
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}

export default { add, edit, del, getDepts, getDeptSuperior, getNoticebyId }
