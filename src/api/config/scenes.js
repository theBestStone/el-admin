import request from '@/utils/request'
import common from '@/assets/js/common.js'

export function add(data) {
  return request({
    url: common.base64DeCode('1B303F3C18A9C433588C0D9AA0A2D0A113624A7F143EDC47FFD35386406CF995'),//'/sceneType/addSceneType',
    method:common.base64DeCode('73CDF7104852EA39A420B98D720ACFA1'),
    data
  })
}
export function edit(data) {
  return request({
    url: common.base64DeCode('972CDD14B1FA930F4F23C4060DD29332F45213FEB582C6C65AB53F84B31FF2B7'),//'sceneType/updateSceneType',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data
  })
}
export default { add, edit }