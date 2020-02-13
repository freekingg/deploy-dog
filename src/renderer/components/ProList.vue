<template>
  <div id="wrapper">
    <Null v-if="!dataList.length" />
    <el-row :gutter="20" class="pro-list">
      <el-col :span="12" v-for="(item, index) in dataList" :key="index">
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>{{ item.projectName }}</span>
            <div>
              <i @click="update(item)" class="el-icon-edit"></i>
              <i @click="remove(item)" class="el-icon-delete"></i>
            </div>
          </div>
          <ul class="prolist">
            <li>
              <span class="label">项目名称:</span>
              <span class="info">{{ item.projectName }}</span>
            </li>
            <li>
              <span class="label">服务器地址:</span>
              <span class="info">{{ item.host }}</span>
            </li>
            <li>
              <span class="label">服务器用户:</span>
              <span class="info">{{ item.username }}</span>
            </li>
            <li>
              <span class="label">服务器密码:</span>
              <span class="info">******</span>
            </li>
            <li>
              <span class="label">服务器端口:</span>
              <span class="info">{{ item.port }}</span>
            </li>
            <li>
              <span class="label">本地目录:</span>
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="item.distPath"
                class="info"
              >
                <span slot="reference">{{ item.distPath }}</span>
              </el-popover>
            </li>
            <li>
              <span class="label">服务器目录:</span>
              <el-popover placement="top-start" trigger="hover" :content="item.webDir" class="info">
                <span slot="reference">{{ item.webDir }}</span>
              </el-popover>
            </li>
          </ul>
          <div class="btns">
            <el-button icon="el-icon-s-promotion" @click="deploy(item)" type="primary">发布</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="实时进度"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >{{ activity.content }}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import Null from "./Null";
export default {
  name: "prolist",
  created() {
    this.getDb();
    ipcRenderer.on("deploy", (event, arg) => {
      this.index++;
      this.activities.unshift({
        content: this.index + "、" + arg,
        timestamp: new Date().toLocaleTimeString(),
        size: "large",
        type: "primary",
        icon: "el-icon-more"
      });
    });
  },
  components: {
    Null
  },
  data() {
    return {
      index: 0,
      dataList: [],
      dialogVisible: false,
      activities: [
        {
          content: "暂无记录",
          timestamp: "2018-04-12 20:46",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        }
      ]
    };
  },
  methods: {
    getDb() {
      this.$db
        .read()
        .get("project")
        .value();
      var dataList = this.$db.get("project").value();
      this.dataList = dataList;
    },
    // 部署
    deploy(config) {
      this.activities = [];
      this.index = 0;
      ipcRenderer.send("deploy", config);
      this.dialogVisible = true;
    },
    update() {
      this.$message({
        message: "静静说等等做修改的功能",
        type: "warning"
      });
    },
    remove(config) {
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$db
          .get("project")
          .remove(config)
          .write();
        this.getDb();
      });
    }
  }
};
</script>

<style scoped>
#wrapper {
  padding: 20px;
  padding-top: 0;
  width: 100vw;
  overflow: auto;
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
.box-card >>> [class*="el-icon-"] {
  cursor: pointer;
}
</style>
