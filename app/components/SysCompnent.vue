<template>
    <left-menu-frame v-bind:menus="leftMenus" class="tab"></left-menu-frame>
</template>


<script>

import LeftMenuFrame from "./util/LeftMenuFrame";
import App from "../script/app";

export default {
    name: "SysComponent",
    mounted: function () {
        if (this.global.loginUser.menus) {
            this.setMenu()
        } else {
            App.vueG.$on('menuInfo', () => {
                this.setMenu()
            })
        }
    },
    watch: {},
    data: function () {
        return {
            leftMenus: []
        }
    },
    methods: {
        setMenu() {
            let sysMenu = this.global.loginUser.menus.filter(m => m.url === '/index/sys')[0]
            if (sysMenu) {
                this.leftMenus = sysMenu.childrens
            }
        }
    },
    components: {
        LeftMenuFrame
    },
}
</script>

<style scoped>

</style>