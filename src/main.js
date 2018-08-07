import Vue from 'vue'
import {Button} from 'mint-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import Split from './components/Split/Split.vue'//1.8引入分隔块组件

import './mock/mockServer'
import './filters'  // 加载自定义过滤器

// 注册全局组件标签
Vue.component(Button.name, Button)
Vue.component('Split', Split)//1.8注册全局组件标签分隔块组件


/* eslint-disable  */
new Vue({
  el: '#app',
  render: h => h(App),
  router, // 配置路由器
  store, //配置vuex的store
});
