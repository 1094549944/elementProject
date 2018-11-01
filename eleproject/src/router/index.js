import Vue from 'vue'
import Router from 'vue-router'
import routers from './router'
Vue.use(Router)
const router = new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  routes: routers
})
// 添加路由守卫
/**
 * 判断是否有eleToken，用来判断是否登录了
 * 
 */


router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  /** 
   * 判断是不是从login，或者register 页面，如果是那么继续，
   * 如果不是，那么判断isLogin是否存在
   * 如果存在那么继续，如果不存在，那么跳转到login
   * 
  */
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
})

export default router