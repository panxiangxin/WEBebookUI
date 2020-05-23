<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="font-weight: bold;font-size: 20px">热门帖子</span>
    </div>
    <div class="block">
       <el-card style="text-align: left">
        <div v-for="post in posts" :key="post.id">
          <el-row style="height: 50px;">
            <el-col :span="2">
              <el-image :src="post.user.avatarUrl" class="avatar-circle"></el-image>
            </el-col>
            <el-col :span="22">
            <router-link class="post-link" :to="{path:'jotter/Article',query:{id: post.id}}"><span style="font-size: 20px"><strong>{{post.title}}</strong></span></router-link>
            <span class="text-desc">
            <span>{{post.commentCount}}个回复• </span>
            <span>{{post.viewCount}}次浏览• </span>
            <span>{{post.gmtCreate | dateFormatWithTime}}</span>
            </span>
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </div>
      </el-card>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: 'UpdateCard',
    data () {
      return {
        posts: []
      }
    },
    created () {
      this.hotPosts()
    },
    methods: {
      hotPosts () {
        this.$axios.get('/api/post/hotPost').then(resp => {
          if (resp.data.success) {
            console.log(resp.data.data)
            this.posts = resp.data.data
          } else {
             this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
    }
  }
  }
</script>

<style scoped>
  .box-card {
    margin-top: 5px;
    width: 988px;
    text-align: left;
  }
   .text-desc {
    display: block;
    padding-top: 14px;
     font-size: 12px;
    font-weight: normal;
    color: #999;
  }
  .avatar-circle {
    height: 60px;
    width:60px;
    border-radius: 50%;
  }
</style>
