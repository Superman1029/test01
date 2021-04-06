<template>
  <div class="hideSidebar app-wrapper">
    <div class="fixed-header">
      <navbar />
    </div>
    <div class="project-info" @click="openChangeProject">
      <svg-icon class="icon-size title-icon" icon-class="fold" />
      <el-tooltip class="item" effect="dark" :content="curProject.projectName + ' -- ' + curProject.zcbfName" placement="right" :open-delay="1000">
        <span>
          {{ curProject.projectName }} -- {{ curProject.zcbfName }}
        </span>
      </el-tooltip>
      <el-tag style="padding: 5px 0;height: 105px;text-align: center;" :type="curProject.stack_status==200?'success':'warning'" size="mini">{{ getZcbfzt(curProject.stack_status) }}</el-tag>
      <svg-icon class="icon-size title-icon" icon-class="fold" />
    </div>
    <div class="main-container">
      <div :class="{'fixed-tag-header':fixedHeader}">
        <tags-view v-if="needTagsView" @toggleSideBar="toggleSideBar" />
      </div>
      <app-main />
    </div>
    <div class="page-footer">
      欢迎使用CPAS4.0 电子档案系统(V1.0)
      <a style="float: right" @click="downLoadWPV()">点击下载底稿查看工具</a>
    </div>
    <change-project />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import changeProject from '@/views/components/changeProject1'
import { Navbar, AppMain, TagsView } from '@/layout/components'
import { common } from '@/utils/common'
import { downloadLocalFile } from '@/api/localdata'

export default {
  name: 'Layout',
  components: { Navbar, AppMain, TagsView, changeProject },
  data() {
    return {
      winOffsetWidth: document.body.offsetWidth
    }
  },
  computed: {
    ...mapGetters(['curProject']),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    needTagsView() {
      return this.$store.state.settings.tagsView
    },
    showSettings() {
      return this.$store.state.settings.showSettings
    },
    classObj() {
      return {
        hideSidebar: true,
        openSidebar: false,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  },
  mounted() {
    this.$store.dispatch('app/toggleSideBar', '1')
  },
  methods: {
    // 切换平台
    // changePlatform(type) {
    //   this.isActive = type
    // },
    // resizePane(e) {
    //   const menuMinWidth = 56 / this.winOffsetWidth * 100
    //   const menuHideWidth = 70 / this.winOffsetWidth * 100
    //   if (menuHideWidth > e) {
    //     this.$refs.splitPane.percent = menuMinWidth
    //     this.$store.dispatch('app/toggleSideBar', '0')
    //   } else {
    //     this.$store.dispatch('app/toggleSideBar', '1')
    //   }
    // },
    toggleSideBar(status) {
      if (status) {
        this.$refs.splitPane.percent = 56 / this.winOffsetWidth * 100
        this.$store.dispatch('app/toggleSideBar', '0')
      } else {
        this.$refs.splitPane.percent = 15
        this.$store.dispatch('app/toggleSideBar', '1')
      }
    },
    openChangeProject() {
      this.$store.dispatch('common/changeProject', true)
    },
    downLoadWPV() {
      downloadLocalFile('tools/CPASWorkPaperViewer V4.1Setup.exe', 'CPASWorkPaperViewer V4.1Setup.exe', {})
    },
    getZcbfzt(zt) {
      return common.getZcbfzt(zt)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100vw;
    min-width: 1280px;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .project-info {
    position: absolute;
    height: calc(100% - 70px);
    letter-spacing: 3px;
    width: 26px;
    padding: 20px 0;
    writing-mode: vertical-lr;
    background-color: #FAFAFA;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    color: var(--defaultColor);
    border: 1px solid #EBEEF5;
    /*box-shadow: 0 0 12px 0 rgba(0,0,0,0.3);*/
    span {
      padding: 30px 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 100%;
      font-size: 12px;
      font-weight: 600;
    }
    svg {
      transform: rotate(-90deg);
    }
  }

  .fixed-header {
    /*position: fixed;*/
    /*top: 0;*/
    /*right: 0;*/
    /*z-index: 9;*/
    width: 100%;
    height: 50px;
    -webkit-transition: width 0.28s;
    transition: width 0.28s;
  }

  .page-footer {
    position: fixed;
    bottom: 0;
    height: 20px;
    width: 100%;
    background-color: var(--defaultColor);
    color: #fff;
    padding: 0 10px;
    font-size: 10px;
    line-height: 20px;
  }

  /*.hideSidebar .fixed-tag-header{*/
    /*width: calc(100% - 54px);*/
  /*}*/

  .fixed-tag-header {
    /*z-index: 9;*/
    width: 100%;
    transition: width 0.28s;
  }

  .manuscript-container {
    width: 100%;
    height: calc(100vh - 70px);
    padding-top: 50px;
    box-sizing: content-box;
  }
</style>
<style>
  .el-drawer__body {
    padding: 10px;
  }
  .split-pane-box > .splitter-paneL {
    overflow: hidden;
    height: 100%;
  }
  .split-pane-box > .splitter-paneL > div {
    height: 100%;
  }
</style>
