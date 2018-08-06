<template>
  <el-table :data="list" fit >
    <el-table-column align="left" >
      <template slot-scope="scope">
        {{scope.row.pro_intro}}
      </template>
    </el-table-column>
    <el-table-column align="left" width="200">
      <template slot-scope="scope">
        <span v-if="scope.row.pro_type === 0" class="text-gray">游戏推荐</span>
        <span v-else class="text-gray">游戏测评/攻略</span>
      </template>
    </el-table-column>
    <el-table-column width="200" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
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
    edit(row) {
      const row_num = this.list.indexOf(row)
      row.row_num = row_num
      this.$emit('editPro', row)
    },
    remove(row) {
      const row_num = this.list.indexOf(row)
      this.list.splice(row_num, 1)
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.text-gray{
  color:#ccc;
}
</style>


