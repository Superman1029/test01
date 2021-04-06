<template>
  <div style="height: 100%">
    <el-table
      v-loading="loading"
      :data="data"
      size="mini"
      border
      stripe
      highlight-current-row
      height="100%"
      @row-dblclick="rowDblClick"
    >
      <el-table-column prop="fjsyh" label="索引号" width="80" />
      <el-table-column prop="fjname" label="附件名称" align="center" />
      <el-table-column prop="fjlx" label="类型" />
      <el-table-column prop="adduser" label="增加人" />
      <el-table-column prop="adddate" label="提交时间" />
      <el-table-column label="操作" width="75" align="center" fixed="right">
        <template slot-scope="scope">
          <svg-icon class="icon-size table-icon" icon-class="see" @click="seeOne(scope.row)" />
          <svg-icon class="icon-size table-icon" icon-class="download2" @click="downloadOne(scope.row)" />
          <svg-icon class="icon-size table-icon" icon-class="delete" @click="delOne(scope)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fileservice } from '@/utils/request'
import { getApiData, downloadFile } from '@/api/common'

export default {
  props: { },
  data() {
    return {
      loading: false,
      data: [],
      params: {
        dbname: '',
        zcbfid: '',
        dgid: '' // int 的ID
      }
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  watch: {},
  created() {},
  methods: {
    // 加载数据
    loadData(params) {
      if (params) this.params = params
      this.loading = true
      getApiData('sjdg.fjList', this.params).then(r => {
        this.data = r.data
        this.loading = false
      })
    },
    // 查看
    seeOne(row) {
      getApiData('pub.getViewFJinfo', {
        dbname: this.params.dbname,
        zcbfid: this.params.zcbfid,
        fjid: row.fjid
      }).then(r => {
        var jsonData = r.data[0]
        // jsonData.origin = window.location.origin + '/'
        location.href = 'cpas://OpenFile/?url=' + encodeURI(jsonData.url) + '&filename=' +
        encodeURI(jsonData.dgmc + jsonData.dglx)
      })
    },
    // 下载
    downloadOne(row) {
      getApiData('pub.getViewFJinfo', {
        dbname: this.params.dbname,
        zcbfid: this.params.zcbfid,
        fjid: row.fjid
      }).then(r => {
        var jsonData = r.data[0]
        var index = jsonData.url.indexOf('/audit_papers')
        var url = jsonData.url.substring(index) // http://111.202.125.171/audit_papers
        var fileName = jsonData.dgmc + jsonData.dglx
        fileservice({
          method: 'get',
          url: url // 请求地址
        }).then((res) => {
          downloadFile(res, fileName)
        }).catch((error) => {
          console.log(error)
          this.$message.error({
            message: '下载失败'
          })
        })
      })
    },
    // 删除
    delOne(scope) {
      const row = scope.row
      const self = this
      this.$confirm('确定要删除附件：' + row.fjname, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getApiData('sjdg.fjDel', {
          dbname: this.params.dbname,
          linkid: row.id
        }).then(r => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          self.data.splice(scope.$index, 1)
        })
      })
    },
    // 双击行 执行打开
    rowDblClick(row, column, event) {
      if (row.lx === 2) return
      this.seeOne(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-icon {
  margin:0 1px;
  cursor: pointer;
}
</style>
