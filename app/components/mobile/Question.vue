<template>
    <el-card class="box-card question-card">
        <div class="question-title">
            {{ index + 1 }}.{{ question.title }}
        </div>
        <div v-for="(option,index) of question.options" :key="option.id" class="answer">
            <el-radio v-model="choose.answer" :label="option.answer" border @change="setTime"
                      class="question">
                {{ indexDescription[index] }}. {{ option.answer }}
            </el-radio>
        </div>
    </el-card>
</template>


<script>

export default {
    name: "Question",
    props: ['question', 'index'],
    data: function () {
        return {
            choose: {
                qid: '',
                title: '',
                options: '',
                answer: '',
                answerTime: ''
            },
            indexDescription: ["A", "B", "C", "D"]
        }
    },
    mounted: function () {
        this.choose.qid = this.question.qid
        this.choose.title = this.question.title
        this.choose.options = this.question.options
        this.choose.answer = ''
        this.choose.answerTime = ''
    },
    methods: {
        setTime() {
            this.choose.answerTime = this.dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
    },
    components: {},
}
</script>

<style scoped>

.question-card {
    margin-top: 15px;
}

.question {
    width: 100% !important;
    font-size: 0.9em;
}

.answer {
    margin-top: 10px;
}

.question-title {
    font-weight: bold;
}
</style>