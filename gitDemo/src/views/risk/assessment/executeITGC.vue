<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left" class="select-line">
        <span>应用程序</span>
        <el-select v-model="value1" placeholder="请选择" clearable  @change="getITGCData">
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <span>ITGC种类</span>
        <el-select v-model="value2" placeholder="请选择" clearable @change="getITGCData">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div slot="content">
        <el-scrollbar class="beauty-Scroll">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="设置ITGC测试" name="first">
              <el-table :data="ITGCData" border stripe highlight-current-row style="width: 100%;">
                <el-table-column type="index" width="40" :index="$common.indexMethod"/>
                <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
                <el-table-column prop="SoftwareName" label="应用程序" width="100"></el-table-column>
                <el-table-column prop="ITGCName" label="ITGC"></el-table-column>
                <el-table-column prop="ITGCType" label="ITGC种类"></el-table-column>
                <el-table-column prop="Program" label="审计程序"></el-table-column>
                <el-table-column prop="TimeScope" label="性质、时间和范围"></el-table-column>
                <el-table-column prop="Attatch" label="附件"></el-table-column>
                <el-table-column prop="TestUser" label="测试者"></el-table-column>
                <el-table-column :formatter="dateFormat" prop="TestDate" label="执行时间"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="执行ITGC测试" name="second">
              <el-table :data="ITGCData" border stripe highlight-current-row style="width: 100%;">
                <el-table-column type="index" width="40" :index="$common.indexMethod"/>
                <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
                <el-table-column prop="SoftwareName" label="应用程序" width="100"></el-table-column>
                <el-table-column prop="ITGCName" label="ITGC"></el-table-column>
                <el-table-column prop="ITGCType" label="ITGC种类"></el-table-column>
                <el-table-column prop="Program" label="审计程序"></el-table-column>
                <el-table-column prop="TimeScope" label="性质、时间和范围"></el-table-column>
                <el-table-column prop="TestUser" label="测试者"></el-table-column>
                <el-table-column prop="Attatch" label="附件"></el-table-column>
                <el-table-column prop="opinion" label="意见"></el-table-column>
                <el-table-column :formatter="dateFormat" prop="TestDate" label="执行时间"></el-table-column>
              </el-table>
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
import { parseTime } from '@/utils/index.js'

export default {
  name: 'TR008',
  components: { riskLayout },
  data() {
    return {
      activeName: 'first',
      data: '',
      ITGCData: [], // 适用于选定应用程序和ITGC种类的ITGC
      options1: [],
      options2: [{
        value: '管理变更',
        label: '管理变更'
      }, {
        value: '逻辑存取',
        label: '逻辑存取'
      }, {
        value: '其他ITGC',
        label: '其他ITGC'
      }],
      value1: '',
      value2: ''
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
      this.getITGCData()
      this.getSoftwareNameData()
    },
    // 设计和执行ITGC
    getITGCData() {
      getApiData('risk.ITGC', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        SoftwareCode: this.value1,
        ITGCType: this.value2
      }).then(res => {
        this.ITGCData = res.data
      })
    },
    getSoftwareNameData() {
      getApiData('risk.SoftwareName', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.options1 = res.data
      })
    },
    dateFormat(row, column, cellValue) {
      return cellValue ? parseTime(new Date(cellValue), '{y}-{m}-{d}') : ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
