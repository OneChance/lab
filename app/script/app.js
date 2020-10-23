import Vue from 'vue';
import VueRouter from 'vue-router';
import cookie from 'vue-cookie';
import ElementUI from 'element-ui';
import Sign from '../components/Sign.vue';
import Index from '../components/Index.vue';
import MobileApp from '../components/MobileApp.vue';
import AppCompnent from "../components/AppCompnent";
import Appointment from "../components/appointment/Appointment";
import QuestionBanks from "../components/exam/QuestionBanks";
import QuestionBank from "../components/exam/QuestionBank";
import SampleBanks from "../components/sample/SampleBanks";
import SampleBank from "../components/sample/SampleBank";
import Sample from "../components/sample/SampleMobile";
import SampleInfo from "../components/sample/SampleInfo";
import Paper from "../components/exam/Paper";
import Lab from "../components/info/Lab";
import Teacher from "../components/info/Teacher";
import SysCompnent from "../components/SysCompnent";
import SysRole from "../components/sys/SysRole";
import SysUser from "../components/sys/SysUser";
import Global from "./global"

// ElementUI
import 'element-ui/lib/theme-chalk/index.css';

// 设置COOKIE工具
Vue.prototype.$cookie = cookie;
Vue.prototype.global = Global;

// 使用路由插件
Vue.use(VueRouter);
Vue.use(ElementUI);

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default {
    router: null,
    hub: null,
    init() {
        if (!this.router) {
            const routes = [
                {path: '/', redirect: '/sign'},
                {path: '/sign', component: Sign},
                {
                    path: '/index',
                    component: Index,
                    children: [
                        {
                            path: 'app',
                            name: 'app',
                            component: AppCompnent,
                            children: [
                                {
                                    path: 'questionbanks',
                                    name: 'questionbanks',
                                    component: QuestionBanks
                                },
                                {
                                    path: 'questionbank',
                                    name: 'questionbank',
                                    component: QuestionBank
                                },
                                {
                                    path: 'lab',
                                    name: 'lab',
                                    component: Lab
                                },
                                {
                                    path: 'teacher',
                                    name: 'teacher',
                                    component: Teacher
                                },
                                {
                                    path: 'samplebanks',
                                    name: 'samplebanks',
                                    component: SampleBanks,
                                },
                                {
                                    path: 'samplebank',
                                    name: 'samplebank',
                                    component: SampleBank
                                },
                                {
                                    path: 'sampleinfo',
                                    name: 'sampleinfo',
                                    component: SampleInfo
                                },
                            ]
                        },
                        {
                            path: 'sys',
                            name: 'sys',
                            component: SysCompnent,
                            children: [
                                {
                                    path: 'user',
                                    name: 'user',
                                    component: SysUser
                                },
                                {
                                    path: 'role',
                                    name: 'role',
                                    component: SysRole
                                },
                            ]
                        },
                    ]
                },
                {path: '/mobile', component: MobileApp},
                {path: '/appointment', component: Appointment},
                {path: '/sample', component: Sample},
                {path: '/exam', component: Paper},
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
