<template>
  <el-card class="main-card">
    <div slot="header" class="clearfix">
      <span>档案借阅</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <el-form :model="datainfo" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请人：">
            <el-input v-model="datainfo.EditUser" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间：">
            <el-input v-model="datainfo.EditUser" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'BorrowList',
  components: { },
  props: [],
  data() {
    return {
      datainfo: { }
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      getApiData('arc.borrowList1', {}).then((r) => {
        this.tableData = r.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-card{
  margin: 0 auto;
}
</style>
