import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import cookie from 'vue-cookie';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Print from '../plugin/print/print'


//路由模块
import Sign from '../components/Sign.vue';
import Index from '../components/Index.vue';
import Error from '../components/Error.vue';
import AppCompnent from "../components/AppCompnent";
import Appointment from "../components/appointment/Appointment";
import Appointments from "../components/appointment/Appointments";
import QuestionBanks from "../components/exam/QuestionBanks";
import QuestionBank from "../components/exam/QuestionBank";
import SampleBanks from "../components/sample/SampleBanks";
import SampleBank from "../components/sample/SampleBank";
import Sample from "../components/sample/SampleMobile";
import SampleInfo from "../components/sample/SampleInfo";
import Paper from "../components/exam/Paper";
import Lab from "../components/info/Lab";
import Teacher from "../components/info/Teacher";
import Student from "../components/info/Student";
import Guest from "../components/info/Guest"
import SysCompnent from "../components/SysCompnent";
import SysRole from "../components/sys/SysRole";
import SysUser from "../components/sys/SysUser";
import Score from "../components/exam/Score"
import TeacherMobile from "../components/info/TeacherMobile";
import MobileLogin from "../components/MobileLogin";
import MobileChangePassword from "../components/MobileChangePassword";
import MobileMy from "../components/MobileMy";
import QrCodeExport from "../components/sample/QrCodeExport";

//网络工具
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);

// ElementUI
Vue.use(ElementUI);

// 设置COOKIE工具
Vue.use(cookie)

// 使用路由插件
Vue.use(VueRouter);

//消除重复路由控制台错误提示
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

//打印插件
Vue.use(Print)

export default {
    vueG: null,  //全局Vue对象
    init() {
        if (!this.vueG) {
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
                                    path: 'student',
                                    name: 'student',
                                    component: Student
                                },
                                {
                                    path: 'guest',
                                    name: 'guest',
                                    component: Guest
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
                                {
                                    path: 'qrcodeexport',
                                    name: 'qrcodeexport',
                                    component: QrCodeExport
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
                {path: '/wx/error', component: Error},
                {path: '/wx/appointment', component: Appointment},
                {path: '/wx/sample', component: Sample},
                {path: '/wx/exam', component: Paper},
                {path: '/wx/score', component: Score},
                {path: '/wx/teacherRate', component: TeacherMobile},
                {path: '/wx/loginM', name: '/wx/loginM', component: MobileLogin},
                {path: '/wx/changePasswordM', component: MobileChangePassword},
                {path: '/wx/appointments', component: Appointments},
                {path: '/wx/my', component: MobileMy},
            ];

            const router = new VueRouter({
                routes,
            });

            this.vueG = new Vue({
                router,
                data: function () {
                    return {
                        loginUser: {},
                    }
                }
            });
        }
    },
};
