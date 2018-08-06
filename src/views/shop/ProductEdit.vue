<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> Product</span>
        <div class="products-edit">
          <el-form ref="productForm" :model="productForm" label-width="120px">
            <el-form-item label="商品名称">
              <el-input v-model="productForm.name" placeholder="请填写标题"></el-input>
            </el-form-item>
            <el-form-item label="封面">
              <file-upload v-model="productForm.cover.url"></file-upload>
            </el-form-item>
            <el-form-item label="标签">
              <el-tag
                  :key="tag"
                  v-for="tag in productForm.tags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
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
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>
            <el-form-item label="相关游戏">
              <el-input v-model="productForm.gid" placeholder="请填写相关游戏ID"></el-input>
            </el-form-item>
            <el-form-item label="详情">
              <div class="ypw-editor" id="editor" style="width:100%;height:240px;"></div>
            </el-form-item>
            <el-form-item label="所需Yo币">
              <el-input v-model="productForm.price" placeholder="请填写所需Yo币"></el-input>
            </el-form-item>
            <el-form-item label="折扣（%）">
              <el-input v-model="productForm.discount" placeholder="请填写折扣百分比"></el-input>
            </el-form-item>
            <el-form-item label="所需等级">
              <el-input v-model="productForm.required_level" placeholder="请填写所需等级"></el-input>
            </el-form-item>
            <el-form-item label="库存">
              <el-input v-model="productForm.stock" placeholder="请填写库存"></el-input>
            </el-form-item>
            <el-form-item label="可见库存">
              <el-input v-model="productForm.avaliable_stock" placeholder="请填写可见库存"></el-input>
            </el-form-item>
            <el-form-item label="限购数量">
              <el-input v-model="productForm.quota" placeholder="请填写限购数量"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input v-model="productForm.rank" placeholder="请填写顺序"></el-input>
            </el-form-item>
            <el-form-item label="虚拟商品">
              <el-switch v-model="productForm.virtual"></el-switch>
            </el-form-item>
            <el-form-item label="绑定到游戏">
              <el-switch v-model="productForm.bind_quota"></el-switch>
            </el-form-item>
            <el-form-item label="新品">
              <el-switch v-model="productForm.is_new"></el-switch>
            </el-form-item>
            <el-form-item label="上架">
              <el-switch v-model="productForm.available"></el-switch>
            </el-form-item>
            <el-form-item label="设备唯一">
              <el-switch v-model="productForm.device_uni"></el-switch>
            </el-form-item>
            <el-form-item label="激活码自动发放">
              <el-switch v-model="productForm.autorelease"></el-switch>
            </el-form-item>
            <el-form-item label="有效时间">
              <el-date-picker
                  style="width: 100%;"
                  v-model="productForm.effectiveTime"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getEffectiveTime">
              </el-date-picker>
            </el-form-item>
            <!--<el-form-item label="上架时间">-->
            <!--<el-input v-model="productForm.startDate"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="下架时间">-->
            <!--<el-input v-model="productForm.endDate"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="备注">
              <el-input type="textarea" v-model="productForm.note" placeholder="请填写备注"></el-input>
            </el-form-item>
            <el-form-item label="适配机型组">
              <el-select style="width: 100%;" v-model="productForm.client_id" placeholder="请选择ClientID">
                <el-option v-for="item in apps" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="重叠游戏列表">
              <el-input v-model="productForm.title" placeholder="线上运营没有使用"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
          <el-dialog title="分享地址生成" :visible.sync="shareModelVisible" custom-class="share-model">
            <create-ypw-link @createdLink="getCreatedLink"></create-ypw-link>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> Images</span>
        <div class="products-edit">
          <el-form ref="productForm" :model="productForm" label-width="120px">
            <el-form-item label="相册">
              <template v-for="img in productForm.image_list">
                <img class="album-pic" :src="img" alt="">
              </template>
              <muti-file-upload v-model="album" @change="addImage"></muti-file-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> Virtual_items</span>
        <div class="products-edit">
          <el-form ref="productForm" :model="productForm" label-width="120px">
            <el-form-item label="商品文件">
              <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传cvs/txt文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div class="order-list">
            <el-table :data="orderList" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
              <el-table-column align="center" label='ID' width="95">
                <template slot-scope="scope">
                  {{scope.row.id}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='商品ID' width="95">
                <template slot-scope="scope">
                  {{scope.row.product_id}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='card_no'>
                <template slot-scope="scope">
                  {{scope.row.card_no}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='url' width="240">
                <template slot-scope="scope">
                  {{scope.row.url}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='sold' width="95">
                <template slot-scope="scope">
                  {{scope.row.sold}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='过期时间' width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.expired_at | parseTime}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label='创建时间' width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span>{{scope.row.created_at | parseTime}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  require('@/assets/ypw-editor/ypw-editor.css')
  require('@/assets/ypw-editor/ypw-editor.js')
  import FileUpload from '@/components/upload/DragImage'
  import MutiFileUpload from '@/components/upload/BoxImage'
  import DocUpload from '@/components/upload/FileUpload'
  import CreateYpwLink from '@/components/createYpwLink/index'
  import { parseTime } from '@/filters/index.js'
  //  import { fetchActivity, postActivity } from '@/api/activity'
  export default {
    name: 'promotions-edit',
    data() {
      return {
        album: '',
        ypwEditor: null,
        inputVisible: false,
        inputValue: '',
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
        productForm: {
          title: '',
          name: '',
          cover: {
            url: 'https://gameapp.fp.ps.netease.com/file/59e6f48b8b74278bb85a17b930Bw55pD'
          },
          image_list: [
            'https://gameapp.fp.ps.netease.com/file/59e6f48b8b74278bb85a17b930Bw55pD',
            'https://gameapp.fp.ps.netease.com/file/59e6f48b8b74278bb85a17b930Bw55pD'
          ],
          product_file: null,
          tags: [],
          gid: 0,
          intro: '',
          price: 0,
          discount: 0,
          required_level: 0,
          stock: 0,
          avaliable_stock: 0,
          quota: 0,
          rank: 0,
          virtual: 0,
          bind_quota: 0,
          is_new: 0,
          available: 1,
          device_uni: 0,
          autorelease: 1,
          note: ''
        },
        fileList: [],
        orderList: [
          {
            id: 1,
            product_id: 12,
            card_no: 'NTS32GKGJATP6UB',
            url: '',
            sold: 1,
            expired_at: 12233334443,
            created_at: 32324889377
          }
        ],
        listLoading: false,
        total: 1,
        listQuery: {
          page: 1,
          limit: 20
        }
      }
    },
    components: {
      'file-upload': FileUpload,
      'muti-file-upload': MutiFileUpload,
      'doc-upload': DocUpload,
      'create-ypw-link': CreateYpwLink
    },
    computed: {
      id() {
        return Number(this.$route.params.id)
      }
    },
    methods: {
      addImage(image) {
        this.productForm.image_list.push(image)
      },
      handleClose(tag) {
        this.productForm.tags.splice(this.productForm.tags.indexOf(tag), 1)
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
          this.productForm.tags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      addParam(b) {
        if (b) {
          let newUrl = this.productForm.url
          const param = this.productForm.param
          if (newUrl.indexOf(param.key) > 0) return false
          newUrl = newUrl.indexOf('?') > 0 ? `${newUrl}&${param.key}=${param.value}` : `${newUrl}?${param.key}=${param.value}`
          this.productForm.url = newUrl
        }
      },
      getEffectiveTime(time) {
        if (!time) return null
        this.productForm.startDate = parseTime(new Date(time[0]).getTime())
        this.productForm.endDate = parseTime(new Date(time[1]).getTime())
      },
      getBarrageFrom(from) {
        if (!from) return null
        this.productForm.barrageId = this.barrages.filter((item) => {
          return item.from === from
        })[0].id
      },
      getCreatedLink(data) {
        this.productForm.url = data.createdLink
        this.shareModelVisible = data.shareModelVisible
      },
      buildLink() {
        this.shareModelVisible = true
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
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
      onSubmit() {
        const self = this
        console.log('submit!')
        console.log(self.productForm)
//        postActivity(self.productForm).then((res) => {
//          console.log(res)
//          this.$router.push({ path: '/resource/activity/promotions' })
//        })
      },
      onCancel() {
        this.$router.push({ path: '/shop/products/product-list' })
      }
    },
    created() {
      const self = this
      if (!this.ypwEditor) {
        // 初始化编辑器
        setTimeout(() => {
          this.ypwEditor = new window.YpwEditor({
            menus: [],
            placeholder: '简介内容～'
          })
          this.ypwEditor.init()
          this.ypwEditor.setHTML(this.productForm.intro)
          // 初始化简介
          this.ypwEditor.updateContentPlaceholder()
          this.ypwEditor.$textElem.blur(() => {
            this.productForm.intro = this.ypwEditor.getContent().content
          })
        }, 500)
      }
      console.log(self.id)
//      fetchActivity(self.id).then((res) => {
//        console.log(res)
//      })
    }
  }
</script>
<style>
  .products-edit{
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
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .album-pic{
    width: 140px;
    height: 140px;
    border-radius: 6px;
    vertical-align: top;
    margin-right: 10px;
    margin-bottom: 10px;
    max-width: 100%;
  }
  .box-uploader{
    display: inline-block;
  }
</style>