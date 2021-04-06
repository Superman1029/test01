<template>
  <div class="content">
    <div class="toolbar">
      <el-button type="primary" @click="onAdd()">增加许可</el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        height="100%"
        border
      >
        <el-table-column prop="LicenseName" label="许可证名称" width="180" />
        <el-table-column prop="ProductDesc" label="许可产品" width="180" />
        <el-table-column prop="ProductCode" label="产品编号" width="180" />
        <el-table-column prop="AuthCount" label="授权数量" width="180" />
        <el-table-column prop="EffDate" label="生效日期" width="180" />
        <el-table-column prop="DueDate" label="到期时间" width="180" />
        <el-table-column prop="Memo" label="备注" width="180" />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="onDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      :visible.sync="licenseDrawer"
    >
      <el-form label-width="100px" :model="license">
        <el-form-item label="许可证名称">
          <el-input v-model="license.LicenseName" />
        </el-form-item>
        <el-form-item label="产品">
          <el-select v-model="license.ProductCode" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in products"
              :key="item.ProductCode"
              :label="item.ProductDesc"
              :value="item.ProductCode"
            >
              <span style="float: left">{{ item.ProductDesc }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ProductCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权数量">
          <el-input-number v-model="license.AuthCount" controls-position="right" :min="0" :max="100000" />
        </el-form-item>
        <el-form-item label="有效期">
          <el-col :span="11">
            <el-date-picker v-model="license.EffDate" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker v-model="license.DueDate" type="date" placeholder="永久" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="license.Memo" type="textarea" :rows="2" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData, updateTable } from '@/api/common'
import { utils } from '@/utils'

export default {
  name: 'License',
  props: [],
  data() {
    return {
      tableData: [],
      products: [], // 产品列表
      license: {}, // 当前许可信息
      licenseDrawer: false
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.loadProductLicense()
    getApiData('sys.productList', {}).then(r => {
      this.products = r.data
    })
  },
  methods: {
    loadProductLicense() {
      getApiData('sys.productLicense', {}).then(r => {
        this.tableData = r.data
      })
    },
    onAdd() {
      this.license.rowState = 'insert'
      this.license.LicenseID = utils.newGUID()
      this.license.LicenseName = '产品许可名称'
      this.license.AuthCount = 50
      this.license.EffDate = utils.getNowDate('date')
      //
      this.licenseDrawer = true
    },
    onView(row) {
      this.license = row
    },
    onDel(row) {
      alert('删除')
    },
    onSubmit() {
      const data = this.license
      updateTable('sys_ProductLicense', ['LicenseID'], data).then(r => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.loadProductLicense()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  height: 100%;
  .table{
    height: calc(100% - 35px - 35px);
  }
}
</style>
