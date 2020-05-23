<template>
  <body id="paper">
    <el-form :model="loginForm" ref="loginForm" :rules="rules" class="login-container" label-position="left"
             label-width="0px" v-loading="loading">
      <h3 class="login_title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username"
                  auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" @keyup.enter.native="login(loginForm)"
                  auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox class="login_remember" v-model="checked"
                   label-position="left"><span style="color: #505458">记住密码</span></el-checkbox>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 40%;background: #505458;border: none" v-on:click="login(loginForm)">登录</el-button>
        <router-link to="register"><el-button type="primary" style="width: 40%;background: #505458;border: none">注册</el-button></router-link>
      </el-form-item>
    </el-form>
  </body>
</template>
<script>
  export default{
    data () {
      return {
        rules: {
          username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
        },
        checked: true,
        loginForm: {
          username: '',
          password: ''
        },
        loading: false
      }
    },
    created () {
      this.getCookie()
      var _this = this
      document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (key === 13) {
        _this.login(_this.loginForm)
      }
    }
    },
    methods: {
      // 设置cookie
            setCookie (c_name, c_pwd, exdays) {
                var exdate = new Date() // 获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
                // 字符串拼接cookie
                window.document.cookie = 'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
                window.document.cookie = 'userPwd' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
            },
            // 读取cookie
            getCookie: function () {
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('=') // 再次切割
                        // 判断查找相对应的值
                        if (arr2[0] === 'userName') {
                            this.loginForm.username = arr2[1] // 保存到保存数据的地方
                        } else if (arr2[0] === 'userPwd') {
                            this.loginForm.password = arr2[1]
                        }
                    }
                }
            },
            // 清除cookie
            clearCookie: function () {
                this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
            },
      login (form) {
        var _this = this
        this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (_this.checked === true) {
            // 传入账号名 密码 以及过期时间 三个参数
            _this.setCookie(_this.loginForm.username, _this.loginForm.password, 7)
          } else {
            // 清空Cookie
            _this.clearCookie()
          }
          this.$axios.post('/api/user/login', {
            userName: this.loginForm.username,
            password: this.loginForm.password
          })
          .then(resp => {
            if (resp.data.success) {
              var data = resp.data.data
              _this.$store.commit('login', data)
              var path = _this.$route.query.redirect
              _this.$router.replace({path: path === '/' || path === undefined ? '/index' : path})
            } else {
              this.$alert(resp.data.message, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
          .catch(failResponse => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
      }
      }
    }
</script>
<style>
   #paper {
    background:url("../assets/img/bg/eva1.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
   body{
     margin: -5px 0px;
   }
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
  /*.login_button {*/
    /*background: #505458;*/
  /*}*/
  /*el_checkbox {*/
    /*background: #505458;*/
  /*}*/
</style>
