<template>
  <div class="login-center">
    <img src="./assets/logo.png">
    <el-popover
      v-if="loginMode === 'cookies'"
      class="item"
      trigger="manual"
      placement="bottom"
      v-model="popoverVisible"
    >
      <template>
        不知道如何获取Cookies？
        <a href="javascript:" @click="showCookiesTip=true">请点击此处</a>
      </template>
      <el-input
        slot="reference"
        @focus="popoverVisible=true"
        @blur="popoverVisible=false"
        placeholder="请输入Cookies"
        v-model="cookies"
        class="input-with-select"
      >
        <el-select v-model="accountSite" slot="prepend" placeholder="请选择">
          <el-option
            v-for="item in accountSites"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <el-button type="primary" slot="append" @click="login">登录</el-button>
      </el-input>
    </el-popover>
    <el-input
      v-if="loginMode === 'userpwd'"
      v-model="username"
      class="input-with-select input-userpwd"
    >
      <el-select v-model="accountSite" slot="prepend" placeholder="请选择">
        <el-option
          v-for="item in accountSites"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
      <span class="label-username" slot="prepend">用户名</span>
      <el-input type="password" v-model="password" slot="append">
        <template slot="prepend">密&nbsp;&nbsp;码</template>
        <el-button
          type="primary"
          slot="append"
          @click="login"
          v-loading.fullscreen.lock="loading"
        >登录</el-button>
      </el-input>
    </el-input>
    <el-tag
      type="info"
      disable-transitions
      color="#fff"
      style="border:none"
      class="el-icon-info"
    >&nbsp;除非您明确手动操作保存Cookie，否则爱丽丝不会主动记录您的Cookie及其他个人信息，退出登录所有信息都将自动删除。</el-tag>
    <el-dialog title="如何获取Cookies" :visible.sync="showCookiesTip" width="850px" top="5vh">
      <p>请确保你已经登录{{accountSiteLabel}}，然后打开一个标签页，按F12打开工具栏，切换到[NETWORK]标签，打开任意一个{{accountSiteLabel}}页面，点开请求列表的第一条记录，在右侧详情中提取Request Header的Cookie字符串，然后将所有内容复制到输入框中即可。</p>
      <p>你也可以参考下方的GIF动画进行操作：</p>
      <img src="./assets/step.gif" title="点击重新播放" @click="reloadGif">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showCookiesTip=false">确 定</el-button>
      </span>
    </el-dialog>
    <img class="alice" src="./assets/alice_half_body.jpg">
  </div>
</template>

<style>
img.alice {
  position: fixed;
  top: 60%;
  left: 50%;
  margin-left: -290px;
  z-index: -1;
}

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

.login-center .input-userpwd > .el-input-group__append {
  border: none;
  padding: 0;
  margin: 0;
  width: auto;
}

.login-center .input-userpwd > .el-input-group__prepend > * {
  display: inline-block;
}

.login-center .label-username {
  border-left: 1px solid #dcdfe6;
  margin: -10px 0 -10px 20px;
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
}

.login-center .el-input-group__append .el-input-group__prepend {
  border-left: none;
  border-radius: 0px;
}

.login-center .el-select .el-input {
  width: 110px;
}

.login-center .el-dialog {
  text-align: left;
}

.login-center .el-dialog__body {
  padding: 10px 20px 15px 20px;
}

.login-center .captcha-prompt * {
  vertical-align: middle;
}
</style>

<script>
export default {
  data() {
    return {
      popoverVisible: false,
      loginModes: [
        { label: "账户/密码", value: "userpwd" },
        { label: "Cookies", value: "cookies" }
      ],
      accountSites: [
        { label: "哔哩哔哩", value: "bilibili" },
        { label: "17Live", value: "17live" }
      ],
      showCookiesTip: false,
      cookies: undefined,
      username: undefined,
      password: undefined,
      captcha: undefined,
      loginMode: "userpwd",
      loading: false,
      accountSite: "bilibili",
      accountSiteLabel: "哔哩哔哩"
    };
  },
  methods: {
    reloadGif(e) {
      let img = e.target;
      let src = img.src;
      img.src = "";
      img.src = src;
    },
    login() {
      this.loading = true;
      this.$http
        .post("/api/login/login.json?loginMode=" + this.loginMode, {
          cookies: this.cookies,
          username: this.username,
          password: this.password,
          captcha: this.captcha,
          accountSite: this.accountSite
        })
        .then(
          function(response) {
            this.loading = false;
            // 这里是处理正确的回调
            if (response.data.code === 0) {
              sessionStorage.setItem(
                "account",
                JSON.stringify(response.data.data)
              );
              this.$router.push({ path: "/main/broadcast" });
            } else {
              if (response.data.code === -101) {
                this.$prompt(
                  <p class="captcha-prompt">
                    <span>请输入验证码</span>
                    <img
                      height="50"
                      alt="验证码图像"
                      src={
                        "/api/login/getCaptcha?accountSite=" +
                        this.accountSite +
                        "&_t=" +
                        new Date().getTime()
                      }
                    />
                  </p>,
                  "安全验证",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputPattern: /.+/,
                    inputErrorMessage: "请输入验证码"
                  }
                )
                  .then(({ value }) => {
                    this.captcha = value.toUpperCase();
                    this.login();
                  })
                  .catch(() => {});
              }
              this.$message.error(response.data.message);
            }
          },
          function(response) {
            this.loading = false;
            this.$message.error("请求失败");
          }
        );
    }
  }
};
</script>
