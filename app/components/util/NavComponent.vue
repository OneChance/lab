<template>
    <el-row>
        <el-col :span="24">
            <el-card class="box-card nav-card">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: item.url }" v-for="item of this.data" :key="item.url">
                        {{ item.name }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>


export default {
    name: 'NavComponent',
    props: ['data'],
    data: function () {
        return {}
    },
    methods: {},
    mounted: function () {

    },
}
</script>

<style scoped>


</style>
