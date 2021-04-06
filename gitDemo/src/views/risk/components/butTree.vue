<template>
  <div class="but-tree">
    <div class="toolbar">
      <el-radio-group v-model="existence" size="mini" @change="getAccountTypeData">
        <el-radio-button label="2">全部账户</el-radio-button>
        <el-radio-button label="1">重大账户</el-radio-button>
        <el-radio-button label="0">其他账户</el-radio-button>
      </el-radio-group>
    </div>
    <el-scrollbar class="beauty-Scroll tree-box">
      <el-tree
        ref="interfaceTable"
        :data="treeData"
        highlight-current
        default-expand-all
        node-key="departmentId"
        @node-click="nodeClick"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'
import { common } from '@/utils/common'

export default {
  props: {},
  data() {
    return {
      existence: '1',
      treeData: []
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  mounted() {
  },
  created() {
  },
  methods: {
    // 账户类型
    getAccountTypeData(acctype) {
      if (acctype) this.existence = acctype
      getApiData('risk.AccountType ', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        acctype: this.existence
      }).then(res => {
        this.treeData = common.list2Tree(res.data)
        // this.$nextTick(() => {
        //   document.querySelector('.el-tree-node__content').click()
        // })
      })
    },
    nodeClick: function(data) {
      this.$emit('clickAccountType', data.itemscode, data.id)
    }
    // this.$nextTick(function() {
    //   this.$refs.interfaceTable.setCurrentRow(this.departmentId[0])
    // });
  }
}
</script>
<style lang="scss" scoped>
.toolbar{
  border-bottom: 1px solid #D4D4D4;
}
  .but-tree {
    border: 1px solid #D4D4D4;
    float: left;
    width: 250px;
    height: 100%;
    //overflow: auto;
    .treeToolbar{
      height: 38px;
      width: 100%;
      .el-button{
        padding: 5px !important;
      }
      .el-button+.el-button{
        padding: 5px !important;
        margin: 0 !important;
      }
      .searchText{
        float: right;
        width: 180px;
      }
    }
    .tree-box {
      height: calc(100% - 38px) !important;
      /*overflow: auto;*/
    }
  }
</style>
