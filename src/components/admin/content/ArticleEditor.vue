<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard'}">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/content/book'}">公告管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/content/announces'}">公告修改</el-breadcrumb-item>
        <el-breadcrumb-item>编辑器</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <el-input
        v-model="announces.title"
        style="margin: 10px 0px;font-size: 18px;"
        placeholder="请输入标题"></el-input>
    </el-row>
    <el-row style="height: calc(100vh - 140px);">
      <mavon-editor
        v-model="announces.content"
        style="height: 100%;"
        ref=md
        @save="saveAnnounce"
        @imgAdd="imgAdd"
        fontSize="16px">
      </mavon-editor>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Editor',
    data () {
      return {
        announces: {
          id: null,
          title: '',
          content: ''
        }
      }
    },
    mounted () {
      console.log(this.$route)
      if (this.$route.params.announces) {
        this.announces = this.$route.params.announces
        console.log(this.announces)
      }
    },
    methods: {
      saveAnnounce (value, render) {
        // value 是 md，render 是 html
        this.$confirm('是否保存并发布公告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('announces:', this.announces)
            this.$axios
              .post('/api/admin/announce', {
                id: this.announces.id,
                title: this.announces.title,
                content: this.announces.content
              }).then(resp => {
              if (resp && resp.data.success) {
                this.$message({
                  type: 'info',
                  message: '已发布成功'
                })
                this.$router.go(-1)
              }
            })
          }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          })
        })
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
      }
    }
  }
</script>
