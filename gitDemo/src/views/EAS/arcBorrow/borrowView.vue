<template>
  <split-pane split="vertical" :default-percent="25">
    <template slot="paneL">
      <div class="toolbar">
        <el-input
          v-model="filterText"
          placeholder="输入名称查找"
          size="mini"
          prefix-icon="el-icon-search"
          clearable
        />
      </div>
      <el-scrollbar class="contentZcbf">
        <el-tree
          highlight-current
          default-expand-all
          size="mini"
          :min-percent="10"
          :default-percent="20"
          :data="zcbfData"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :props="{label: 'text'}"
          @node-click="nodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>
              <el-badge :value="3" :hidden="true" class="item">
                <i :class="(node.id == node.projectid)? 'el-icon-folder' : 'el-icon-document'" style="padding-right: 5px" />
              </el-badge>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </template>
    <template slot="paneR">
      <div class="toolbar">
        <span>组成部分：{{ curZcbfinfo.projectName }}<el-divider direction="vertical" />{{ curZcbfinfo.zcbfName }}
          <el-tag v-if="curZcbfinfo.zcbfName" :type="curZcbfinfo.stack_status==200?'success':'warning'" size="mini">{{ getZcbfzt(curZcbfinfo.stack_status) }}</el-tag>
        </span>
        <el-input
          v-model="searchText"
          class="searchText"
          placeholder="输入名称查找"
          size="mini"
          prefix-icon="el-icon-search"
          clearable
          @change="loaddgTree()"
        />
      </div>
      <split-pane split="horizontal" class="content" :default-percent="100">
        <template slot="paneL">
          <sjdg-treelist
            ref="sjdgList"
            :cur-zcbfinfo="curZcbfinfo"
            :data="dgTreelist"
            :loading="loadingdg"
            :more-menu="[]"
            :multiple="false"
            @curRowChanged="curRowChanged"
          />
        </template>
        <template slot="paneR">
          <el-tabs :value="'dgfjList'" type="card" size="mini">
            <el-tab-pane label="底稿附件列表" name="dgfjList">
              <dgfj-list ref="dgfjList" />
            </el-tab-pane>
          </el-tabs>
          <el-button icon="el-icon-arrow-down" class="tabsbtn" />
        </template>
      </split-pane>
    </template>
  </split-pane>
</template>

<script>
import sjdgTreelist from '@/views/components/sjdgTreelist'
import dgfjList from '@/views/components/dgfjList'
import { getApiData } from '@/api/common'
import { common } from '@/utils/common'
import { mapGetters } from 'vuex'

export default {
  name: 'BorrowView',
  components: { sjdgTreelist, dgfjList },
  props: [],
  data() {
    return {
      filterText: '', // 组成部分过滤条件
      zcbfData: [], // 组成部分数据
      curZcbfinfo: {}, // 当前选中的组成部分
      loadingdg: false,
      tiQvisible: false,
      sjjdTreeData: [],
      dgTreelist: [],
      searchText: ''
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {
  },
  mounted() {
    this.loadZcbf()
  },
  methods: {
    getZcbfzt(zt) {
      return common.getZcbfzt(zt)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 加载组成部分
    loadZcbf() {
      getApiData('arc.borrowAuthList', {
        usercode: this.userinfo.usercode
      }).then(r => {
        this.zcbfData = common.list2Tree(r.data)
      })
    },
    // 加载底稿列表
    loaddgTree() {
      this.loadingdg = true
      getApiData('sjdg.Treelist', {
        dbname: this.curZcbfinfo.dbname,
        zcbfid: this.curZcbfinfo.zcbfid,
        searchText: this.searchText
      }).then(r => {
        this.dgTreelist = r.data
        this.loadingdg = false
      })
    },
    nodeClick(node) {
      if (node.id === node.projectid) return
      getApiData('pub.getZcbfInfo', {
        zcbfid: node.id,
        usercode: this.userinfo.usercode
      }).then(r => {
        this.curZcbfinfo = r.data
        this.loaddgTree()
      })
    },
    curRowChanged() {}
  }
}
</script>

<style lang="scss" scoped>
.contentZcbf{
  height: calc(100% - 38px);
}
.table-icon {
  margin:0 1px;
  cursor: pointer;
}
.tabsbtn{
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px !important;
}
</style>
