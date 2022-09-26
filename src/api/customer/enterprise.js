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
    url: common.base64DeCode('0BCC604F6A0E531B1C21C49A7015BD6177855603A26401ADA0FDA1EFC6C08575'),//'sysCustomer/deleteSysCustomer',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: { idList: ids.map(item => String(item)) }
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('7BDFE8593397D8E96B99CDE67062366B2FF6E7C11CA443E0B20EACEB77D5881B'),//'sysCustomer/editSysCustomer',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function addSysAudit(data) {
  return request({
    url: common.base64DeCode('9D7272EFF68D538A4AA1E9F4ADD94187EBD6876E7FD4FBBC63D98DFCC97663F4'),//'operate/addSysAudit',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function findOrgCert(data) {
  return request({
    url: common.base64DeCode('C8033E6068AB744D73FFA063EF92E35D4E08C232CC209962ED0CAB21B7CA6A16'),//'operate/findOrgCert',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export function findSysAudit(data) {
  return request({
    url: common.base64DeCode('4AA10430E6DB331733E96AD10B5311F607A88360CAA5BC1193F163EEACD02299'),//'operate/findSysAudit',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit, del, getDepts, getDeptSuperior, addSysAudit, findOrgCert, findSysAudit }
