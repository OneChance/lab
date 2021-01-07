<template>
    <el-container>
        <el-aside>
            <el-menu
                :default-active="activeIndex"
                class="el-menu-vertical-demo my-menu left-menu"
                text-color="#303133"
                active-text-color="#347dd6"
                @select="handleSelect"
                router="true"
                :collapse="isCollapse">
                <el-menu-item :index="menu.url" v-for="menu in oneLevelMenu" :key="menu.id">
                    <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                    <span slot="title">
                        {{ menu.name }}
                    </span>
                </el-menu-item>
                <el-submenu :index="menu.url" v-for="menu in MultiLevelMenu" :key="menu.id">
                    <template slot="title">
                        <i :class="'fa '+menu.icon+' fa-lg fa-inverse'"></i>
                        <span slot="title">
                            {{ menu.name }}
                        </span>
                    </template>
                    <el-menu-item :index="m.url" v-for="m in menu.childrens" :key="m.id">
                        <template slot="title">
                            <i :class="'fa '+m.icon+' fa-lg fa-inverse'"></i>
                            <span slot="title">
                                {{ m.name }}
                            </span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item>
                    <i class="fa fa-bars fa-lg fa-inverse"></i>
                    <span slot="title">
                        菜单缩放
                    </span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <div class="main_right" id="main_right">
                <router-view></router-view>
            </div>
        </el-main>
    </el-container>
</template>

<script>

export default {
    name: "leftMenuFrame",
    data: function () {
        return {
            oneLevelMenu: [],
            MultiLevelMenu: [],
            isCollapse: false,
            activeIndex: '',
        }
    },
    props: ['menus'],
    watch: {
        menus: function (newVal) {
            this.oneLevelMenu = newVal.filter(menu => menu.childrens === null)
            this.MultiLevelMenu = newVal.filter(menu => menu.childrens !== null)
            setTimeout(() => {
                this.setActive(this.$route.path)
            }, 10)
        },
        $route(route) {
            this.setActive(route.path)
        }
    },
    mounted: function () {

    },
    methods: {
        handleSelect(key) {
            if (!key) {
                this.isCollapse = !this.isCollapse
            }
        },
        setActive(path) {
            if (path.indexOf('sample') !== -1) {
                this.activeIndex = '/index/app/samplebanks'
            } else if (path.indexOf('question') !== -1) {
                this.activeIndex = '/index/app/questionbanks'
            } else if (path.indexOf('duty') !== -1 || path.indexOf('opentime') !== -1) {
                this.activeIndex = '/index/app/lab'
            } else {
                this.activeIndex = path
            }
        }
    },
    components: {}
}
</script>

<style scoped>

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 160px;
}
</style>