<template>
  <div style="height: 100%">
    <div class="toolbar">
      <el-input
        v-model="filterText"
        placeholder="输入组成部分名称过滤"
        size="mini"
        suffix-icon="el-icon-search"
        clearable
      >
        <el-button slot="prepend" icon="el-icon-sort" @click="openSelproject()">选择项目</el-button>
      </el-input>
    </div>
    <el-scrollbar class="content">
      <el-tree
        ref="tree"
        highlight-current
        size="mini"
        :data="data"
        :min-percent="10"
        :default-percent="16"
        :expand-on-click-node="false"
        default-expand-all
        :filter-node-method="filterNode"
        :props="{label: 'sjxmmc', children: 'children'}"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node }" class="custom-tree-node">
          <span :title="node.label">
            <i :class="node.haschildren ? 'el-icon-folder' : 'el-icon-document'" style="padding-right: 5px" />{{ node.label }}
          </span>
        </span>
      </el-tree>
    </el-scrollbar>
    <selProject ref="selproject" @ok="selprojectok" />
  </div>
</template>

<script>
// 单个项目的组成部分树
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
import { getDict } from '@/api/localdata'
import { common } from '@/utils/common'
import { userRole } from '@/utils/dataPermission'
import selProject from '@/views/components/selProject'

export default {
  components: { selProject },
  props: {
    params: {
      type: Object,
      default: () => {
        return {
          usercode: '', // 当前用户
          sjxmzt: 190, // 项目状态
          ssbm: '', // 所属部门
          xmbh: '' // 项目编号
        }
      }
    }
  },
  data() {
    return {
      filterText: '',
      data: [],
      zcbfZT: []
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
  created() {},
  mounted() {
    getDict('zcbfzt').then(data => {
      this.zcbfZT = data
    })
    this.loadData()
  },
  methods: {
    loadData(projectid) {
      if (!projectid) {
        this.data = []
        return
      }
      getApiData('pm.zcbfTree', {
        projectid: projectid
      }).then(r => {
        this.data = common.list2Tree(r.data)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.sjxmmc && data.sjxmmc.indexOf(value) !== -1
    },
    // 单击节点
    nodeClick: function(node) {
      if (node.id === node.projectid) return
      getApiData('pub.getZcbfInfo', {
        zcbfid: node.id,
        usercode: this.userinfo.usercode
      }).then(r => {
        if (!r.data.userRole && !userRole.isInclude(['superAdmin', 'archivist'])) {
          this.$message.warning('您没有权限查看该项目')
        } else {
          this.curZcbfinfo = r.data
          this.$emit('nodeClick', this.curZcbfinfo)
        }
      })
    },
    openSelproject() {
      this.$refs.selproject.show()
    },
    selprojectok(projectinfo) {
      this.loadData(projectinfo.zcbfid)
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

