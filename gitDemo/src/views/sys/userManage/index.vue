<template>
  <div style="overflow: hidden;height: 100%">
    <div class="toolbar">
      <el-button type="primary" @click="editUser()">添加用户</el-button>
      <el-button type="primary" @click="userdogs()">用户设备管理</el-button>
      <el-button type="primary" @click="resetPassword()">重置密码</el-button>
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
        @current-change="currowChange"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
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

import UserEdit from './components/UserEdit.vue'
export default {
  name: 'UserManage',
  components: { UserEdit },
  props: [],
  data() {
    return {
      curRow: undefined,
      searchPara: {
        searchText: '',
        currentPage: 1, // 查询没用
        totle: 0, // 查询没用，查询后所有条数
        pageSize: 15,
        minRN: 1
      },
      tableData: [],
      tableColumns: [
        { field: 'username', label: '用户编号', width: 100 },
        { field: 'truename', label: '用户名称', width: 100 },
        { field: 'bm', label: '所属部门', width: 100 },
        { field: 'zw', label: '职务', width: 180 },
        { field: 'groupname', label: '角色', width: 180 },
        { field: 'edtUser', label: '编辑人' }
      ],
      zcCol: [{
        caption: '编辑',
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
      getApiData('sys.UserList', this.searchPara).then((r) => {
        this.tableData = r.data.rows
        this.searchPara.totle = r.data.total
      })
    },
    currowChange(currentRow, oldCurrentRow) {
      this.curRow = undefined
      this.curRow = currentRow
    },
    editUser(row) {
      this.$refs.UserEdit.show(row)
    },
    userdogs() {
      this.$router.push({ path: '/userdogs', query: { usercode: this.curRow.UserCode }})
    },
    resetPassword() {
      getApiData('resetpassword', {
        usercode: this.curRow.UserCode,
        passwordnew: '123456'
      }).then(() => {
        this.$message.success('密码已重置为 123456 建议用户登录后修改')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
