import request from '@/utils/request'
import common from '@/assets/js/common.js'
export function add(data) {
  return request({
    url: common.base64DeCode('93B30D5F725041247EFE0AB89E495D2F'),//'/open/file/add',
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
    url: common.base64DeCode('2EB12E728E3700AC92ACB07BD703013B8C46A0FFFB541A6F970AE577849889A8'),//'open/file/update',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function getFilebyId(id) {
  return request({
    url: common.base64DeCode('21F73DEF326A6050EECFF5A2C48FFA01')+id,//`open/file/get/${id}`,
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}
export default { add, edit, del, getFilebyId }
