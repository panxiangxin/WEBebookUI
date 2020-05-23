<template>
  <el-form ref="userForm" :model="user" :rules="rules">
    <el-upload
        ref="upload"
        class="avatar-uploader"
        action="none"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleChange">
      <img v-if="user.avatarUrl" :src="user.avatarUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon">头像</i>
    </el-upload>
    <el-form-item label="用户名" prop="userName">
      <el-input v-model.trim="user.userName"  disabled="true"/>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model.trim="user.age" />
    </el-form-item>
    <el-form-item label="邮箱" prop="mail">
      <el-input v-model.trim="user.mail" />
    </el-form-item>
    <el-form-item prop="sex">
      <el-radio-group v-model="user.sex">
        <el-radio label="男">男生</el-radio>
        <el-radio label="女">女生</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="个人介绍">
      <el-input v-model.trim="user.bio" />
    </el-form-item>
    <el-form-item label="qq" prop="qq">
      <el-input v-model.trim="user.qq" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model.trim="user.password" />
    </el-form-item>
    <el-form-item>
      积分： <span style="color: red;">{{user.stamps}}</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新信息</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isBtnOneToHundred, validateEMail, validateCode, isNum } from '../../../utils/validate'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          userName: '',
          mail: '',
          sex: '',
          bio: '',
          stamps: '',
          qq: '',
          password: '',
          id: ''
        }
      }
    }
  },
  data () {
    return {
        rules: {
          qq: [{ validator: isNum, trigger: 'blur' }],
          userName: [{required: true, message: '用户名不能为空', trigger: 'blur'}, {validator: validateCode, trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          sex: [{required: true, message: '性别不能为空', trigger: 'blur'}],
          age: [{required: true, message: '年龄不能为空', trigger: 'blur'}, {validator: isBtnOneToHundred, trigger: 'blur'}],
          mail: [{required: true, message: '邮箱不能为空', trigger: 'blur'}, {validator: validateEMail, meaage: '正确邮箱地址', trigger: 'blur'}]
        },
        checked: true,
        file: null
    }
  },
  methods: {
    submit () {
      var _this = this
        var loginData = new FormData()
        loginData.append('user', JSON.stringify(this.user))
        if (this.file !== null) {
          var imgSrc = this.file
        loginData.append('img', imgSrc)
        }
        var options = {
          url: '/api/user/update',
          data: loginData,
          method: 'post',
          contentType: false,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
         this.$refs.userForm.validate(valid => {
        if (valid) {
          this.$axios(options).then(resp => {
          if (resp.data.success) {
               this.$message({
                 message: resp.data.message,
                 type: 'success'
               }
               )
               console.log(resp.data.data)
               _this.$store.commit('refrshUser', resp.data.data)
             } else {
               this.$message({
                  message: resp.data.message,
                  type: 'warning'
               })
             }
        }).catch(failResponse => {})
        } else {
          console.log('error submit!!')
          return false
         }
       })
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
          this.user.avatarUrl = URL.createObjectURL(file.raw)
        }
  }
}
</script>
<style scoped>
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
    border-radius:50%;
    display: block;
  }
</style>
