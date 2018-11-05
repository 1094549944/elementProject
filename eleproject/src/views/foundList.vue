<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true"
               ref="search_data"
               :model='search_data'>
        <el-form-item label="投标时间筛选:">
          <el-date-picker v-model="search_data.startTime"
                          type="datetime"
                          placeholder="选择开始时间">
          </el-date-picker> --
          <el-date-picker v-model="search_data.endTime"
                          type="datetime"
                          placeholder="选择结束时间">
          </el-date-picker>
          <span class="label">类型</span>
          <el-select v-model="search_data.value"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.label"
                       :label="item.label"
                       :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     icon="search"
                     @click='onScreeoutMoney()'>筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary"
                     size="small"
                     icon="view"
                     @click='onAddMoney()'>添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table v-if="tableData.length > 0"
                :data='tableData'
                max-height="700"
                border
                :default-sort="{prop: 'date', order: 'descending'}"
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         align='center'
                         width="70">
        </el-table-column>
        <el-table-column prop="date"
                         label="创建时间"
                         align='center'
                         width="250"
                         sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type"
                         label="收支类型"
                         align='center'
                         width="150">
        </el-table-column>
        <el-table-column prop="describe"
                         label="收支描述"
                         align='center'
                         width="180">
        </el-table-column>
        <el-table-column prop="income"
                         label="收入"
                         align='center'
                         width="170">
          <template slot-scope="scope">
            <span style="color:#00d053">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend"
                         label="支出"
                         align='center'
                         width="170">
          <template slot-scope="scope">
            <span style="color:#f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash"
                         label="账户现金"
                         align='center'
                         width="170">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注"
                         align='center'
                         width="220">
        </el-table-column>
        <el-table-column prop="operation"
                         align='center'
                         label="操作"
                         fixed="right"
                         width="180">
          <template slot-scope='scope'>
            <el-button type="warning"
                       icon='edit'
                       size="small"
                       @click='onEditMoney(scope.row)'>编辑</el-button>
            <el-button type="danger"
                       icon='delete'
                       size="small"
                       @click='onDeleteMoney(scope.row,scope.$index)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24"
                v-if="tableData.length > 0">
          <div class="pagination">
            <el-pagination :page-sizes="paginations.page_sizes"
                           :page-size="paginations.page_size"
                           :layout="paginations.layout"
                           :total="paginations.total"
                           :current-page.sync='paginations.page_index'
                           @current-change='handleCurrentChange'
                           @size-change='handleSizeChange'>
            </el-pagination>
          </div>
        </el-col>
      </el-row>

    </div>

    <div v-if="tableData.length <= 0"
         class="none-data">
      <el-row>
        <el-col :span="24">
          <div>
            <img src="../assets/logo.png"
                 alt="没有数据"
                 srcset="">
            <p>没有数据</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--
          弹框页面
          -->
    <DialogFound :dialog='dialog'
                 :form='form'
                 @update="getProfile"></DialogFound>
  </div>
</template>

<script>

import DialogFound from "../components/DialogFound"
import tool from '../services/tool'
export default {
  name: 'foundList',
  components: {
    DialogFound
  },
  data () {

    /**
     * 
     *  "提现",
        "提现手续费",
        "充值",
        "优惠券",
        "充值礼券",
        "转账"
     */
    return {
      options: [{
        value: '选项1',
        label: '提现'
      }, {
        value: '选项2',
        label: '提现手续费'
      }, {
        value: '选项3',
        label: '充值'
      }, {
        value: '选项4',
        label: '优惠券'
      }, {
        value: '选项5',
        label: '充值礼券'
      }, {
        value: '选项6',
        label: '转账'
      }],
      img: '',
      //弹出框
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      tableData: [],
      allTableData: [],
      filterTableData: [],
      //搜索
      search_data: {
        startTime: '',
        endTime: '',
        value: ''
      },
      //添加的表单
      form: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      //需要给分页组件传的信息
      paginations: tool.paginations
    }
  },
  created () {
    this.getProfile()
  },
  methods: {
    getProfile () {
      //获取表格数据 
      this.$axios("/api/profiles").then(res => {
        this.tableData = res.data
        this.allTableData = res.data// 所有的数据 但是会被改变
        this.filterTableData = res.data  //存储所有数据，不会被改变
        //设置分页方法
        this.setPaginations()

      })
    },
    // 列表中编辑，删除的功能
    // 编辑
    onEditMoney (row) {
      // 编辑
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      }
      this.form = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      }
    },
    // 删除
    onDeleteMoney (row, index) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$axios.delete(`/api/profiles/delete/${row._id}`).then(res => {
          console.log(res, index)
          this.$message("删除成功")
          this.getProfile()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    },

    // 添加
    onAddMoney () {
      for (let value in this.form) {
        this.form[value] = ''
      }
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      }
    },
    /**
     * 分页逻辑
     * 
     * allTableData：把所有的数据放在这里面
     * elemnet ui 的分页由前端来进行分页
     * 筛选条件，也是由前端对已有数据进行筛选,使用filter属性
     * 
     */


    handleCurrentChange (page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    //改变当前的页码 手动输入改变
    handleSizeChange (page_size) {
      // 切换size
      this.paginations.page_index = 1
      this.paginations.page_size = page_size
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size
      })
    },
    //设置分页
    setPaginations () {
      // 总页数
      this.paginations.total = this.allTableData.length //获取所有的条数的数量
      this.paginations.page_index = 1
      this.paginations.page_size = 5
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size
      })
    },
    onScreeoutMoney () {
      // 判断是否选择了日期

      let params = {}
      for (let key in this.search_data) {
        if (this.search_data[key]) {
          params[key] = this.search_data[key]
        }
      }

      let dataTablesGet = []
      // 过滤时间
      if (params.startTime && params.endTime) {
        const stime = params.startTime.getTime()
        const etime = params.endTime.getTime()
        // 过滤数据 
        dataTablesGet = this.filterTableData.filter(item => {
          let date = new Date(item.date)
          let time = date.getTime()
          // 所有的数据，要大于开始时间，小于结束时间
          return time >= stime && time <= etime
        })
      } else {
        dataTablesGet = this.filterTableData
      }

      if (params.value) {
        dataTablesGet = dataTablesGet.filter(item => {
          if (params.value == item.type) {
            return item
          }
        })
      }
      this.allTableData = dataTablesGet

      // 分页数据
      this.setPaginations()
    }
  }
}
</script>

<style scoped lang="stylus">
.fillcontain
  width 100%
  height 100%
  padding 16px
  box-sizing border-box

.btnRight
  float right

.pagination
  text-align right
  margin-top 10px

.none-data
  text-align center

.label
  padding 0 20px
</style>
