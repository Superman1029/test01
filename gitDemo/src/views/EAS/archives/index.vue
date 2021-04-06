<template>
  <split-pane v-loading="checking" split="vertical" :default-percent="25" element-loading-text="正在检测...">
    <template slot="paneL">
      <zcbf-tree ref="zcbfTree" :params="zcbfParams" @nodeClick="nodeClick" />
    </template>
    <template slot="paneR">
      <div class="toolbar">
        <span>组成部分：{{ curZcbfinfo.projectName }}<el-divider direction="vertical" />{{ curZcbfinfo.zcbfName }}
          <el-tag v-if="curZcbfinfo.zcbfName" :type="curZcbfinfo.stack_status==200?'success':'warning'" size="mini">{{ getZcbfzt(curZcbfinfo.stack_status) }}</el-tag>
        </span>
        <div v-if="$route.path=='/archives'" class="rightItem">
          <el-button type="primary" :disabled="!(curZcbfinfo.stack_status==190)" @click="submitGD()">提交归档</el-button>
          <el-button :disabled="!(curZcbfinfo.stack_status==192)" @click="doArchive(190, '', '提交归档-收回')">收回</el-button>
        </div>
        <div v-if="$route.path!='/archives'" class="rightItem">
          <el-button type="primary" :disabled="!(curZcbfinfo.stack_status==192)" @click="doArchive(200, '200', '执行归档')">执行归档</el-button>
          <el-button :disabled="!(curZcbfinfo.stack_status==192)" @click="doArchive(190, '', '执行归档-驳回')">驳回</el-button>
          <el-button :disabled="!(curZcbfinfo.stack_status==200)" @click="doArchive(190, '1', '执行归档-撤销归档')">撤销归档</el-button>
        </div>
      </div>
      <split-pane split="horizontal" class="content" :default-percent="70">
        <template slot="paneL">
          <sjdg-treelist ref="sjdgList" :cur-zcbfinfo="curZcbfinfo" :data="dgTreelist" :loading="loadingdg" :multiple="false" :more-menu="[]" @curRowChanged="curRowChanged" />
        </template>
        <template slot="paneR">
          <el-tabs v-model="activeName" type="card" style="height: 100%;" class="archives-tabs">
            <el-tab-pane label="底稿归档记录日志" name="arcLog" style="height: 100%;">
              <dggd-list ref="dggdList" />
            </el-tab-pane>
            <el-tab-pane label="底稿附件列表" name="dgfjList" style="height: 100%;">
              <dgfj-list ref="dgfjList" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </split-pane>
      <check-dia ref="checkDia" />
      <sign-dia ref="signDia" />
    </template>
  </split-pane>
</template>

<script>
import zcbfTree from '@/views/components/zcbfTreeLazy'
import sjdgTreelist from '@/views/components/sjdgTreelist'
import dggdList from '@/views/EAS/archives/components/dggdList'
import dgfjList from '@/views/components/dgfjList'
import signDia from '@/views/components/signDia'
import checkDia from '@/views/EAS/archives/components/checkDia'
import { getApiData } from '@/api/common'
import { common } from '@/utils/common'
import { mapGetters } from 'vuex'

