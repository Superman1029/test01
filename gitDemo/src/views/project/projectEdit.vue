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
        <el-button type="primary" @click="openGQ()">Q信息整理</el-button>
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
      <el-tabs v-model="info" type="card">
        <el-tab-pane label="基本信息" name="info">
          
        </el-tab-pane>
        <el-tab-pane label="成员列表" name="userList">
          
        </el-tab-pane>
      </el-tabs>
    </template>
  </split-pane>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'

export default {
  name: 'Project',
  components: { },
  props: [],
  data() {
    return {
      loading: false,
      data: [],
      searchPara: {
        searchText: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() { },
  mounted() { },
  methods: {
    // 加载数据库
    loaddata() {
      this.loading = true
      getApiData('pm.list', this.searchPara).then(r => {
        this.data = r.data
        this.loading = false
      })
    },
    // 增加项目
    add() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
