<template>
  <div class="content">
    <el-form ref="form" :model="data" :rules="rules" label-width="80px" label-position="left" style="padding-top: 20px;">
      <el-form-item label="原密码" prop="passwordOld">
        <el-input v-model="data.passwordOld" placeholder="请输入原密码" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="data.password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="password1">
        <el-input v-model="data.password1" placeholder="请再输入一次密码" show-password />
      </el-form-item>
    </el-form>
    <el-button type="primary" style="float: right;" @click="submitForm()">确定</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
export default {
  name: 'ChangePassword',
  data() {
    return {
      data: {
        passwordOld: '',
        password: '',
        password1: ''
      },
      rules: {
        passwordOld: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur' }
        ],
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.data.password) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }}
          }
        ]
      }
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
  },
  methods: {
    submitForm() {
      const self = this
      self.$refs['form'].validate((valid) => {
        if (valid) {
          getApiData('resetpassword', {
            usercode: this.userinfo.usercode,
            passwordOld: self.data.passwordOld,
            passwordnew: self.data.password
          }).then(() => {
            self.$message.success('密码修改成功')
            this.$refs['form'].resetFields()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  width: 400px;
  margin: 0 auto;
}
</style>
