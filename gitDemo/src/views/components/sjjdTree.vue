<template>
  <div style="height: 100%">
    <div class="toolbar">
      <el-input
        v-model="filterText"
        placeholder="输入名称查找"
        prefix-icon="el-icon-search"
        clearable
      />
    </div>
    <el-scrollbar class="content">
      <el-tree
        ref="jdTree"
        highlight-current
        default-expand-all
        :min-percent="10"
        :default-percent="20"
        :data="treeData"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :props="{label: 'text'}"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span :title="node.label">
            <!--svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" /-->
            <i :class="node.haschildren ? 'el-icon-folder' : 'el-icon-document'" style="padding-right: 5px" />{{ node.label }}
          </span>
        </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    treeData: {
      type: Array,
      default: () => { return [] }
    },
    showall: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  watch: {
    filterText(val) {
      this.$refs.jdTree.filter(val)
    },
    // 默认点击Tree第一个节点
    treeData(val) {
      if (val) {
        this.$nextTick(() => {
          document.querySelector('.el-tree-node__content').click()
        })
      }
    }
  },
  created() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    nodeClick: function(data) {
      this.$emit('jdChanged', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  height: calc(100% - 38px);
}
.el-scrollbar__wrap{
  overflow-x: hidden;
}

</style>

