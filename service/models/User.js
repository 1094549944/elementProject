const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 姓名： name
 * 邮箱：email
 * 密码：password
 * 头像：avatar
 * 身份证：identity 管理员 员工
 * 创建时间：date
 * 
 * 
 */

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  identity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('users', UserSchema)
