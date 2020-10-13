import Vue from 'vue';
import VueRouter from 'vue-router';
import cookie from 'vue-cookie';
import ElementUI from 'element-ui';
import Sign from '../components/Sign.vue';
import Index from '../components/Index.vue';
import Application from '../components/Application.vue';
import Appointment from "../components/appointment/Appointment";

// 局部打印插件
import printArea from '../plugin/printarea/jquery.PrintArea';

// ElementUI
import 'element-ui/lib/theme-chalk/index.css';

// 设置COOKIE工具
Vue.prototype.$cookie = cookie;

// 使用路由插件
Vue.use(VueRouter);
Vue.use(ElementUI);

export default {
    router: null,
    hub: null,
    init() {
        if (!this.router) {
            const routes = [
                {path: '/sign', component: Sign},
                {path: '/', component: Sign},
                {
                    path: '/index',
                    component: Index,
                },
                {path: '/application', component: Application},
                {path: '/appointment', component: Appointment},
            ];

            const router = new VueRouter({
                routes,
            });

            this.router = new Vue({
                router,
            });

            this.hub = new Vue();
        }
    },
};
