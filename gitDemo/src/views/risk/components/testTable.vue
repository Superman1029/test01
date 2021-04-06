<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" title="穿行测试">
      <el-table v-show="isShow" :data="tableData" border fit stripe highlight-current-row style="width: 100%;">
        <el-table-column type="index" width="40" :index="$common.indexMethod"/>
        <el-table-column prop="CompliantZcbf" label="组成部分"></el-table-column>
        <el-table-column prop="WalkThroughConclu" label="穿行测试结论"></el-table-column>
        <el-table-column prop="Attatch" label="附件"></el-table-column>
        <el-table-column prop="ItemName" label="重大交易流程"></el-table-column>
        <el-table-column prop="NewUser" label="测试执行人" show-overflow-tooltip></el-table-column>
      </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

export default {
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isShow: true,
      activeNames: ['1']
    }
  },
  created() {},
  methods: {
  }
}
</script>
<style lang="scss" scoped></style>
