<template>
  <split-pane split="vertical" :default-percent="20">
    <template slot="paneL">
      <div class="toolbar">
        <el-input v-model="filterText" placeholder="输入关键字进行过滤" size="mini">
          <el-dropdown slot="append" @command="modCommand">
            <el-button type="primary">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">增加模块</el-dropdown-item>
              <el-dropdown-item command="addChild">增加子模块</el-dropdown-item>
              <el-dropdown-item command="del">删除模块</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-input>
      </div>
      <el-scrollbar class="tree">
        <el-tree
          ref="modTree"
          highlight-current
          :data="treeData"
          node-key="id"
          default-expand-all
          :min-percent="10"
          :default-percent="20"
          :props="{label: 'title'}"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          @node-click="nodeClick"
        >
          <!--span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="() => remove(node, data)"
              />
            </span>
          </span-->
        </el-tree>
      </el-scrollbar>
    </template>
    <template slot="paneR">
      <el-scrollbar style="height: 100%;overflow-x: hidden;">
        <el-form ref="nodeForm" :model="nodeForm" :rules="rules" label-width="100px" size="mini" class="form">
          <el-form-item label="id" prop="id">
            <el-input v-model="nodeForm.id" />
          </el-form-item>
          <el-form-item label="pid" prop="pid">
            <el-input v-model="nodeForm.pid" />
          </el-form-item>
          <el-form-item label="名称" prop="title">
            <el-input v-model="nodeForm.title" />
          </el-form-item>
          <el-form-item label="类型">
            <el-col :span="11">
              <el-select v-model="nodeForm.type" placeholder="请选择类型" value-key="value">
                <el-option label="菜单" :value="11" />
                <el-option label="模块" :value="12" />
              </el-select>
            </el-col>
            <el-col class="line" :span="4">排序：</el-col>
            <el-col :span="9">
              <el-input-number v-model="nodeForm.xh" :min="0" :max="100" />
            </el-col>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="nodeForm.icon" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="nodeForm.name" />
          </el-form-item>
          <el-form-item label="路径" prop="path">
            <el-input v-model="nodeForm.path" />
          </el-form-item>
          <el-form-item label="分组" prop="groups">
            <el-input v-model="nodeForm.groups" />
          </el-form-item>
          <el-form-item label="component" prop="component">
            <el-input v-model="nodeForm.component" />
          </el-form-item>
          <el-form-item label="角色" prop="roles">
            <el-select v-model="nodeForm.roles" multiple placeholder="请选择角色">
              <el-option
                v-for="item in rolelist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input v-model="nodeForm.memo" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="是否启用" prop="state">
            <el-switch v-model="nodeForm.state" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="缓存页面" prop="state">
            <el-switch v-model="nodeForm.keepAlive" active-color="#13ce66" inactive-color="#ff4949" :active-value="true" :inactive-value="false" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('nodeForm')">保存</el-button>
            <!-- <el-button @click="resetForm('nodeForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </template>
  </split-pane>
</template>

<script>
import { getApiData, updateTable } from '@/api/common'
import { common } from '@/utils/common'
import { utils } from '@/utils'

export default {
  name: 'MenuManage',
  props: [],
  data() {
    return {
      filterText: '',
      rolelist: [{
        value: '超级管理员',
        label: '超级管理员'
      }, {
        value: '档案管理员',
        label: '档案管理员'
      }, {
        value: '知识库管理员',
        label: '知识库管理员'
      }, {
        value: '系统管理员',
        label: '系统管理员'
      }],
      treeData: [],
      curNode: {}, // 当前选中节点
      nodeForm: {},
      rules: {
        id: [
          { required: true, message: '请输入模块编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.modTree.filter(val)
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    loadTreeData: function() {
      getApiData('sys.menuTree', {}).then(r => {
        this.treeData = common.list2Tree(r.data)
      })
    },
    nodeClick: function(data) {
      // console.log(data)
      this.curNode = data
      this.nodeForm = Object.assign({}, data)
      delete this.nodeForm.children
      this.nodeForm.rowState = 'update'
      this.nodeForm.roles = JSON.parse(data.roles)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /**
     * 保存
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.nodeForm)
          const self = this
          updateTable('sys_modsNew', ['id'], [this.nodeForm]).then(r => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            if (self.nodeForm.rowState === 'update') {
              self.curNode = Object.assign(self.curNode, self.nodeForm)
              delete self.curNode['rowState']
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 操作
    modCommand(command) {
      let modid = ''
      if (command === 'addChild' || command === 'del') {
        if (!this.nodeForm.id) {
          this.$message({
            message: '请选择一个节点',
            type: 'error'
          })
          return
        } else {
          modid = this.nodeForm.id
        }
      }
      if (command.substr(0, 3) === 'add') {
        this.nodeForm = {}
        this.nodeForm.rowState = 'insert'
        this.nodeForm.id = utils.newGUID()
        this.nodeForm.state = 1
        if (command === 'addChild') {
          this.nodeForm.pid = modid
        }
      } else {
        this.$message({
          message: '暂不实现',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar{
  height: 35px;
  width: 100%;
  padding: 5px;
  .el-button{
    padding: 5px !important;
  }
}
.tree{
  height: calc(100% - 35px);
}
  .splitter-paneL{
    width: 30px;
  }
  .el-input{
    width: 100%;
    max-width: 100%;
  }
  .vue-splitter-container{
    border: 1px solid #d9d9d9;
  }
  .splitter-pane.vertical.splitter-paneL{
    border-right: 1px solid #d9d9d9;
  }
  .form{
    padding: 20px;
    width: 500px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
