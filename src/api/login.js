import request from '@/utils/request'
import qs from 'qs'
import common from '@/assets/js/common.js'
export function login(username, password,captchaVerification) {
  
  return request({
    url: common.base64DeCode('E33AD4E955758644FB55E4437676B75D5EF4A076033FCC9788C12F10F70BCCB8'),//'api-auth/oauth/token',
    method:common.base64DeCode('95F562C83E9DC158906711D6B8616121'),
    data: qs.stringify(
      {
        username,
        password,
        grant_type: 'password',
        client_id: 'webApp',
        client_secret: 'webApp',
        scope: 'app',
        captchaVerification: captchaVerification,
        isManage: 1,
        agreementState:1
      },
      { arrayFormat: 'indices', allowDots: true }
    )
  })
}

// export function getInfo() {
//   return request({
//     url: 'auth/info',
//     method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
//   })
// }
export function getInfo() {
  return request({
    url: common.base64DeCode('9A821FB4759F4DAA3CE98F81E7C64EA552B15827AEF1B10F8ECE364485A525D8'),//'sys-user/flushUserInfo',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}

export function getCodeImg() {
  return request({
    url: common.base64DeCode('45A72D40CED8CB2EC11809DADC6D2073'),//'auth/code',
    method:common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}

export function logout() {
  return request({
    url: common.base64DeCode('8F2FB7D2273D0819B57A1215BA495567'),//'auth/logout',
    method: 'delete'
  })
}

export function viewAgreement(data) {
  return request({
    url:common.base64DeCode('C51877F561D509E45561A626102EA9EFA206AE105F7C4C72746A0937F1D232B9'),//'/api-user/protocol/register',
    method: common.base64DeCode('CBCAF99642BBB033F8BEAA6EE2D86CDF')
  })
}
