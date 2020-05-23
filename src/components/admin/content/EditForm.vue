<template>
  <div style="text-align: left">
    <el-button class="add-button" type="success" @click="add()">添加图书</el-button>
    <el-dialog
      title="添加/修改图书"
      :visible.sync="dialogFormVisible"
      @close="clear">
      <el-form :model="form" style="text-align: left" ref="dataForm" :rules="rules">
        <el-form-item label="书名" :label-width="formLabelWidth" prop="bookName">
          <el-input v-model="form.bookName" autocomplete="off" placeholder="不加《》"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth" prop="author">
          <el-input v-model="form.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版日期" :label-width="formLabelWidth" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="书籍积分" :label-width="formLabelWidth" prop="bookStamps">
          <el-input-number v-model="form.bookStamps" :precision="2" :step="0.5"></el-input-number>
        </el-form-item>
        <el-form-item label="书籍封面" :label-width="formLabelWidth" prop="imgUrl">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="none"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChange">
           <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon">封面</i>
          </el-upload>
        </el-form-item>
        <el-form-item label="书籍文件" :label-width="formLabelWidth" prop="bookUrl">
          <el-upload
          class="upload-demo"
          :headers="headers"
          action="/api/admin/book/up"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :limit="1"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传文件，且不超过500kb</div>
        </el-upload>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth" prop="bio">
          <el-input type="textarea" v-model="form.bio" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标签" :label-width="formLabelWidth" prop="tags">
          <el-tag
          :key="tag"
          v-for="tag in tagTrim()"
          closable
          :disable-transitions="false"
           @close="handleClose(tag)">
          {{tag}}
        </el-tag>
         <el-select
         class="input-new-tag"
         v-if="inputVisible"
         v-model="inputValue"
         clearable
         ref="saveTagInput"
         size="small"
         @keyup.enter.native="handleInputConfirm"
         placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          </el-option>
        </el-select>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
        </el-form-item>
        <el-form-item prop="id" style="height: 0">
          <el-input type="hidden" v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false,clear()">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ImgUpload from './ImgUpload'
  export default {
    name: 'EditForm',
    components: {ImgUpload},
    data () {
      return {
        rules: {
          bookName: [{required: true, message: '书籍名不能为空', trigger: 'blur'}],
          author: [{required: true, message: '作者', trigger: 'blur'}],
          date: [{required: true, message: '性别不能为空', trigger: 'blur'}],
          bookStamps: [{required: true, message: '积分不能为空', trigger: 'blur'}],
          imgUrl: [{required: true, message: '封面不能为空', trigger: 'blur'}],
          bio: [{required: true, message: '介绍不能为空', trigger: 'blur'}],
          tags: [{required: true, message: '标签不能为空', trigger: 'blur'}]
        },
        checked: true,
        options: [{
          value: '生活',
          label: '生活'
        }, {
          value: '科技',
          label: '科技'
        }, {
          value: '玄幻',
          label: '玄幻'
        }, {
          value: '都市',
          label: '都市'
        }, {
          value: '社会',
          label: '社会'
        }],
        dialogFormVisible: false,
        form: {
          id: '',
          bookName: '',
          author: '',
          date: '',
          bookStamps: '',
          imgUrl: '',
          bio: '',
          tags: '',
          bookSize: '',
          bookUrl: ''
        },
        headers: {},
        file: null,
        fileList: [],
        inputVisible: false,
        inputValue: '',
        bookFile: null,
        formLabelWidth: '120px'
      }
    },
    created () {
        this.headers = {token: localStorage.token || ''}
    },
    methods: {
      handleSuccess (response, file, fileList) {
        if (response.success) {
          this.bookFile = file.raw
          this.form.bookSize = response.data.bookSize
          this.form.bookUrl = response.data.bookUrl
        }
      },
      handleRemove (file, fileList) {
          this.form.bookSize = ''
          this.form.bookUrl = ''
      },
      handlePreview (file) {
        console.log(file)
      },
       handleClose (tag) {
         let tags = this.form.tags.split(',')
         for (var i = 0; i < tags.length; i++) {
            if (tags[i] === '') {
            tags.splice(i, 1)
            i = i - 1
            }
          }
         tags.splice(tags.indexOf(tag), 1)
         var tagStr = ''
         for (let i = 0; i < tags.length; i++) {
           if (i === 0) {
              tagStr = tags[i]
           } else {
             tagStr = tagStr + ',' + tags[i]
           }
         }
         this.form.tags = tagStr
      },
      tagTrim () {
        let tags = this.form.tags.split(',')
          for (var i = 0; i < tags.length; i++) {
            if (tags[i] === '') {
            tags.splice(i, 1)
            i = i - 1
            }
          }
          return tags
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          console.log(this.$refs.saveTagInput.$refs)
          this.$refs.saveTagInput.focus()
        })
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          let tags = this.form.tags.split(',')
          for (var i = 0; i < tags.length; i++) {
            if (tags[i] === '') {
            tags.splice(i, 1)
            i = i - 1
            }
          }
          if (tags.indexOf(inputValue) === -1) {
            tags.push(inputValue)
            var tagStr = this.form.tags

            if (tags.length === 1) {
              tagStr = inputValue
            } else {
              tagStr = tagStr + ',' + inputValue
            }
         this.form.tags = tagStr
          }
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      clear () {
        this.fileList = []
        this.file = null
        this.form = {
         id: '',
          bookName: '',
          author: '',
          date: '',
          bookStamps: '',
          imgUrl: '',
          bio: '',
          tags: '',
          bookSize: ''
        }
      },
      add () {
        this.clear()
        this.dialogFormVisible = true
      },
      onSubmit () {
        var bookData = new FormData()
        console.log(this.form)
        bookData.append('book', JSON.stringify(this.form))
        if (this.file !== null) {
          var imgSrc = this.file
        bookData.append('img', imgSrc)
        }
        if (this.bookFile !== null) {
          bookData.append('bookFile', this.bookFile)
        }
        var options = {
          url: '/api/admin/book',
          data: bookData,
          method: 'post',
          contentType: false,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
         this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$axios(options).then(resp => {
          if (resp.data.success) {
               this.$alert(resp.data.message, '提示', {
                 confirmButtonText: '确定'
               })
               this.dialogFormVisible = false
               this.$emit('onSubmit')
             } else {
               this.$alert(resp.data.message, '提示', {
                 confirmButtonText: '确定'
               })
             }
        }).catch(failResponse => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
      },
      handleChange (file) {
          Object.defineProperty(file.raw, 'name', {
            // 通过修改原型中的name
            writable: true
          })
             // 图片路径
            let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
          const extension = testmsg === 'jpg'
          const extension2 = testmsg === 'png'
          const isLt10M = file.size / 1024 / 1024 < 10
          if (!extension && !extension2) {
            this.$message.warning('上传文件只能是 jpg、png格式!')
            return false
          }
          if (!isLt10M) {
            this.$message.warning('上传头像图片大小不能超过 10MB!')
            return false
          }
          this.file = file.raw
          this.form.imgUrl = URL.createObjectURL(file.raw)
        }
    }
  }
</script>

<style scoped>
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
  .add-button {
    margin: 18px 0 0 10px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
