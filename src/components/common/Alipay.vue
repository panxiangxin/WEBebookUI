<template>
    <div v-html='html'></div>
</template>

<script>
  export default {
    data () {
      return {
        html: ''
      }
    },
    methods: {
      fetchVideoPay () {
          this.$axios.get('/api/alipay/go').then(resp => {
              console.log(resp.data.data)
            this.html = resp.data.data
            console.log('this.html: ', this.html)
            this.$nextTick(() => {
            document.forms[0].submit()
          })
          })
      }
    },
    mounted () {
      this.fetchVideoPay()
    }
  }
</script>
