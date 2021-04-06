<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <div class="title-color">
        <el-button type="primary" @click="handleAdd()">新增模板</el-button>
      </div>
      <el-table :data="tableData" border fit stripe style="width: 100%" highlight-current-row @row-click="handleCurrentChange">
        <!--<el-table-column type="index" label="序号" width="50" :index="$common.indexMethod"/>-->
        <el-table-column prop="mbcode" label="模板编号">
          <template slot-scope="scope">
            <el-input ref="mbcodeInput" type='number' placeholder="请输入内容" v-show="scope.row.show && scope.row.isnew" v-model="scope.row.mbcode"></el-input>
            <span v-show="!scope.row.show || !scope.row.isnew" width="300px">{{scope.row.mbcode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mbmc" label="模板名称">
          <template slot-scope="scope">
            <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.mbmc"></el-input>
            <span v-show="!scope.row.show">{{scope.row.mbmc}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="PublishDate" label="发布日期">
          <template slot-scope="scope">
            <span>{{scope.row.PublishDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="PublishUser" label="发布人">
          <template slot-scope="scope">
            <span>{{scope.row.PublishUser}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Remark" label="备注">
          <template slot-scope="scope">
            <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.Remark"></el-input>
            <span v-show="!scope.row.show">{{scope.row.Remark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="450">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain :disabled="scope.row.published" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="success" plain :disabled="scope.row.published" @click="handleSave(scope.$index, scope.row)">保存</el-button>
            <el-button size="mini" type="danger" plain @click="handlePublishMb(scope.$index, scope.row)">发布</el-button>
            <el-dropdown>
              <el-button type="primary">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleCancelPublishMb(scope.$index,scope.row)">取消发布</el-dropdown-item>
                <el-dropdown-item :disabled="scope.row.published" @click.native="handleDelete(scope.$index,scope.row)">删除</el-dropdown-item>
                <el-dropdown-item :disabled="scope.row.published" @click.native="handleImport(scope.$index,scope.row)">导入</el-dropdown-item>
                <el-dropdown-item @click.native="handleExportMb(scope.$index,scope.row)">导出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!--<el-button size="mini" type="info" plain @click="handleImport(scope.$index, scope.row)">导入</el-button>-->
            <!--<el-button size="mini" type="info" plain @click="handleExport(scope.$index, scope.row)">导出</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-dialog
      title="导入模板"
      :visible.sync="dialogFileVisible"
      width="410px"
      center>
      <el-col :span="24" :mode="fileForm">
        <el-form>
          <el-form-item>
            <el-upload
              class="upload-file"
              ref="upload"
              action="no"
              :limit="1"
              accept=".rar"
              :before-upload="beforeUpload"
              :http-request="uploadMbRar"
              :auto-upload="false"
              :on-change="fileChange"
              :on-exceed="handleExceed">
              <el-button slot="trigger" size="small" type="primary">选取模板压缩包</el-button>
              <!--<div slot="tip" class="el-upload__tip">支持扩展名：.xls,.xlsx,.doc,.docx,.xlsd,.docd</div>-->
            </el-upload>
          </el-form-item>
        </el-form>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFileVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getApiData } from '@/api/common'
  import { mbManageApi } from '@/api/template'
  import axios from "axios/index";
  import md5 from 'js-md5';
  import { auditPaperApi } from '@/api/template'
  import { Loading } from 'element-ui';
  import { uploadTemplateFile } from '@/api/template'
  import { packTemplateFile } from '@/api/template'
  import { downloadTemplateDG } from '@/api/template'

export default {
  components: { Loading },
  data() {
    return {
      tableData: [],
      dialogFileVisible: false,
      fileForm: {
        fileName: '',
        mbcode: '',
        mbmc: ''
      },
      oldMbmc: ''
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  created() {
    this.getTabelData()
  },
  methods: {
    getTabelData() {
      getApiData('dgmb.getMbType', {
        mbcode: '',
        mbmc: ''
      }).then(res => {
        console.log(res)
        res.data.forEach(element => {
          element['show'] = false
          element['isnew'] = false
          let PublishDate = element['PublishDate']
          if(PublishDate) {
            element['published'] = true
          } else {
            element['published'] = false
          }
        })
        this.tableData = res.data
      })
    },
    handleDelete(index, row) {
      if (row.mbcode || row.mbmc) {
        this.$confirm('确定要删除该模板吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApiData('dgmb.delMbType', {
            mbcode: row.mbcode,
            mbmc: row.mbmc
          }).then(res => {
            console.log(res)
            if (res.code === 0) {
              this.$message({
                message: '数据删除成功',
                type: 'success'
              })
              this.deleteDir(row.mbmc, (valid) => {})
            }
            this.getTabelData()
          })
        }).catch(() => {
        })
      } else {
        this.getTabelData()
        // this.$message.error({
        //   message: '模板编码与模板名称不能同时为空'
        // })
      }
    },
    checkMbType(isnew, mbcode, mbmc, callback) {
      if (isnew) {
        getApiData('dgmb.checkMbType', {
          mbcode: mbcode,
          mbmc: mbmc,
          isnew: isnew
        }).then(res => {
          console.log(res)
          if (res.data.length >= 1) {
            this.$message.warning({
              message: '模板已经存在'
            })
            callback(false)
          } else {
            callback(true)
          }
        })
      } else {
        getApiData('dgmb.checkMbType', {
          mbcode: mbcode,
          mbmc: mbmc
        }).then(res => {
          console.log(res)
          if (res.data.length >= 1) {
            this.$message.warning({
              message: '模板名称已经存在'
            })
            callback(false)
          } else {
            callback(true)
          }
        })
      }
    },
    renameDir(index, row, callback) {
      if(row.mbmc != this.oldMbmc) {
        let src = 'zssys/dgmb/' + this.oldMbmc;
        let dest = 'zssys/dgmb/' + row.mbmc;
        // let url = 'http://111.202.125.171/rename_dir/?src=' + src + '&dest=' + dest
        let url = '/rename_dir/?src=' + src + '&dest=' + dest
        auditPaperApi(url, callback)
        // axios.get(url, {
        //   headers: {
        //     'Authorization': 'Basic dWZvc3l1c2VyOnp6aHhibQ=='
        //   }}).then(res => {
        //   console.log('rename_dir' + res.data)
        // }).catch(() => {
        // })
      }
    },
    deleteDir(mbmc, callback) {
      let path = 'zssys/dgmb/' + mbmc + '/';
      let url = '/delete_files/?path=' + path
      auditPaperApi(url, callback)
    },
    handleSave(index, row) {
      const printStr = '点击保存；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      if(row.show) {
        this.handleSaveData(index, row, false);
      }
    },
    handleSaveData(index, row, publishOnly) {
      console.log(this.userinfo)
      if (row.mbcode && row.mbmc) {
        this.checkMbType(row.isnew, row.mbcode, row.mbmc, (valid) => {
          console.log('valid' + valid)
          if (valid) {
            if(publishOnly && publishOnly == true){
              getApiData('dgmb.saveMbType', {
                mbcode: row.mbcode,
                mbmc: row.mbmc,
                PublishUser: this.userinfo.username,
                Remark: row.Remark
              }).then(res => {
                console.log(res)
                if (res.code === 0) {
                  row.show = false
                  row.isnew = false
                  this.$message({
                    message: '数据保存成功',
                    type: 'success'
                  })
                  // this.renameDir(index, row, (valid) => {})
                  this.getTabelData()
                } else {
                  this.$message.error({
                    message: '数据保存失败'
                  })
                }
              })
            } else {
              getApiData('dgmb.saveMbType', {
                mbcode: row.mbcode,
                mbmc: row.mbmc,
                Remark: row.Remark
              }).then(res => {
                console.log(res)
                if (res.code === 0) {
                  row.show = false
                  row.isnew = false
                  this.$message({
                    message: '数据保存成功',
                    type: 'success'
                  })
                  if(row.isnew === false) {
                    this.renameDir(index, row, (valid) => {})
                  }
                  this.getTabelData()
                } else {
                  this.$message.error({
                    message: '数据保存失败'
                  })
                }
              })
            }
          }
        })
      } else {
        this.$message.warning({
          message: '模板编码和名称不能为空'
        })
      }
    },
    handleEdit(index, row) {
      const printStr = '点击编辑；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      this.tableData.forEach(element => {
        element['show'] = false
      })
      row.show = true
      this.oldMbmc = row.mbmc
    },
    handleAdd() {
      console.log('新增模板类型')
      const rowObj = {}
      rowObj['mbcode'] = ''
      rowObj['mbmc'] = ''
      rowObj['show'] = true
      rowObj['isnew'] = true
      this.tableData.push(rowObj)
      this.$nextTick().then(() => {
        this.$refs.mbcodeInput.focus()
      })
    },
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget)
      // this.tableData.forEach(element => {
      //   element['show'] = false
      // })
      // row.show = true
    },
    beforeUpload(file) {
      console.log('beforUpload:'+file.name);
      // this.fileForm.fileName = file.name
    },
    fileChange(file) {
      this.fileForm.fileName = file.name
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    submitUpload() {
      console.log('fileName:'+this.fileForm.fileName)
      console.log('mbmc:'+this.fileForm.mbmc)
      let filembmc = ''
      let mbmc = this.fileForm.mbmc
      if(this.fileForm.fileName){
        filembmc = this.fileForm.fileName.substring(0, this.fileForm.fileName.lastIndexOf('.'))
      }
      if(filembmc !== mbmc){
        this.$message.warning({
          message: '模板名称与文件名称不一致，不可导入'
        })
      } else {
        this.$refs.upload.submit()
      }
    },
    uploadFile(val) {
      console.log('val' + val.file)
      let fd = new FormData();
      fd.append('file', val.file);
      let subDir = 'zssys/dgmb';
      let options = {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      let loadingInstance = Loading.service(options);
      let url = '/audit_papers_upload/?dir=' + subDir
      uploadTemplateFile(url, fd, subDir, (result) => {
          if(result) {
            this.handleImportMb()
          }
          this.$nextTick(() => {
            loadingInstance.close();
          });
        }
      )
      // axios.post('http://111.202.125.171/audit_papers_upload/', fd, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': 'Basic dWZvc3l1c2VyOnp6aHhibQ==',
      //     'Audit-SubDir': subDir,
      //     'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin',
      //     'Audit-Version': '1',
      //     'Audit-IsNeedUnZip': '1'
      //   }}).then(res => {
      //   console.log('uploadMbFile' + res.data)
      //   this.handleImportMb()
      //   this.$nextTick(() => {
      //     loadingInstance.close();
      //   });
      // }).catch(() => {
      //   this.$message.error({
      //     message: '文件上传失败'
      //   })
      //   this.$nextTick(() => {
      //     loadingInstance.close();
      //   });
      // })
    },
    uploadMbRar(val) {
      this.deleteDir(this.fileForm.mbmc, (valid) => {
          if(valid){
            this.uploadFile(val)
          } else {
            this.$message.error({
              message: '导入失败'
            })
          }
        }
      )
    },
    handleImportMb() {
      mbManageApi('/api/ImportMbToDB', 'post', {
        mbcode: this.fileForm.mbcode,
        mbmc: this.fileForm.mbmc
      }).then(res => {
        console.log('res:'+res)
        if (res.data === true) {
          this.$message({
            message: '导入模板数据成功',
            type: 'success'
          })
          this.dialogFileVisible = false;
        } else {
          this.$message.error({
            message: '导入模板数据失败'
          })
        }
      })
    },
    handleImport(index, row) {
      const printStr = '点击导入；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      this.fileForm.mbcode = row.mbcode
      this.fileForm.mbmc = row.mbmc
      this.fileForm.fileName = ''
      this.dialogFileVisible = true
    },
    handleDownLoadFile(index, row, mbfile, loadingInstance) {
      const printStr = '点击下载；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      // let url = 'http://111.202.125.171/audit_papers/zssys/dgmb/' + mbfile
      let url = '/audit_papers/zssys/dgmb/' + mbfile
      let fileName = row.mbmc + '.rar'
      // let options = {
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // }
      // let loadingInstance = Loading.service(options);
      downloadTemplateDG(url, fileName, loadingInstance)
      // axios({
      //   method: 'get',
      //   url: url, // 请求地址
      //   headers: {
      //     'Authorization': 'Basic dWZvc3l1c2VyOnp6aHhibQ=='
      //   },
      //   responseType: 'blob'
      // }).then((res) => {
      //   console.log(res)
      //   const content = res.data
      //   const blob = new Blob([content])
      //   const fileName = row.mbmc + '.rar'
      //   if ('download' in document.createElement('a')) {
      //     const link = document.createElement('a')
      //     link.download = fileName
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     document.body.appendChild(link)
      //     link.click()
      //     URL.revokeObjectURL(link.href)
      //     document.body.removeChild(link)
      //   } else {
      //     navigator.msSaveBlob(blob, fileName)
      //   }
      //   this.$nextTick(() => {
      //     loadingInstance.close();
      //   })
      // }).catch((error) => {
      //   console.log(error)
      //   this.$message.error({
      //     message: '下载失败'
      //   })
      //   this.$nextTick(() => {
      //     loadingInstance.close();
      //   });
      // })
    },
    handlePublishMb(index, row) {
      const printStr = '点击发布；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      this.handleExport(index, row, true)
    },
    handleCancelPublishMb(index, row) {
      const printStr = '点击发布；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      if (row.mbcode) {
        getApiData('dgmb.cancelPublishMbType', {
          mbcode: row.mbcode,
          PublishUser: this.userinfo.username
        }).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$message({
              message: '取消发布成功',
              type: 'success'
            })
          }
          this.getTabelData()
        })
      } else {
        this.$message.warning({
          message: '模板编码不能为空'
        })
      }
    },
    handleExportMb(index, row) {
      const printStr = '点击导出；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      // let options = {
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // }
      // let loadingInstance = Loading.service(options);
      this.handleExport(index, row, false)
      // this.$nextTick(() => {
      //   loadingInstance.close();
      // })
    },
    handlePack(index, row, publishOnly) {
      const printStr = '压缩；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      let mbfile = row.mbcode + '.rar';
      let subDir = 'zssys/dgmb';
      // window.location = 'http://111.202.125.171/audit_papers/zssys/dgmb/' + row.mbcode + '/' +  dgfile + '?Authorization=Basic dWZvc3l1c2VyOnp6aHhibQ=='
      let url = '/audit_papers_pack/'
      let fd = 'ImpExpInfo.db&' + row.mbmc;
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
            if(!publishOnly) {
              this.handleDownLoadFile(index, row, mbfile, loadingInstance)
            } else {
              this.handleSaveData(index, row, true)
              this.$message.success({
                message: '模板发布成功'
              })
              this.$nextTick(() => {
                loadingInstance.close();
              })
            }
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
    handleExport(index, row, publishOnly) {
      mbManageApi('/api/ExportMbToSqlite', 'post', {
        mbcode: row.mbcode,
        mbmc: row.mbmc
      }).then(res => {
        console.log(res)
        if (res.data === true) {
          this.handlePack(index, row, publishOnly)
        } else {
          this.$message.error({
            message: '导出模板数据失败'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    padding: 0;
    width: 100%;
    height: calc(100vh - 104px);
    position: relative;
  }
</style>
