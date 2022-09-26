<template>
  <div class="login" :style="'background-image:url(' + Background + ');'">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
      <h3 class="title">
        随e签支撑管理系统
      </h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <Verify @success="success" mode="pop" captchaType="blockPuzzle" :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>
      <p class="text-sm margin-top-lg margin-bottom-lg" v-if="false">
          <el-checkbox v-model="loginForm.agreementState">
              我已阅读并同意 
              <!-- <a class="text-blue margin-right-sm">隐私政策</a> -->
          </el-checkbox>
          <a class="text-blue"  @click="viewPro(protocolList[0])">《{{protocolList[0].title}}》</a> <span style="color:#333">和</span> <a class="text-blue"  @click="viewPro(protocolList[1])">《{{protocolList[1].title}}》</a> 
      </p>
      <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">
        记住我
      </el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="useVerify">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </div>
</template>

<script>
import Config from '@/settings'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import qs from 'qs'
import Background from '@/assets/img/background.jpg'
import Verify from '@/views/components/verifition/Verify'
import { viewAgreement } from '@/api/login'
export default {
  name: 'Login',
  data() {
    return {
      Background: Background,
      codeUrl: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        captchaVerification:"",
        agreementState:true
      },
      protocolList:[
        {},
        {}
      ],
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      redirect: undefined
    }
  },
  components: {
    Verify
  },
  watch: {
    $route: {
      handler: function(route) {
        const data = route.query
        if (data && data.redirect) {
          this.redirect = data.redirect
          delete data.redirect
          if (JSON.stringify(data) !== '{}') {
            this.redirect = this.redirect + '&' + qs.stringify(data, { indices: false })
          }
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取用户名密码等Cookie
    this.getCookie()
    // token 过期提示
    // this.point()
    //获取用户协议
    // this.protocol()
  },
  methods: {
    protocol(){
        viewAgreement().then(res=>{
            this.protocolList = res.data
        })
    },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        let loginForm = JSON.parse(JSON.stringify(this.loginForm))
        const user = {
          username: loginForm.username,
          password: loginForm.password,
          captchaVerification:loginForm.captchaVerification,
          rememberMe: loginForm.rememberMe
        }
        // if (user.password !== this.cookiePass) {
        //   user.password = this.Encrypt(user.password)
        // }
       
        user.password = this.Encrypt(user.password)
        user.username = this.Encrypt(user.username)
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: Config.passCookieExpires })
            Cookies.set('password', user.password, { expires: Config.passCookieExpires })
            Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', user)
            .then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    point() {
      const point = Cookies.get('point') !== undefined
      if (point) {
        this.$notify({
          title: '提示',
          message: '当前登录状态已过期，请重新登录！',
          type: 'warning',
          duration: 5000
        })
        Cookies.remove('point')
      }
    },
    Encrypt(word) {
      let key = CryptoJS.enc.Base64.parse('HwAjAv7trJl0AP/+5yAVCg==') //十六位十六进制数作为密钥
      let iv = CryptoJS.enc.Base64.parse('/xgA0AqJ7g0wmdyr/wgA3Q==') //十六位十
      let srcs = CryptoJS.enc.Utf8.parse(word)
      let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
      return encrypted.ciphertext.toString().toUpperCase()
    },
    success(params) {
     this.loginForm.captchaVerification =params.captchaVerification 
      this.handleLogin()
      // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
    },
    useVerify() {
      this.$refs.verify.show()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>
