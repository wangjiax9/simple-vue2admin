<template>
  <div class="app-container">
    <div class="filter-container">
      <label class="radio-label" style="padding-left:0;">一级类别: </label>
      <el-select style="width: 160px;" class="filter-item" v-model="pid" placeholder="一级类别" @change="supChanged(pid)">
        <el-option v-for="item in pidOptions" :key="item.tid" :label="item.name" :value="item.tid">
        </el-option>
      </el-select>
      <label class="radio-label" style="padding-left:0;margin-left: 20px;">二级类别: </label>
      <el-select class="filter-item" style="width: 180px" v-model="tid" placeholder="二级类别" @change="subChanged(tid)">
        <el-option v-for="item in tidOptions" :key="item.tid" :label="item.name" :value="item.tid">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="listQuery.sub.pid">添加用户</el-button>
    </div>

    <el-table :data="userList" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='用户ID' width="95">
        <template slot-scope="scope">
          {{scope.row.uid}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='用户昵称' width="200">
        <template slot-scope="scope">
          <a class="link-type" target="_blank" :href="'/admin/users/'+ scope.row.uid">{{scope.row.nickname}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份说明" width="300">
        <template slot-scope="scope">
          <div v-html="scope.row.desc"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete"  @click="removeUser(scope.row)">移除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.updated_at | parseTime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="meta.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { fetchIdentity, fetchIdentityUser, postIdentityUser, deleteIdentityUser } from '@/api/identity'
  export default {
    name: 'identity-user',
    data() {
      return {
        pid: 0,
        tid: 0,
        userList: [],
        meta: {},
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          offset: 0,
          sup: {
            pid: 0,
            tid: 0
          },
          sub: {
            pid: 0,
            tid: 0
          }
        },
        pidOptions: [],
        tidOptions: [
          {
            name: '全部',
            pname: '全部',
            pid: 0,
            tid: 0
          }
        ]
      }
    },
    created() {
      const self = this
      fetchIdentity({ pid: 0 }).then(res => {
        self.pidOptions = res.data.data.map(identity => {
          return {
            name: identity.name,
            pname: identity.pname,
            pid: identity.pid,
            tid: identity.tid
          }
        })
        self.pid = Number(this.$route.query.pid) || 0
        self.tid = Number(this.$route.query.tid) || 0
        self.listQuery.page = Number(this.$route.query.page) || 1
        self.listQuery.limit = Number(this.$route.query.limit) || 20
        self.getSupType(self.pid, self.tid)
      })
    },
    methods: {
      // 选择一级类别
      supChanged(pid) {
        this.pid = pid
        this.listQuery.sup = Object.assign({}, this.pidOptions.filter((sup) => {
          return sup.tid === pid
        })[0])
        this.listQuery.page = 1
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
        this.getSubType(this.listQuery.sup)
      },
      // 选择二级类别
      subChanged(tid) {
        this.tid = tid
        this.listQuery.sub = Object.assign({}, this.tidOptions.filter((sub) => {
          return sub.tid === tid
        })[0])
        this.listQuery.page = 1
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
        this.getUsers(tid)
      },
      // 获取一级类别
      getSupType(pid) {
        const self = this
        const oSup = self.pidOptions.filter((sup) => {
          return sup.tid === self.pid
        })
        self.listQuery.sup = oSup.length > 0 ? Object.assign({}, oSup[0]) : Object.assign({}, self.pidOptions[0])
        self.pid = self.listQuery.sup.tid
        self.getSubType(self.listQuery.sup)
      },
      // 获取二级类别
      getSubType(sup) {
        const self = this
        fetchIdentity({ pid: sup.tid }).then((res) => {
          self.tidOptions = [{
            name: '全部',
            pname: '全部',
            pid: sup.pid,
            tid: sup.tid
          }].concat(res.data.data.map((identity) => {
            return {
              name: identity.name,
              pname: identity.pname,
              pid: identity.pid,
              tid: identity.tid
            }
          }))
          const oSub = self.tidOptions.filter((sub) => {
            return sub.tid === self.tid
          })
          self.listQuery.sub = oSub.length > 0 ? Object.assign({}, oSub[0]) : Object.assign({}, self.tidOptions[0])
          self.tid = self.listQuery.sub.tid
          self.getUsers(self.tid)
        })
      },
      // 获取身份用户列表
      getUsers(tid) {
        const self = this
        fetchIdentityUser({
          page: self.listQuery.page,
          limit: self.listQuery.limit,
          tid: self.listQuery.sub.tid,
          offset: self.listQuery.offset
        }).then(res => {
          self.userList = res.data.data
          self.meta = res.data.meta
          self.listLoading = false
        })
      },
      // 改变分页大小
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getUsers()
      },
      // 翻页
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
        this.getUsers()
      },
      // 处理添加身份用户
      handleCreate() {
        const self = this
        self.$prompt('请输入用户ID', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]*$/,
          inputErrorMessage: '用户ID格式不正确'
        }).then(({ value }) => {
          self.addUser(value)
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      },
      // 添加身份用户
      addUser(userId) {
        const self = this
        postIdentityUser({
          tid: self.tid,
          uid: userId
        }).then(res => {
          if (res.data.code === 0) {
            self.userList = [res.data.data].concat(self.userList)
            self.$message({
              type: 'success',
              message: '添加成功!'
            })
          } else {
            self.$message({
              type: 'info',
              message: '添加失败'
            })
          }
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '添加失败'
          })
        })
      },
      // 移除身份用户
      removeUser(user) {
        const self = this
        self.$confirm('此操作将删除该身份用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteIdentityUser({
            tid: self.tid,
            uid: user.uid
          }).then(res => {
            if (res.data.code === 0) {
              self.userList = self.userList.filter((userObj) => {
                return userObj.uid !== user.uid
              })
              self.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              self.$message({
                type: 'info',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
<style>
  .filter-container .filter-item{
    margin-bottom: 0;
  }
  .radio-label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 30px;
  }
</style>