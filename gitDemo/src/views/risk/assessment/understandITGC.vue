<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left" class="select-line">
        <span>应用程序</span>
        <el-select v-model="value1" placeholder="请选择" clearable @change="getITGCData">
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span>ITGC种类</span>
        <el-select v-model="value2" placeholder="请选择" clearable @change="getITGCData">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div slot="content">
        <el-scrollbar class="beauty-Scroll">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template slot="title">
                <span style="font-size: 16px;margin-right:100px">适用于选定应用程序和ITGC种类的ITGC</span>
                <!-- <div>
                  <el-button plain @click="itControlDia">由选定应用程序的应用程序控制和依赖IT的手工控制</el-button>
                </div> -->
              </template>
              <el-table :data="ITGCData" border fit stripe highlight-current-row style="width: 100%;">
                <el-table-column type="index" width="40" :index="$common.indexMethod" />
                <el-table-column prop="CompliantZcbf" label="组成部分" />
                <el-table-column prop="SoftwareName" label="应用程序" />
                <el-table-column prop="ITGCName" label="控制名称" />
                <el-table-column prop="ITGCType" label="ITGC种类" />
                <el-table-column prop="ITGCDesc" label="ITGC描述" />
                <el-table-column prop="Frequency" label="ITGC频率" />
                <el-table-column prop="Element" label="技术组成要素" />
                <el-table-column prop="DesignEvaluate" label="ITGC设计评价" />
                <el-table-column prop="ITGCTest" label="测试" />
                <el-table-column prop="RunEvaluate" label="ITGC运行评价" />
                <el-table-column prop="Executor" label="执行者" />
                <el-table-column prop="Deficiency" label="缺陷" />
                <el-table-column prop="Attatch" label="附件" />
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="2" title="穿行测试">
              <el-table :data="testtableData" border fit stripe highlight-current-row style="width: 100%;">
                <el-table-column type="index" width="40" :index="$common.indexMethod" />
                <el-table-column prop="CompliantZcbf" label="组成部分" />
                <el-table-column prop="SoftwareName" label="IT应用程序" />
                <el-table-column prop="WalkThroughConclu" label="穿行测试结论" />
                <el-table-column prop="Attatch" label="附件"/>
                <el-table-column prop="NewUser" label="测试执行人" show-overflow-tooltip />
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
      
    </risk-layout>
    <it-control-dia ref="itcontroldia" />
  </div>
</template>

<script>
import riskLayout from '@/views/risk/components/riskLayout'
import itControlDia from '@/views/risk/components/itControlDia'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'TR007',
  components: { riskLayout, itControlDia },
  data() {
    return {
      testtableData: [], // 穿行测试表格数据
      ITGCData: [], // 适用于选定应用程序和ITGC种类的ITGC
      activeNames: ['1', '2'],
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
  created() {},
  methods: {
    // 风险界面加载
    onloaded() {
      this.getSoftwareNameData()
      this.getITGCData()
    },
    // 适用于选定应用程序和ITGC种类的ITGC
    getITGCData() {
      getApiData('risk.ITGC', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        SoftwareCode: this.value1,
        ITGCType: this.value2
      }).then(res => {
        this.ITGCData = res.data
        this.testtableData = [] // 先清空
        if (this.ITGCData.length > 0) { // 了解ITGC 界面如果 适用于选定应用程序和ITGC种类的ITGC 没数据，不加载 穿行测试
          this.getTestTableData()
        }
      })
    },
    // 穿行测试
    getTestTableData() {
      getApiData('risk.ITSoftware_XM', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.testtableData = res.data
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
    // 由选定应用程序的应用程序控制和依赖IT的手工控制
    itControlDia() {
      this.$refs.itcontroldia.show()
      // console.log('由选定应用程序的应用程序控制和依赖IT的手工控制')
      // this.$common.stopProp(event)
    }
  }
}
</script>

<style lang="scss" scoped></style>
