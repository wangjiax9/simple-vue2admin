<template>
  <div class="app-container">
    <el-form :model="periodical" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm periodical-form">
      <el-form-item label="首图" prop="head_pic" >
        <Upload v-model="periodical.head_pic"></Upload>
      </el-form-item>
      <el-form-item label="背景色" prop="head_tone" >
        <el-color-picker v-model="periodical.head_tone"></el-color-picker>
        <span class="color-text">{{periodical.head_tone}}</span>
      </el-form-item>
      <el-card class="box-card mb-20">
        <el-row style="margin-bottom:20px">
          <el-col :span="24"><el-tag>测评团介绍</el-tag></el-col>
        </el-row>
        <el-form-item label="测评团介绍" prop="tteam_intro">
          <el-input type="textarea" v-model="periodical.tteam.tteam_intro" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="成员ID" prop="tteam_id" style="width:400px">
          <PeriodicalAutoComplete
            type="user"
            placeholder="请输入用户ID"
            @selectItem="selectTteam"
          ></PeriodicalAutoComplete>
        </el-form-item>
        <el-row class="mb-20" style="margin-left:100px;">
          <PeriodicalTteamMembers :list="periodical.tteam.tteam_members"></PeriodicalTteamMembers>
        </el-row>
        <el-form-item label="按钮文案" prop="tteam_button_intro">
          <el-input v-model="periodical.tteam.tteam_button_intro"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="tteam_button_jump" >
          <el-input v-model="periodical.tteam.tteam_button_jump"></el-input>
        </el-form-item>
        <el-form-item label="按钮色值" prop="tteam_button_tone" >
          <el-color-picker v-model="periodical.tteam.tteam_button_tone"></el-color-picker>
          <span class="color-text">{{periodical.tteam.tteam_button_tone}}</span>
        </el-form-item>
      </el-card>
      <el-card class="box-card mb-20">
        <el-row style="margin-bottom:20px">
          <el-col :span="24"><el-tag>专业推荐</el-tag></el-col>
        </el-row>
        <el-form-item label="主标题图" prop="pro_theme" >
          <Upload v-model="periodical.pro_theme"></Upload>
        </el-form-item>
        <el-row>
          <el-button type="primary" v-waves @click="createPro(0)">
            <svg-icon icon-class="plus"></svg-icon>新增游戏推荐
          </el-button>
          <el-button type="primary" v-waves @click="createPro(1)">
            <svg-icon icon-class="plus"></svg-icon>新增游戏测评/攻略
          </el-button>
        </el-row>
        <el-row>
          <PeriodicalProList :list="periodical.pros" @editPro="editPro"></PeriodicalProList>
        </el-row>
      </el-card>
      <el-card class="box-card mb-20">
        <el-row style="margin-bottom:20px">
          <el-col :span="24"><el-tag>轻松评测</el-tag></el-col>
        </el-row>
        <el-form-item label="主标题图" prop="relax_tests_theme" >
          <Upload v-model="periodical.relax_tests_theme"></Upload>
        </el-form-item>
        <el-row>
          <el-button type="primary" @click="createRelax(0)">
            <svg-icon icon-class="plus"></svg-icon>新增游戏趣评
            </el-button>
          <el-button type="primary" @click="createRelax(1)">
            <svg-icon icon-class="plus"></svg-icon>新增游戏安利
            </el-button>
        </el-row>
        <el-row>
          <PeriodicalRelaxList :list="periodical.relaxs" @editRelax="editRelax"></PeriodicalRelaxList>
        </el-row>
      </el-card>
      <el-card class="box-card mb-20">
        <el-row style="margin-bottom:20px">
          <el-col :span="24"><el-tag>先锋团</el-tag></el-col>
        </el-row>
        <el-form-item label="主标题图" prop="pioneers_theme" >
          <Upload v-model="periodical.pioneers_theme"></Upload>
        </el-form-item>
        <el-card class="box-card mb-20" shadow="never">
          <el-row style="margin-bottom:20px">
            <el-col :span="24"><el-tag type="success">先锋团采访</el-tag></el-col>
          </el-row>
          <el-form-item label="介绍文案" prop="pioneers_interview_intro" >
            <el-input v-model="periodical.pioneers_interview.pioneers_interview_intro"></el-input>
          </el-form-item>
          <el-form-item label="背景色" prop="pioneers_interview_tone" >
            <el-color-picker v-model="periodical.pioneers_interview.pioneers_interview_tone"></el-color-picker>
            <span class="color-text">{{periodical.pioneers_interview.pioneers_interview_tone}}</span>
          </el-form-item>
          <el-form-item label="用户ID" prop="pioneers_interview_uid" >
            <el-input v-model="periodical.pioneers_interview.pioneers_interview_uid"></el-input>
          </el-form-item>
          <el-form-item label="采访图" prop="pioneers_interview_bg" >
            <Upload v-model="periodical.pioneers_interview.pioneers_interview_bg"></Upload>
          </el-form-item>
        </el-card>
        <el-card class="box-card mb-20" shadow="never">
          <el-row style="margin-bottom:20px">
            <el-col :span="24"><el-tag type="success">先锋团日常</el-tag></el-col>
          </el-row>
          <el-form-item label="介绍文案" prop="pioneers_d2d_intro" >
            <el-input v-model="periodical.pioneers_d2d.pioneers_d2d_intro"></el-input>
          </el-form-item>
          <el-form-item label="背景色" prop="pioneers_d2d_tone" >
            <el-color-picker v-model="periodical.pioneers_d2d.pioneers_d2d_tone"></el-color-picker>
            <span class="color-text">{{periodical.pioneers_d2d.pioneers_d2d_tone}}</span>
          </el-form-item>
          <el-form-item label="正文" prop="pioneers_d2d_text" >
            <el-input type="textarea" v-model="periodical.pioneers_d2d.pioneers_d2d_text" rows="6"></el-input>
          </el-form-item>
          <el-form-item label="采访图" prop="pioneers_d2d_ei" >
            <Upload v-model="periodical.pioneers_d2d.pioneers_d2d_ei"></Upload>
          </el-form-item>
        </el-card>
      </el-card>
      <el-card class="box-card mb-20">
        <el-row style="margin-bottom:20px">
          <el-col :span="24"><el-tag>往期回顾</el-tag></el-col>
        </el-row>
        <el-form-item label="背景色" prop="prev_bt_tone" >
          <el-color-picker v-model="periodical.prev_bt.tone"></el-color-picker>
          <span class="color-text">{{periodical.prev_bt.tone}}</span>
        </el-form-item>
        <el-form-item label="背景图" prop="prev_bt_bg" >
          <Upload v-model="periodical.prev_bt.bg"></Upload>
        </el-form-item>
        <el-form-item label="上一期ID" prop="prev_id" >
          <el-input v-model.number="periodical.prev_id">
          </el-input>
        </el-form-item>
      </el-card>
      <el-row class="fixed-bottom">
        <el-col :span="24" style="text-align:center">
          <el-button type="primary" @click="savePeriodical" style="width:400px;">
            <svg-icon icon-class="save"></svg-icon>保存
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="pre-h5">
      <div class="top">
        <el-tag type="success" style="position:absolute;left:0;top:-30px;">期刊预览效果：</el-tag>
        <el-button class="mb-20" type="success" size="mini" @click="refreshIframe" icon="el-icon-refresh">刷新</el-button>
        <div class="mb-20">期刊H5地址：<span class="tip">{{preUrl}}</span></div>
      </div>
      <iframe name="preIframe" :src="preUrl" frameborder="0"></iframe>
    </div>
    <el-dialog :title="dialogProTitle" width="65%" center :visible.sync="dialogProVisible">
      <PeriodicalProEdit :pro="pro" ref="periodicalProEdit"></PeriodicalProEdit>
      <span slot="footer" class="dialog-footer">
        <el-button class="pan-btn primary-btn" type="primary" @click="savePeriodicalPro">保 存</el-button>
        <el-button @click="dialogProVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogRelaxTitle" width="65%" center :visible.sync="dialogRelaxVisible">
      <PeriodicalRelaxEdit :relax="relax" ref="periodicalRelaxEdit"></PeriodicalRelaxEdit>
      <span slot="footer" class="dialog-footer">
        <el-button class="pan-btn primary-btn" type="primary" @click="savePeriodicalRelax">保 存</el-button>
        <el-button @click="dialogRelaxVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchPeriodical, updatePeriodical } from '@/api/periodical'
