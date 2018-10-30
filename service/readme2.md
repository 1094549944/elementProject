# 接口返回状态说明
401：用户不能为空
402:邮箱格式不正确
403:密码格式不正确
404:用户不存在
405:密码错误
406:登录身份不正确
407:邮箱已被注册



# 用户接口：
## 注册
### post
### api/users/register
params:{
name
email
password
identity
}

# 登录
### post
### api/users/register
params:{
email
password
identity
}
# 获取用户信息

### post
### api/users/current
params:{

}


