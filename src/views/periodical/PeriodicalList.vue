<template>
  <div class="app-container">
      <div class="filter-container">
        <div class="filter-container">
          <el-button class="filter-item" style="margin-left: 10px;" @click="addPeriodical" type="primary" icon="el-icon-plus">添加</el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column align="center" label='ID' width="95">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="缩略图">
            <template slot-scope="scope">
              <img :src="scope.row.head_pic" height="120"/>
            </template>
          </el-table-column>
          <el-table-column label="生成时间" width="200" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.created_at | parseTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="最后保存时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{scope.row.updated_at | parseTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editPeriodical(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete"  @click="removePeriodical(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>
<script>
import { fetchPeriodicalList, updatePeriodical, deletePeriodical } from '@/api/periodical'
export default {
  name: 'periodical-list',
  data() {
      return {
        listLoading: false,
        list: []
      }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchPeriodicalList({ limit: 20, offset: 0 }).then(response => {
        this.list = response.data.data
      })
    },
    addPeriodical() {
      updatePeriodical().then(response => {
        const data = response.data.data
        this.$router.push({
          path: `/resource/periodical/periodical-edit/${data.id}`
        })
      })
    },
    editPeriodical(row) {
      this.$router.push({
        path: `/resource/periodical/periodical-edit/${row.id}`
      })
    },
    removePeriodical(row) {
      this.$confirm('确定要删除该期刊吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePeriodical(row.id).then(response => {
          const row_num = this.list.indexOf(row)
          this.list.splice(row_num, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>


