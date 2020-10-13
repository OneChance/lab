<template>
    <user-component v-bind:type="'sysuser'"></user-component>
</template>

<script>

import UserComponent from "./UserComponent";

export default {
    name: "SysUser",
    data: function () {
        return {}
    },
    mounted: function () {

    },
    methods: {},
    components: {
        UserComponent
    }
}
</script>

<style scoped>

</style>