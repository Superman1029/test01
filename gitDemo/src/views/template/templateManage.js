import elDragDialog from '@/directive/el-drag-dialog'
import { getApiData } from '@/api/common'
import axios from 'axios/index'
import { common } from '@/utils/common'
import sjjdManage from '@/views/template/components/sjjdManage'
import { downloadTemplateDG } from '@/api/template'
import { openTemplateDG } from '@/api/template'
import { Loading } from 'element-ui';
import { uploadDgFile } from '@/api/template'
import { auditPaperApi } from '@/api/template'
import treeMbjd from '@/views/template/components/treeMbjd'

export default {
  directives: { elDragDialog },
  components: { sjjdManage, treeMbjd },
  data() {
    return {
      mbData: [],
      mbSelData: '',
      published: false,
      tableData: [],
      multipleSelection: [],
      options: [{
        value: '实质性测试',
        label: '实质性测试'
      }, {
        value: '非C类项目适用',
        label: '非C类项目适用'
      }, {
        value: 'C类项目参考使用',
        label: 'C类项目参考使用'
      }],
      optionsMb: [],
      titleMap: {
        addEquipment:'新增设备',
        editEquipment: "编辑设备"
      },
      dialogStatus: '',
      dialogFileVisible: false,
      fileForm: {
        fileList: [],
        mbcode: '',
        mbmc: '',
        jdmc: '',
        dgmc: '',
        dglx: '',
        lx: '',
        lx2: [],
        dgsyh: '',
        fileFormShow: false,
        isnew: false,
        fileName: '',
        oldDgmc: '',
        oldDglx: '',
        oldDgsyh: ''
      },
      clickRow: [],
      selTreeData: [],
      selTreeForm: {
        mbcode: '',
        mbmc: '',
        code: '',
        jdmc: '',
        pjdmc: '',
        label: ''
      },
      dialogSelSJJDVisible: false
    }
  },
  created() {
    this.getMbData()
  },
  methods: {
    getTabelData(mbmc, jdcode) {
      getApiData('dgmb.getMbSJDG', {
        mbmc: mbmc,
        jdcode: jdcode
      }).then(res => {
        // console.log(res)
        // this.tableData = res.data
        res.data.forEach(element => {
          element['show'] = false
          element['lx2'] = element['lx'].replace(/\s+/g, '') == '' ? [] : element['lx'].replace(/\s+/g, '').split('，')
        })
        this.tableData = res.data
        console.log(res)
      })
    },
    getMbData() {
      getApiData('dgmb.getMbType', {
        mbmc: '',
        jdcode: ''
      }).then(res => {
        res.data.forEach(element => {
          let PublishDate = element['PublishDate']
          if(PublishDate) {
            element['published'] = true
          } else {
            element['published'] = false
          }
        })
        this.mbData = res.data
      })
    },
    handleDelete(index, row) {
      if (row.mbmc && row.dgmc) {
        this.$confirm('确定要删除该底稿吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getApiData('dgmb.delMbSJDG', {
            dgmc: row.dgmc,
            mbmc: row.mbmc
          }).then(res => {
            console.log(res)
            if (res.code === 0) {
              this.$message({
                message: '数据删除成功',
                type: 'success'
              })
              let fileName = row.mbmc + '/' + row.dgmc + row.dglx
              let fileNameResult = fileName + '.result'
              this.deleteDgFile(fileName, (valid) => {})
              this.deleteDgFile(fileNameResult, (valid) => {})
              let label = this.$refs.sjjdManage.selForm.label
              let mbmc = this.$refs.sjjdManage.selForm.mbmc
              let code = this.$refs.sjjdManage.selForm.code
              if (label === '全部' || label === '') {
                if (this.mbSelData) {
                  this.getTabelData(this.mbSelData, '')
                }
              } else {
                this.getTabelData(mbmc, code + '%')
              }
            } else {
              this.$message.error({
                message: '数据删除失败'
              })
            }
          })
        }).catch(() => {
        })
      } else {
        this.$message.error({
          message: '模板名称和底稿名称不能为空'
        })
      }
    },
    handleReplace(index, row) {
      const printStr = '点击替换；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      this.fileForm.mbcode = row.mbcode
      this.fileForm.mbmc = row.mbmc
      this.fileForm.jdmc = row.jdmc
      this.fileForm.dgmc = row.dgmc
      this.fileForm.oldDgmc = row.dgmc
      this.fileForm.oldDglx = row.dglx
      this.fileForm.dgsyh = row.dgsyh
      this.fileForm.oldDgsyh = row.dgsyh
      this.fileForm.dglx = row.dglx
      this.fileForm.lx = row.lx
      this.fileForm.lx2 = row.lx2
      this.fileForm.fileList = []
      this.fileForm.fileFormShow = false
      this.fileForm.isnew = false
      this.dialogFileVisible = true
    },
    handleDownLoadFile(index, row) {
      const printStr = '点击下载；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      let dgfile = row.dgmc + row.dglx;
      let url = '/audit_papers/zssys/dgmb/' + row.mbmc + '/' + dgfile
      let options = {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      let loadingInstance = Loading.service(options);
      downloadTemplateDG(url, dgfile, loadingInstance)
    },
    handleOpenFile(index, row) {
      const printStr = '点击查看；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      let dgfile = row.dgmc + row.dglx;
      let url = '/audit_papers/zssys/dgmb/' + row.mbmc + '/' + dgfile
      openTemplateDG(url)
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
    handleSave(index, row) {
      this.checkMbSjdgSyh(row.mbmc, row.dgmc, row.dgsyh, (valid) => {
        if (valid) {
          row.lx = row.lx2.join('，')
          if(this.fileForm.isnew && this.fileForm.isnew === true) {
            getApiData('dgmb.saveMbSJDG', {
              mbcode: row.mbcode,
              mbmc: row.mbmc,
              jdmc: row.jdmc,
              dgmc: row.dgmc,
              dglx: row.dglx,
              dgsyh: row.dgsyh,
              lx: row.lx
            }).then(res => {
              console.log(res)
              if (res.code === 0) {
                row.show = false
                row.isnew = false
                this.$message({
                  message: '数据保存成功',
                  type: 'success'
                })
              } else {
                this.$message.error({
                  message: '数据保存失败'
                })
              }
            })
          } else {
            getApiData('dgmb.saveMbSJDG', {
              mbcode: row.mbcode,
              mbmc: row.mbmc,
              jdmc: row.jdmc,
              dgmc: row.dgmc,
              dglx: row.dglx,
              dgsyh: row.dgsyh,
              lx: row.lx,
              oldDgmc: this.fileForm.oldDgmc
            }).then(res => {
              console.log(res)
              if (res.code === 0) {
                row.show = false
                row.isnew = false
                this.$message({
                  message: '数据保存成功',
                  type: 'success'
                })
              } else {
                this.$message.error({
                  message: '数据保存失败'
                })
              }
            })
          }
        } else {
          this.$message.error({
            message: '底稿索引号已经存在'
          })
        }
      })
    },
    handleEdit(index, row) {
      const printStr = '点击编辑；index=' + index + '；row=' + JSON.stringify(row)
      console.log(printStr)
      this.fileForm.mbcode = row.mbcode
      this.fileForm.mbmc = row.mbmc
      this.fileForm.jdmc = row.jdmc
      this.fileForm.dgmc = row.dgmc
      this.fileForm.oldDgmc = row.dgmc
      this.fileForm.oldDglx = row.dglx
      this.fileForm.dgsyh = row.dgsyh
      this.fileForm.oldDgsyh = row.dgsyh
      this.fileForm.dglx = row.dglx
      this.fileForm.lx = row.lx
      this.fileForm.lx2 = row.lx2
      this.fileForm.fileList = []
      this.fileForm.isnew = false
      row.show = true
      this.$set(this.tableData, this.currentRow, row)
    },
    handleAdd() {
      console.log('新增模板底稿')
      if (this.mbSelData) {
        if (this.$refs.sjjdManage.selForm && this.$refs.sjjdManage.selForm.label) {
          if (this.$refs.sjjdManage.selForm.label != '全部') {
            this.fileForm.mbcode = this.$refs.sjjdManage.selForm.mbcode
            this.fileForm.mbmc = this.$refs.sjjdManage.selForm.mbmc
            this.fileForm.jdmc = this.$refs.sjjdManage.selForm.jdmc
            this.fileForm.dgmc = ''
            this.fileForm.oldDgmc = ''
            this.fileForm.oldDglx = ''
            this.fileForm.dgsyh = ''
            this.fileForm.oldDgsyh = ''
            this.fileForm.dglx = ''
            this.fileForm.lx = this.$refs.sjjdManage.selForm.lx
            this.fileForm.lx2 = this.$refs.sjjdManage.selForm.lx2
            this.fileForm.fileList = []
            this.fileForm.fileFormShow = true
            this.fileForm.isnew = true
            this.dialogFileVisible = true
          } else {
            this.$message.warning({
              message: '请选择一个下级阶段'
            })
          }
        } else {
          this.$message.warning({
            message: '请选择一个阶段'
          })
        }
      } else {
        this.$message.warning({
          message: '请选择一个模板'
        })
      }
    },
    checkMbSjdg(isnew, mbmc, jdmc, dgmc, oldDgmc, oldDglx, callback) {
      if (isnew) {
        getApiData('dgmb.checkMbSJDG', {
          mbmc: mbmc,
          jdmc: jdmc,
          dgmc: dgmc
        }).then(res => {
          console.log(res)
          if (res.data.length >= 1) {
            this.$message.warning({
              message: '底稿已经存在'
            })
            callback(false)
          } else {
            callback(true)
          }
        })
      } else if (dgmc != oldDgmc) {
        getApiData('dgmb.checkMbSJDG', {
          mbmc: mbmc,
          jdmc: jdmc,
          dgmc: dgmc
        }).then(res => {
          console.log(res)
          if (res.data.length >= 1) {
            this.$message.warning({
              message: '底稿已经存在'
            })
            callback(false)
          } else {
            callback(true)
          }
        })
      } else {
        callback(true)
      }
    },
    checkMbSjdgSyh(mbmc, dgmc, dgsyh, callback) {
      getApiData('dgmb.checkMbSJDGsyh', {
        mbmc: mbmc,
        dgsyh: dgsyh,
        dgmc: dgmc
      }).then(res => {
        console.log(res)
        if (res.data.length >= 1) {
          this.$message.warning({
            message: '底稿索引号已经存在'
          })
          callback(false)
        } else {
          callback(true)
        }
      })
    },
    handleCurrentChange(row, event, column) {
      // console.log(row, event, column, event.currentTarget)
    },
    handleChange(params) {
      console.log('params:' + params)
      const item = this.mbData.filter(item => item.mbmc === this.mbSelData)
      if (item && item.length > 0) {
        this.published = item[0].published
      }
      this.$refs.sjjdManage.getTreeData(params)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    uploadSectionFile: function (params) {
      console.log('params' + params);
      var self = this,
        file = params.file,
        fileType = file.type,
        file_url = self.$refs.upload.uploadFiles[0].url;
      self.uploadFile(file);
    },
    beforeUpload(file) {
      console.log('beforUpload:' + file.name);
    },
    submitUpload() {
      if(!this.fileForm.fileName || !this.fileForm.dgsyh){
        this.$message.warning({
          message: '底稿索引号和底稿文件不能为空'
        })
      } else {
        this.$refs.upload.submit()
      }
    },
    fileChange(file) {
      console.log('file'+file)
      this.fileForm.fileName = file.name
    },
    handleRemove(file, fileList) {
      this.fileForm.fileName = ''
    },
    uploadFile(val) {
      console.log('val' + val.file)
      let fd = new FormData();
      fd.append('file', val.file);
      let subDir = 'zssys/dgmb/' + this.$refs.sjjdManage.selForm.mbmc;
      let options = {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      };
      let loadingInstance = Loading.service(options);
      let url = '/audit_papers_upload/?dir=' + subDir;
      uploadDgFile(url, fd, subDir, (result) => {
          if(result) {
            this.handleSaveDg()
          } else {
            this.$message.error({
              message: '文件上传失败'
            })
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
      //     'Audit-NoUTF8': '1'
      //   }
      // }).then(res => {
      //   // uploadMbFile('/audit_papers_upload', fd, subDir, {}).then(res => {
      //   console.log('uploadMbFile' + res.data)
      //   this.handleSaveDg()
      // }).catch(() => {
      //   this.$message.error({
      //     message: '文件上传失败'
      //   })
      // })
    },
    uploadDgFile(val) {
      console.log('uploadDgFile' + val.file)
      let dgFileName = this.fileForm.fileName
      this.fileForm.dgmc = dgFileName.substring(0, dgFileName.indexOf('.'))
      this.fileForm.dglx = dgFileName.substring(dgFileName.indexOf('.')).toLowerCase()
      if(this.fileForm.lx2){
        this.fileForm.lx = this.fileForm.lx2.join('，')
      }else{
        this.fileForm.lx=''
      }
      console.log('isnew:' + this.fileForm.isnew)
      if (this.fileForm.isnew) {
        console.log('dgmc:' + this.fileForm.dgmc)
        if (this.fileForm.dgmc) {
          this.checkMbSjdg(this.fileForm.isnew, this.fileForm.mbmc, this.fileForm.jdmc,
            this.fileForm.dgmc, this.fileForm.oldDgmc, this.fileForm.oldDglx, (valid) => {
              if (valid) {
                this.checkMbSjdgSyh(this.fileForm.mbmc, this.fileForm.dgmc, this.fileForm.dgsyh, (valid) => {
                  if (valid) {
                    this.uploadFile(val)
                  } else {
                    this.$message.error({
                      message: '底稿索引号已经存在'
                    })
                  }
                })
              }
            })
        } else {
          this.$message.error({
            message: '底稿名称不能为空'
          })
        }
      } else {
        if (this.fileForm.dgmc != this.fileForm.oldDgmc) {
          this.checkMbSjdg(this.fileForm.isnew, this.fileForm.mbmc, this.fileForm.jdmc,
            this.fileForm.dgmc, this.fileForm.oldDgmc, this.fileForm.oldDglx, (valid) => {
              if (valid) {
                let fileName = this.fileForm.mbmc + '/' + this.fileForm.oldDgmc + this.fileForm.oldDglx
                let fileNameResult = fileName + '.result'
                this.deleteDgFile(fileName, (valid) => {})
                this.deleteDgFile(fileNameResult, (valid) => {})
                this.uploadFile(val)
              }
          })
          // this.$message.warning({
          //   message: '底稿文件名称与底稿名称不一致'
          // })
        } else if (this.fileForm.dglx != this.fileForm.oldDglx) {
          let fileName = this.fileForm.mbmc + '/' + this.fileForm.oldDgmc + this.fileForm.oldDglx
          let fileNameResult = fileName + '.result'
          this.deleteDgFile(fileName, (valid) => {})
          this.deleteDgFile(fileNameResult, (valid) => {})
          this.uploadFile(val)
        } else {
          this.uploadFile(val)
          // this.dialogFileVisible = false;
        }
      }
    },
    handleSaveDg() {
      if(this.fileForm.isnew){
        getApiData('dgmb.saveMbSJDG', {
          mbcode: this.fileForm.mbcode,
          mbmc: this.fileForm.mbmc,
          dgsyh: this.fileForm.dgsyh,
          jdmc: this.fileForm.jdmc,
          dgmc: this.fileForm.dgmc,
          dglx: this.fileForm.dglx,
          lx: this.fileForm.lx
        }).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$message({
              message: '数据保存成功',
              type: 'success'
            })
            this.dialogFileVisible = false;
            let code = this.$refs.sjjdManage.selForm.code
            this.getTabelData(this.mbSelData, code)
          } else {
            this.$message.error({
              message: '数据保存失败'
            })
          }
        })
      } else {
        getApiData('dgmb.saveMbSJDG', {
          mbcode: this.fileForm.mbcode,
          mbmc: this.fileForm.mbmc,
          dgsyh: this.fileForm.dgsyh,
          jdmc: this.fileForm.jdmc,
          dgmc: this.fileForm.dgmc,
          dglx: this.fileForm.dglx,
          lx: this.fileForm.lx,
          oldDgmc: this.fileForm.oldDgmc
        }).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$message({
              message: '数据保存成功',
              type: 'success'
            })
            this.dialogFileVisible = false;
            let code = this.$refs.sjjdManage.selForm.code
            this.getTabelData(this.mbSelData, code)
          } else {
            this.$message.error({
              message: '数据保存失败'
            })
          }
        })
      }
    },
    handleDrag() {
      this.$refs.select.blur()
    },
    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach(row => {
    //       this.$refs.multipleTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.multipleTable.clearSelection();  //清空选项，项目中：请求接口后，重新请求数据渲染页面的时候，使用此方式，清空选中勾选状态。
    //   }
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteDgFile(fileName, callback) {
      let path = 'zssys/dgmb/' + fileName;
      let url = '/delete_files/?path=' + path
      auditPaperApi(url, callback)
    },
    handleBatDelete() {
      this.$confirm('确定要删除该底稿吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(item => {
          if (item.mbmc && item.dgmc) {
            getApiData('dgmb.delMbSJDG', {
              dgmc: item.dgmc,
              mbmc: item.mbmc
            }).then(res => {
              console.log(res)
              let fileName = item.mbmc + '/' + item.dgmc + item.dglx
              let fileNameResult = fileName + '.result'
              this.deleteDgFile(fileName, (valid) => {})
              this.deleteDgFile(fileNameResult, (valid) => {})
            })
          }
        })
        let label = this.$refs.sjjdManage.selForm.label
        let mbmc = this.$refs.sjjdManage.selForm.mbmc
        let code = this.$refs.sjjdManage.selForm.code
        if (label == '全部' || label == '') {
          if (this.mbSelData) {
            this.getTabelData(this.mbSelData, '')
          }
        } else {
          this.getTabelData(mbmc, code + '%')
        }
      }).catch(() => {
      })
    },
    handleNodeClick(data) {
      this.selTreeForm.mbcode = data.mbcode
      this.selTreeForm.mbmc = data.mbmc
      this.selTreeForm.code = data.code
      this.selTreeForm.jdmc = data.id
      this.selTreeForm.pjdmc = data.pjdmc
      this.selTreeForm.label = data.label
    },
    handleClick(index, row) {
      this.clickRow = row
      this.getSelTreeData()
      this.dialogSelSJJDVisible = true
    },
    selSJJDOk() {
      if (!this.selTreeForm.jdmc || this.selTreeForm.label === '全部' || this.selTreeForm.jdmc === '') {
        this.$message.info({
          message: '请选择一个有效的阶段'
        })
      } else {
        this.clickRow.jdmc = this.selTreeForm.jdmc
        this.dialogSelSJJDVisible = false;
      }
    },
    getSelTreeData() {
      this.selTreeData = this.$refs.sjjdManage.treeData
    }
  }
}
