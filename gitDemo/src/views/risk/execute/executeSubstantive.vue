<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" @onloaded="onloaded">
      <div slot="title-left">
        执行实质性程序
      </div>
      <div slot="content">
        <but-tree ref="butTree" :tree-data="treeData" />
        <el-scrollbar class="beauty-Scroll">
          <el-table :data="tableData" border fit stripe highlight-current-row style="width: 100%;">
            <el-table-column type="index" width="40" :index="$common.indexMethod" />
            <el-table-column prop="ItemName" label="报表项目" />
            <el-table-column prop="KMMC" label="明细项目" />
            <el-table-column prop="QCSDS" label="期初余额" />
            <el-table-column label="期末余额">
              <el-table-column prop="WSS" label="调整前" />
              <el-table-column prop="TZJFJE" label="借方调整" />
              <el-table-column prop="TZDFJE" label="贷方调整" />
              <el-table-column prop="SDS" label="调整后" />
            </el-table-column>
            <el-table-column prop="BDBL" label="变动比例" />
            <el-table-column prop="DGSYH" label="索引号" />
          </el-table>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" title="本科目中涉及的关键审计事项">
              <div v-show="isShow" style="padding: 10px 0;">
                <el-input
                  v-model="textarea"
                  type="textarea"
                  :rows="2"
                  :disabled="true"
                />
                <!-- placeholder="请输入内容" -->
                <div style="padding:10px;">
                  <span>审计结论</span>
                  <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
    </risk-layout>
  </div>
</template>

<script>
import butTree from '@/views/risk/components/butTree'
import riskLayout from '@/views/risk/components/riskLayout'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'
import { common } from '@/utils/common'

export default {
  name: 'SP006',
  components: { riskLayout, butTree },
  data() {
    return {
      tableData: [],
      treeData: [],
      activeNames: ['1'],
      isShow: true,
      textarea: '',
      value: '',
      options: []
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {
  },
  methods: {
    // 风险界面加载
    onloaded() {
      this.$refs.butTree.getAccountTypeData('1')
    }
  }
}
</script>

<style lang="scss" scoped>
.beauty-Scroll{
  float: right;
  width: calc(100% - 250px);
}
</style>
