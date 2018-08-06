<template>
  <el-form :model="pro" :rules="rules" ref="dataForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="介绍文案" prop="pro_intro" >
      <el-input v-model="pro.pro_intro"></el-input>
    </el-form-item>
    <el-form-item label="背景色" prop="pro_tone" >
      <el-color-picker v-model="pro.pro_tone"></el-color-picker>
      <span class="color-text">{{pro.pro_tone}}</span>
    </el-form-item>
    <el-form-item label="游戏ID" prop="" style="width:400px">
      <PeriodicalAutoComplete
        type="game"
        placeholder="请输入游戏ID"
        @selectItem="selectGame"
      ></PeriodicalAutoComplete>
    </el-form-item>
    <el-card v-show="pro.pro_game" class="box-card mb-20" shadow="never" style="margin-left:100px">
      <el-form-item label="游戏ID" prop="pro_gid" style="margin-top:20px">
        <el-input disabled v-model="pro.pro_game.gid"></el-input>
      </el-form-item>
      <el-form-item label="游戏名" prop="name_cn" style="margin-top:20px">
        <el-input disabled v-model="pro.pro_game.name_cn"></el-input>
      </el-form-item>
      <el-form-item label="游戏背景图" prop="bk_img_url">
        <UploadBoxImage v-model="pro.pro_game.bk_img_url"></UploadBoxImage>
      </el-form-item>
      <el-form-item label="游戏标签" prop="pro_game_tags">
        <el-tag :key="tag" v-for="tag in dynamicTags" closable
          :disable-transitions="false" @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else v-show="dynamicTags.length < 3" class="button-new-tag" size="small" @click="showInput">+ 新增标签</el-button>

      </el-form-item>
      
    </el-card>
    <el-form-item label="分值" prop="pro_rec_score" >
      <el-input v-model="pro.pro_rec_score"></el-input>
    </el-form-item>
    <el-form-item v-if="pro.pro_type === 1" label="布局类型" prop="pro_layout" >
      <el-input v-model.number="pro.pro_layout" style="width:200px"></el-input>
      <span>0:帖子在右边，文案为白色 </span>
      <span>1:帖子在左边，文案为黑色 </span>
    </el-form-item>
    <el-form-item v-if="pro.pro_type === 0" label="推荐用户ID" prop="pro_rec_users" style="width:400px">
      <PeriodicalAutoComplete
        type="user"
        placeholder="请输入用户ID"
        @selectItem="selectUser"
      ></PeriodicalAutoComplete>
    </el-form-item>
    <template v-if="pro.pro_type === 0 && pro.pro_rec_users">
      <el-card v-for="(rec_user, index) in pro.pro_rec_users" :key="rec_user.uid + index" class="box-card mb-20" shadow="never" style="margin-left:100px;padding-top:20px;">
        <div class="card-h">
          <el-button type="danger" @click="removeRecUser(index)" icon="el-icon-delete" title="删除"></el-button>
        </div>
        <el-row>
          <el-col :span="8" class="text text-gray"><img class="avatar" :src="rec_user.avatar" />{{rec_user.nickname}}</el-col>
          <el-col :span="4" class="text text-stress text-center">推荐语</el-col>
          <el-col :span="12">
            <el-input v-model="rec_user.rec_words"></el-input>
          </el-col>
        </el-row>
      </el-card>
    </template>
    <el-form-item v-if="pro.pro_type === 1" label="帖子ID" prop="post_id" style="width:400px">
      <PeriodicalAutoComplete
        type="post"
        placeholder="请输入帖子ID"
        @selectItem="selectPost"
      ></PeriodicalAutoComplete>
    </el-form-item>
    <template v-if="pro.pro_type === 1 && pro.pro_test_posts">
      <el-card v-for="(test_post, index) in pro.pro_test_posts" :key="test_post.pid + index" class="box-card mb-20" shadow="never" style="margin-left:100px;padding-top:5px;">
        <div class="card-h">
          <el-button type="danger" @click="removeRecPost(index)" icon="el-icon-delete" title="删除"></el-button>
        </div>
        <el-row class="mb-20">
          <el-col :span="24" :offset="2" style="font-size:28px;margin-bottom:10px">
            <a :href="_toPost(test_post.pid)" target="_blank">{{test_post.title}}</a>
          </el-col>
          <el-col :span="24" :offset="2" style="color:#999;">
            <img class="avatar" :src="test_post.avatar" />{{test_post.author}}
          </el-col>
        </el-row>
        <el-form-item label="摘要" :prop="'pro_test_posts.'+index+'.abstract'"  class="mb-0"
          :rules="{ max: 30, message: '不能超出30个字符', trigger: 'change' }"
        >
          <el-input type="textarea" v-model="test_post.abstract"></el-input>
        </el-form-item>
      </el-card>
    </template>
  </el-form>
</template>
<script>
import { toPost } from '@/api/link'
import UploadBoxImage from '@/components/upload/BoxImage'
import PeriodicalAutoComplete from './PeriodicalAutoComplete'
export default {
  props: {
    pro: {
      type: Object,
      default: () => ({
        pro_id: '',
        pro_intro: '',
        pro_tone: '',
        pro_game: {
          gid: '',
          name_cn: '',
          icon: '',
          bk_img_url: '',
          tags: []
        },
        pro_rec_score: '',
        pro_rec_users: [],
        pro_test_posts: [],
        pro_type: 0,
        pro_layout: 0
      })
    }
  },
  components: {
    UploadBoxImage,
    PeriodicalAutoComplete
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      rules: {
        pro_rec_score: [{ validator: (rule, value, callback) => {
          if (isNaN(value)) {
            callback(new Error('请输入数值'))
          } else if (value < 0 || value > 10) {
            callback(new Error('数值应该在0.0~10.0之间'))
          } else {
            callback()
          }
        }, trigger: 'change' }]
      }
    }
  },
  methods: {
    selectGame(item) {
      this.dynamicTags = item.tags
      if (this.dynamicTags.length > 3) {
        this.dynamicTags.splice(3, this.dynamicTags.length - 1)
      }
      this.pro.pro_game = {
        gid: item.id,
        name_cn: item.name_cn,
        icon: item.icon.url,
        bk_img_url: item.icon.url,
        tags: this.dynamicTags
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
        this.pro.pro_game.tags = this.dynamicTags
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    selectUser(item) {
      const rec_user = {
        uid: item.id,
        avatar: item.avatar,
        nickname: item.nickname,
        rec_words: ''
      }
      this.pro.pro_rec_users.push(rec_user)
    },
    removeRecUser(index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.pro.pro_rec_users.splice(index, 1)
    },
    selectPost(item) {
      const rec_post = {
        pid: item.id,
        title: item.title,
        author: item.user.nickname,
        avatar: item.user.avatar,
        abstract: ''
      }
      this.pro.pro_test_posts.push(rec_post)
    },
    removeRecPost(index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.pro.pro_test_posts.splice(index, 1)
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
.input-new-tag{
  width:140px;
}
a:hover{
  color:#409EFF;
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

</style>
