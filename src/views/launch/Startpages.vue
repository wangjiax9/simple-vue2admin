<template>
  <div class="app-container">
    <div class="startpages">
      <div class="filter-container">
        <el-button style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-plus">添加</el-button>
      </div>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label='启动页ID' width="95">
          <template slot-scope="scope">
            {{scope.row._id}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='ClientID' width="95">
          <template slot-scope="scope">
            {{scope.row.client_id}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='启动图' width="240">
          <template slot-scope="scope">
            <img :src="scope.row.url" width="218"/>
          </template>
        </el-table-column>
        <el-table-column align="left" label='跳转链接'>
          <template slot-scope="scope">
            <a class="link-type" target="_blank" :href="scope.row.jump_url" >{{scope.row.jump_url}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" label='大小' width="95">
          <template slot-scope="scope">
            {{scope.row.size | bytesToSize}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='显示时长（ms）' width="180">
          <template slot-scope="scope">
            {{scope.row.duration}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.started_at | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.stoped_at | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button class="ypw-btn" icon="el-icon-edit" type="primary" size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="150">
          <template slot-scope="scope">
            <el-button class="ypw-btn" type="success" size="mini" v-if="scope.row.status">已上线</el-button>
            <el-button class="ypw-btn" type="warning" size="mini" v-else>未上线</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'startpages',
    data() {
      return {
        listLoading: false,
        total: 1,
        listQuery: {
          page: 1,
          limit: 20
        },
        list: [
          {
            _id: 121,
            client_id: 3232,
            url: 'https://gameapp.fp.ps.netease.com/file/5b4452585e60273b263be5fbBMHIlO6Z',
            started_at: 1531211749,
            stoped_at: 1531211759,
            duration: 3000,
            size: 1212332,
            jump_url: 'https://ypw.163.com',
            status: 1
          }
        ]
      }
    },
    methods: {
      // 改变分页大小
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getLaunchList()
      },
      // 翻页
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getLaunchList()
      },
      handleAdd() {
        console.log('添加')
        this.$router.push({ path: `/resource/launch/startpages-edit/1` })
      },
      handleEdit(id) {
        this.$router.push({ path: `/resource/launch/startpages-edit/${id}` })
      },
      getLaunchList() {
        console.log('获取启动页列表')
      }
    }
  }
</script>