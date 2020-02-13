<template>
  <div class="addpro">
    <el-row :gutter="24" class="pro-list">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header">
            <span>添加项目</span>
          </div>
          <el-form ref="ruleForm" :model="form" :rules="rules" label-width="95px">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="服务器地址" prop="host">
              <el-input v-model="form.host" placeholder="请输入远程服务器连接地址 如:10.22.55.66"></el-input>
            </el-form-item>
            <el-form-item label="服务器用户" prop="username">
              <el-input v-model="form.username" placeholder="请输入服务器用户名 如:root"></el-input>
            </el-form-item>
            <el-form-item label="服务器密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入服务器密码 如:123456"></el-input>
            </el-form-item>
            <el-form-item label="服务器端口">
              <el-input v-model="form.port"></el-input>
            </el-form-item>
            <el-form-item label="本地目录" prop="distPath">
              <el-input v-model="form.distPath" placeholder="请选择需要打包上传的目录"></el-input>
              <input type="file" @change="getDistPath" webkitdirectory directory />
            </el-form-item>
            <el-form-item label="服务器目录" prop="webDir">
              <el-input v-model="form.webDir" placeholder="请选择需要部署的服务器目录 如 /home/app/demo"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  created() {},
  data() {
    return {
      form: {
        projectName: "",
        host: "",
        username: "",
        password: "",
        port: "22",
        distPath: "",
        webDir: ""
      },
      rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        host: [
          {
            required: true,
            message: "请输入远程服务器连接地址",
            trigger: "blur"
          }
        ],
        username: [
          { required: true, message: "请输入服务器用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入服务器密码", trigger: "blur" }
        ],
        distPath: [
          {
            required: true,
            message: "请选择需要打包上传的目录",
            trigger: "blur"
          }
        ],
        webDir: [
          {
            required: true,
            message: "请选择需要部署的服务器目录",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    getDistPath(e) {
      var files = e.target.files;
      if (files.length) {
        this.form.distPath = files[0].path;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$db
            .get("project")
            .push(this.form)
            .write();
          this.$message({
            message: "恭喜你，添加项目成功",
            type: "success"
          });
          this.$refs[formName].resetFields();
          this.$router.push("/");
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.addpro {
  padding: 20px;
  padding-top: 0;
  width: 100vw;
}
</style>
