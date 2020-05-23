import Vue from 'vue'
import Router from 'vue-router'
import AppIndex from '../components/home/AppIndex'
import Articles from '../components/jotter/Articles'
import Editor from '../components/admin/content/ArticleEditor'
import LibraryIndex from '../components/library/LibraryIndex'
import Login from '../components/Login'
import Home from '../components/Home'
import AdminIndex from '../components/admin/AdminIndex'
import Register from '../components/Register'
import DashBoard from '../components/admin/dashboard/admin/index'
import ArticleDetails from '../components/jotter/ArticleDetails'
import BookDetail from '../components/library/bookDetail.vue'
import alipay from '../components/common/Alipay.vue'
import invest from '../components/common/Invest.vue'
import profile from '../components/profile'
import PostArticles from '../components/jotter/PostArticle.vue'
import UserProfile from '../components/admin/user/UserProfile.vue'
import BookManagement from '../components/admin/content/BookManagement.vue'
import ArticleManagement from '../components/admin/content/ArticleManagement.vue'
import CommentManagement from '../components/admin/content/CommentManagement.vue'
import BookOrderManagement from '../components/admin/content/BookOrderManagement.vue'
import InvestOrderManagement from '../components/admin/content/InvestOrderManagement.vue'
import AnnounceManagement from '../components/admin/content/AnnounceManagement.vue'
import AnnounceEditor from '../components/admin/content/ArticleEditor.vue'
import store from '../store'
var axios = require('axios')
Vue.use(Router)
 const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Default',
      redirect: '/home',
      component: Home
    },
    {
      // home页面并不需要被访问，只是作为其它组件的父组件
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex
        },
        {
          path: '/profile',
          component: profile,
          redirect: '/profile/index',
          hidden: true,
          meta: {
            requireAuth: true,
            roles: ['user', 'admin']
          },
          children: [{
            path: 'index',
            component: () => import('@/components/profile/index'),
            name: 'Profile',
            meta: {
              title: 'Profile',
              icon: 'user',
              noCache: true
            }
          }]
        },
        {
          path: '/invest',
          name: 'Invest',
          component: invest
        },
        {
          path: '/alipay',
          name: 'alipay',
          component: alipay
        },
        {
          path: '/jotter',
          name: 'Jotter',
          component: Articles
        },
        {
          path: '/jotter/article',
          name: 'Article',
          component: ArticleDetails
        },
        {
          path: '/jotter/postArticle',
          name: 'PostArticle',
          component: PostArticles
        },
        {
          path: '/book',
          name: 'Book',
          component: BookDetail
        },
        {
          path: '/admin/content/editor',
          name: 'Editor',
          component: Editor,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/library',
          name: 'Library',
          component: LibraryIndex
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/admin/announce/editor',
      name: 'announceEditor',
      component: AnnounceEditor,
      meta: {
        requireAuth: true,
          roles: ['admin']
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminIndex,
      redirect: '/admin/userprofile',
      meta: {
        requireAuth: true,
        roles: ['admin']
      },
      children: [
        {
          path: '/admin/dashboard',
          name: 'dashboard',
          component: DashBoard,
          meta: {
            requireAuth: true,
            roles: ['admin']
          }
        },
        {
           path: '/admin/userprofile',
             name: 'userProfile',
             component: UserProfile,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
        },
         {
           path: '/admin/articleManagement',
           name: 'articleManagement',
           component: ArticleManagement,
           meta: {
             requireAuth: true,
             roles: ['admin']
           }
         },
          {
            path: '/admin/bookOrderManagement',
            name: 'bookOrderManagement',
            component: BookOrderManagement,
            meta: {
              requireAuth: true,
              roles: ['admin']
            }
          },
          {
            path: '/admin/investOrderManagement',
            name: 'investOrderManagement',
            component: InvestOrderManagement,
            meta: {
              requireAuth: true,
              roles: ['admin']
            }
          },
          {
            path: '/admin/commentManagement',
            name: 'CommentManagement',
            component: CommentManagement,
            meta: {
              requireAuth: true,
              roles: ['admin']
            }
          },
        {
          path: '/admin/bookManagement',
          name: 'bookManagement',
          component: BookManagement,
          meta: {
            requireAuth: true,
            roles: ['admin']
          }
        },
        {
          path: '/admin/announceManagement',
          name: 'announceManagement',
          component: AnnounceManagement,
          meta: {
            requireAuth: true,
            roles: ['admin']
          }
        }
      ]
    }
  ]
})
// 用于创建默认路由
export const createRouter = routes => new Router({
   mode: 'history',
     routes: [{
         path: '/',
         name: 'Default',
         redirect: '/home',
         component: Home
       },
       {
         // home页面并不需要被访问，只是作为其它组件的父组件
         path: '/home',
         name: 'Home',
         component: Home,
         redirect: '/index',
         children: [{
             path: '/index',
             name: 'AppIndex',
             component: AppIndex
           },
           {
             path: '/profile',
             component: profile,
             redirect: '/profile/index',
             hidden: true,
             meta: {
               requireAuth: true,
               roles: ['user', 'admin']
             },
             children: [{
               path: 'index',
               component: () => import('@/components/profile/index'),
               name: 'Profile',
               meta: {
                 title: 'Profile',
                 icon: 'user',
                 noCache: true
               }
             }]
           },
           {
             path: '/invest',
             name: 'Invest',
             component: invest
           },
           {
             path: '/alipay',
             name: 'alipay',
             component: alipay
           },
           {
             path: '/jotter',
             name: 'Jotter',
             component: Articles
           },
           {
             path: '/jotter/article',
             name: 'Article',
             component: ArticleDetails
           },
           {
             path: '/jotter/postArticle',
             name: 'PostArticle',
             component: PostArticles
           },
           {
             path: '/book',
             name: 'Book',
             component: BookDetail
           },
           {
             path: '/admin/content/editor',
             name: 'Editor',
             component: Editor,
             meta: {
               requireAuth: true
             }
           },
           {
             path: '/library',
             name: 'Library',
             component: LibraryIndex
           }
         ]
       },
       {
         path: '/login',
         name: 'Login',
         component: Login
       },
       {
         path: '/register',
         name: 'Register',
         component: Register
       },
       {
         path: '/admin/announce/editor',
         name: 'announceEditor',
         component: AnnounceEditor,
         meta: {
           requireAuth: true,
           roles: ['admin']
         }
       },
       {
         path: '/admin',
         name: 'Admin',
         component: AdminIndex,
         redirect: '/admin/userprofile',
         meta: {
           requireAuth: true,
           roles: ['admin']
         },
         children: [{
             path: '/admin/dashboard',
             name: 'dashboard',
             component: DashBoard,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
           },
           {
             path: '/admin/userprofile',
             name: 'userProfile',
             component: UserProfile,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
           },
           {
             path: '/admin/articleManagement',
             name: 'articleManagement',
             component: ArticleManagement,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
           },
           {
             path: '/admin/bookOrderManagement',
             name: 'bookOrderManagement',
             component: BookOrderManagement,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
           },
           {
             path: '/admin/investOrderManagement',
             name: 'investOrderManagement',
             component: InvestOrderManagement,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
           },
           {
             path: '/admin/commentManagement',
             name: 'CommentManagement',
             component: CommentManagement,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
           },
           {
             path: '/admin/bookManagement',
             name: 'bookManagement',
             component: BookManagement,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
           },
           {
             path: '/admin/announceManagement',
             name: 'announceManagement',
             component: AnnounceManagement,
             meta: {
               requireAuth: true,
               roles: ['admin']
             }
           }
         ]
       }
     ]
})
router.beforeEach((to, from, next) => {
  // 获取store里面的token
  let token = store.state.token
  // 判断要去的路由有没有requiresAuth
  if (to.meta.requireAuth) {
    if (token) {
      axios.get('/api/user/userRole').then(resp => {
          if (resp.data.success) {
            var role = resp.data.data
            console.log(role)
            if (to.meta.roles.includes(role)) {
              next()
            } else {
               alert('您没有这个权限', '提示', {
                 confirmButtonText: '确定'
               })
            }
          }
      })
    } else {
      next({
        path: 'login',
        query: {
          redirect: to.fullPath
        } // 将刚刚要去的路由path作为参数，方便登录成功后直接跳转到该路由
      })
    }
  } else {
    next()
  }
})

const formatRoutes = (routes) => {
  let fmtRoutes = []
  routes.forEach(route => {
    if (route.children) {
      route.children = formatRoutes(route.children)
    }

    let fmtRoute = {
      path: route.path,
      component: resolve => {
        require(['../components/admin/' + route.component + '.vue'], resolve)
      },
      name: route.name,
      nameZh: route.nameZh,
      iconCls: route.iconCls,
      meta: {
        requireAuth: true
      },
      children: route.children
    }
    fmtRoutes.push(fmtRoute)
  })
  return fmtRoutes
}
export default router
