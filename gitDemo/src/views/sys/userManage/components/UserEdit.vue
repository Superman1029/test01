<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :append-to-body="true"
      width="800px"
    >
      <div style="height: 400px;">
        <el-form :model="user" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="编号" prop="username">
                <el-input v-model="user.username" style="width: 100%" placeholder="手机号/编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名" prop="truename">
                <el-input v-model="user.truename" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="性别">
            <el-radio-group v-model="user.sex">
              <el-radio :label="'1'">男</el-radio>
              <el-radio :label="'2'">女</el-radio>
              <el-radio :label="'0'">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="部门" prop="bm">
            <el-input v-model="user.bm" />
          </el-form-item>
          <el-form-item label="职务" prop="zw">
            <el-input v-model="user.zw" />
          </el-form-item>
          <el-form-item label="角色" prop="groupname">
            <el-input v-model="user.groupname" />
          </el-form-item>
          <el-form-item label="停用" prop="isStop">
            <el-switch v-model="user.isStop" />
          </el-form-item>
        </el-form>
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
import { updateTable } from '@/api/common'
import { date } from '@/utils/index'

export default {
  props: {},
  data() {
    return {
      visible: false,
      title: '增加用户',
      user: {}
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {},
  methods: {
    show(user) {
      this.user = user || {}
      this.title = user ? '用户编辑' : '增加用户'
      this.user.rowState = user ? 'update' : 'insert'
      this.visible = true
    },
    ok() {
      var data = {}
      data.rowState = this.user.rowState
      if (data.rowState === 'update') {
        data.id = this.user.id
      } else {
        data.userpassword = '202cb962ac59075b964b07152d234b70' // 密码默认123
      }
      data.username = this.user.username
      data.usercode = this.user.username
      data.truename = this.user.truename
      data.sex = this.user.sex
      data.bm = this.user.bm
      data.zw = this.user.zw
      data.groupname = this.user.groupname
      data.isStop = this.user.isStop
      data.edtUser = this.userinfo.username
      data.edtdate = date.now()
      updateTable('sjuser', ['id'], [data]).then(r => {
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

</style>
