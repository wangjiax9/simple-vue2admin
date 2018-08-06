<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="saveOrder"><svg-icon icon-class="save"></svg-icon>保存排序</el-button>
    </div>
    <el-table :data="list" row-key="id" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" width="80" label='类型' >
        <template slot-scope="scope">
          {{feedsType[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.type===6" href="">{{scope.row.title}}</a>
          <a v-else-if="scope.row.type===8" href="">{{scope.row.name_cn}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="浏览数">
        <template slot-scope="scope">
          <span v-if="scope.row.type===6">{{scope.row.browse_count}}</span>
          <span v-else-if="scope.row.type===8">-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="评论数">
        <template slot-scope="scope">
          {{scope.row.comment_count}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="下载数">
        <template slot-scope="scope">
          <span v-if="scope.row.type===6">-</span>
          <span v-else-if="scope.row.type===8">{{scope.row.download_count}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="发布时间">
        <template slot-scope="scope">
          <span v-if="scope.row.type===6">{{scope.row.post_created_at | parseTime}}</span>
          <span v-else-if="scope.row.type===8">{{scope.row.game_publish_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="推荐时间">
        <template slot-scope="scope">
          <span v-if="scope.row.type===6">{{scope.row.publish_time | parseTime}}</span>
          <span v-else-if="scope.row.type===8">{{scope.row.publish_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="shiftOutFeeds(scope.row)">取消推荐</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Drag" width="80">
        <template slot-scope="scope">
          <svg-icon class='drag-handler' icon-class="drag"></svg-icon>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination 
        background 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="listQuery.page" 
        :page-sizes="[10,20,30,50]" 
        :page-size="listQuery.limit" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="meta.total">
      </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { getFeeds, removeFeeds, updateFeedsOrder } from '@/api/feeds'
import Sortable from 'sortablejs'
export default {
  name: 'feeds',
  data() {
    return {
      /** ↓↓↓列表专用↓↓↓ */
      meta: {},
      list: [],
      listLoading: false,
      listQuery: {  // 查询条件
        page: 1,
        offset: 0,
        limit: 20
      },
      /** ↑↑↑列表专用↑↑↑ */
      // 排序对象
      sortable: null,
      // 排序列表
      rankList: [],

      feedsType: {
        '6': '帖子',
        '8': '游戏'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 分页大小改变
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.getList()
    },
    // 页码改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
      this.getList()
    },
    // 获取列表
    getList() {
        this.listLoading = true
        getFeeds(this.listQuery).then(response => {
          this.meta = response.data.meta
          this.list = []
          response.data.data.forEach(v => {
            const obj = Object.assign({}, v.data.data)
            obj.type = v.data.type
            obj.source = v.source
            this.list.push(obj)
          })
          this.listLoading = false
          this.rankList = this.list.map(v => v.rank)
          this.$nextTick(() => {
            this.setSort()
          })
        })
    },
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          // list移动row
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          // 更新排序
          this.rankList.forEach((v, i) => {
            this.list[i].rank = v
          })
        }
      })
    },
    // 保存顺序
    saveOrder() {
      updateFeedsOrder({ data: this.list }).then(response => {
        this.$message.success('保存顺序成功')
      }).catch(() => {
        this.$message.error('保存顺序失败')
      })
    },
    // 取消推荐
    shiftOutFeeds(row) {
      this.$confirm('是否取消推荐？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeFeeds(row.rid).then(response => {
          this.$message.success('取消成功!')
          this.getList()
        }).catch(() => {
          this.$message.error('取消失败!')
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-handler{
  cursor: pointer;
}
</style>
