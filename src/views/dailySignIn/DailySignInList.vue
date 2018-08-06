<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" @click="addDailySignIn" type="primary" icon="el-icon-plus">添加</el-button>
      </div>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label='ID' width="95">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="日签图" width="400">
          <template slot-scope="scope">
            <img :src="scope.row.daily_pic" height="120"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间" width="300">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.start_at | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" width="300">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.updated_at | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDailySignIn(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"  @click="removeDailySignIn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="meta.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import FileUpload from '@/components/upload/DragImage'
  import { fetchDailySignInList, updateDailySignIn, deleteDailySignIn } from '@/api/dailySignIn'
  export default {
    name: 'daily-sign-in-list',
    data() {
      return {
        dailySignInEdit: '/resource/daily/daily-sign-in-edit',
        listLoading: false,
        list: [],
        meta: {},
        listQuery: {
          page: 1,
          limit: 20,
          offset: 0
        }
      }
    },
    components: {
      'file-upload': FileUpload
    },
    created() {
      this.getList()
    },
    methods: {
      // 改变分页大小
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      // 翻页
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
        this.getList()
      },
      getList() {
        const self = this
        self.listLoading = true
        fetchDailySignInList({ limit: 20, offset: 0 }).then(response => {
          self.list = response.data.data
          self.meta = response.data.meta
          self.listLoading = false
        })
      },
      addDailySignIn() {
        const self = this
        updateDailySignIn().then(response => {
          const data = response.data.data
          self.$router.push({
            path: `${self.dailySignInEdit}/${data.id}`
          })
        })
      },
      editDailySignIn(row) {
        const self = this
        self.$router.push({
          path: `${self.dailySignInEdit}/${row.id}`
        })
      },
      removeDailySignIn(row) {
        this.$confirm('确定要删除该签到黄历吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDailySignIn(row.id).then(response => {
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
<style>
  .sign-model{
    padding: 20px 40px 20px 20px;
  }
</style>


