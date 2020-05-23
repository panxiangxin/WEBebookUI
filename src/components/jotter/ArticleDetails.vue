<template>
<el-row>
  <el-col :span="20" class="articles-area">
    <el-card style="text-align: left;margin: 35px">
      <!--正文-->
      <el-row>
        <h3 class="question-title">{{post.title}}</h3>
        <span class="text-desc">
            <span>{{post.commentCount}}个回复• </span>
            <span>{{post.viewCount}}次浏览• </span>
            <span>{{post.gmtCreate | dateFormatWithTime}}</span>
            </span>
        <div class="markdown-body">
         <mavon-editor
            :value="post.description"
            defaultOpen="preview"
            :boxShadow="false"
            :editable="false"
            :subfield="false"
            :toolbarsFlag="false"
          >
          </mavon-editor>
        </div>
        <!--标签-->
            <el-row>
              <el-tag class="tag-info" v-for="tag in post.tag.split(',')" :key="tag" @click="clickPostTag(tag.name)">
                  <i class="iconfont icon-ebook-biaoqian"></i>
                   {{tag}}</el-tag>
            </el-row>
          </el-row>
     <!--回复-->
     <hr>
      <el-row>
        <comment :topId="post.id" :types="3" :recevier="post.creator"></comment>
      </el-row>
    </el-card>
  </el-col>
  <el-col :span="4">
    <el-card style="text-align: left;margin: 35px 0">
      <h4>发起人</h4>
       <el-row>
          <el-col :span="10">
            <el-image :src="post.user.avatarUrl" class="avatar-circle"></el-image>
          </el-col>
          <el-col :span="14" class="post-username">
            <span>{{post.user.userName}}</span>
          </el-col>
        </el-row>
    </el-card>
    <el-card style="text-align: left;margin: 35px 0">
      <h4>相关问题</h4>
          <ul class="question-rated">
          <li v-for="relatedPost in related" :key="relatedPost.id">
            <a><span class="post-link" @click="relatePost(relatedPost.id)">{{relatedPost.title}}</span></a>
          </li>
        </ul>
    </el-card>
  </el-col>
</el-row>
</template>

<script>
import comment from '../common/comment'

  export default {
    name: 'ArticleDetails',
    components: {
    comment
  },
    data () {
      return {
        post: [],
        related: []
      }
    },
    mounted () {
      this.loadArticle()
    },
    methods: {
      clickPostTag (name) {
        this.$router.push({
        path: '/jotter',
        query: {
          tag: name
        }
      })
      },
      relatePost (id) {
        console.log(id)
        var _this = this
        this.$axios.get('/api/post/' + id).then(resp => {
          if (resp.data.success) {
            _this.post = resp.data.data.post
            _this.related = resp.data.data.related
          }
        })
      },
      loadArticle () {
        var _this = this
        this.$axios.get('/api/post/' + this.$route.query.id).then(resp => {
          if (resp.data.success) {
            _this.post = resp.data.data.post
            _this.related = resp.data.data.related
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import "../../styles/markdown.css";
  .question-rated {
    line-height: 20px;
    font-size: 12px;
    list-style: none;
    padding-left: 0;
}
  .avatar-circle {
    height: 60px;
    width:60px;
    border-radius: 50%;
  }
  .post-link {
    text-decoration: none;
    color: #606266;
    display: block;
  }
   .text-desc {
    display: block;
    margin-bottom: 10px;
     font-size: 12px;
    font-weight: normal;
    color: #999;
  }
  .tag-info {
    margin-left: 10px;
  }
  .post-username {
    padding-top: 18px;
  }
  .post-username span {
    font-size: 20px;
    font-style: italic;
    color: gray;
  }
</style>
