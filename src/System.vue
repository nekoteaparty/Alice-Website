<template>
  <div class="setting" style="width:500px;">
    <el-form :model="setting" label-width="150px" style="text-align:center;">
      <el-form-item label="网站根路径">
        <el-input size="small" v-model="setting.baseUrl" placeholder="https://example.com"></el-input>
      </el-form-item>
      <el-form-item label="FFMPEG路径">
        <el-input size="small" v-model="setting.ffmpegPath"></el-input>
      </el-form-item>
      <el-form-item label="Youtube频道黑名单">
        <el-input size="small" v-model="setting.bannedYoutubeChannel"></el-input>
      </el-form-item>
      <el-form-item label="B站关键字黑名单">
        <el-input size="small" v-model="setting.bannedKeywords"></el-input>
      </el-form-item>
      <el-form-item label="默认转播分辨率">
        <el-input size="small" v-model="setting.defaultResolution"></el-input>
      </el-form-item>
      <el-form-item label="启动预编码功能" style="text-align: left;">
        <el-checkbox v-model="setting.preReEncode"></el-checkbox>
        <el-tooltip
          class="item"
          effect="dark"
          content="用于对进行区域打码的720P/60FPS视频进行预编码，降低转码服务器的性能需求，会占用爱丽丝所在服务器的CPU资源，转码服务器和爱丽丝共用一台服务器的不建议开启。"
          placement="top"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="系统安全秘钥">
        <el-input size="small" v-model="setting.encodeKey"></el-input>
        <span style="color:red;">
          <i class="el-icon-warning"></i>&nbsp;警告:修改安全秘钥将会导致AP卡密失效！
        </span>
      </el-form-item>
      <el-form-item label="服务器性能AP点数">
        <el-input size="small" v-model="setting.serverPoints"></el-input>
      </el-form-item>
      <el-form-item label="AP点数店铺地址">
        <el-input size="small" v-model="setting.apShopUrl"></el-input>
      </el-form-item>
      <el-button size="small" type="primary" @click="saveSetting()">保&nbsp;&nbsp;存</el-button>
    </el-form>
    <hr>
    <el-form :inline="true" :model="generatorConf">
      <el-form-item label="面值">
        <el-input size="small" maxlength="4" v-model="generatorConf.point" style="width:80px"></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input size="small" maxlength="4" v-model="generatorConf.count" style="width:80px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="cardGenerator()">生成AP点数卡密</el-button>
      </el-form-item>
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
.setting .el-form-item {
  margin-bottom: 10px;
}
</style>


<script>
export default {
  data() {
    return {
      setting: {},
      generatorConf: {},
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
      if (this.setting.serverPoints) {
        if (!(this.setting.serverPoints instanceof Array)) {
          this.setting.serverPoints = this.setting.serverPoints.split(",");
        }
      }
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
    cardGenerator() {
      let formData = new FormData();
      formData.append("point", this.generatorConf.point);
      formData.append("count", this.generatorConf.count);
      this.$http
        .post("/api/system/cardGenerator.json", formData)
        .then(
          function(response) {
            if (response.data.code === 0) {
              this.$msgbox(
                <el-input
                  type="textarea"
                  rows="10"
                  value={response.data.data}
                />,
                "生成AP点数卡密",
                {
                  confirmButtonText: "确定"
                }
              );
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
