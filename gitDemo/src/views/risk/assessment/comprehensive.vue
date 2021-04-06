<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left">综合风险评估</div>
      <div slot="content">
        <el-scrollbar class="beauty-Scroll">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" title="综合风险评估">
              <el-table
                :data="RiskAssessmentData"
                ref="interfaceTable"
                v-loading="listLoading" 
                border
                fit
                stripe
                highlight-current-row
                @current-change="getCtrlAndErrorData"
                style="width: 100%;">
                <el-table-column type="index" width="40" :index="$common.indexMethod" />
                <el-table-column prop="RReportName" label="重大账户及披露"></el-table-column>
                <el-table-column label="可能发生重大错报的认定">
                  <el-table-column prop="RExistGY" label="存在/发生" align="center">
                    <template slot-scope="scope">
                      <i :class="scope.row.RExistGY=='0' ? 'el-icon-check': ''"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="RIntegralityGY" label="完整性" align="center">
                    <template slot-scope="scope">
                      <i :class="scope.row.RIntegralityGY=='0' ? 'el-icon-check': ''"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="RRightGY" label="权利与义务" align="center">
                    <template slot-scope="scope">
                      <i :class="scope.row.RRightGY=='0' ? 'el-icon-check': ''"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="RApportionGY" label="计价和分摊" align="center">
                    <template slot-scope="scope">
                      <i :class="scope.row.RApportionGY=='0' ? 'el-icon-check': ''"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="RPresentationGY" label="列报" align="center">
                    <template slot-scope="scope">
                      <i :class="scope.row.RPresentationGY=='0' ? 'el-icon-check': ''"></i>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="InhesionRisk" label="固有风险"></el-table-column>
                <el-table-column prop="ControlRisk" label="控制风险"></el-table-column>
                <el-table-column prop="BigWrongtRisk" label="综合风险"></el-table-column>
                <el-table-column prop="MaterialProgramIndex" label="风险因素相关的底稿索引号"></el-table-column>
                <el-table-column prop="ControlRiskReason" label="控制风险评估理由"></el-table-column>
                <el-table-column prop="InhesionRiskReason" label="固有风险评估理由"></el-table-column>
                <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
                <el-table-column prop="ProgramNameNew" label="拟实施的实质性程序" show-overflow-tooltip></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-row v-show="isShow2">
            <el-col :span="12">
              <el-collapse v-model="activeNames">
                 <el-collapse-item name="2" title="相关账户的可能出错项">
                    <el-table
                      :data="CtrlAndErrorData"
                      ref="connectTable"
                      border
                      fit
                      stripe
                      highlight-current-row
                      style="width: 100%;"
                      @current-change="getCtrlData"
                    >
                      <el-table-column type="index" width="40" :index="$common.indexMethod" />
                      <el-table-column prop="ItemName" label="重大交易流程"></el-table-column>
                      <el-table-column prop="ErrorName" label="可能出错项" show-overflow-tooltip></el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
            </el-col>
            <el-col :span="12">
              <el-collapse v-model="activeNames">
                <el-collapse-item name="3" title="相关控制">
                  <el-table
                    :data="RelatedCtrlData"
                    border
                    fit
                    stripe
                    highlight-current-row
                    style="width: 100%;"
                  >
                    <el-table-column type="index" width="40" :index="$common.indexMethod" />
                    <el-table-column prop="CtrlName" label="控制名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Frequency" label="频率"></el-table-column>
                    <el-table-column prop="ControlType" label="类型"></el-table-column>
                    <el-table-column prop="TotalEvaluate" label="总体ITGC评价"></el-table-column>
                    <el-table-column prop="DesignEvaluate" label="设计评价"></el-table-column>
                    <el-table-column prop="RunEvaluate" label="运行评价"></el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>       
          <el-collapse v-model="activeNames">
            <el-collapse-item name="4" title="风险结果汇总">
              <el-table
                v-show="isShow3"
                :data="riskResultData"
                border
                fit
                stripe
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column type="index" width="40" :index="$common.indexMethod" />
                <el-table-column prop="DocIndex" label="索引号"></el-table-column>
                <el-table-column prop="REvaluateOrigin" label="风险来源"></el-table-column>
                <el-table-column prop="stepname" label="来自哪一步骤"></el-table-column>
                <el-table-column label="风险因素">
                  <el-table-column prop="IfConclusion" label="类型"></el-table-column>
                  <el-table-column prop="RConclusion" label="描述"></el-table-column>
                </el-table-column>
                <el-table-column label="可能影响的报表项目">
                  <el-table-column prop="IfReportEffect" label="影响类型"></el-table-column>
                  <el-table-column prop="RReportName" label="报表项目"></el-table-column>
                </el-table-column>
                <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
                <el-table-column prop="RReportEffect" label="对财务报表的具体影响"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
    </risk-layout>
  </div>
</template>

<script>
import riskLayout from '@/views/risk/components/riskLayout'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'TR010',
  components: { riskLayout },
  data() {
    return {
      RiskAssessmentData: [],
      riskResultData: [],
      CtrlAndErrorData: [],
      RelatedCtrlData: [],
      isShow2: true,
      isShow3: true,
      activeNames: ['1', '2', '3', '4'],
      currentRow: {},
      currentRow2: {},
      listLoading: false
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {},
  methods: {
    // 风险界面加载
    onloaded() {
      this.getRiskAssessmentData()
      this.getriskResultData()
    },
    // 综合风险评估
    getRiskAssessmentData() {
      this.listLoading = true
      getApiData('risk.RiskAssessment', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then((res) => {
        this.RiskAssessmentData = res.data
        this.$nextTick(function() {
         this.$refs.interfaceTable.setCurrentRow(this.RiskAssessmentData[0])
        })
        this.listLoading = false
      })
    },
    // 相关账户的可能出错项
    getCtrlAndErrorData(currentRow, oldCurrentRow) {
      this.CtrlAndErrorData = []
      if (!this.currentRow) return
      getApiData('risk.CtrlAndError', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        RReportItem: currentRow.RReportItem
      }).then((res) => {
        this.CtrlAndErrorData = res.data
        this.$nextTick(function() {
         this.$refs.connectTable.setCurrentRow(this.CtrlAndErrorData[0])
       })
      })
    },
    // 相关控制
    getCtrlData(currentRow2, oldCurrentRow) {
      this.RelatedCtrlData = []
      if (!this.currentRow2) return
      getApiData('risk.CtrlAndError', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        RReportItem: currentRow2.RReportItem,
        MainFlowCode: currentRow2.MainFlowCode,
        ErrorCode: currentRow2.ErrorCode
      }).then((res) => {
        this.RelatedCtrlData = res.data
      })
    },
    // 风险结果汇总
    getriskResultData() {
      getApiData('risk.RiskResult', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then((res) => {
        this.riskResultData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>

<style lang="scss" >
.el-table .cell {
    white-space: pre-wrap;
}
</style>
