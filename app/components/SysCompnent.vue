<template>
    <left-menu-frame v-bind:menus="leftMenus" class="tab"></left-menu-frame>
</template>


<script>

import LeftMenuFrame from "./util/LeftMenuFrame";

export default {
    name: "SysComponent",
    mounted: function () {
        if (this.$root.loginUser.menus) {
            this.setMenu()
        } else {
            this.$root.$on('menuInfo', () => {
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
            let sysMenu = this.$root.loginUser.menus.filter(m => m.url === '/index/sys')[0]
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