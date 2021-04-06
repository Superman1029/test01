<template>
  <div class="test-page">
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left" class="select-line">
        <span>执行穿行测试</span>
        <!-- <span>交易类别/过程</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>可能出错项</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>相关控制</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
      </div>
      <div slot="content">
        <el-scrollbar class="beauty-Scroll">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" title="执行穿行测试">
            <el-table v-show="isShow" :data="ctrlanderrorData" border fit stripe highlight-current-row style="width: 100%;">
              <el-table-column type="index" width="40" :index="$common.indexMethod"/>
              <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
              <el-table-column prop="ItemName" label="重大交易流程"></el-table-column>
              <el-table-column prop="ErrorName" label="可能出错项"></el-table-column>
              <el-table-column prop="Assertion" label="相关认定" show-overflow-tooltip></el-table-column>
              <el-table-column prop="CtrlName" label="控制"></el-table-column>
              <el-table-column prop="Frequency" label="频率"></el-table-column>
              <el-table-column prop="SoftwareName" label="相关IT应用程序"></el-table-column>
              <el-table-column prop="Executor" label="执行者"></el-table-column>
              <el-table-column prop="MemoDesc" label="备注及说明"></el-table-column>
              <el-table-column prop="DesignEvaluate" label="设计评价"></el-table-column>
              <el-table-column prop="RunEvaluate" label="运行评价"></el-table-column>
              <el-table-column prop="Deficiency" label="缺陷"></el-table-column>
              <el-table-column prop="Attatch" label="附件"></el-table-column>
              <el-table-column prop="ControlType" label="类型"></el-table-column>
            </el-table>
            </el-collapse-item>
          </el-collapse>
          <test-table :tableData="testtableData"></test-table>
        </el-scrollbar>
      </div>
    </risk-layout>
  </div>
</template>

<script>
import testTable from '@/views/risk/components/testTable'
import riskLayout from '@/views/risk/components/riskLayout'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'TR003',
  components: { riskLayout, testTable },
  data() {
    return {
      ctrlanderrorData: [], // 执行穿行测试
      testtableData: [], // 穿行测试表格数据
      isShow: true,
      activeNames: ['1'],
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
      this.getTestTableData()
      this.getCtrlAndErrorData()
    },
    // 执行穿行测试
    getCtrlAndErrorData() {
      getApiData('risk.CtrlAndError', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.ctrlanderrorData = res.data
      })
    },
    // 穿行测试
    getTestTableData() {
      getApiData('risk.ThroughTest', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.testtableData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .test-page {
    .select-line {
      margin: 10px 20px;
    }
  }
</style>
