import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? null : JSON.parse(window.localStorage.getItem('user' || '[]')).id,
      userName: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? null : JSON.parse(window.localStorage.getItem('user' || '[]')).userName,
      avatarUrl: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? null : JSON.parse(window.localStorage.getItem('user' || '[]')).avatarUrl,
      password: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).password,
      sex: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).sex,
      status: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? 0 : JSON.parse(window.localStorage.getItem('user' || '[]')).status,
      age: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).age,
      mail: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).mail,
      bio: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).bio,
      qq: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).qq,
      stamps: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).stamps,
      unReadCount: window.localStorage.getItem('user') == null || window.localStorage.getItem('user') === 'undefined' ? 0 : JSON.parse(window.localStorage.getItem('user' || '[]')).unReadCount
    },
    adminMenus: [],
    token: window.localStorage.getItem('token') == null || window.localStorage.getItem('user') === undefined ? null : window.localStorage.getItem('token' || '[]')
  },
  mutations: {
    initAdminMenu (state, menus) {
      state.adminMenus = menus
    },
    login (state, data) {
      state.user = data.user
      state.token = data.token
      window.localStorage.setItem('user', JSON.stringify(data.user))
      window.localStorage.setItem('token', JSON.stringify(data.token))
    },
    refrshUser (state, data) {
      state.user = data.user
      state.token = data.token
      window.localStorage.setItem('user', JSON.stringify(data.user))
    },
    logout (state) {
      // 注意不能用 null 清除，否则将无法判断 user 里具体的内容
      state.user = []
      state.token = null
      window.localStorage.removeItem('user')
      window.localStorage.removeItem('token')
      state.adminMenus = []
    }
  },
  actions: {
  },
  getters: {
      id: state => state.user.id,
      userName: state => state.user.userName,
      age: state => state.user.age,
      avatarUrl: state => state.user.avatarUrl,
      status: state => state.user.status,
      sex: state => state.user.sex,
      token: state => state.token,
      mail: state => state.user.mail,
      bio: state => state.user.bio,
      qq: state => state.user.qq,
      password: state => state.user.password,
      stamps: state => state.user.stamps,
      unReadCount: state => state.user.unReadCount,
      user: state => state.user
  }
})
