<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">通知设置</span>（控制接收方签署过程的所有通知）</el-divider>
    <br />
    <div class="btnbox">
      <span>短信</span>
      <el-switch v-model="value" :width="70" height="100" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
    </div>
    <div class="btnbox">
      <span>站内信</span>
      <el-switch v-model="value1" :width="70" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: true,
      value1: true,
    }
  }
}
</script>
<style scoped>
.title {
  font-weight: 700;
  font-size: 20px;
}
.btnbox {
  display: flex;
  align-items: center;
  margin: 10px;
}
.btnbox span {
  display: inline-block;
  min-width: 100px;
  text-align: right;
  font-size: 20px;
  margin-right: 10px;
}
.btnbox ::v-deep .el-switch__core {
  height: 30px;
  border-radius: 20px;
}
.btnbox ::v-deep .el-switch__core::after {
  height: 28px;
  width: 28px;
  top: 0;
}
.btnbox ::v-deep .el-switch.is-checked .el-switch__core::after {
  margin-left: -28px;
}
.btnbox ::v-deep .el-switch .el-switch__core::after {
  margin-left: -1px;
}
</style>
