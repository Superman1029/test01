<template>
  <split-pane split="vertical" :default-percent="20">
    <template slot="paneL">
      <zcbfTree @nodeClick="nodeClick" />
    </template>
    <template slot="paneR">
      <div class="importantDg">
        <div class="toolbar">
          组成部分：{{ curZcbfinfo.projectName }}<el-divider direction="vertical" />{{ curZcbfinfo.zcbfName }}
          <el-tag v-if="curZcbfinfo.zcbfName" :type="curZcbfinfo.stack_status==200?'success':'warning'" size="mini">{{ getZcbfzt(curZcbfinfo.stack_status) }}</el-tag>
        </div>
        <div class="toolbar">
          特别关注底稿
        </div>
        <importantDg ref="importantDg" class="table" />
      </div>
      <div class="qStatistics">
        <div class="toolbar">
          Q信息统计(包含 底稿类，风险类)
        </div>
        <qStatistics ref="qStatistics" class="table" />
      </div>
      <div class="dgStatistics">
        <div class="toolbar">
          底稿统计
        </div>
        <dgStatistics ref="dgStatistics" class="table" />
      </div>
    </template>
  </split-pane>
</template>

<script>
import { common } from '@/utils/common'
import zcbfTree from '@/views/sys/home/components/zcbfTree'
import importantDg from '@/views/sys/home/components/importantDg'
import qStatistics from '@/views/sys/home/components/qStatistics'
import dgStatistics from '@/views/sys/home/components/dgStatistics'

export default {
  name: 'Home',
  components: { zcbfTree, importantDg, qStatistics, dgStatistics },
  props: [],
  data() {
    return {
      curZcbfinfo: {}
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    getZcbfzt(zt) {
      return common.getZcbfzt(zt)
    },
    // 选择 组成部分后执行
    nodeClick(zcbfInfo) {
      this.curZcbfinfo = zcbfInfo
      this.$refs.importantDg.loadData(this.curZcbfinfo)
      this.$refs.qStatistics.loadData(this.curZcbfinfo)
      this.$refs.dgStatistics.loadData(this.curZcbfinfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.importantDg{
  height: calc(100% - 282px);
  .table{
    height: calc(100% - 76px);
  }
}
.qStatistics{
  height: 175px;
  .table{
    height: 137px;
  }
}
.dgStatistics{
  height: 107px;
  .table{
    height: 69px;
  }
}
</style>
