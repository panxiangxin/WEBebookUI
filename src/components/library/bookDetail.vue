<template>
  <div class="articles-area">
    <el-card style="text-align: left;width: 990px;margin: 35px auto 0 auto">
      <div>
        <el-row :gutter="20">
          <el-col :span="18"
            ><div class="grid-content">
              <el-row :gutter="20">
                <el-col :span="8"
                  ><div class="grid-content">
                    <img :src="book.imgUrl" class="image" /></div
                ></el-col>
                <el-col :span="16"
                  ><div class="grid-content">
                    <h3 class="book-title">{{ book.bookName }}</h3>
                    <span class="book-author"
                      >{{ book.author }} | {{ book.date | dateFormat }}</span
                    >
                    <el-tag :key="tag" v-for="tag in book.tags.split(',')">
                      {{ tag }}
                    </el-tag>
                    <div class="markdown-body">
                      <div v-html="book.bio"></div>
                    </div></div
                ></el-col>
              </el-row>
              <hr />
              <chapters :bookId="book.id"></chapters>
              <hr />
              <comment :topId="book.id" :types="1"></comment></div>
              </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-card class="buy-area">
                <div slot="header" class="clearfix">
                  <span>{{book.bookName}}</span>
                 <el-button v-if="!book.hasBought" @click="bookBuy" style="float: right; padding: 3px 0" type="text"
                    ><span class="icon-font icon-ebook-goumai"></span>
                    购买</el-button>
                  <el-button v-else @click="downLoad" style="float: right; padding: 3px 0" type="text">
                    <i class="el-icon-download">下载</i>
                  </el-button>
                </div>
                <div class="text item">
                  <span>所需积分： {{book.bookStamps}}</span>
                </div>
                <div class="text item">
                  <span>书籍大小： {{book.bookSize | fileSizeFormat }}</span>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import comment from '../common/comment.vue'
import chapters from '../library/Chapters.vue'
export default {
  name: 'BookDetail',
  components: {
    comment,
    chapters
  },
  data () {
    return {
      book: []
    }
  },
  created () {},
  computed: {
    ...mapGetters([
      'userName',
      'avatarUrl',
      'mail',
      'sex',
      'bio',
      'password',
      'qq',
      'stamps',
      'age',
      'id'
    ])
  },
  methods: {
    bookBuy () {
      const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您将花费 '),
            h('span', {style: 'color: red'}, this.book.bookStamps),
            h('span', null, ' 积分购买此书。您现在的积分为： '),
            h('span', {style: 'color: red'}, this.stamps),
            h('span', null, ' 是否继续? ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if (this.stamps < this.book.bookStamps) {
                this.$message({
                  type: 'info',
                  message: '积分不足！无法购买！'
                })
                return
              }
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '购买...'
               this.$axios.post('/api/book/buy', this.$qs.stringify({
                 bookId: this.book.id,
                 userId: this.id
               })).then(resp => {
                if (resp.data.success) {
                  this.$message({
                    type: 'success',
                    message: '购买成功!'
                  })
                  this.book.hasBought = true
                } else {
                  this.$message({
                    type: 'warning',
                    message: resp.data.message
                  })
                }
                instance.confirmButtonLoading = false
                this.updateUser()
                done()
               })
            } else {
              done()
            }
          }
        })
    },
    downLoad () {
      this.$axios.get('/api/book/download?userId=' + this.id + '&bookId=' + this.book.id, {responseType: 'arraybuffer'}).then(resp => {
        let url = window.URL.createObjectURL(new Blob([resp.data]))// new Blob([data])用来创建URL的file对象或者blob对象
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.download = this.book.bookName + '.txt'
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>

<style scoped>
.buy-area {
  -webkit-box-shadow: none;
  box-shadow: none;
  /* border: none; */
}
.el-tag + .el-tag {
  margin: 0 10px 10px 10px;
}
.book-tags {
  padding-bottom: 12px;
}
.book-title {
  font-size: 20px;
}
.book-author {
  padding: 0 0 12px 0;
  color: #9c9c9c;
  display: block;
  font-size: 14px;
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
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  float: left;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
@import "../../styles/markdown.css";
</style>
