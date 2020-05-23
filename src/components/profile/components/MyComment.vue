<template>
  <div class="user-activity">
    <div v-for="comment in comments.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="comment.id">
      <div class="post" v-if="comment.type == 1">
        <div class="user-block">
          <img class="img-circle" :src="user.avatarUrl + avatarPrefix" />
          <img :src="comment.commentBook.imgUrl" class="book-image">
          <span class="username text-muted">
            评论了图书 <a :href="'/library?bookId=' + comment.commentBook.id"> {{comment.commentBook.bookName}} </a>
            </span>
        </div>
        <h2>
          ==>"{{ comment.content }}"
        </h2>
        <span class="description"> {{comment.gmtCreate | dateFormatWithTime}} </span>
        <ul class="list-inline">
          <li  @click="toBook(comment.commentBook.id)">
            <span class="link-black text-sm">
              <i class="el-icon-share" />
              前往图书
            </span>
          </li>
          <li @click="deleteComment(comment)">
            <span class="link-black text-sm">
              <i class="el-icon-delete"></i>
              删除评论
            </span>
          </li>
        </ul>
      </div>
      <div class="post" v-else-if="comment.type == 2">
        <div class="user-block">
          <img class="img-circle" :src="user.avatarUrl + avatarPrefix" />
          <img :src="comment.commentBook.imgUrl" class="book-image">
          <span class="username text-muted">
            在图书 <a :href="'/library?bookId=' + comment.commentBook.id"> {{comment.commentBook.bookName}} </a> 回复 <span style="color: blue;">{{comment.receiver.userName}}</span>
             的评论
            </span>
            <span style="font-size: 20px; color: gray;"> ==> {{comment.comment.content}}</span>
        </div>
        <p style="color: black; font-size: 25px;">
          ===> "{{ comment.content }}"
        </p>
        <span class="description"> {{comment.gmtCreate | dateFormatWithTime}} </span>
        <ul class="list-inline">
          <li  @click="toBook(comment.commentBook.id)">
            <span class="link-black text-sm">
              <i class="el-icon-share" />
              前往图书
            </span>
          </li>
          <li  @click="deleteComment(comment)">
            <span class="link-black text-sm">
               删除评论
            </span>
          </li>
        </ul>
      </div>
       <div class="post" v-if="comment.type == 3">
        <div class="user-block">
          <img class="img-circle" :src="user.avatarUrl + avatarPrefix" />
          <span class="username text-muted">
            评论了主题 <a :href="'/jotter/Article?id=' + comment.commentPost.id"> {{comment.commentPost.title}} </a>
            </span>
        </div>
        <h2>
          ==>"{{ comment.content }}"
        </h2>
        <span class="description"> {{comment.gmtCreate | dateFormatWithTime}} </span>
        <ul class="list-inline">
          <li @click="toPost(comment.commentPost.id)">
            <span class="link-black text-sm">
              <i class="el-icon-share" />
              前往帖子
            </span>
          </li>
          <li  @click="deleteComment(comment)">
            <span class="link-black text-sm">
              <i class="el-icon-delete"></i>
              删除评论
            </span>
          </li>
        </ul>
      </div>
      <div class="post" v-else-if="comment.type == 4">
        <div class="user-block">
          <img class="img-circle" :src="user.avatarUrl + avatarPrefix" />
          <span class="username text-muted">
            在主题 <a :href="'/jotter/Article?id=' + comment.commentPost.id"> {{comment.commentPost.title}} </a> 回复 <span style="color: blue;">{{comment.receiver.userName}}</span>
             的评论
            </span>
            <span style="font-size: 20px; color: gray;"> ==> {{comment.comment.content}}</span>
        </div>
        <p style="color: black; font-size: 25px;">
          ===> "{{ comment.content }}"
        </p>
        <span class="description"> {{comment.gmtCreate | dateFormatWithTime}} </span>
        <ul class="list-inline">
          <li @click="toPost(comment.commentPost.id)">
            <span class="link-black text-sm">
              <i class="el-icon-share" />
              前往帖子
            </span>
          </li>
          <li  @click="deleteComment(comment)">
            <span class="link-black text-sm">
              删除评论
            </span>
          </li>
        </ul>
      </div>
    </div>
    <el-row>
      <el-pagination
       @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="comments.length">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  props: {
    comments: {
      type: Array,
      required: true
    },
    user: {
      type: Object,
      default: () => {
        return {
          userName: '',
          mail: '',
          avatarUrl: '',
          sex: '',
          bio: ''
        }
      }
    }
  },
  methods: {
    toPost (postId) {
      this.$router.push({
        path: '/jotter/Article',
        query: {
          id: postId
        }
      })
    },
    toBook (bookId) {
      this.$router.push({
          path: '/library',
          query: {
            bookId: bookId
          }
        })
      },
    deleteComment (comment) {
    this.$axios.delete('/api/comment/' + comment.id).then(resp => {
      if (resp.data.success) {
        this.comments.splice(this.comments.indexOf(comment), 1)
        this.$message({
                 message: resp.data.message,
                 type: 'success'
        })
      } else {
        this.$message({
                  message: resp.data.message,
                  type: 'warning'
               })
      }
    })
    },
    handleCurrentChange (val) {
        this.currentPage = val
      }
  },
  data () {
    return {
      avatarPrefix,
      carouselPrefix,
      currentPage: 1,
        pagesize: 5
    }
  }
}
</script>

<style lang="scss" scoped>
.book-image {
  width: 70px;
  height: 70px;
}
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
