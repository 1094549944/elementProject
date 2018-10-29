const express = require('express')
const mongoose = require('mongoose')

const app = new express()
const bodyParser = require('body-parser')
const users = require('./routes/api/user.js')

//使用bodyparser  urlencoded 为了解决post的一个问题
// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//引入业务逻辑


//connet db

const db = require('./config/key').mongoURI
mongoose.connect(db).then(() => {
  console.log('链接成功')
}).catch(() => {
  console.log('链接失败')
})

app.get('/', (req, res) => {
  res.end('hello word')
})

//使用routes

app.use('/api/users', users)


const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server is running on port${port}`)
})