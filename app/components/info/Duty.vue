<template>
    <div>

        <nav-component v-bind:data="navData"></nav-component>

        <el-card class="box-card box-card-no-nav back-man-card">
            <my-calendar v-model="value" ref="c" v-bind:top-btn-event="topBtn">
                <template
                    slot="dateCell"
                    slot-scope="{date, data}">
                    <div class="day" slot="reference" @click="setDayTeachers(data.day)">
                        <div class="day-sign">{{ Number(data.day.split('-')[2]) }}</div>
                        <div class="teachers">
                            <el-tag v-for="dt of dayTeachers[data.day]" size="mini" :type="dayType(dt.type)"
                                    :key="dt.type"
                                    class="teacher">
                                {{ dt.value.name }}
                            </el-tag>
                        </div>
                    </div>
                </template>
            </my-calendar>
        </el-card>

        <el-dialog :title="form.date+' 值班老师'"
                   width="30%"
                   :visible.sync="visible"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="上午" prop="day">
                    <el-select v-model="form.day" filterable placeholder="请选择" class="teacher-select">
                        <el-option
                            v-for="teacher in teachers"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下午" prop="afternoon">
                    <el-select v-model="form.afternoon" filterable placeholder="请选择" class="teacher-select">
                        <el-option
                            v-for="teacher in teachers"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="晚上" prop="night">
                    <el-select v-model="form.night" filterable placeholder="请选择" class="teacher-select">
                        <el-option
                            v-for="teacher in teachers"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id">
                        </el-option>
                    </el-select>
                </el-form-item>
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
            navData: [Config.navs.duty, {
                'name': this.$route.query.name,
                'url': '/index/app/duty?id=' + this.$route.query.id + '&name=' + this.$route.query.name
            }],
            visible: false,
            form: {
                date: '',
                day: '',
                afternoon: '',
                night: ''
            },
            dayTeachers: {},
        }
    },
    mounted: function () {
        this.getMonthData(this.dayjs().month() + 1)
    },
    methods: {
        topBtn(date) {
            this.getMonthData(this.dayjs(date).month() + 1)
        },
        getMonthData(month) {
            Lab.getDayTeachers(month).then(res => {
                this.dayTeachers = res
            })
        },
        dayType(type) {
            switch (type) {
                case 'day':
                    return 'success'
                case 'afternoon':
                    return 'warning'
                case 'night':
                    return 'primary'
                default:
                    return ''
            }
        },
        getDayTeachers(date) {
            let tList = []
            if (date === '2020-12-04') {
                let dayTeachers = this.serverData.filter(data => data.date === date)[0]
                if (dayTeachers) {
                    let teachers = dayTeachers.teachers
                    if (teachers.day) {
                        tList.push({type: 'day', value: teachers.day})
                    }
                    if (teachers.afternoon) {
                        tList.push({type: 'afternoon', value: teachers.afternoon})
                    }
                    if (teachers.night) {
                        tList.push({type: 'night', value: teachers.night})
                    }
                }
            }
            return tList
        },
        setDayTeachers(date) {
            this.visible = true
            this.form.date = date
            this.$nextTick(() => {

            })
        },
        setCommit() {
            this.visible = false
        }
    },
    components: {MyCalendar, NavComponent}
}
</script>

<style scoped>
.day {
    height: 100%;
    width: 100%;
}

.day-sign {
    float: left;
}

.teachers {
    float: right;
    width: 75%;
}

.teacher {
    width: 70px;
    text-align: center;
}

.teacher-select {
    width: 80%;
}
</style>