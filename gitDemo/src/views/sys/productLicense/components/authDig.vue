<template>
  <div>
    <el-dialog
      title="批量授权"
      :visible.sync="visible"
      :append-to-body="true"
      width="800px"
      @opened="()=>{this.$refs.userTable.toggleAllSelection()}"
    >
      <div style="height: 400px;">
        <div class="left">
          <el-table ref="userTable" :data="userList" border stripe height="100%" @selection-change="(sels)=>{selCnt=sels.length}">
            <el-table-column type="selection" width="35" />
            <el-table-column property="usercode" label="用户编号" width="150" />
            <el-table-column property="username" label="姓名" />
          </el-table>
        </div>
        <div class="right">
          <el-form :model="curLicense" label-width="120px">
            <el-form-item label="产品许可">
              <el-select v-model="curLicense.LicenseID" placeholder="请选择" @change="licenseChange">
                <el-option
                  v-for="item in licenseList"
                  :key="item.LicenseID"
                  :label="item.LicenseName"
                  :value="item.LicenseID"
                >
                  <span style="float: left">{{ item.LicenseName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">剩余({{ item.surplus }})</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="授权日期">
              <el-date-picker
                v-model="curLicense.DueDate"
                type="date"
                placeholder="选择日期"
                @change="DueDateChange"
              />
            </el-form-item>
            <el-form-item label="许可剩余">
              {{ curLicense.surplus }} 个
            </el-form-item>
            <el-form-item label="已选用户">
              {{ selCnt }} 个
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ok()">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData, updateTable } from '@/api/common'
import { utils } from '@/utils'

export default {
  props: {},
  data() {
    return {
      visible: false,
      selCnt: 0, // 当前选择的用户数
      curLicense: {},
      userList: [],
      licenseList: []
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {},
  methods: {
    show(users, userKind) {
      this.userList = users
      this.loadLicensList(userKind)
      this.visible = true
      // this.$refs.userTable.toggleAllSelection()
    },
    loadLicensList(userKind) {
      getApiData('sys.UserLicense', {
        usercode: '-1',
        rules: userKind === 'official' ? 'zs' : 'sx'
      }).then(r => {
        for (var i = 0, len = r.data.length; i < len; i++) {
          // 计算出默认的有效期
          if (!r.data[i].DueDate) r.data[i].DueDate = r.data[i].MaxDueDate
        }
        this.licenseList = r.data
        this.curLicense = Object.assign({}, this.licenseList[0])
      })
    },
    // 选择当前License时
    licenseChange(v) {
      const item = this.licenseList.find((item) => item.LicenseID === v)
      this.curLicense = Object.assign({}, item)
    },
    DueDateChange() {
      console.log(this.curLicense.DueDate)
      if (!this.curLicense.DueDate || (this.curLicense.DueDate > this.curLicense.MaxDueDate)) {
        this.curLicense.DueDate = this.curLicense.MaxDueDate
        this.$message.warning('产品授权日期不能为空，且不能大于 ' + this.curLicense.MaxDueDate)
      }
    },
    ok() {
      var data = []
      const rows = this.$refs.userTable.store.states.selection
      if (rows.length <= 0) {
        this.$message.error('请至少选择一个用户')
        return
      }
      if (rows.length > this.curLicense.surplus) {
        this.$message.error('所选用户超过 许可剩余 数量，请取消部分选择')
        return
      }
      for (let i = 0, len = rows.length; i < len; i++) {
        data.push({
          rowState: 'delete',
          UserCode: rows[i].usercode,
          LicenseID: this.curLicense.LicenseID
        })
        // 如果 所选产品 未包含 在License中，不保存，主要是因为中间 变更 license 中的 Products时会导致
        data.push({
          rowState: 'insert',
          UserCode: rows[i].usercode,
          LicenseID: this.curLicense.LicenseID,
          LicenseName: this.curLicense.LicenseName,
          DueDate: this.curLicense.DueDate,
          AuthType: 1,
          EditUser: this.userinfo.username,
          EditDate: utils.getNowDate(),
          Memo: '人工分配-批量'
        })
      }
      // console.log(data)
      updateTable('sys_UserLicense', ['UserCode', 'LicenseID'], data).then(r => {
        this.$message.success('保存成功')
        this.visible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin: 20px;
}
.left {
  float: left;
  width: calc(50% - 2px);
  height: 400px;
}
.right {
  float: right;
  width: calc(50% - 2px);
  height: 400px;
}
.row {
  height: 40px;
  padding: 10px;
}
.el-date-editor.el-input {
  width: 100%;
}
</style>
