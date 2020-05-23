<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>订单</el-breadcrumb-item>
        <el-breadcrumb-item>充值订单</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="InvestOrders.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        ref="bookTable"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item v-if="props.row.user !== null">
                <h6>{{ props.row.user.userName }}</h6>
                <h>{{props.row.user.stamps}}</h>
              </el-form-item>
              <el-form-item v-else>
                  <span>该用户已被删除</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="订单编号"
          width="180">
        </el-table-column>
        <el-table-column
          label="用户（展开查看摘要）"
          fit>
          <template slot-scope="scope">
              <span v-if="scope.row.user === null">该用户已被删除</span>
              <span v-else>{{scope.row.user.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="secondId"
          label="第三方交易号"
          width="180">
        </el-table-column>
        <el-table-column
          label="充值方式"
          :filters="[{text: '阿里支付',value: 1},{text: '微信支付',value: 2}]"
          :filter-method="filterTag"
          width="100">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.channel === 1">阿里支付 </el-tag>
              <el-tag v-else> 微信支付 </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          width="120">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.gmtCreate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="消费金额"
          sortable
          fit>
        </el-table-column>
          <el-table-column
          prop="money"
          label="充值积分"
          sortable
          fit>
        </el-table-column>
         <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteBookOrder(scope.row.id)"
              type="text"
              size="small"
            >删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="padding-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="InvestOrders.length">
         </el-pagination>
      </el-row>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button @click="toggleSelection()">取消选择</el-button>
        <el-button @click="deleteBookOrderBatch()">批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'InvestOrderManagement',
    data () {
      return {
        InvestOrders: [],
        pageSize: 5,
        currentPage: 1,
        multipleSelection: []
      }
    },
    mounted () {
      this.loadInvestOrders()
    },
    computed: {
      tableHeight () {
        return window.innerHeight - 320
      }
    },
    methods: {
        filterTag (value, row) {
            return row.channel === value
        },
      deleteBookOrder (id) {
          this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        })
        .then(() => {
          this.$axios.delete('/api/admin/stampsOrder/' + id).then(resp => {
            if (resp && resp.data.success) {
              this.loadInvestOrders()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      deleteBookOrderBatch () {
        const h = this.$createElement
            var stampsOrders = []
            this.multipleSelection.forEach(post => {
              stampsOrders.push(post.id)
            })
            console.log(stampsOrders)
          this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您将删除 '),
            h('span', {style: 'color: red'}, stampsOrders.length),
            h('span', null, '个充值订单, 是否继续? ')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '删除...'
               this.$axios.post('/api/admin/investOrder/deleteInvestOrderPatch', this.$qs.stringify({
                 stampsOrders: stampsOrders
               }, {arrayFormat: 'brackets'})).then(resp => {
                if (resp.data.success) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                } else {
                  this.$message({
                    type: 'warning',
                    message: resp.data.message
                  })
                }
                instance.confirmButtonLoading = false
                this.loadInvestOrders()
                done()
               }).catch(failResponse => {
                 instance.confirmButtonLoading = false
                 this.$message({
                    type: 'warning',
                    message: '操作失败！'
                  })
                  done()
               })
            } else {
              done()
            }
          }
        })
    },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.userTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.bookTable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
           this.pageSize = val
      },
      handleCurrentChange (val) {
        this.currentPage = val
      },
      loadInvestOrders () {
        var _this = this
        this.$axios.get('/api/admin/investOrder').then(resp => {
          if (resp && resp.data.success) {
             console.log(resp.data.data)
            _this.InvestOrders = resp.data.data
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
