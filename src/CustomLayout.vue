<template>
  <div class="custom-layout-root">
    <div class="custom-layout-toolbar">
      <el-dropdown @command="addLayout" trigger="click" placement="bottom">
        <el-button type="primary" size="small">
          添加组件
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="ShapeLayout">圆角矩形</el-dropdown-item>
          <el-dropdown-item command="ImageLayout">
            自定义图片
            <input
              type="file"
              ref="imageSelecter"
              accept="image/png, image/jpeg"
              v-show="false"
              @change="addImageLayout"
            >
          </el-dropdown-item>
          <el-dropdown-item command="DanmakuLayout">B站直播间弹幕</el-dropdown-item>
          <el-dropdown-item command="BlurLayout">高斯模糊滤镜</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <template v-if="activatedLayout.type == 'DanmakuLayout'">
        <div style="display:inline-block;margin-right:10px;">
          <label>字号缩放:</label>
          <el-slider
            v-model="activatedLayout.zoom"
            :min="0.5"
            :max="2"
            :step="0.1"
            style="width:120px;display:inline-block;vertical-align: middle;margin-left:10px;"
          ></el-slider>
        </div>
      </template>
      <template v-if="activatedLayout.type == 'ImageLayout'">
        <div style="display:inline-block;margin-right:10px;">
          <label>透明度:</label>
          <el-slider
            v-model="activatedLayout.opacity"
            :min="0.1"
            :max="1"
            :step="0.1"
            style="width:120px;display:inline-block;vertical-align: middle;margin-left:10px;"
          ></el-slider>
        </div>
      </template>
      <template v-if="activatedLayout.type == 'BlurLayout'">
        <div style="display:inline-block;margin-right:10px;">
          <label>模糊强度:</label>
          <el-slider
            v-model="cropConf.blurSize"
            :min="0"
            :max="5"
            :step="1"
            style="width:120px;display:inline-block;vertical-align: middle;margin-left:10px;"
          ></el-slider>
        </div>
      </template>
      <template v-if="activatedLayout.type == 'ShapeLayout'">
        <div style="display:inline-block;">
          <el-color-picker
            v-model="activatedLayout.rgba"
            size="small"
            show-alpha
            @change="changeShapeColor"
          ></el-color-picker>
        </div>
        <div style="display:inline-block;margin-right:10px;">
          <label>横向弧度:</label>
          <el-slider
            v-model="activatedLayout.radiusPercentW"
            :min="0"
            :max="100"
            :step="5"
            :format-tooltip="(value) => value + '%'"
            style="width:120px;display:inline-block;vertical-align: middle;margin-left:10px;"
          ></el-slider>
        </div>
        <div style="display:inline-block;margin-right:10px;">
          <label>纵向弧度:</label>
          <el-slider
            v-model="activatedLayout.radiusPercentH"
            :min="0"
            :max="100"
            :step="5"
            :format-tooltip="(value) => value + '%'"
            style="width:120px;display:inline-block;vertical-align: middle;margin-left:10px;"
          ></el-slider>
        </div>
      </template>
      <template v-if="activatedLayout.type">
        <div style="display:inline-block;" v-if="activatedLayout.type != 'BlurLayout'">
          <label>图层操作:</label>
          <el-button-group>
            <el-button size="small" @click="activatedLayout.index++ ">上移</el-button>
            <el-button size="small" @click="activatedLayout.index--">下移</el-button>
          </el-button-group>
        </div>
        <el-button
          style="margin-left:10px"
          size="small"
          type="danger"
          @click="layouts.splice(layouts.indexOf(activatedLayout),1);activatedLayout={};"
        >删除</el-button>
      </template>
    </div>
    <div class="custom-layout">
      <img
        ref="bg"
        style="user-select: none; pointer-events: none;"
        draggable="false"
        :src="backgroundImageSrc"
      >
      <VueDragResize
        v-for="(layout, index) in layouts"
        :parentScaleX="0.66406"
        :parentScaleY="0.66406"
        :isActive="true"
        :key="index"
        :w="layout.width"
        :h="layout.height"
        :x="layout.x"
        :y="layout.y"
        :z="layout.index"
        :minw="10"
        :minh="10"
        :parentLimitation="false"
        @dragging="setRect($event,layout)"
        @resizing="setRect($event,layout)"
        :class="`${activatedLayout == layout ? 'current' : ''}`"
        :style="`${activatedLayout == layout ? 'box-shadow: rgb(137, 255, 0) 0px 0px 15px; outline:1px solid rgb(137, 255, 0);' : ''}`"
      >
        <iframe
          v-if="layout.type == 'DanmakuLayout'"
          :style="`background:none;border:none;width:100%;height:100%;opacity:${layout.opacity}`"
          :src="`${layout.src}&zoom=${layout.zoom}`"
        ></iframe>
        <img
          v-if="layout.type == 'ImageLayout'"
          :src="layout.src"
          :style="`background:none;border:none;width:100%;height:100%;opacity:${layout.opacity}`"
        >
        <div
          v-if="layout.type == 'ShapeLayout'"
          :style="`width:100%;height:100%;opacity:${layout.opacity};background-color:${layout.hexColor};border-radius:${layout.radiusPercentW / 2}% / ${layout.radiusPercentH / 2}%;`"
        ></div>
        <div
          v-if="layout.type == 'BlurLayout'"
          :style="`width:100%;height:100%;background-image:url('${backgroundImageSrc}');background-position:${0-layout.x}px ${0-layout.y}px;filter: blur(${cropConf.blurSize}px);`"
        ></div>
      </VueDragResize>
    </div>
  </div>
