<template>
  <div class="tree-table-style2">
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      size="mini"
      border
      stripe
      highlight-current-row
      row-key="id"
      height="100%"
      :row-style="rowStyle"
    >
      <el-table-column prop="dgsyh" label="索引号" width="60" :formatter="(r,c,v)=>{return r.lx=='sjdg'?v:''}" />
      <el-table-column prop="dgmc" style="padding-left:10px;" label="步骤(底稿)名称">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.lx=='risk'?'risk':'file'" />
          <span style="margin-left: 5px">{{ scope.row.dgmc }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="HomePageRemark" label="推送说明" :formatter="(r,c,v)=>{return v || '<还未编辑>'}" />
      <el-table-column prop="dgbyuser" label="编制人" />
      <el-table-column prop="ReviewUser" label="复核人">
        <template slot-scope="scope">
          <span v-html="reviewFormatter(scope.row.ReviewUser)" />
        </template>
      </el-table-column>
      <el-table-column prop="xmhhr" label="合伙人" />
      <el-table-column label="操作" width="75" align="center">
        <template v-if="scope.row.id" slot-scope="scope">
          <svg-icon class="icon-size table-icon" icon-class="see" @click="seeOne(scope.row)" />
          <svg-icon v-if="scope.row.lx=='sjdg'" class="icon-size table-icon" icon-class="download2" @click="uploadOne(scope.row)" />
          <el-dropdown v-if="scope.row.lx=='sjdg'" trigger="click">
            <span class="el-dropdown-link">
              <svg-icon class="icon-size table-icon" icon-class="menu" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-chat-dot-round" @click.native="rowMenuItemClick('tiq', scope.row)">提Q</el-dropdown-item>
              <el-dropdown-item icon="el-icon-collection-tag" @click.native="sign(scope.row)">签署</el-dropdown-item>
              <el-dropdown-item icon="el-icon-collection-tag" @click.native="cancelSign(scope.row)">取消签署</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <ti-q ref="tiQ" :modid="'sjdg'" />
    <sign-dia ref="signDia" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData, openDG, downloadDG } from '@/api/common'
import { getNowTime } from '@/utils'
import tiQ from '@/views/sys/gq/tiQ'
import signDia from '@/views/components/signDia'

export default {
  components: { tiQ, signDia },
  props: {
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
      loading: false,
      data: [],
      curZcbfinfo: {}
    }
  },
  computed: {
    ...mapGetters(['userinfo', 'curProject'])
  },
  watch: {},
  created() {},
  methods: {
    // 复核人 格式化
    reviewFormatter(value) {
      if (value) return value.replace(/;/g, '<br>')
    },
    // 行样式
    rowStyle({ row, rowIndex }) {
      if (!row.id) { // 之前 是按 dgbyuser 的 现在改为上传后为实体
        return { color: '#c7c2c2' }
      } else {
        return {}
      }
    },
    // 加载数据
    loadData(zcbfInfo) {
      if (zcbfInfo) this.curZcbfinfo = zcbfInfo
      this.loading = true
      getApiData('nav.tbgzdg', {
        dbname: this.curZcbfinfo.dbname,
        zcbfid: this.curZcbfinfo.zcbfid
      }).then(r => {
        this.data = r.data
        this.loading = false
      })
    },
    // 查看
    seeOne(row) {
      if (row.lx === 'sjdg') {
        openDG({
          dbname: this.curZcbfinfo.dbname,
          usercode: this.userinfo.usercode,
          zcbfid: this.curZcbfinfo.zcbfid,
          dgid: row.dgnd + row.dgmc
        })
      } else {
        if (this.curZcbfinfo.zcbfid !== this.curProject.zcbfid) {
          this.$store.dispatch('common/changeCurProject', this.curZcbfinfo)
          this.$message.success('当前项目已切换到--' + this.curZcbfinfo.zcbfName)
        }
        this.$router.push({ path: '/' + row.id })
      }
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
    // 签署
    sign(row) {
      if (row.dgbyuser === this.userinfo.username) {
        this.$message.warning('复核人和编制人不能为同一个人。')
        return
      }
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
          dbname: self.curZcbfinfo.dbname,
          projectid: self.curZcbfinfo.projectid,
          zcbfid: self.curZcbfinfo.zcbfid,
          signname: data.name,
          signdate: data.time,
          dgids: "'" + row.dgnd + row.dgmc + "'"
        }).then(r => {
          this.$message.success('签署成功')
          sender.visible = false
          self.loadData()
        })
      })
    },
    // 取消签署
    cancelSign(row) {
      const self = this
      getApiData('sjdg.signFHR', {
        cancel: 1,
        dbname: this.curZcbfinfo.dbname,
        projectid: this.curZcbfinfo.projectid,
        zcbfid: this.curZcbfinfo.zcbfid,
        signname: this.userinfo.username,
        signdate: '',
        dgids: "'" + row.dgnd + row.dgmc + "'"
      }).then(r => {
        this.$message.success('取消签署成功')
        self.loadData()
      })
    },
    // 更多菜单 单击事件
    rowMenuItemClick(itemid, row) {
      if (this.curZcbfinfo.zcbfid !== this.curProject.zcbfid) {
        this.$store.dispatch('common/changeCurProject', this.curZcbfinfo)
        this.$message.success('当前项目已切换到--' + this.curZcbfinfo.zcbfName)
      }
      if (itemid === 'tiq') {
        this.$refs.tiQ.show(row.dgnd + row.dgmc, row.dgnd + row.dgmc)
      }
    },
    // 双击行 执行打开
    rowDblClick(row, column, event) {
      if (!row.id) return
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
.xx{
  color: #a5a6aa;
}
</style>
