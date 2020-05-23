<template>
  <div class="app-container" style="margin-top: 25px;">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user"/>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="我的评论" name="activity">
                <myComment :comments="comments" :user="this.user"/>
              </el-tab-pane>
              <el-tab-pane label="我的通知" name="notification">
                <notification :notification="notification" :user="this.user"/>
              </el-tab-pane>
              <el-tab-pane label="发布主题" name="timeline">
                <timeline :posts="posts" />
              </el-tab-pane>
              <el-tab-pane label="个人信息" name="account">
                <account :user="user" />
              </el-tab-pane>
               <el-tab-pane label="我的图书" name="mybook">
                <myBook :user="user" :books="books"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import MyComment from './components/MyComment'
import Timeline from './components/Timeline'
import Account from './components/Account'
import Notification from './components/Notification'
import MyBook from './components/MyBook'

export default {
  name: 'Profile',
  components: { UserCard, MyComment, Timeline, Account, Notification, MyBook },
  data () {
    return {
      user: {},
      activeTab: 'activity',
      comments: [],
      books: [],
      notification: [],
      posts: []
    }
  },
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
  created () {
    this.getUser()
    this.getComment()
    this.getBooks()
    this.getNotification()
    this.getPosts()
  },
  mounted () {
    this.getParams()
  },
  methods: {
    getUser () {
      this.user = {
        id: this.id,
        userName: this.userName,
        mail: this.mail,
        avatarUrl: this.avatarUrl,
        sex: this.sex,
        bio: this.bio,
        qq: this.qq,
        age: this.age,
        password: this.password,
        stamps: this.stamps
      }
    },
     getComment () {
      this.$axios.get('/api/comment/user/' + this.id).then(resp => {
        if (resp.data.success) {
            this.comments = resp.data.data
            console.log(this.comments)
        } else {
              this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
            }
      }).catch(failResponse => {})
    },
    getBooks () {
      this.$axios.get('/api/user/getUserBook/' + this.id).then(resp => {
        if (resp.data.success) {
          this.books = resp.data.data
        } else {
          this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
        }
      }).catch(failResponse => {})
    },
    getNotification () {
       this.$axios.get('/api/notify/get').then(resp => {
        if (resp.data.success) {
          this.notification = resp.data.data
        } else {
          this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
        }
      }).catch(failResponse => {})
    },
    getPosts () {
      this.$axios.get('/api/post/getUserPost').then(resp => {
        if (resp.data.success) {
          this.posts = resp.data.data
          console.log('post: ', this.posts)
        } else {
          this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
        }
      }).catch(failResponse => {})
    },
    getParams () {
        const tag = this.$route.query.tag
        if (tag === null || tag === undefined) {
          return
        }
        this.activeTab = tag
      }
    }
}
</script>
<style scoped>

</style>
