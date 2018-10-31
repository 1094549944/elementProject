const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const users = require('./routes/api/user.js')
const profiles = require('./routes/api/profiles')
const app = new express()


// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connet db

const db = require('./config/key').mongoURI
mongoose.connect(db).then(() => {
  console.log('链接成功')
}).catch(() => {
  console.log('链接失败')
})
//passport 初始化
app.use(passport.initialize());
require('./config/passport')(passport);

app.get('/', (req, res) => {
  res.end('hello word')
})

//使用routes
app.use('/api/users', users)
app.use('/api/profiles', profiles)


const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server is running on port${port}`)
})