import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import User from './user'
import VCharts from 'v-charts'
import Antd from 'ant-design-vue'
import './http'
import 'ant-design-vue/dist/antd.less'

Vue.config.productionTip = false;
Vue.use(VCharts);
Vue.use(Antd);
Vue.use(User);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
