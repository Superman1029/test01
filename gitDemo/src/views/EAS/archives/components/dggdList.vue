<template>
  <div style="height: 100%">
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
      <el-table-column prop="EditUser" label="操作人" align="center" />
      <el-table-column prop="EditDate" label="操作时间" align="center" />
      <el-table-column prop="Action" label="动作" align="center" />
      <el-table-column prop="Remark" label="内容说明" align="center" />
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
    loadData(curZcbfinfo) {
      this.curZcbfinfo = curZcbfinfo
      this.loading = true
      getApiData('arc.archiveLogList', {
        dbname: curZcbfinfo.dbname,
        zcbfid: curZcbfinfo.zcbfid
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
