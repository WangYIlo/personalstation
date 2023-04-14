import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'

Vue.use(VueRouter)



const router = new VueRouter({
  routes
})

//设置全局路由守卫做判断, 有token但是无userInfo信息, 才发请求拿用户信息--防止多次请求
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if(token){
    //阻止已登录的用户前往login---回到首页
    if(to.path=='/login'){
      next('/')
    }else{
      next()
    }
  }else{
    // 未登录用户只能前往login，register
    if(to.path==='/login'||to.path==='/register'){
      next()
    }else{
       next('login')
    }
   
  }
})

export default router