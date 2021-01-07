<template>
    <div class="card-content">
        <el-row :gutter="10">
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
        <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="12">
                <el-card class="box-card">
                    <c-line :chart-data="lineData"></c-line>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import HBar from "../charts/HBar";
import Radar from "../charts/Radar"
import CLine from "../charts/CLine"

export default {
    name: "Statistics",
    data: function () {
        return {
            datacollection: {},
            radarData: {},
            lineData: {},
            barOptions: {}
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
                        backgroundColor: '#347dd6',
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
                    data: [60, 70, 55, 98, 39]
                }]
            }

            this.lineData = {
                labels: ['抗压力', '精力', '适应力', '表达力', '逻辑力'],
                datasets: [{
                    label: '测试1',
                    backgroundColor: '#347dd6',
                    data: [60, 70, 55, 98, 39],
                    fill: false,
                    borderColor: '#347dd6'
                }]
            }
        }
    },
    components: {
        HBar, Radar, CLine
    }
}
</script>

<style scoped>

</style>