<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>评论</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <search-bar style="" @onSearch="searchResult" :tips="tips" ref="searchBar"></search-bar>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="comments.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        ref="postTable"
        style="width: 100%"
        :max-height="tableHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item>
                <p>{{props.row.content}}</p>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="评论人" fit>
          <template slot-scope="props">
            <el-popover trigger="hover" placement="top">
              <el-image :src="props.row.commentUser.avatarUrl" class="avatar"></el-image>
              <p>
                姓名: {{ props.row.commentUser.userName }}
                <span
                  :class="props.row.commentUser.sex == '男'? ' iconfont icon-ebook-nansheng':'iconfont icon-ebook-nvsheng'"
                ></span>
              </p>
              <p>积分: {{ props.row.commentUser.stamps}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ props.row.commentUser.userName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="回复主题或者帖子" fit>
            <template slot-scope="props">
            <el-popover v-if="props.row.type == 1 || props.row.type == 2" trigger="hover" placement="top">
              <el-image :src="props.row.commentBook.imgUrl" class="avatar"></el-image>
              <p>
                {{ props.row.commentBook.bookName }}
              </p>
              <p>积分: {{ props.row.commentBook.bookStamps}}</p>
              <p v-if="props.row.type == 2">回复评论: {{props.row.comment.content}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ props.row.commentBook.bookName }}</el-tag>
              </div>
            </el-popover>
             <el-popover v-if="props.row.type == 3 || props.row.type == 4" trigger="hover" placement="top">
              <p>
                {{ props.row.commentPost.title }}
              </p>
              <p>标签: {{ props.row.commentPost.tag}}</p>
              <p v-if="props.row.type == 4">回复评论: {{ props.row.comment.content}} </p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ props.row.commentPost.title }}</el-tag>
              </div>
            </el-popover>
            </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="类型"
          fit
          :filters="filterTags"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              disable-transitions
            >
            {{filterTags[scope.row.type - 1].text}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布日期" width="200">
          <template slot-scope="props">
            <i class="el-icon-time"></i>
            <span>{{props.row.gmtCreate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click.native.prevent="viewArticle(scope.row)" type="text" size="small">查看主题</el-button>
            <el-button
              @click.native.prevent="deleteArticle(scope.row.id)"
              type="text"
              size="small"
            >删除评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0 50px 0">
        <el-pagination
          background
          style="float:right;"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :total="total"
        ></el-pagination>
      </div>
       <div style="margin: 20px 0 20px 0;float: left">
        <el-button @click="toggleSelection()">取消选择</el-button>
        <el-button @click="deleteCommentPost()">批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import SearchBar from '../../library/SearchBar'
export default {
  name: 'ArticleManagement',
  components: {SearchBar},
  data () {
    return {
      comments: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      filterTags: [{text: '评论图书', value: 1},
      {text: '评论图书评论', value: 2},
      {text: '评论主题', value: 3},
      {text: '评论主题评论', value: 4}],
      multipleSelection: [],
      tips: '根据标题或者标签搜索...'
    }
  },
  mounted () {
    this.loadArticles()
  },
  computed: {
    tableHeight () {
      return window.innerHeight - 320
    }
  },
  methods: {
    filterTag (value, row) {
      console.log(value)
      return row.type === value
    },
    toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.postTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.postTable.clearSelection()
        }
      },
    handleSelectionChange (val) {
        this.multipleSelection = val
      },
    searchResult () {
        var _this = this
        this.$axios
          .get('/api/admin/post?search=' + this.$refs.searchBar.keywords).then(resp => {
          if (resp && resp.data.success) {
            _this.comments = resp.data.data
          }
        })
        },
    loadArticles () {
      var _this = this
      this.$axios.get('/api/admin/comment').then(resp => {
        if (resp && resp.data.success) {
          _this.comments = resp.data.data
          console.log(_this.comments)
          _this.total = resp.data.data.length
        }
      })
     },
    handleCurrentChange (page) {
      this.currentPage = page
     },
    viewArticle (row) {
      if (row.type === 1 || row.type === 2) {
        /* 电子书评论 */
      let bookUrl = this.$router.resolve({
        path: '/library',
        query: {
          bookId: row.commentBook.id
        }
      })
      window.open(bookUrl.href, '_blank')
      }
      if (row.type === 3 || row.type === 4) {
      let articleUrl = this.$router.resolve({
        path: '../../jotter/article',
        query: {
          id: row.commentPost.id
        }
      })
      window.open(articleUrl.href, '_blank')
      }
     },
    deleteArticle (id) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete('/api/comment/' + id).then(resp => {
            if (resp && resp.data.success) {
              this.loadArticles()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteCommentPost () {
      const h = this.$createElement
            var commentList = []
            this.multipleSelection.forEach(comment => {
              commentList.push(comment.id)
            })
            console.log(commentList)
          this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您将删除 '),
            h('span', {style: 'color: red'}, commentList.length),
            h('span', null, '个评论, 是否继续? ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '删除...'
               this.$axios.post('/api/admin/comment/deleteCommentPost', this.$qs.stringify({
                 commentList: commentList
               }, {arrayFormat: 'brackets'})).then(resp => {
                if (resp.data.success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                } else {
                  this.$message({
                    type: 'warning',
                    message: resp.data.message
                  })
                }
                instance.confirmButtonLoading = false
                this.loadArticles()
                done()
               }).catch(failResponse => {
                 instance.confirmButtonLoading = false
                 this.$message({
                    type: 'warning',
                    message: '操作失败！'
                  })
                  done()
               })
            } else {
              done()
            }
          }
        })
    }
  }
}
</script>

<style scoped>
.post-tag {
  display: contents;
}
.add-link {
  margin: 18px 0 15px 10px;
  float: left;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>
