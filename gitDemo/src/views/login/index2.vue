<template>
  <el-container class="login-page2">
    <div class="login-container">
      <div class="logo-left-top">
        <img src="../../assets/img/Logo.png">
        <span>CPAS电子档案系统</span>
      </div>

      <div class="login-box">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <img src="../../assets/img/Logo.png">
          </div>

          <el-form-item prop="username" style="margin-top: 61px;">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password" style="margin-top: 15px;">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            class="login-but"
            @click.native.prevent="handleLogin"
          >登 录
          </el-button>
        </el-form>
      </div>
    </div>
  </el-container>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    if (window.localStorage.getItem('logoBgindex') === '1') {
      document.getElementsByClassName('login-but')[0].style.background = '#3E3E3E'
      document.getElementsByClassName('login-container')[0].style.backgroundImage = 'url(' + require('../../assets/img/logo2Bg1.png') + ')'
      document.getElementsByClassName('title-container')[0].style.backgroundImage = 'url(' + require('../../assets/img/logo2Form1.png') + ')'
    } else if (window.localStorage.getItem('logoBgindex') === '3') {
      document.getElementsByClassName('login-but')[0].style.background = '#A4D302'
      document.getElementsByClassName('login-container')[0].style.backgroundImage = 'url(' + require('../../assets/img/logo2Bg3.png') + ')'
      document.getElementsByClassName('title-container')[0].style.backgroundImage = 'url(' + require('../../assets/img/logo2Form3.png') + ')'
    } else if (window.localStorage.getItem('logoBgindex') === '4') {
      document.getElementsByClassName('login-but')[0].style.background = '#99010C'
      document.getElementsByClassName('login-container')[0].style.backgroundImage = 'url(' + require('../../assets/img/logo2Bg4.png') + ')'
      document.getElementsByClassName('title-container')[0].style.backgroundImage = 'url(' + require('../../assets/img/logo2Form4.png') + ')'
    } else {
      document.getElementsByClassName('login-but')[0].style.background = '#409EFF'
      document.getElementsByClassName('login-container')[0].style.backgroundImage = 'url(' + require('../../assets/img/logo2Bg2.png') + ')'
      document.getElementsByClassName('title-container')[0].style.backgroundImage = 'url(' + require('../../assets/img/logo2Form2.png') + ')'
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              window.location.reload()
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  /* reset element-ui css */
  .login-page2 {
    .login-box {
      .el-form-item__content {
        line-height: 34px !important;
      }
    }
    .el-input {
      display: inline-block;
      height: 34px;
      max-width: 85%;

      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        /*border-radius: 0;*/
        padding: 0;
        height: 34px;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
        }
      }
    }

    .el-form-item {
      /*border: 1px solid rgba(255,255,255,.1);*/
      /*background: rgba(0,0,0,.1);*/
      /*border-radius: 5px;*/
      /*color: #454545;*/
      width: 60%;
      margin: 0 auto;
      border: 1px solid rgba(203,203,203,1);
      background: rgba(249,249,249,1);
      border-radius: 10px;
      color: #666;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    width: 100%;
    /*background-color: #000;*/
    background: url("../../assets/img/logo2Bg2.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    height: 100%;
    .logo-left-top {
      margin: 20px 30px;
      img {
        width: 140px;
        /*height: 60px;*/
      }
      span {
        font-size: 28px;
        margin-left: 20px;
        font-weight: bold;
        color: #fff;
        letter-spacing: 3px;
      }
    }
    .login-box {
      width: 500px;
      height: 375px;
      position: relative;
      left: 60%;
      top: calc(50% - 255px);
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 0 24px 0 rgba(0,0,0,1);
      text-align: center;
    }
    .login-form {
      position: relative;
      /*padding: 50px;*/
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      /*padding: 6px 5px 6px 15px;*/
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      background: url("../../assets/img/logo2Form2.png") no-repeat;
      background-size: 100% 100%;
      border-radius: 10px;
      width: 100%;
      height: 92px;
      img {
        margin-top: 28.5px;
        width: 120px;
      }
    }
    .login-but {
      line-height: 33px;
      height: 33px;
      padding: 0 !important;
      border-radius: 10px;
      color: #fff;
      border: none;
      width: 60%;
      margin-top: 28px;
    }
  }
</style>

<style lang="scss">
  html,
  body,
  #app, .el-container {
    padding: 0; /*设置内部填充为0，几个布局元素之间没有间距*/
    margin: 0; /*外部间距也是如此设置*/
    height: 100%; /*统一设置高度为100%*/
  }
  /*.el-main {*/
    /*background-color: #283443;*/
  /*}*/

  .login-container .el-input input:-webkit-autofill {
    -webkit-text-fill-color: #666666 !important;
    -webkit-box-shadow: 0 0 0 1000px transparent  inset !important;
    background-color:transparent;
    background-image: none;
    color: #666666 !important;
    transition: background-color 9999999s ease-in-out 0s;
  }
  .login-container .el-input input {
    background-color: transparent !important;
  }
</style>
