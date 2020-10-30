<template>
    <div class="score-table">
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
    </div>
</template>


<script>

export default {
    name: "Score",
    data: function () {
        return {
            scores: [
                {time: '2020-10-20 18:30:00', score: 80},
                {time: '2020-10-15 8:30:00', score: 90},
                {time: '2020-10-10 13:30:00', score: 70}
            ],
        }
    },
    mounted: function () {

    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
                return 'success-row';
            }
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
</style>