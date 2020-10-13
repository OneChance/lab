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
                <el-menu :default-active="activeMenuIndex" class="el-menu-demo navi-menu" mode="horizontal"
                         background-color="#e1184a"
                         text-color="#fff"
                         active-text-color="#fff"
                         @select="handleSelect">
                    <el-menu-item :index="menu.value" v-for="menu in menus" :key="menu.value">
                        {{ menu.label }}
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="4" class="header-bar-right">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                         background-color="#2f673c"
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
            <component v-bind:menus="leftMenus" v-bind:is="currentComponent" class="tab"></component>
        </div>

    </div>
</template>

<script>
require('../style/css/anim.scss');
import Menu from '../script/server/menu.js'
import Account from '../script/server/account.js'
import App from '../script/app.js'
import LeftMenuFrame from '../components/LeftMenuFrame.vue'

export default {
    created: function () {

    },
    data: function () {
        return {
            menus: [],
            leftMenus: [],
            activeMenuIndex: 'my',
            userOper: [
                {
                    index: 'userOper', name: '管理员', sub: [
                        {index: 'sign', name: '退出'},
                    ]
                }
            ],
            currentComponent: 'leftMenuFrame'   //默认加载左边为菜单的组件
        }
    },
    mounted: function () {
        let comp = this;
        Menu.getMenu().then(res => {
            comp.menus = res.menus
            comp.leftMenus = comp.menus.filter(menu => menu.value === 'my')[0].children
        })

        Account.getLoginUser().then(res => {
            this.userOper[0].name = res.user.name
        })

        this.$nextTick(() => {
            $('.small-menu-bar').on('click', function (e) {
                e.preventDefault();
                $('.small-menu')[0].style.webkitTransform = "translate(0px,0px)";
            })
        });

        window.onresize = () => {
            return (() => {
                App.hub.$emit('windowResize', document.body.clientWidth)
            })();
        };
    },
    methods: {
        signOut: function () {
            Account.logOut().then(() => {
                App.router.$router.push('sign').catch(err => err);
            })
            this.$cookie.delete('apm_token');
            localStorage.removeItem("apm_token");
        },
        handleSelect(key) {
            if (key === 'sign') {
                this.signOut()
            } else {
                $('.small-menu')[0].style.webkitTransform = "translate(-270px,0px)";
                //如果非左边菜单架构，替换当前组件
                //this.currentComponent = key
                //否则，替换组件数据
                this.leftMenus = this.menus.filter(menu => menu.value === key)[0].children
            }
        }
    },
    components: {LeftMenuFrame},
}
</script>

<style scoped>

</style>
