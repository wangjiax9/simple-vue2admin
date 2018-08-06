<template>
  <el-table :data="list" fit class="el-table-nohead">
    <el-table-column align="left" width="120">
      <template slot-scope="scope">
        <span class="text-gray">{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="left">
      <template slot-scope="scope">
        <img class="avatar" :src="scope.row.avatar"/>
        <span class="text-gray">{{scope.row.nickname}}</span>
      </template>
    </el-table-column>
    <el-table-column width="200" align="center">
      <template slot-scope="scope">
        <el-button type="danger" size="mini" icon="el-icon-delete"  @click="remove(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    remove(row) {
      const row_num = this.list.indexOf(row)
      this.list.splice(row_num, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar{
  width:24px;
  height:24px;
  vertical-align: middle;
  border-radius: 50%;
  margin-right: 5px;
}
.text-gray{
  color:#ccc;
}
</style>


