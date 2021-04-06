<template>
  <div class="GQ-dialog">
    <el-dialog v-dialogDrag :title="title" width="90%" :visible.sync="visible">
      <iframe class="iframe" frameborder="0" scrolling="auto" :src="'/UACheck/gq?params=' + JSON.stringify(params) + '&token=' + token" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {},
  data() {
    return {
      visible: false,
      title: '问题管理',
      params: {}
    }
  },
  computed: {
    ...mapGetters(['curProject', 'token'])
  },
  created() {},
  methods: {
    show(pars, title) {
      this.title = title || '问题管理'
      this.params = pars
      // Object.assign(this.params, params)
      this.visible = true
    }
  }
}
</script>
<style lang="scss">
.el-dialog__body {
  margin: 0 !important;
  padding: 0 !important;
  padding-bottom: 20px !important;
}
.iframe {
  width: 100%;
  height: calc(100vh - 200px);
}
</style>
