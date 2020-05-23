<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>公告</el-breadcrumb-item>
        <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-link href="/admin/announce/editor" :underline="false" target="_blank" class="add-link">
      <el-button type="success">发布公告</el-button>
    </el-link>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="announces.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
                    :value="props.row.content"
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
        <el-table-column label="发布日期" width="200">
          <template slot-scope="props">
            <i class="el-icon-time"></i>
            <span>{{props.row.gmtCreate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editAnnounce(scope.row)" type="text" size="small">编辑</el-button>
            <el-button
              @click.native.prevent="deleteAnnounce(scope.row.id)"
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
        <el-button @click="deleteAnnounceBatch()">批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'announceManagement',
  data () {
    return {
      announces: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      multipleSelection: []
    }
  },
  mounted () {
    this.loadAnnounce()
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
    loadAnnounce () {
      var _this = this
      this.$axios.get('/api/announce/list').then(resp => {
        if (resp && resp.data.success) {
          _this.announces = resp.data.data
          console.log(_this.announces)
          _this.total = resp.data.data.length
        }
      })
    },
    handleCurrentChange (page) {
      this.currentPage = page
    },
    editAnnounce (announce) {
      this.$router.push({
           name: 'announceEditor',
         params: {
           announces: {
             id: announce.id,
             title: announce.title,
             content: announce.content
           }
         }
      })
    },
    deleteAnnounce (id) {
      this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete('/api/admin/announce/' + id).then(resp => {
            if (resp && resp.data.success) {
              this.loadAnnounce()
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
    deleteAnnounceBatch () {
      const h = this.$createElement
            var announceList = []
            this.multipleSelection.forEach(post => {
              announceList.push(post.id)
            })
            console.log(announceList)
          this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您将删除 '),
            h('span', {style: 'color: red'}, announceList.length),
            h('span', null, '个公告, 是否继续? ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '删除...'
               this.$axios.post('/api/admin/announce/deleteBatch', this.$qs.stringify({
                 announceList: announceList
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
                this.loadAnnounce()
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
