<template>
  <div id="wrapper">
    <el-row :gutter="24" class="pro-list">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>说明</span>
          </div>
          <div style="padding-bottom:16px">适用:目前还在采用手工部署又期望快速实现轻量化部署的小团队或者个人项目</div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
            >{{ activity.content }}</el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "about",
  created() {
    var dataList = this.$db.get("project").value();
  },
  data() {
    return {
      activities: [
        {
          content: "1、打包指定目录文件",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        },
        {
          content: "2、ssh连接服务器",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        },
        {
          content: "3、上传打包的文件",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        },
        {
          content: "4、解压并移动到服务器目录",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        },
        {
          content: "5、删除上传的压缩文件",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        },
        {
          content: "6、完成",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        }
      ]
    };
  }
};
</script>

<style scoped>
#wrapper {
  padding: 20px;
  width: 100vw;
  overflow: hidden;
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
