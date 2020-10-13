<template id="index">
    <div class="center">
        <el-button type="primary" plain class="btn-mobile-full" @click="toAppointment">预约</el-button>
        <el-button type="success" plain class="btn-mobile-full">考试</el-button>
    </div>
</template>

<script>

require('../style/css/anim.scss');
import App from '../script/app.js'

export default {
    created: function () {

    },
    data: function () {
        return {}
    },
    mounted: function () {

    },
    methods: {
        toAppointment() {
            App.router.$router.push('appointment').catch(err => err)
        }
    },
    components: {},
}
</script>

<style scoped>
.btn-mobile-full {
    width: calc(100% - 10px);
    margin: 5px !important;
}
</style>
