<template>
  <div class="box-uploader">
    <el-upload :data="dataObj"
      :name="fileName"
      :multiple="false"
      :show-file-list="false"  
      :action="uploadServer"
      :before-upload="beforeUpload"
      :on-success="handleImageScucess">
      <img v-if="imageUrl.length>1" :src="imageUrl" class="box">
      <i v-else class="el-icon-plus box-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'dragImageUpload',
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  data() {
    return {
      // fileName: 'fpfile',
      // 上传至FP服务器接口
      // uploadServer: 'https://file.webapp.163.com/gameapp/file/new/',
      fileName: 'file',
      // 管理后台上传图片接口
      uploadServer: '/admin/ajax/upload2fp/',
      tempUrl: '',
      dataObj: { Authorization: '' }
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageScucess(res) {
      const img = res.img
      // const img = JSON.parse(res.body)
      this.emitInput(img.url)
    },
    beforeUpload() {
      // this.dataObj.Authorization = 'Policy qCrpX1EFMLfuOgjCRICHQqTs3mE=:eyJmc2l6ZUxpbWl0IjogWzAsIDEwNDg1NzYwMF0sICJtaW1lTGltaXQiOiBbImltYWdlL2pwZWciLCAiaW1hZ2UvcG5nIiwgInZpZGVvL21wNCIsICJhdWRpby9tcDMiLCAiYXVkaW8vbXBlZyIsICJpbWFnZS9naWYiLCAiaW1hZ2UvYm1wIl0sICJ1cmwiOiAiaHR0cDovL2ZwLnBzLm5ldGVhc2UuY29tL2dhbWVhcHAvZmlsZS9uZXcvIiwgImNvbG9yIjogZmFsc2UsICJ0aW1lc3RhbXAiOiAxNTI3MDc2MjU0LCAicGluZyI6ICIiLCAibWV0aG9kIjogIlBPU1QifQ=='
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.box-uploader{
  width: 140px;
  height: 140px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover{
    border-color: #409EFF;
  }
}
.box-uploader-icon {
  width: 140px;
  height: 140px;
  font-size: 28px;
  color: #8c939d;
  line-height: 140px;
  text-align: center;
}
.box {
  max-height: 200px;
  display: block;
}
</style>

