/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'echarts/theme/macarons.js'
import store from './store'
import qs from 'qs'

var axios = require('axios')
// 使请求带上凭证信息
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
// Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(mavonEditor)

// http request拦截器，为请求加上 token，测试用
axios.interceptors.request.use(
  config => {
    // 输出当前状态下的 token
    //  console.log('token: ', store.state.token)
    if (store.state.token) {
      // 判断当前是否存在token，如果存在的话，则每个http header都加上token
      // config.headers.Token = `token ${JSON.stringify(store.state.token)}`
      config.headers.Token = store.state.token
    } else {
      config.headers.Token = null
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data.code == 40004 || response.data.code == 40007){
      store.commit('logout')
    }else if(response.data.token){
      store.state.token = JSON.stringify(response.data.token)
      window.localStorage.setItem('token', JSON.stringify(data.token))
    }
    return response
  },
  error => {
    console.log(error.response)
    // 返回接口返回的错误信息
    return Promise.reject(error.response.data)
  })
// 将时间戳转日期格式的过滤器
Vue.filter('dateFormat', (dataStr) => {
  var time = new Date(dataStr)

  function timeAdd0(str) {
    if (str < 10) {
      str = '0' + str
    }
    return str
  }
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d)
})
// 将时间戳转日期格式的过滤器
Vue.filter('dateFormatWithTime', (dataStr) => {
  var time = new Date(dataStr)

  function timeAdd0(str) {
    if (str < 10) {
      str = '0' + str
    }
    return str
  }
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm)
})
//转换文件大小格式
Vue.filter('fileSizeFormat', (dataStr) => {
  if (dataStr === 0) return "0 B"
  var k = 1024
  var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  var i = Math.floor(Math.log(dataStr)/Math.log(k))
  return (dataStr / Math.pow(k, i)).toPrecision(3) + " " + sizes[i]
})
//首字母大写
Vue.filter('uppercaseFirst', (dataStr) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
})
Vue.prototype.updateUser = function () {
  this.$axios.get('/api/user/refresh').then(resp => {
    if(resp.data.success){
      this.$store.commit('login', resp.data.data)
    } else {
      this.$alert(resp.data.message, '提示', {
        confirmButtonText: '确定'
      })
    }
  }).catch(failResponse => {})
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: {App},
  template: '<App/>'
})
