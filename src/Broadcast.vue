<template>
  <div>
    <el-button
      type="primary"
      size="medium"
      icon="el-icon-plus"
      @click="createTask"
      :loading="loading"
    >手动推流</el-button>
    <a href="/api/onedrive/redirectRecord" target="_blank" style="float:right;">
      <el-button type="primary" size="medium" icon="el-icon-document">查看录像</el-button>
    </a>
    <hr>
    <PagedTable :tableData="tableData" :tableHeader="tableHeader" :loading="loading">
      <el-table-column label="推流健康度" width="106">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.health === 0" disable-transitions type="info">未知</el-tag>
          <el-tag v-if="scope.row.health === -1" disable-transitions type="info">初始化</el-tag>
          <el-tag
            v-if="scope.row.health >= 98"
            disable-transitions
            type="success"
          >优秀({{scope.row.health.toFixed(1)}})</el-tag>
          <el-tag
            v-if="scope.row.health >= 93 && scope.row.health < 98"
            disable-transitions
            type="warning"
          >一般({{scope.row.health.toFixed(1)}})</el-tag>
          <el-tag
            v-if="scope.row.health > 0 && scope.row.health < 93"
            disable-transitions
            type="danger"
          >极差({{scope.row.health.toFixed(1)}})</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" @click="showDetail(scope.$index, scope.row)">详情</el-button>
          <el-button
            size="mini"
            style="margin-left: 0px;"
            type="primary"
            @click="editVisible = true, editItem = scope.row, editItem.cropConf = {}"
          >管理</el-button>
          <el-button
            size="mini"
            style="margin-left: 0px;"
            type="success"
            @click="adoptTask(scope.row.videoId)"
            v-if="!!!scope.row.roomId"
          >认领</el-button>
          <el-popover
            placement="bottom"
            width="200"
            :ref="`popover-${scope.$index}`"
            trigger="click"
            v-if="!!scope.row.roomId"
          >
            <p>
              <i class="el-icon-warning"></i> 停止后系统将不会重新推流, 是否继续?
            </p>
            <div style="text-align: right; margin-top:8px;">
              <el-button type="primary" size="mini" @click="stopTask(scope.$index, scope.row)">继续</el-button>
            </div>
            <el-button
              slot="reference"
              size="mini"
              type="danger"
              v-loading="loading"
              :disabled="loading"
            >停止</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </PagedTable>
    <el-dialog title="推流详情" :visible.sync="detailVisible" width="40%">
      <el-form label-position="left" :model="detailItem" disabled>
        <el-form-item
          v-for="item in tableHeader"
          :label="item.label"
          :key="item.prop"
          label-width="80px"
        >
          <el-input v-model="detailItem[`${item.prop}`]" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="节目编号" label-width="80px">
          <el-input v-model="detailItem.videoId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="推流管理"
      :visible.sync="editVisible"
      width="550px"
      @close="editItem = {cropConf: {}}"
    >
      <el-form label-position="right" :model="editItem">
        <el-form-item label-width="50px">
          <el-button
            type="primary"
            size="small"
            v-loading="loading"
            :disabled="loading"
            @click="getCropConf(editItem.videoId)"
          >视频内容规制</el-button>
          <el-checkbox style="margin-left:30px;" v-model="editItem.audioBanned">强制单声道</el-checkbox>
          <el-checkbox v-model="editItem.vertical">竖屏直播</el-checkbox>
          <el-tag
            type="info"
            disable-transitions
            color="#fff"
            style="border:none"
            class="el-icon-info"
          >修改以上设置将会导致推流短时间的中断</el-tag>
        </el-form-item>
        <el-form-item label="直播分区" label-width="100px">
          <area-selector v-model="editItem.area" :value="editItem.area"></area-selector>
        </el-form-item>
        <el-form-item label="直播间标题" label-width="100px">
          <el-input v-model="editItem.roomTitle" placeholder="[无需修改请留空]"></el-input>
        </el-form-item>
        <el-form-item label="其他设置" label-width="100px">
          <el-checkbox v-model="editItem.needRecord">直播后保存录像</el-checkbox>
          <el-button
            v-if="account.admin"
            v-loading="loading"
            :disabled="loading"
            style="margin-left:15px;"
            type="danger"
            size="small"
            @click="terminateTask(editItem.videoId)"
          >终止推流任务</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="editTask(), editVisible = false">修 改</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="视频内容规制"
      :visible.sync="videoManagerVisible"
      width="890px"
      :close-on-click-modal="false"
      @close="editItem.cropConf = {}"
    >
      <el-radio-group v-model="editItem.cropConf.videoBannedType">
        <el-radio v-model="editItem.cropConf.videoBannedType" label="NONE">取消内容规制</el-radio>
        <el-radio v-model="editItem.cropConf.videoBannedType" label="FULL_SCREEN">全屏</el-radio>
        <el-radio v-model="editItem.cropConf.videoBannedType" label="CUSTOM_SCREEN">自定义</el-radio>
      </el-radio-group>
      <el-checkbox
        style="margin-left:15px;"
        v-if="editItem.cropConf.videoBannedType == 'CUSTOM_SCREEN'"
        v-model="editItem.cropConf.autoBlur"
      >自动评论区打码</el-checkbox>
      <el-checkbox
        style="margin-left:15px;"
        v-if="editItem.cropConf.videoBannedType == 'CUSTOM_SCREEN'"
        v-model="editItem.cropConf.autoImageSegment"
      >自动分离人物形象</el-checkbox>
      <el-select
        v-if="editItem.cropConf.videoBannedType == 'CUSTOM_SCREEN'"
        style="margin-left:15px;width:240px"
        size="small"
        v-model="editItem.cropConf.broadcastResolution"
        placeholder="请选择转播分辨率"
      >
        <el-option label="1080P@30FPS 价格:30AP/小时" value="R1080F30"></el-option>
        <el-option label="720P@60FPS 价格:30AP/小时" value="R720F60"></el-option>
        <el-option label="720P@30FPS 价格:7AP/小时" value="R720F30"></el-option>
        <el-option label="480P@30FPS 价格:7AP/小时" value="R480F30"></el-option>
      </el-select>
      <CustomLayout
        v-if="editItem.cropConf.videoBannedType == 'CUSTOM_SCREEN'"
        :cropConf="editItem.cropConf"
        :backgroundImageSrc="`/api/keyframe/${editItem.videoId}?_t=${parseInt(new Date().getTime() / 100000)}`"
      ></CustomLayout>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="medium"
          @click="cropConfSave()"
          v-loading="loading"
          :disabled="loading"
        >保 存</el-button>
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
import CustomLayout from "./CustomLayout.vue";
export default {
  data() {
    return {
      account: JSON.parse(sessionStorage.getItem("account")),
      tableData: [],
      tableHeader: [
        { prop: "nickname", label: "推流账号" },
        { prop: "roomId", label: "直播间ID" },
        { prop: "accountSite", label: "推流平台" },
        { prop: "channelName", label: "节目频道" },
        { prop: "videoTitle", label: "节目标题", width: "460px" }
      ],
      broadcastCookie: null,
      loading: false,
      detailVisible: false,
      detailItem: {},
      editVisible: false,
      editItem: { cropConf: {} },
      cropConf: {},
      blurSize: 0,
      videoManagerVisible: false
    };
  },
  methods: {
    taskList() {
      this.loading = true;
      this.$http.get("/api/broadcast/taskList.json").then(
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
    getCropConf(videoId) {
      this.loading = true;
      this.$http.get("/api/broadcast/getCropConf.json?videoId=" + videoId).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.editItem = Object.assign({}, this.editItem, {
              cropConf: response.data.data
            });
            this.cropConf = JSON.parse(JSON.stringify(this.editItem.cropConf));
            this.blurSize = this.editItem.cropConf.blurSize;
            this.videoManagerVisible = true;
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
    cropConfSave() {
      if (!this.editItem.cropConf.broadcastResolution) {
        this.$confirm("请选择转播分辨率", "提示", {
          showCancelButton: false,
          type: "error"
        });
        return;
      }
      this.loading = true;
      let apiUrl =
        "/api/broadcast/cropConfSave.json?videoId=" + this.editItem.videoId;
      if (this.editItem.cropConf.videoBannedType != "CUSTOM_SCREEN") {
        this.editItem.cropConf.layouts = new Array();
      }
      this.$http.post(apiUrl, this.editItem.cropConf).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "自主规制配置保存成功",
              type: "success"
            });
            this.videoManagerVisible = false;
            this.taskList();
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
    editTask() {
      let apiUrl = "/api/broadcast/editTask.json";
      this.$http.post(apiUrl, this.editItem).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "推流任务修改成功",
              type: "success"
            });
            this.taskList();
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
    stopTask(index, row) {
      let apiUrl = "/api/broadcast/stopTask.json?videoId=" + row.videoId;
      this.loading = true;
      this.$http.get(apiUrl).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            if (this.$refs["popover-" + index]) {
              this.$refs["popover-" + index].doClose();
            }
            this.$message({
              message: "推流任务已停止",
              type: "success"
            });
            this.taskList();
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
    showDetail(index, row) {
      this.detailVisible = true;
      this.detailItem = row;
    },
    adoptTask(videoId) {
      this.$http.get("/api/broadcast/adoptTask.json?videoId=" + videoId).then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.$message({
              message: "推流任务认领成功~",
              type: "success"
            });
            this.taskList();
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
    createTask() {
      this.$prompt(
        <div class="od-config">
          <p>转播登录Cookie：</p>
          <el-input
            v-model={this.broadcastCookie}
            placeholder="如为收费/会员专享节目，请输入对应平台登录Cookie"
          />
          <p style="margin-bottom:-15px">请输入需要推流的媒体地址：</p>
        </div>,
        "手动推流",
        {
          inputPattern: /.+/,
          inputErrorMessage: "请输入需要推流的媒体地址",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "例：https://www.youtube.com/watch?v=KufDfy90fDo"
        }
      ).then(({ value }) => {
        this.loading = true;
        let apiUrl =
          "/api/broadcast/createTask.json?videoUrl=" +
          value +
          "&cookies=" +
          encodeURIComponent(this.broadcastCookie);
        this.$http.get(apiUrl).then(
          function(response) {
            // 这里是处理正确的回调
            if (response.data.code === 0) {
              this.$message({
                message: "推流任务创建成功",
                type: "success"
              });
              this.taskList();
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
      });
    },
    terminateTask(videoId) {
      this.$confirm(
        <span>
          此操作将把该推流任务从列表中删除并终止所有相关活动（包括录像）,
          是否继续?
          <br />
          <br />* 完全终止一个推流任务可能需要花费较多的时间，请耐心等待操作完成
        </span>,
        "操作确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.loading = true;
        let apiUrl = "/api/broadcast/terminateTask.json?videoId=" + videoId;
        this.$http.get(apiUrl).then(
          function(response) {
            // 这里是处理正确的回调
            if (response.data.code === 0) {
              this.$message({
                message: "推流任务已被终止",
                type: "success"
              });
              this.editVisible = false;
              this.taskList();
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
      });
    }
  },
  components: { PagedTable, AreaSelector, CustomLayout },
  created() {
    this.taskList();
  },
  watch: {
    "editItem.cropConf.videoBannedType": function() {
      this.$nextTick(this.onBlurSizeChange);
    },
    videoManagerVisible: function() {
      this.$nextTick(this.onBlurSizeChange);
    }
  }
};
</script>
