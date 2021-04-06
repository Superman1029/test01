<template>
  <split-pane split="vertical" :default-percent="20">
    <template slot="paneL">
      <orgTree @nodeClick="nodeClick" />
    </template>
    <template slot="paneR">
      <div class="content">
        <div class="toolbar">
          <el-button type="primary" @click="openAuthDialog()">批量授权</el-button>
          <el-button type="primary" @click="cancelAuth()">批量取消授权</el-button>
          <el-button type="primary" @click="viewAuth()">查看授权</el-button>
          <div class="rightItem">
            用户类型:
            <el-select
              v-model="searchPara.kinds"
              style="width:80px;"
              placeholder="类型"
              clearable
              @change="loadUserData()"
            >
              <el-option label="正式" value="official" />
              <el-option label="临时" value="casual" />
            </el-select>
            是否在职:
            <el-select
              v-model="searchPara.isStop"
              style="width:80px;"
              placeholder="范围"
              clearable
              @change="loadUserData()"
            >
              <el-option label="离职" value="1" />
              <el-option label="在职" value="0" />
            </el-select>
            <el-input
              v-model="searchPara.searchText"
              style="width: 150px"
              placeholder="输入名称查找"
              prefix-icon="el-icon-search"
              clearable
              @change="loadUserData()"
            />
          </div>
        </div>
        <div class="table">
          <el-table
            ref="userTable"
            :data="userData"
            border
            stripe
            highlight-current-row
            height="100%"
            @row-dblclick="rowDblClick"
            @current-change="currowChange"
          >
            <el-table-column type="selection" width="35" />
            <el-table-column prop="rn" label="序号" width="50" />
            <el-table-column prop="usercode" label="用户编号" width="100" />
            <el-table-column prop="username" label="姓名" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.username }}<el-tag v-if="scope.row.usercode.substr(0,2)==='sx'" class="sxTag" type="warning">实习生</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="zw" label="职务" width="150" />
            <el-table-column
              prop="kinds"
              label="类型"
              width="60"
              :formatter="function(row, column, cellValue, index){
                if (cellValue === 'official') return '正式'
                if (cellValue === 'casual') return '临时'
              }"
            />
            <el-table-column prop="bm" label="部门" width="180" />
            <el-table-column prop="isStop" label="离职" width="65">
              <template slot-scope="scope">
                <!-- <el-tag :type="scope.row.isStop ? 'primary' : 'danger'"></el-tag> -->
                <el-switch v-model="scope.row.isStop" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="auths" label="授权" width="220" show-overflow-tooltip />
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
            loadUserData()
          }"
          @current-change="(curPage)=>{
            searchPara.currentPage = curPage
            loadUserData()
          }"
        />
      </div>
      <el-scrollbar class="rightPane border">
        <licenseInfo ref="licenseinfo" />
        <el-divider />
        <el-row>
          <el-col :span="24" style="text-align: center;">
            <el-avatar :size="60" style="font-size: 20px;">{{ authInfo.shortName }}</el-avatar>
          </el-col>
        </el-row>
        <el-row v-show="authInfo.usercode">
          <el-col :span="24">
            {{ authInfo.usercode }} ( {{ authInfo.username }} )
            <el-tag v-show="authInfo.usercode && authInfo.usercode.substr(0,2) === 'sx'" type="warning">实习生</el-tag>
            <el-tag v-show="authInfo.isStop && authInfo.isStop" type="danger">已离职</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">{{ authInfo.bm }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">{{ authInfo.zw }}</el-col>
        </el-row>
        <el-table :data="userLicense">
          <el-table-column prop="Products" label="授权产品" width="210">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" :true-label="1" :false-label="0" @change="userProductsChange(scope.row)">{{ scope.row.LicenseName }}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="DueDate" label="有效期" width="140">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.DueDate" :disabled="scope.row.checked===0" type="date" placeholder="永久" value-format="yyyy-MM-dd" style="width: 130px" :clearable="false" @change="DueDateChange(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="23">
            <el-button type="primary" style="float: right;" :disabled="!authInfo.usercode" @click="onSubmit">保存</el-button>
          </el-col>
        </el-row>
      </el-scrollbar>
      <!--  -->
      <authDig ref="authDig" />
    </template>
  </split-pane>
</template>

<script>
import { mapGetters } from 'vuex'
import orgTree from '@/views/sys/productLicense/components/orgTree'
import licenseInfo from '@/views/sys/productLicense/components/licenseInfo'
import authDig from '@/views/sys/productLicense/components/authDig'
import { getApiData, updateTable } from '@/api/common'
import { utils } from '@/utils'

