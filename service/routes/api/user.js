const express = require('express')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const router = express.Router()
const keys = require('../../config/key')
//引入user表
const User = require('../../models/User')
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


// $route post api/users/register
/**
 * 注册
 * @desc 返回的请求的json数据
 * @access public
 * 
 */
router.post('/register', (req, res) => {
  console.log('添加新用户')
  //加一层判断
  if (!tool.validate(req.body.name, 'require')) {
    return res.status(401).json({ code: 401, msg: '用户不能为空!' });
  }
  if (!tool.validate(req.body.email, 'email')) {
    return res.status(200).json({ code: 402, msg: '邮箱格式不正确' })
  }
  if (!tool.validate(req.body.password, 'require')) {
    return res.status(200).json({ code: 403, msg: '密码格式不正确' })
  }
  if (!tool.validate(req.body.identity, 'require')) {
    return res.status(200).json({ code: 406, msg: '登录身份不正确' })
  }
  // 查询数据库中是否拥有邮箱
  User.findOne({ email: req.body.email }).then(user => {

    if (user) {
      return res.status(200).json({ code: 408, msg: '邮箱已被注册!' });
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
            .then(user => res.json({
              code: 0,
              msg: '注册成功',
              data: {
                user
              }
            }))
            .catch(err => console.log(err));
        });
      });
    }
  });

})

/**
 * 登录功能
 * 
 * 
 */
router.post('/login', (req, res) => {
  const email = req.body.email || ''
  const password = req.body.password || ''
  const identity = req.body.identity || ''
  if (!tool.validate(password, 'require')) {
    return res.status(200).json({ code: 403, msg: '密码格式不正确!' });
  }
  if (!tool.validate(email, 'email')) {
    return res.status(200).json({ code: 402, msg: '邮箱格式不正确' })
  }
  // if (!tool.validate(identity, 'require')) {
  //   return res.status(200).json({ code: 406, msg: '登录身份不正确' })
  // }
  //查询数据库
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json('用户不存在')
    }
    // 存在，进行密码匹配 
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity
        }
        //jwt 生成token  设置到期时间：expiresIn:3600
        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err
          res.json({
            code: 0,
            data: {
              token: 'Bearer ' + token,
            },
            msg: '成功生成token'
          })
        })
      } else {
        return res.status(200).json({ code: 405, msg: '密码错误' })
      }
    })
  })


})


// 用户已经拿到了token，用户需要请求的一些信息
/**
 * @router GET api/users/current
 * @desc return current user 获取用户当前信息
 * @access Private
 * 
 * 验证token
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {

  res.status(200).json({
    code: 0,
    status: 200,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity
    }
  });
})




module.exports = router