const test = () =>
  import( /* webpackChunkName: "test" */ '@/views/test')

//业务相关
/**
 * 注册
 */
const register = () =>
  import( /* webpackChunkName: "register" */ '@/views/register')


/** 
 * 错误页面
*/
const Error404 = () => import( /* webpackChunkName: "404Error" */ '@/views/404')


const router = [{
  path: '/test',
  name: test,
  component: test,
}, {
  path: '/register',
  name: register,
  component: register
}, {
  path: '*',
  name: Error404,
  component: Error404
}]
module.exports = router