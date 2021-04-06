/* eslint-disable vue/require-v-for-key */
<template>
  <el-popover
    placement="bottom"
    width="260"
    trigger="click"
  >
    <div class="signGroup">
      <span>编制人签署：</span>
      <span class="sign" @click="signCommand('bzr')">签名</span>
      <el-divider />
    </div>
    <div v-for="(item) in signData" v-if="item.signType === 'bzr'" :key="item.signType" class="signItem">
      <span>{{ item.signName }} ({{ item.signDate }})</span>
      <span v-if="item.signName === userinfo.username" class="canenSign" @click="signCommand('bzr', true)">取消</span>
    </div>
    <div class="signGroup">
      <span>复核人签署：</span>
      <span class="sign" @click="signCommand('fhr')">签名</span>
      <el-divider />
    </div>
    <div v-for="(item) in signData" v-if="item.signType === 'fhr'" class="signItem">
      <span>{{ item.signName }} ({{ item.signDate }})</span>
      <span v-if="item.signName === userinfo.username" class="canenSign" @click="signCommand('fhr', true)">取消</span>
    </div>
    <span slot="reference">
      <svg-icon icon-class="sign" />
    </span>

    <!-- <el-button slot="reference" type="primary" icon="el-icon-edit">签</el-button> -->
    <sign-dia ref="signDia" @ok="signDiaOK" />
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
import { getNowTime } from '@/utils'
import signDia from '@/views/components/signDia'
export default {
  components: { signDia },
  props: {},
  data() {
    return {
      stepcode: '',
      signData: []
    }
  },
  computed: {
    ...mapGetters(['curProject', 'userinfo'])
  },
  created() {},
  methods: {
    // 获取签名信息
    getSign(stepcode) {
      this.stepcode = stepcode
      getApiData('pub.getSignInfo', {
        modid: 'risk',
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        targetID: stepcode
      }).then(res => {
        this.signData = res.data
      })
    },
    // 从signData中获取是否包含当前用户
    hasSign(username) {
      for (let i = 0, len = this.signData.length; i < len; i++) {
        if (this.signData[i].signName === username) {
          return true
        }
      }
    },
    // 签名 cmd bzr fhr cancel=true 表示取消签名
    signCommand(cmd, cancel) {
      if (!this.curProject.zcbfid) {
        this.$message.warning('请先选择组成部分')
        return
      }
      if (cancel) {
        this.sign(false, cmd, this.userinfo.username, '')
      } else {
        if (this.hasSign(this.userinfo.username)) {
          this.$message({
            message: '您已签署过，不能重复签署',
            type: 'error'
          })
          return
        }
        this.$refs.signDia.show({
          identify: cmd,
          title: cmd === 'bzr' ? '编制人签署' : '复核人签署',
          nameEnable: false,
          memo: false
        }, {
          name: this.userinfo.username,
          time: getNowTime()
        })
      }
    },
    // 签署确定
    signDiaOK(identify, data) {
      this.sign(true, identify, data.name, data.time)
      this.$refs.signDia.close()
    },
    // 执行签名接口
    sign(sign, signType, signName, signDate) {
      const self = this
      getApiData('pub.signTable', {
        sign: sign, // true 签名，false 取消签名
        single: signType === 'bzr', // 编制人，只接受一个人的签名
        dbname: this.curProject.dbname,
        modid: 'risk',
        targetID: this.stepcode,
        signType: signType,
        signName: signName,
        signDate: signDate,
        projectID: this.curProject.projectid,
        zcbfid: this.curProject.zcbfid
      }).then(r => {
        this.$message({
          message: sign ? '签署成功' : '取消签署成功',
          type: 'success'
        })
        self.getSign(self.stepcode)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.signGroup{
  font-weight: bold;
  padding-top: 15px;
  .sign{
    cursor: pointer;
    color: var(--defaultColor);
    text-decoration: underline;
    float: right;
  }
  .el-divider--horizontal{
    margin: 0;
  }
}
.signItem{
  padding-top: 10px;
  padding-left: 5px;
}
.canenSign{
  cursor: pointer;
  color: #2e92f7 !important;
  text-decoration: underline;
  float: right;
}
</style>
