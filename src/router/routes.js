
export default[
    {
        path: '/register',
        component: () => import('@/views/register')
      },
      {
        path: '/login',
        component: () => import('@/views/login')
      },
      {
        path: '/',
        component: () => import('@/views/layout'),
        //重定向--首页home
        redirect:'/home',
        children:[
          {
            //需要配合侧边栏导航中的路由规则
            path:'home',
            component:()=>import('@/views/home')
          },
          {
            // 这里必须叫user-info, 因为侧边栏导航切换的是它
            path: 'user-info', 
            component: () => import('@/views/user/userInfo')
          },
          {
            //更换头像路由
            path: 'user-avatar', 
            component: () => import('@/views/user/userAvatar')
          },
          {
            //重置密码路由
            path: 'user-pwd', 
            component: () => import('@/views/user/userPwd')
          },
          {
            //文章分类路由
            path: 'art-cate', 
            component: () => import('@/views/article/artCate')
          },
          {
            //文章列表路由
            path: 'art-list', 
            component: () => import('@/views/article/artList')
          },
        ]
      },
]