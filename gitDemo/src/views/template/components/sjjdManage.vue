<template>
  <div class="app-container">
    <div class="title-color">
      <el-input v-model="filterText" placeholder="请输入阶段名称查询" size="mini">
        <el-dropdown slot="append" @command="handleCommandMbjd">
          <el-button type="primary">
            阶段<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="published" command="add">新增阶段</el-dropdown-item>
            <el-dropdown-item :disabled="published" command="edit">编辑阶段</el-dropdown-item>
            <el-dropdown-item :disabled="published" command="del">删除阶段</el-dropdown-item>
            <el-dropdown-item command="export">导出模板</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-input>
    </div>
    <el-scrollbar style="height: 100%">
      <tree-mbjd ref="refTree" :treeData="treeData" @handleNodeClick="handleNodeClick"></tree-mbjd>
    </el-scrollbar>

    <el-dialog
      v-el-drag-dialog
      title="模板阶段"
      :visible.sync="dialogFormVisible"
      width="500px"
      center
      @dragDialog="handleDrag"
    >
      <el-form :model="form">
        <el-form-item label="阶段编号" style="margin: 10px;">
          <el-input v-model="form.code" auto-complete="off" size="mini" style="width: 70%;" />
        </el-form-item>
        <el-form-item label="阶段名称" style="margin: 10px;">
          <el-input v-model="form.jdmc" auto-complete="off" size="mini" style="width: 70%;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .app-container {
    padding: 0;
    width: 100%;
    height: calc(100vh - 104px);
    position: relative;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-scrollbar {
    border: 1px solid #f2f4f8;
  }
  .el-input-group__append{
    padding: 0 5px;
  }
</style>

