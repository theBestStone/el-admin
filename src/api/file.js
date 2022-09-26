import request from '@/utils/request'
import qs from 'qs'
import common from '@/assets/js/common.js'
import { getToken } from '@/utils/auth'
export function fileUpload(data) {
  return request({
    url: common.base64DeCode('536B301B4F425E0666E57B743D473C44D789D295A685DBE1C9B0A2A8F99E59B0'),//'api-file/file/uploadBase64',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: data
  })
}
export function fileDetail(params) {
  return request({
    url: common.base64DeCode('9AA31CC02B4A9F07FE3C01508E9ABE1D804480E2BE87074305C1CE7915D06F3A'),//'api-file/file/detail',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF'),
    params
  })
}
export function fileUploads(params) {
  return process.env.VUE_APP_BASE_API+common.base64DeCode('34DE11141E3CD11B3215785BE3CA8518246D9FEA22B67EEA23C0BFAB2A8A61B5')+'?t=' +Math.random()+'&access_token='+getToken()
  // return request({
  //   url: '/api-file/file/upload',
  //   method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF'),
  //   params
  // })
}
export default { fileUpload, fileDetail,fileUploads }
