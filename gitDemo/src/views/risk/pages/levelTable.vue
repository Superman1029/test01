<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left">
        <svg-icon class="icon-size" icon-class="loudspeaker" />
        <span>相关风险</span>
      </div>
      <div slot="content">
        <level-table :table-data="riskFactorData" />
      </div>
    </risk-layout>
  </div>
</template>

<script>
import levelTable from '@/views/risk/components/levelTable'
import riskLayout from '@/views/risk/components/riskLayout'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'LevelTable',
  components: { levelTable, riskLayout },
  data() {
    return {
      riskFactorData: [] // 审计风险因素的数据
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {},
  methods: {
    // 风险界面加载
    onloaded() {
      this.getAuditRiskFactor()
    },
    // 获取审计风险因素
    getAuditRiskFactor() {
      getApiData('risk.auditRiskFactor ', {
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
