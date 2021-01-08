<template>
    <div>

        <nav-component v-bind:data="navData"></nav-component>

        <el-card class="box-card box-card-no-nav back-man-card">
            <my-calendar v-model="value" ref="c" v-bind:top-btn-event="topBtn">
                <template
                    slot="dateCell"
                    slot-scope="{date, data}">
                    <div class="day" @click="setOpenTime(data.day)">
                        <div class="day-sign">{{ Number(data.day.split('-')[2]) }}</div>
                        <div class="info">
                            {{ dateResMap[data.day] }}
                        </div>
                    </div>
                </template>
            </my-calendar>
        </el-card>

        <el-dialog :title="form.day+' 开放时段'"
                   :visible.sync="visible"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px">
                <el-checkbox-group v-model="chooseTimeZone">
                    <el-checkbox :label="zone.id" border v-for="zone of this.availableTimeZone"
                                 :key="zone.id"
                                 class="time-zone">{{ zone.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="setCommit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>

import MyCalendar from "../util/MyCalendar";
import Config from "../../script/config";
import NavComponent from "../util/NavComponent";
import Lab from "../../script/server/manage/lab";

export default {
    name: "Duty",
    data: function () {
        return {
            navData: [Config.navs.lab, {
                'name': this.$route.query.name,
                'url': '/index/app/opentime?id=' + this.$route.query.id + '&name=' + this.$route.query.name
            }],
            visible: false,
            form: {
                day: '',
                allowHours: '',
                laboratoryId: this.$route.query.id
            },
            chooseTimeZone: [],
            availableTimeZone: Lab.timeZone(),
            dateResMap: {},
            currentMonth: ''
        }
    },
    mounted: function () {
        this.currentMonth = this.dayjs().format('YYYY-MM')
        this.refresh()
    },
    methods: {
        topBtn(date) {
            this.currentMonth = this.dayjs(date).format('YYYY-MM')
            this.refresh()
        },
        getMonthData(month, laboratoryId) {
            Lab.getOpenTime(month, laboratoryId).then(res => {
                this.dateResMap = res
            })
        },
        setOpenTime(date) {
            this.form.day = date
            this.chooseTimeZone = []
            this.visible = true
            this.$nextTick(() => {
                Lab.getOpenTimeByDay(date, this.$route.query.id).then(res => {
                    if (res.empty) {
                        //如果没有设置,默认是开放所有时段
                        this.chooseTimeZone = Lab.timeZone().map(zone => zone.id)
                    } else {
                        res.laboratory_opening.allowHours.split(',').forEach(zoneId => {
                            this.chooseTimeZone.push(Number(zoneId))
                        })
                    }
                })
            })
        },
        setCommit() {
            if (this.chooseTimeZone.length === 0) {
                this.$notify.error({title: '错误', message: '请选择开放时段'});
            } else {
                this.form.allowHours = this.chooseTimeZone.toString()
                Lab.setOpenTime(this.form).then(() => {
                    this.$message.success('设定完成')
                    this.refresh()
                    this.visible = false
                })
            }
        },
        refresh() {
            this.getMonthData(this.currentMonth, this.$route.query.id)
        }
    },
    components: {MyCalendar, NavComponent}
}
</script>

<style scoped>
.day {
    height: 100%;
    width: 100%;
    position: relative;
}

.day-sign {
    float: left;
}

.info {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    color: #F56C6C;
    position: absolute;
}

.time-zone {
    width: 30%;
    margin-bottom: 10px !important;
    margin-left: 0 !important;
    margin-right: 18px
}
</style>