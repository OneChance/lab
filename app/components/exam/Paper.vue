<template>
    <div>
        <el-tag type="warning" class="time-tip" v-if="started">
            <div class="timer">
                考试剩余时间:<span class="hours"></span>:<span class="minutes"></span>:<span class="seconds"></span>
            </div>
        </el-tag>
        <question v-bind:question="question"
                  v-bind:index="index"
                  v-bind:paperId="paperId"
                  v-for="(question,index) of questions"
                  :key="question.id"></question>
        <div class=" content-center submit-card" v-if="!started">
            <el-button type="primary" @click="start">开始考试</el-button>
        </div>
        <el-card class="box-card content-center submit-card" v-if="started">
            <el-button type="primary" @click="submit">提交考卷</el-button>
        </el-card>
    </div>
</template>


<script>

require('../../plugin/countdown/js/jquery.countdown.js');

import App from "../../script/app";
import Exam from "../../script/server/manage/exam"
import Question from "./Question";

export default {
    name: "Paper",
    data: function () {
        return {
            started: false,
            paperId: '',
            questions: []
        }
    },
    mounted: function () {
        Exam.checkExam().then(res => {
            this.started = res.start
            this.paperId = res.paper.id
            this.exam(res.paper.questions, res.paper.startTime, res.exam.duration)
        })
    },
    methods: {
        start() {
            Exam.startExam({paperId: this.paperId}).then(res => {
                this.exam(res.paper.questions, res.paper.startTime, res.exam.duration)
            })
        },
        exam(questions, startTime, duration) {
            this.questions = questions
            this.$nextTick(() => {
                $('.timer').countdown((duration * 1000) + new Date(startTime).valueOf(), (event) => {
                    let $this = $(this.$el);
                    switch (event.type) {
                        case "seconds":
                        case "minutes":
                        case "hours":
                        case "days":
                        case "weeks":
                        case "daysLeft":
                            $this.find('span.' + event.type).html(event.value);
                            break;
                        case "finished":
                            //考试结束
                            this.submit(true)
                            break;
                    }
                });
            })
        },
        submit(auto) {
            Exam.commitPaper({id: this.paperId}).then(res => {
                if (auto) {
                    this.$message({
                        showClose: true,
                        message: '考试时间到,系统已为您自动提交考卷!',
                        type: 'warning',
                        duration: 5000
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: '考卷已提交,考试结束!',
                        type: 'success',
                        duration: 3000
                    });
                }
                App.vueG.$router.push('/score').catch(err => err)
            })
        }
    },
    components: {
        Question
    },
}
</script>

<style scoped>
.time-tip {
    position: fixed;
    z-index: 1;
    top: 5px;
    right: 5px;
}

.submit-card {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>