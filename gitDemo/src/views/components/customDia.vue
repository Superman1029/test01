<template>
  <div>
    <el-dialog
      :title="data.config.defTitle"
      :visible.sync="visible"
      :append-to-body="true"
      :width="data.config.width"
    >
      <el-form class="main" :label-position="data.config.label-position" label-width="60px" :model="data" size="mini">
        <el-form-item v-for="item of data.items" :label="item.title">
          <el-input v-if="item.type==='input'" v-model="data.name" :disabled="item.disabled" />
          <el-date-picker v-else-if="item.type==='datePicker'" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ok()">确 定</el-button>
        <el-button @click="close()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    // 主要数据
    data: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {},
  methods: {
    show(opt, data, fn) {
      this.data = data || {}
      this.callback = fn
      this.opt = Object.assign(this.opt, opt)
      this.visible = true
    },
    ok() {
      this.$emit('ok', this.opt.identify, this.data)
      if (this.callback) {
        this.callback(this, this.opt.identify, this.data)
      }
      // 这里不不关闭，外部关闭吧。
    },
    close() {
      this.visible = false
    },
    onclosed() {
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin: 20px;
}
.el-date-editor.el-input {
  width: 100%;
}
</style>
