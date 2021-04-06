<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left">
        设计实质性程序
      </div>
      <div slot="content">
        <but-tree ref="butTree" @clickAccountType="getCongnizaneTierRiskData" />
        <el-scrollbar class="beauty-Scroll">
          <el-table :data="CongnizaneTierRiskData" border fit stripe @row-click="getErrorAndFlowData">
            <el-table-column prop="RReportName" label="认定" />
            <el-table-column prop="InhesionRisk" label="固有风险" />
            <el-table-column prop="ControlRisk" label="控制风险" />
            <el-table-column prop="BigWrongtRisk" label="综合风险" />
          </el-table>
          <el-table ref="connectTable" :data="ErrorAndFlowData" border fit stripe style="width: 100%">
            <el-table-column prop="ItemName" label="重大交易流程" />
            <el-table-column prop="RiskName" label="可能出错项" />
          </el-table>
          <el-table :data="RelatedProgramData" border fit stripe style="width: 100%;">
            <el-table-column type="index" width="40" :index="$common.indexMethod" />
            <el-table-column prop="CompliantZcbf" label="组成部分" />
            <el-table-column prop="ProgramAssertion" label="认定" />
            <el-table-column prop="ProgramName" label="程序名称" />
            <el-table-column prop="ProgramProperty" label="程序性质" />
            <el-table-column prop="ErroType" label="错报种类" />
            <el-table-column prop="ProTypeNew" label="审计程序要求" />
            <el-table-column prop="SpecifiedProgram" label="适用于特定项目的程序" />
            <el-table-column prop="EditDate" label="编辑时间" />
          </el-table>
        </el-scrollbar>
      </div>
    </risk-layout>
  </div>
</template>

<script>
import butTree from '@/views/risk/components/butTree'
import riskLayout from '@/views/risk/components/riskLayout'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'
import { common } from '@/utils/common'

export default {
  name: 'TR013',
  components: { riskLayout, butTree },
  data() {
    return {
      filterStr: '',
      treeData: [],
      ErrorAndFlowData: [],
      CongnizaneTierRiskData: [],
      RelatedProgramData: [],
      checked: false
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  mounted() {
  },
  created() {
  },
  methods: {
    // 风险界面加载
    onloaded() {
      this.$refs.butTree.getAccountTypeData('1')
    },
    // 识别风险
    getCongnizaneTierRiskData(itemscode, id) {
      getApiData('risk.CongnizaneTierRisk ', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        itemscode: itemscode
      }).then(res => {
        this.CongnizaneTierRiskData = res.data
      })
      getApiData('risk.RelatedProgram', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        id: id
      }).then(res => {
        this.RelatedProgramData = res.data
      })
      getApiData('risk.ErrorAndFlow', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        itemscode: itemscode
      }).then(res => {
        this.ErrorAndFlowData = res.data
      })
    },
    // 可能出错项
    getErrorAndFlowData(row) {
      const index = row.RReportName.lastIndexOf('-')
      this.filterStr = index > 0 ? row.RReportName.slice(index + 1) : ''
      getApiData('risk.ErrorAndFlow', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        itemscode: row.RReportItem
      }).then(res => {
        this.ErrorAndFlowData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.beauty-Scroll{
  float: right;
  width: calc(100% - 250px);
}
</style>
