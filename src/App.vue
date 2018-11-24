<template>
  <div id="app">
    <router-view></router-view>  
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: undefined
    };
  }
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  height: 100%;
  font-size: 14px;
}

html,
body {
  margin: 0;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

hr {
  border: none;
  border-top: 1px #ccc solid;
}

a {
  color: #409eff;
  text-decoration: none;
}
</style>
