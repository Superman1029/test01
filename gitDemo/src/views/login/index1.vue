<template>
  <el-container class="login-page1">
    <!-- 顶栏 -->
    <el-header height="50px">
      <img src="../../assets/img/Logo.png" style="width: 100px;height: 35px;margin-top: 7px;">
      <span style="vertical-align: super;color: #fff;margin-left: 10px;">CPASCloud</span>
    </el-header>
    <!-- 内容 -->
    <!--<el-main>-->
    <div class="login-container">
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
            <h3 class="title">欢迎登录</h3>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
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

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
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
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width:60%;margin-bottom:30px;padding: 12px 20px!important;"
            @click.native.prevent="handleLogin"
          >登 录
          </el-button>
        </el-form>
      </div>
    </div>
    <!--</el-main>-->
    <!-- 底栏 -->
    <el-footer height="20px">北京友数聚</el-footer>
  </el-container>
</template>

<script>
  // import { validUsername } from '@/utils/validate'
  // import axios from 'axios'

  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'))
          // } else if (value.length < 6) {
          //   callback(new Error('密码不能小于6位'))
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
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
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
  .login-page1 {
    .el-input {
      display: inline-block;
      height: 47px;
      max-width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        height: 47px;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    width: 100%;
    background-color: #000;
    /*background: url("../../assets/img/XXX.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    overflow: hidden;
    height: calc(100% - 70px);
    text-align: center;
    .login-box {
      width: 500px;
      height: 360px;
      position: relative;
      left: calc(50% - 250px);
      top: calc(50% - 180px);
      background: rgba(255,255,255,.3);
      border-radius: 15px;
    }
    .login-form {
      position: relative;
      padding: 50px;
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
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>

<style lang="scss" scoped>
  html,
  body,
  #app,
  .el-container {
    padding: 0px; /*设置内部填充为0，几个布局元素之间没有间距*/
    margin: 0px; /*外部间距也是如此设置*/
    height: 100%; /*统一设置高度为100%*/
  }
  .el-header,
  .el-footer {
    background-color: var(--defaultColor);
    color: white;
  }
  .el-footer {
    text-align: left;
  }
  .el-main {
    background-color: #283443;
  }

  .login-container .el-input input:-webkit-autofill {
    -webkit-text-fill-color: #ededed !important;
    -webkit-box-shadow: 0 0 0 1000px transparent  inset !important;
    background-color:transparent;
    background-image: none;
    color: #666666;
    transition: background-color 9999999s ease-in-out 0s;
  }
  .login-container .el-input input {
    background-color: transparent !important;
  }
</style>
