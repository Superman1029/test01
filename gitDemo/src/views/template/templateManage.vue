<template>
  <div class="app-container">
    <div class="title-color">
      模板：
      <el-select v-model="mbSelData" placeholder="请选择模板" size="mini" @change="handleChange">
        <el-option
          v-for="item in mbData"
          :key="item.mbcode"
          :label="item.mbmc"
          :value="item.mbmc"
        />
      </el-select>
      <el-button type="primary" :disabled="published" @click="handleAdd()">新增底稿</el-button>
      <el-button type="primary" :disabled="published" @click="handleBatDelete()">删除底稿</el-button>
    </div>
    <split-pane ref="splitPane" split="vertical" :min-percent="2" :default-percent="20">
      <template slot="paneL">
        <sjjd-manage ref="sjjdManage" :mbData="mbData" :mbSelData="mbSelData" :tableData="tableData" :published="published" @getTabelData="getTabelData"></sjjd-manage>
      </template>
      <template slot="paneR">
        <el-scrollbar style="height: 100%">
          <el-table ref="multipleTable" :data="tableData"
                    border fit stripe
                    style="width: 100%"
                    highlight-current-row
                    @row-click="handleCurrentChange"
                    @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="50" :index="$common.indexMethod"/>
            <el-table-column prop="dgsyh" label="索引号" width="100">
              <template slot-scope="scope">
                <el-input placeholder="请输入内容" v-model="scope.row.dgsyh" v-show="scope.row.show"></el-input>
                <span v-show="!scope.row.show">{{scope.row.dgsyh}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dgmc" label="底稿名称">
            </el-table-column>
            <el-table-column prop="dglx" label="文件格式" width="80">
            </el-table-column>
            <el-table-column prop="lx2" label="底稿类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.lx2" multiple placeholder="请选择" v-show="scope.row.show">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span v-show="!scope.row.show">{{scope.row.lx}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="jdmc" label="阶段名称">
              <template slot-scope="scope">
                <el-input placeholder="请输入内容" v-model="scope.row.jdmc" v-show="scope.row.show" readonly=true @click.native="handleClick(scope.$index, scope.row)"></el-input>
                <span v-show="!scope.row.show">{{scope.row.jdmc}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="mbmc" label="模板名称">
            </el-table-column>
            <el-table-column label="操作" width="260">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain :disabled="published" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="success" plain :disabled="published" @click="handleSave(scope.$index, scope.row)">保存</el-button>
                <!--<el-button size="mini" type="danger" plain @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                <el-dropdown>
                  <el-button type="primary">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :disabled="published" @click.native="handleDelete(scope.$index,scope.row)">删除</el-dropdown-item>
                    <el-dropdown-item :disabled="published" @click.native="handleReplace(scope.$index,scope.row)">替换</el-dropdown-item>
                    <!--<el-dropdown-item @click.native="handleOpenFile(scope.$index,scope.row)">查看</el-dropdown-item>-->
                    <el-dropdown-item @click.native="handleDownLoadFile(scope.$index,scope.row)">下载</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </template>
    </split-pane>

    <el-dialog
    v-el-drag-dialog
    title="上传底稿文件"
    :visible.sync="dialogFileVisible"
    width="410px"
    center>
    <!--<el-col :span="24" :mode="fileForm">-->
      <el-form>
        <el-form-item>
          <el-upload
            class="upload-file"
            ref="upload"
            action="no"
            :limit="1"
            accept=".xls,.xlsx,.doc,.docx,.xlsd,.docd"
            :before-upload="beforeUpload"
            :file-list="fileForm.fileList"
            :http-request="uploadDgFile"
            :auto-upload="false"
            :on-change="fileChange"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
          >
            <el-button slot="trigger" size="small" type="primary" style="margin: 10px;">选取文件</el-button>
            <!--<div slot="tip" class="el-upload__tip">支持扩展名：.xls,.xlsx,.doc,.docx,.xlsd,.docd</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="索引号(*)" v-show="fileForm.fileFormShow" size="mini" style="width: 400px;margin: 10px;">
          <el-input v-model="fileForm.dgsyh" auto-complete="off" style="width: 290px;"></el-input>
        </el-form-item>
        <el-form-item label="底稿类型" v-show="fileForm.fileFormShow" size="mini" style="width: 400px;margin: 10px;">
          <el-select v-model="fileForm.lx2" multiple placeholder="请选择" style="width: 290px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    <!--</el-col>-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFileVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitUpload()">确 定</el-button>
    </div>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="选择阶段"
      :visible.sync="dialogSelSJJDVisible"
      width="550px"
      center>
      <!--<div>-->
        <!--<el-scrollbar style="height: 100%">-->
          <tree-mbjd :treeData="selTreeData" @handleNodeClick="handleNodeClick"></tree-mbjd>
        <!--</el-scrollbar>-->
      <!--</div>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelSJJDVisible = false">取 消</el-button>
        <el-button type="primary" @click="selSJJDOk()">确 定</el-button>
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

<script src="./templateManage.js"></script>
