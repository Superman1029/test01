<template>
  <div style="width:100%;height:100%">
    <div class="toolbar">
      分类：
      <el-select v-model="qParams.modid" style="width: 90px" size="mini" @change="loadData(true)">
        <el-option
          v-for="item in qMods"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      类型：
      <el-select v-model="qParams.sFieldName" style="width: 105px" size="mini" @change="loadData()">
        <el-option
          v-for="item in qType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      状态：
      <el-select v-model="qParams.queryStatus" style="width: 80px" size="mini" @change="loadData()">
        <el-option
          v-for="item in qS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      项目角色：
      <el-select v-model="qParams.xmRole" style="width: 120px" size="mini" @change="loadData()">
        <el-option
          v-for="item in xmRoles"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-dropdown split-button type="primary" @click="exportExcel(false)">
        导出Q
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="exportExcel(false)">导出当前Q信息</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel(true)">导出全部Q信息</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <split-pane split="vertical" class="content" :default-percent="20">
      <template slot="paneL">
        <qTargetTree ref="qTargetTree" @targetChanged="targetChanged" />
      </template>
      <template slot="paneR">
        <qEditList ref="qEditList" :zcbf-users="zcbfUsers" />
      </template>
    </split-pane>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
import { exportQToExcel } from '@/api/export'
import qEditList from '@/views/sys/gq/components/qEditList'
import qTargetTree from '@/views/sys/gq/components/qTargetTree'

export default {
  name: 'GqNew',
  components: { qEditList, qTargetTree },
  props: {
  },
  data() {
    return {
      qParams: {
        modid: 'sjdg',
        dgnd: '', // 只有底稿类才有
        targetID: '',
        targetTitle: '',
        queryStatus: '', // Open Close
        xmRole: '', // 项目角色
        sFieldName: '' // 我回复的Q，我提的Q
      },
      qMods: [{ value: 'sjdg', label: '底稿类' }, { value: 'risk', label: '风险类' }],
      qS: [{ value: '', label: '全部' }, { value: 'Open', label: 'Open' }, { value: 'Close', label: 'Close' }],
      qType: [{ value: '', label: '全部' }, { value: 'Replier', label: '我回复的Q' }, { value: 'TrueName', label: '我提的Q' }],
      xmRoles: [{ value: '', label: '全部' },
        { value: '项目合伙人', label: '项目合伙人' },
        { value: '质量复核人', label: '质量复核人' },
        { value: '项目经理', label: '项目经理' },
        { value: '外勤主管', label: '外勤主管' },
        { value: '项目成员', label: '项目成员' }],
      zcbfUsers: [] // 组成部分成员列表
    }
  },
  computed: {
    ...mapGetters(['userinfo', 'curProject'])
  },
  watch: {
  },
  created() {},
  mounted() {
    if (!(this.curProject.dbname && this.curProject.zcbfid)) {
      this.$store.dispatch('common/changeProject', true)
    } else {
      if (this.$route.query.modid) this.qParams.modid = this.$route.query.modid
      if (this.$route.query.sFieldName) this.qParams.sFieldName = this.$route.query.sFieldName
      if (this.$route.query.queryStatus) this.qParams.queryStatus = this.$route.query.queryStatus
      if (this.$route.query.xmRole) this.qParams.xmRole = this.$route.query.xmRole
      this.loadData(true)
      getApiData('project.users', {
        zcbfid: this.curProject.zcbfid
      }).then(r => {
        this.zcbfUsers = r.data
      })
    }
  },
  methods: {
    // 左侧目标树切换时触发
    targetChanged(data) {
      this.qParams.dgnd = data.dgnd
      this.qParams.targetID = data.targetID
      this.qParams.targetTitle = data.targetTitle
      this.loadData(false)
    },
    // 加载数据，loadTarget 为 true 时刷洗左侧树
    loadData(loadTarget) {
      this.qParams.dbname = this.curProject.dbname
      this.qParams.projectid = this.curProject.projectid
      this.qParams.zcbfid = this.curProject.zcbfid
      this.qParams.stack_status = this.curProject.stack_status
      this.qParams.usercode = this.userinfo.usercode
      this.qParams.username = this.userinfo.username
      this.qParams.userRole = this.curProject.userRole
      if (loadTarget) this.$refs.qTargetTree.loadData(this.qParams) // 刷新目标树
      this.$refs.qEditList.loadData(this.qParams)
    },
    // 导出
    exportExcel(all) {
      const self = this
      this.$confirm('确定要导出当前信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (all) {
          exportQToExcel({
            dbname: self.qParams.dbname,
            projectid: self.qParams.projectid,
            zcbfid: self.qParams.zcbfid,
            modid: self.qParams.modid
          }, self.curProject.zcbfName + '.xlsx')
        } else {
          exportQToExcel(self.qParams, self.curProject.zcbfName + '.xlsx')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tiQDialog{
  .el-dialog__body {
    height: 500px;
    padding: 0 20px;
  }
}
.content{
  border-top: 1px solid #D4D4D4;
  height: calc(100% - 38px);
}
</style>
