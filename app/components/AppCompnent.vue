<template>
    <left-menu-frame v-bind:menus="leftMenus" class="tab"></left-menu-frame>
</template>


<script>

import LeftMenuFrame from "./util/LeftMenuFrame";

export default {
    name: "AppComponent",
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
            let appMenu = this.$root.loginUser.menus.filter(m => m.url === '/index/app')[0]
            if (appMenu) {
                this.leftMenus = appMenu.childrens
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