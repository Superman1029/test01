<template>
  <el-scrollbar style="height: 100%;">
    <el-container class="main">
      <el-aside class="left" width="50px">
        <el-divider>天职国际审计导航</el-divider>
      </el-aside>
      <el-main class="right">
        <el-row>
          <el-col :span="24" class="title"><div class="line">计划和风险识别</div></el-col>
        </el-row>
        <el-row class="focus">
          <el-col :span="4" @click.native="showstep('PR001')"><div class="grid-content marginSmall bg-purple">完成初步业务活动</div></el-col>
          <el-col :span="4" @click.native="showstep('PR002')"><div class="grid-content marginSmall bg-purple">了解被审计单位及其环境</div></el-col>
          <el-col :span="4" @click.native="showstep('PR004')"><div class="grid-content marginSmall bg-purple">了解被审计单位整体层面控制</div></el-col>
          <el-col :span="4" @click.native="showstep('PR005')"><div class="grid-content marginSmall bg-purple">识别由于舞弊而导致的重大错报风险</div></el-col>
          <el-col :span="4" @click.native="showstep('PR006')"><div class="grid-content marginSmall bg-purple-dark">确定重要性水平</div></el-col>
          <el-col :span="4" @click.native="showstep('PR007')"><div class="grid-content marginSmall bg-purple-dark">识别重大账户和披露以及相关认定</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="title"><div class="line">策略和风险评估</div></el-col>
        </el-row>
        <el-row>
          <el-col class="focus" :span="4" @click.native="showstep('TR001')"><div class="grid-content marginlarge bg-purple">识别重大交易类别和重大披露流程以及相关的IT应用程序</div></el-col>
          <el-col :span="2">
            <div class="grid-content">
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('TR002')"><div style="font-size: 12px;" class="contentLarge bg-purple-dark">了解交易流程和可能出错项及控制</div></el-col>
              </el-row>
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('TR003')"><div class="contentLarge  bg-purple">执行穿行测试</div></el-col>
              </el-row>
            </div>
          </el-col>
          <el-col class="focus" :span="2" @click.native="showstep('TR004')"><div class="grid-content marginlarge bg-purple">了解和评价财务报表决算过程</div></el-col>
          <el-col class="focus" :span="2" @click.native="showstep('TR006')"><div class="grid-content marginlarge bg-purple">选择拟测试的控制</div></el-col>
          <el-col :span="2">
            <div class="grid-content">
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('TR007')"><div class="contentSmall bg-purple">了解ITGC</div></el-col>
              </el-row>
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('TR008')"><div style="font-size: 10px;" class="contentSmall bg-purple">设计和执行ITGC测试</div></el-col>
              </el-row>
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('TR009')"><div class="contentSmall bg-purple">评价ITGC</div></el-col>
              </el-row>
            </div>
          </el-col>
          <el-col class="focus" :span="4" @click.native="showstep('TR010')"><div class="grid-content marginlarge bg-purple-dark">综合风险评估</div></el-col>
          <el-col :span="4">
            <div class="grid-content">
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('TR012')"><div style="font-size: 10px;" class="contentLarge bg-purple">设计会计分录测试和其他与舞弊相关的审计程序</div></el-col>
              </el-row>
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('TR013')"><div class="contentLarge bg-purple-dark">设计实质性程序</div></el-col>
              </el-row>
            </div>
          </el-col>
          <el-col class="focus" :span="4" @click.native="showstep('TR015')"><div class="grid-content marginlarge bg-purple">编制总体审计策略</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="title"><div class="line">执行阶段</div></el-col>
        </el-row>
        <el-row class="focus">
          <el-col :span="4" @click.native="showstep('SP001')"><div class="grid-content marginSmall bg-purple">执行控制测试</div></el-col>
          <el-col :span="8" @click.native="showstep('SP002')"><div class="grid-content marginSmall bg-purple">执行会计分录测试和其他与舞弊事项相关的审计程序</div></el-col>
          <el-col :span="4" @click.native="showstep('SP006')"><div class="grid-content marginSmall bg-purple">执行实质性程序</div></el-col>
          <el-col :span="8" @click.native="showstep('SP007')"><div class="grid-content marginSmall bg-purple">执行其他事项程序</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="title"><div class="line">结论和报告</div></el-col>
        </el-row>
        <el-row>
          <el-col class="focus" :span="4" @click.native="showstep('CR001')"><div class="grid-content marginMiddle bg-purple">编制审计差异汇总表</div></el-col>
          <el-col class="focus" :span="4" @click.native="showstep('CR002')"><div class="grid-content marginMiddle bg-purple">编制内部控制缺陷汇总表及控制例外事项汇总表</div></el-col>
          <el-col :span="4">
            <div class="grid-content">
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('CR003')"><div class="contentMiddle bg-purple">实施财务报表分析程序</div></el-col>
              </el-row>
              <el-row class="focus">
                <el-col :span="24" @click.native="showstep('CR004')"><div class="contentMiddle bg-purple">编制审计总结</div></el-col>
              </el-row>
            </div>
          </el-col>
          <el-col class="focus" :span="4" @click.native="showstep('CR005')"><div class="grid-content marginMiddle bg-purple-dark">总体复核与批准</div></el-col>
          <el-col class="focus" :span="4" @click.native="showstep('CR006')"><div class="grid-content marginMiddle bg-purple">编制和提交与被审计单位的沟通文档</div></el-col>
          <el-col class="focus" :span="4" @click.native="showstep('CR007')"><div class="grid-content marginMiddle bg-purple">审计底稿的整理与归档</div></el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-scrollbar>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    showstep(stepcode) {
      this.$router.push({ path: '/' + stepcode })
    }
  }
}

