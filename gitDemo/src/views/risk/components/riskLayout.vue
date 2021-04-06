<template>
  <div class="app-container">
    <split-pane ref="splitPane" :default-percent="70" :min-percent="2" split="horizontal" @resize="resize">
      <template slot="paneL">
        <div class="title-color fex-style">
          <slot name="title-left" />
          <div>
            <div class="icon-item">
              <risk-sign ref="riskSign" class="icon-size title-icon" />
            </div>
            <div v-if="!(isHide && isHide.indexOf(0) !== -1)" class="icon-item" @click="openGQ()">
              <svg-icon class="icon-size title-icon" icon-class="gq" />
            </div>
            <!-- <div v-if="!(isHide && isHide.indexOf(1) !== -1)" class="icon-item">
              <svg-icon class="icon-size title-icon" icon-class="download" />
            </div>
            <div v-if="!(isHide && isHide.indexOf(2) !== -1)" class="icon-item">
              <svg-icon class="icon-size title-icon" icon-class="upload" />
            </div> -->
            <div v-if="!(isHide && isHide.indexOf(3) !== -1)" class="icon-item" @click="navCommand('prior')">
              <svg-icon class="icon-size title-icon" icon-class="left" />
            </div>
            <div v-if="!(isHide && isHide.indexOf(4) !== -1)" class="icon-item" @click="navCommand('next')">
              <svg-icon class="icon-size title-icon" icon-class="right" />
            </div>
            <div v-if="!(isHide && isHide.indexOf(5) !== -1)" class="icon-item" @click="$refs.gotoGuide.show(stepcode)">
              <svg-icon class="icon-size title-icon" icon-class="info" />
            </div>
            <div v-if="!(isHide && isHide.indexOf(6) !== -1)" class="icon-item" @click="navCommand('home')">
              <svg-icon class="icon-size title-icon" icon-class="home" />
            </div>
          </div>
        </div>
        <div class="content-height">
          <slot name="content" />
        </div>
      </template>
      <template slot="paneR">
        <div class="dgContent">
          <div class="paneltitle">
            <span>相关底稿</span>
            <div class="right">
              <svg-icon class="icon-size" :class="{'rotate': !stepWorkpaperClosed}" icon-class="fold" @click="isFold(!stepWorkpaperClosed)" />
            </div>
          </div>
          <div class="dglist">
            <sjdg-treelist
              ref="sjdgList"
              :loading="loadingdg"
              :cur-zcbfinfo="getZcbfinfo()"
              :data="tableData"
              :multiple="false"
              :more-menu="[]"
              @rowMenuItemClick="rowMenuItemClick"
            />
          </div>
        </div>
      </template>
    </split-pane>
    <goto-guide ref="gotoGuide" />
    <ti-q ref="tiQ" :modid="'risk'" />
  </div>
</template>

