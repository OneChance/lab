<template>
    <div class="mobile-div">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item :title="teacher.info.name" :name="teacher.info.id" v-for="teacher of teachers"
                              :key="teacher.info.id">
                <div class="mobile-item-row">
                    <el-rate v-model="teacher.rate"
                             show-text
                             :texts="texts"></el-rate>
                </div>
                <div class="mobile-item-row">
                    <el-input type="textarea" v-model="teacher.comment" placeholder="请填写评价"></el-input>
                </div>
                <div>
                    <el-button type="success" plain @click="submitRate(teacher)">提交评价</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>


<script>

export default {
    name: "TeacherRate",
    data: function () {
        return {
            teachers: [
                {info: {id: 1, name: '张老师'}, rate: '', comment: ''},
                {info: {id: 2, name: '李老师'}, rate: '', comment: ''},
                {info: {id: 3, name: '王老师'}, rate: '', comment: ''},
            ],
            texts: ['极差', '失望', '一般', '满意', '很棒']
        }
    },
    mounted: function () {

    },
    methods: {
        submitRate(teacher) {
            console.log(teacher)
        }
    },
    components: {},
}
</script>

<style scoped>
.mobile-div {
    padding: 20px;
}
</style>