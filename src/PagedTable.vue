<template>
  <div>
    <el-table :data="pagedData" v-loading="loading">
      <el-table-column
        v-for="item in tableHeader"
        :key="item.prop"
        :prop="item.prop"
        :width="item.width"
        :label="item.label"
      ></el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      :total="filterTableData.length"
      @current-change="pageChange"
    />
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
  props: ["tableData", "tableHeader", "loading", "filter"],
  data() {
    return {
      filterTableData: [],
      pagedData: [],
      currentPage: 1
    };
  },
  methods: {
    pageChange(index) {
      this.currentPage = index;
      this.filterTableData = [];
      if (this.filter) {
        this.tableData.forEach(element => {
          if (element) {
            for (let property in element) {
              if (element[property] && element[property].indexOf && element[property].indexOf(this.filter) > -1) {
                this.filterTableData.push(element);
                break;
              }
            }
          }
        });
      } else {
        this.filterTableData = this.tableData;
      }
      this.pagedData = this.filterTableData.slice(
        (index - 1) * 10,
        Math.min(index * 10, this.filterTableData.length)
      );
    }
  },
  watch: {
    tableData() {
      this.pageChange(1);
    },
    filter() {
      this.pageChange(1);
    }
  }
};
</script>
