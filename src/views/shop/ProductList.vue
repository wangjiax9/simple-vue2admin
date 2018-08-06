<template>
  <div class="app-container">
    <div class="products">
      <div class="filter-container">
        <el-button style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-plus">添加商品</el-button>
        <el-form style="float: right;" :inline="true" :model="filterForm" class="filterForm">
          <el-form-item label="价格顺序:">
            <el-select v-model="filterForm.priceOrder" placeholder="请选择">
              <el-option label="升序" :value="1"></el-option>
              <el-option label="降序" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存顺序:">
            <el-select v-model="filterForm.stockOrder" placeholder="请选择">
              <el-option label="升序" :value="1"></el-option>
              <el-option label="降序" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="filterForm.available" placeholder="请选择">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="已上线" :value="1"></el-option>
              <el-option label="未上线" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="name:">
            <el-input v-model="filterForm.name" placeholder="请输入name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="list" v-loading.body="listLoading" @sort-change="sortTable" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label='ID' width="95">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='顺序' prop="order" width="95">
          <template slot-scope="scope">
            {{scope.row.rank}}
          </template>
        </el-table-column>
        <el-table-column align="left" label='name'>
          <template slot-scope="scope">
            <router-link class="link-type" :to="{ path: `/shop/products/product-edit/${scope.row.id}` }">{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label='价格' prop="price" width="95" sortable>
          <template slot-scope="scope">
            {{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='库存' prop="stock" width="95" sortable>
          <template slot-scope="scope">
            {{scope.row.stock}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="限购数量" width="95">
          <template slot-scope="scope">
            {{scope.row.quota}}
          </template>
        </el-table-column>
        <el-table-column align="center" label='需要等级' width="120">
          <template slot-scope="scope">
            {{scope.row.required_level}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="created_at" width="240" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.created_at | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="available" width="240" sortable>
          <template slot-scope="scope">
            <el-button class="ypw-btn" type="success" size="mini" v-if="scope.row.available">已上线</el-button>
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
  import { fetchProductList, postProduct } from '@/api/shop'
  export default {
    name: 'products',
    data() {
      return {
        listLoading: false,
        list: [],
        total: 1,
        listQuery: {
          page: 1,
          limit: 20
        },
        filterForm: {
          priceOrder: 1,
          stockOrder: 1,
          available: -1,
          name: ''
        }
      }
    },
    components: {
      'file-upload': FileUpload
    },
    methods: {
      onFilter() {
        const self = this
        this.getProductList(self.filterForm)
      },
      sortTable(e) {
        console.log(e)
      },
      getProductList(filterData) {
        const self = this
        fetchProductList(Object.assign(self.listQuery, filterData)).then((res) => {
          if (res.data.code === 0) {
            self.list = res.data.data
          }
        })
      },
      // 改变分页大小
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getProductList()
      },
      // 翻页
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getProductList()
      },
      handleAdd() {
        postProduct().then((res) => {
          console.log(res)
          this.$router.push({ path: `/resource/activity/products-edit/1` })
        })
      }
    },
    created() {
      this.getProductList()
    }
  }
</script>
<style>
  .radio-label{
    color: #606266;
    padding-right: 10px;
  }
</style>