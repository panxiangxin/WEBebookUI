<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>

  import NavMenu from '@/components/common/NavMenu'

  export default {
    name: 'App',
    components: {NavMenu},
    methods: {
      updateTrueOrNot () {
        console.log('herf: ', window.location.href)
        var href = window.location.href
        var params = href.split('?')
        console.log(params)
        if (params === null) {
            return false
        }
        return true
      }
    },
    created () {
    },
    mounted () {
      this.updateUser()
    }
  }
</script>

<style>
@import "./assets/icon/iconfont.css";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 10px;*/
  }
</style>
