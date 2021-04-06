<template>
  <div style="overflow: hidden;height: 100%">
    <div class="toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="add('提问')">提Q</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="loadData()">刷新</el-button>
      <el-input
        v-model="params.searchText"
        class="searchText"
        placeholder="输入提Q内容查找"
        size="mini"
        prefix-icon="el-icon-search"
        clearable
        @change="loadData()"
      />
    </div>
    <div style="height: calc(100% - 75px)" class="tree-table-style">
      <el-table
        ref="qEditTable"
        v-loading="loading"
        :data="data"
        size="mini"
        border
        fit
        stripe
        highlight-current-row
        row-key="id"
        height="100%"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :span-method="arraySpanMethod"
      >
        <el-table-column prop="TrueName" label="参与人" width="200" />
        <el-table-column prop="ContentText" label="内容(点击内容进行编辑)">
          <template slot-scope="scope" style="width: 100%">
            <el-popover :value="editRow.id === scope.row.id" trigger="manual" placement="bottom-start" width="500">
              <el-row style="padding-bottom: 10px">
                <el-col :span="7">参与人:{{ scope.row.TrueName }}</el-col>
                <el-col v-show="scope.row.QueryType === '提问'" :span="11">
                  答复人：
                  <el-select v-model="editRow.Replier" placeholder="请选择" style="width: 120px" size="mini">
                    <el-option
                      v-for="item in zcbfUsers"
                      :key="item.UserCode"
                      :label="item.TrueName"
                      :value="item.UserCode"
                    />
                  </el-select>
                </el-col>
                <el-col v-show="scope.row.QueryType === '提问'" :span="6" style="text-align: right">
                  级别：
                  <el-select v-model="editRow.Level" placeholder="请选择" style="width: 70px" size="mini">
                    <el-option
                      v-for="item in qLevel"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id"
                    />
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-input ref="contentText" v-model="editRow.ContentText" type="textarea" :rows="4" placeholder="请输入内容" />
                </el-col>
              </el-row>
              <div>时间:{{ scope.row.CreateTime }} 状态：{{ scope.row.QueryStatus }}
                <el-button style="float:right;margin-top:10px;margin-left:5px" type="primary" @click="closeEdit()">取消</el-button>
                <el-button v-db-click style="float:right;margin-top:10px" type="primary" @click="save(scope.row,editRow)">提交</el-button>
              </div>
              <span slot="reference" style="width: 100%;cursor:pointer" @click="editShow(scope.row)"> {{ scope.row.ContentText }} </span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="Replier" label="答复人" width="80" :formatter="replierFormatter" />
        <el-table-column prop="Level" label="级别" width="65" align="center">
          <template slot-scope="scope">
            <span>{{ qLevel[scope.row.Level - 1].text }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="QueryStatus" label="状态" width="65" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.QueryStatus==='Open' ? 'danger' : ''">{{ scope.row.QueryStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="时间" width="135" align="center" />
        <el-table-column v-if="showtarget" prop="targetTitle" label="审计步骤/底稿" width="180" />
        <el-table-column v-if="params.stack_status==190" label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-tooltip content="补问">
              <svg-icon class="table-icon" icon-class="tq" @click="add('补问', scope.row)" />
            </el-tooltip>
            <el-tooltip content="答复">
              <svg-icon class="table-icon" icon-class="answer_q" @click="add('答复', scope.row)" />
            </el-tooltip>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <svg-icon class="icon-size table-icon" icon-class="menu" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-chat-dot-round" @click.native="closeOrOpen(scope.row, 3)">关Q</el-dropdown-item>
                <el-dropdown-item icon="el-icon-collection-tag" @click.native="delQ(scope.row)">删Q</el-dropdown-item>
                <el-dropdown-item icon="el-icon-collection-tag" divided @click.native="closeOrOpen(scope.row, 4)">重新打开</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      当前页合计：{{ totalQ.total }} 条 打开：{{ totalQ.open }} 条 关闭：{{ totalQ.close }} 条
      <el-pagination
        style="float: right;"
        :current-page="params.pageNumber"
        :page-sizes="[15, 30, 60, 100]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="params.totle"
        @size-change="function(size){
          params.pageSize = size
          loadData()
        }"
        @current-change="function(curPage){
          loadData(null, curPage)
        }"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
