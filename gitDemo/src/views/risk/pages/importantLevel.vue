<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left">
        <svg-icon class="icon-size" icon-class="loudspeaker" />
        <span>重要性水平</span>
      </div>
      <div slot="content">
        <el-scrollbar class="beauty-Scroll">
          <div class="page">
            <div class="title">
              <span>重要性水平</span>
              <div class="right">
                <span style="margin-right: 80px;">执行人： {{auditStepsData.performuser}}  </span>
                <span>执行时间：{{auditStepsData.performdate}} </span>
              </div>
            </div>
            <div class="content">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="1" title="一、财务报表整体重要性水平计量基础的考虑"><!--(点击此处查看参考基准和比例) -->
              <table>
                <tr><td style="width: 200px;">基础项目</td><td>{{materialityData.benchmarks}}</td></tr>
                <tr><td style="width: 200px;">采用该基础确定整体重要性时考虑因素</td><td>{{materialityData.benchmarksby}}</td></tr>
              </table>
                </el-collapse-item>
              </el-collapse>
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="2"><!--(点击此处查看计算提示)-->
                <template  slot="title">
                <span style="font-size: 16px;margin-right:100px">二、财务报表整体的重要性（重要性水平 PM）</span>
                <div>
                  是否提取报表数据
                  <el-select disabled  v-model="isExtract" style="width: 70px;">
                    <el-option key="是" label="是" value="是"></el-option>
                    <el-option key="否" label="否" value="否"></el-option>
                  </el-select>
                </div>
                </template>
                <table>
                <tr><td style="width: 200px;">基础项目</td><td colspan="3">{{materialityData.benchmarks}}</td></tr>
                <tr><td style="width: 200px;">基础金额</td><td colspan="3"  style="text-align:right;">{{reportvalue}}</td></tr>
                <tr><td style="width: 200px;">参考比例</td><td>{{benchmarksData.refpercent}}</td><td style="width: 200px;">适用比率（%）</td><td style="text-align:right;">{{benchmarksData.usepercent+"%"}}</td></tr>
                <tr><td style="width: 200px;">计算数值</td><td colspan="3" style="text-align:right;">{{materialityvalue}}</td></tr>
                <tr><td style="width: 200px;">最终确定的整体重要性金额（取整数）</td><td colspan="3" style="text-align:right;">{{wholemateriality}}</td></tr>
                <tr><td style="width: 200px;">定性因素对整体重要性水平的影响</td><td colspan="3">{{materialityData.refpercentby}}</td></tr>
              </table>
                </el-collapse-item>
              </el-collapse>
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="3"><!--(点击此处查看提示)class="head" -->
                <template slot="title" ><span style="font-size: 16px;">三、实际执行的重要性（可容忍误差 TE）</span></template>
              <table>
                <tr><td style="width: 200px;">实际执行的重要性百分比</td><td style="text-align:right;">{{materialityData.actpercent+"%"}}</td><td style="width: 200px;">计算数值</td><td style="text-align:right;">{{autoactmateriality}}</td></tr>
                <tr><td style="width: 200px;">集团分配实际执行的重要性</td><td colspan="3" style="text-align:right;">{{groupassignact}}</td></tr>
                <tr><td style="width: 200px;">最终确定的实际执行的重要性金额（取整数）</td><td colspan="3" style="text-align:right;">{{actmateriality}}</td></tr>
                <tr><td style="width: 200px;">考虑因素</td><td colspan="3">{{materialityData.actpercentby}}</td></tr>
              </table>
                </el-collapse-item>
              </el-collapse>
              <el-collapse v-model="activeNames" @change="handleChange">
               <el-collapse-item name="4">
                 <template slot="title" ><span style="font-size: 16px;">四、特定类别的交易、账户余额或披露的重要性</span></template>
              <table>
                <tr><td style="width: 700px;">是否存在特定类别的交易、账户余额或披露，其发生的错报金额虽然低于财务报表整体的重要性，但合理预期可能会影响财务报表使用者依据财务报表作出的经济决策？</td>
                  <td><el-radio-group disabled  v-model="existence" style="display: flex;justify-content: space-evenly;">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group></td></tr>
                <tr><td style="width: 200px;" colspan="2">
                  <span>如是，完成以下内容：</span>
                  <!-- <div style="float: right;">
                    <el-button plain>增加一行</el-button>
                    <el-button plain>删除一行</el-button>
                    <el-button plain>删除所有行</el-button>
                  </div> -->
                  <el-table :data="significantData" border fit stripe highlight-current-row style="width: 100%;margin-top: 15px;">
                    <el-table-column prop="tradeaccount" label="特定类别的交易、账户余额或披露"></el-table-column>
                    <el-table-column prop="itemname" label="报表项目(如适用)"></el-table-column>
                    <el-table-column :formatter="dateFormat" prop="materialityvalue" label="确定的重要性水平" align="right"></el-table-column>
                    <el-table-column :formatter="dateFormat" prop="actmaterialityvalue" label="确定的实际执行的重要性水平" align="right"></el-table-column>
                    <el-table-column prop="factors" label="考虑因素"></el-table-column>
                  </el-table>
                </td></tr>
              </table>
              </el-collapse-item>
              </el-collapse>
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="5"><!--(适用比例1% - 5%) -->
                <template slot="title" ><span style="font-size: 16px;">五、未更正错报名义金额的确定</span></template>
                  <table>
                    <tr><td style="width: 200px;">适用比例</td><td style="text-align:right;">{{materialityData.trivalpercent+"%"}}</td><td style="width: 200px;">计算数值</td><td style="text-align:right;">{{autotrivalvalue}}</td></tr>
                    <tr><td style="width: 200px;">最终确定的未更正错报名义金额（取整数）</td><td colspan="3" style="text-align:right;">{{trivalvalue}}</td></tr>
                    <tr><td style="width: 200px;">考虑因素</td><td colspan="3">{{materialityData.trivalpercentby}}</td></tr>
                  </table>
               </el-collapse-item>
              </el-collapse>
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="6">
                  <template slot="title" ><span style="font-size: 16px;margin-right:100px">六、修改重要性</span>
                  <div style="display: flex;justify-content: space-between;align-items: center;float:right;">
                     <div>
                    确定重要性水平是否适当
                    <el-select disabled  v-model="isFit" style="width: 70px;">
                      <el-option key="是" label="是" value="是"></el-option>
                      <el-option key="否" label="否" value="否"></el-option>
                    </el-select>
                    <!-- <el-button plain>修改重要性</el-button> -->
                     </div>
                   </div>
                  </template>
              <div>
               <span>1、审计过程中对重要性水平的修改</span>
               <el-table :data="materiality" border fit stripe highlight-current-row style="width: 100%;margin: 15px 0;">
                <el-table-column type="index" width="40" :index="$common.indexMethod"/>
                <el-table-column :formatter="dateFormat" prop="modiwholemateriality" label="修改后的财务报表整体的重要性" align="right"></el-table-column>
                <el-table-column :formatter="dateFormat" prop="modiactmateriality" label="修改后的财务报表整体的实际执行的重要性" align="right"></el-table-column>
                <el-table-column :formatter="dateFormat" prop="moditrivalvalue" label="修改后的未更正错报名义金额" align="right"></el-table-column>
                <el-table-column prop="modiwholematerialitydesc" label="说明"></el-table-column>
               </el-table>
               <span>2、修改特定类别的交易、账户余额或披露的重要性</span>
               <el-table :data="significantData" border fit stripe highlight-current-row style="width: 100%;margin: 15px 0;">
                <el-table-column type="index" width="40" :index="$common.indexMethod"/>
                <el-table-column prop="tradeaccount" label="交易、账户余额或披露"></el-table-column>
                <el-table-column prop="itemname" label="报表项目(如适用)"></el-table-column>
                <el-table-column :formatter="dateFormat" prop="modifymateriality" label="修改后的特定类别的交易、账户余额或披露的重要性" align="right"></el-table-column>
                <el-table-column :formatter="dateFormat" prop="modifyactmateriality" label="修改后的特定类别的交易、账户余额或披露的实际执行的重要性" align="right"></el-table-column>
                <el-table-column prop="modifactors" label="说明"></el-table-column>
               </el-table>
               <span>3、修改重要性对之前确定的进一步审计程序的性质、时间安排和范围的影响</span>
               <table style="width: 100%;margin: 15px 0;">
                <tr><td>当修改后的财务报表整体重要性低于实际执行的重要性时必须补充审计证据。例如：扩大样本量、执行进一步的实质性分析程序、执行追加的细节测试程序。</td></tr>
                <tr><td>{{materialityData.auditevidence}}</td></tr>
               </table>
              </div>
                </el-collapse-item>
              </el-collapse>
             <el-collapse v-model="activeNames" @change="handleChange">
               <el-collapse-item name="7">
                 <template slot="title" ><span style="font-size: 16px;margin-right:100px">七、按审定数重新计算重要性</span>
                 <!-- <div>
                  <el-button plain>提取审定数</el-button>
                </div> -->
                 </template>
              <el-table :data="materiality" border fit stripe highlight-current-row style="width: 100%;margin-top: 15px;">
                <el-table-column label="初步确定的重要性">
                  <el-table-column :formatter="dateFormat" align="right" prop="wholemateriality" label="财务整体重要性"></el-table-column>
                  <el-table-column :formatter="dateFormat" align="right" prop="actmateriality" label="实际执行的重要性"></el-table-column>
                  <el-table-column :formatter="dateFormat" align="right" prop="trivalvalue" label="未更正名义错报金额"></el-table-column>
                </el-table-column>
                <el-table-column label="修改后的重要性">
                  <el-table-column :formatter="dateFormat" align="right" prop="modiwholemateriality" label="财务整体重要性"></el-table-column>
                  <el-table-column :formatter="dateFormat" align="right" prop="modiactmateriality" label="实际执行的重要性"></el-table-column>
                  <el-table-column :formatter="dateFormat" align="right" prop="moditrivalvalue" label="未更正名义错报金额"></el-table-column>
                </el-table-column>
                <el-table-column label="按审定数重新计算重要性">
                  <el-table-column :formatter="dateFormat" align="right" prop="sdwholemateriality" label="财务整体重要性"></el-table-column>
                  <el-table-column :formatter="dateFormat" align="right" prop="sdactmateriality" label="实际执行的重要性"></el-table-column>
                  <el-table-column :formatter="dateFormat" align="right" prop="notcorrectmis" label="未更正名义错报金额"></el-table-column>
                </el-table-column>
              </el-table>
                <table>
                 <tr><td>{{materialityData.suffdesc}}</td></tr>
                </table>
               </el-collapse-item>
             </el-collapse>
             <div>
             </div>
            </div>
          </div>
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
  name: 'PR006',
  components: { riskLayout },
  data() {
    return {
      materiality: [],
      materialityData: [],
      benchmarksData: [],
      significantData: [],
      auditStepsData: [],
      significantitemsData: [],
      isExtract: '', // 是否提取报表数据
      existence: '', // 四中的单选框
      isFit: '', // 六中是否适合的下拉选择
      isShow1: true,
      isShow2: true,
      activeNames: ['1', '2', '3', '4', '5', '6', '7'],
      reportvalue: '',
      materialityvalue: '',
      wholemateriality: '',
      autoactmateriality: '',
      groupassignact: '',
      actmateriality: '',
      autotrivalvalue: '',
      trivalvalue: ''
    }
  },
  computed: {
    ...mapGetters(['curProject', 'userinfo'])
  },
  created() {},
  methods: {
    // 风险界面加载
    onloaded() {
      this.getmaterialityData()
      this.getBenchmarksData()
      this.getSignificantitemsData()
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
    getmaterialityData() {
      getApiData('risk.materiality', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.materialityData = res.data[0]
        this.isExtract = res.data[0].isreportdata
        this.existence = res.data[0].isaffect
        this.isFit = res.data[0].ispropriety
        this.materiality = res.data
        this.actmateriality = comdify(res.data[0].actmateriality)
        this.wholemateriality = comdify(res.data[0].wholemateriality)
        this.autoactmateriality = comdify(res.data[0].autoactmateriality)
        this.groupassignact = comdify(res.data[0].groupassignact)
        this.autotrivalvalue = comdify(res.data[0].autotrivalvalue)
        this.trivalvalue = comdify(res.data[0].trivalvalue)
      })
    },
    getBenchmarksData() {
      getApiData('risk.materiality_benchmarks', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.benchmarksData = res.data[0]
        this.reportvalue = comdify(res.data[0].reportvalue)
        this.materialityvalue = comdify(res.data[0].materialityvalue)


      })
    },
    getSignificantitemsData() {
      getApiData('risk.significantitems', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name
      }).then(res => {
        this.significantData = res.data
        this.significantitemsData = res.data[0]
      })
    },
    handleChange(val) {
      console.log(val)
    },
    dateFormat(row, column, cellValue) {
      return cellValue ? comdify(cellValue) : ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .page {
    border: 1px solid #ccc;
    width: 1000px;
    margin: 0 auto;

    .title {
      padding: 10px 30px;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      font-weight: bold;

      .right {
        font-size: 16px;
        font-weight: initial;
      }
    }

    .content {
      padding: 10px 50px;

      .head {
        font-weight: bold;
        margin-right: 20px;
        padding: 10px 0;
        display: inline-block;
      }

      .head-second {
        font-weight: bold;
        font-size: 14px;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      table, td, th {
        border: 1px solid #ccc;
      }

      td {
        padding: 5px;
      }
    }
  }
</style>

<style lang="scss">
  .el-collapse-item__header {
    font-size: 16px !important;
  }
  .el-input__inner {
    height: 30px;
  }
</style>

