<template>
  <el-menu
    :default-active="currentPath"
    class="el-menu-admin"
    router
    mode="vertical"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="isCollapse">
    <div style="height: 80px;"></div>
      <!--index 没有用但是必需字段-->
      <el-submenu style="text-align: left"  :index="1">
        <span slot="title" style="font-size: 17px;">
          <i class="el-icon-s-custom"></i>
          用户
        </span>
        <el-menu-item active index="/admin/userprofile">
          <i class="child.icon"></i>
          用户信息
        </el-menu-item>
      </el-submenu>
       <el-submenu style="text-align: left" :index="2">
        <span slot="title" style="font-size: 17px;">
          <i class="el-icon-reading"></i>
          电子书
        </span>
        <el-menu-item index="/admin/bookManagement">
          <i class="child.icon"></i>
          电子书信息
        </el-menu-item>
      </el-submenu>
      <el-submenu style="text-align: left" :index="3">
        <span slot="title" style="font-size: 17px;">
          <i class="el-icon-guide"></i>
          公告
        </span>
        <el-menu-item index="/admin/announceManagement">
          <i class="child.icon"></i>
          公告信息
        </el-menu-item>
      </el-submenu>
      <el-submenu style="text-align: left" :index="4">
        <span slot="title" style="font-size: 17px;">
          <i class="el-icon-goods"></i>
          订单
        </span>
        <el-menu-item index="/admin/bookOrderManagement">
          <i class="child.icon"></i>
          购买订单
        </el-menu-item>
        <el-menu-item index="/admin/investOrderManagement">
          <i class="child.icon"></i>
          充值订单
        </el-menu-item>
      </el-submenu>
       <el-submenu style="text-align: left" :index="5">
        <span slot="title" style="font-size: 17px;">
          <i class="el-icon-postcard"></i>
          帖子
        </span>
        <el-menu-item index="/admin/articleManagement">
          <i class="child.icon"></i>
          帖子信息
        </el-menu-item>
      </el-submenu>
       <el-submenu style="text-align: left" :index="6">
        <span slot="title" style="font-size: 17px;">
          <i class="el-icon-message"></i>
          评论
        </span>
        <el-menu-item index="/admin/commentManagement">
          <i class="child.icon"></i>
          评论管理
        </el-menu-item>
      </el-submenu>
  </el-menu>
</template>

<script>
    export default {
      name: 'AdminMenu',
      data () {
        return {
          isCollapse: false
        }
      },
      computed: {
        adminMenus () {
          return this.$store.state.adminMenus
        },
        currentPath () {
          console.log(this.$route.path)
          return this.$route.path
        }
      }
    }
</script>

<style scoped>
  .el-menu-admin {
    border-radius: 5px;
    height: 100%;
  }
</style>
