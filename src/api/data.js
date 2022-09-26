import request from '@/utils/request'
import qs from 'qs'
import common from '@/assets/js/common.js'
export function initData(url, data) {
  return request({
    url: url,
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}

export function download(url, params) {
  return request({
    // url: url + '?' + qs.stringify(params, { indices: false }),
    url: url,
    method:('95F562C83E9DC158906711D6B8616121'),
    responseType: 'blob',
    data: params
  })
}
