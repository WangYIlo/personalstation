import axios from "axios";
import store from '@/store'
import router from '@/router'

//创建自定义axios方法--对axios进行二次封装
const request = axios.create({
  //配置基础路径
  baseURL: 'http://127.0.0.1:3007',
  //请求超时5s
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  //config： 配置对象,对象里面有一个属性很重要,header请求头--可以用于token
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (res) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么


  return res;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么


  //当token过期需要清空token--即后台返回401
  if (error.response.status === 401) {
    // 无效的 token
    // 把 Vuex 中的 token 重置为空，并跳转到登录页面
    store.dispatch('clearToken')
    router.push('/login')
  }
  return Promise.reject(error);
});

//对外暴露
export default request