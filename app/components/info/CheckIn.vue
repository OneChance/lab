<template>
    <div class="mobile-div">
        <div class="full-height">
            <el-alert
                :title="checkRes.msg"
                :type="checkRes.type"
                center
                :closable="false"
                show-icon>
            </el-alert>
        </div>
    </div>
</template>


<script>

import Lab from "../../script/server/manage/lab";

export default {
    name: "CheckIn",
    data: function () {
        return {
            checkRes: {
                msg: '',
                type: ''
            }
        }
    },
    mounted: function () {
        Lab.checkIn(this.$route.query.token).then(() => {
            this.checkRes.msg = '签到成功,快去扫码学习吧!'
            this.checkRes.type = 'success'
        }).catch(() => {
            this.checkRes.msg = '签到失败!'
            this.checkRes.type = 'error'
        })
    },
    methods: {},
    components: {},
}
</script>

<style scoped>

</style>