<template>
  <div style="margin-top: 10px">
    <div>
      <el-button class="btn-publish" @click="toPublish()" type="primary" plain>添加讨论</el-button>
    </div>
    <el-row :gutter="20">
    <el-col :span="16">
      <div style="margin-bottom: 30px;display: flex;justify-content: center;align-items: center">
        <el-input
          @keyup.enter.native="searchClick"
          :placeholder="tips"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 400px;margin-right: 10px"
          v-model="tag">
        </el-input>
    <el-button size="small" type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
  </div>
      <div class="posts-area">
      <el-tabs class="tab-content-none" v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="最新" name="new"></el-tab-pane>
        <el-tab-pane label="最热" name="hot"></el-tab-pane>
        <el-tab-pane label="七天最热" name="hot7"></el-tab-pane>
        <el-tab-pane label="消灭零回复" name="no"></el-tab-pane>
      </el-tabs>
      <div v-if="posts.length == 0">
        <p class="question-null">还没有讨论哟~~~</p>
      </div>
      <el-card v-else style="text-align: left">
        <div v-for="post in posts.slice((currentPage-1)*pageSize,currentPage*pageSize)" :key="post.id">
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
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
       @current-change="handleCurrentChange"
       :page-size="pageSize"
       :total="posts.length">
      </el-pagination>
    </el-col>
    <el-col :span="8">
      <h3>热门标签</h3>
            <dl class="tags-hot">
                <dd v-for="tag in postTags" :key="tag.name">
                    <div>
                        <a class="text" @click="searchTag(tag.name)">
                            <i class="iconfont icon-ebook-biaoqian"></i>
                            <span>{{tag.name}}</span>
                        </a>
                        <p class="hot-tag-desc">问题数：<b>{{tag.postCount}}</b> 评论数：<b>{{tag.commentCount}}</b></p>
                    </div>
                </dd>
            </dl>
    </el-col>
    </el-row>
  </div>
</template>

<script>
 import SearchBar from '../library/SearchBar'
  export default {
    components: {SearchBar},
    name: 'posts',
    data () {
      return {
        tips: '标签...',
        posts: [],
        postTags: [],
        currentPage: 1,
        pageSize: 5,
        total: 0,
        search: '',
        tag: '',
        sort: '',
        activeName: 'second'
      }
    },
    mounted () {
      this.getParams()
      this.loadHotTags()
    },
    methods: {
      toPublish () {
        console.log('dsads')
        this.$router.push({
          path: 'jotter/postArticle'
        })
      },
      getParams () {
        const tag = this.$route.query.tag
        if (tag === null || tag === undefined) {
          this.loadposts()
          return
        }
        this.searchTag(tag)
      },
      searchClick () {
        this.loadposts()
      },
      searchTag (name) {
        this.tag = name
        this.loadposts()
      },
      handleClick (tab, event) {
        this.sort = tab.name
       this.loadposts()
      },
      loadposts () {
        var _this = this
        this.$axios.get('/api/post/postList?search=' + this.search + '&tag=' + this.tag + '&sort=' + this.sort).then(resp => {
          if (resp.data.success) {
            _this.posts = resp.data.data
            _this.total = resp.data.data.length
          }
        })
      },
      loadHotTags () {
        this.$axios.get('/api/post/hotTag').then(resp => {
          if (resp.data.success) {
            this.postTags = resp.data.data
          } else {
             this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      },
      handleCurrentChange (page) {
        this.currentPage = page
      }
    }
  }
</script>

<style scoped>
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
  .question-null {
     font-size: 20px;
    color: #999999;
    padding-top: 20px;
    text-align: center;
  }
  .btn-publish {
    display: flex;
    margin-left: 90.4%;
  }
  .posts-area {
    width: 900px;
    height: 550px;
    margin-left: 3%;
    margin-right: 3%;
  }
  .post-link {
    text-decoration: none;
    color: #606266;
    display: block;
  }

  .post-link:hover {
    color: #409EFF;
  }
  .tags-hot .text{
    display: inline-block;
    height: 20px;
    line-height: 16px;
    padding: 2px 5px;
    background-color: #99cfff;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
}
.tags-hot a{
    cursor: pointer;
    text-decoration: none;
}
.tags-hot .hot-tag-desc {
    font-size: 12px;
    color: #999999;
}
.tags-hot a:hover {
    background-color: #428bca;
}
</style>
