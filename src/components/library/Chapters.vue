<template>
  <div class="container">
    <h3>章节目录</h3>
    <div>
      <div v-for="o in chapterData.slice((currentPage-1)*pagesize,currentPage*pagesize)" :key="o" class="text item">
        {{ o }}
      </div>
      <el-pagination
       @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="chapterData.length">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    bookId: {
      required: true
    }
  },
  data () {
    return {
      chapterData: [],
      pagesize: 13,
      currentPage: 1
    }
  },
  mounted: function () {
    this.loadChapters()
  },
  methods: {
      handleCurrentChange (val) {
        this.currentPage = val
      },
    loadChapters () {
      this.$axios
        .get('/api/book/getChapters?bookId=' + this.bookId)
        .then(resp => {
          if (resp.data.success) {
            console.log(resp.data.data)
            this.chapterData = resp.data.data
          } else {
            this.$alert(resp.data.message, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
    }
  },
  created: function () {}
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
