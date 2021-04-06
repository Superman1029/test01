<template>
  <div class="difference-page">
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left" class="select-line">
        <span style="width: 150px;">年度</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
      </div>
      <div slot="content">
        <el-scrollbar class="beauty-Scroll">
          <el-row class="title">
            <el-col :span="20">
              <span>未更正错报咨询下限：{{ titleData.v1 }}</span>
              <span>未更正错报名义金额: {{ titleData.v2 }}</span>
              <span>财务报表整体重要性水平：{{ titleData.v3 }}</span>
            </el-col>
            <el-col :span="4">
              <el-input v-model="input" size="mini" placeholder="请输入内容" prefix-icon="el-icon-search" />
            </el-col>
          </el-row>
          <el-table v-show="isShow" :data="tableData" border fit stripe highlight-current-row style="width: 100%;">
            <el-table-column type="index" width="40" :index="$common.indexMethod"/>
            <el-table-column prop="CORRECTSTATE" label="错报状态"></el-table-column>
            <el-table-column prop="MisName" label="类型"></el-table-column>
            <el-table-column prop="TZGJ" label="错报期间"></el-table-column>
            <el-table-column prop="DGSYH" label="工作底稿索引"></el-table-column>
            <el-table-column prop="ItemName" label="报表项目"></el-table-column>
            <el-table-column prop="LDZC" label="流动资产"></el-table-column>
            <el-table-column prop="FLDZC" label="非流动资产"></el-table-column>
            <el-table-column prop="LDFZ" label="流动负债"></el-table-column>
            <el-table-column prop="FLDFZ" label="非流动负债"></el-table-column>
            <el-table-column prop="WNSY" label="影响本期损益"></el-table-column>
            <el-table-column prop="BNSY" label="不影响本期所得税"></el-table-column>
            <el-table-column prop="FWQSDS" label="影响往期损益"></el-table-column>
            <el-table-column prop="FBQSDS" label="不影响往期所得税"></el-table-column>
            <el-table-column prop="OTHER" label="其他"></el-table-column>
            <el-table-column prop="OtherInfo" label="其他说明"></el-table-column>
          </el-table>
          <table style="width: 1000px;">
            <tr>
              <th>差异影响汇总分析</th>
              <th>流动资产</th>
              <th>非流动资产</th>
              <th>流动负债</th>
              <th>非流动负债</th>
              <th>影响本期损益</th>
              <th>影响往期损益</th>
              <th>其他</th>
            </tr>
            <tr><td>对资产负债表影响金额汇总</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td>财务报表金额</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td>未更正错误对财务报表的金额的影响</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td>未更正错误对随迁利润总额的影响</td>
              <td colspan="4" style="text-align:center;">点击检查分录是否借贷平衡</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td>不影响所得税的事项（用"X"标示）</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td>减：按当期适用税率计算的所得税影响金额</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td>考虑回转影响之前的未更正错报的累计影响</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td rowspan="2">上期未更正错报（税后）回转影响</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td>考虑回转影响之后的未更正错报的累计影响</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
            <tr><td>本年净利润</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
              <td>0.00</td>
            </tr>
          </table>
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
  name: 'CR001',
  components: { riskLayout },
  data() {
    return {
      tableData: [], // 表格中渲染的数据
      titleData: {
        v1: comdify(100000),
        v2: comdify(2345617),
        v3: comdify(20009871)
      },
      isShow: true,
      options: [],
      value: '',
      input1: '',
      input2: '',
      input: ''
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {},
  methods: {
    // 风险界面加载
    onloaded() {
      this.getYearData()
    },
    getYearData() {
      getApiData('risk.getYear', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.options = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  height: 30px;
  padding: 4px;
  span{
    line-height: 30px;
    font-size: 18px;
    margin-right: 24px;
  }
}
  .difference-page {
    .select-line {
      margin: 10px 20px;

      .search-item {
        display: inline-block;

      }
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 10px 0;
    }

    table, td, th {
      border: 1px solid #ccc;
    }

    td, th {
      padding: 5px;
    }
  }
</style>
