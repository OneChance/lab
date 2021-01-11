<template>
    <div class="mobile-div">
        <div class="full-height">

            <el-card class="box-card mobile-card">
                {{ teacher.name }}
            </el-card>

            <el-card class="box-card mobile-card">
                <div class="mobile-item rate">
                    到岗情况:
                    <el-rate v-model="teacher.dutyRate" class="rate-bar"></el-rate>
                </div>
                <div class="mobile-item rate">
                    服务态度:
                    <el-rate v-model="teacher.mannerRate" class="rate-bar"></el-rate>
                </div>
                <div class="mobile-item rate">
                    讲解是否清晰:
                    <el-rate v-model="teacher.teachRate" class="rate-bar"></el-rate>
                </div>
                <div class="mobile-item" style="margin-top: 20px">
                    <el-input type="textarea" v-model="teacher.comment" :rows='8' placeholder="请填写评价"></el-input>
                </div>
                <div class="mobile-center-text">
                    <el-button type="success" plain @click="submitRate()">提交评价</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>


<script>

export default {
    name: "TeacherRate",
    data: function () {
        return {
            teacher: {
                id: 1,
                name: 'test1',
                dutyRate: '',
                mannerRate: '',
                teachRate: '',
                comment: ''
            },
        }
    },
    mounted: function () {
        document.title = '教师评价'
        console.log(this.$route.query.appointment.id, this.$route.query.appointment.bookHour)
    },
    methods: {
        submitRate() {
            console.log(this.teacher)
        }
    },
    components: {},
}
</script>

<style scoped>
.rate {
    margin: 10px 0 10px 0;
    display: flex;
    align-items: center;
}

.rate-bar {
    margin-left: 10px;
}
</style>