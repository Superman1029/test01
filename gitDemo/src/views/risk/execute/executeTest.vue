<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left">
        提示：需要测试的控制点
      </div>
      <div slot="content">
        <el-table :data="riskFactorData" border fit stripe highlight-current-row style="width: 100%;" height="100%">
          <el-table-column type="index" width="40" :index="$common.indexMethod" />
          <el-table-column prop="syh" label="索引号" />
          <el-table-column prop="item" label="重大交易流程" />
          <el-table-column prop="conclusion" label="总体结论" />
        </el-table>
      </div>
    </risk-layout>
  </div>
</template>

<script>
import riskLayout from '@/views/risk/components/riskLayout'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'SP001',
  components: { riskLayout },
  data() {
    return {
      riskFactorData: [] // 审计风险因素的数据
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {

  },
  methods: {
    // 风险界面加载
    onloaded() {
      this.getAuditRiskFactor()
    },
    // 获取审计风险因素
    getAuditRiskFactor() {
      getApiData('risk.getConclusion', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.riskFactorData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
