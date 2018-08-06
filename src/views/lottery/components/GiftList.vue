<template>
  <el-table :data="list" fit>
    <el-table-column align="left" width="200">
      <template slot-scope="scope">
        {{scope.row.id}}
      </template>
    </el-table-column>
    <el-table-column align="left">
      <template slot-scope="scope">
        <span class="text-gray" v-if="scope.row.reward_type === 1">{{scope.row.product_name}}</span>
        <span class="text-gray" v-else>Yo币+{{scope.row.yo_num}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" width="200">
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
        this.$emit('editGift', row)
      },
      remove(row) {
        this.$emit('removeGift', row)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .text-gray{
    color:#ccc;
  }
</style>