import { toPeriodical } from '@/api/link'
import waves from '@/directive/waves/index.js' // 水波纹指令
import Upload from '@/components/upload/DragImage'
import { convertHexDec } from '@/utils/converter'
import PeriodicalAutoComplete from './components/PeriodicalAutoComplete'
import PeriodicalTteamMembers from './components/PeriodicalTteamMembers'
import PeriodicalProList from './components/PeriodicalProList'
import PeriodicalProEdit from './components/PeriodicalProEdit'
import PeriodicalRelaxList from './components/PeriodicalRelaxList'
import PeriodicalRelaxEdit from './components/PeriodicalRelaxEdit'
export default {
  components: {
    Upload,
    PeriodicalAutoComplete,
    PeriodicalTteamMembers,
    PeriodicalProList,
    PeriodicalProEdit,
    PeriodicalRelaxList,
    PeriodicalRelaxEdit
  },
  directives: {
    waves
  },
  data() {
    return {
      preUrl: '', // 期刊预览地址
      dialogProVisible: false,  // 专业推荐弹出框
      dialogProTitle: '',   // 弹出框标题
      dialogProAction: '',  // 0: 新增， 1：编辑
      pro: {},
      dialogRelaxVisible: false,  // 轻松测评弹出框
      dialogRelaxTitle: '',   // 弹出框标题
      dialogRelaxAction: '',  // 0: 新增， 1：编辑
      relax: {},
      // 先锋期刊
      periodical: {
        id: '',
        head_pic: '',
        head_tone: '',
        // 测评团
        tteam: {
          tteam_intro: '',
          tteam_members: [],
          tteam_button_intro: '',
          tteam_button_jump: '',
          tteam_button_tone: ''
        },
        // 专业推荐
        pro_theme: '',
        pros: [],
        // 轻松测评
        relax_tests_theme: '',
        relaxs: [],
        // 先锋团
        pioneers_theme: '',
        // 先锋团采访
        pioneers_interview: {
          pioneers_interview_intro: '',
          pioneers_interview_tone: '',
          pioneers_interview_uid: '',
          pioneers_interview_bg: ''
        },
        // 先锋团日常
        pioneers_d2d: {
          pioneers_d2d_intro: '',
          pioneers_d2d_tone: '',
          pioneers_d2d_text: '',
          pioneers_d2d_ei: ''
        },
        // 往期回顾背景色
        prev_bt: {
          tone: '', // 色值
          bg: ''  // 背景图
        },
        // 上一期期刊id
        prev_id: '',
        created_at: '',
        updated_at: ''
      },
      rules: {
        head_tone: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  created() {
    const params = this.$route.params
    if (params && params.id) {
      this.periodical.id = params.id
      this.getPeriodical(params.id)
    } else {
      this.$router.push({
        path: '/resource/periodical/periodicals'
      })
    }
  },
  methods: {
    getPeriodical(pid) {
      fetchPeriodical(pid).then(response => {
        const data = response.data.data
        this.periodical = Object.assign(this.periodical, this.pretreat(data))
        this.preUrl = toPeriodical(this.periodical.id)
      })
    },
    // 预处理
    pretreat(data) {
      data.head_tone = convertHexDec.d2h(data.head_tone)
      data.tteam.tteam_button_tone = convertHexDec.d2h(data.tteam.tteam_button_tone)
      if (!data.tteam.tteam_members) {
        data.tteam.tteam_members = []
      }
      data.pros.map(v => {
        v.pro_tone = convertHexDec.d2h(v.pro_tone)
      })
      data.relaxs.map(v => {
        v.rel_tone = convertHexDec.d2h(v.rel_tone)
      })
      data.pioneers_interview.pioneers_interview_tone = convertHexDec.d2h(data.pioneers_interview.pioneers_interview_tone)
      data.pioneers_d2d.pioneers_d2d_tone = convertHexDec.d2h(data.pioneers_d2d.pioneers_d2d_tone)
      data.prev_bt.tone = convertHexDec.d2h(data.prev_bt.tone)
      return data
    },
    // 刷新预览iframe，需要同源
    refreshIframe() {
      top.preIframe.contentWindow.location.reload()
    },
    selectTteam(item) {
      if (this.periodical.tteam.tteam_members.length >= 4) {
        this.$notify.error({
          title: '最多只能添加四个成员'
        })
        return false
      }
      const member = {
        id: item.id,
        avatar: item.avatar,
        nickname: item.nickname
      }
      this.periodical.tteam.tteam_members.push(member)
    },
    // 新增专业推荐弹出框
    createPro(pro_type) {
      if (pro_type === 0) {
        this.dialogProTitle = '游戏推荐'
      } else {
        this.dialogProTitle = '游戏测评/攻略'
      }
      this.dialogProVisible = true
      this.dialogProAction = 0
      this.pro = {
        row_num: this.periodical.pros.length + 1,
        pro_intro: '',
        pro_tone: '#ffffff',
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
        pro_type: pro_type,
        pro_layout: '0'
      }
    },
    // 编辑专业推荐弹出框
    editPro(pro) {
      if (pro.pro_type === 0) {
        this.dialogProTitle = '游戏推荐'
      } else {
        this.dialogProTitle = '游戏测评/攻略'
      }
      this.dialogProVisible = true
      this.dialogProAction = 1
      this.pro = pro
    },
    savePeriodicalPro() {
      const checkResult = this.$refs.periodicalProEdit.checkForm()
      if (checkResult) {
        if (this.dialogProAction === 0) {
          this.periodical.pros.push(this.pro)
        } else {
          this.periodical.pros.splice(this.pro.row_num, 1, this.pro)
        }
        this.dialogProVisible = false
      } else {
        console.log('valid fail')
      }
    },
    // 新增轻松测评弹出框
    createRelax(rel_type) {
      if (rel_type === 0) {
        this.dialogRelaxTitle = '游戏趣评'
      } else {
        this.dialogRelaxTitle = '游戏安利'
      }
      this.dialogRelaxVisible = true
      this.dialogRelaxAction = 0
      this.relax = {
        row_num: this.periodical.relaxs.length + 1,
        rel_intro: '',
        rel_tone: '#ffffff',
        rel_fun_remark: [],
        rel_amway: [],
        rel_type: rel_type
      }
    },
    // 编辑专业推荐弹出框
    editRelax(relax) {
      if (relax.rel_type === 0) {
        this.dialogRelaxTitle = '游戏趣评'
      } else {
        this.dialogRelaxTitle = '游戏安利'
      }
      this.dialogRelaxVisible = true
      this.dialogRelaxAction = 1
      this.relax = relax
    },
    savePeriodicalRelax() {
      const checkResult = this.$refs.periodicalRelaxEdit.checkForm()
      if (checkResult) {
        if (this.dialogRelaxAction === 0) {
          this.periodical.relaxs.push(this.relax)
        } else {
          this.periodical.relaxs.splice(this.relax.row_num, 1, this.relax)
        }
        this.dialogRelaxVisible = false
      } else {
        console.log('valid fail')
      }
    },
    // 保存期刊
    savePeriodical() {
      let periodicalData = JSON.parse(JSON.stringify(this.periodical))
      periodicalData = this.savePretreat(periodicalData)
      console.dir(periodicalData)
      updatePeriodical(periodicalData).then(response => {
        this.$message({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        console.log(error)
        this.$message({
          title: '失败',
          message: '保存失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    // 保存预处理
    savePretreat(data) {
      data.head_tone = convertHexDec.h2d(data.head_tone)
      data.tteam.tteam_button_tone = convertHexDec.h2d(data.tteam.tteam_button_tone)
      data.pros.map(v => {
        v.pro_tone = convertHexDec.h2d(v.pro_tone)
      })
      data.relaxs.map(v => {
        v.rel_tone = convertHexDec.h2d(v.rel_tone)
      })
      data.pioneers_interview.pioneers_interview_tone = convertHexDec.h2d(data.pioneers_interview.pioneers_interview_tone)
      data.pioneers_d2d.pioneers_d2d_tone = convertHexDec.h2d(data.pioneers_d2d.pioneers_d2d_tone)
      data.prev_bt.tone = convertHexDec.h2d(data.prev_bt.tone)
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
.periodical-form{
  width:860px;
  display: inline-block;
}
.color-text{
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
  color:#999;
}
.pre-h5{
  position:fixed;
  right:0;
  top:60px;
  z-index:990;
  width:456px;
  padding:20px 0 20px 20px;
  background: #ebebeb;
  .tip{
    font-size: 14px;
  }
  iframe{
    display: block;
    width:416px;
    height:736px;
    box-shadow: 0 0 5px #000;
    background:#000;
  }
}
.fixed-bottom{
  width:100%;
  height:50px;
  position: fixed;
  left:0;
  bottom:0;
  z-index:999;
  background:rgba(0,0,0,.6);
  .el-button{
    margin-top:5px;
  }
}
</style>



