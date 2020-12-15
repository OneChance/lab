<template>
    <div class="mobile-div">
        <div class="full-height">
            <div class="mobile-center-text message-error">
                {{ msg }}
            </div>
        </div>
    </div>
</template>


<script>

export default {
    name: "Error",
    data: function () {
        return {
            msg: '操作失败！'
        }
    },
    mounted: function () {
        if (this.$route.query.msg) {
            this.msg = this.$route.query.msg
        }
    },
    methods: {},
    components: {},
}
</script>

<style scoped>
.message-error {
    color: #ec3939;
    text-align: center;
}
</style>