<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left" class="select-line">
        <div slot="title-left" class="select-line">
          <span>重大账户/披露</span>
          <el-select v-model="value" placeholder="请选择" clearable  @change="getFlowInfoData">
            <el-option v-for="item in options" :key="item.value" :label="item.items" :value="item.itemscode"></el-option>
          </el-select>
          <!-- <span>交易类别/过程</span>
          <el-select v-model="value2" placeholder="请选择" clearable multiple  @change="getFlowInfoData">
            <el-option v-for="item in options2" :key="item.value" :label="item.ItemName" :value="item.ItemName"></el-option>
          </el-select> -->
        </div>
      </div>
      <div slot="content">
        <el-scrollbar class="beauty-Scroll">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" title="识别重大交易类别和重大披露流程以及相关的IT应用程序">
            <el-table v-show="isShow1" :data="flowinfoData" border fit stripe highlight-current-row style="width: 100%;">
              <el-table-column type="index" width="40" :index="$common.indexMethod"/>
              <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
              <el-table-column
                :filters="list"
                :filter-method="filterTag" 
                prop="ItemName" 
                label="重大交易流程"
              ></el-table-column>
              <el-table-column prop="SignificantReport" label="相关重大账户/披露"></el-table-column>
              <el-table-column prop="BusinessType" label="交易类别"></el-table-column>
              <el-table-column prop="Strategy" label="策略"></el-table-column>
              <el-table-column prop="Frequency" label="测试频率"></el-table-column>
              <el-table-column prop="SoftwareNames" label="相关IT应用程序"></el-table-column>
              <el-table-column prop="TranctSupplier" label="交易处理服务商"></el-table-column>
              <el-table-column prop="Attatch" label="附件"></el-table-column>
            </el-table>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="2" title="支持重大交易类别/过程或电子证据的应用程序">
            <el-table v-show="isShow2" :data="itSoftware_XMData" border fit stripe highlight-current-row style="width: 100%;">
              <el-table-column type="index" width="40" :index="$common.indexMethod"/>
              <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
              <el-table-column prop="SoftwareName" label="相关IT应用程序"></el-table-column>
              <el-table-column prop="SoftwareSupplier" label="数据中心数据提供商"></el-table-column>
              <el-table-column prop="Hardware" label="计算机硬件"></el-table-column>
              <el-table-column prop="OS" label="操作系统"></el-table-column>
              <el-table-column prop="SDatabase" label="数据库"></el-table-column>
              <el-table-column prop="Other" label="其他"></el-table-column>
              <el-table-column prop="DataCenterAddr" label="数据中心位置"></el-table-column>
              <el-table-column prop="MASource" label="管理变更-应用程序来源"></el-table-column>
              <el-table-column prop="MATools" label="管理变更-支持工具"></el-table-column>
              <el-table-column prop="LAPath" label="管理变更-逻辑存取路径"></el-table-column>
              <el-table-column prop="LATools" label="逻辑存取-支持工具"></el-table-column>
              <el-table-column prop="ITGCTools" label="其他ITGC-支持工具"></el-table-column>
              <el-table-column prop="IFTest" label="是否测试"></el-table-column>
              <el-table-column prop="Flows" label="相关交易类别/过程"></el-table-column>
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
  name: 'TR001',
  components: { riskLayout },
  data() {
    return {
      flowinfoData: [], // 重大交易类别和重大披露流程
      itSoftware_XMData: [], // 支持重大交易类别/过程和电子证据的应用程序
      isShow1: true,
      isShow2: true,
      activeNames: ['1', '2'],
      options: [],
      value: '',
      list: []
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {},
  methods: {
    // 风险界面加载
    onloaded() {
      this.getFlowInfoData()
      this.getITSoftware_XMData()
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
    // 重大交易类别和重大披露流程
    getFlowInfoData() {
      getApiData('risk.FlowInfo', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        itemscode: this.value
      }).then(res => {
        this.flowinfoData = res.data
        this.options2 = res.data
        this.list = []
        for (var i in res.data) {
          this.list.push({
            text: res.data[i].ItemName,
            value: res.data[i].ItemName
          })
        }
      })
    },
    // 支持重大交易类别/过程和电子证据的应用程序
    getITSoftware_XMData() {
      getApiData('risk.ITSoftware_XM', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.itSoftware_XMData = res.data
      })
    },
    filterTag(value, row) {
      return row.ItemName === value
    }
  }
}
</script>

<style lang="scss" scoped></style>
