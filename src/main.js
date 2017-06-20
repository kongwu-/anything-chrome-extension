// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

Vue.config.productionTip = false
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/css/style.css'
import App from './App.vue'
Vue.use(ElementUI)
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
