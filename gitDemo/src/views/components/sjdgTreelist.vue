<template>
  <div style="height: 100%" :class="[multiple ? 'tree-table-style2' : 'tree-table-style']">
    <el-table
      ref="sjdgTreelist"
      v-loading="loading"
      :data="data"
      border
      stripe
      highlight-current-row
      row-key="id"
      lazy
      :load="loadChild"
      :span-method="arraySpanMethod"
      :tree-props="{children: 'children', hasChildren: 'hasfj'}"
      height="100%"
      @current-change="currowChange"
      @row-dblclick="rowDblClick"
    >
      <el-table-column v-if="multiple" type="selection" width="35" />
      <el-table-column prop="title" label="底稿名称" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon :icon-class="getIcon(scope.row)" />
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dgnd" label="年度" width="50" />
      <el-table-column prop="EditUser" label="编辑人" width="60" />
      <el-table-column prop="EditDate" label="编辑时间" width="135" />
      <el-table-column prop="dgbyuser" label="编制人" width="60" />
      <el-table-column prop="wdsj" label="编制日期" align="center" width="90" :formatter="wdsjFormatter" />
      <el-table-column prop="ReviewUser" label="复核人签署" width="150">
        <template slot-scope="scope">
          <span v-html="reviewFormatter(scope.row.ReviewUser)" />
        </template>
      </el-table-column>
      <el-table-column prop="dgzt" label="状态" width="80" :formatter="dgztFormatter" />
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <svg-icon class="icon-size table-icon" icon-class="see" @click="seeOne(scope.row)" />
          <svg-icon class="icon-size table-icon" icon-class="download2" @click="uploadOne(scope.row)" />
          <el-dropdown v-if="moreMenu.length > 0" trigger="click">
            <span class="el-dropdown-link">
              <svg-icon class="icon-size table-icon" icon-class="menu" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="hasMoreMenu('tiq')" icon="el-icon-chat-dot-round" @click.native="rowMenuItemClick('tiq', scope.row)">提Q</el-dropdown-item>
              <el-dropdown-item v-if="hasMoreMenu('gq')" icon="el-icon-collection-tag" @click.native="rowMenuItemClick('gq', scope.row)">管Q</el-dropdown-item>
              <el-dropdown-item v-if="hasMoreMenu('pushToHome')" icon="el-icon-collection-tag" @click.native="rowMenuItemClick('pushToHome', scope.row)">推送到首页</el-dropdown-item>
              <el-dropdown-item v-if="hasMoreMenu('delete')" divided icon="el-icon-delete" @click.native="deleteOne(scope)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData, openDG, downloadDG } from '@/api/common'
import { common } from '@/utils/common'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    // 当前底稿列表数据，必须包括 dgid
    data: {
      type: Array,
      default: () => { return [] }
    },
    // 当前组成部分信息 不可使用全局 curProject 因为 有些界面是不分组成部分的
    curZcbfinfo: {
      type: Object,
      default: () => { return {} }
    },
    // 多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 更多菜单
    moreMenu: {
      type: Array,
      default: () => {
        return ['tiq', 'gq', 'pushToHome', 'delete']
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  watch: {},
  created() {},
  methods: {
    // 复核人 格式化
    reviewFormatter(value) {
      if (value) return value.replace(/;/g, '<br>')
    },
    // 编制日期 格式化
    wdsjFormatter(row, column, cellValue, index) {
      return cellValue ? cellValue.substr(0, 10) : ''
    },
    // 底稿状态 格式化
    dgztFormatter(row, column, cellValue, index) {
      if (cellValue === -1) return '被退回'
      else if (cellValue === 1) return '编辑中'
      else if (cellValue === 10) return '已提交复核'
      else if (cellValue === 20) return '一级复核完成'
      else if (cellValue === 30) return '二级复核完成'
      else if (cellValue === 40) return '三级复核完成'
      else if (cellValue === 50) return '四级复核完成'
      else if (cellValue === 11) return '一级复核中'
      else if (cellValue === 21) return '二级复核中'
      else if (cellValue === 31) return '三级复核中'
      else if (cellValue === 41) return '四级复核中'
      else if (cellValue === 51) return '五级复核中'
      else if (cellValue === 100) return '复核完成'
      else if (cellValue === 200) return '已归档'
      else if (cellValue === 999) return '已删除'
    },
    // 是否包含更多菜单中的某一项
    hasMoreMenu(itemid) {
      return (this.moreMenu && this.moreMenu.indexOf(itemid) !== -1)
    },
    // 获取图标
    getIcon(row) {
      return common.dgIcon(row)
    },
    // 查看
    seeOne(row) {
      if (!(row.dgnd + row.dgmc)) return
      openDG({
        dbname: this.curZcbfinfo.dbname,
        usercode: this.userinfo.usercode,
        zcbfid: this.curZcbfinfo.zcbfid,
        dgid: row.dgnd + row.dgmc
      })
    },
    // 下载
    uploadOne(row) {
      downloadDG({
        dbname: this.curZcbfinfo.dbname,
        usercode: this.userinfo.usercode,
        zcbfid: this.curZcbfinfo.zcbfid,
        dgid: row.dgnd + row.dgmc
      })
    },
    // 删除
    deleteOne(scope) {
      const row = scope.row
      if (row.dgzt !== 1) {
        this.$message({
          message: '您只能删除状态为编辑中的',
          type: 'warning'
        })
        return
      }
      const self = this
      this.$confirm('确定要删除底稿：' + row.dgid, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getApiData('sjdg.deldg', {
          dbname: this.curZcbfinfo.dbname,
          zcbfid: this.curZcbfinfo.zcbfid,
          dgid: row.yid
        }).then(r => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          self.data.splice(scope.$index, 1)
        })
      })
    },
    // 更多菜单 单击事件
    rowMenuItemClick(itemid, row) {
      this.$emit('rowMenuItemClick', itemid, row)
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.lx === 2) { // 附件
        if (columnIndex === 1) {
          return [1, 9]
        } else if (columnIndex > 2) {
          return [0, 0]
        }
      }
    },
    // 当前行切换
    currowChange(currentRow, oldCurrentRow) {
      this.$refs.sjdgTreelist.clearSelection()
      this.$refs.sjdgTreelist.toggleRowSelection(currentRow)
      this.$emit('curRowChanged', currentRow)
    },
    // 双击行 执行打开
    rowDblClick(row, column, event) {
      if (row.lx === 2) return
      this.seeOne(row)
    },
    getCheckedRows() {
      return this.$refs.sjdgTreelist.store.states.selection
    },
    getCheckedDgids() {
      const rows = this.getCheckedRows()
      let dgids = ''
      for (var i = 0, len = rows.length; i < len; i++) {
        if (rows[i].lx !== 2) {
          const dgid = "'" + rows[i].dgid + "'"
          dgids += dgids === '' ? dgid : ',' + dgid
        }
      }
      return dgids
    },
    // 懒加载
    loadChild(treeNode, tree, resolve) {
      getApiData('sjdg.TreelistChild', {
        dbname: this.curZcbfinfo.dbname,
        zcbfid: this.curZcbfinfo.zcbfid,
        dgid: treeNode.dgid,
        fj: treeNode.lx === 1
      }).then(r => {
        resolve(r.data) // common.list2Tree
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-icon {
  margin:0 1px;
  width: 13px;
  height: 13px;
  cursor: pointer;
}
</style>
