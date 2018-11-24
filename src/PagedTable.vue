<template>
    <div>
        <el-table :data="pagedData" v-loading="loading">
            <el-table-column v-for="item in tableHeader" :key="item.prop" :prop="item.prop" :width="item.width" :label="item.label"></el-table-column>
            <slot></slot>
        </el-table>
        <el-pagination layout="prev, pager, next" :current-page.sync="currentPage" :total="tableData.length" @current-change="pageChange" />
    </div>
</template>
        
<style>
.el-pagination {
  margin-top: 10px;
  text-align: right;
}
</style>


<script>
export default {
  props: ["tableData", "tableHeader", "loading"],
  data() {
    return {
      pagedData: [],
      currentPage: 1
    };
  },
  methods: {
    pageChange(index) {
      this.currentPage = index;
      this.pagedData = this.tableData.slice(
        (index - 1) * 10,
        Math.min(index * 10, this.tableData.length)
      );
    }
  },
  watch: {
    tableData() {
      this.pageChange(1);
    }
  }
};
</script>
