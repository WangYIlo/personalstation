import { reqGetUserInfo,getMenusAPI } from '@/api'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //用来存储登录成功之后，得到的 token---从localStorage获取如果没有为null
    token:localStorage.getItem('TOKEN') ,
    //用户基本信息
    userInfo:{},
    //侧边栏数据
    menus:[]
  },
  mutations: {
    //设置或更新token
    SETORUPDATETOKEN(state, token) {
      state.token = token
    },
    //清空token
    CLEARTOKEN(state){
        state.token=''
    },
    //获取用户信息
    GETUSERINFO(stae,userInfo){
      stae.userInfo=userInfo
    },
    // 获取侧边栏数据
    GETMENUSLISTFN(state,menus){
      state.menus=menus
    }
  },
  actions: {
    //设置或更新token
    setOrUpdateToken({ commit },token) {
      //持久化存储token
      localStorage.setItem('TOKEN',token)
      commit('SETORUPDATETOKEN',token)
    },
    //清空token
    clearToken({commit}){
      //清空本地存储token
      localStorage.removeItem('TOKEN')
      commit('CLEARTOKEN')
    },
    //获取用户信息
    async getUserInfo({commit}){
      let {data:res}=await reqGetUserInfo()
      if(res.status===200){
        commit('GETUSERINFO',res.data)
      }else{
         throw new Error(res.message)
      }
    },
    //获取侧边栏数据
    async getMenusListFn ({commit}) {
      const {data:res} = await getMenusAPI()
      if(res.status===200){
        commit('GETMENUSLISTFN',res.data)
      }
    }
  },
  getters: {
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  modules: {
  }
})
