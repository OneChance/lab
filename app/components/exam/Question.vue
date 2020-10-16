<template>
    <el-card class="box-card question-card">
        <div>
            {{ question.index }}.{{ question.question }}
        </div>
        <div v-for="(option,index) of question.options" :key="option.id" class="answer">
            <el-radio v-model="choose.value" :label="option.id" border>
                {{ indexDescription[index] }}. {{ option.answer }}
            </el-radio>
        </div>
    </el-card>
</template>


<script>


export default {
    name: "Question",
    props: ['question'],
    data: function () {
        return {
            choose: {
                id: this.question.id,
                value: 0
            },
            indexDescription: ["A", "B", "C", "D"]
        }
    },
    mounted: function () {


    },
    methods: {},
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