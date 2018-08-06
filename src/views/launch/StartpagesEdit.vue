<template>
  <div class="app-container">
    <div class="startpages-edit">
      <el-form ref="startForm" :model="startForm" label-width="80px">
        <el-form-item label="启动图">
          <file-upload v-model="startForm.url"></file-upload>
        </el-form-item>
        <el-form-item label="ClientID">
          <el-select style="width: 100%;" v-model="startForm.client_id" placeholder="请选择ClientID">
            <el-option v-for="item in apps" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动地址">
          <el-col :span="18">
            <el-input v-model="startForm.jump_url" placeholder="请填写活动地址"></el-input>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="4">
            <el-button @click="buildLink" type="primary">生成功能链接</el-button>
          </el-col>
        </el-form-item>
        <!--<el-form-item label="分享">-->
          <!--<el-switch v-model="startForm.share"></el-switch>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="分享链接" v-if="startForm.share">-->
          <!--<el-input v-model="startForm.share_url" placeholder="请填写分享链接"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="分享标题" v-if="startForm.share">-->
          <!--<el-input v-model="startForm.share_title" placeholder="请填写分享标题"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="分享详情" v-if="startForm.share">-->
          <!--<el-input v-model="startForm.share_description" placeholder="请填写分享详情"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="缩略图" v-if="startForm.share">-->
          <!--<file-upload v-model="startForm.share_thumb"></file-upload>-->
        <!--</el-form-item>-->
        <el-form-item label="有效时间">
          <el-date-picker
              style="width: 100%;"
              v-model="startForm.effectiveTime"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getEffectiveTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时长(ms)">
          <el-input v-model="startForm.duration" placeholder="请填写显示时长"></el-input>
        </el-form-item>
        <!--<el-form-item label="上架时间">-->
        <!--<el-input v-model="startForm.started_at"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="下架时间">-->
        <!--<el-input v-model="startForm.stoped_at"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="分享地址生成" :visible.sync="shareModelVisible" custom-class="share-model">
        <create-ypw-link @createdLink="getCreatedLink"></create-ypw-link>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/upload/DragImage'
  import CreateYpwLink from '@/components/createYpwLink/index'
  import { parseTime } from '@/filters/index.js'
  export default {
    name: 'startpages-edit',
    data() {
      return {
        shareModelVisible: false,
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
        startForm: {
          _id: 121,
          url: 'https://gameapp.fp.ps.netease.com/file/5b4452585e60273b263be5fbBMHIlO6Z',
          client_id: 1,
          effectiveTime: ['2018-07-19 00:00', '2018-08-23 00:00'],
          started_at: 23232,
          stoped_at: 87979,
          size: 121233,
          duration: 3000,
          jump_url: 'https://ypw.163.com',
          status: 1
        }
      }
    },
    components: {
      'file-upload': FileUpload,
      'create-ypw-link': CreateYpwLink
    },
    methods: {
      buildLink() {
        this.shareModelVisible = true
      },
      getCreatedLink(data) {
        this.startForm.jump_url = data.createdLink
        this.shareModelVisible = data.shareModelVisible
      },
      getEffectiveTime(time) {
        if (!time) return null
        this.startForm.started_at = parseTime(new Date(time[0]).getTime())
        this.startForm.stoped_at = parseTime(new Date(time[1]).getTime())
      },
      onSubmit() {
        console.log('submit!')
        // this.$router.push({ path: '/resource/launch/startpages' })
      },
      onCancel() {
        this.$router.push({ path: '/resource/launch/startpages' })
      }
    }
  }
</script>
<style>
  .startpages-edit{
    padding-left: 120px;
    padding-top: 40px;
    width: 1040px;
  }
  .timer{
    width: 100%;
  }
  .radio-label{
    color: #606266;
    padding-right: 10px;
  }
</style>