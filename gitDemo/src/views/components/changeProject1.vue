<template>
  <div class="change-Project1">
    <el-drawer :visible.sync="isShowChangePro" direction="ltr" :with-header="false" @opened="loadData">
      <div class="paneltitle">
        <span>组成部分</span>
        <el-select v-model="xmzt" @change="loadData(true)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="drawer-content">
        <el-input
          v-model="filterText"
          placeholder="输入名称查找"
          size="mini"
          prefix-icon="el-icon-search"
          clearable
        />
        <el-scrollbar class="tree">
          <el-tree
            ref="tree"
            v-loading="loading"
            :props="{label: 'text'}"
            :data="data"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{node}" class="tree-node" :title="node.data.text" @dblclick="changeProSure(node)">
              <span>{{ node.data.text }}</span>
              <el-tag :type="node.data.stack_status==200?'success':'warning'" size="mini">{{ getZcbfzt(node.data.stack_status) }}</el-tag>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
import { common } from '@/utils/common'

export default {
  data() {
    return {
      filterText: '', // 过滤条件
      data: [], // 数据
      options: [{ value: '', label: '全部' }, { value: '190', label: '未归档' }, { value: '200', label: '已归档' }],
      loading: false, //
      xmzt: '' // 当前项目状态
    }
  },
  computed: {
    ...mapGetters(['userinfo']),
    isShowChangePro: {
      get() {
        return this.$store.state.common.isShowChangePro
      },
      set(val) {
        this.$store.state.common.isShowChangePro = val
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
  },
  methods: {
    getZcbfzt(zt) {
      return common.getZcbfzt(zt)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 加载项目
    loadData(reload) {
      if (!reload && this.data.length > 0) return // 有了就不在加载了。
      this.loading = true
      getApiData('pub.getZcbfTree', {
        usercode: this.userinfo.usercode,
        stack_status: this.xmzt
      }).then(r => {
        this.data = common.list2Tree(r.data)
        this.loading = false
      })
    },
    // 切换到组成部分
    changeZcbf(zcbfInfo) {
      this.$store.dispatch('common/changeCurProject', zcbfInfo)
      this.$store.dispatch('common/changeProject', false)
      this.$message.success('当前项目已切换到--' + zcbfInfo.zcbfName)
      this.refreshView()
    },
    // 切换的确定按钮
    changeProSure(node) {
      if (!node) return
      if (node.level === 1) return
      const self = this
      getApiData('pub.userInZcbfRole', {
        usercode: this.userinfo.usercode,
        projectid: node.data.projectid,
        zcbfid: node.data.id
      }).then(r => {
        if (r.data.length <= 0) {
          this.$message({
            message: '您没有权限查看项目--' + node.data.text,
            type: 'error'
          })
          return
        } else {
          const zcbfinfo = {
            dbname: node.data.dbname, // 项目库
            projectid: node.data.projectid, // 项目ID
            zcbfid: node.data.id, // 组成部分ID
            projectName: '', // 项目名称
            zcbfName: node.data.text, // 组成名称
            userRole: r.data[r.data.length - 1].roles, // 项目角色
            sjnd: node.data.sjnd, // 审计年度
            stack_status: node.data.stack_status ? node.data.stack_status : 190
          }
          let nodet = node
          while (nodet.level > 0) {
            if (nodet) zcbfinfo.projectName = nodet.data.text
            nodet = nodet.parent
          }
          self.changeZcbf(zcbfinfo)
        }
      })
    },
    // 刷新当前页面
    refreshView() {
      this.$store.dispatch('tagsView/delCachedView', this.$route).then(() => {
        const { fullPath } = this.$route
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .change-Project1 {
    .drawer-content {
      padding: 20px;
      .tree{
        height: calc(100vh - 85px);
      }
    }
  }
</style>