export default {
  name: 'Archives',
  components: { zcbfTree, sjdgTreelist, dggdList, checkDia, signDia, dgfjList },
  props: [],
  data() {
    return {
      activeName: 'arcLog',
      checking: false, // 归档检查 进度
      loadingdg: false, // 加载底稿进度
      dgTreelist: [],
      loading: false,
      curZcbfinfo: {},
      zcbfParams: {},
      searchPara: {
        dgnd: '',
        searchText: '',
        sjjd: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {
  },
  mounted() {
    this.zcbfParams.sjxmzt = this.$route.path === '/archives' ? 190 : 192
    if (this.userinfo.rolename === '超级管理员') {
      this.zcbfParams.usercode = ''
    } else {
      this.zcbfParams.usercode = this.userinfo.usercode
    }
    if (this.userinfo.rolename === '档案管理员' && this.$route.path !== '/archives') {
      this.zcbfParams.usercode = ''
      this.zcbfParams.ssbm = this.userinfo.ssbmcode
    }
    this.$refs.zcbfTree.loadData()
  },
  methods: {
    getZcbfzt(zt) {
      return common.getZcbfzt(zt)
    },
    // 加载底稿列表
    loaddgTree() {
      this.loadingdg = true
      getApiData('sjdg.Treelist', {
        dbname: this.curZcbfinfo.dbname,
        zcbfid: this.curZcbfinfo.zcbfid,
        dgnd: this.searchPara.dgnd,
        sjjd: this.searchPara.sjjd,
        searchText: this.searchPara.searchText
      }).then(r => {
        this.dgTreelist = r.data
        this.loadingdg = false
      })
    },
    curRowChanged(row) {
      if (this.activeName !== 'dgfjList') return// 优化
      const self = this
      this.$refs.dgfjList.loadData({
        dbname: self.curZcbfinfo.dbname,
        zcbfid: self.curZcbfinfo.zcbfid,
        dgid: row.yid // 这里使用 原ID 为int的
      })
    },
    // 选中组成部分时 触发
    nodeClick(zcbfInfo) {
      this.curZcbfinfo = zcbfInfo
      this.loaddgTree()
      this.$refs.dggdList.loadData(this.curZcbfinfo)
    },
    // 插入归档日志
    insertArchiveLog(remark, action) {
      getApiData('arc.insertCheckLog', {
        dbname: this.curZcbfinfo.dbname,
        projectid: this.curZcbfinfo.projectid,
        zcbfid: this.curZcbfinfo.zcbfid,
        edituser: this.userinfo.username,
        remark: remark,
        action: action
      })
    },
    // 更新组成部分状态 参数依次为：组成部分状态，底稿状态，说明，动作
    updateZcbfZT(zt, dgzt, remark, action) {
      getApiData('arc.updateZcbfZT', {
        dbname: this.curZcbfinfo.dbname,
        zcbfid: this.curZcbfinfo.zcbfid,
        dgzt: dgzt,
        zt: zt
      }).then(r => {
        this.insertArchiveLog(remark, action)
        this.$message.success('成功')
        this.curZcbfinfo.stack_status = zt
        this.$refs.dggdList.loadData(this.curZcbfinfo) // 刷新归档记录
      })
    },
    // 提交归档
    submitGD() {
      if (this.dgTreelist.length <= 0) {
        this.$message.warning('该组成部分没有底稿，不能提交归档')
        return
      }
      const self = this
      this.checking = true
      getApiData('arc.archiveCheck', {
        dbname: self.curZcbfinfo.dbname,
        zcbfid: self.curZcbfinfo.zcbfid
      }).then(r => {
        self.insertArchiveLog(r.data.length > 0 ? '检测未通过' : '检测通过', '提交归档检测')
        self.checking = false
        if (r.data.length > 0) {
          self.$refs.checkDia.show(r.data, function() {
            self.updateZcbfZT(192, '', '跳过继续提交', '提交归档') // 继续
          })
        } else {
          self.updateZcbfZT(192, '', '检测通过提交', '提交归档')
        }
      })
    },
    // 执行归档 doArchive
    doArchive(zt, dgzt, act) {
      const self = this
      this.$refs.signDia.show({
        identify: act,
        title: act,
        memo: true
      }, {
        memo: ''
      }, function(sender, identify, data) {
        self.updateZcbfZT(zt, dgzt, data.memo, act)
        sender.visible = false
      })
    }
  }
}
</script>
<style>
  .archives-tabs .el-tabs__content{
    height: calc(100% - 36px);
  }
</style>

<style lang="scss" scoped>
.content{
  height: calc(100% - 38px);
}
.table-icon {
  margin:0 1px;
  cursor: pointer;
}
</style>
