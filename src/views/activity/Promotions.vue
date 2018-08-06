<template>
  <div class="app-container">
    <div class="promotions">
      <div class="filter-container">
        <el-button style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-plus">添加活动</el-button>
        <el-form style="float: right;" :inline="true" :model="filterForm" class="filterForm">
          <el-form-item label="应用:">
            <el-select v-model="filterForm.client_id" placeholder="请选择">
              <el-option v-for="item in apps" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置:">
            <el-select v-model="filterForm.position" placeholder="请选择">
              <el-option v-for="item in pos" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="filterForm.published" placeholder="请选择">
              <el-option label="已上线" :value="1"></el-option>
              <el-option label="未上线" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题:">
            <el-input v-model="filterForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label='活动ID' width="95">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='标题' width="95">
          <template slot-scope="scope">
            <router-link class="link-type" :to="{ path: `/resource/activity/promotions-edit/${scope.row.id}` }">{{scope.row.title}}</router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label='banner' width="240">
          <template slot-scope="scope">
            <img :src="scope.row.banner.url" width="218"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label='类型' width="95">
          <template slot-scope="scope">
            <span v-if="scope.row.promotion_type === 1">商品</span>
            <span v-else-if="scope.row.promotion_type === 2">页面</span>
            <span v-else>应用内跳转</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="内容">
          <template slot-scope="scope">
            {{scope.row.json_info}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='位置' width="120">
          <template slot-scope="scope">
            {{scope.row.position}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="120">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.created_at | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label='浏览人数' width="95">
          <template slot-scope="scope">
            {{scope.row.view_number}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='参与人数' width="95">
          <template slot-scope="scope">
            {{scope.row.participate_number}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='用户绑定数（前／后）' width="95">
          <template slot-scope="scope">
            {{scope.row.before_bind_user}}/{{scope.row.after_bind_user}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='评论数量（前／后）' width="95">
          <template slot-scope="scope">
            {{scope.row.before_comment}}/{{scope.row.after_comment}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='Rank' width="95">
          <template slot-scope="scope">
            {{scope.row.rank}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="120">
          <template slot-scope="scope">
            <el-button class="ypw-btn" type="success" size="mini" v-if="scope.row.published">已上线</el-button>
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
  import FileUpload from '@/components/upload/DragImage'
  import { fetchActivityList, postActivity } from '@/api/activity'
  export default {
    name: 'promotions',
    data() {
      return {
        listLoading: false,
        list: [],
        total: 1,
        listQuery: {
          page: 1,
          limit: 20
        },
        apps: [
          {
            name: 'ALL',
            id: 0
          }, {
            name: '荒野行动盒子',
            id: 1
          }, {
            name: '行界零',
            id: 2
          }, {
            name: 'demo',
            id: 3
          }
        ],
        pos: [
          {
            name: 'ALL',
            id: 0
          }, {
            name: '商城',
            id: 1
          }, {
            name: '发现页banner',
            id: 2
          }, {
            name: '个人页',
            id: 3
          }, {
            name: '首页广告',
            id: 4
          }, {
            name: '广场banner',
            id: 5
          }, {
            name: '广场副banner',
            id: 6
          }, {
            name: '荒野行动盒子(old)',
            id: 7
          }, {
            name: '盒子活动',
            id: 8
          }, {
            name: '盒子首页',
            id: 9
          }, {
            name: '盒子首页副banner',
            id: 10
          }, {
            name: '社区',
            id: 11
          }
        ],
        filterForm: {
          client_id: 0,
          position: 0,
          published: 1,
          title: ''
        }
      }
    },
    components: {
      'file-upload': FileUpload
    },
    methods: {
      onFilter() {
        const self = this
        this.getActivityList(self.filterForm)
      },
      getActivityList(filterData) {
        const self = this
        fetchActivityList(Object.assign(self.listQuery, filterData)).then((res) => {
          if (res.data.code === 0) {
            self.list = res.data.data
          }
        })
      },
      // 改变分页大小
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getActivityList()
      },
      // 翻页
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getActivityList()
      },
      handleAdd() {
        postActivity().then((res) => {
          console.log(res)
          this.$router.push({ path: `/resource/activity/promotions-edit/1` })
        })
      }
    },
    created() {
      this.getActivityList()
    }
  }
</script>
<style>
  .radio-label{
    color: #606266;
    padding-right: 10px;
  }
</style>