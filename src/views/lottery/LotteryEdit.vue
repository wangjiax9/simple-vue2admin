<template>
  <div class="app-container">
    <div class="lottery-edit">
      <el-button @click="addGift" type="primary" icon="el-icon-plus">新增</el-button>
      <gift-list :list="gifts" @editGift="showGiftModel" @removeGift="deleteGift"></gift-list>
      <el-button class="back-btn" @click="backLottery" type="primary">确定</el-button>
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
          <el-input v-model="giftForm.yo_num" placeholder="请输入奖品数量"></el-input>
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
  import GiftList from './components/GiftList'
  import { fetchLotteryList, updateLottery, deleteLottery } from '@/api/lottery'
  export default {
    name: 'lottery-edit',
    data() {
      return {
        lotteryList: '/resource/lottery/lottery-list',
        query: {
          start_at: 0,
          end_at: 0
        },
        gifts: [],
        giftVisible: false,
        giftForm: {
          reward_type: 0
        }
      }
    },
    components: {
      'gift-list': GiftList
    },
    computed: {
      id() {
        return Number(this.$route.params.id)
      },
      start_at() {
        return Number(this.$route.query.start_at)
      },
      end_at() {
        return Number(this.$route.query.end_at)
      }
    },
    methods: {
      showGiftModel(row) {
        this.giftForm = Object.assign({}, row)
        this.giftForm.start_at = parseInt(this.giftForm.start_at) * 1000
        this.giftForm.updated_at = parseInt(this.giftForm.updated_at) * 1000
        this.giftForm.end_at = parseInt(this.giftForm.end_at) * 1000
        this.giftVisible = true
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
        if ((!this.giftForm.product_id || !this.giftForm.stock) && !this.giftForm.yo_num) {
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
      getGifts(query) {
        const self = this
        self.listLoading = true
        fetchLotteryList(query).then(response => {
          self.gifts = response.data.data || []
          self.listLoading = false
        })
      },
      backLottery() {
        this.$router.push({
          path: this.lotteryList
        })
      },
      addGift() {
        const self = this
        updateLottery().then((res) => {
          const data = res.data.data
          data.start_at = ''
          data.end_at = ''
          data.updated_at = parseInt(data.updated_at) * 1000
          self.giftForm = Object.assign({ reward_type: 0 }, data)
        })
        this.giftVisible = true
      },
      updateGift(row) {
        const self = this
        const data = Object.assign({}, row)
        delete data.updated_at
        updateLottery(data).then((res) => {
          if (res.data.code === 0) {
            const rowArr = self.gifts.filter((gift) => {
              return gift.id === row.id
            })
            if (rowArr.length > 0) {
              self.gifts.map((gift) => {
                if (gift.id === row.id) {
                  gift = row
                }
              })
            } else {
              console.log(row)
              self.gifts = [row, ...self.gifts]
            }
          }
        })
      },
      deleteGift(row) {
        const self = this
        const row_num = this.gifts.indexOf(row)
        this.$confirm('确定要删除该抽奖吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLottery(row.id).then((res) => {
            if (res.data.code === 0) {
              self.gifts.splice(row_num, 1)
              self.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    created() {
      const self = this
      if (self.start_at) {
        self.query.start_at = self.start_at
      }
      if (self.end_at) {
        self.query.end_at = self.end_at
      }
      self.getGifts(self.query)
    }
  }
</script>
<style>
  .lottery-edit{
    padding-left: 120px;
    width: 1040px;
  }
  .back-btn{
    margin-top: 40px;
  }
  .timer{
    width: 100%;
  }
  .radio-label{
    font-size: 14px;
    color: #606266;
    padding-right: 10px;
  }
  .gift-model{
    padding: 20px 40px 20px 20px;
  }
</style>