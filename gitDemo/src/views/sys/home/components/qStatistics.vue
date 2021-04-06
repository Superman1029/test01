<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      size="mini"
      border
      stripe
      highlight-current-row
    >
      <el-table-column prop="StatuName" label="" />
      <el-table-column prop="QSum" label="提问" align="center">
        <template slot-scope="scope">
          <span class="qinfo" @click="openGQ('', scope.row.StatuName, '' )"> {{ scope.row.QSum }} 条 </span>
        </template>
      </el-table-column>
      <el-table-column prop="MyReplyNum" label="我需要回复的Q" align="center">
        <template slot-scope="scope">
          <span class="qinfo" @click="openGQ('Replier', scope.row.StatuName, '' )"> {{ scope.row.MyReplyNum }} 条 </span>
        </template>
      </el-table-column>
      <el-table-column prop="MyAskQNum" label="我提出的Q" align="center">
        <template slot-scope="scope">
          <span class="qinfo" @click="openGQ('TrueName', scope.row.StatuName, '' )"> {{ scope.row.MyAskQNum }} 条 </span>
        </template>
      </el-table-column>
      <el-table-column prop="HHRAskQNum" label="合伙人提的Q" align="center">
        <template slot-scope="scope">
          <span class="qinfo" @click="openGQ('', scope.row.StatuName, '项目合伙人' )"> {{ scope.row.HHRAskQNum }} 条 </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'

export default {
  props: { },
  data() {
    return {
      loading: false,
      data: [],
      curZcbfinfo: {}
    }
  },
  computed: {
    ...mapGetters(['userinfo', 'curProject'])
  },
  watch: {},
  created() {},
  methods: {
    // 加载数据
    loadData(zcbfInfo) {
      this.curZcbfinfo = zcbfInfo
      this.loading = true
      getApiData('nav.queryInfo', {
        dbname: zcbfInfo.dbname,
        zcbfid: zcbfInfo.zcbfid,
        usercode: this.userinfo.usercode
      }).then(r => {
        this.data = r.data
        this.loading = false
      })
    },
    // 打开Q信息
    openGQ(sFieldName, queryStatus, xmRole) {
      // console.log(sFieldName, queryStatus, xmRole)
      if (this.curZcbfinfo.zcbfid !== this.curProject.zcbfid) {
        this.$store.dispatch('common/changeCurProject', this.curZcbfinfo)
        this.$message.success('当前项目已切换到--' + this.curZcbfinfo.zcbfName)
      }
      if (queryStatus === '合计') queryStatus = ''
      this.$router.push({ path: '/gq', query: { modid: 'sjdg', sFieldName: sFieldName, queryStatus: queryStatus, xmRole: xmRole }})
    }
  }
}
</script>
<style lang="scss" scoped>
.qinfo{
  cursor:pointer;
  color: #2e92f7;
  text-decoration: underline;
}
</style>
