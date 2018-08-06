<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" @click="addLottery" type="primary" icon="el-icon-plus">添加</el-button>
        <el-form style="float: right;" :inline="true" :model="filterForm" class="filterForm">
          <el-form-item label="时间范围:">
            <el-date-picker
                v-model="filterForm.start_at"
                type="date"
                format="yyyy-MM-dd"
                value-format="timestamp"
                placeholder="选择开始日期">
            </el-date-picker>
            <span> - </span>
            <el-date-picker
                v-model="filterForm.end_at"
                type="date"
                format="yyyy-MM-dd"
                value-format="timestamp"
                placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="list" @sort-change="getSort" :default-sort = "{prop: 'start_at', order: 'descending'}" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label='ID' width="120">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖品名称" width="300">
          <template slot-scope="scope">
            <span v-if="scope.row.reward_type === 1">{{scope.row.product_name}}</span>
            <span v-else>Yo币+{{scope.row.yo_num}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="start_at" align="center" label="开始时间" width="300">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.start_at | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间" width="300">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.end_at | parseTime}}</span>
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
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editLottery(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"  @click="removeLottery(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="meta.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="抽奖编辑窗口" :visible.sync="giftVisible" custom-class="gift-model">
      <el-form :model="giftForm" label-position="right" size="medium">
        <el-form-item label="开始时间" prop="start_at">
          <el-date-picker
              v-model="giftForm.start_at"
              type="date"
              format="yyyy-MM-dd"
              value-format="timestamp"
              placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_at">
          <el-date-picker
              v-model="giftForm.end_at"
              type="date"
              format="yyyy-MM-dd"
              value-format="timestamp"
              placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品类型" prop="reward_type">
          <el-select v-model="giftForm.reward_type" placeholder="请选择">
            <el-option label="Yo币" :value="0"></el-option>
            <el-option label="非Yo币" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联商品ID" prop="product_id" v-if="giftForm.reward_type === 1">
          <el-input v-model="giftForm.product_id" placeholder="请输入商品ID"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name" v-if="giftForm.reward_type === 1">
          <el-input v-model="giftForm.product_name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="Yo币数量" prop="stock" v-if="giftForm.reward_type === 0">
          <el-input v-model="giftForm.yo_num" placeholder="请输入Yo币数量"></el-input>
        </el-form-item>
        <el-form-item label="奖品数量" prop="stock">
          <el-input v-model="giftForm.stock" placeholder="请输入奖品数量"></el-input>
        </el-form-item>
        <el-form-item label="奖品概率" prop="win_rate">
          <el-input v-model="giftForm.win_rate" placeholder="请输入奖品概率">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { fetchLotteryList, updateLottery, deleteLottery } from '@/api/lottery'
  export default {
    name: 'lottery-list',
    data() {
      return {
        lotteryEdit: '/resource/lottery/lottery-edit',
        listLoading: false,
        list: [],
        meta: {},
        filterForm: {
          start_at: '',
          end_at: ''
        },
        order_by: '-start_at',
        listQuery: {
          page: 1,
          limit: 20,
          offset: 0
        },
        giftForm: {},
        giftVisible: false
      }
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
      getSort(e) {
        const self = this
        self.order_by = e.prop === 'id' ? `_${e.prop}` : e.prop
        if (e.order === 'descending') {
          self.order_by = '-' + self.order_by
        } else if (e.order === 'ascending') {
          self.order_by = '+' + self.order_by
        }
        self.getList()
      },
      onFilter() {
        const self = this
        if (!self.filterForm.start_at || !self.filterForm.end_at) {
          self.$message.error('请填写时间范围')
          return false
        }
        const data = Object.assign({}, this.filterForm)
        data.start_at = parseInt(data.start_at / 1000)
        data.end_at = parseInt(data.end_at / 1000)
        self.listQuery.page = 1
        self.listQuery.offset = (self.listQuery.page - 1) * self.listQuery.limit
        self.getList(data)
      },
      onCancel() {
        const self = this
        deleteLottery(self.giftForm.id).then(response => {
          this.$message({
            type: 'info',
            message: '已取消添加商品'
          })
        }).catch(error => {
          console.log(error)
        })
        this.giftVisible = false
      },
      onSubmit() {
        if (!this.giftForm.reward_type && this.giftForm.reward_type !== 0) {
          this.$message.error('请选择奖品类型')
          return false
        }
        if ((!this.giftForm.product_id || !this.giftForm.stock || !this.giftForm.product_name) && !this.giftForm.yo_num) {
          this.$message.error('请完成奖品填写')
          return false
        }
        if (!this.giftForm.win_rate) {
          this.$message.error('请填写中奖概率')
          return false
        }
        if (!this.giftForm.start_at) {
          this.$message.error('请填写开始时间')
          return false
        }
        if (!this.giftForm.end_at) {
          this.$message.error('请填写结束时间')
          return false
        }
        const data = Object.assign({}, this.giftForm)
        if (data.reward_type === 0) {
          data.product_name = 'Yo币+' + data.yo_num
          data.yo_num = Number(data.yo_num)
        } else {
          data.product_id = Number(data.product_id)
        }
        data.stock = Number(data.stock)
        data.win_rate = Number(data.win_rate)
        data.start_at = parseInt(data.start_at / 1000)
        data.end_at = parseInt(data.end_at / 1000)
        data.updated_at = parseInt(data.updated_at / 1000)
        this.updateGift(data)
        this.giftVisible = false
      },
      updateGift(row) {
        const self = this
        const data = Object.assign({}, row)
        delete data.updated_at
        updateLottery(data).then((res) => {
          if (res.data.code === 0) {
            const rowArr = self.list.filter((gift) => {
              return gift.id === row.id
            })
            if (rowArr.length > 0) {
              self.list.map((gift) => {
                if (gift.id === row.id) {
                  gift = row
                }
              })
            } else {
              self.list = [row, ...self.list]
            }
          }
        })
      },
      getList(query) {
        const self = this
        self.listLoading = true
        fetchLotteryList(Object.assign({}, { order_by: self.order_by }, query, self.listQuery)).then(response => {
          self.list = response.data.data || []
          self.meta = response.data.meta
          self.listLoading = false
        })
      },
      addLottery() {
        const self = this
        updateLottery().then(response => {
          const data = response.data.data
          data.start_at = ''
          data.end_at = ''
          data.updated_at = parseInt(data.updated_at) * 1000
          self.giftForm = Object.assign({ reward_type: 0 }, data)
          self.giftVisible = true
        })
      },
      editLottery(row) {
        this.$router.push({
          path: `${this.lotteryEdit}/${row.id}?start_at=${row.start_at}&end_at=${row.end_at}`
        })
      },
      removeLottery(row) {
        this.$confirm('确定要删除该抽奖吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLottery(row.id).then(response => {
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


