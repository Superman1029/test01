<template>
  <div class="main">
    <el-card class="left">
      <div slot="header">
        <span><i class="el-icon-monitor" />用户编号：{{ usercode }}</span>
      </div>
      <el-table :data="products" :show-header="false" highlight-current-row @row-click="rowClick">
        <el-table-column label="产品名称" prop="ProductDesc">
          <template slot-scope="scope">
            <p>{{ scope.row.ProductDesc }}({{ scope.row.cnt }})</p>
            <p style="color: darkgray;">产品编号：{{ scope.row.ProductCode }}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="right">
      <div slot="header">
        <span><i class="el-icon-monitor" />{{ curProduct.ProductDesc }}</span>
      </div>
      <el-table :data="dogs">
        <el-table-column label="Mac地址" prop="MAC" />
        <el-table-column label="最后访问时间" prop="LastWriteTime" />
        <el-table-column :fixed="'right'" label="操作" width="80" align="center">
          <template slot-scope="scope" style="padding:0;">
            <el-button size="mini" type="text" style="padding: 0 !important;" @click="delRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'
export default {
  name: 'UserDogs',
  components: { },
  props: [],
  data() {
    return {
      usercode: '', // 当前用户信息
      curProduct: {},
      products: [], // 产品列表
      dogs: [] // 注册过的设备
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {
  },
  mounted() {
    if (this.$route.query.usercode) {
      this.usercode = this.$route.query.usercode
    } else {
      this.usercode = this.userinfo.usercode
    }
    this.loadProduct()
  },
  methods: {
    loadProduct() {
      getApiData('userdog.product', {
        usercode: this.usercode
      }).then((r) => {
        this.products = r.data
      })
    },
    loadDogs() {
      getApiData('userdog.macList', {
        usercode: this.usercode,
        productcode: this.curProduct.ProductCode
      }).then((r) => {
        this.dogs = r.data
      })
    },
    rowClick(row) {
      this.curProduct = row
      this.loadDogs()
    },
    delRow(row) {
      getApiData('userdog.macDel', {
        usercode: row.Username,
        mac: row.MAC
      }).then(() => {
        this.loadDogs()
        this.curProduct.cnt--
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  width: 1000px;
  margin: 0 auto;
  padding: 10px 0;
}
.left{
  width: 280px;
  float: left;
}
.right{
  width: 710px;
  float: right;
}
::v-deep .el-card__body {
  padding: 0px !important;
}
p {
  margin: 0px;
}
</style>
