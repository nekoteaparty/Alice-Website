<template>
    <el-form :model="setting" label-width="150px" style="width:500px;text-align:center;">
        <el-form-item label="发送B站开播动态" style="text-align:left;">
            <el-checkbox v-model="setting.postBiliDynamic"></el-checkbox>
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
        <el-button type="primary" @click="saveSetting()">保存</el-button>
    </el-form>
</template>


<script>
export default {
  data() {
    return {
      setting: {}
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
    }
  }
};
</script>
