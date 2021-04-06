<template>
  <div class="main">
    <div class="toolbar">
      <el-button type="primary" @click="add()">新增项目</el-button>
      <el-input
        v-model="searchPara.searchText"
        class="searchText"
        placeholder="输入项目名称查找"
        size="mini"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="searchEnter"
        @blur="loaddata()"
      />
    </div>
    <div class="content">
      <el-table />
    </div>
  </div>
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
