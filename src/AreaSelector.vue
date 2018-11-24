<template>
    <el-cascader expand-trigger="click"
        :value="value"
        :options="options" 
        :props="{ value: 'id', label: 'name', children: 'list' }" 
        v-model="selectValue">
    </el-cascader>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      options: []
    };
  },
  computed: {
    selectValue: {
      get: function() {
        if (this.value) {
          this.value[1] = this.value[1] + "";
        } else {
          return [undefined, undefined];
        }
        return this.value;
      },
      set: function(value) {
        if (value) {
          value[1] = value[1] + "";
        } else {
          value = [undefined, undefined];
        }
        this.$emit("input", value);
      }
    }
  },
  created() {
    this.$http.get("/api/broadcast/getAreaList.json").then(
      function(response) {
        this.options = response.data.data;
        this.loading = false;
      },
      function(response) {
        this.$message.error("获取直播分区信息失败");
        this.loading = false;
      }
    );
  }
};
</script>

