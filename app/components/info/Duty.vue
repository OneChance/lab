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
                <el-form-item label="上午" prop="amUserId">
                    <el-select v-model="form.amUserId" filterable clearable placeholder="请选择" class="teacher-select">
                        <el-option
                            v-for="teacher in teachers"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下午" prop="pmUserId">
                    <el-select v-model="form.pmUserId" filterable clearable placeholder="请选择" class="teacher-select">
                        <el-option
                            v-for="teacher in teachers"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="晚上" prop="ngUserId">
                    <el-select v-model="form.ngUserId" filterable clearable placeholder="请选择" class="teacher-select">
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
import User from '../../script/server/user'

export default {
    name: "Duty",
    data: function () {
        return {
            navData: [Config.navs.lab, {
                'name': this.$route.query.name,
                'url': '/index/app/duty?id=' + this.$route.query.id + '&name=' + this.$route.query.name
            }],
            visible: false,
            form: {
                id: '',
                date: '',
                amUserId: '',
                pmUserId: '',
                ngUserId: ''
            },
            dayTeachers: {},
            teachers: [],
            currentMonth: ''
        }
    },
    mounted: function () {
        this.currentMonth = this.dayjs().format('YYYY-MM')
        this.refresh()
        User.getAllTeacher().then(res => {
            this.teachers = res.list
        })
    },
    methods: {
        topBtn(date) {
            this.currentMonth = this.dayjs(date).format('YYYY-MM')
            this.refresh()
        },
        getMonthData(month, laboratoryId) {
            Lab.getDayTeachers(month, laboratoryId).then(res => {
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
        setDayTeachers(date) {
            this.visible = true
            this.form.date = date
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
                this.form.id = ''
                Lab.getDayTeachersByDay(date, this.$route.query.id).then(res => {
                    if (res.duty) {
                        this.form.id = res.duty.id
                        this.form.date = res.duty.date
                        this.form.amUserId = res.duty.amUser ? res.duty.amUser.id : ''
                        this.form.pmUserId = res.duty.pmUser ? res.duty.pmUser.id : ''
                        this.form.ngUserId = res.duty.ngUser ? res.duty.ngUser.id : ''
                    }
                })
            })
        },
        setCommit() {
            Lab.setDuty(this.form, this.$route.query.id).then(() => {
                this.$message.success('设定完成')
                this.refresh()
                this.visible = false
            })
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