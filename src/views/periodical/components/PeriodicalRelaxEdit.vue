<template>
  <el-form :model="relax" :rules="rules" ref="dataForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="介绍文案" prop="rel_intro" >
      <el-input v-model="relax.rel_intro"></el-input>
    </el-form-item>
    <el-form-item label="背景色" prop="rel_tone" >
      <el-color-picker v-model="relax.rel_tone"></el-color-picker>
      <span class="color-text">{{relax.rel_tone}}</span>
    </el-form-item>
    <el-form-item v-if="relax.rel_type === 0" label="评论ID" prop="comment_id" style="width:400px">
      <PeriodicalAutoComplete
        type="comment"
        placeholder="请输入评论ID"
        @selectItem="selectComment"
      ></PeriodicalAutoComplete>
    </el-form-item>
    <el-form-item v-if="relax.rel_type === 1" label="帖子ID" prop="post_id" style="width:400px">
      <PeriodicalAutoComplete
        type="post"
        placeholder="请输入帖子ID"
        @selectItem="selectPost"
      ></PeriodicalAutoComplete>
    </el-form-item>
    <template v-if="relax.rel_type === 0 && relax.rel_fun_remark">
      <el-card v-for="(fun, index) in relax.rel_fun_remark" :key="'fun_remark' + index" class="box-card mb-20" shadow="never" style="margin-left:100px;padding-top:5px;">
        <div class="card-h">
          <el-button type="danger" @click="removeComment(index)" icon="el-icon-delete" title="删除"></el-button>
        </div>
        <el-row class="mb-20">
          <el-col :span="24" :offset="2" style="font-size:28px;margin-bottom:10px">
            <span>游戏ID：</span><a :href="_toGame(fun.game_id)" target="_blank">{{fun.game_id}}</a>
          </el-col>
          <el-col :span="24" :offset="2" style="color:#999;">
            <img class="avatar" :src="fun.avatar" />{{fun.author}}
          </el-col>
        </el-row>
        <el-form-item label="评论" prop="remark">
          <el-input type="textarea" v-model="fun.remark" rows="4"></el-input>
        </el-form-item>
        <el-form-item label="banner" prop="banner">
          <UploadBoxImage v-model="fun.banner"></UploadBoxImage>
        </el-form-item>
        <el-form-item label="音频" prop="audio"  class="mb-0">
          <FileUpload v-model="fun.audio" fileType="audio"></FileUpload>
        </el-form-item>
      </el-card>
    </template>
    <template v-if="relax.rel_type === 1 && relax.rel_amway">
      <el-card v-for="(amway, index) in relax.rel_amway" :key="'rel_amway' + index" class="box-card mb-20" shadow="never" style="margin-left:100px;padding-top:5px;">
        <div class="card-h">
          <el-button type="danger" @click="removePost(index)" icon="el-icon-delete" title="删除"></el-button>
        </div>
        <el-row class="mb-20">
          <el-col :span="24" :offset="2" style="font-size:28px;margin-bottom:10px">
            <a :href="_toPost(amway.pid)" target="_blank">{{amway.title}}</a>
          </el-col>
          <el-col :span="24" :offset="2" style="color:#999;">
            <img class="avatar" :src="amway.avatar" />{{amway.author}}
          </el-col>
        </el-row>
        <el-form-item label="题图" prop="thematic"  class="mb-0">
          <UploadBoxImage v-model="amway.thematic"></UploadBoxImage>
        </el-form-item>
      </el-card>
    </template>
  </el-form>
</template>
<script>
import { toPost, toGame } from '@/api/link'
import UploadBoxImage from '@/components/upload/BoxImage'
import FileUpload from '@/components/upload/FileUpload'
import PeriodicalAutoComplete from './PeriodicalAutoComplete'
export default {
  props: {
    relax: {
      type: Object,
      default: () => ({
        row_num: '',
        rel_intro: '',
        rel_tone: '',
        rel_fun_remark: [],
        rel_amway: [],
        rel_type: 0
      })
    }
  },
  components: {
    UploadBoxImage,
    FileUpload,
    PeriodicalAutoComplete
  },
  data() {
    return {
      rules: {
      }
    }
  },
  methods: {
    selectComment(item) {
      const fun = {
        cid: item.id,
        game_id: item.gid,
        author: item.user.nickname,
        avatar: item.user.avatar,
        remark: item.comment,
        banner: '',
        audio: ''
      }
      this.relax.rel_fun_remark.push(fun)
    },
    removeComment(index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.relax.rel_fun_remark.splice(index, 1)
    },
    selectPost(item) {
      const amway = {
        pid: item.id,
        title: item.title,
        author: item.user.nickname,
        avatar: item.user.avatar,
        thematic: ''
      }
      this.relax.rel_amway.push(amway)
    },
    removePost(index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.relax.rel_amway.splice(index, 1)
    },
    _toGame(id) {
      return toGame(id)
    },
    _toPost(id) {
      return toPost(id)
    },
    checkForm() {
      let result = false
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          result = true
        }
      })
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card{
  position: relative;
  .card-h{
    position: absolute;
    right:0;
    top:0;
    .el-button{
      padding:5px;
    }
  }
}
.color-text{
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
  color:#999;
}
.avatar{
  display: inline-block;
  width:24px;
  height:24px;
  border-radius:50%;
  vertical-align: middle;
  margin-right: 5px;
  position: relative;
  top:-2px;
}
a:hover{
  color:#409EFF;
}
</style>
