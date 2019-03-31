<template>
  <div style="padding:5px;">
    <el-switch
      style="margin:5px;"
      v-model="actionMode"
      active-color="#13ce66"
      inactive-color="#ff4949"
      active-text="操作模式"
      inactive-text="布局模式"
    ></el-switch>
    <div v-if="actionMode" v-html="style"></div>
    <vue-power-drag ref="cyGridster" :your-list="list" :base-margin-left="0" :base-margin-top="0">
      <template v-for="(item, index) in list" :slot="'slot'+index">
        <div v-if="item.type == 'youtube'" :key="index" class="placeholder youtube">
          <div class="mask dragHandle"></div>
          <iframe
            width="100%"
            height="100%"
            :src="`https://www.youtube.com/embed/${item.videoId}`"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div v-if="item.type == 'bilibili'" :key="index" class="placeholder youtube">
          <div class="mask dragHandle"></div>
          <object
            type="application/x-shockwave-flash"
            id="swfobject_placeholder"
            data="//s1.hdslb.com/bfs/static/player/live/flash/pageplayer-2.4.1.swf"
            width="100%"
            height="100%"
            style="visibility: visible;"
          >
            <param name="allowfullscreen" value="true">
            <param name="allowscriptaccess" value="always">
            <param name="allowfullscreeninteractive" value="true">
            <param name="quality" value="high">
            <param name="wmode" value="direct">
            <param name="flashvars" :value="`cid=${item.videoId}&amp;type=1&amp;p2p=0`">
          </object>
        </div>
      </template>
    </vue-power-drag>
  </div>
</template>

<style>
.dragAndResize .item {
  border: 1px dashed #ccc;
}

iframe {
  position: absolute;
  z-index: 0;
  opacity: 1;
}

.placeholder {
  position: relative;
  width: 100%;
  height: 100%;
}

.resizeHandle {
  z-index: 2000;
  border-bottom: 10px solid #aaa !important;
  opacity: 0.8 !important;
}

.mask {
  background: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
</style>


<script>
import drag from "vue-power-drag";
export default {
  data() {
    return {
      actionMode: false,
      style: "<style>.resizeHandle,.dragHandle{display:none;}</style>",
      list: [
        {
          type: "youtube",
          videoId: "3GD0pRMLHQE",
          x: 1,
          y: 1,
          sizex: 5,
          sizey: 6
        },
        {
          type: "youtube",
          videoId: "3GD0pRMLHQE",
          x: 1,
          y: 2,
          sizex: 5,
          sizey: 6
        },
        {
          type: "youtube",
          videoId: "3GD0pRMLHQE",
          x: 1,
          y: 3,
          sizex: 5,
          sizey: 6
        },
        {
          type: "youtube",
          videoId: "3GD0pRMLHQE",
          x: 6,
          y: 1,
          sizex: 5,
          sizey: 6
        },
        {
          type: "youtube",
          videoId: "3GD0pRMLHQE",
          x: 6,
          y: 2,
          sizex: 5,
          sizey: 6
        },
        {
          type: "youtube",
          videoId: "3GD0pRMLHQE",
          x: 6,
          y: 3,
          sizex: 5,
          sizey: 6
        },
        {
          type: "bilibili",
          videoId: "14222920",
          x: 11,
          y: 3,
          sizex: 5,
          sizey: 6
        },
        {
          type: "bilibili",
          videoId: "13946381",
          x: 11,
          y: 3,
          sizex: 5,
          sizey: 6
        },
        {
          type: "bilibili",
          videoId: "21130785",
          x: 11,
          y: 3,
          sizex: 5,
          sizey: 6
        }
      ]
    };
  },
  components: {
    "vue-power-drag": drag
  },
  mounted() {
    let gridster = this.$refs["cyGridster"]; //获取gridster实例
    gridster.init(); //在适当的时候初始化布局组件
  }
};
</script>


