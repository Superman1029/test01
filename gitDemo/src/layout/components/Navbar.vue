<template>
  <div class="navbar">
    <div class="navbar-left">
      <div class="logo-title" @click="clickLogo">
        <img src="../../assets/img/Logo.png">
        <span :style="{color: textColor}">{{ configInfo.title }}</span>
      </div>
      <div>
        <sidebar class="sidebar-container" />
      </div>
    </div>
    <div class="right-menu">
      <search class="right-menu-item hover-effect" />
      <!--div class="right-menu-item hover-effect">
        <el-badge is-dot>
          <svg-icon icon-class="news" class="hover-effect" />
        </el-badge>
      </div>
      <div class="right-menu-item hover-effect">
        <svg-icon icon-class="setup" class="hover-effect" />
      </div>
      <div class="right-menu-item hover-effect">
        <svg-icon icon-class="message" class="hover-effect" />
      </div-->
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
      <lang-select class="right-menu-item hover-effect" />
      <ThemePicker class="right-menu-item hover-effect" :default="defaultColor" />
      <el-popover width="300" trigger="click" :title="$t('navbar.profile')">
        <el-row>
          <el-col :span="6">
            <img src="../../assets/img/tx.png" style="width: 60px; border-radius: 30px">
          </el-col>
          <el-col :span="18">
            <div class="user-info">({{ userinfo.usercode }}){{ userinfo.username }}</div>
            <div class="user-role"><span style="font-weight: bold;">{{ $t('navbar.sysRole') }}：</span>{{ userinfo.rolename }}</div>
          </el-col>
        </el-row>
        <el-divider />
        <div class="pro-title">
          <span>{{ $t('navbar.curProject') }}：</span>
          <span class="change-pro" @click="ChangePro">{{ $t('navbar.change') }}</span>
        </div>
        <!-- <p>项目编号</p> -->
        <p>{{ curProject.projectName }}</p>
        <p>{{ curProject.zcbfName }}</p>
        <p><span style="font-weight: bold;">{{ $t('navbar.proRole') }}：</span>{{ curProject.userRole }}</p>
        <el-divider />
        <el-row>
          <el-button type="warning" @click="changepassword">{{ $t('navbar.changepassword') }}</el-button>
          <el-button type="danger" style="float:right" @click="logout">{{ $t('navbar.exit') }}</el-button>
        </el-row>
        <img slot="reference" src="../../assets/img/tx.png" class="user-avatar">
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import Sidebar from '@/layout/components/Sidebar'

export default {
  components: { Screenfull, Search, LangSelect, ThemePicker, Sidebar },
  data() {
    return {
      defaultColor: window.localStorage.getItem('tremePackers') ? window.localStorage.getItem('tremePackers') : '#409EFF',
      configInfo: {},
      textColor: '#fff'
    }
  },
  computed: {
    ...mapGetters(['avatar', 'curProject', 'userinfo', 'sidebar'])
  },
  created() {
    this.configInfo = window.config
  },
  mounted() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'logoBgindex') {
        if (e.newValue && e.newValue === '3') {
          this.textColor = '#1f2d3d'
        } else {
          this.textColor = '#fff'
        }
      }
    })
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    ChangePro() {
      this.$store.dispatch('common/changeProject', true)
    },
    clickLogo() {
      this.$router.push({ path: '/' })
    },
    changepassword() {
      this.$router.push('/changePassword')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-divider { // 分割线
    margin: 5px 0;
  }

  .user-info {
    font-weight: bold;
    font-size: 18px;
  }
  .change-pro {
    cursor: pointer;
    color: var(--defaultColor);
    text-decoration: underline;
  }
  .user-role {
    line-height: 40px;
  }
  .pro-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 50px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    background-color: var(--defaultColor);
    color: white;
    min-width: 1280px;

    .navbar-left {
      display: flex;
    }
    .logo-title {
      display: flex;
      padding-right: 10px;
      img {
        width: 100px;
        height: 35px;
        align-self: center;
      }

      span {
        vertical-align: super;
        color: #fff;
        align-self: center;
      }
    }
    .logo-title:hover{
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }

    .change-platform {
      ul {
        display: flex;
        justify-content: space-between;
        width: 200px;
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          line-height: 50px;
          cursor: pointer;
          color: #cccccc;
        }

        li:hover {
          color: #eeeeee;
        }

        .active {
          color: #ffffff;
        }
      }
    }

    .right-menu {
      /*height: 100%;*/
      /*line-height: 50px;*/
      display: flex;
      align-items: center;

      &:focus {
        outline: none;
      }

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        margin-right: 5px;
        display: inherit;
      }

      .right-menu-item {
        font-size: 18px;
        /*color: #5a5e66;*/
        vertical-align: text-bottom;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 8px;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;
        }
        &:hover {
          background: rgba(0, 0, 0, .1)
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
