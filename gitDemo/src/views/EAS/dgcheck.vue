<template>
  <split-pane split="vertical" :default-percent="25">
    <template slot="paneL">
      <sjjd-tree :tree-data="sjjdTreeData" @jdChanged="jdchange" />
    </template>
    <template slot="paneR">
      <div class="toolbar">
        <el-button type="primary" @click="signBZR()">编制人签署</el-button>
        <el-button type="primary" @click="cancelSignBZR()">取消编制人签署</el-button>
        <el-button type="primary" @click="signFHR()">复核人签署</el-button>
        <el-button type="primary" @click="cancelSignFHR()">取消复核人签署</el-button>
        <el-button type="primary" @click="pushHomePage()">推送至首页</el-button>
        <!-- <el-button type="primary" @click="openGQ()">Q信息整理</el-button> -->
        <el-input
          v-model="searchPara.searchText"
          class="searchText"
          placeholder="输入名称查找"
          size="mini"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchEnter"
          @blur="loaddgTree()"
        />
      </div>
      <split-pane split="horizontal" class="content" :default-percent="100">
        <template slot="paneL">
          <sjdg-treelist
            ref="sjdgList"
            style="height: calc(100% - 35px);"
            :cur-zcbfinfo="getZcbfinfo()"
            :data="dgTreelist"
            :loading="loadingdg"
            @rowMenuItemClick="rowMenuItemClick"
            @curRowChanged="curRowChanged"
          />
          <el-pagination
            style="float: right;"
            :current-page="pageInfo.pageNumber"
            :page-sizes="[15, 30, 60, 100]"
            :page-size="pageInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageInfo.totle"
            @size-change="function(size){
              pageInfo.pageSize = size
              loaddgTree()
            }"
            @current-change="function(curPage){
              pageInfo.pageNumber = curPage
              loaddgTree(null, curPage)
            }"
          />
        </template>
        <template slot="paneR">
          <el-tabs value="dgfjList" type="card" style="height: 100%;" class="bottom-tabs">
            <el-tab-pane label="底稿附件列表" name="dgfjList" style="height: 100%;">
              <dgfj-list ref="dgfjList" />
            </el-tab-pane>
          </el-tabs>
          <el-button icon="el-icon-arrow-down" class="tabsbtn" />
        </template>
      </split-pane>
      <sign-dia ref="signDia" />
      <ti-q ref="tiQ" :modid="'sjdg'" />
    </template>
  </split-pane>
</template>

<script>
import sjjdTree from '@/views/components/sjjdTree'
import sjdgTreelist from '@/views/components/sjdgTreelist'
import signDia from '@/views/components/signDia'
import dgfjList from '@/views/components/dgfjList'
import tiQ from '@/views/sys/gq/tiQ'
import { getApiData } from '@/api/common'
import { common } from '@/utils/common'
import { mapGetters } from 'vuex'
import { getNowTime } from '@/utils'

