<template>
  <div id="wrapper">
    <el-row :gutter="22" class="pro-list">
      <el-col :span="22">
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>projectName</span>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >{{activity.content}}</el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "log",
  created() {
    var dataList = this.$db.get("project").value();
  },
  data() {
    return {
      activities: [
        {
          content: "暂无记录",
          timestamp: "2018-04-12 20:46",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        },
      ]
    };
  }
};
</script>

<style scoped>
#wrapper {
  width: 90%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card >>> .el-card__header {
  padding-top: 10px;
  padding-bottom: 10px;
}
.label {
  display: inline-block;
  width: 80px;
}
.prolist {
  color: #606266;
  font-size: 14px;
  line-height: 25px;
}
.prolist li {
  display: flex;
}
.info {
  flex: 1;
  word-break: break-all;
  word-wrap: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btns {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}
</style>
