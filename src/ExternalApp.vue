<template>
  <div>
    <el-button
      v-if="account.admin"
      type="primary"
      size="medium"
      icon="el-icon-plus"
      @click="externalAppInfo = {}, addVisible = true"
      :loading="loading"
    >添加外部服务授权</el-button>
    <hr>
    <PagedTable :tableData="tableData" :tableHeader="tableHeader" :loading="loading">
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="externalAppInfo = JSON.parse(JSON.stringify(scope.row)), editVisible = true"
          >编辑</el-button>
          <el-popover placement="bottom" width="200" :ref="`popover-${scope.$index}`">
            <p>
              <i class="el-icon-warning"></i> 删除配置后无法恢复, 是否继续?
            </p>
            <div style="text-align: right; margin-top:8px;">
              <el-button
                type="primary"
                size="mini"
                @click="removeExternalApp(scope.$index, scope.row)"
              >继续</el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger" v-if="account.admin">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </PagedTable>
    <el-dialog title="外部服务授权新增" :visible.sync="addVisible" width="580px">
      <el-form :model="externalAppInfo">
        <el-form-item label="服务类型" label-width="120px" required>
          <el-select v-model="externalAppInfo.type" autocomplete="off">
            <el-option label="百度AIP" value="baidu"></el-option>
            <el-option label="VULTR" value="vultr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用ID" label-width="120px">
          <el-input v-model="externalAppInfo.appId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="应用KEY" label-width="120px">
          <el-input v-model="externalAppInfo.appKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="安全秘钥" label-width="120px">
          <el-input v-model="externalAppInfo.secretKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用调用次数" label-width="120px" required>
          <el-input v-model="externalAppInfo.limit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="总调用次数" label-width="120px" required>
          <el-input v-model="externalAppInfo.totalLimit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重置时间" label-width="120px" required>
          <el-date-picker
            v-model="externalAppInfo.nextResumeTime"
            autocomplete="off"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="addExternalApp()">新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="外部服务授权编辑" :visible.sync="editVisible" width="580px">
      <el-form :model="externalAppInfo">
        <el-form-item label="服务类型" label-width="120px" required>
          <el-select v-model="externalAppInfo.type" autocomplete="off" :disabled="true">
            <el-option label="百度AIP" value="baidu"></el-option>
            <el-option label="VULTR" value="vultr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用ID" label-width="120px">
          <el-input v-model="externalAppInfo.appId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="应用KEY" label-width="120px">
          <el-input v-model="externalAppInfo.appKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="安全秘钥" label-width="120px">
          <el-input v-model="externalAppInfo.secretKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用调用次数" label-width="120px" required>
          <el-input v-model="externalAppInfo.limit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="总调用次数" label-width="120px" required>
          <el-input v-model="externalAppInfo.totalLimit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重置时间" label-width="120px" required>
          <el-date-picker
            v-model="externalAppInfo.nextResumeTime"
            autocomplete="off"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="editExternalApp()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PagedTable from "./PagedTable.vue";
export default {
  data() {
    return {
      account: JSON.parse(sessionStorage.getItem("account")),
      tableData: [],
      tableHeader: [
        { prop: "type", label: "服务类型", width: "100px" },
        { prop: "appId", label: "应用ID" },
        { prop: "appKey", label: "应用秘钥", width: "250px" },
        { prop: "secretKey", label: "安全秘钥", width: "300px" },
        { prop: "limit", label: "可用调用次数" },
        { prop: "totalLimit", label: "总调用次数" },
        { prop: "nextResumeTime", label: "重置时间" , width: "100px" }
      ],
      loading: false,
      editVisible: false,
      addVisible: false,
      externalAppInfo: {}
    };
  },
  methods: {
    externalAppList() {
      this.loading = true;
      this.$http.get("/api/externalApp/list.json").then(
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
    removeExternalApp(index, row) {
      this.$http.post("/api/externalApp/remove.json", row).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$refs["popover-" + index].doClose();
            this.$message({
              message: "外部服务授权已删除",
              type: "success"
            });
            this.externalAppList();
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
    addExternalApp() {
      this.loading = true;
      this.$http.post("/api/externalApp/add.json", this.externalAppInfo).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "外部服务授权添加成功",
              type: "success"
            });
            this.addVisible = false;
            this.externalAppList();
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
    editExternalApp() {
      this.loading = true;
      this.$http.post("/api/externalApp/edit.json", this.externalAppInfo).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "外部服务授权编辑成功",
              type: "success"
            });
            this.editVisible = false;
            this.externalAppList();
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
    this.externalAppList();
  }
};
</script>
