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
    url: common.base64DeCode('57ADBB0A8B95B9B487103D8F299B70301BAF9D3767B6D624D751EF86234D8B2A'),//'api-openapi/openApi/saveOpenApi',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function dataLogFindById(data) {
  return request({
    url: common.base64DeCode('0DBBA2E6A789F9B0C6DDA546B704B9ABFDD185FCF7D44ED5DFB160396B5E5FB4'),//'sys-data-log/findById',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function findSystem() {
  return request({
    url: common.base64DeCode('0DBBA2E6A789F9B0C6DDA546B704B9ABCED5E272669B87BBE504CA61CD4F205F'),//'sys-data-log/findSystem',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}
export function findModulelist(data) {
  return request({
    url: common.base64DeCode('0DBBA2E6A789F9B0C6DDA546B704B9AB6BC452521E604DF5F9C11EE97445264B'),//'sys-data-log/findModulelist',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function findTypelist(data) {
  return request({
    url: common.base64DeCode('0DBBA2E6A789F9B0C6DDA546B704B9AB81624F1B4B1D40C06CAF2748BA6114D7'),//'sys-data-log/findTypelist',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit, del, dataLogFindById, findSystem, findModulelist, findTypelist }
