<template>
  <div>
    <el-button v-if="account.admin" type="primary" size="medium" icon="el-icon-plus" @click="channelInfo = { autoBalance: false }, addVisible = true" :loading="loading">添加频道</el-button>
    <el-tag type="info" v-if="!account.admin" disable-transitions color="#fff" style="border:none" class="el-icon-info"> 如需添加、删除频道请联系管理员，QQ群：<a href="tencent://groupwpa/?subcmd=all&param=7B2267726F757055696E223A3933363631383137322C2274696D655374616D70223A313534323934373835347D0A">936618172</a></el-tag>
    <hr/>
    <PagedTable :tableData="tableData" :tableHeader="tableHeader" :loading="loading">
      <el-table-column label="允许推流调配" width="150px">
          <template slot-scope="scope">
            <i class="el-icon-success" style="color:#67C23A" v-show="scope.row.autoBalance"></i>
          </template>
      </el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="channelInfo = JSON.parse(JSON.stringify(scope.row)), editVisible = true">编辑</el-button>
            <el-popover placement="bottom" width="200" :ref="`popover-${scope.$index}`">
              <p><i class="el-icon-warning"></i> 删除频道后无法恢复, 是否继续?</p>
              <div style="text-align: right; margin-top:8px;">
                <el-button type="primary" size="mini" @click="removeChannel(scope.$index, scope.row)">继续</el-button>
              </div>
              <el-button slot="reference" size="mini" type="danger" v-if="account.admin">删除</el-button>
            </el-popover>
        </template>
      </el-table-column>
    </PagedTable>
    <el-dialog title="频道编辑" :visible.sync="editVisible" width="40%">
        <el-form :model="channelInfo">
            <el-form-item v-for="item in tableHeader" :label="item.label" :key="item.prop" label-width="100px">
                <el-input v-model="channelInfo[`${item.prop}`]" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="默认开播分区" label-width="100px">
                <area-selector v-model="channelInfo.defaultArea" :value="channelInfo.defaultArea"></area-selector>
            </el-form-item>
            <el-form-item label="其他推流设置" label-width="100px">            
                <el-checkbox v-model="channelInfo.autoBalance">允许推流调配</el-checkbox>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="editVisible = false, editChannel()">保 存</el-button>
        </span>
    </el-dialog>
    <el-dialog title="频道新增" :visible.sync="addVisible" width="40%">
        <el-form :model="channelInfo">
            <el-form-item v-for="item in tableHeader" :label="item.label" :key="item.prop" label-width="100px">
                <el-input v-model="channelInfo[`${item.prop}`]" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="默认开播分区" label-width="100px">
                <area-selector v-model="channelInfo.defaultArea"></area-selector>
            </el-form-item>
            <el-form-item label="其他推流设置" label-width="100px">            
                <el-checkbox v-model="channelInfo.autoBalance">允许推流调配</el-checkbox>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="addVisible = false, addChannel()">新 增</el-button>
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
import AreaSelector from "./AreaSelector.vue";
export default {
  data() {
    return {
      account: JSON.parse(sessionStorage.getItem("account")),
      tableData: [],
      tableHeader: [
        { prop: "channelName", label: "频道名称" },
        { prop: "channelUrl", label: "频道地址", width: "460px" },
        { prop: "defaultAccountId", label: "默认推流账户" },
        { prop: "dynamicPostAccountId", label: "动态推送账户" }
      ],
      loading: false,
      editVisible: false,
      addVisible: false,
      channelInfo: {}
    };
  },
  methods: {
    channelList() {
      this.loading = true;
      this.$http.get("/api/channel/channelList.json").then(
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
    removeChannel(index, row) {
      this.$http.post("/api/channel/removeChannel.json", row).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$refs["popover-" + index].doClose();
            this.$message({
              message: "频道已删除",
              type: "success"
            });
            this.channelList();
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
    editChannel() {
      this.loading = true;
      this.$http.post("/api/channel/editChannel.json", this.channelInfo).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "频道保存成功",
              type: "success"
            });
            this.channelList();
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
    addChannel() {
      this.loading = true;
      this.$http.post("/api/channel/addChannel.json", this.channelInfo).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "频道添加成功",
              type: "success"
            });
            this.channelList();
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
  components: { PagedTable, AreaSelector },
  created() {
    this.channelList();
  }
};
</script>
