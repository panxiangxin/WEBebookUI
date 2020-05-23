<template>
  <el-container>
    <el-aside style="width: 200px;margin-top: 20px">
      <switch></switch>
      <SideMenu @indexSelect="listByCategory" ref="sideMenu"></SideMenu>
    </el-aside>
    <el-main>
      <books class="books-area" ref="booksArea"></books>
    </el-main>
  </el-container>
</template>

<script>
  import SideMenu from './SideMenu'
  import Books from './Books'

  export default {
    name: 'AppLibrary',
    components: {Books, SideMenu},
    created () {
    },
    mounted () {
      this.getParams()
    },
    methods: {
       getParams () {
        const tag = this.$route.query.tag
        if (tag === null || tag === undefined) {
          return
        }
        var url = '/api/book/books?tags=' + tag
        this.$axios.get(url).then(resp => {
           if (resp && resp.data.success) {
             this.$refs.booksArea.show = 1
             this.$refs.sideMenu.cid = tag
             this.$refs.booksArea.books = resp.data.data
             console.log(resp.data.data)
           }
         })
      },
      listByCategory () {
         var _this = this
         var cid = this.$refs.sideMenu.cid
         var url = '/api/book/books?tags=' + cid
         this.$axios.get(url).then(resp => {
           if (resp && resp.data.success) {
             _this.$refs.booksArea.show = 1
             _this.$refs.booksArea.books = resp.data.data
           }
         })
      }
    }
  }
</script>

<style scoped>
  .books-area {
    width: 990px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
