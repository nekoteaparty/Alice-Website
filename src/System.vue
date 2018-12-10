<template>
  <div style="width:500px;">
    <el-form :model="setting" label-width="150px" style="text-align:center;">
      <el-form-item label="网站根路径">
        <el-input v-model="setting.baseUrl" placeholder="https://example.com"></el-input>
      </el-form-item>
      <el-form-item label="FFMPEG路径">
        <el-input v-model="setting.ffmpegPath"></el-input>
      </el-form-item>
      <el-form-item label="Youtube频道黑名单">
        <el-input v-model="setting.bannedYoutubeChannel"></el-input>
      </el-form-item>
      <el-form-item label="B站关键字黑名单">
        <el-input v-model="setting.bannedKeywords"></el-input>
      </el-form-item>
      <el-form-item label="默认转播分辨率">
        <el-input v-model="setting.defaultResolution"></el-input>
      </el-form-item>
      <el-button type="primary" @click="saveSetting()">保&nbsp;&nbsp;存</el-button>
    </el-form>
    <hr>
    <el-form :model="setting" label-width="150px">
      <el-form-item label="OneDrive 授权">
        <el-tag v-if="setting.hasOneDriveToken" type="success">已授权</el-tag>
        <el-tag v-if="!setting.hasOneDriveToken" type="danger">未授权</el-tag>
        <el-button type="primary" size="small" @click="odAuthConfig()">授权配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.od-config .el-message-box__input {
  padding-top: 0px;
}
</style>


<script>
export default {
  data() {
    return {
      setting: {},
      odClientId: undefined,
      odClientSecret: undefined
    };
  },
  created() {
    this.$http.get("/api/system/getSetting.json").then(
      function(response) {
        // 这里是处理正确的回调
        if (response.data.code === 0) {
          this.setting = response.data.data;
        } else {
          this.$message.error(response.data.message);
        }
      },
      function(response) {
        if (response.status === 401) {
          this.$router.push({ path: "/login" });
        }
        this.$message.error("请求失败");
      }
    );
  },
  methods: {
    saveSetting() {
      this.$http.post("/api/system/saveSetting.json", this.setting).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "系统设置已保存",
              type: "success"
            });
          } else {
            this.$message.error(response.data.message);
          }
        },
        function(response) {
          if (response.status === 401) {
            this.$router.push({ path: "/login" });
          }
          this.$message.error("请求失败");
        }
      );
    },
    odAuthConfig() {
      this.$prompt(
        <div class="od-config">
          <p>应用程序ID：</p>
          <el-input v-model={this.odClientId} />
          <p style="margin-bottom:-15px">应用程序密码：</p>
        </div>,
        "授权配置",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /.+/,
          inputErrorMessage: "请输入应用密码"
        }
      )
        .then(({ value }) => {
          location.href =
            "/api/onedrive/oauth/config?clientId=" +
            this.odClientId +
            "&clientSecret=" +
            encodeURIComponent(value);
        })
        .catch(() => {});
    }
  }
};
</script>
