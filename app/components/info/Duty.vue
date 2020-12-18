<template>
    <div>
        <el-card class="box-card box-card-no-nav">
            <my-calendar v-model="value" ref="c">
                <template
                    slot="dateCell"
                    slot-scope="{date, data}">
                    <div class="day" slot="reference" @click="setDayTeachers(data.day)">
                        <div class="day-sign">{{ Number(data.day.split('-')[2]) }}</div>
                        <div class="teachers">
                            <el-tag v-for="teacher of getDayTeachers(data.day)" size="mini" type="success"
                                    :key="teacher.id"
                                    class="teacher">
                                {{ teacher.name }}
                            </el-tag>
                        </div>
                    </div>
                </template>
            </my-calendar>
        </el-card>

        <el-dialog :title="form.date+' 值班老师'"
                   width="30%"
                   :visible.sync="visible">
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

export default {
    name: "Duty",
    data: function () {
        return {
            visible: false,
            teachers: [
                {id: 1, name: '张圣诞'},
                {id: 2, name: '啥都付'},
                {id: 3, name: '啥都付的'}
            ],
            form: {
                date: '',
                day: '',
                afternoon: '',
                night: ''
            },
            serverData: [
                {
                    date: '2020-12-04',
                    teachers: {
                        day: {id: 1, name: '张圣诞'},
                        afternoon: {id: 2, name: ' 刀锋山'},
                        night: {id: 3, name: '一体化'}
                    }
                }
            ],
            dayTeachers: {},
        }
    },
    mounted: function () {

    },
    methods: {
        getDayTeachers(date) {
            let tList = []
            if (date === '2020-12-04') {
                let dayTeachers = this.serverData.filter(data => data.date === date)[0]
                if (dayTeachers) {
                    let teachers = dayTeachers.teachers
                    if (teachers.day) {
                        tList.push(teachers.day)
                    }
                    if (teachers.afternoon) {
                        tList.push(teachers.afternoon)
                    }
                    if (teachers.night) {
                        tList.push(teachers.night)
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
    components: {MyCalendar}
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