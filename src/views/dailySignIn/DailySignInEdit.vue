<template>
  <div class="app-container">
    <div class="daily-sign-in-edit">
      <el-form :model="signForm" label-position="right" :label-width="formLabelWidth">
        <el-row style="margin-bottom:20px">
          <el-col :span="24"><el-tag>日签图</el-tag></el-col>
        </el-row>
        <el-form-item>
          <file-upload v-model="signForm.daily_pic"></file-upload>
        </el-form-item>
        <el-row style="margin-bottom:20px">
          <el-col :span="24"><el-tag>运势文本</el-tag></el-col>
        </el-row>
        <el-card class="box-card mb-20" shadow="never">
          <el-row style="margin-bottom:20px">
            <el-col :span="24"><el-tag type="success">宜</el-tag></el-col>
          </el-row>
          <el-form-item label="主文本" prop="apply_explain">
            <el-input v-model="signForm.fortune.benefit.title" placeholder="文本长度1～4个字"></el-input>
          </el-form-item>
          <el-form-item label="描述文本" prop="apply_url">
            <el-input v-model="signForm.fortune.benefit.desc" placeholder="文本长度1～10个字"></el-input>
          </el-form-item>
        </el-card>
        <el-card class="box-card mb-20" shadow="never">
          <el-row style="margin-bottom:20px">
            <el-col :span="24"><el-tag type="success">忌</el-tag></el-col>
          </el-row>
          <el-form-item label="主文本" prop="apply_explain">
            <el-input v-model="signForm.fortune.harmful.title" placeholder="文本长度1～4个字"></el-input>
          </el-form-item>
          <el-form-item label="描述文本" prop="apply_url">
            <el-input v-model="signForm.fortune.harmful.desc" placeholder="文本长度1～10个字"></el-input>
          </el-form-item>
        </el-card>
        <el-row style="margin-bottom:20px">
          <label class="radio-label" style="padding-left:0;">开始时间: </label>
          <el-date-picker
              v-model="signForm.start_at"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="timestamp">
          </el-date-picker>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/upload/DragImage'
    import { fetchDailySignIn, updateDailySignIn, deleteDailySignIn } from '@/api/dailySignIn'
  export default {
    name: 'daily-sign-in-edit',
    data() {
      return {
        dailySignIn: '/resource/daily/daily-sign-in',
        formLabelWidth: '120px',
        signForm: {
          daily_pic: '',
          fortune: {
            benefit: {
              title: '',
              desc: ''
            },
            harmful: {
              title: '',
              desc: ''
            }
          },
          start_at: ''
        }
      }
    },
    components: {
      'file-upload': FileUpload
    },
    computed: {
      id() {
        return Number(this.$route.params.id)
      }
    },
    methods: {
      onSubmit() {
        const self = this
        if (!self.signForm.daily_pic) {
          this.$message.error('请上传日签图')
          return false
        }
        if (!self.signForm.fortune.benefit.title) {
          this.$message.error('请填写"宜"主文本')
          return false
        }
        if (!self.signForm.fortune.benefit.desc) {
          this.$message.error('请填写"宜"描述文本')
          return false
        }
        if (!self.signForm.fortune.harmful.title) {
          this.$message.error('请填写"忌"主文本')
          return false
        }
        if (!self.signForm.fortune.harmful.desc) {
          this.$message.error('请填写"忌"描述文本')
          return false
        }
        if (!self.signForm.start_at) {
          this.$message.error('请填写开始时间')
          return false
        }
        // 发送日签
        const data = Object.assign({}, self.signForm)
        data.start_at = parseInt(data.start_at / 1000)
        updateDailySignIn(Object.assign({ id: self.id }, data)).then((res) => {
          if (res.data.code === 0) {
            this.$message.success('操作成功')
            this.$router.push({
              path: `${self.dailySignIn}`
            })
          } else {
            this.$message.error(res.data.message || '错误了')
          }
        })
      },
      onCancel() {
        const self = this
        deleteDailySignIn(self.id).then(response => {
          this.$message({
            type: 'info',
            message: '已取消添加日签'
          })
        }).catch(error => {
          console.log(error)
        })
        this.$router.push({
          path: `${self.dailySignIn}`
        })
      },
      getSignIn(id) {
        const self = this
        fetchDailySignIn(id).then((res) => {
          if (res.data.data.fortune.benefit) {
            self.signForm.fortune.benefit = Object.assign({}, res.data.data.fortune.benefit)
            self.signForm.fortune.harmful = Object.assign({}, res.data.data.fortune.harmful)
          }
          self.signForm.daily_pic = res.data.data.daily_pic
          self.signForm.start_at = parseInt(res.data.data.start_at) * 1000
        }).catch(() => {
          this.$message.error('获取日签出错')
        })
      }
    },
    created() {
      const self = this
      if (self.id) {
        self.getSignIn(self.id)
      } else {
        self.$message.error('获取日签出错')
      }
    }
  }
</script>
<style>
  .daily-sign-in-edit{
    padding-left: 120px;
    width: 1040px;
  }
  .timer{
    width: 100%;
  }
  .radio-label{
    font-size: 14px;
    color: #606266;
    padding-right: 10px;
  }
</style>