import { common } from '@/utils/common'
import { utils } from '@/utils'
export default {
  props: {
    // 是否显示 目标列
    showtarget: {
      type: Boolean,
      default: true
    },
    // 项目组成员列表 由外面传进入，就不用每次都调用接口了。
    zcbfUsers: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      data: [], // 当前数据
      loading: false,
      params: {
        pageSize: 15,
        pageNumber: 1
      }, // 当前查询的参数
      editRow: { id: '1' }, // 正在编辑的行
      qLevel: [{ id: 1, text: '低' },
        { id: 2, text: '正常' },
        { id: 3, text: '高' }],
      totalQ: {
        total: 0,
        close: 0,
        open: 0
      }
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  watch: { },
  created() { },
  mounted() { },
  methods: {
    // 刷新数据
    loadData(params, pageNumber) {
      this.editRow = {}
      if (params) this.params = params
      this.params.pageSize = this.params.pageSize || 15
      // 每次查都得是从第一页开始
      this.params.pageNumber = pageNumber || 1
      this.params.minRN = (this.params.pageNumber - 1) * this.params.pageSize
      this.loading = true
      getApiData('gq.qTreelistPage', this.params).then(r => {
        // console.log(r)
        this.data = common.list2Tree(r.data.rows)
        this.params.totle = r.data.total
        // 统计Q信息
        this.countQ()
        this.loading = false
      })
    },
    // 统计Q信息
    countQ() {
      this.totalQ.total = 0
      this.totalQ.open = 0
      this.totalQ.close = 0
      for (var i = 0, len = this.data.length; i < len; i++) {
        if (this.data[i].QueryType === '提问') {
          this.totalQ.total += 1
          if (this.data[i].QueryStatus === 'Open') {
            this.totalQ.open += 1
          } else {
            this.totalQ.close += 1
          }
        }
      }
    },
    // 答复人
    replierFormatter(row, column, cellValue, index) {
      for (var i = 0, len = this.zcbfUsers.length; i < len; i++) {
        if (this.zcbfUsers[i].UserCode === cellValue) {
          return this.zcbfUsers[i].TrueName
        }
      }
      return cellValue
    },
    cellClick(row, column, cell, event) {
      if (row.px === 'edit') row.px = ''
    },
    // 提Q
    add(QType, row) {
      if (this.params.stack_status !== 190) {
        this.$message.warning('只有 未归档 的组成部分才能提Q。')
        return
      }
      if (this.editRow.id) {
        this.$message.warning('当前页面正在处于编辑状态，请先关闭后在操作。')
        return
      }
      if (QType === '提问' && this.params.targetID === '') {
        this.$message.warning('请选择需要提Q的对象')
        return
      }
      if (QType !== '提问') {
        const rowTQ = this.getTiQ(row)
        if (rowTQ.QueryStatus === 'Close') {
          this.$message.warning('Q已关闭，不能进行操作。')
          return
        }
      }
      var self = this
      var Qdata = {}
      Qdata.dbname = this.params.dbname
      Qdata.id = utils.newGUID().toUpperCase()
      Qdata.pid = ''
      Qdata.TQID = Qdata.id
      Qdata.TLevel = 0
      Qdata.ProjectID = this.params.projectid
      Qdata.ZcbfID = this.params.zcbfid
      Qdata.modid = this.params.modid
      Qdata.targetID = this.params.targetID
      Qdata.targetTitle = this.params.targetTitle
      Qdata.UserCode = this.userinfo.usercode
      Qdata.TrueName = this.userinfo.username
      Qdata.userRole = this.params.userRole
      Qdata.QueryType = QType
      Qdata.RefAddress = ''
      Qdata.QueryStatus = 'Open'
      Qdata.CreateTime = utils.getNowDate()
      if (QType === '提问') {
        Qdata.ContentText = '<请输入内容>'
      } else if (QType === '答复') {
        Qdata.ContentText = '答复:'
      } else if (QType === '补问') {
        Qdata.ContentText = '补问:'
      }
      if (QType !== '提问') {
        if (row) {
          Qdata.pid = row.id
          Qdata.TQID = row.TQID
          Qdata.TLevel = 1
          Qdata.targetID = row.targetID
          Qdata.targetTitle = row.targetTitle
          Qdata.Level = 0
        }
      } else {
        Qdata.Replier = ''
        Qdata.Level = 2
      }
      Qdata.data_ID = this.params.data_ID ? this.params.data_ID : Qdata.targetID.substr(0, 4)
      Qdata.Replier = this.params.replier ? this.params.replier : ''
      if (QType !== '提问') {
        if (!row.children) row.children = []
        row.children.push(Qdata)
        this.data.push()// 解决连续 增加后，不刷新界面问题
      } else {
        this.data.push(Qdata)
      }
      // 100 毫秒后执行 展开，编辑
      setTimeout(function() {
        if (row) self.$refs.qEditTable.toggleRowExpansion(row, true)// 展开行
        self.editRow = Object.assign({ insert: true, parent: row }, Qdata) // 编辑该行
      }, 100)
    },
    // 编辑row 数据
    editShow(row) {
      this.closeEdit() // 先关闭一下
      if (row.QueryStatus === 'Close' || this.userinfo.usercode !== row.UserCode || this.params.stack_status !== 190) return
      this.editRow = Object.assign({}, row)
    },
    // 关闭编辑 界面
    closeEdit() {
      if (this.editRow.insert) {
        let data = []
        if (this.editRow.parent && this.editRow.parent.children) {
          data = this.editRow.parent.children
        } else {
          data = this.data
        }
        for (let i = 0, len = data.length; i < len; i++) {
          if (data[i].id === this.editRow.id) {
            data.splice(i, 1)
            break
          }
        }
      }
      this.editRow = {}
    },
    // 保存 编辑Q 增加 修改
    save(oldrow, row) {
      var changes = {}
      if (row.insert) {
        changes = row
        if (changes.parent) delete changes.parent
      } else { // 修改
        changes.dbname = this.params.dbname
        changes.id = row.id
        changes.ContentText = row.ContentText
        if (row.QueryType === '提问') {
          changes.Replier = row.Replier
          changes.Level = row.Level
        }
      }
      // 提交
      getApiData('GQ.QEdit', changes).then(r => {
        this.$message.success('保存成功')
        this.editRow = {}
        delete changes.insert // 需要把 insert 状态删除
        Object.assign(oldrow, changes)
      })
    },
    // 获取 行 row 的 提Q 的ROW
    getTiQ(row) {
      if (row.id === row.TQID) return row
      for (let i = 0, len = this.data.length; i < len; i++) {
        if (this.data[i].id === row.TQID) {
          return this.data[i]
        }
      }
    },
    // 从集合 data 中 获取 行row的数据集
    getRowDatas(row, data) {
      if (row.id === row.TQID) return this.data // 一级
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].id === row.pid) {
          return data[i].children
        } else if (data[i].children.length > 0) {
          return this.getRowDatas(row, data[i].children)
        }
      }
    },
    // 2 删Q 3关Q，4 重新打开
    updateQ(row, updateType, fn) {
      // updateType 2 是删除，3是close
      let hint = updateType === 2 ? '删除' : updateType === 3 ? '关闭' : '重新打开'
      if (row.ContentText.length < 15) {
        hint += '[' + row.ContentText + ']'
      } else {
        hint += '[' + row.ContentText.substr(0, 12) + '...]'
      }
      // 提交
      const self = this
      this.$confirm('您确定要' + hint + ' 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getApiData('GQ.QUpdate', {
          updateType: updateType + '',
          dbname: self.params.dbname,
          id: row.id
        }).then(r => {
          this.$message.success(hint + '成功!')
          fn()
        })
      })
    },
    // 3 关Q ，4 重新打开Q，操作的都是 TIQ
    closeOrOpen(row, updateType) {
      if (!row) {
        this.$message.warning('请选择要操作的Q信息！')
        return
      }
      const rowTQ = this.getTiQ(row)
      if (this.userinfo.usercode !== rowTQ.UserCode) {
        this.$message.warning('您不能对[' + rowTQ.TrueName + ']的问题进行操作')
        return
      }
      if (rowTQ.QueryStatus === 'Close' && updateType === 3) {
        this.$message.warning('该问题已关闭，您不能执行关闭操作')
        return
      }
      this.updateQ(rowTQ, updateType, function() {
        rowTQ.QueryStatus = updateType === 3 ? 'Close' : 'Open'
      })// 保存到数据库
    },
    // 2 删除Q
    delQ(row) {
      if (!row) {
        this.$message.warning('请选择要操作的Q信息！')
        return
      }
      const rowTQ = this.getTiQ(row)
      if (this.userinfo.usercode !== row.UserCode) {
        this.$message.warning('您不能对[' + row.TrueName + ']的Q进行删除操作')
        return
      }
      // if (rowTQ.QueryStatus === 'Close') { // 20200908 删除只控制人
      //   this.$message.warning('该问题已关闭，您不能执行关闭操作')
      //   return
      // }
      const self = this
      this.updateQ(row, 2, function() {
        const data = self.getRowDatas(row, rowTQ.children)
        if (!data) return
        for (let i = 0, len = data.length; i < len; i++) {
          if (data[i].id === row.id) {
            data.splice(i, 1)
            return
          }
        }
      })// 保存到数据库
    },
    // 合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.QueryType !== '提问') { // 不是提问的话，就需要合并
        if (column.property === 'ContentText') {
          return [columnIndex, 4]
        } else if (columnIndex > 1 && columnIndex < 5) { // 234
          return [0, 0]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.table-icon {
  margin: 0;
  cursor: pointer;
  width: 15px;
  height: 15px;
}
.footer{
  height: 35px;
  line-height: 35px;
  vertical-align: middle;
  font-size: 12px;
  padding: 0 10px;
  border: 1px solid #D4D4D4;
}
</style>