</script>
<style lang="scss" scoped>
.el-divider--horizontal {
  height: 100%;
  width: 4px;
  margin: 0 8px;
  display: inline-block;
  position: relative;
  background-color: red;
}

.el-divider__text.is-center {
  top: 50%;
  font-size: 18px;
  font-weight: 600;
  padding: 10px;
}
.main {
  background-color: #ffffff;
  width: 1020px;
  height: 640px;
  text-align: center;
  vertical-align: middle;
  margin: auto;
  .left {
    overflow: hidden;
    padding: 15px 0;
    .leftline{
      display: inline-block;
      width: 4px;
      height: 100%;
      margin: 0 8px;
      vertical-align: middle;
      position: relative;
      background-color: red;
      .leftlinetitle{
        position: absolute;
        background-color: #fff;
        padding: 0 20px;
        font-weight: 500;
        color: #303133;
        font-size: 14px;
      }
    }
  }
  .vLine {
    &:after {
      content: "";
      margin-left: 15px;
      padding-left: 15px;
      border-left: 1px solid #E70012;
      height: 12px;
      display: inline-block;
      vertical-align: middle;
  }
  }
  .right {
    width: 970px;
    font-size: 13px;
    height: 100%;
    .title{
      height: 30px;
      margin-left: -15px;
      .line{
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 600;
        text-align: left;
        vertical-align: middle;
        margin-top: 5px;
        border-left: 4px solid red;
        padding-left: 10px;
      }
    }
  .focus {
    cursor: pointer;
    :hover{
      transform: scale(1.02);/*鼠标放上之后元素变成1.02倍大小*/
      color:var(--defaultColor);
    }
  }
  .grid-content{
    border-radius: 4px;
    margin: 3px;
  }
  .marginSmall{
    height: 70px;
    padding: 0px 5px;
  }
  .marginMiddle{
    height: 100px;
    padding: 0px 5px;
  }
  .marginlarge{
    height: 140px;
    padding: 0px 5px;
  }
  .contentSmall {
    border-radius: 4px;
    height: 40px;
    padding: 10px 5px;
  }
  .contentMiddle {
    border-radius: 4px;
    height: 45px;
    padding: 15px 5px;
  }
  .contentLarge {
    border-radius: 4px;
    height: 65px;
    padding: 10px 5px;
  }
  .bg-purple{
    background: #d3dce6;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .bg-purple-dark {
    background: #99a9bf;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .el-row {
    margin-bottom: 10px;
    &:last-child {
     margin-bottom: 0;
    }
  }
  }
}
</style>
