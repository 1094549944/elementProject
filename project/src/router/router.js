const test = () =>
  import( /* webpackChunkName: "test" */ '@/views/test')

//业务相关
/**
 * 注册
 */
const register = () =>
  import( /* webpackChunkName: "register" */ '@/views/register')

const router = [{
  path: '/test',
  component: test,
}, {
  path: '/register',
  component: register
}]
module.exports = router