<script>
  import elDragDialog from '@/directive/el-drag-dialog'
  import { getApiData } from '@/api/common'
  import axios from 'axios/index'
  import { common } from '@/utils/common'
  import treeMbjd from '@/views/template/components/treeMbjd'
  import { downloadTemplateDG } from '@/api/template'
  import { Loading } from 'element-ui';
  import { auditPaperApi } from '@/api/template'
  import { mbManageApi } from '@/api/template'
  import { packTemplateFile } from '@/api/template'

  export default {
    directives: { elDragDialog },
    components: { treeMbjd },
    props: {
      mbData: {
        type: Array,
        required: true
      },
      mbSelData: {
        type: String,
        required: true
      },
      tableData : {
        type: Array,
        required: true
      },
      published: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        treeData: [],
        selForm: {
          mbcode: '',
          mbmc: '',
          code: '',
          jdmc: '',
          pjdmc: '',
          label: ''
        },
        form: {
          mbcode: '',
          mbmc: '',
          code: '',
          jdmc: '',
          pjdmc: '',
          label: '',
          isnew: false,
          oldCode: '',
          oldJdmc: '',
          pcode: ''
        },
        dialogFormVisible: false,
        filterText: ''
      }
    },
    created() {
      // this.getMbData()
    },
    methods: {
      getTreeData(mbmc) {
        getApiData('dgmb.getMbSJJDTree', { mbmc: mbmc }).then(r => {
          this.treeData = common.list2Tree(r.data)
          this.$nextTick().then(() => {
            const firstNode = document.querySelector('.el-tree-node')
            firstNode.click()
          })
        })
      },
      handleNodeClick(data) {
        this.selForm.mbcode = data.mbcode
        this.selForm.mbmc = data.mbmc
        this.selForm.code = data.code
        this.selForm.jdmc = data.id
        this.selForm.pjdmc = data.pjdmc
        this.selForm.label = data.label
        if (data.label == '全部') {
          if (this.mbSelData) {
            // this.getTabelData(this.mbSelData, '')
            this.$emit('getTabelData', this.mbSelData, '')
          }
        } else {
          // this.getTabelData(data.mbmc, data.code + '%')
          this.$emit('getTabelData', data.mbmc, data.code + '%')
        }
      },
      // 新增
      handleAddSjjd() {
        // alert('http://' + window.location.hostname + ':' + location.port + '/')
        if (this.mbSelData) {
          if (this.selForm && this.selForm.label) {
            let mbcode = this.selForm.mbcode
            let mbmc = this.selForm.mbmc
            let pjdmc = this.selForm.jdmc
            let pcode = this.selForm.code
            if (this.selForm.label === '全部') {
              mbmc = this.mbSelData
              const item = this.mbData.filter(item => item.mbmc === this.mbSelData)
              if (item && item.length > 0) {
                mbcode = item[0].mbcode
              }
              pjdmc = ''
              pcode = ''
            }
            this.getMbSjjdCode(mbmc, this.selForm.jdmc, this.selForm.code, pjdmc, (rcode) => {
              console.log('mbcode:' + mbcode)
              console.log('this.selForm.code:' + this.selForm.code)
              this.form.mbcode = mbcode
              this.form.mbmc = mbmc
              this.form.code = rcode
              this.form.jdmc = ''
              this.form.pjdmc = pjdmc
              this.form.label = ''
              this.form.isnew = true
              this.form.oldCode = rcode
              this.form.oldJdmc = ''
              this.form.pcode = pcode
              this.dialogFormVisible = true
            })
          } else {
            this.$message.warning({
              message: '请选择一个上级阶段'
            })
          }
        } else {
          this.$message.warning({
            message: '请选择一个模板'
          })
        }
      },
      //编辑
      handelEditSjjd() {
        if (this.mbSelData) {
          if (this.selForm && this.selForm.label) {
            if (this.selForm.label != '全部') {
              this.form.mbcode = this.selForm.mbcode
              this.form.mbmc = this.selForm.mbmc
              this.form.code = this.selForm.code
              this.form.jdmc = this.selForm.jdmc
              this.form.pjdmc = this.selForm.pjdmc
              this.form.label = this.selForm.label
              this.form.isnew = false
              this.form.oldCode = this.selForm.code
              this.form.oldJdmc = this.selForm.jdmc
              this.form.pcode = this.selForm.code.substr(0, this.selForm.code.length - 3)
              this.dialogFormVisible = true;
            }
          } else {
            this.$message.warning({
              message: '请选择一个上级阶段'
            })
          }
        } else {
          this.$message.warning({
            message: '请选择一个模板'
          })
        }
      },
      handleDelSjjd() {
        if (this.selForm.mbmc) {
          if (this.selForm && this.selForm.label) {
            if (this.selForm.label != '全部') {
              this.$confirm('删除审计阶段【' + this.selForm.label + '】，将同时删除阶段下的底稿，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                getApiData('dgmb.delMbSJJD', {
                  jdmc: this.selForm.jdmc,
                  mbmc: this.selForm.mbmc,
                  code: this.selForm.code + '%'
                }).then(res => {
                  console.log(res)
                  if (res.code === 0) {
                    this.$message({
                      message: '数据删除成功',
                      type: 'success'
                    })
                    this.deleteDgFiles()
                    // this.getTreeData(this.mbSelData)
                    // this.getTabelData(this.mbSelData, '')
                  } else {
                    this.$message.error({
                      message: '数据删除失败'
                    })
                  }
                })
              }).catch(() => {
              })
            }
          } else {
            this.$message.warning({
              message: '请选择一个阶段'
            })
          }
        } else {
          this.$message.warning({
            message: '模板名称不能为空'
          })
        }
      },
      deleteDgFile(fileName, callback) {
        let path = 'zssys/dgmb/' + fileName;
        let url = '/delete_files/?path=' + path
        auditPaperApi(url, callback)
      },
      deleteDgFiles() {
        this.tableData.forEach(element => {
          let mbmc = element['mbmc']
          let dgmc = element['dgmc']
          let dglx = element['dglx']
          let fileName = mbmc + '/' + dgmc + dglx
          let fileNameResult = fileName + '.result'
          this.deleteDgFile(fileName, (valid) => {})
          this.deleteDgFile(fileNameResult, (valid) => {})
        })
        this.$nextTick(() => {
          this.getTreeData(this.mbSelData)
        });
      },
      submitForm() {
        if (this.form.code && this.form.jdmc) {
          console.log('this.form.code.substr(0, this.form.code.length - 3):' + this.form.code.substr(0, this.form.code.length - 3))
          console.log('this.form.pcode:' + this.form.pcode)
          if (this.form.code.substr(0, this.form.code.length - 3) === this.form.pcode) {
            if (this.form.isnew) {
              // this.getMbSjjdCode(this.form.mbmc, this.form.jdmc, this.selForm.code, this.form.pjdmc, (rcode) => {
              this.checkMbSjjd(this.form.isnew, this.form.mbmc, this.form.jdmc, this.form.code, this.form.oldJdmc, this.form.oldCode, (valid) => {
                if (valid) {
                  getApiData('dgmb.saveMbSJJD', {
                    mbcode: this.form.mbcode,
                    mbmc: this.form.mbmc,
                    code: this.form.code,
                    jdmc: this.form.jdmc,
                    pjdmc: this.form.pjdmc,
                    oldJdmc: this.form.oldJdmc,
                    oldCode: this.form.oldCode
                  }).then(res => {
                    console.log(res)
                    if (res.code === 0) {
                      this.$message({
                        message: '数据保存成功',
                        type: 'success'
                      })
                      this.dialogFormVisible = false;
                      this.getTreeData(this.mbSelData)
                      // this.getTabelData(this.mbSelData, '')
                    } else {
                      this.$message.error({
                        message: '数据保存失败'
                      })
                    }
                  })
                }
              })
              // })
            } else {
              this.checkMbSjjd(this.form.isnew, this.form.mbmc, this.form.jdmc, this.form.code, this.form.oldJdmc, this.form.oldCode, (valid) => {
                if (valid) {
                  getApiData('dgmb.saveMbSJJD', {
                    mbcode: this.form.mbcode,
                    mbmc: this.form.mbmc,
                    code: this.form.code,
                    jdmc: this.form.jdmc,
                    pjdmc: this.form.pjdmc,
                    oldJdmc: this.form.oldJdmc,
                    oldCode: this.form.oldCode
                  }).then(res => {
                    console.log(res)
                    if (res.code === 0) {
                      this.$message({
                        message: '数据保存成功',
                        type: 'success'
                      })
                      this.dialogFormVisible = false;
                      this.getTreeData(this.mbSelData)
                      // this.getTabelData(this.mbSelData, '')
                    } else {
                      this.$message.error({
                        message: '数据保存失败'
                      })
                    }
                  })
                }
              })
            }
          } else {
            this.$message.warning({
              message: '阶段编码格式错误'
            })
          }
        } else {
          this.$message.warning({
            message: '阶段编码和名称不能为空'
          })
        }
      },
      checkMbSjjd(isnew, mbmc, jdmc, code, oldJdmc, oldCode, callback) {
        if (isnew) {
          getApiData('dgmb.checkMbSJJD', {
            isnew: isnew,
            mbmc: mbmc,
            jdmc: jdmc,
            code: code
          }).then(res => {
            console.log(res)
            if (res.data.length >= 1) {
              this.$message.warning({
                message: '阶段已经存在'
              })
              callback(false)
            } else {
              callback(true)
            }
          })
        } else {
          getApiData('dgmb.checkMbSJJD', {
            mbmc: mbmc,
            jdmc: jdmc,
            code: code,
            oldJdmc: oldJdmc,
            oldCode: oldCode
          }).then(res => {
            console.log(res)
            if (res.data.length >= 1) {
              this.$message.warning({
                message: '阶段已经存在'
              })
              callback(false)
            } else {
              callback(true)
            }
          })
        }
      },
      getMbSjjdCode(mbmc, jdmc, code, pjdmc, callback) {
        getApiData('dgmb.getMbSJJDCode', {
          mbmc: mbmc,
          pjdmc: pjdmc
        }).then(res => {
          console.log(res)
          if (res.data && res.data.length > 0 && res.data[0].code) {
            let newcode = res.data[0].code
            callback(newcode)
          } else {
            if (code) {
              callback(code + '001')
            } else {
              callback('001')
            }
          }
        })
      },
      handleCommandMbjd(command) {
        if (command === 'add') {
          this.handleAddSjjd()
        } else if (command === 'edit') {
          this.handelEditSjjd()
        } else if (command === 'del') {
          this.handleDelSjjd()
        } else if (command === 'export') {
          this.handleExport()
        }
      },
      handleDrag() {
        this.$refs.select.blur()
      },
      handleDownLoadFile(mbmc, mbfile, loadingInstance) {
        let url = '/audit_papers/zssys/dgmb/' + mbfile
        let fileName = mbmc + '.rar'
        downloadTemplateDG(url, fileName, loadingInstance)
      },
      handlePack(mbmc, mbcode) {
        let mbfile = mbcode + '.rar';
        let subDir = 'zssys/dgmb';
        let url = '/audit_papers_pack/'
        let fd = 'ImpExpInfo.db&' + mbmc;
        let options = {
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }
        let loadingInstance = Loading.service(options);
        packTemplateFile(url, fd, subDir, mbfile, (valid) => {
            console.log('valid:' + valid)
            if(valid) {
              this.handleDownLoadFile(mbmc, mbfile, loadingInstance)
            } else {
              this.$message.error({
                message: '模板发布失败'
              })
              this.$nextTick(() => {
                loadingInstance.close();
              })
            }
          }
        )
      },
      filterChange:function () {
        console.log(this.input3)
        this.$refs.tree2.filterNode(this.input3);
      },
      handleExport() {
        if (this.mbSelData) {
          let mbmc = this.mbSelData
          let mbcode = ''
          let item = this.mbData.filter(item => item.mbmc === this.mbSelData)
          if (item && item.length > 0) {
            mbcode = item[0].mbcode
          }
          mbManageApi('/api/ExportMbToSqlite', 'post', {
            mbcode: mbcode,
            mbmc: mbmc
          }).then(res => {
            console.log(res)
            if (res.data === true) {
              this.handlePack(mbmc, mbcode)
            } else {
              this.$message.error({
                message: '导出模板数据失败'
              })
            }
          })
        } else {
          this.$message.warning({
            message: '请选择一个模板'
          })
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.refTree.$refs.tree.filter(val.trim())
      }
    },
  }
</script>
