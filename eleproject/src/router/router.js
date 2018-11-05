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
const Home = () => import( /* webpackChunkName: "home" */ '@/views/home')
const FoundList = () => import( /* webpackChunkName: "foundList" */ '@/views/foundList')
const router = [{
  path: '/test',
  name: Test,
  component: Test,
}, {
  path: '',
  name: Index,
  component: Index,
  children: [{
    path: '/',
    component: Home
  }]
}, {
  path: '/register',
  name: Register,
  component: Register
}, {
  path: '/login',
  name: Login,
  component: Login
},
{
  path: '/index',
  name: Index,
  component: Index,
  children: [{
    path: '',
    component: Home
  }, {
    path: 'infoshow',
    name: 'infoshow',
    component: InfoShow
  }, {
    path: 'home',
    name: 'home',
    component: Home
  }, {
    path: 'foundList',
    name: 'foundList',
    component: FoundList
  }]
}, {
  path: '*',
  name: Error404,
  component: Error404
}]
export default router