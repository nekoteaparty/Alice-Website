<template>
  <div>
    <el-button
      v-if="account.admin"
      type="primary"
      size="medium"
      icon="el-icon-plus"
      @click="serverInfo = {}, addVisible = true"
      :loading="loading"
    >添加转播服务器</el-button>
    <hr>
    <PagedTable :tableData="tableData" :tableHeader="tableHeader" :loading="loading">
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="200" :ref="`popover-${scope.$index}`">
            <p>
              <i class="el-icon-warning"></i> 删除转播服务器后无法恢复, 是否继续?
            </p>
            <div style="text-align: right; margin-top:8px;">
              <el-button
                type="primary"
                size="mini"
                @click="removeServer(scope.$index, scope.row)"
              >继续</el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger" v-if="account.admin">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </PagedTable>
    <el-dialog title="转播服务器新增" :visible.sync="addVisible" width="580px">
      <el-form :model="serverInfo">
        <el-form-item label="转播服务器标识" label-width="170px" required>
          <el-input v-model="serverInfo.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="转播服务器地址" label-width="170px" required>
          <el-input v-model="serverInfo.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="转播服务器SSH端口" label-width="170px" required>
          <el-input v-model="serverInfo.port" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="转播服务器SSH用户名" label-width="170px" required>
          <el-input v-model="serverInfo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="转播服务器SSH密码" label-width="170px" required>
          <el-input v-model="serverInfo.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务器性能指数" label-width="170px">
          <el-input-number size="medium" v-model="serverInfo.performance" min="0" max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="addServer()">新增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="转播服务器编辑" :visible.sync="editVisible" width="580px">
      <el-form :model="serverInfo">
        <el-form-item label="转播服务器标识" label-width="170px" required>
          <el-input v-model="serverInfo.remark" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="转播服务器地址" label-width="170px" required>
          <el-input v-model="serverInfo.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="转播服务器SSH端口" label-width="170px" required>
          <el-input v-model="serverInfo.port" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="转播服务器SSH用户名" label-width="170px" required>
          <el-input v-model="serverInfo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="转播服务器SSH密码" label-width="170px" required>
          <el-input v-model="serverInfo.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务器性能指数" label-width="170px">
          <el-input-number size="medium" v-model="serverInfo.performance" min="0" max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="editServer()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.el-icon-warning {
  color: #e6a23c;
}

.el-input.is-disabled .el-input__inner,
.el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
  cursor: default;
}
</style>


<script>
import PagedTable from "./PagedTable.vue";
export default {
  data() {
    return {
      account: JSON.parse(sessionStorage.getItem("account")),
      tableData: [],
      tableHeader: [
        { prop: "remark", label: "转播服务器标识" },
        { prop: "address", label: "转播服务器地址", width: "200px" },
        { prop: "performance", label: "性能指数", width: "100px"  },
        { prop: "videoId", label: "转播媒体编号" },
        { prop: "videoTitle", label: "转播媒体名称" , width: "450px"}
      ],
      loading: false,
      editVisible: false,
      addVisible: false,
      serverInfo: {}
    };
  },
  methods: {
    serverList() {
      this.loading = true;
      this.$http.get("/api/server/serverList.json").then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.tableData = [];
            this.tableData = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
          this.loading = false;
        },
        function(response) {
          if (response.status === 401) {
            this.$router.push({ path: "/login" });
          }
          this.$message.error("请求失败");
          this.loading = false;
        }
      );
    },
    removeServer(index, row) {
      this.$http.post("/api/server/removeServer.json", row).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$refs["popover-" + index].doClose();
            this.$message({
              message: "转播服务器已删除",
              type: "success"
            });
            this.serverList();
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
    addServer() {
      this.loading = true;
      this.$http.post("/api/server/addServer.json", this.serverInfo).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "转播服务器添加成功",
              type: "success"
            });
            this.addVisible = false;
            this.serverList();
          } else {
            this.$message.error(response.data.message);
            this.loading = false;
          }
        },
        function(response) {
          if (response.status === 401) {
            this.$router.push({ path: "/login" });
          }
          this.$message.error("请求失败");
          this.loading = false;
        }
      );
    },
    editServer() {
      this.loading = true;
      this.$http.post("/api/server/editServer.json", this.serverInfo).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "转播服务器添加成功",
              type: "success"
            });
            this.editVisible = false;
            this.serverList();
          } else {
            this.$message.error(response.data.message);
            this.loading = false;
          }
        },
        function(response) {
          if (response.status === 401) {
            this.$router.push({ path: "/login" });
          }
          this.$message.error("请求失败");
          this.loading = false;
        }
      );
    }
  },
  components: { PagedTable },
  created() {
    this.serverList();
  }
};
</script>
