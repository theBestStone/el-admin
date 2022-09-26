import request from '@/utils/request'
import common from '@/assets/js/common.js'
export function add(data) {
  return request({
    url: common.base64DeCode('57ADBB0A8B95B9B487103D8F299B703013212C89BAEB1B35912AEFAA3EC97615'),//'api-openapi/openApi/addOpenApi',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function del(ids) {
  return request({
    url: common.base64DeCode('C8CF680F3542B1E124B53D6D2A6C9B2E'),//'open/file/del',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url:common.base64DeCode('57ADBB0A8B95B9B487103D8F299B70301BAF9D3767B6D624D751EF86234D8B2A'),// 'api-openapi/openApi/saveOpenApi',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function auditOpenApi(data) {
  return request({
    url: common.base64DeCode('57ADBB0A8B95B9B487103D8F299B7030F89D0B4DEF45D370DFFB353C6F72C271D99D3C11E9A2D16D9E9DA1C69A4490C7'),//'api-openapi/openApi/auditOpenApi',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit, del, auditOpenApi }
