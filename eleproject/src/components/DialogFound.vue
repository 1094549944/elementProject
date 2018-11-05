<!-- 编辑，添加弹出框-->
<template>
  <div class="logFund">
    <el-dialog :title="dialog.title"
               :visible.sync="dialog.show"
               :close-on-click-modal='false'
               :close-on-press-escape='false'
               :modal-append-to-body="false">
      <div class="form">
        <el-form ref="form"
                 :model="form"
                 :rules="form_rules"
                 label-width="120px"
                 style="margin:10px;width:auto;">

          <el-form-item label="收支类型:">
            <el-select v-model="form.type"
                       placeholder="收支类型">
              <el-option v-for="(formtype, index) in format_type_list"
                         :key="index"
                         :label="formtype"
                         :value="formtype"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop='describe'
                        label="收支描述:">
            <el-input type="describe"
                      v-model="form.describe"></el-input>
          </el-form-item>

          <el-form-item prop='income'
                        label="收入:">
            <el-input type="income"
                      v-model="form.income"></el-input>
          </el-form-item>

          <el-form-item prop='expend'
                        label="支出:">
            <el-input type="expend"
                      v-model="form.expend"></el-input>
          </el-form-item>

          <el-form-item prop='cash'
                        label="账户现金:">
            <el-input type="cash"
                      v-model="form.cash"></el-input>
          </el-form-item>

          <el-form-item label="备注:">
            <el-input type="textarea"
                      v-model="form.remark"></el-input>
          </el-form-item>

          <el-form-item class="text_right">
            <el-button @click="dialog.show = false">取 消</el-button>
            <el-button type="primary"
                       @click='onSubmit("form")'>提 交</el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'logfound',
  props: {
    dialog: Object,
    form: Object
  },
  data () {
    let priceNum = /^([1-9]\d*|0)(\.\d{0,2})?$/ /*有2位小数*/
    //自定义验证规则
    var validateIncome = (rule, value, callback) => {
      if (!priceNum.test(value)) {
        callback(new Error('收入输入的格式不正确，是数字，且最多有2位小数'));
      } else {
        callback()
      }
    }

    var validateExpend = (rule, value, callback) => {
      if (!priceNum.test(value)) {
        callback(new Error('指出输入的格式不正确，是数字，且最多有2位小数'));
      } else {
        callback()
      }
    }
    return {
      //收支类型 选择
      format_type_list: [
        "提现",
        "提现手续费",
        "充值",
        "优惠券",
        "充值礼券",
        "转账"
      ],
      //表单验证规则
      form_rules: {
        describe: [
          { required: true, message: "收支描述不能为空！", trigger: "blur" }
        ],
        income: [
          { required: true, validator: validateIncome, trigger: "blur" }
        ],
        expend: [
          { required: true, validator: validateExpend, trigger: "blur" }
        ]

      }
    }
  },
  methods: {
    onSubmit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          // 表单数据验证完成之后，提交数据;
          let url = this.dialog.option == "add" ? "add" : 'edit/' + this.form.id
          this.$axios.post('/api/profiles/' + url, this.form).then((res) => {
            console.log(res)
            // 操作成功
            this.$message({
              message: res.data.msg,
              type: "success"
            })
            this.dialog.show = false;
            this.$emit("update")
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>