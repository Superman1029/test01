<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="检测不通过"
      :visible.sync="visible"
      :append-to-body="true"
      width="500px"
    >
      <el-table :data="data" style="width: 100%">
        <el-table-column prop="dgid" label="底稿名称" />
        <el-table-column prop="CheckText" label="未通过原因" width="180" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ok()">跳 过</el-button>
        <el-button @click="visible=false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {},
  data() {
    return {
      visible: false,
      data: [],
      callback: undefined
    }
  },
  computed: {
  },
  created() {},
  methods: {
    show(data, callback) {
      this.callback = callback
      this.data = data
      this.visible = true
    },
    ok() {
      if (this.callback) this.callback()
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  margin: 0 !important;
}
</style>
