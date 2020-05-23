<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>图书管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <edit-form @onSubmit="loadBooks()" ref="edit"></edit-form>
    <search-bar style="" @onSearch="searchResult"  :tips="tips" ref="searchBar"></search-bar>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="books.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        ref="bookTable"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item>
                <span>{{ props.row.bio }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="书名（展开查看摘要）"
          fit>
        </el-table-column>
        <el-table-column
          label="封面"
          width="100">
          <template slot-scope="scope">
            <el-image :src="scope.row.imgUrl"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="tags"
          label="分类"
          width="100">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          fit>
        </el-table-column>
        <el-table-column
          label="出版日期"
          width="100">
          <template slot-scope="scope">
            <span>{{scope.row.date | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="书籍大小"
          width="100">
          <template slot-scope="scope">
            <span>{{scope.row.bookSize | fileSizeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bookStamps"
          label="积分"
          sortable
          fit>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editBook(scope.row)"
              type="text"
              size="small">
              编辑
            </el-button>
            <el-button
              @click.native.prevent="deleteBook(scope.row.id)"
              type="text"
              size="small">
              移除
            </el-button>
            <el-button  @click.native.prevent="download(scope.row)"
            type="text"
            size="small">
             下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="padding-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="books.length">
         </el-pagination>
      </el-row>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button @click="toggleSelection()">取消选择</el-button>
        <el-button @click="deleteBookBatch()">批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import EditForm from './EditForm'
  import SearchBar from '../../library/SearchBar'
  export default {
    name: 'BookManagement',
    components: {EditForm, SearchBar},
    data () {
      return {
        books: [],
        pageSize: 10,
        currentPage: 1,
        multipleSelection: [],
        tips: '根据书名以及作者搜索...'
      }
    },
    mounted () {
      this.loadBooks()
    },
    computed: {
      tableHeight () {
        return window.innerHeight - 320
      }
    },
    methods: {
      download (row) {
        this.$axios.get('/api/admin/book/download?bookId=' + row.id, {responseType: 'arraybuffer'}).then(resp => {
          let url = window.URL.createObjectURL(new Blob([resp.data]))// new Blob([data])用来创建URL的file对象或者blob对象
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.download = row.bookName + '.txt'
          document.body.appendChild(link)
          link.click()
        })
      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.userTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.bookTable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      searchResult () {
        var _this = this
        this.$axios
          .get('/api/admin/book?search=' + this.$refs.searchBar.keywords).then(resp => {
          if (resp && resp.data.success) {
            _this.books = resp.data.data
          }
        })
      },
      handleSizeChange (val) {
           this.pageSize = val
      },
      handleCurrentChange (val) {
        this.currentPage = val
      },
      deleteBook (id) {
        this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios
              .delete('/api/admin/book/' + id).then(resp => {
              if (resp && resp.data.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.loadBooks()
              }
            })
          }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      deleteBookBatch () {
            const h = this.$createElement
            var bookList = []
            this.multipleSelection.forEach(user => {
              bookList.push(user.id)
            })
            console.log(bookList)
          this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您将删除 '),
            h('span', {style: 'color: red'}, bookList.length),
            h('span', null, '本书籍, 是否继续? ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '删除...'
               this.$axios.post('/api/admin/book/deleteBookBatch', this.$qs.stringify({
                 bookList: bookList
               }, {arrayFormat: 'brackets'})).then(resp => {
                if (resp.data.success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                } else {
                  this.message({
                    type: 'warning',
                    message: resp.data.message
                  })
                }
                instance.confirmButtonLoading = false
                this.loadBooks()
                done()
               }).catch(failResponse => {
                 instance.confirmButtonLoading = false
                 this.message({
                    type: 'warning',
                    message: '操作失败！'
                  })
               })
            } else {
              done()
            }
          }
        })
      },
      editBook (item) {
        this.$refs.edit.dialogFormVisible = true
        this.$refs.edit.form = {
          id: item.id,
          imgUrl: item.imgUrl,
          bookName: item.bookName,
          author: item.author,
          date: item.date,
          bookStamps: item.bookStamps,
          tags: item.tags,
          bookSize: item.bookSize,
          bio: item.bio,
          bookUrl: item.bookUrl
        }
        this.$refs.edit.fileList = [({name: item.bookName, url: item.bookUrl})]
      },
      loadBooks () {
        var _this = this
        this.$axios.get('/api/admin/book').then(resp => {
          if (resp && resp.data.success) {
             console.log(resp.data.data)
            _this.books = resp.data.data
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
