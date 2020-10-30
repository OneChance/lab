<template>
    <div>
        <el-card class="box-card mobile-card content-center">
            <p class="score">{{ score }}</p>
        </el-card>
    </div>
</template>


<script>

export default {
    name: "Score",
    data: function () {
        return {
            score: '80',
        }
    },
    mounted: function () {

    },
    methods: {},
    components: {},
}
</script>

<style scoped>
.score {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 350%;;
    font-weight: bolder;
    color: #347dd6;;
}
</style>