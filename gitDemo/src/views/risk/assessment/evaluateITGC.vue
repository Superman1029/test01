<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left">
        评价ITGC
      </div>
      <div slot="content">
        <el-scrollbar class="beauty-Scroll">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" title="评价ITGC">
              <el-table 
              :data="itSoftware_XMData" 
              ref="interfaceTable"
              v-loading="listLoading" 
              border 
              fit 
              stripe 
              highlight-current-row 
              style="width: 100%;" 
              @current-change="loadITGCData">
                <el-table-column type="index" width="40" :index="$common.indexMethod"/>
                <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
                <el-table-column prop="SoftwareName" label="应用程序"></el-table-column>
                <el-table-column label="按ITGC种类进行评价">
                  <el-table-column prop="ManageAlter" label="管理变更"></el-table-column>
                  <el-table-column prop="LogicalAccess" label="逻辑存取"></el-table-column>
                  <el-table-column prop="OtherITGC" label="其他ITGC"></el-table-column>
                </el-table-column>
                <el-table-column prop="TotalEvaluate" label="IT的手工控制和应用程序控制的ITGC总体评价"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="2" title="IT的手工控制和应用程序控制的ITGC总体评价">
              <el-table :data="ctrlAndErrorData" border fit stripe highlight-current-row style="width: 100%;">
                <el-table-column type="index" width="40" :index="$common.indexMethod"/>
                <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
                <el-table-column prop="CtrlName" label="控制名称"></el-table-column>
                <el-table-column prop="IsTest" label="测试" align="center">
                  <template slot-scope="scope">
                    <i :class="scope.row.IsTest=='1' ? 'el-icon-check': ''"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="RunEvaluate" label="运行评价"></el-table-column>
                <el-table-column prop="ControlType" label="类型"></el-table-column>
                <el-table-column prop="SoftwareName" label="相关应用程序"></el-table-column>
                <el-table-column prop="TotalEvaluate" label="总体ITGC评价"></el-table-column>
                <el-table-column prop="Deficiency" label="缺陷"></el-table-column>
                <el-table-column prop="Attatch" label="附件"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="3" title="适用于的ITGC">
              <el-table :data="evaluateITGCData" border fit stripe highlight-current-row style="width: 100%;">
                <el-table-column type="index" width="40" :index="$common.indexMethod"/>
                <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
                <el-table-column prop="ITGCName" label="ITGC"></el-table-column>
                <el-table-column prop="ITGCDesc" label="ITGC描述"></el-table-column>
                <el-table-column prop="Element" label="技术组成要素"></el-table-column>
                <el-table-column prop="ITGCType" label="相关ITGC种类"></el-table-column>
                <el-table-column prop="DesignEvaluate" label="设计评价"></el-table-column>
                <el-table-column prop="ITGCTest" label="测试"></el-table-column>
                <el-table-column prop="RunEvaluate" label="ITGC运行评价"></el-table-column>
                <el-table-column prop="Deficiency" label="缺陷"></el-table-column>
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
  name: 'TR009',
  components: { riskLayout },
  data() {
    return {
      evaluateITGCData:[], // 评价ITGC表格数据
      itSoftware_XMData: [],
      ctrlAndErrorData: [],
      activeNames: ['1', '2', '3'],
      currentRow: {},
      listLoading: false
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {
  },
  mounted() {},
  methods: {
    // 风险界面加载
    onloaded() {
      this.getITSoftware_XMData()
    },
    // 评价ITGC
    getITSoftware_XMData() {
      this.listLoading = true
      getApiData('risk.ITSoftware_XM', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.itSoftware_XMData = res.data
        this.listLoading = false
      })
    },
    // 适用于的ITGC
    loadITGCData(currentRow, oldCurrentRow) {
      this.currentRow = currentRow
      this.evaluateITGCData = []
      this.ctrlAndErrorData = []
      if (!this.currentRow) return

      getApiData('risk.ITGC', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        SoftwareCode: this.currentRow.SoftwareCode
      }).then(res => {
        this.evaluateITGCData = res.data
      })
      getApiData('risk.CtrlAndError', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        SoftwareName: this.currentRow.SoftwareName
      }).then(res => {
        this.ctrlAndErrorData = res.data
      })
    }
  },
  watch: {
     itSoftware_XMData(val) {
       this.$nextTick(function() {
         this.$refs.interfaceTable.setCurrentRow(this.itSoftware_XMData[0])
      })
     }
  }
}
</script>

<style lang="scss" scoped></style>
<style lang="scss">
  .el-collapse-item__header {
    font-size: 16px !important;
    height: 35px;
  }
</style>