export default {
  name: 'Dgcheck',
  components: { sjjdTree, sjdgTreelist, signDia, tiQ, dgfjList },
  props: [],
  data() {
    return {
      loadingdg: false,
      tiQvisible: false,
      sjjdTreeData: [],
      dgTreelist: [],
      pageInfo: {
        pageNumber: 1,
        pageSize: 15,
        totle: 0
      },
      searchPara: {
        dgnd: '',
        searchText: '',
        sjjd: ''
      }
    }
  },
  computed: {
    ...mapGetters(['curProject', 'userinfo'])
  },
  created() {
  },
  mounted() {
    if (!(this.curProject.dbname && this.curProject.zcbfid)) {
      this.$store.dispatch('common/changeProject', true)
    } else {
      this.loadjdTree()
    }
  },
  methods: {
    // 获取当前组成部分信息
    getZcbfinfo() {
      return this.curProject
    },
    // 加载阶段树
    loadjdTree() {
      getApiData('sjjdList', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid
      }).then(r => {
        this.sjjdTreeData = common.list2Tree(r.data)
      })
    },
    // 加载底稿列表
    loaddgTree() {
      this.loadingdg = true
      getApiData('sjdg.Treelist', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        dgnd: this.searchPara.dgnd,
        sjjd: this.searchPara.sjjd,
        searchText: this.searchPara.searchText,
        pageSize: this.pageInfo.pageSize,
        pageNumber: this.pageInfo.pageNumber
      }).then(r => {
        this.dgTreelist = r.data
        this.loadingdg = false
      })
    },
    searchEnter(event) {
      if (common.IEVersion() !== -1) {
        event.target.blur()
      } else {
        this.loaddgTree()
      }
    },
    // 选中底稿阶段时 触发
    jdchange(data) {
      // console.log(data)
      this.searchPara.sjjd = ''
      this.searchPara.dgnd = data.dgnd
      if (data.isjd === 1) this.searchPara.sjjd = data.text
      this.loaddgTree()
    },
    // 单击列表中更多项目
    rowMenuItemClick(itemid, row) {
      if (itemid === 'pushToHome') {
        this.pushHomePage()
      } else if (itemid === 'tiq') {
        this.openTiQ(row)
      } else if (itemid === 'gq') {
        this.openGQ()
      }
    },
    /** 天职专有 开始 */

    // 更新签署数据
    updateCheckedRows(type, signname, signdate) {
      const rows = this.$refs.sjdgList.getCheckedRows()
      for (var i = 0, len = rows.length; i < len; i++) {
        if (rows[i].lx !== 2) {
          if (type === 'bzr' && (signname !== '' || this.userinfo.username === rows[i].dgbyuser)) {
            rows[i].dgbyuser = signname
            rows[i].wdsj = signdate
          }
        }
      }
    },
    // 编制人签署
    signBZR() {
      const dgids = this.$refs.sjdgList.getCheckedDgids()
      if (dgids === '') {
        this.$message({
          message: '请至少选择一个底稿',
          type: 'warning'
        })
        return
      }
      const self = this
      //
      this.$refs.signDia.show({
        identify: 'signBZR',
        title: '编制人签署',
        memo: false
      }, {
        name: this.userinfo.username,
        time: getNowTime()
      }, function(sender, identify, data) {
        getApiData('sjdg.signBZR', {
          cancel: 0,
          dbname: this.curProject.dbname,
          signname: data.name,
          signdate: data.time,
          zcbfid: this.curProject.zcbfid,
          dgids: dgids
        }).then(r => {
          this.$message({
            message: '签名成功',
            type: 'success'
          })
          sender.visible = false
          self.updateCheckedRows('bzr', data.name, data.time) // 刷新
        })
      })
    },
    // 编制人 取消签署
    cancelSignBZR() {
      const dgids = this.$refs.sjdgList.getCheckedDgids()
      if (dgids === '') {
        this.$message({
          message: '请至少选择一个底稿',
          type: 'warning'
        })
        return
      }
      const self = this
      getApiData('sjdg.signBZR', {
        cancel: 1,
        dbname: self.curProject.dbname,
        signname: self.userinfo.username,
        signdate: '',
        zcbfid: self.curProject.zcbfid,
        dgids: dgids
      }).then(r => {
        this.$message({
          message: '取消签名成功(只能取消自己的签名信息)',
          type: 'success'
        })
        self.updateCheckedRows('bzr', '', '') // 刷新
      })
    },
    // 复核人 签署
    signFHR() {
      // 校验
      const rows = this.$refs.sjdgList.getCheckedRows()
      let dgids = ''
      for (var i = 0, len = rows.length; i < len; i++) {
        if (rows[i].lx === 2) continue
        if (rows[i].dgbyuser === this.userinfo.username) { // !rows[i].dgbyuser
          this.$message({
            message: rows[i].dgid + ' 编制人与复核人不能为同一人，请取消选择',
            type: 'warning'
          })
          return
        }
        const dgid = "'" + rows[i].dgid + "'"
        dgids += dgids === '' ? dgid : ',' + dgid
      }
      if (dgids === '') {
        this.$message({
          message: '请至少选择一个底稿',
          type: 'warning'
        })
        return
      }
      //
      const self = this
      this.$refs.signDia.show({
        identify: 'signFHR',
        title: '复核人签署',
        memo: false
      }, {
        name: this.userinfo.username,
        time: getNowTime()
      }, function(sender, identify, data) {
        getApiData('sjdg.signFHR', {
          cancel: 0,
          dbname: this.curProject.dbname,
          projectid: this.curProject.projectid,
          zcbfid: this.curProject.zcbfid,
          signname: data.name,
          signdate: data.time,
          dgids: dgids
        }).then(r => {
          this.$message({
            message: '签名成功',
            type: 'success'
          })
          sender.visible = false
          self.loaddgTree() // 刷新
        })
      })
    },
    // 复核人 取消签署
    cancelSignFHR() {
      const dgids = this.$refs.sjdgList.getCheckedDgids()
      if (dgids === '') {
        this.$message({
          message: '请至少选择一个底稿',
          type: 'warning'
        })
        return
      }
      const self = this
      getApiData('sjdg.signFHR', {
        cancel: 1,
        dbname: self.curProject.dbname,
        projectid: self.curProject.projectid,
        zcbfid: self.curProject.zcbfid,
        signname: self.userinfo.username,
        signdate: '',
        dgids: dgids
      }).then(r => {
        this.$message({
          message: '取消签名成功',
          type: 'success'
        })
        self.loaddgTree() // 刷新
      })
    },
    /** 天职专有 end */
    // 当前选中底稿改变时出发
    curRowChanged(row) {
      if (row.lx === 2) return
      this.$refs.dgfjList.loadData({
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        dgid: row.yid // 这里使用 原ID 为int的
      })
    },
    // 推送到首页
    pushHomePage() {
      const rows = this.$refs.sjdgList.getCheckedRows()
      let dgids = ''
      for (var i = 0, len = rows.length; i < len; i++) {
        if (rows[i].lx === 2) continue
        if (!rows[i].dgbyuser) { // !rows[i].dgbyuser
          this.$message.warning(rows[i].dgid + ' 没有签署编制人，不能推送，请取消选择')
          return
        }
        const dgid = "'" + rows[i].dgid + "'"
        dgids += dgids === '' ? dgid : ',' + dgid
      }
      if (dgids === '') {
        this.$message.warning('请至少选择一个底稿')
        return
      }
      //
      const self = this
      this.$refs.signDia.show({
        identify: 'pushHomePage',
        title: '推送至首页',
        memo: true
      }, {
        memo: ''
      }, function(sender, identify, data) {
        getApiData('sjdg.pushHomePage', {
          dbname: self.curProject.dbname,
          projectid: self.curProject.projectid,
          zcbfid: self.curProject.zcbfid,
          pusher: self.userinfo.username,
          remark: data.memo,
          dgids: dgids
        }).then(r => {
          this.$message.success('推送成功')
          sender.visible = false
        })
      })
    },
    // 打开Q功能
    openGQ(row) {
      this.$router.push({ path: '/gq', query: { modid: 'sjdg' }})
    },
    // 打开提Q功能
    openTiQ(row) {
      if (!row) {
        const rows = this.$refs.sjdgList.getCheckedRows()
        if (rows.length <= 0) return
        row = rows[0]
      }
      this.$refs.tiQ.show(row.dgid, row.dgid)
    }
  }
}
</script>

<style>
  .bottom-tabs .el-tabs__content{
    height: calc(100% - 36px);
  }
</style>

<style lang="scss" scoped>
.content{
  height: calc(100% - 35px);
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
