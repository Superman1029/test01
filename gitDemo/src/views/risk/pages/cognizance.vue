<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left">
        识别重大账户和披露以及相关认定
      </div>
      <div slot="content" class="cont-main">
        <el-scrollbar class="beauty-Scroll">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="报表风险评估分析性程序" name="first">
              <el-table :data="riskFactorData" border fit stripe highlight-current-row style="width: 100%;">
                <el-table-column type="index" width="40" :index="$common.indexMethod" />
                <el-table-column prop="DocIndex" label="索引号" />
                <el-table-column prop="REvaluateOrigin" label="风险因素" />
                <el-table-column label="风险结论">
                  <el-table-column prop="IfConclusion" label="结论类型" />
                  <el-table-column prop="RConclusion" label="结论描述" />
                </el-table-column>
                <el-table-column label="可能影响的报表项目">
                  <el-table-column prop="IfReportEffect" label="影响类型" />
                  <el-table-column prop="RReportName" label="报表项目" />
                </el-table-column>
                <el-table-column prop="RReportEffect" label="对财务报表的具体影响" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="重大账户及认定和重大流程评估" name="second">
              <div class="toolbar">
                <span class="sp">报表截止日/期间：{{ wholeMaterialityData.xmqjs }}至{{ wholeMaterialityData.xmqje }}</span>
                <span class="sp">PM:{{ wholeMaterialityData.wholemateriality }}</span>
                <span class="sp">TE:{{ wholeMaterialityData.materiality }}</span>
                <span class="sp">提示：需先确定重要性水平</span>
                <el-checkbox v-model="checked" class="sp" @change="getReportAnalyse">无数据不显示</el-checkbox>
                <span class="sp1">执行人：{{ auditStepsData.performuser }}</span>
                <span class="sp1">执行日期：{{ auditStepsData.performdate }}</span>
              </div>
              <el-tabs tab-position="left" type="card" @tab-click="handleClick">
                <el-tab-pane label="资产负债表">
                  <el-table :data="reportanalyseData" border fit stripe highlight-current-row style="width: 100%;">
                    <el-table-column type="index" width="40" :index="$common.indexMethod" />
                    <el-table-column prop="items" label="项目" />
                    <el-table-column :formatter="dateFormat" align="right" prop="nm" label="当前未审" />
                    <el-table-column label="重大账户的识别">
                      <el-table-column prop="jeimportdes" label="金额重大（>=TE为正值）" />
                      <el-table-column prop="significantwrong" label="有无重大错报风险" />
                      <el-table-column prop="acctype" label="识别重大账户" />
                      <el-table-column prop="nosignificantacccause" label="解释说明" />
                    </el-table-column>
                    <el-table-column label="可能发生重大错报的认定（针对重大账户）">
                      <el-table-column prop="CExist" label="存在/发生" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CExist=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="CIntegrality" label="完整性" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CIntegrality=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="CRight" label="权利与义务" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CRight=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="CApportion" label="计价和分摊" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CApportion=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="CPresentation" label="列报" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CPresentation=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column prop="flow" label="涉及的重大交易流程（针对重大账户）" />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="利润表">
                  <el-table :data="reportanalyseData" border fit stripe highlight-current-row style="width: 100%;">
                    <el-table-column type="index" width="40" :index="$common.indexMethod" />
                    <el-table-column prop="items" label="项目" />
                    <el-table-column :formatter="dateFormat" align="right" prop="nm" label="当前未审" />
                    <el-table-column label="重大账户的识别">
                      <el-table-column prop="jeimportdes" label="金额重大（>=TE为正值）" />
                      <el-table-column prop="significantwrong" label="有无重大错报风险" />
                      <el-table-column prop="acctype" label="识别重大账户" />
                      <el-table-column prop="nosignificantacccause" label="解释说明" />
                    </el-table-column>
                    <el-table-column label="可能发生重大错报的认定（针对重大账户）">
                      <el-table-column prop="CExist" label="存在/发生" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CExist=='0' ? 'el-icon-check' : ''" />
                        </template></el-table-column>
                      <el-table-column prop="CIntegrality" label="完整性" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CIntegrality=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="CRight" label="权利与义务" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CRight=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="CApportion" label="计价和分摊" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CApportion=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="CPresentation" label="列报" align="center">
                        <template slot-scope="scope">
                          <i :class="scope.row.CPresentation=='0' ? 'el-icon-check' : ''" />
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column prop="flow" label="设计的重大交易流程（针对重大账户）" />
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </div>
    </risk-layout>
  </div>
</template>

<script>
import riskLayout from '@/views/risk/components/riskLayout'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'
import { comdify } from '@/utils/index.js'

export default {
  name: 'PR007',
  components: { riskLayout },
  data() {
    return {
      bbmc: '资产负债表', // 资产负债表或者是利润表
      checked: true,
      riskFactorData: [], // 审计风险因素的数据
      reportanalyseData: [], // 重大账户及认定和重大流程评估
      wholeMaterialityData: [],
      auditStepsData: [],
      activeName: 'first' // 选中的tab的名称
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
      this.getReportAnalyse()
      this.getWholeMateriality()
      this.getAuditStepsData()
    },
    getAuditStepsData() {
      getApiData('risk.AuditSteps', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.auditStepsData = res.data[0]
      })
    },
    // 获取审计风险因素
    getAuditRiskFactor() {
      getApiData('risk.auditRiskFactor', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.riskFactorData = res.data
      })
    },
    getWholeMateriality() {
      const self = this
      getApiData('risk.wholeMateriality', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        self.wholeMaterialityData = res.data[0]
        getApiData('risk.GetReportPeriod', {
          dbname: self.curProject.dbname,
          zcbfid: self.curProject.zcbfid
        }).then(res => {
          self.wholeMaterialityData.xmqjs = res.data[0].xmqjs
          self.wholeMaterialityData.xmqje = res.data[0].xmqje
        })
      })
    },
    // 重大账户及认定和重大流程评估
    getReportAnalyse() {
      getApiData('risk.reportanalyse ', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        data_id: this.curProject.sjnd,
        bbmc: this.bbmc,
        checked: this.checked
      }).then(res => {
        this.reportanalyseData = res.data
      })
    },
    handleClick(tab, event) {
      if (tab.paneName === '0') {
        this.bbmc = '资产负债表'
        this.getReportAnalyse()
      } else {
        this.bbmc = '利润表'
        this.getReportAnalyse()
      }
    },
    dateFormat(row, column, cellValue) {
      return cellValue ? comdify(cellValue) : ''
    }
  }
}
</script>
<style>
  .cont-main .el-tabs--left .el-tabs__item {
    width: 35px;
    white-space: normal !important;
    height: auto !important;
    padding: 12px 7px !important;
  }
</style>
<style lang="scss" scoped>
  .content-title {
    width: 100%;
    padding: 0 10px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      span {
        margin-left: 10px;
        min-width: 100px;
        display: inline-block;
      }
    }
  }
  .sp {
    margin-right: 30px;
  }
  .sp1 {
    margin-right: 35px;
    float:right;
  }
</style>

<style lang="scss" >
.el-table .cell {
    white-space: pre-wrap;
}
</style>
