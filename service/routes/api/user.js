const express = require('express')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const router = express.Router()
//引入user表
const User = require('../../models/User');

const tool = require('../../tool/index')
// $route get api/users/test
/**
 * @desc 返回的请求的json数据
 * @access public
 * 
 */
router.get('/test', (req, res) => {

  res.json({
    msg: 'hello login'
  })
})


// $route get api/users/register
/**
 * 注册
 * @desc 返回的请求的json数据
 * @access public
 * 
 */
router.post('/register', (req, res) => {
  //加一层判断
  if (!tool.validate(req.body.name, 'require')) {
    return res.status(401).json({ msg: '用户不能为空!' });
  }
  if (!tool.validate(req.body.email, 'email')) {
    return res.status(402).json({ msg: '邮箱格式不正确' })
  }

  // 查询数据库中是否拥有邮箱
  User.findOne({ email: req.body.email }).then(user => {

    if (user) {
      return res.status(400).json({ email: '邮箱已被注册!' });
    } else {
      // 没有被注册，那就注册

      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        identity: req.body.identity
      });
      //加密密码
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          //存储数据
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });

})







module.exports = router