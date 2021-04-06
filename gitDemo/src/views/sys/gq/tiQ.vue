<template>
  <div class="tiQDialog">
    <el-dialog
      v-dialogDrag
      class="abow_dialog"
      :title="title"
      width="90%"
      :visible.sync="visible"
      @opened="tiQopened"
    >
      <qEditList ref="qEditList" :showtarget="false" :zcbf-users="zcbfUsers" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
import qEditList from '@/views/sys/gq/components/qEditList'

export default {
  components: { qEditList },
  props: {
    modid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      title: '',
      qParams: {},
      zcbfUsers: []
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  watch: {
    visible(val) {
      if (!val) this.$refs.qEditList.closeEdit() // 关闭编辑界面
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    // 打开提Q后调用
    tiQopened() {
      // 加载Q数据
      this.$refs.qEditList.loadData(this.qParams)
    },
    show(targetID, targetTitle) {
      if (!this.curProject.zcbfid) {
        this.$message.warning('请先选择组成部分')
        return
      }
      this.title = '提Ｑ《' + targetTitle + ' 》'
      // 加载项目组成员列表
      getApiData('project.users', {
        zcbfid: this.curProject.zcbfid
      }).then(r => {
        this.zcbfUsers = r.data
      })
      this.qParams = {
        dbname: this.curProject.dbname,
        projectid: this.curProject.projectid,
        zcbfid: this.curProject.zcbfid,
        stack_status: this.curProject.stack_status,
        userRole: this.curProject.userRole,
        modid: this.modid,
        targetID: targetID,
        targetTitle: targetTitle
      }
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
