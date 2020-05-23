<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of posts" :key="index" :timestamp="item.gmtCreate | dateFormatWithTime" placement="top">
        <el-card>
          <router-link class="post-title" :to="{path:'/jotter/Article',query:{id: item.id}}"><h4>{{ item.title }}</h4></router-link>
           <span class="text-desc">
            <span>{{item.commentCount}}个回复• </span>
            <span>{{item.viewCount}}次浏览• </span>
            <span>{{item.gmtCreate | dateFormatWithTime}}</span>
            </span>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      required: true
    },
  data () {
    return {
    }
  }
}
}
</script>
<style scoped>
  .post-title {
    color: black;
    text-decoration: none;
  }
 .text-desc {
    display: block;
    padding-top: 14px;
     font-size: 12px;
    font-weight: normal;
    color: #999;
  }
</style>
