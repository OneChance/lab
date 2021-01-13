<template>
    <div class="score-table mobile-div scores">
        <el-table
            :data="scores"
            border
            :row-class-name="tableRowClassName">
            <el-table-column
                prop="startTime"
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

import Exam from "../../script/server/manage/exam"
import Config from "../../script/config"

export default {
    name: "Score",
    data: function () {
        return {
            scores: [],
            finalScore: 0,
        }
    },
    mounted: function () {
        Exam.scores(Config.allPage).then(res => {
            this.scores = res.list
            if (this.scores.length > 0) {
                this.finalScore = this.scores.map(s => s.score).reduce((prev, next) => {
                    return Math.max(prev, next)
                })
            }
        })
        document.title = '成绩查询'
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