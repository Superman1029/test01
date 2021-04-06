<template>
  <div class="custom-tree-container">
    <el-tree
      ref="tree"
      :data="treeData"
      :props="{children: 'children', label: 'label'}"
      :highlight-current="true"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="nodeClick"
      :filter-node-method="filterNode"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span :title="node.label">
          <i class="el-icon-files"></i>
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: ["treeData"],
  data() {
    return {
      form: {
        mbcode: "",
        mbmc: "",
        code: "",
        jdmc: "",
        pjdmc: "",
        label: "",
        isnew: false,
      },
    };
  },
  created() {},
  methods: {
    nodeClick: function (data) {
      this.form = Object.assign({}, data);
      this.$emit("handleNodeClick", this.form);
    },
    filterNode:function (value,data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
  width: 100%;
  height: calc(100vh - 104px);
  position: relative;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-scrollbar {
  border: 1px solid #f2f4f8;
}
.el-input-group__append {
  padding: 0 5px;
}
</style>
