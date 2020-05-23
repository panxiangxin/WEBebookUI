<template>
  <div>
    <el-row :gutter="20" class="publish-area">
      <!--这里是发布帖子的地方-->
      <el-col :span="16">
        <h2 style="text-align: left">
          <i class="el-icon-circle-plus"></i>发布/修改帖子
        </h2>
        <el-form :rules="rules" ref="postForm" label-position="top" label-width="80px" :model="postForm" style="text-align: left">
          <el-form-item label="讨论标题(简单概要):" prop="title">
            <el-input v-model="postForm.title" placeholder="请输入标题..."></el-input>
          </el-form-item>
          <el-form-item label="问题补充(必填，请参照右边提示):" prop="description">
              <mavon-editor :codeStyle="codeStyle" :ishljs="true" ref="md" @imgAdd="imgAdd" v-model="postForm.description"></mavon-editor>
          </el-form-item>
          <el-form-item label="添加标签:" prop="tag">
            <el-input ref="tag" v-model="postForm.tags"
            placeholder="输入标签，以,隔开.."
             autocomplete="off"
             @focus="showSelectTag()"></el-input>
          </el-form-item>
          <el-form-item id="selectTag" v-if="showSelect">
              <el-tabs>
                <el-tab-pane v-for="tag in tags" :key="tag.categoryName" :label="tag.categoryName" :name="tag.categoryName">
                    <el-tag v-for="atTag in tag.tags" :key="atTag" type="warning" @click="selectTag($event)"><i class="iconfont icon-ebook-biaoqian"></i>  {{atTag}}</el-tag>
                </el-tab-pane>
            </el-tabs>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" @click="submitForm('postForm')">发布</el-button>
            <el-button @click="resetForm('postForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--右边是注意的要求-->
      <el-col :span="8">
          <div>
          <h3>问题发起指南</h3>
        <ul>
            <li>讨论标题: 请用精简的语言描述您发布的问题，不超过25字</li>
            <li>讨论补充: 详细补充您的问题内容，并确保问题描述清晰直观, 并提供一些相关的资料</li>
            <li>选择标签: 选择一个或者多个合适的标签，不超过10个字</li>
        </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rules: {
          title: [
            { required: true, message: '请输入标题名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入讨论内容', trigger: 'blur' }
          ]
      },
      checked: true,
      postForm: {
        id: null,
        title: '',
        description: '',
        tags: ''
      },
      tags: [],
      showSelect: false,
      loading: false
    }
  },
  mounted () {
    if (this.$route.params.postForm) {
        this.postForm = this.$route.params.postForm
      }
    this.getTags()
  },
  methods: {
    getTags () {
      this.$axios.get('/api/post/tag').then(resp => {
        if (resp.data.success) {
          this.tags = resp.data.data
          console.log(this.tags)
        } else {
       this.$alert(resp.data.message, '提示', {
                 confirmButtonText: '确定'
               })
    }
      }).catch(res => {
          console.log(res)
        })
    },
      selectTag (event) {
          var value = event.target.innerText.trim()
          var tags = this.postForm.tags
          if (tags.indexOf(value) === -1) {
        if (tags) {
            this.postForm.tags = tags + ',' + value
        } else {
            this.postForm.tags = value
        }
    }
      },
      imgAdd (pos, $file) {
          let formdata = new FormData()
            formdata.append('file', $file)
            this.$axios({
                url: '/api/file/upload/image',
                method: 'post',
                data: formdata,
                headers: { 'Content-Type': 'multipart/form-data' }
        }).then(resp => {
          if (resp.data.success) {
          const url = resp.data.data
           this.$refs.md.$img2Url(
            pos,
            url
          )
          } else {
       this.$alert(resp.data.message, '提示', {
                 confirmButtonText: '确定'
               })
    }
            }).catch(res => {
          console.log(res)
        })
      },
      showSelectTag () {
          this.showSelect = true
      },
  submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              console.log(this.postForm)
              this.$axios.post('/api/post/publish', {
                id: this.postForm.id,
                title: this.postForm.title,
                tag: this.postForm.tags,
                description: this.postForm.description
              }).then(resp => {
                  if (resp.data.success) {
                     this.$alert(resp.data.message, '提示', {
                 confirmButtonText: '确定'
               })
              this.$router.go(-1)
                  } else {
                    this.$alert(resp.data.message, '提示', {
                 confirmButtonText: '确定'
               })
                  }
              })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
}
</script>
<style scoped>
.publish-area {
  padding: 0 10px 10px 15px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
