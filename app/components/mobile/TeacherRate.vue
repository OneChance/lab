<template>
    <div class="mobile-div">
        <div class="full-height">

            <el-card class="box-card mobile-card">
                {{ rate.name }}
            </el-card>

            <el-card class="box-card mobile-card">
                <div class="mobile-item rate">
                    到岗情况:
                    <el-rate v-model="rate.dutyRate" class="rate-bar" :disabled="!commitable"></el-rate>
                </div>
                <div class="mobile-item rate">
                    服务态度:
                    <el-rate v-model="rate.mannerRate" class="rate-bar" :disabled="!commitable"></el-rate>
                </div>
                <div class="mobile-item rate">
                    讲解是否清晰:
                    <el-rate v-model="rate.teachRate" class="rate-bar" :disabled="!commitable"></el-rate>
                </div>
                <div class="mobile-item" style="margin-top: 20px">
                    <el-input type="textarea" v-model="rate.comment" :rows='8' placeholder="请填写评价"
                              :disabled="!commitable"></el-input>
                </div>
                <div class="mobile-center-text">
                    <el-button type="success" plain @click="submitRate()" v-if="commitable">提交评价</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import Appointment from "../../script/server/manage/appointment";
import User from "../../script/server/user";

export default {
    name: "TeacherRate",
    data: function () {
        return {
            rate: {
                bookId: this.$route.query.bookId,
                bookHour: this.$route.query.bookHour,
                teacherId: this.$route.query.teacherId,
                name: '',
                dutyRate: '',
                mannerRate: '',
                teachRate: '',
                comment: ''
            },
            commitable: true
        }
    },
    mounted: function () {
        document.title = '教师评价'
        if (this.rate.teacherId) {
            User.getUser({id: this.rate.teacherId}).then(res => {
                this.rate.teacherId = res.user.id
                this.rate.name = res.user.name
                Appointment.getRate(this.rate).then(res => {
                    this.commitable = res.empty
                    if (res.teacher_score) {
                        this.rate.dutyRate = res.teacher_score.dutyRate
                        this.rate.mannerRate = res.teacher_score.mannerRate
                        this.rate.teachRate = res.teacher_score.teachRate
                        this.rate.comment = res.teacher_score.comment
                    }
                })
            })
        }
    },
    methods: {
        submitRate() {
            Appointment.rate(this.rate).then(() => {
                this.$message({
                    showClose: true,
                    message: '评价已提交!',
                    type: 'success',
                    duration: 3000
                });
                this.$router.push('/wx/appointments')
            })
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