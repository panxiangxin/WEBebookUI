<template>
  <el-card class="box-card">
    <ul class="message-box">
      <li>
        <h4>我要充值</h4>
      </li>
      <li>
        <h4 style="margin-bottom: 15px;">充值金额</h4>
        <el-radio-group v-model="amountVal" @change="amountChange">
          <el-radio border :label="'' + 100">充值100</el-radio>
          <el-radio border :label="'' + 500">充值500</el-radio>
          <el-radio border :label="'' + 1000">充值1000</el-radio>
          <el-radio border :label="'' + 2000">充值2000</el-radio>
          <el-radio border :label="'' + 5000">充值5000</el-radio>
          <el-radio border :label="''">自定义</el-radio>
        </el-radio-group>
      </li>
      <li>
        <h4 style="margin-bottom: 15px;">充值方式</h4>
        <el-radio-group
          v-model="rechargeParams.type"
          @change="typeChange"
        >
          <el-radio border :label="'' + 0">微信</el-radio>
          <el-radio border :label="'' + 1">支付宝</el-radio>
        </el-radio-group>
      </li>
      <li>
        <h4 style="margin-bottom: 15px;">充值金额</h4>
        <el-input
          :disabled="disabled"
          clearable
          v-model="rechargeParams.money"
          placeholder="请输入金额"
          style="width: 150px;"
        ></el-input>
      </li>
    </ul>
    <div style="text-align: center; margin-top: 30px;">
      <el-button type="primary" @click="surePay">确认支付</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      amountVal: '',
      disabled: false,
      // 充值参数
      rechargeParams: {
        money: '', // 金额
        type: '1', // 支付方式[2:微信,1:支付宝,3:余额,3:活动]
        transType: '1', // 交易类型[1:充值,2:消费]
        subject: 'ebook充值', // 交易主题
        userId: this.$store.state.user.id
      }
    }
  },
  methods: {
    // 充值金额
    amountChange (val) {
      this.rechargeParams.money = val
      if (val === '') {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 支付方式
    typeChange (val) {
      this.rechargeParams.type = val
    },
    // 确认支付
    async surePay () {
      if (this.rechargeParams.money === '') {
        this.$message.warning('请输入金额')
        return
      }
      console.log(this.$store.state.user)
      console.log(this.$store.state.user.id)
      const res = await this.$axios.post(
        '/api/alipay/go',
        this.rechargeParams
      )
      const { success, code, message, data } = res.data
      if (success) {
        // 支付方式跳转
        if (this.rechargeParams.type === '2') {
          this.$message.success('微信支付')
          this.wechatPay(data)
        } else if (this.rechargeParams.type === '1') {
          this.$message.success('支付宝支付')
          const payDiv = document.getElementById('payDiv')
          if (payDiv) {
            document.body.removeChild(payDiv)
          }
          const div = document.createElement('div')
          div.id = 'payDiv'
          div.innerHTML = data
          document.body.appendChild(div)
          document
            .getElementById('payDiv')
            .getElementsByTagName('form')[0]
            .submit()
        } else if (this.rechargeParams.type === '3') {
          this.$message.success('余额支付成功')
          this.$router.push({
            name: 'order'
          })
        } else {
          this.$message.success('活动支付')
        }
      } else if (code === 401) {
        this.$message.error(message)
        this.$router.push({
          name: 'login'
        })
      } else {
        this.$message.error(message)
      }
    },
    // 微信支付
    wechatPay (result) {
      if (result) {
        const orderParams = JSON.parse(result)
        sessionStorage.qrurl = orderParams.qrurl
        sessionStorage.amt = orderParams.amt
        sessionStorage.returnUrl = orderParams.returnUrl
        sessionStorage.order_id = orderParams.order_id
        this.$router.push({
          name: 'wechatPay'
        })
      }
    }
  }
}
</script>

<style scoped>
/* 信息列表样式 */
.message-box > li {
  list-style: none;
  border-bottom: 1px solid #c5c5c5;
  padding: 20px 10px;
}
</style>
