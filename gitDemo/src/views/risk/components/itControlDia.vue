<template>
  <div>
    <el-dialog
      title="由选定应用程序的应用程序控制和依赖IT的手工控制"
      :visible.sync="visible"
      :append-to-body="true"
      width:="750px"
      height="600px"
    >
    <span>这是一段信息</span>
     <el-table :data="tableData" border fit stripe highlight-current-row style="width: 100%;">
        <el-table-column type="index" width="40" :index="$common.indexMethod"/>
        <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
        <el-table-column prop="SoftwareName" label="应用程序"></el-table-column>
        <el-table-column prop="ITGCName" label="控制名称"></el-table-column>
        <el-table-column prop="ITGCType" label="ITGC种类"></el-table-column>
        <el-table-column prop="ITGCDesc" label="ITGC描述"></el-table-column>
        <el-table-column prop="Frequency" label="ITGC频率"></el-table-column>
        <el-table-column prop="Element" label="技术组成要素"></el-table-column>
        <el-table-column prop="DesignEvaluate" label="ITGC设计评价"></el-table-column>
        <el-table-column prop="ITGCTest" label="测试"></el-table-column>
        <el-table-column prop="RunEvaluate" label="ITGC运行评价"></el-table-column>
        <el-table-column prop="Executor" label="执行者"></el-table-column>
        <el-table-column prop="Deficiency" label="缺陷"></el-table-column>
        <el-table-column prop="Attatch" label="附件"></el-table-column>
     </el-table>
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
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {},
  methods: {
    show() {
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