</template>

<style>
.vdr-stick {
  transform: scale(1.5);
  border-radius: 50%;
  opacity: 0.3;
}

.current .vdr-stick {
  opacity: 1;
}

.custom-layout-root {
  position: relative;
  height: 505px;
}

.custom-layout-toolbar {
  margin: 5px 0;
}

.custom-layout-toolbar > * {
  margin-right: 5px;
  vertical-align: middle;
}

.custom-layout {
  overflow: hidden;
  position: absolute;
  transform: scale(0.66406);
  transform-origin: 0 0;
}
</style>


<script>
import VueDragResize from "vue-drag-resize";
export default {
  props: ["cropConf", "backgroundImageSrc"],
  data() {
    return {
      layouts: this.cropConf.layouts,
      account: JSON.parse(sessionStorage.getItem("account")),
      activatedLayout: {}
    };
  },
  methods: {
    addLayout(type, src) {
      let customLayout = {
        x: 0,
        y: 0,
        width: 250,
        height: 250,
        index: 1000,
        type: type,
        opacity: 1
      };
      switch (type) {
        case "DanmakuLayout":
          customLayout.zoom = 1;
          customLayout.width = 400;
          customLayout.height = 500;
          customLayout.src =
            "https://nekosunflower.github.io/BiliChat/?id=" +
            this.account.roomId;
          break;
        case "ImageLayout":
          if (!src || typeof src !== "string") {
            this.$refs.imageSelecter.click();
            return;
          }
          var img = new Image();
          img.src = src;
          img.onload = function() {
            customLayout.width = img.naturalWidth;
            customLayout.height = img.naturalHeight;
            customLayout.size = parseInt(src.length - (src.length / 8) * 2);
            customLayout.src = src;
          };
          break;
        case "ShapeLayout":
          customLayout.radiusPercentW = 0;
          customLayout.radiusPercentH = 0;
          customLayout.rgba = "rgba(0,0,0,1)";
          customLayout.hexColor = "#000000";
          break;
        case "BlurLayout":
          customLayout.index = 1;
          if (this.cropConf.blurSize == 0) {
            this.cropConf.blurSize = 3;
          }
          break;
        default:
          return;
      }
      this.layouts.push(customLayout);
      this.activatedLayout = customLayout;
    },
    addImageLayout(e) {
      let that = this;
      let totalSize = 0;
      this.layouts.forEach(layout => {
        if (layout.size) {
          totalSize += layout.size;
        }
      });
      if (totalSize + e.target.files[0].size > 1024 * 1024) {
        this.$alert("图片总大小不能大于1024KB", "文件总大小超限", {
          confirmButtonText: "确定"
        });
      } else {
        let reader = new FileReader();
        reader.onload = function(e) {
          that.addLayout("ImageLayout", e.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    },
    setRect(rect, layout) {
      this.activatedLayout = layout;
      layout.width = rect.width;
      layout.height = rect.height;
      layout.x = rect.left;
      layout.y = rect.top;
    },
    changeShapeColor(color) {
      if (!color) {
        this.activatedLayout.rgba = "rgba(0,0,0,1)";
        this.activatedLayout.hexColor = "#000000";
        this.activatedLayout.opacity = 1;
      } else {
        var values = color
          .replace(/rgba?\(/, "")
          .replace(/\)/, "")
          .replace(/[\s+]/g, "")
          .split(",");
        var a = parseFloat(values[3] || 1),
          r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
          g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
          b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
        this.activatedLayout.hexColor =
          "#" +
          ("0" + r.toString(16)).slice(-2) +
          ("0" + g.toString(16)).slice(-2) +
          ("0" + b.toString(16)).slice(-2);
        this.activatedLayout.opacity = a;
      }
    }
  },
  components: { VueDragResize }
};
</script>