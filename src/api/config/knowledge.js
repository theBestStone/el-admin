import request from '@/utils/request'
import common from '@/assets/js/common.js'
import { getToken } from '@/utils/auth'

 

export function add(data) {
  return request({
    url: common.base64DeCode('D4E73858DE9061C37A32E91FD373F4F13FE7D0B4FBD938F68833ED2E76A8BBB6'),//'sysKnowledgeCenter/addFile',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function edit(data) {
  return request({
    url: common.base64DeCode('9A979C4BD7D17C5484074816BC00F9B3B69B5205D5295E3DB9A16D051B17EA82'),//'/sysKnowledgeCenter/updateFile',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
 
export function getCoverImg(id) {
   return process.env.VUE_APP_BASE_API+'/api-manage'+ common.base64DeCode('9A979C4BD7D17C5484074816BC00F9B3FE2BF475F1BD956A79DBB0CAB39346DB')+'/'+id+ '?access_token=' + getToken()
}

export function getRelease(data) {  //发布/下架
  return request({
    url: common.base64DeCode('D4E73858DE9061C37A32E91FD373F4F1B9480A89A657C3ABBF3552EF732B74D7'),//'sysKnowledgeCenter/publishFile',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export default { add, edit,getRelease,getCoverImg }
