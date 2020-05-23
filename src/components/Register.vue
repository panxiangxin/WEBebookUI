<template>
  <body id="paper">
  <el-form :model="loginForm" ref="loginForm" :rules="rules" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">用户注册</h3>
    <el-upload
        ref="upload"
        class="avatar-uploader"
        action="none"
        :show-file-list="false"
        :auto-upload="false"

        :on-change="handleChange">
      <img v-if="loginForm.imageUrl" :src="loginForm.imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon">头像</i>
    </el-upload>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username"
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
     <el-form-item prop="sex">
    <el-radio-group v-model="loginForm.sex">
      <el-radio label="男"></el-radio>
      <el-radio label="女"></el-radio>
    </el-radio-group>
  </el-form-item>
   <el-form-item prop="age">
    <el-input v-model.number="loginForm.age" placeholder="年龄" auto-complete="off"></el-input>
  </el-form-item>
    <el-form-item prop="email">
      <el-input type="text" v-model="loginForm.email"
                auto-complete="off" placeholder="E-Mail"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 40%;background: #505458;border: none" v-on:click="register">注册</el-button>
    </el-form-item>
  </el-form>
  </body>
</template>
<script>
import { isBtnOneToHundred, validateEMail, validateCode } from '../utils/validate'
  export default{
    data () {
      return {
        rules: {
          username: [{required: true, message: '用户名不能为空', trigger: 'blur'}, {validator: validateCode, trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          sex: [{required: true, message: '性别不能为空', trigger: 'blur'}],
          age: [{required: true, message: '年龄不能为空', trigger: 'blur'}, {validator: isBtnOneToHundred, trigger: 'blur'}],
          email: [{required: true, message: '邮箱不能为空', trigger: 'blur'}, {validator: validateEMail, meaage: '正确邮箱地址', trigger: 'blur'}]
        },
        checked: true,
        loginForm: {
          username: '',
          password: '',
          sex: '',
          age: '',
          email: '',
          imageUrl: null
        },
        loading: false,
        file: null
      }
    },
    methods: {
      register () {
        var _this = this
        var loginData = new FormData()
        var imgSrc = this.file
        loginData.append('user', JSON.stringify(this.loginForm))
        loginData.append('img', imgSrc)
        var options = {
          url: '/api/user/register',
          data: loginData,
          method: 'post',
          contentType: false,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
         this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$axios(options).then(resp => {
          if (resp.data.success) {
               this.$alert(resp.data.message, '提示', {
                 confirmButtonText: '确定'
               })
               _this.clearCookie()
               _this.$router.replace('/login')
             } else {
               this.$alert(resp.data.message, '提示', {
                 confirmButtonText: '确定'
               })
             }
        }).catch(failResponse => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
      },
      setCookie (c_name, c_pwd, exdays) {
                var exdate = new Date() // 获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
                // 字符串拼接cookie
                window.document.cookie = 'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
                window.document.cookie = 'userPwd' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
            },
      clearCookie: function () {
                this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
            },
      handleChange (file) {
          Object.defineProperty(file.raw, 'name', {
            // 通过修改原型中的name
            writable: true
          })
             // 图片路径
            let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
          const extension = testmsg === 'jpg'
          const extension2 = testmsg === 'png'
          const isLt10M = file.size / 1024 / 1024 < 10
          if (!extension && !extension2) {
            this.$message.warning('上传文件只能是 jpg、png格式!')
            return false
          }
          if (!isLt10M) {
            this.$message.warning('上传头像图片大小不能超过 10MB!')
            return false
          }
          this.file = file.raw
          this.loginForm.imageUrl = URL.createObjectURL(file.raw)
        }
    }
  }
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
  }
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
    margin: 33px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 16px auto;
    text-align: center;
    color: #505458;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
