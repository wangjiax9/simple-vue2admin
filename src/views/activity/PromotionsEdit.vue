<template>
  <div class="app-container">
    <div class="promotions-edit">
      <el-form ref="activityForm" :model="activityForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="activityForm.title" placeholder="请填写标题"></el-input>
        </el-form-item>
        <el-form-item label="内部编码">
          <el-input v-model="activityForm.icode" placeholder="请填写内部编码"></el-input>
        </el-form-item>
        <el-form-item label="Banner">
          <file-upload v-model="activityForm.banner.url"></file-upload>
        </el-form-item>
        <el-form-item label="ClientID">
          <el-select style="width: 100%;" v-model="activityForm.client_id" placeholder="请选择ClientID">
            <el-option v-for="item in apps" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动位置">
          <el-select style="width: 100%;" v-model="activityForm.position" placeholder="请选择活动位置">
            <el-option v-for="item in pos" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select style="width: 100%;" v-model="activityForm.promotion_type" placeholder="请选择活动类型">
            <el-option v-for="item in activityType" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动地址">
          <el-col :span="18">
            <el-input v-model="activityForm.url" placeholder="请填写活动地址"></el-input>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="4">
            <el-button @click="buildLink" type="primary">生成功能链接</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="动态参数">
          <el-col :span="10">
            <label class="radio-label">参数名: </label>
            <el-input style="width: 200px;" v-model="activityForm.param.key" placeholder="参数名"></el-input>
          </el-col>
          <el-col :span="10">
            <label class="radio-label">参数来源: </label>
            <el-select style="width: 200px;" v-model="activityForm.param" placeholder="参数来源">
              <el-option v-for="item in activityParams" :key="item.value" :label="item.name" :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <label class="radio-label">带入参数: </label>
            <el-switch v-model="activityForm.delivery" @change="addParam"></el-switch>
          </el-col>
        </el-form-item>
        <el-form-item label="Rank">
          <el-input v-model="activityForm.rank" placeholder="请填写Rank"></el-input>
        </el-form-item>
        <el-form-item label="上线">
          <el-switch v-model="activityForm.published"></el-switch>
        </el-form-item>
        <el-form-item label="弹幕">
          <el-col :span="4">
            <el-switch v-model="activityForm.barrage"></el-switch>
          </el-col>
          <el-col :span="10">
            <label class="radio-label">弹幕来源: </label>
            <el-select style="width: 200px;" :disabled="!activityForm.barrage" v-model="activityForm.barrageFrom" placeholder="弹幕来源" @change="getBarrageFrom">
              <el-option v-for="item in barrages" :key="item.id" :label="item.from" :value="item.from">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <label class="radio-label">弹幕池id: </label>
            <el-input :disabled="!activityForm.barrage" style="width: 200px;" v-model="activityForm.barrageId" placeholder="弹幕池"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分享">
          <el-switch v-model="activityForm.share"></el-switch>
        </el-form-item>
        <el-form-item label="分享链接" v-if="activityForm.share">
          <el-input v-model="activityForm.share_url" placeholder="请填写分享链接"></el-input>
        </el-form-item>
        <el-form-item label="分享标题" v-if="activityForm.share">
          <el-input v-model="activityForm.share_title" placeholder="请填写分享标题"></el-input>
        </el-form-item>
        <el-form-item label="分享详情" v-if="activityForm.share">
          <el-input v-model="activityForm.share_description" placeholder="请填写分享详情"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" v-if="activityForm.share">
          <file-upload v-model="activityForm.share_thumb"></file-upload>
        </el-form-item>
        <el-form-item label="广告类型">
          <el-select style="width: 100%;" v-model="activityForm.ad_type" placeholder="请选择广告类型">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="冷却(秒)">
          <el-input v-model="activityForm.cooldown" placeholder="请填写冷却时间"></el-input>
        </el-form-item>
        <el-form-item label="关闭提示">
          <el-input v-model="activityForm.close_desc" placeholder="请填写关闭提示"></el-input>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker
              style="width: 100%;"
              v-model="activityForm.effectiveTime"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getEffectiveTime">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="上架时间">-->
          <!--<el-input v-model="activityForm.startDate"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="下架时间">-->
          <!--<el-input v-model="activityForm.endDate"></el-input>-->
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
  //  import { fetchActivity, postActivity } from '@/api/activity'
  export default {
    name: 'promotions-edit',
    data() {
      return {
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
        activityType: [
          {
            name: '商品',
            id: 1
          }, {
            name: '页面',
            id: 2
          }, {
            name: '应用内页面',
            id: 3
          }
        ],
        activityParams: [
          {
            name: 'uid',
            key: 'uid',
            value: 123
          }, {
            name: '荒野角色role_id',
            key: 'role_id',
            value: 122
          }, {
            name: '荒野角色sid',
            key: 'sid',
            value: 120
          }
        ],
        shareModelVisible: false,
        barrages: [
          {
            from: '活动',
            id: 1
          }, {
            from: '帖子',
            id: 2
          }, {
            from: '游戏',
            id: 3
          }, {
            from: '专题',
            id: 4
          }
        ],
        activityForm: {
          title: '',
          icode: '',
          client_id: '',
          position: '',
          promotion_type: '',
          param: {
            name: '',
            key: '',
            value: 0
          },
          banner: {
            url: ''
          },
          url: '',
          share: true,
          share_url: '',
          share_title: '',
          share_description: '',
          share_thumb: '',
          ad_type: '',
          cooldown: '',
          close_desc: '',
          effectiveTime: ['2018-07-19 00:00', '2018-08-23 00:00'],
          startDate: '',
          endDate: '',
          barrage: false,
          barrageId: 0,
          barrageFrom: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    components: {
      'file-upload': FileUpload,
      'create-ypw-link': CreateYpwLink
    },
    computed: {
      id() {
        return Number(this.$route.params.id)
      }
    },
    methods: {
      addParam(b) {
        if (b) {
          let newUrl = this.activityForm.url
          const param = this.activityForm.param
          if (newUrl.indexOf(param.key) > 0) return false
          newUrl = newUrl.indexOf('?') > 0 ? `${newUrl}&${param.key}=${param.value}` : `${newUrl}?${param.key}=${param.value}`
          this.activityForm.url = newUrl
        }
      },
      getEffectiveTime(time) {
        if (!time) return null
        this.activityForm.startDate = parseTime(new Date(time[0]).getTime())
        this.activityForm.endDate = parseTime(new Date(time[1]).getTime())
      },
      getBarrageFrom(from) {
        if (!from) return null
        this.activityForm.barrageId = this.barrages.filter((item) => {
          return item.from === from
        })[0].id
      },
      getCreatedLink(data) {
        this.activityForm.url = data.createdLink
        this.shareModelVisible = data.shareModelVisible
      },
      buildLink() {
        this.shareModelVisible = true
      },
      onSubmit() {
//        const self = this
        console.log('submit!')
//        postActivity(self.activityForm).then((res) => {
//          console.log(res)
//          this.$router.push({ path: '/resource/activity/promotions' })
//        })
      },
      onCancel() {
        this.$router.push({ path: '/resource/activity/promotions' })
      }
    },
    created() {
      const self = this
      console.log(self.id)
//      fetchActivity(self.id).then((res) => {
//        console.log(res)
//      })
    }
  }
</script>
<style>
  .promotions-edit{
    padding-left: 120px;
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