/**
 * 验证规则
 * 
 * 
 */

var tool = {
  //验证规则
  validate: (value, type) => {
    value = value.trim()
    //非空判断
    if ('require' === type) {
      return !!value
    }
    //邮箱格式验证
    if ('email' === type) {
      return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
    }
    //手机号验证
    if ('phone' === type) {
      return /^1\d{10}$/.test(value)
    }
  }
}

module.exports = tool