<script>
import sjdgTreelist from '@/views/components/sjdgTreelist'
import gotoGuide from '@/views/risk/components/gotoGuide'
import riskSign from '@/views/risk/components/riskSign'
import tiQ from '@/views/sys/gq/tiQ'
import { utils } from '@/utils'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  components: { sjdgTreelist, gotoGuide, riskSign, tiQ },
  props: {
    stepcode: {
      type: String,
      required: true
    },
    stepname: {
      type: String,
      default: '',
      required: true
    },
    isTinymce: {
      type: Boolean,
      default: false
    },
    isHide: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loadingdg: false,
      tableData: [], // 表格中渲染的数据
      stepWorkpaperClosed: true, // 是否展开底部的相关底稿表格
      winOffsetHeight: document.body.offsetHeight, // 可视区域的高度
      steps: ['PR001', 'PR002', 'PR004', 'PR005', 'PR006', 'PR007',
        'TR001', 'TR002', 'TR003', 'TR004', 'TR006', 'TR007', 'TR008', 'TR009', 'TR010', 'TR012', 'TR013', 'TR015',
        'SP001', 'SP002', 'SP006', 'SP007',
        'CR001', 'CR002', 'CR003', 'CR004', 'CR005', 'CR006', 'CR007'
      ]
    }
  },
  computed: {
    ...mapGetters(['curProject', 'userinfo'])
  },
  watch: { },
  created() {},
  mounted() {
    if (this.isTinymce) {
      var self = this
      window.onresize = () => {
        self.setTinyMceHeight()
      }
    }
    if (!(this.curProject.dbname && this.curProject.zcbfid)) {
      this.$store.dispatch('common/changeProject', true)
    } else {
      this.$emit('onloaded')
      this.getManuscriptData()
      // console.log(this.$router)
      // console.log(this.$route)
    }
  },
  methods: {
    getZcbfinfo() {
      return this.curProject
    },
    // 获取相关底稿的数据
    getManuscriptData() {
      this.loadingdg = true
      getApiData('sjdg.Treelist', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        dgnd: '',
        sjjd: '',
        searchText: '',
        stepcode: this.stepcode
      }).then(r => {
        this.tableData = r.data
        this.loadingdg = false
      })
      // 获取签名信息
      this.$refs.riskSign.getSign(this.stepcode)
    },
    // 相关底稿收起/展开按钮点击触发
    isFold(value) {
      if (this.isTinymce) {
        const self = this
        this.stepWorkpaperClosed = value
        this.setSplitHeight()
        setTimeout(function() {
          self.$emit('isFoldChange')
        })
      } else {
        this.stepWorkpaperClosed = value
        this.setSplitHeight()
      }
    },
    // 分屏控件改变的回调
    resize(data) {
      if (this.isTinymce) {
        this.$emit('resizeChange', data)
        const minHeight = 100 - (35 / (this.winOffsetHeight - 105) * 100)
        const hideHeight = 100 - (50 / (this.winOffsetHeight - 105) * 100)
        if (hideHeight < data) {
          this.$refs.splitPane.percent = minHeight
          this.stepWorkpaperClosed = false
        } else {
          this.stepWorkpaperClosed = true
        }
      } else {
        const minHeight = 100 - (35 / (this.winOffsetHeight - 105) * 100)
        const hideHeight = 100 - (50 / (this.winOffsetHeight - 105) * 100)
        if (hideHeight < data) {
          this.$refs.splitPane.percent = minHeight
          this.stepWorkpaperClosed = false
        } else {
          this.stepWorkpaperClosed = true
        }
      }
    },
    // 设置分屏控件的高度
    setSplitHeight() {
      const hideHeight = 100 - (35 / this.$refs.splitPane.$el.offsetHeight * 100)
      this.$refs.splitPane.percent = this.stepWorkpaperClosed ? 70 : hideHeight
    },
    openGQ() {
      this.$refs.tiQ.show(this.stepcode, this.stepname)
    },
    navCommand(cmd) {
      if (cmd === 'home') {
        this.$router.push({ path: '/riskNav' })
        return
      }
      // 上一步，下一步
      const index = this.steps.indexOf(this.stepcode)
      if (index < 0) {
        this.$message({
          message: '未获取当前步骤信息。',
          type: 'error'
        })
        return
      }
      let step = ''
      if (cmd === 'prior') {
        step = this.steps[index - 1]
      } else {
        step = this.steps[index + 1]
      }
      if (utils.isEmpty(step)) {
        this.$message({
          message: cmd === 'prior' ? '未找到上一步骤信息。' : '未找到下一步骤信息。',
          type: 'error'
        })
        return
      }
      this.$router.push({ path: '/' + step })
    },
    rowMenuItemClick(itemid, row) {
      if (itemid === 'tiq') {
        this.openGQ(row)
      }
    }
  }
}
</script>
<style lang="scss">
  .content-height > div {
    height: 100%;
  }
</style>
<style lang="scss" scoped>
  .app-container {
    padding: 0;
    width: 100%;
    height: 100%;
    position: relative;
    .content-height {
      height: calc(100% - 30px);
      /*overflow: scroll;*/
    }
    .icon-item {
      display: inline-block;
      padding: 0 4px;

      &:hover {
        background: rgba(0, 0, 0, .1)
      }

      .title-icon {
        padding: 0 4px;
        color: var(--defaultColor);
        width: calc(1em + 8px);
      }
    }
  }

.dgContent{
  height: 100%;
  .dglist{
    height: calc(100% - 35px);
  }
  .paneltitle{
    .right{
      float: right;
      color: var(--defaultColor);
        .rotate {
          transform: rotate(180deg);
        }
    }
  }
}
</style>