export default {
  name: 'ProductLicense',
  components: { orgTree, licenseInfo, authDig },
  props: [],
  data() {
    return {
      loading: false,
      searchPara: {
        currentPage: 1, // 查询没用
        totle: 0, // 查询没用，查询后所有条数
        pageSize: 15,
        minRN: 1
      },
      userData: [], // 用户列表
      userLicense: [], // 当前用户已授权许可证列表
      authInfo: {
        usercode: ''
      } // 当前选择的用户授权信息
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.$refs.licenseinfo.loadLicenseCnt()
  },
  methods: {
    // 判断数组 a 是否包含 b  包含返回 true
    isInclude(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false
      if (a.length < b.length) return false
      var aStr = a.toString()
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) === -1) return false
      }
      return true
    },
    // 加载当前用户授权产品列表
    loadUserLicense(usercode) {
      getApiData('sys.UserLicense', {
        usercode: usercode,
        rules: usercode.substr(0, 2) === 'sx' ? 'sx' : 'zs'
      }).then(r => {
        for (var i = 0, len = r.data.length; i < len; i++) {
          // 计算出默认的有效期
          if (!r.data[i].DueDate) r.data[i].DueDate = r.data[i].MaxDueDate
        }
        this.userLicense = r.data
      })
    },
    // 加载用户列表
    loadUserData() {
      this.authInfo = {}
      this.userLicense = []
      this.loading = true
      this.searchPara.minRN = (this.searchPara.currentPage - 1) * this.searchPara.pageSize
      getApiData('sys.authUser', this.searchPara).then(r => {
        this.userData = r.data
        this.searchPara.totle = r.data[0].tc
        this.loading = false
      })
    },
    // 选择 单位
    nodeClick(node) {
      this.searchPara.bmcode = node.fcode
      this.loadUserData()
    },
    // 用户列表当前行 选中
    currowChange(currentRow, oldCurrentRow) {
      this.$refs.userTable.clearSelection()
      this.$refs.userTable.toggleRowSelection(currentRow)
    },
    // 双击行 执行查看用户授权
    rowDblClick(row, column, event) {
      this.authInfo = Object.assign({ shortName: row.username.substr(row.username.length - 2) }, row)
      this.loadUserLicense(this.authInfo.usercode)
    },
    // 查看用户授权
    viewAuth() {
      const rows = this.$refs.userTable.store.states.selection
      if (rows.length <= 0) return
      this.authInfo = Object.assign({ shortName: rows[0].username.substr(rows[0].username.length - 2) }, rows[0])
      this.loadUserLicense(this.authInfo.usercode)
    },
    // 选择产品 后触发
    userProductsChange(row) {
      // console.log(row)
      if ((row.checked === 1) && (row.surplus <= 0)) {
        this.$message.warning('产品剩余授权数量不足，请联系友数聚增购')
        row.checked = 0
      }
    },
    // 有效日期校验
    DueDateChange(row) {
      // console.log(row)
      if (!row.DueDate || (row.DueDate > row.MaxDueDate)) {
        row.DueDate = row.MaxDueDate
        this.$message.warning('产品授权日期不能为空，且不能大于 ' + row.MaxDueDate)
      }
    },
    // 打开批量授权对话框
    openAuthDialog() {
      const rows = this.$refs.userTable.store.states.selection
      if (rows.length <= 0) {
        this.$message.error('请至少选择一项')
        return
      }
      var userKind = rows[0].kinds
      const users = []
      for (let i = 0, len = rows.length; i < len; i++) {
        if (userKind !== rows[i].kinds) {
          this.$message.error('请选择同一种 类型 的人员')
          return
        }
        users.push({
          usercode: rows[i].usercode,
          username: rows[i].username
        })
      }
      this.$refs.authDig.show(users, userKind)
    },
    cancelAuth() {
      const rows = this.$refs.userTable.store.states.selection
      const data = []
      for (var i = 0, len = rows.length; i < len; i++) {
        data.push({
          rowState: 'delete',
          UserCode: rows[i].usercode,
          AuthType: 1
        })
      }
      this.$confirm('此操作将所选用户全部撤销授权, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateTable('sys_UserLicense', ['UserCode', 'AuthType'], data).then(r => {
          this.$message.success('撤销成功')
          this.$refs.licenseinfo.loadLicenseCnt()
        })
      })
    },
    // 保存
    onSubmit() {
      var data = []
      data.push({
        rowState: 'delete',
        UserCode: this.authInfo.usercode
      })
      for (var i = 0, len = this.userLicense.length; i < len; i++) {
        if (this.userLicense[i].checked === 0) continue
        // 如果 所选产品 未包含 在License中，不保存，主要是因为中间 变更 license 中的 Products时会导致
        data.push({
          rowState: 'insert',
          UserCode: this.authInfo.usercode,
          LicenseID: this.userLicense[i].LicenseID,
          LicenseName: this.userLicense[i].LicenseName,
          DueDate: this.userLicense[i].DueDate,
          AuthType: 1,
          EditUser: this.userinfo.username,
          EditDate: utils.getNowDate(),
          Memo: '人工分配'
        })
      }
      // console.log(data)
      updateTable('sys_UserLicense', ['UserCode'], data).then(r => {
        this.$message.success('保存成功')
        this.$refs.licenseinfo.loadLicenseCnt()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  height: 100%;
  width: calc(100% - 380px);
  float: left;
  .table{
    height: calc(100% - 35px - 35px);
  }
}
.rightPane{
  height: 100%;
  width: 380px;
  float: right;
  padding: 10px 0px 10px 10px;;
  .el-divider--horizontal{
    margin: 10px 0;
  }
  .el-row{
    font-size: 14px;
    padding: 5px;
  }
}
.sxTag{
  height: 16px;
  padding: 0 1px;
  line-height: 15px;
}

</style>
