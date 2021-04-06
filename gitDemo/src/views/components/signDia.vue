<template>
  <div>
    <el-dialog
      :title="opt.title"
      :visible.sync="visible"
      :append-to-body="true"
      width="400px"
      @closed="onclosed"
    >
      <el-form class="main" :label-position="opt.memo ? 'top' : 'left'" label-width="60px" :model="data" size="mini">
        <el-form-item v-if="opt.memo">
          <el-input
            v-model="data.memo"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            :maxlength="opt.memolen"
            show-word-limit
          />
        </el-form-item>
        <el-form-item v-if="!opt.memo" label="名称">
          <el-input v-model="data.name" :disabled="!opt.nameEnable" />
        </el-form-item>
        <el-form-item v-if="!opt.memo" label="日期">
          <el-date-picker
            v-model="data.time"
            :disabled="!opt.timeEnable"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
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
  props: {},
  data() {
    return {
      visible: false,
      opt: {
        identify: '', // 唯一标识
        title: '请输入', // 标题
        nameEnable: true, // 名称是否可编辑
        timeEnable: true, // 时间是否可编辑
        memo: true,
        memolen: 500
      },
      data: {},
      callback: {}
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
