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
    url: common.base64DeCode('AE3325C444E057F288FFAF045476B23029DD236AAD6E9D347E19D3F4F3432E24'),//'open/problem/add',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function del(ids) {
  return request({
    url: common.base64DeCode('9479D3DF6C2580EBE5F539131F36FDB9EFC25DA4D7C70037305B89527E67A7F8'),//'open/problem/del',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('B8E2C2539ABB38511209B5F1DC0E46188190FF8F11DA749BB6C9F0809012BA85'),//'open/problem/update',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function getProblembyId(id) {
  return request({
    url: common.base64DeCode('5A17B86FB0E33E64E918E0BA7781EDC29454A559E614330B6AA22E95078EFB57')+id,//`open/problem/get/${id}`,
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}

export default { add, edit, del, getDepts, getDeptSuperior, getProblembyId }
