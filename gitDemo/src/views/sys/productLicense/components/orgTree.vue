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
        ref="tree"
        v-loading="loading"
        highlight-current
        default-expand-all
        :data="data"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :props="{label: 'text'}"
        @node-click="nodeClick"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
import { common } from '@/utils/common'

export default {
  props: { },
  data() {
    return {
      filterText: '',
      loading: false,
      data: []
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.loadData()
  },
  mounted() { },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 选择当前组成部分
    nodeClick: function(node) {
      this.$emit('nodeClick', node)
    },
    // 加载数据
    loadData() {
      this.loading = true
      getApiData('sys.orgTree', {}).then(r => {
        this.data = common.list2Tree(r.data)
        this.loading = false
      })
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
