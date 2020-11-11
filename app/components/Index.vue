<template id="index">
    <div>
        <el-row :gutter="24" class="header-bar">
            <el-col :span="4">
                <div class="logo fl">
                    <i class="fa fa-bars fa-lg small-menu-bar" aria-hidden="true"></i>
                    <span class="logo-title">
                        实验室管理系统
                    </span>
                </div>
            </el-col>

            <el-col :span="16" class="header-navi">
                <el-menu :default-active="activeMenuIndex" class="el-menu-demo navi-menu banner-back" mode="horizontal"
                         text-color="#fff"
                         background-color="#347dd6"
                         active-text-color="#fff"
                         @select="handleSelect"
                         router="true">
                    <el-menu-item :index="menu.url" v-for="menu in menus" :key="menu.id">
                        {{ menu.name }}
                    </el-menu-item>
                </el-menu>
            </el-col>

            <el-col :span="4" class="header-bar-right">
                <el-menu class="el-menu-demo" mode="horizontal"
                         background-color="#347dd6"
                         text-color="#fff"
                         active-text-color="#fff"
                         @select="handleSelect">
                    <el-submenu :index="menu.index" v-for="menu in userOper" :key="menu.value">
                        <template slot="title">{{ menu.name }}</template>
                        <el-menu-item :index="m.index" v-for="m in menu.sub" :key="m.value">
                            {{ m.name }}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>

        <!-- 小屏幕菜单 -->
        <el-menu
            default-active="personal"
            class="el-menu-vertical-demo small-menu"
            text-color="#303133"
            active-text-color="#e1184a"
            @select="handleSelect">
            <el-menu-item :index="menu.value" v-for="menu in menus" :key="menu.value">
                <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                <span slot="title">
                        {{ menu.label }}
                </span>
            </el-menu-item>
        </el-menu>

        <div class="main_center" id="main_center">
            <router-view></router-view>
        </div>

    </div>
</template>

<script>

import Account from '../script/server/account.js'
import App from '../script/app.js'


export default {
    created: function () {

    },
    watch: {
        $route(route) {
            this.setActive(route.path)
        }
    },
    data: function () {
        return {
            menus: [],
            activeMenuIndex: '',
            userOper: [
                {
                    index: 'userOper', name: '管理员', sub: [
                        {index: 'sign', name: '退出'},
                    ]
                }
            ],
        }
    },
    mounted: function () {

        Account.getLoginUser().then(res => {
            this.userOper[0].name = res.user.name
            this.menus = res.menus
            res.user.menus = res.menus
            this.global.loginUser = res.user
            App.vueG.$emit('menuInfo')
            this.setActive(this.$route.path)
        })

        this.$nextTick(() => {
            $('.small-menu-bar').on('click', function (e) {
                e.preventDefault();
                $('.small-menu')[0].style.webkitTransform = "translate(0px,0px)";
            })
        });

        window.onresize = () => {
            return (() => {
                App.vueG.$emit('windowResize', document.body.clientWidth)
            })();
        };

    },
    methods: {
        signOut: function () {
            Account.logOut().then(() => {
                App.vueG.$router.push('/sign').catch(err => err);
            })
            this.$cookie.delete('apm_token');
            localStorage.removeItem("apm_token");
        },
        handleSelect(key) {
            if (key === 'sign') {
                this.signOut()
            } else {
                $('.small-menu')[0].style.webkitTransform = "translate(-270px,0px)";
            }
        },
        setActive(path) {
            let appMenu = this.global.loginUser.menus.filter(m => m.url === '/index/app')[0]
            let sysMenu = this.global.loginUser.menus.filter(m => m.url === '/index/sys')[0]
            if (path === '/index' || path === '/index/' || path === '/index/app' || path === '/index/app/') {
                if (appMenu) {
                    App.vueG.$router.push(appMenu.childrens[0].url).catch(err => err);
                }
            } else if (path === '/index/sys' || path === '/index/sys/') {
                if (sysMenu) {
                    App.vueG.$router.push(sysMenu.childrens[0].url).catch(err => err);
                }
            } else if (path.indexOf('/index/sys') !== -1) {
                this.activeMenuIndex = '/index/sys'
            } else if (path.indexOf('/index/app') !== -1) {
                this.activeMenuIndex = '/index/app'
            }
        },
    },
    components: {},
}
</script>

<style scoped>

</style>
