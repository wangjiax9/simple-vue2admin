<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-plus">新增身份</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='一级类别' width="95">
        <template slot-scope="scope">
          <router-link class="link-type" :to="{ path: '/users/identity/identity-user', query: { pid: scope.row.tid, tid: scope.row.pid }}" v-if="scope.row.pid === 0">{{scope.row.name}}</router-link>
          <router-link class="link-type" :to="{ path: '/users/identity/identity-user', query: { pid: scope.row.pid, tid: scope.row.tid }}"  v-else>{{scope.row.pname}}</router-link>
          <!--<a class="link-type" target="_blank" :href="'/admin/identity-user?pid=0&tid='+ scope.row.pid" v-if="scope.row.pid === 0">{{scope.row.name}}</a>-->
          <!--<a class="link-type" target="_blank" :href="'/admin/identity-user?pid='+ scope.row.pid +'&tid='+ scope.row.tid" v-else>{{scope.row.pname}}</a>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label='二级类别' width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pid === 0">空</span>
          <router-link class="link-type" :to="{ path: '/users/identity/identity-user', query: { pid: scope.row.pid, tid: scope.row.tid }}"  v-else>{{scope.row.name}}</router-link>
          <!--<a class="link-type" target="_blank" :href="'/admin/identity-user?pid='+ scope.row.pid +'&tid=' +scope.row.tid" v-else>{{scope.row.name}}</a>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="Icon" width="95">
        <template slot-scope="scope">
          <img :src="scope.row.roun_icon" width="60"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label='默认说明' width="120">
        <template slot-scope="scope">
          {{scope.row.desc}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='简介'>
        <template slot-scope="scope">
          <div v-html="scope.row.intro" v-if="scope.row.pid === 0"></div>
          <div v-else style="text-align: center;">空</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label='报名链接' width="200">
        <template slot-scope="scope">
          <a class="link-type" target="_blank" :href="scope.row.apply_url" v-if="scope.row.pid === 0">{{scope.row.apply_url}}</a>
          <span v-else>空</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="背景图" width="95">
        <template slot-scope="scope">
          <img :src="scope.row.background" height="60" v-if="scope.row.pid === 0"/>
          <span v-else>空</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作">
        <template slot-scope="scope">
          <el-button class="ypw-btn" type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button class="ypw-btn" type="danger" size="mini" icon="el-icon-delete"  @click="handleRemove(scope.row)">删除</el-button>
          <el-button class="ypw-btn" type="primary" size="mini" icon="el-icon-plus" @click="addSubIdentity(scope.row)" v-if="scope.row.pid === 0">添加二级类别</el-button>
          <el-button class="ypw-btn" type="success" size="mini" icon="el-icon-setting" @click="handleOpen(scope.row)" v-if="scope.row.pid === 0 && scope.row.apply_status">关闭报名</el-button>
          <el-button class="ypw-btn" type="warning" size="mini" icon="el-icon-setting" @click="handleOpen(scope.row)" v-if="scope.row.pid === 0 && !scope.row.apply_status">开放报名</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.updated_at | parseTime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="meta.total">
      </el-pagination>
    </div>

    <el-dialog title="一级类别编辑窗口" :visible.sync="supVisible" custom-class="sup-model" @open="supModelOpen">
      <el-form :model="supForm" :rules="supRules" ref="supForm" label-position="right" :label-width="formLabelWidth" size="medium">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="supForm.name" placeholder="一级类别名称（必填）"></el-input>
        </el-form-item>
        <el-form-item label="默认说明" prop="desc">
          <el-input v-model="supForm.desc" placeholder="默认说明（必填）"></el-input>
        </el-form-item>
        <el-form-item label="类别简介" prop="intro">
          <!--<el-input type="textarea" v-model="supForm.intro"></el-input>-->
          <div class="ypw-editor" id="editor" style="width:100%;height:240px;"></div>
        </el-form-item>
        <el-form-item label="报名文案" prop="apply_explain">
          <el-input type="textarea" v-model="supForm.apply_explain" placeholder="报名文案（选填）"></el-input>
        </el-form-item>
        <el-form-item label="报名链接" prop="apply_url">
          <el-input type="textarea" v-model="supForm.apply_url" placeholder="报名链接（选填）"></el-input>
        </el-form-item>
        <el-form-item label="Icon图(200*200)" prop="roun_icon">
          <file-upload v-model="supForm.roun_icon"></file-upload>
        </el-form-item>
        <el-form-item label="背景图(750*860)" prop="background">
          <file-upload v-model="supForm.background"></file-upload>
        </el-form-item>
        <el-form-item label="介绍页地址" prop="declare">
          <el-input v-model="supForm.declare"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="supVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSup('supForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="二级类别编辑窗口" :visible.sync="subVisible" custom-class="sub-model">
      <el-form :model="subForm" :rules="subRules" ref="subForm"  label-position="right" :label-width="formLabelWidth">
        <el-form-item label="一级类别名" prop="pname" disabled>
          <el-input v-model="subForm.pname" placeholder="一级类别名称（必填）"></el-input>
        </el-form-item>
        <el-form-item label="二级类别名" prop="name">
          <el-input v-model="subForm.name" placeholder="二级类别名称（必填）"></el-input>
        </el-form-item>
        <el-form-item label="默认说明" prop="desc">
          <el-input v-model="subForm.desc" placeholder="默认说明（必填）"></el-input>
        </el-form-item>
        <el-form-item label="圆图标(66*66)" prop="roun_icon">
          <file-upload v-model="subForm.roun_icon"></file-upload>
        </el-form-item>
        <el-form-item label="长图标(38*24)" prop="rect_icon">
          <file-upload v-model="subForm.rect_icon"></file-upload>
        </el-form-item>
        <el-form-item label="日间色值" prop="tone">
          <el-color-picker v-model="subForm.tone.day_tone"></el-color-picker>
          <span class="color-text">{{subForm.tone.day_tone}}</span>
        </el-form-item>
        <el-form-item label="夜间色值" prop="tone">
          <el-color-picker v-model="subForm.tone.night_tone"></el-color-picker>
          <span class="color-text">{{subForm.tone.night_tone}}</span>
        </el-form-item>
        <el-form-item label="介绍页地址" prop="declare">
          <el-input v-model="subForm.declare"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="subVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSub('subForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="报名信息填写窗口" :visible.sync="openVisible" custom-class="open-model">
      <el-form :model="supForm" :rules="supRules" ref="openForm"  label-position="right" :label-width="formLabelWidth">
        <el-form-item label="报名文案" prop="apply_explain">
          <el-input type="textarea" v-model="supForm.apply_explain" placeholder="报名文案（选填）"></el-input>
        </el-form-item>
        <el-form-item label="报名链接" prop="apply_url">
          <el-input type="textarea" v-model="supForm.apply_url" placeholder="报名链接（选填）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSup('openForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  require('@/assets/ypw-editor/ypw-editor.css')
  require('@/assets/ypw-editor/ypw-editor.js')
  import { fetchIdentityList, postIdentity, deleteIdentity } from '@/api/identity'
  import { toIdentity } from '@/api/link'
  import FileUpload from '@/components/upload/DragImage'
  export default {
    name: 'identity-type',
    data() {
      return {
        declare: '',
        listLoading: false,
        list: [],
        meta: {},
        listQuery: {
          page: 1,
          limit: 20,
          offset: 0
        },
        ypwEditor: null,
        formLabelWidth: '100px',
        supVisible: false,
        supForm: {
          roun_icon: '',
          background: ''
        },
        subVisible: false,
        subForm: {
          roun_icon: '',
          rect_icon: '',
          tone: {
            day_tone: '',
            night_tone: ''
          }
        },
        supRules: {
          name: [
            { required: true, message: '请输入一级类别名', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请填写默认说明', trigger: 'blur' }
          ],
          intro: [
            { required: true, message: '请填写类别简介', trigger: 'blur' }
          ],
          apply_explain: [
            { required: false, message: '请填写报名文案', trigger: 'blur' }
          ],
          apply_url: [
            { required: false, message: '请填写报名链接', trigger: 'blur' }
          ],
          roun_icon: [
            { required: true, message: '请上传类别图标', trigger: 'change' }
          ],
          background: [
            { required: true, message: '请上传类别背景', trigger: 'change' }
          ],
          declare: [
            { required: true, message: '请谨慎修改类别介绍页地址', trigger: 'blur' }
          ]
        },
        subRules: {
          pname: [
            { required: true, message: '请输入一级类别名', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入一级类别名', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请填写默认说明', trigger: 'blur' }
          ],
          intro: [
            { required: true, message: '请填写类别简介', trigger: 'blur' }
          ],
          roun_icon: [
            { required: true, message: '请上传类别圆形️图标', trigger: 'change' }
          ],
          rect_icon: [
            { required: true, message: '请上传类别方形图标', trigger: 'change' }
          ],
          declare: [
            { required: true, message: '请谨慎修改类别介绍页地址', trigger: 'blur' }
          ],
          tone: [
            { validator: (rule, value, callback) => {
              if (value.day_tone === '' || value.night_tone === '') {
                callback(new Error('注：请填写格式为十六进制颜色码#+6位0-9A-F，如#FF0000'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
          ]
        },
        openVisible: false
      }
    },
    components: {
      'file-upload': FileUpload
    },
    created() {
      this.getIdentityList()
      this.declare = toIdentity()
    },
    methods: {
      numToColor(colorNum) {
        if (!colorNum) return colorNum
        return '#' + (parseInt(colorNum)).toString(16).slice(2)
      },
      colorToNum(color) {
        if (!color) return color
        return parseInt('FF' + color.slice(1), 16)
      },
      // 获取身份列表
      getIdentityList() {
        this.listLoading = true
        fetchIdentityList(Object.assign(this.listQuery, { pid: -1 })).then(response => {
          this.list = response.data.data
          this.meta = response.data.meta
          this.listLoading = false
        })
      },
      // 改变分页大小
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getIdentityList()
      },
      // 翻页
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
        this.getIdentityList()
      },
      // 添加身份类别
      handleAdd() {
        this.supForm = {
          roun_icon: '',
          background: '',
          declare: this.declare
        }
        this.supVisible = true
      },
      // 打开一级身份类别model弹窗
      supModelOpen() {
        if (!this.ypwEditor) {
          // 初始化编辑器
          setTimeout(() => {
            this.ypwEditor = new window.YpwEditor({
              menus: [],
              placeholder: '简介内容～'
            })
            this.ypwEditor.init()
            // 初始化简介
            this.ypwEditor.setHTML(this.supForm.intro)
            this.ypwEditor.updateContentPlaceholder()
            this.ypwEditor.$textElem.blur(() => {
              this.supForm.intro = this.ypwEditor.getContent().content
            })
          }, 500)
        } else {
          this.ypwEditor.setHTML(this.supForm.intro)
          this.ypwEditor.updateContentPlaceholder()
        }
      },
      // 编辑身份类别
      handleEdit(identity) {
        const self = this
        if (identity.pid) {
          this.subForm = Object.assign({}, identity, {
            tone: {
              day_tone: self.numToColor(identity.tone.day_tone),
              night_tone: self.numToColor(identity.tone.night_tone)
            }
          })
          this.subVisible = true
        } else {
          this.supForm = Object.assign({}, identity)
          this.supVisible = true
        }
      },
      handleOpen(identity) {
        this.supForm = Object.assign({}, identity)
        this.openVisible = true
      },
      // 移除身份类别
      handleRemove(identity) {
        const self = this
        if (identity.pid === 0) {
          self.$confirm(`${identity.name}为一级身份，删除后其下所有二级身份会同时被删除。且拥有该身份用户将变为普通用户。确认删除？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.$confirm(`删除后不可恢复，确认删除？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              deleteIdentity({ tid: identity.tid, is_deleted: 1 }).then((res) => {
                if (res.data.code === 0) {
                  self.list = self.list.filter((item) => {
                    return item.tid !== identity.tid && item.pid !== identity.tid
                  })
                  self.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                } else {
                  self.$message({
                    type: 'warning',
                    message: '删除失败！'
                  })
                }
              }).catch(() => {
                self.$message({
                  type: 'warning',
                  message: '删除失败！'
                })
              })
            }).catch(() => {
              self.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          self.$confirm(`${identity.name}为二级身份，删除后拥有该身份的用户将变为普通用户。确认删除？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteIdentity({ tid: identity.tid, is_deleted: 1 }).then((res) => {
              if (res.data.code === 0) {
                self.list = self.list.filter((item) => {
                  return item.tid !== identity.tid
                })
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else {
                self.$message({
                  type: 'warning',
                  message: '删除失败！'
                })
              }
            }).catch(() => {
              self.$message({
                type: 'warning',
                message: '删除失败！'
              })
            })
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      addSubIdentity(identity) {
        this.subVisible = true
        this.subForm = Object.assign({}, {
          pid: identity.tid,
          pname: identity.name,
          desc: identity.desc,
          declare: identity.declare + '?pid=' + identity.tid,
          roun_icon: '',
          rect_icon: '',
          tone: {
            day_tone: '',
            night_tone: ''
          }
        })
      },
      // 保存一级身份类别
      saveSup(formName) {
        const self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = formName === 'supForm' ? self.supForm : Object.assign({}, self.supForm, { apply_status: !self.supForm.apply_status })
            postIdentity(data).then((res) => {
              if (res.data.code === 0) {
                if (formName === 'supForm') {
                  self.supVisible = false
                  if (!self.supForm.tid) {  // 新增一级类别时弹窗添加二级类别
                    self.list = [res.data.data, ...self.list]
                    self.subForm = Object.assign(self.subForm, {
                      pid: res.data.data.tid,
                      pname: res.data.data.name,
                      desc: res.data.data.desc,
                      tone: {
                        day_tone: '',
                        night_tone: ''
                      },
                      declare: res.data.data.declare + '?pid=' + res.data.data.tid
                    })
                    self.subVisible = true
                  } else {  // 编辑一级类别更新列表
                    self.list = self.list.map((identity) => {
                      if (identity.tid === self.supForm.tid) {
                        identity = Object.assign({}, res.data.data)
                      }
                      return identity
                    })
                  }
                } else {
                  self.list = self.list.map((identity) => {
                    if (identity.tid === self.supForm.tid) {
                      identity = Object.assign({}, res.data.data)
                    }
                    return identity
                  })
                  self.openVisible = false
                }
                self.$message({
                  message: '保存成功',
                  type: 'success'
                })
              } else {
                self.$message({
                  message: res.data.message || '服务出错了',
                  type: 'warning'
                })
              }
            }).catch(() => {
              self.$message({
                message: '服务出错了',
                type: 'warning'
              })
            })
          } else {
            self.$message({
              message: '请按格式填写',
              type: 'warning'
            })
            return false
          }
        })
      },
      // 保存二级身份类别
      saveSub(formName) {
        const self = this
        self.subVisible = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = Object.assign({}, self.subForm, {
              tone: {
                day_tone: self.colorToNum(self.subForm.tone.day_tone),
                night_tone: self.colorToNum(self.subForm.tone.night_tone)
              }
            })
            postIdentity(data).then((res) => {
              if (res.data.code === 0) {
                self.subVisible = false
                if (!self.subForm.tid) {  // 新增二级类别
                  self.list = [res.data.data, ...self.list]
                } else {  // 编辑二级类别
                  self.list = self.list.map((identity) => {
                    if (identity.tid === self.subForm.tid) {
                      identity = Object.assign({}, res.data.data)
                    }
                    return identity
                  })
                }
              } else {
                self.$message({
                  message: res.data.message || '服务出错了',
                  type: 'warning'
                })
              }
            }).catch(() => {
              self.$message({
                message: '服务出错了',
                type: 'warning'
              })
            })
          } else {
            self.$message({
              message: '请按格式填写',
              type: 'warning'
            })
            return false
          }
        })
      }
    }
  }
</script>
<style>
  .el-table .cell .ypw-btn{
    margin: 5px;
  }
  .sup-model, .sub-model, .open-model{
    padding: 20px 40px 20px 20px;
  }
  .color-text{
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    color:#999;
  }
</style>

