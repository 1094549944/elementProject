const Test = () =>
  import( /* webpackChunkName: "test" */ '@/views/test')

//业务相关
/**
 * 注册
 */
const Register = () =>
  import( /* webpackChunkName: "register" */ '@/views/register')
const Login = () => import( /* webpackChunkName: "login" */ '@/views/login')

/** 
 * 错误页面
*/
const Error404 = () => import( /* webpackChunkName: "404Error" */ '@/views/404')

const Index = () =>
  import( /* webpackChunkName: "index" */ '@/views/index')

const InfoShow = () =>
  import( /* webpackChunkName: "infoShow" */ '@/views/infoShow')
const router = [{
  path: '/test',
  name: Test,
  component: Test,
}, {
  path: '/register',
  name: Register,
  component: Register
}, {
  path: '/login',
  name: Login,
  component: Login
}, {
  path: '/index',
  name: Index,
  component: Index
}, {
  path: '/infoshow',
  name: InfoShow,
  component: InfoShow
}, {
  path: '*',
  name: Error404,
  component: Error404
}]
export default router