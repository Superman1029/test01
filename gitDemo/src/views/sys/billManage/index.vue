<template>
  <div style="overflow: hidden;height: 100%">
    <div class="toolbar">
      <el-radio-group v-model="searchPara.payState" @change="loadData">
        <el-radio-button :label="0">全部</el-radio-button>
        <el-radio-button :label="1">已支付</el-radio-button>
        <el-radio-button :label="2">未支付</el-radio-button>
        <el-radio-button :label="3">已过期</el-radio-button>
      </el-radio-group>
      <el-input
        v-model="searchPara.searchText"
        class="searchText"
        placeholder="输入名称查找"
        size="mini"
        prefix-icon="el-icon-search"
        clearable
        @change="loadData()"
      />
    </div>
    <div style="height: calc(100% - 75px)">
      <el-table
        :data="tableData"
        border
        fit
        stripe
        highlight-current-row
        height="100%"
        style="width: 100%"
      >
        <el-table-column fixed :resizable="false" label="序号" type="index" width="50" align="center" />
        <el-table-column
          v-for="col in tableColumns"
          :key="col.field"
          :prop="col.field"
          :label="col.label"
          :align="col.align"
          :width="col.width"
          :show-overflow-tooltip="col.showtip || true"
          :formatter="col.formatter"
        />
        <el-table-column :fixed="'right'" label="操作" width="80" align="center">
          <template slot-scope="scope" style="padding:0;">
            <el-button
              v-for="btn in zcCol"
              :key="btn.caption"
              size="mini"
              type="text"
              style="padding: 0 !important;"
              :icon="btn.icon"
              @click="btn.click(scope.$index, scope.row)"
            >{{ btn.caption }} </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      style="float: right;"
      :current-page="searchPara.currentPage"
      :page-sizes="[15, 30, 60, 100]"
      :page-size="searchPara.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchPara.totle"
      @size-change="(size)=>{
        searchPara.pageSize = size
        loadData()
      }"
      @current-change="(curPage)=>{
        searchPara.currentPage = curPage
        loadData()
      }"
    />
    <user-edit ref="UserEdit" />
  </div>
</template>

<script>
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'BillManage',
  components: { },
  props: [],
  data() {
    return {
      searchPara: {
        payState: '0',
        searchText: '',
        currentPage: 1, // 查询没用
        totle: 0, // 查询没用，查询后所有条数
        pageSize: 15,
        minRN: 0
      },
      tableData: [],
      tableColumns: [
        { field: 'UserName', label: '用户编号', width: 100 },
        { field: 'TrueName', label: '用户名称', width: 100 },
        { field: 'ProductDesc', label: '购买产品', width: 100 },
        { field: 'OrderMoney', label: '金额', width: 100 },
        { field: 'EditDate', label: '购买时间', width: 180 },
        { field: 'Memo', label: '备注' }
      ],
      zcCol: [{
        caption: '删除',
        icon: 'el-icon-edit',
        click: (index, row) => {
          this.editUser(row)
        }
      }]
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.searchPara.minRN = (this.searchPara.currentPage - 1) * this.searchPara.pageSize
      getApiData('pay.OrderBill', this.searchPara).then((r) => {
        this.tableData = r.data.rows
        this.searchPara.totle = r.data.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
