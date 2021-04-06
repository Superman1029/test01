<template>
  <div class="change-Project">
    <el-dialog
      v-el-drag-dialog
      title="选择项目(默认加载50行，可按项目编号/名称搜索)"
      :visible.sync="isShowChangePro"
      width="1000px"
      @opened="loadProject"
      @close="changePro"
      @dragDialog="handleDrag"
    >
      <split-pane ref="splitPane" split="vertical" :min-percent="30" class="pane-box">
        <template slot="paneL">
          <el-row class="toolbar">
            <el-col :span="6">
              <el-select v-model="xmzt" placeholder="请选择" style="width: 100%;" @change="loadProject">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-input v-model="searchTextxm" placeholder="输入项目编号名称搜索..." prefix-icon="el-icon-search" clearable @change="loadProject" />
            </el-col>
          </el-row>
          <el-table v-loading="loading" :data="projectData" fit border stripe :height="'calc(100% - 28px)'" highlight-current-row @row-click="loadZcbf">
            <el-table-column prop="sjxmbh" label="项目编号" show-overflow-tooltip />
            <el-table-column prop="sjxmmc" label="项目名称" show-overflow-tooltip />
            <el-table-column prop="ssbm" label="所属部门" show-overflow-tooltip />
          </el-table>
        </template>
        <template slot="paneR">
          <div class="toolbar">
            <el-input v-model="searchTextzcbf" placeholder="输入组成部分名称搜索..." prefix-icon="el-icon-search" clearable @change="loadZcbf" />
          </div>
          <el-table v-loading="loading" :data="zcbfData" border fit stripe :height="'calc(100% - 28px)'" highlight-current-row @row-dblclick="changeProSure" @row-click="selectComponent">
            <el-table-column prop="sjxmbh" label="子项目编号" show-overflow-tooltip />
            <el-table-column prop="sjxmmc" label="被服务单位" show-overflow-tooltip />
            <el-table-column
              prop="stack_status"
              label="状态"
              show-overflow-tooltip
              width="100"
              :formatter="formatstatus"
            />
          </el-table>
        </template>
      </split-pane>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeProSure">确 定</el-button>
        <el-button @click="changePro">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'

export default {
  directives: { elDragDialog },
  data() {
    return {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '190',
        label: '未归档'
      }, {
        value: '200',
        label: '已归档'
      }],
      loading: false,
      xmzt: '', // 当前项目状态
      ProjectID: '',
      searchTextxm: '',
      searchTextzcbf: '',
      projectData: [],
      zcbfData: [],
      selectRow: {} // 选择的项目信息
    }
  },
  computed: {
    ...mapGetters(['isShowChangePro', 'userinfo'])
  },
  created() {
  },
  methods: {
    loadProject() { // 获取项目信息
      this.loading = true
      getApiData('project.list', {
        usercode: this.userinfo.usercode, // this.$store.state.user.userinfo.username
        xmzt: this.xmzt,
        searchText: this.searchTextxm
      }).then(res => {
        this.projectData = res.data
        this.loading = false
      })
    },
    loadZcbf(row) { // 获取组成部分信息
      if (row.ProjectID !== undefined) {
        this.ProjectID = row.ProjectID
      }
      getApiData('project.zcbfList', {
        usercode: this.userinfo.usercode,
        projectID: this.ProjectID,
        searchText: this.searchTextzcbf
      }).then(res => {
        this.zcbfData = res.data
      })
    },
    selectComponent(row) {
      // this.selectRow = row
      getApiData('project.curZcbfInfo', {
        usercode: this.userinfo.usercode,
        ProjectID: row.ProjectID,
        zcbfid: row.zcbfid
      }).then(res => {
        this.selectRow = res.data
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
    },
    // 关闭弹窗
    changePro() {
      this.$store.dispatch('common/changeProject', false)
    },
    // 切换的确定按钮
    changeProSure() {
      if (!this.selectRow) return
      this.$store.dispatch('common/changeCurProject', this.selectRow)
      this.$store.dispatch('common/changeProject', false)
      this.refreshView()
    },
    formatstatus(row, col) {
      return (row.stack_status === 190 ? '未归档' : row.stack_status === 200 ? '已归档' : '未知')
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    }
  }
}
</script>
<style lang="scss">
  .change-Project {
    .el-dialog__body {
      height: 500px;
      padding: 0 20px;
    }
    .el-input {
      max-width: 100%;
    }
    .pane-box {
      height: 100%;
    }
  }
</style>
