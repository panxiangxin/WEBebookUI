<template>
  <div>
    <el-menu
      :default-active="path"
      router
      mode="horizontal"
      background-color="white"
      text-color="#222"
      active-text-color="red"
      style="min-width: 1300px">
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name" v-show="!(item.name === '/admin' && (token===null || user.status === null || user.status === 0))">
        {{ item.navItem }}
      </el-menu-item>
      <el-submenu v-if="user.userName != null" index="user" style="float: right">
      <template slot="title">{{user.userName}}</template>
      <el-menu-item index="/profile">
        <span class="iconfont icon-ebook-profile"></span>
        个人中心</el-menu-item>
      <el-menu-item>
        <span class="iconfont icon-ebook-qianbao"></span>
        钱包： {{user.stamps}}
      </el-menu-item>
      <el-menu-item index="/invest">
      <span class="iconfont icon-ebook-chongzhi"></span>
                      充值
      </el-menu-item>
      <el-menu-item index="/profile?tag=notification">
      <span class="iconfont icon-ebook-huifu"></span>
      回复
      <el-badge class="mark" :value="user.unReadCount" v-show="user.unReadCount != null && user.unReadCount != 0"/>
      </el-menu-item>
      <el-menu-item @click="logout()">
        <span class="iconfont icon-ebook-zhuxiao"></span>
        注销</el-menu-item>
  </el-submenu>
      <el-menu-item v-else index="/login" style="float: right">
        用户登录
      </el-menu-item>
      <a v-show="user != null " href="#"><img :src='user.avatarUrl == null ? imageUrl:user.avatarUrl' style=" width:40px;height:40px;float:right;font-size: 35px;color: #222;padding-top: 12px"></a>
      <span style="position: absolute;padding-top: 20px;right: 43%;font-size: 20px;font-weight: bold">EBook Store Your Time Retired</span>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'NavMenu',
    data () {
      return {
        navList: [
          {name: '/index', navItem: '首页'},
          {name: '/jotter', navItem: '图书讨论'},
          {name: '/library', navItem: '图书馆'},
          {name: '/admin', navItem: '后台管理'}
        ],
        keywords: '',
        path: '',
        imageUrl: '../../../static/img/carousel/默认头像 (1).png'
      }
    },
    mounted: function () {
      // 获得第一级路由，以设置导航栏高亮
      var x = this.$route.path.indexOf('/', 1)
      if (x !== -1) {
        this.path = this.$route.path.substring(0, x)
      } else {
        this.path = this.$route.path
      }
    },
    computed: {
      ...mapGetters([
     'user',
     'token'
    ]),
      hoverBackground () {
        return '#ffd04b'
      },
      userChange () {
        return this.$store.state.user
      },
      tokenChange () {
        return this.$store.state.token
      }
    },
    created () {
      console.log(this.user)
    },
    watch: {
      userChange (newval, oldVal) {
        this.user = newval
      }
    },
    methods: {
      handleCommand (command) {
        this.$message('click on item ' + command)
      },
      logout () {
        this.$store.commit('logout')
        this.$router.replace('/index')
      }
    }
  }
</script>

<style scoped>
  a{
    text-decoration: none;
  }

  span {
    pointer-events: none;
  }

</style>
