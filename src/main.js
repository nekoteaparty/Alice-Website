import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from "vue-router";

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI)

// 创建一个路由器实例
// 并且配置路由规则
import Container from './Container.vue'
import Broadcast from './Broadcast.vue'
import Channel from './Channel.vue'
import Account from './Account.vue'
import System from './System.vue'
import Login from "./Login.vue";
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/main',
      component: Container,
      children: [
        {
          path: "broadcast",
          component: Broadcast,
          name:"推流任务"
        },
        {
          path: "channel",
          component: Channel,
          name:"频道管理"
        },
        {
          path: "account",
          component: Account,
          name:"账号管理"
        },
        {
          path: "system",
          component: System,
          name:"系统管理"
        }, {
          path: "",
          component: Broadcast
        }
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      redirect: 'login'
    }
  ]
})
new Vue({
  router: router,
  el: '#app',
  render: h => h(App)
})
