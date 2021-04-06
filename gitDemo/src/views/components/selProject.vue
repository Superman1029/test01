<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="visible"
    width="1000px"
  >
    <div slot="title">
      <span>选择项目 </span>
      <el-input
        v-model="searchPara.searchText"
        placeholder="输入编号或名称搜索"
        size="mini"
        suffix-icon="el-icon-search"
        clearable
        style="width: 200px"
        @change="loadData(1)"
      />
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        fit
        stripe
        highlight-current-row
        height="400px"
        style="width: 100%"
        @current-change="currowChange"
        @row-dblclick="ok"
      >
        <el-table-column v-if="checkbox" type="selection" width="40" align="center" />
        <el-table-column
          v-for="col in tableColumns"
          :key="col.field"
          :prop="col.field"
          :label="col.label"
          :align="col.align"
          :width="col.width"
          :resizable="col.resizable || true"
          :fixed="col.fixed || false"
          :show-overflow-tooltip="col.showtip || true"
          :formatter="col.formatter"
        />
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-pagination
        style="float: left;"
        :current-page="searchPara.currentPage"
        :page-sizes="[10, 15, 30, 60, 100]"
        :page-size="searchPara.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchPara.totle"
        @size-change="(size)=>{
          searchPara.pageSize = size
          loadData(1)
        }"
        @current-change="(curPage)=>{
          searchPara.currentPage = curPage
          loadData()
        }"
      />
      <el-button type="primary" @click="ok(selectRow)">确 定</el-button>
      <el-button @click="visible=false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
/**
 * 事件 ok
 */
export default {
  name: 'SelProject',
  directives: { elDragDialog },
  props: {
    checkbox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableColumns: [
        { field: 'rn', label: '序号', width: 50, resizable: false, fixed: true },
        { field: 'sjxmbh', label: '编号', width: 150 },
        { field: 'sjxmmc', label: '项目名称' },
        { field: 'ssbm', label: '所属部门', width: 200 },
        { field: 'stack_status', label: '状态', width: 150,
          formatter: (r, c, v) => {
            return (v === 190 ? '未归档' : v === 192 ? '已提交归档' : v === 200 ? '已归档' : '未知')
          }
        }
      ],
      loading: false,
      searchPara: {
        searchText: '',
        pageSize: 10,
        currentPage: 1
      },
      visible: false,
      tableData: [],
      selectRow: undefined // 选择的项目信息
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {
  },
  methods: {
    show() {
      this.visible = true
      this.loadData(1)
    },
    loadData(curPage) { // 获取项目信息
      if (curPage) this.searchPara.currentPage = curPage
      this.loading = true
      this.searchPara.minRN = (this.searchPara.currentPage - 1) * this.searchPara.pageSize
      getApiData('pm.list', this.searchPara).then(r => {
        this.tableData = r.data.rows
        this.searchPara.totle = r.data.total
        this.loading = false
      })
    },
    // rowdblclick(row, column, event) {
    //   this.ok(row)
    // },
    // 选中当前行
    currowChange(currentRow, oldCurrentRow) {
      this.selectRow = currentRow
    },
    ok(projectinfo) {
      this.$emit('ok', projectinfo)
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
</style>
