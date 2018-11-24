<template>
    <div class="login-center">
        <img src="./assets/logo.png"/>
        <el-popover class="item" trigger="manual" placement="bottom" v-model="popoverVisible">
            <template>不知道如何获取Cookies？<a href="javascript:" @click="showCookiesTip=true">请点击此处</a></template>
            <el-input slot="reference" @focus="popoverVisible=true" @blur="popoverVisible=false" placeholder="请输入Cookies" v-model="cookies" class="input-with-select">
                <el-select v-model="accountSite" @change="selectGet" slot="prepend" placeholder="请选择">
                    <el-option v-for="item in accountSites" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <el-button type="primary" slot="append" @click="login">登录</el-button>
            </el-input>
        </el-popover>
        <el-tag type="info" disable-transitions color="#fff" style="border:none" class="el-icon-info"> 除非您明确手动操作保存Cookie，否则爱丽丝不会主动记录您的Cookie及其他个人信息，退出登录所有信息都将自动删除。</el-tag>
        <el-dialog title="如何获取Cookies" :visible.sync="showCookiesTip" width="850px" top="5vh">
            <p>请确保你已经登录{{accountSiteLabel}}，然后打开一个标签页，按F12打开工具栏，切换到[NETWORK]标签，打开任意一个{{accountSiteLabel}}页面，点开请求列表的第一条记录，在右侧详情中提取Request Header的Cookie字符串，然后将所有内容复制到输入框中即可。</p>
            <p>你也可以参考下方的GIF动画进行操作：</p>
            <img src="./assets/step.gif" title="点击重新播放" @click="reloadGif"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showCookiesTip=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style>
.login-center {
  width: 640px;
  height: 320px;
  top: 50%;
  left: 50%;
  margin-top: -260px;
  margin-left: -320px;
  position: absolute;
  text-align: center;
}

.login-center .el-icon-back {
  transform: rotate(180deg);
  color: #409eff;
}

.el-select .el-input {
  width: 110px;
}

.el-dialog {
  text-align: left;
}

.el-dialog__body {
  padding: 10px 20px 15px 20px;
}
</style>

<script>
export default {
  data() {
    return {
      popoverVisible: false,
      accountSites: [{ label: "哔哩哔哩", value: "bilibili" }],
      showCookiesTip: false,
      cookies: undefined,
      accountSite: "bilibili",
      accountSiteLabel: "哔哩哔哩"
    };
  },
  methods: {
    selectGet(value) {
      let item = {};
      item = this.accountSites.find(item => {
        return item.value === value;
      });
      this.accountSiteLabel = item.label;
    },
    reloadGif(e) {
      let img = e.target;
      let src = img.src;
      img.src = "";
      img.src = src;
    },
    login() {
      this.$http
        .post("/api/login/login.json", {
          cookies: this.cookies,
          accountSite: this.accountSite
        })
        .then(
          function(response) {
            // 这里是处理正确的回调
            if (response.data.code === 0) {
              sessionStorage.setItem("account", JSON.stringify(response.data.data));
              this.$router.push({ path: "/main/broadcast" });
            } else {
              this.$message.error(response.data.message);
            }
          },
          function(response) {
            this.$message.error("请求失败");
          }
        );
    }
  }
};
</script>
