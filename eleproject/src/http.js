import axios from 'axios'
import { Message, Loading } from 'element-ui';
import router from './router'

let loading        //定义loading变量

function startLoading () {    //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading () {    //使用Element loading-close 方法
  loading.close()
}

// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
  // 加载
  startLoading()
  //判断是否登录了，如果登录了，那么设置请求头。
  if (localStorage.eleToken)
    config.headers.Authorization = localStorage.eleToken
  return config

  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
  endLoading()
  return response
}, error => {
  // 错误提醒
  endLoading()
  console.log(error)
  Message.error(error.response.data)

  const { status } = error.response

  // 判断是否失效了，如果token 过期，那么就要重新登录了
  if (status == 401) {
    Message.error('token值无效，请重新登录')
    // 清除token
    localStorage.removeItem('eleToken')

    // 页面跳转
    router.push('/login')
  }
  return Promise.reject(error)
})

export default axios