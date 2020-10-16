<template>
    <el-container>
        <el-aside>
            <el-menu
                id="left-menu"
                :default-active="leftActiveIndex"
                class="el-menu-vertical-demo my-menu"
                text-color="#303133"
                active-text-color="#e1184a"
                @select="handleSelect"
                :collapse="isCollapse">
                <el-menu-item :index="menu.value" v-for="menu in oneLevelMenu" :key="menu.value">
                    <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                    <span slot="title">
                        {{ menu.label }}
                    </span>
                </el-menu-item>
                <el-submenu :index="menu.value" v-for="menu in MultiLevelMenu" :key="menu.value">
                    <template slot="title">
                        <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                        <span slot="title">
                            {{ menu.label }}
                        </span>
                    </template>
                    <el-menu-item :index="m.value" v-for="m in menu.children" :key="m.value">
                        <template slot="title">
                            <i :class="'fa '+m.icon+' fa-lg fa-inverse'"></i>
                            <span slot="title" v-if="m.value!=='willDo'">
                                {{ m.label }}
                            </span>
                            <el-badge :value="willDoCount" class="item" v-if="m.value==='willDo'">
                                {{ m.label }}
                            </el-badge>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="collapse">
                    <i class="fa fa-bars fa-lg fa-inverse"></i>
                    <span slot="title">
                        菜单缩放
                    </span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <div class="main_right" id="main_right">
                <component v-bind:is="currentComponent" class="tab">

                </component>
            </div>
        </el-main>
    </el-container>
</template>

<script>

import SysCampOrg from '../sys/SysCampOrg.vue'
import SysRight from '../sys/SysRight.vue'
import SysRole from '../sys/SysRole.vue'
import SysMenu from '../sys/SysMenu.vue'
import SysUser from "../sys/SysUser";

export default {
    name: "leftMenuFrame",
    data: function () {
        return {
            oneLevelMenu: [],
            MultiLevelMenu: [],
            leftActiveIndex: '',
            isCollapse: true,
            currentComponent: '',
            willDoCount: 0,
        }
    },
    props: ['menus'],
    watch: {
        menus: function (newVal) {
            this.oneLevelMenu = newVal.filter(menu => menu.children === null)
            this.MultiLevelMenu = newVal.filter(menu => menu.children !== null)
            this.leftActiveIndex = newVal[0].value
            this.currentComponent = newVal[0].value
        }
    },
    mounted: function () {

    },
    methods: {
        handleSelect(key) {
            console.log(key)
            if (key === 'collapse') {
                this.isCollapse = !this.isCollapse
            } else {
                this.currentComponent = key
            }
        },
        menuCollapse(size) {

        }
    },
    components: {
        SysCampOrg,
        SysRight,
        SysRole,
        SysMenu,
        SysUser,
    }
}
</script>

<style scoped>

.el-menu-vertical-demo {

}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
}

</style>