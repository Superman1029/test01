<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      size="mini"
      border
      stripe
      highlight-current-row
      height="100%"
    >
      <el-table-column prop="dgc" label="本组成部分上传底稿/本项目上传底稿" align="center" />
      <el-table-column prop="fjc" label="本组成部分上传附件/本项目上传附件" align="center" />
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'

export default {
  props: { },
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
    // 加载数据
    loadData(zcbfInfo) {
      this.curZcbfinfo = zcbfInfo
      this.loading = true
      getApiData('nav.dgCont', {
        dbname: zcbfInfo.dbname,
        projectid: zcbfInfo.projectid,
        zcbfid: zcbfInfo.zcbfid
      }).then(r => {
        this.data = r.data
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
