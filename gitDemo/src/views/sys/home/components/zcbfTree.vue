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
        ref="tree"
        v-loading="loading"
        highlight-current
        default-expand-all
        size="mini"
        :min-percent="10"
        :default-percent="20"
        :data="data"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :props="{label: 'text'}"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node }" class="custom-tree-node" @dblclick="changePro(node)">
          <span :title="node.label">
            <el-badge :value="3" :hidden="true" class="item">
              <i :class="(node.id == node.projectid)? 'el-icon-folder' : 'el-icon-document'" style="padding-right: 5px" />
            </el-badge>
            {{ node.label }}
          </span>
        </span>
      </el-tree>
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
      data: [],
      curZcbfinfo: {} // 当前选择的组成部分信息
    }
  },
  computed: {
    ...mapGetters(['userinfo', 'curProject'])
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
      if (node.id === node.projectid) return
      // if (node.id === this.curZcbfinfo.zcbfid) return 加上这个任然不能防止双击的情况
      getApiData('pub.getZcbfInfo', {
        zcbfid: node.id,
        usercode: this.userinfo.usercode
      }).then(r => {
        if (!r.data.userRole) {
          this.$message.warning('您没有权限查看该项目')
        } else {
          this.curZcbfinfo = r.data
          this.$emit('nodeClick', this.curZcbfinfo)
        }
      })
    },
    // 双击树切换当前组成部分
    changePro(node) {
      if (this.curZcbfinfo.zcbfid !== this.curProject.zcbfid) {
        this.$store.dispatch('common/changeCurProject', this.curZcbfinfo)
        this.$message.success('当前项目已切换到--' + this.curZcbfinfo.zcbfName)
      }
      this.$router.push({ path: '/dgcheck' })
    },
    // 加载数据
    loadData() {
      this.loading = true
      getApiData('pub.getZcbfTree', {
        usercode: this.userinfo.usercode,
        stack_status: ''
      }).then(r => {
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
