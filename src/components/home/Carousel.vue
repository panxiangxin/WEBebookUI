<template>
  <el-card>
   <span style="font-weight: bold;font-size: 20px">热销电子书</span>
  <el-carousel type="card" class="push" :interval="4000" arrow="always">
    <el-carousel-item  v-for="item in items" :key="item.id">
      <a :href="'/library?bookId=' + item.id" target="_blank">
        <img :src=item.imgUrl alt="" class="carousel_img">
      </a>
      <h3>{{item.bio}}</h3>
    </el-carousel-item>
  </el-carousel>
  </el-card>
</template>

<style>
  .el-carousel__item h3 {
    color: black;
    font-size: 15px;
    /*line-height: 300px;*/
    bottom: 43px;
    float: left;
    position: relative;
  }

  .card-carousel {
    /*margin: 0 auto;*/
    margin-left: 20px;
    width: 680px;
    height: 320px;
  }

  .el-carousel__item:nth-child(2n) {
    background: black;
  }

  .el-carousel__item:nth-child(2n+1) {
    background: black;
  }

  .carousel_img {
    height: 100%;
    width: 100%;
    text-align: center;
  }
</style>

<script>
  export default {
    name: 'Carousel',
    data: function () {
      return {
        items: []
      }
    },
    created () {
      this.hotBooks()
    },
    methods: {
      hotBooks () {
        this.$axios.get('/api/book/hotBook').then(resp => {
          if (resp.data.success) {
             this.items = resp.data.data
          } else {
            this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
          }
        }).catch(failResponse => {})
      }
    }
  }
</script>
