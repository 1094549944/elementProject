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
        <el-col :span="24">
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
    <!-- 弹框页面 -->
    <DialogFound :dialog='dialog'
                 :form='form'
                 @update="getProfile"></DialogFound>
  </div>
</template>

<script>
import api from '../../src/services/api'
import DialogFound from "../components/DialogFound"
import tool from '../services/tool'
// console.log(api)
export default {
  name: 'foundList',
  components: {
    DialogFound
  },
  data () {
    return {
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
        startTime: "",
        endTime: ""
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
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
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
        this.allTableData = res.data
        this.filterTableData = res.data
        //设置分页方法
        this.setPaginations()

      });
    },
    // 列表中编辑，删除的功能
    // 编辑
    onEditMoney (row) {
      // 编辑
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };
      this.form = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
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
          this.$message("删除成功");
          this.getProfile();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },

    /**
     * 头部筛选
     */

    // 筛选
    onScreeoutMoney () {
      // 筛选  判断是否选择了初始，结束的时间
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "请选择时间区间"
        });
        this.getProfile();
        return;
      }
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
      };
    },
    /**
     * 分页逻辑
     * 
     * allTableData：把所有的数据放在这里面
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
    //改变当前的页码
    handleSizeChange (page_size) {
      // 切换size
      this.paginations.page_index = tool.pageIndex;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    //设置分页
    setPaginations () {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = tool.pageIndex;
      this.paginations.page_size = tool.pageSize
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },

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
</style>
