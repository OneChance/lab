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
                    <el-submenu index="userOper">
                        <template slot="title">{{ $root.loginUser.name }}</template>
                        <el-menu-item index="signOut">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>

        </el-row>

        <div class="main_center" id="main_center">
            <router-view></router-view>
        </div>

    </div>
</template>

<script>

import Account from '../script/server/account.js'

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
        }
    },
    mounted: function () {

        Account.getLoginUser().then(res => {
            this.menus = res.menus
            res.user.menus = res.menus
            this.$root.loginUser = res.user
            this.$root.$emit('menuInfo')
            this.setActive(this.$route.path)
        })

        window.onresize = () => {
            return (() => {
                this.$root.$emit('windowResize', document.body.clientWidth)
            })();
        };
    },
    methods: {
        signOut: function () {
            Account.logOut().then(() => {
                this.$router.push('/sign').catch(err => err);
            })
            this.$cookie.delete('ssm_token');
            localStorage.removeItem("ssm_token");
        },
        handleSelect(key) {
            if (key === 'signOut') {
                this.signOut()
            }
        },
        setActive(path) {
            let appMenu = this.$root.loginUser.menus.filter(m => m.url === '/index/app')[0]
            let sysMenu = this.$root.loginUser.menus.filter(m => m.url === '/index/sys')[0]
            if (path === '/index' || path === '/index/' || path === '/index/app' || path === '/index/app/') {
                if (appMenu) {
                    this.$router.push(appMenu.childrens[0].url).catch(err => err);
                }
            } else if (path === '/index/sys' || path === '/index/sys/') {
                if (sysMenu) {
                    this.$router.push(sysMenu.childrens[0].url).catch(err => err);
                }
            }
            this.activeMenuIndex = path.split('/').slice(0, 3).join('/')
        },
    },
    components: {},
}
</script>

<style scoped>

</style>
