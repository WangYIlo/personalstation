import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less' // 全局初始化样式
import '@/elementUI' // 注册elementUI组件

//统一接口api文件夹里面的全部请求函数
import * as API from '@/api/index'

import VueQuillEditor from 'vue-quill-editor'

// require styles---引入富文本编辑器Vue-Quill-Editor
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//此方法内会用Vue.component注册quillEditor名字的全局组件
Vue.use(VueQuillEditor /* { default global options } */)


Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate(){
    //将所有接口挂载到$API
    Vue.prototype.$API=API
  }
}).$mount('#app')
