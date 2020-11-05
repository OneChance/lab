<template>
    <div class="score-table mobile-div scores">
        <el-table
            :data="scores"
            border
            :row-class-name="tableRowClassName"
            style="width: 100%">
            <el-table-column
                prop="time"
                label="考试时间">
            </el-table-column>
            <el-table-column
                prop="score"
                label="分数">
            </el-table-column>
        </el-table>

        <el-alert
            class="final-score"
            :title="'您的最终考试得分为:'+finalScore+'分'"
            type="success"
            center
            :closable="false">
        </el-alert>

    </div>
</template>


<script>

export default {
    name: "Score",
    data: function () {
        return {
            scores: [],
            finalScore: 0,
        }
    },
    mounted: function () {
        this.scores = [
            {time: '2020-10-20 18:30:00', score: 80},
            {time: '2020-10-15 8:30:00', score: 90},
            {time: '2020-10-10 13:30:00', score: 70}
        ]
        this.finalScore = Math.max(...this.scores.map(s => s.score))
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            return '';
        }
    },
    components: {},
}
</script>

<style scoped>
.score-table {
    padding: 10px;
}

.final-score {
    margin-top: 10px;
    height: 50px;
    font-weight: bold;
}
</style>