<template>
    <div>
        <el-tag type="warning" class="time-tip">
            <div class="timer">
                考试剩余时间:<span class="hours"></span>:<span class="minutes"></span>:<span class="seconds"></span>
            </div>
        </el-tag>
        <question :ref="'question'+question.id" v-bind:question="question" v-for="question of questions"
                  :key="question.id"></question>
        <el-card class="box-card content-center submit-card">
            <el-button type="primary" @click="submit">提交考卷</el-button>
        </el-card>
    </div>
</template>


<script>

import App from "../../script/app";

require('../../plugin/countdown/js/jquery.countdown.js');
import Question from "./Question";


export default {
    name: "Paper",
    data: function () {
        return {
            questions: [
                {
                    id: 1,
                    question: 'NBA最伟大的球员是谁?',
                    options: [
                        {id: 11, answer: '科比布莱恩特', right: false},
                        {id: 12, answer: '迈克尔乔丹', right: true},
                        {id: 13, answer: '勒布朗詹姆斯', right: false},
                        {id: 14, answer: '沙奎奥尼尔', right: false},
                    ],
                    index: 1,
                },
                {
                    id: 2,
                    question: 'B站粉丝最多的美食博主是?',
                    options: [
                        {id: 5, answer: '蛋黄派', right: false},
                        {id: 6, answer: '大祥哥', right: true},
                        {id: 7, answer: '大军', right: false},
                        {id: 8, answer: '徐大sao', right: false},
                    ],
                    index: 2,
                },
                {
                    id: 3,
                    question: '最好的开放世界游戏是?',
                    options: [
                        {id: 15, answer: '我的世界', right: false},
                        {id: 16, answer: '荒野大镖客2', right: true},
                        {id: 17, answer: 'GTA5', right: false},
                        {id: 18, answer: '塞尔达传说', right: false},
                    ],
                    index: 3,
                }
            ]
        }
    },
    mounted: function () {
        this.$nextTick(() => {
            $('.timer').countdown(100000 + new Date().valueOf(), (event) => {
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
                        this.$message({
                            showClose: true,
                            message: '考试时间到,系统已为您自动提交考卷!',
                            type: 'warning',
                            duration: 5000
                        });
                        App.vueG.$router.push('/application').catch(err => err)
                        break;
                }
            });
        })
    },
    methods: {
        submit() {
            for (let question in this.$refs) {
                console.log(this.$refs[question][0].choose)
            }
            this.$message({
                showClose: true,
                message: '考卷已提交,考试结束!',
                type: 'success',
                duration: 3000
            });
            App.vueG.$router.push('/application').catch(err => err)
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