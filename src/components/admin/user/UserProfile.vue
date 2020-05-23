<template>
  <div>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogFormVisible">
      <el-form v-model="selectedUser" style="text-align: left" ref="dataForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <label>{{selectedUser.userName}}</label>
        </el-form-item>
        <el-form-item label="用户头像" label-width="120px" prop="userAvatar">
          <el-image class="avatar" :src="selectedUser.avatarUrl"></el-image>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" prop="sex">
          <el-input v-model="selectedUser.sex" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="年龄" label-width="120px" prop="sex">
          <el-input v-model="selectedUser.age" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="个人介绍" label-width="120px" prop="bio">
          <el-input v-model="selectedUser.bio" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="qq" label-width="120px" prop="mail">
          <el-input v-model="selectedUser.qq" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="mail">
          <el-input v-model="selectedUser.mail" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="积分" label-width="120px" prop="stamps">
          <el-input type="number" v-model="selectedUser.stamps" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-button type="warning" @click="resetPassword(selectedUser.id)">重置密码</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit(selectedUser)">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div>
        <search-bar style="" :tips="tips" @onSearch="searchResult" ref="searchBar"></search-bar>
    </div>
    <!-- <bulk-registration @onSubmit="listUsers()"></bulk-registration> -->
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table ref="userTable"
        :data="users.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        :default-sort = "{prop: 'id', order: 'ascending'}"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="id"
          sortable
          width="100">
        </el-table-column>
        <el-table-column
          label="用户头像"
          fit>
          <template slot-scope="scope">
              <el-image :src="scope.row.avatarUrl" class="avatar"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
          fit>
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          fit>
        </el-table-column>
        <el-table-column
          prop="mail"
          label="邮箱"
          show-overflow-tooltip
          fit>
        </el-table-column>
         <el-table-column
          prop="stamps"
          label="积分"
          sortable
          width="100">
        </el-table-column>
        <el-table-column
          label="管理者"
          sortable
          width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value= "1"
              :inactive-value= "0"
              @change="(value) => commitStatusChange(value, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click="editUser(scope.row)"
              type="text"
              size="small">
              编辑
            </el-button>
            <el-button
              @click="deleteUser(scope.row)"
              type="text"
              size="small">
              移除
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
          :total="users.length">
         </el-pagination>
      </el-row>
      <div style="margin: 20px 0 20px 0; float:left;">
        <el-button type="success" @click="toggleSelection()">取消选择</el-button>
        <el-button type="warning" @click="deleteUserBatch()">批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import BulkRegistration from './BulkRegistration'
  import SearchBar from '../../library/SearchBar'
    export default {
      name: 'UserProfile',
      components: {BulkRegistration, SearchBar},
      data () {
          return {
            users: [],
            dialogFormVisible: false,
            selectedUser: [],
            pageSize: 10,
            currentPage: 1,
            multipleSelection: [],
            tips: '根据名称搜索...'
          }
      },
      mounted () {
        this.listUsers()
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
            this.$refs.userTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.userTable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      searchResult () {
        var _this = this
        this.$axios
          .get('/api/admin/user?search=' + this.$refs.searchBar.keywords).then(resp => {
          if (resp && resp.data.success) {
            _this.users = resp.data.data
          }
        })
      },
      handleSizeChange (val) {
           this.pageSize = val
      },
      handleCurrentChange (val) {
        this.currentPage = val
      },
        listUsers () {
          var _this = this
          this.$axios.get('/api/admin/user').then(resp => {
            if (resp && resp.data.success) {
              console.log(resp.data.data)
              _this.users = resp.data.data
            }
          })
        },
        commitStatusChange (value, user) {
            this.$axios.put('/api/admin/user/status', this.$qs.stringify({
              status: value,
              userId: user.id
            })).then(resp => {
              if (resp && resp.data.success) {
                if (value) {
                  this.$message('用户 [' + user.userName + '] 已开启管理权限')
                } else {
                  this.$message('用户 [' + user.userName + '] 已禁用管理权限')
                }
              }
            })
        },
        onSubmit (user) {
          // 根据视图绑定的角色 id 向后端传送角色信息
          this.$axios.put('/api/admin/user', {
            id: user.id,
            username: user.userName,
            password: user.password,
            sex: user.sex,
            bio: user.bio,
            qq: user.qq,
            age: user.age,
            mail: user.mail,
            stamps: user.stamps,
            imageUrl: user.avatarUrl
          }).then(resp => {
            if (resp && resp.status === 200) {
              this.$alert('用户信息修改成功')
              this.dialogFormVisible = false
              // 修改角色后重新请求用户信息，实现视图更新
              this.listUsers()
            }
          })
        },
        editUser (user) {
          this.dialogFormVisible = true
          this.selectedUser = user
        },
        deleteUser (user) {
          const h = this.$createElement
          this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您将删除用户 '),
            h('span', {style: 'color: red'}, user.userName),
            h('span', null, ' 是否继续? ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '删除...'
               this.$axios.delete('/api/admin/user/' + user.id).then(resp => {
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
                this.updateUser()
                done()
               })
            } else {
              done()
            }
          }
        })
        },
        deleteUserBatch () {
            const h = this.$createElement
            var userList = []
            this.multipleSelection.forEach(user => {
              userList.push(user.id)
            })
            console.log(userList)
          this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您将删除 '),
            h('span', {style: 'color: red'}, userList.length),
            h('span', null, '个用户, 是否继续? ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '删除...'
               this.$axios.post('/api/admin/user/deleteUserBatch', this.$qs.stringify({
                 userList: userList
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
                this.updateUser()
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
        resetPassword (id) {
          this.$axios.put('/api/admin/user/password', this.$qs.stringify({
                 id: id
               })).then(resp => {
            if (resp && resp.data.success) {
              this.$alert('密码已重置为 1234')
              this.selectedUser.password = '1234'
          }
          })
        }
      }
    }
</script>

<style scoped>
.switch {
    display: flex;
    position: absolute;
    left: 780px;
    top: 25px;
  }
.avatar {
    width: 80px;
    height: 80px;
    border-radius:50%;
  }
</style>
