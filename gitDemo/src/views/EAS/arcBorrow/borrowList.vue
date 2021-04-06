<template>
  <div>
    <div class="toolbar">
      <el-button type="primary">申请</el-button>
      <el-input
        v-model="searchText"
        class="searchText"
        placeholder="输入名称查找"
        size="mini"
        prefix-icon="el-icon-search"
        clearable
        @change="loaddgTree()"
      />
    </div>
    <el-table
      :data="tableData"
      border
      highlight-current-row
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
    <!-- <el-pagination
      style="float: right;"
      :current-page="params.pageNumber"
      :page-sizes="[15, 30, 60, 100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.totle"
      @size-change="function(size){
        params.pageSize = size
        loadData()
      }"
      @current-change="function(curPage){
        loadData(null, curPage)
      }"
    /> -->
  </div>
</template>

<script>
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'BorrowList',
  components: { },
  props: [],
  data() {
    return {
      searchText: '',
      tableData: [],
      tableColumns: [
        { field: 'BorrowType', label: '借阅类型', width: 100,
          formatter: function(row, column, cellValue) {
            return (cellValue === 1 ? '电子版' : '纸质版')
          } },
        { field: 'ApplyLimit', label: '申请期限', width: 80, align: 'right',
          formatter: (r, c, v) => {
            return v + '(天)'
          } },
        { field: 'BillStatus', label: '状态', width: 100, align: 'center',
          formatter: (r, c, v) => {
            return (v < 0 ? '作废' : v < 1 ? '暂存' : v < 2 ? '审批中' : '已授权')
          } },
        { field: 'Borrowers', label: '借阅人', width: 180 },
        { field: 'EditUser', label: '申请人', width: 180 },
        { field: 'EditDate', label: '申请时间', width: 180 },
        { field: 'Memo', label: '备注' }
      ],
      zcCol: [{
        caption: '编辑',
        icon: 'el-icon-edit',
        click: (index, row) => {
          console.log(row)
        }
      },
      {
        caption: '删除',
        click: (index, row) => {
          console.log(row)
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
      getApiData('arc.borrowList1', {}).then((r) => {
        this.tableData = r.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
