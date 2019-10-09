<template>
  <div>
    <el-button
      v-if="!account.saved"
      type="primary"
      size="medium"
      icon="el-icon-plus"
      @click="
        (accountInfo = {
          joinAutoBalance: false,
          postBiliDynamic: false,
          autoRoomTitle: false,
          broadcastResolution: 'R720F30'
        }),
          (addVisible = true)
      "
      :loading="loading"
      >保存账户</el-button
    >
    <el-button
      v-if="account.saved"
      size="medium"
      type="primary"
      icon="el-icon-edit"
      :loading="loading"
      @click="editVisible = true"
      >账户设置</el-button
    >
    <el-popover
      v-if="account.saved"
      ref="removePopover"
      placement="bottom"
      width="200"
    >
      <p>
        <i class="el-icon-warning"></i> 账号删除后系统将中止正在进行的推流任务,
        是否继续?
      </p>
      <div style="text-align: right; margin-top:8px;">
        <el-button
          type="primary"
          size="mini"
          @click="removeAccount(account.accountId)"
          >继续</el-button
        >
      </div>
      <el-button
        slot="reference"
        size="medium"
        type="danger"
        icon="el-icon-close"
        :loading="loading"
        >删除账户</el-button
      >
    </el-popover>
    <el-input
      style="float:right;width:280px;"
      placeholder="请输入筛选条件"
      v-model="filter"
      size="medium"
      clearable
    ></el-input>
    <hr />
    <PagedTable
      :tableData="tableData"
      :tableHeader="tableHeader"
      :filter="filter"
      :loading="loading"
    >
      <el-table-column label="AP点数" width="150px" v-if="account.admin">
        <template slot-scope="scope">
          {{ scope.row.point }}
        </template>
      </el-table-column>
      <el-table-column label="允许推流调配" width="150px">
        <template slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:#67C23A"
            v-show="scope.row.joinAutoBalance"
          ></i>
          <i
            class="el-icon-error"
            style="color:#F56C6C"
            v-show="!scope.row.joinAutoBalance"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <el-tag
            type="success"
            size="medium"
            disable-transitions
            v-if="!scope.row.disable"
            >有 效</el-tag
          >
          <el-tag
            type="danger"
            size="medium"
            disable-transitions
            v-if="scope.row.disable"
            >无 效</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" v-if="account.admin">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="200"
            :ref="`popover-${scope.$index}`"
          >
            <p>
              <i class="el-icon-warning"></i>
              账号删除后系统将中止正在进行的推流任务, 是否继续?
            </p>
            <div style="text-align: right; margin-top:8px;">
              <el-button
                type="primary"
                size="mini"
                @click="removeAccount(scope.row.accountId, scope.$index)"
                >继续</el-button
              >
            </div>
            <el-button slot="reference" size="mini" type="danger"
              >删除</el-button
            >
          </el-popover>
          <el-button
            size="mini"
            type="primary"
            @click="billList(scope.row.accountId, scope.$index)"
            >账单</el-button
          >
        </template>
      </el-table-column>
    </PagedTable>
    <el-dialog title="保存推流账户" :visible.sync="addVisible" width="680px">
      <el-form :model="accountInfo">
        <el-form-item label="账号描述" label-width="120px">
          <el-input
            v-model="accountInfo.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="默认转播分辨率" label-width="120px">
          <el-select
            size="small"
            v-model="accountInfo.broadcastResolution"
            placeholder="请选择转播分辨率"
          >
            <el-option
              :label="`480P@30FPS 价格:${account.serverPoints[1]}AP/小时`"
              value="R480F30"
            ></el-option>
            <el-option
              :label="`720P@30FPS 价格:${account.serverPoints[1]}AP/小时`"
              value="R720F30"
            ></el-option>
            <el-option
              :label="`720P@60FPS 价格:${account.serverPoints[2]}AP/小时`"
              value="R720F60"
            ></el-option>
            <el-option
              :label="`1080P@30FPS 价格:${account.serverPoints[2]}AP/小时`"
              value="R1080F30"
            ></el-option>
            <el-option
              :label="`*1080P@60FPS 价格:${account.serverPoints[2]}AP/小时`"
              value="R1080F60"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推流设置" label-width="120px">
          <el-checkbox v-model="accountInfo.joinAutoBalance"
            >允许推流调配</el-checkbox
          >
          <el-checkbox v-model="accountInfo.postBiliDynamic"
            >发送B站开播动态</el-checkbox
          >
          <el-checkbox v-model="accountInfo.autoRoomTitle"
            >自动修改直播间标题</el-checkbox
          >
        </el-form-item>
        <el-form-item prop="agree">
          <el-tag
            type="warning"
            disable-transitions
            class="el-icon-warning"
            style="height: auto;white-space: normal;"
          >
            账号安全及免责声明：<b>此操作将会把您的Cookie信息保存在服务器上！</b>虽然爱丽丝已经对其进行加密处理，除非拥有服务器的控制权，否则就算得到文件也无法解密，但依然无法保证您的账号一定没有安全风险，如果您不想使用自动推流服务，则不需要进行当前的操作，只需要去推流任务页面进行手动推流操作即可。<br /><el-checkbox
              v-model="agree"
              ><span style="text-decoration: underline;"
                >我已知晓使用本功能可能会带来的安全风险，且认同服务提供者及所有相关人员免于承担责任。</span
              ></el-checkbox
            ></el-tag
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="addAccount()"
          >新 增</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="修改账户设置" :visible.sync="editVisible" width="680px">
      <el-form :model="account">
        <el-form-item label="账号描述" label-width="120px">
          <el-input v-model="account.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="默认转播分辨率" label-width="120px">
          <el-select
            size="small"
            v-model="account.broadcastResolution"
            placeholder="请选择转播分辨率"
          >
            <el-option
              :label="`480P@30FPS 价格:${account.serverPoints[1]}AP/小时`"
              value="R480F30"
            ></el-option>
            <el-option
              :label="`720P@30FPS 价格:${account.serverPoints[1]}AP/小时`"
              value="R720F30"
            ></el-option>
            <el-option
              :label="`720P@60FPS 价格:${account.serverPoints[2]}AP/小时`"
              value="R720F60"
            ></el-option>
            <el-option
              :label="`1080P@30FPS 价格:${account.serverPoints[2]}AP/小时`"
              value="R1080F30"
            ></el-option>
            <el-option
              :label="`*1080P@60FPS 价格:${account.serverPoints[2]}AP/小时`"
              value="R1080F60"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推流设置" label-width="120px">
          <el-checkbox v-model="account.joinAutoBalance"
            >允许推流调配</el-checkbox
          >
          <el-checkbox v-model="account.postBiliDynamic"
            >发送B站开播动态</el-checkbox
          >
          <el-checkbox v-model="account.autoRoomTitle"
            >自动修改直播间标题</el-checkbox
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="editAccount()"
          >保 存</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="`${billAccountId}的账单`"
      :visible.sync="billListVisible"
    >
      <el-button
        size="mini"
        type="primary"
        @click="apPointChange(billAccountId)"
        >AP点数变更</el-button
      >
      <PagedTable
        :tableData="billTableData"
        :tableHeader="billTableHeader"
        :loading="loading"
      ></PagedTable>
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
        { prop: "accountId", label: "账号标识" },
        { prop: "nickname", label: "推流账号" },
        { prop: "roomId", label: "直播间ID" },
        { prop: "accountSite", label: "推流平台" },
        { prop: "description", label: "描述" }
      ],
      loading: false,
      billTableData: [],
      billTableHeader: [
        { prop: "recordDate", label: "记录时间", width: "250px" },
        { prop: "pointChange", label: "AP点数变动", width: "150px" },
        { prop: "remark", label: "描述" }
      ],
      billListVisible: false,
      billAccountId: "",
      detailVisible: false,
      editVisible: false,
      addVisible: false,
      agree: false,
      accountInfo: {},
      filter: ""
    };
  },
  methods: {
    accountList() {
      this.loading = true;
      this.$http.get("/api/account/accountList.json").then(
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
    apPointChange(accountId) {
      this.$prompt("请输入要变更的AP点数", "AP点数变更", {
        inputType: "number"
      })
        .then(({ value }) => {
          this.loading = true;
          this.$http
            .post(
              "/api/account/apPointChange.json?accountId=" +
                accountId +
                "&point=" +
                value
            )
            .then(
              function(response) {
                // 这里是处理正确的回调
                if (response.data.code === 0) {
                  this.$alert(
                    <p>
                      操作成功！
                      <br />
                      {response.data.data}
                    </p>,
                    "提示",
                    {
                      type: "success"
                    }
                  );
                  this.billList(accountId);
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
        })
        .catch(() => {});
    },
    removeAccount(accountId, index) {
      let apiUrl = "/api/account/removeAccount.json?accountId=" + accountId;
      this.$http.get(apiUrl).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "推流账户已删除",
              type: "success"
            });
            if (index !== undefined) {
              this.$refs["popover-" + index].doClose();
            } else {
              this.$refs.removePopover.doClose();
            }
            if (accountId == this.account.accountId) {
              this.account.saved = false;
              sessionStorage.setItem("account", JSON.stringify(this.account));
            }
            this.accountList();
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
    addAccount() {
      if (!this.agree) {
        this.$alert("同意免责声明后才能继续操作", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
        return;
      }
      this.addVisible = false;
      this.loading = true;
      let apiUrl = "/api/account/addAccount.json";
      this.$http.post(apiUrl, this.accountInfo).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "推流账户创建成功",
              type: "success"
            });
            this.account.saved = true;
            this.account.joinAutoBalance = this.accountInfo.joinAutoBalance;
            this.account.postBiliDynamic = this.accountInfo.postBiliDynamic;
            this.account.autoRoomTitle = this.accountInfo.autoRoomTitle;
            this.account.description = this.accountInfo.description;
            sessionStorage.setItem("account", JSON.stringify(this.account));
            this.accountList();
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
    billList(accountId) {
      this.loading = true;
      this.billAccountId = accountId;
      this.billListVisible = true;
      this.$http.get("/api/account/billList.json?accountId=" + accountId).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.billTableData = [];
            this.billTableData = response.data.data;
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
    editAccount() {
      this.editVisible = false;
      this.loading = true;
      let apiUrl = "/api/account/editAccount.json";
      this.$http.post(apiUrl, this.account).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "账户设置修改成功",
              type: "success"
            });
            sessionStorage.setItem("account", JSON.stringify(this.account));
            this.accountList();
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
    this.accountList();
  }
};
</script>
