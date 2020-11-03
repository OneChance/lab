<template>
    <el-card class="box-card question-card">
        <div>
            {{ index + 1 }}.{{ question.title }}
        </div>
        <div v-for="(option,index) of question.options" :key="option.id" class="answer">
            <el-radio v-model="choose.answer" :label="option.answer" @change="commitAnswer" border>
                {{ indexDescription[index] }}. {{ option.answer }}
            </el-radio>
        </div>
    </el-card>
</template>


<script>

import Exam from "../../script/server/manage/exam"

export default {
    name: "Question",
    props: ['question', 'index', 'paperId'],
    data: function () {
        return {
            choose: {
                id: this.question.id,
                paperId: this.paperId,
                answer: ''
            },
            indexDescription: ["A", "B", "C", "D"]
        }
    },
    mounted: function () {
        this.choose.answer = this.question.answer
    },
    methods: {
        commitAnswer() {
            Exam.commitAnswer(this.choose).then(res => {
                if (res.exception) {
                    this.choose.answer = ''
                }
            })
        }
    },
    components: {},
}
</script>

<style scoped>

.question-card {
    margin-top: 15px;
}

.answer {
    margin-top: 10px;
}
</style>