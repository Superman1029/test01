<template>
  <div class="level-table">
    <el-table :data="tableData" border fit stripe highlight-current-row style="width: 100%;" :height="'100%'">
      <el-table-column type="index" width="40" :index="$common.indexMethod"/>
      <el-table-column prop="DocIndex" label="索引号"></el-table-column>
      <el-table-column prop="REvaluateOrigin" label="风险因素"></el-table-column>
      <el-table-column label="风险结论">
        <el-table-column prop="IfConclusion" label="结论类型"></el-table-column>
        <el-table-column prop="RConclusion" label="结论描述"></el-table-column>
      </el-table-column>
      <el-table-column label="可能影响的报表项目">
        <el-table-column prop="IfReportEffect" label="影响类型"></el-table-column>
        <el-table-column prop="RReportName" label="报表项目"></el-table-column>
      </el-table-column>
      <el-table-column prop="RReportEffect" label="对财务报表的具体影响"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  },
  created() {},
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .level-table {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
