<template>
  <div>
    <div v-if="show == 1">
      <el-row style="height: 840px;">
        <search-bar @onSearch="searchResult" :tips="tips" ref="searchBar"></search-bar>
        <view-switch class="switch"></view-switch>
        <el-tooltip
          effect="dark"
          placement="right"
          v-for="item in books.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          :key="item.id"
        >
          <p slot="content" style="font-size: 14px;margin-bottom: 6px;">{{item.bookName}}</p>
          <p slot="content" style="font-size: 13px;margin-bottom: 6px">
            <span>{{item.author}}</span> /
            <span>{{item.date | dateFormat}}</span>
          </p>
          <p slot="content" style="width: 300px" class="abstract">{{item.bio}}</p>
          <el-card
            style="width: 135px;margin-bottom: 20px;height: 233px;float: left;margin-right: 15px"
            class="book"
            bodyStyle="padding:10px"
            shadow="hover"
            @click.native="bookDetail(item.id)"
          >
            <div class="cover">
              <img :src="item.imgUrl" alt="封面" />
            </div>
            <div class="info">
              <div class="title">
                <a href>{{item.bookName}}</a>
              </div>
            </div>
            <div class="author">{{item.author}}</div>
          </el-card>
        </el-tooltip>
      </el-row>
      <el-row>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pagesize"
          :total="books.length"
        ></el-pagination>
      </el-row>
    </div>
    <book ref="book" v-else></book>
  </div>
</template>

<script>
import SearchBar from '../../library/SearchBar'
import ViewSwitch from '../../library/ViewSwitch'
import Book from '../../library/bookDetail'

export default {
  name: 'Books',
  components: { SearchBar, ViewSwitch, Book },
  props: {
    books: {
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
  data () {
    return {
      currentPage: 1,
      pagesize: 18,
      show: 1,
      tips: '根据名称以及作者搜索...'
    }
  },
  mounted: function () {
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    searchResult () {
      var _this = this
      this.$axios
        .post('/search', {
          keywords: this.$refs.searchBar.keywords
        })
        .then(resp => {
          if (resp && resp.status === 200) {
            _this.books = resp.data
          }
        })
    },
    bookDetail (id) {
      // this.show = 0
      // var _this = this
      // this.$axios.get('/api/book/getBook?bookId=' + id).then(resp => {
      //   if (resp && resp.data.success) {
      //     _this.$refs.book.book = resp.data.data
      //   }
      // })
      var _this = this
      _this.$router.push({
        path: '/library',
        query: {
          bookId: id
        }
      })
    }
  }
}
</script>
<style scoped>
.cover {
  width: 115px;
  height: 172px;
  margin-bottom: 7px;
  overflow: hidden;
  cursor: pointer;
}

img {
  width: 115px;
  height: 172px;
  /*margin: 0 auto;*/
}

.title {
  font-size: 14px;
  text-align: left;
}

.author {
  color: #333;
  width: 102px;
  font-size: 13px;
  margin-bottom: 6px;
  text-align: left;
}

.abstract {
  display: block;
  line-height: 17px;
}

.el-icon-delete {
  cursor: pointer;
  float: right;
}

.switch {
  display: flex;
  position: absolute;
  left: 780px;
  top: 25px;
}

a {
  text-decoration: none;
}

a:link,
a:visited,
a:focus {
  color: #3377aa;
}
</style>
