<template>
    <div class="card-content">
        <el-row :gutter="5">
            <el-col :span="12">
                <el-card class="box-card">
                    <h-bar :chart-data="datacollection" :options="barOptions"></h-bar>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <radar :chart-data="radarData"></radar>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="5" style="margin-top: 10px">
            <el-col :span="12">
                <el-card class="box-card">
                    <c-line :chart-data="lineData"></c-line>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <pie :chart-data="pieData"></pie>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import HBar from "../charts/HBar";
import Radar from "../charts/Radar"
import CLine from "../charts/CLine"
import Pie from "../charts/Pie"

export default {
    name: "Statistics",
    data: function () {
        return {
            datacollection: {},
            radarData: {},
            lineData: {},
            barOptions: {},
            pieData: {}
        }
    },
    mounted: function () {
        this.fillData()
    },
    methods: {
        barClick(event, array) {
            if (array && array.length > 0) {
                console.log(array[0]._index)
            }
        },
        fillData() {
            this.datacollection = {
                labels: ['抗压力', '精力', '适应力', '表达力', '逻辑力'],
                datasets: [
                    {
                        label: '测试1',
                        borderColor: '#347dd6',
                        borderWidth: 2,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                        ],
                        data: [10, 20, 30, 40, 50],
                    }
                ]
            }
            this.barOptions = {
                onClick: this.barClick,
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

            this.radarData = {
                labels: ['抗压力', '精力', '适应力', '表达力', '逻辑力'],
                datasets: [{
                    label: '测试1',
                    borderColor: '#347dd6',
                    borderWidth: 2,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(255, 206, 86, 0.3)',
                        'rgba(75, 192, 192, 0.3)',
                        'rgba(153, 102, 255, 0.3)',
                    ],
                    data: [60, 70, 55, 98, 39]
                }]
            }

            this.lineData = {
                labels: ['抗压力', '精力', '适应力', '表达力', '逻辑力'],
                datasets: [{
                    label: '测试1',
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                    ],
                    borderWidth: 2,
                    data: [60, 70, 55, 98, 39],
                    fill: false,
                    borderColor: '#347dd6'
                }]
            }

            this.pieData = {
                labels: ['抗压力', '精力', '适应力', '表达力', '逻辑力'],
                datasets: [{
                    label: '测试1',
                    borderColor: '#347dd6',
                    borderWidth: 2,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                    ],
                    data: [60, 70, 55, 98, 39]
                }]
            }
        }
    },
    components: {
        HBar, Radar, CLine, Pie
    }
}
</script>

<style scoped>

</style>