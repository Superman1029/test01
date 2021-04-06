<template>
  <div style="height: 100%">
    <div class="toolbar">
      <el-input
        v-model="filterText"
        placeholder="输入名称查找"
        size="mini"
        prefix-icon="el-icon-search"
        clearable
      />
    </div>
    <el-scrollbar class="content">
      <el-tree
        ref="qTargetTree"
        highlight-current
        default-expand-all
        size="mini"
        :min-percent="10"
        :default-percent="20"
        :data="treeData"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :props="{label: 'text'}"
        @node-click="nodeClick"
      >
        <!--span slot-scope="{ node, data }" class="custom-tree-node">
          <span :title="node.label">
            <i :class="node.haschildren ? 'el-icon-folder' : 'el-icon-document'" style="padding-right: 5px" />{{ node.label }}
          </span>
        </span-->
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { getApiData } from '@/api/common'
import { common } from '@/utils/common'

export default {
  props: {
  },
  data() {
    return {
      filterText: '',
      params: {
        dgnd: '', // 只有底稿类会有 底稿年度
        targetID: '',
        targetTitle: ''
      },
      treeData: []
    }
  },
  computed: {
  },
  watch: {
    filterText(val) {
      this.$refs.qTargetTree.filter(val)
    }
  },
  created() {},
  methods: {
    // 过滤条件
    filterNode(value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 选择目标时触发
    nodeClick: function(data) {
      this.params.dgnd = ''
      this.params.targetID = ''
      this.params.targetTitle = ''
      if (data.type === 1) { // 年度
        this.params.dgnd = data.id
      } else if (data.type === 2) { // 底稿
        this.params.targetID = data.id
        this.params.targetTitle = data.text
      }
      this.$emit('targetChanged', this.params)
    },
    // 加载数据
    loadData(qParams) {
      this.filterText = ''
      this.params.dbname = qParams.dbname
      this.params.zcbfid = qParams.zcbfid
      this.params.modid = qParams.modid
      getApiData('gq.targetTree', this.params).then(r => {
        this.treeData = common.list2Tree(r.data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  height: calc(100% - 58px);
}
.el-scrollbar__wrap{
  overflow-x: hidden;
}

</style>
