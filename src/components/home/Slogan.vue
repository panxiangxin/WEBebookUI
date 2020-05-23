<template>
  <div>
    <el-card class="box-card">
      <el-container>
          <el-aside width="200px">
            <el-card>
              <div slot="header" class="clearfix">
                <span style="font-weight: bold;font-size: 18px">热门标签</span>
              </div>
              <div>
                <el-collapse v-model="activeName">
                  <el-collapse-item title="书籍标签" name="1">
                    <el-tag style="margin: 0 5px 5px 0" :key="bookTag.name" v-for="bookTag in bookTags" @click="bookTagClick(bookTag.name)">
                     <i class="iconfont icon-ebook-biaoqian"></i> {{ bookTag.name }}
                    </el-tag>
                  </el-collapse-item>
                  <el-collapse-item style="text-align: left" title="帖子标签" name="2">
                    <el-tag style="margin: 0 5px 0 0" :key="tag.name" v-for="tag in postTags" @click="postTagClick(tag.name)">
                     <i class="iconfont icon-ebook-biaoqian"></i> {{ tag.name }}
                    </el-tag>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-card>
          </el-aside>
      <el-main style="padding: 0 20px;">
         <el-card>
              <div slot="header" class="clearfix">
                <span style="font-weight: bold;font-size: 18px">公告</span>
              </div>
              <div class="block" style="height:450px">
               <el-carousel>
                  <el-carousel-item style="height:550px" v-for="item in announces" :key="item.id">
                    <h4>{{item.title}}</h4>
                     <mavon-editor
                        :value="item.content"
                        defaultOpen="preview"
                        :boxShadow="true"
                        :editable="false"
                        :subfield="false"
                        :toolbarsFlag="false"
                        style="max-height: 400px;"
                       >
                      </mavon-editor>
                  </el-carousel-item>
                </el-carousel>
               </div>
         </el-card>
      </el-main>
</el-container>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Slogan',
    data () {
      return {
        postTags: [],
        bookTags: [],
        announces: [],
        activeName: ['1', '2']
      }
    },
    created () {
      this.loadpostTags()
      this.loadBookTags()
      this.loadAnnounces()
    },
    methods: {
      bookTagClick (tagName) {
        this.$router.push({
          path: '/library',
          query: {
            tag: tagName
          }
        })
      },
      postTagClick (tagName) {
         this.$router.push({
        path: '/jotter',
        query: {
          tag: tagName
        }
      })
      },
      loadpostTags () {
        this.$axios.get('/api/post/hotTag').then(resp => {
          if (resp.data.success) {
            this.postTags = resp.data.data
          } else {
             this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      },
      loadBookTags () {
        this.$axios.get('/api/book/hotBookTag').then(resp => {
          if (resp.data.success) {
            console.log(resp.data.data)
            this.bookTags = resp.data.data
          } else {
             this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      },
      loadAnnounces () {
          this.$axios.get('/api/announce/list').then(resp => {
          if (resp.data.success) {
            console.log(resp.data.data)
            this.announces = resp.data.data
          } else {
             this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .box-card {
    width: 100%;
    text-align: center;
    margin-top: 5px;
  }

  .slogan {
    width: 100%;
  }

  .git-link {
    width: 80px;
    /*position: absolute;*/
  }

  .csdn-link {
    width: 65px;
    /*position: absolute;*/
    margin-bottom: 7px;
    margin-left: 20px;
  }
  .el-carousel__item h3 {
    /* color: #475669; */
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: white;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: white;
  }
</style>
