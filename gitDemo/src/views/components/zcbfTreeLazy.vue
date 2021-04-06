<template>
  <div style="height: 100%">
    <div class="toolbar">
      <el-select v-model="params.sjxmzt" size="mini" style="width: 120px" @change="loadData()">
        <el-option
          v-for="item in zcbfZT"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="filterText"
        placeholder="输入名称查找"
        size="mini"
        prefix-icon="el-icon-search"
        clearable
        style="width:calc(100% - 124px)"
      />
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
        :filter-node-method="filterNode"
        :props="{label: 'text', children: 'children'}"
        @node-expand="nodeExpand"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node }" class="custom-tree-node">
          <span :title="node.label">
            <i :class="node.haschildren ? 'el-icon-folder' : 'el-icon-document'" style="padding-right: 5px" />{{ node.label }}
          </span>
        </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
import { getDict } from '@/api/localdata'
import { common } from '@/utils/common'
import { userRole } from '@/utils/dataPermission'

export default {
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
      firstNode: {}, // 保存树的第一个Node。level =0
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
  },
  methods: {
    loadData(node) {
      if (!node) {
        getApiData('pub.proTree', this.params).then(r => {
          const d = r.data
          for (let i = 0, len = d.length; i < len; i++) {
            d[i].children = [{}]
          }
          this.data = d
        })
      } else {
        getApiData('pub.proTreezcbf', {
          projectid: node.id
        }).then(r => {
          node.children = common.list2Tree(r.data, node.id)
        })
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.text && data.text.indexOf(value) !== -1
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
    nodeExpand(data, node, ele) {
      if (node.level === 1 && !data.children[0].id) this.loadData(data)
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

