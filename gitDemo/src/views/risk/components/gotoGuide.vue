<template>
  <!-- 跳转至审计指引 -->
  <div>
    <el-dialog
      title="请选择"
      :visible.sync="visible"
      width="400px"
    >
      <p v-for="(item, i) in data" @click="visible=false">
        <el-link type="primary" :disabled="item.auditGuideUrl === ''" :href="item.auditGuideUrl" target="_blank">{{ item.auditGuide }}</el-link>
      </p>
      <div slot="footer" />
    </el-dialog>
  </div>
</template>

<script>
import { getApiData } from '@/api/common'
import { utils } from '@/utils'
export default {
  props: {},
  data() {
    return {
      visible: false,
      stepcode: '',
      data: []
    }
  },
  created() {},
  methods: {
    show(stepcode) {
      this.stepcode = stepcode
      this.gotoGuide()
    },
    gotoGuide() {
      getApiData('pub.auditStepsLinkGuide', {
        stepcode: this.stepcode
      }).then(r => {
        if (r.data.length > 1) {
          this.data = r.data
          this.visible = true
        } else {
          const url = r.data[0].auditGuideUrl
          if (!utils.isEmpty(url)) {
            window.open(url, '_blank')
          // window.location.href = 'http://www.baidu.com'
          } else {
            this.$message({
              message: '当前步骤未设置审计指引。',
              type: 'error'
            })
            return
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
