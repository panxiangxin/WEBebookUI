<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>帖子</el-breadcrumb-item>
        <el-breadcrumb-item>帖子管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <search-bar style="" @onSearch="searchResult" :tips="tips" ref="searchBar"></search-bar>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="articles.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
                <div class="markdown-body">
                  <mavon-editor
                    :value="props.row.description"
                    defaultOpen="preview"
                    :boxShadow="false"
                    :editable="false"
                    :subfield="false"
                    :toolbarsFlag="false"
                  ></mavon-editor>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题（展开查看内容）" fit></el-table-column>
        <el-table-column label="发帖人" fit>
          <template slot-scope="props">
            <el-popover trigger="hover" placement="top">
              <el-image :src="props.row.user.avatarUrl" class="avatar"></el-image>
              <p>
                姓名: {{ props.row.user.userName }}
                <span
                  :class="props.row.user.sex == '男'? ' iconfont icon-ebook-nansheng':'iconfont icon-ebook-nvsheng'"
                ></span>
              </p>
              <p>积分: {{ props.row.user.stamps}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ props.row.user.userName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="标签"
          fit
          :filters="filterTags"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              class="post-tag"
              v-for="eachTag in tagTrim(scope.row.tag)"
              :key="eachTag"
              :type="scope.row.tag !== '家' ? 'primary' : 'success'"
              disable-transitions
            >{{eachTag }}</el-tag>
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
            <el-button @click.native.prevent="viewArticle(scope.row.id)" type="text" size="small">查看</el-button>
            <el-button @click.native.prevent="editArticle(scope.row)" type="text" size="small">编辑</el-button>
            <el-button
              @click.native.prevent="deleteArticle(scope.row.id)"
              type="text"
              size="small"
            >移除</el-button>
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
        <el-button @click="deletePostBatch()">批量删除</el-button>
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
      articles: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      filterTags: [],
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
            _this.articles = resp.data.data
          }
        })
    },
    loadFilter () {
      var posts = this.articles
      var postTags = []
      for (var i = 0; i < posts.length; i++) {
        var tag = this.tagTrim(posts[i].tag)
        for (var j = 0; j < tag.length; j++) {
          if (postTags.indexOf(tag[j]) === -1) {
            postTags.push(tag[j])
          }
        }
      }
      var filterTag = []
      for (i = 0; i < postTags.length; i++) {
        var item = { text: postTags[i], value: postTags[i] }
        filterTag.push(item)
      }
      this.filterTags = filterTag
    },
    tagTrim (tag) {
      let tags = tag.split(',')
      for (var i = 0; i < tags.length; i++) {
        if (tags[i] === '') {
          tags.splice(i, 1)
          i = i - 1
        }
      }
      return tags
    },
    filterTag (value, row) {
      var tags = this.tagTrim(row.tag)
      return tags.indexOf(value) !== -1
    },
    loadArticles () {
      var _this = this
      this.$axios.get('/api/admin/post').then(resp => {
        if (resp && resp.status === 200) {
          _this.articles = resp.data.data
          console.log(_this.articles)
          _this.total = resp.data.data.length
          this.loadFilter()
        }
      })
    },
    handleCurrentChange (page) {
      this.currentPage = page
    },
    viewArticle (id) {
      let articleUrl = this.$router.resolve({
        path: '../../jotter/article',
        query: {
          id: id
        }
      })
      window.open(articleUrl.href, '_blank')
    },
    editArticle (article) {
      this.$router.push({
        name: 'PostArticle',
        params: {
          postForm: {
            id: article.id,
            title: article.title,
            description: article.description,
            tags: article.tag
          }
        }
      })
    },
    deleteArticle (id) {
      this.$confirm('此操作将永久删除该帖子, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete('/api/post/' + id).then(resp => {
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
    deletePostBatch () {
      const h = this.$createElement
            var postList = []
            this.multipleSelection.forEach(post => {
              postList.push(post.id)
            })
            console.log(postList)
          this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您将删除 '),
            h('span', {style: 'color: red'}, postList.length),
            h('span', null, '个帖子, 是否继续? ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '删除...'
               this.$axios.post('/api/admin/post/deletePostBatch', this.$qs.stringify({
                 postList: postList
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
