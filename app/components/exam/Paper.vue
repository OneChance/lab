<template>
    <el-row class="mobile-div" v-loading="startLoading"
            element-loading-text="考卷加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="full-height">
            <el-tag type="warning" class="time-tip" v-if="status==='started'">
                <div class="timer">
                    考试剩余时间:<span class="hours"></span>:<span class="minutes"></span>:<span class="seconds"></span>
                </div>
            </el-tag>
            <question
                :ref="'question_'+question.qid"
                v-bind:question="question"
                v-bind:index="index"
                v-for="(question,index) of questions"
                :key="question.id"></question>
            <div class="content-center vertical-center" style="height: 100%;" v-if="status==='not-started'">
                <el-button type="primary" @click="start" :loading="startLoading">开始考试</el-button>
            </div>
            <el-card class="box-card content-center submit-card" v-if="status==='started'">
                <el-button type="primary" @click="submit" :loading="submitLoading">提交考卷</el-button>
            </el-card>
        </div>
    </el-row>
</template>


<script>

require('../../plugin/countdown/js/jquery.countdown.js');

import Exam from "../../script/server/manage/exam"
import Question from "./Question";
import Router from "../../script/client/router"

export default {
    name: "Paper",
    data: function () {
        return {
            status: 'no-status',
            examId: '',
            paperId: '',
            questions: [],
            startLoading: false,
            submitLoading: false,
            paperLoading: false,
            startTime: '',
            createTime: ''
        }
    },
    mounted: function () {
        Exam.checkExam().then(res => {
            if (res.paper) {
                this.exam(res)
            } else {
                this.status = 'not-started'
                this.examId = res.exam.id
            }
        }).catch((e) => {
            Router.toError(this)
        })
        document.title = '考试'

        document.addEventListener("visibilitychange", () => {
            let string = document.visibilityState
            if (string === 'hidden') {

            }
            if (string === 'visible') {
                this.start()
            }
        });
    },
    methods: {
        start() {
            this.startLoading = true
            Exam.startExam({examId: this.examId}).then(res => {
                this.startLoading = false
                this.exam(res)
            }).catch(() => {
                this.startLoading = false
            })
        },
        exam(res) {
            this.status = 'started'
            this.paperId = res.paper.id
            this.questions = res.paper.questions
            this.startTime = res.paper.startTime
            this.createTime = res.paper.createTime
            this.$nextTick(() => {
                $('.timer').countdown((res.exam.duration * 1000) + new Date(res.paper.startTime).valueOf(), (event) => {
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
            this.submitLoading = true
            let answers = []

            this.questions.forEach(question => {
                answers.push(this.$refs['question_' + question.qid][0].choose)
            })

            console.log(answers)

            /*Exam.commitPaper({
                startTime: this.startTime,
                createTime: this.createTime,
                examId: this.examId,
                questions: answers
            }).then(res => {
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
                this.$router.push('/wx/score').catch(err => err)
            }).catch(() => {
                this.submitLoading = false
            })*/
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

.timer {
    font-size: 0.9em;
}
</style>