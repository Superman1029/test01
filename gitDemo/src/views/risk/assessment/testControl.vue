<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left" class="select-line">
        <span>选择拟测试的控制</span>
        <!-- <span>重大账户/披露</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.items" :value="item.itemscode"></el-option>
        </el-select> -->
        <!-- <span>交易类别/过程</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>可能出错项</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>相关认定</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
      </div>
      <div slot="content">
        <el-table :data="TestControlData" border stripe highlight-current-row style="width: 100%;" height="100%">
          <el-table-column type="index" width="40" :index="$common.indexMethod"/>
          <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
          <el-table-column prop="ItemName" label="重大交易流程" width="100"></el-table-column>
          <el-table-column prop="ErrorName" label="可能出错项"></el-table-column>
          <el-table-column prop="Assertion" label="相关认定" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CtrlName" label="控制"></el-table-column>
          <el-table-column prop="Frequency" label="频率"></el-table-column>
          <el-table-column prop="ControlType" label="类型"></el-table-column>
          <el-table-column prop="Executor" label="执行者"></el-table-column>
          <el-table-column prop="MemoDesc" label="备注及说明"></el-table-column>
          <el-table-column prop="Attatch" label="附件"></el-table-column>
          <el-table-column prop="SoftwareName" label="相关IT应用程序"></el-table-column>
          <el-table-column prop="TotalEvaluate" label="总体ITGC评价"></el-table-column>
          <el-table-column prop="DesignEvaluate" label="设计评价"></el-table-column>
          <el-table-column prop="RunEvaluate" label="运行评价"></el-table-column>
          <el-table-column prop="IsTest" label="测试" align="center">
            <template slot-scope="scope">
              <i :class="scope.row.IsTest=='1' ? 'el-icon-check': ''"></i>
            </template>
          </el-table-column>
          <el-table-column prop="RunEvaluateReason" label="适用选定控制的运行评价基本理由"></el-table-column>
          <el-table-column prop="TestUser" label="测试者"></el-table-column>
          <el-table-column prop="Deficiency" label="缺陷"></el-table-column>
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
  name: 'TR006',
  components: { riskLayout },
  data() {
    return {
      TestControlData: [], // 选择拟测试的控制
      options: [],
      value: ''
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {},
  methods: {
    // 风险界面加载
    onloaded() {
      this.getTestControlData()
      this.getflowInfoConditionData()
    },
    getflowInfoConditionData() {
      getApiData('risk.flowInfoCondition', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.options = res.data
      })
    },
     // 选择拟测试的控制
    getTestControlData() {
      getApiData('risk.CtrlAndError', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        itemscode: this.value
      }).then(res => {
        this.TestControlData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
