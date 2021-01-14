<template>
    <div class="mobile-div">
        <div class="full-height mobile">
            <el-tabs v-model="activeIndex" @tab-click="typeChoose" type="card">
                <el-tab-pane label="预约中" name="ing">
                    <appointment-list v-bind:appointments="ings" v-bind:cancel="cancel"></appointment-list>
                </el-tab-pane>
                <el-tab-pane label="已结束" name="complete">
                    <appointment-list v-bind:appointments="completes" v-bind:rate="rate"></appointment-list>
                </el-tab-pane>
                <el-tab-pane label="已评价" name="rated">已评价</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>


<script>

import Appointment from "../../script/server/manage/appointment";
import Config from "../../script/config"
import Common from "../../script/common"
import Lab from "../../script/server/manage/lab"
import AppointmentList from "./AppointmentList";

export default {
    name: "Appointments",
    data: function () {
        return {
            activeIndex: 'ing',
            appointments: [],
            ings: [],
            completes: [],
            rateds: [],
        }
    },
    filters: {
        formatZone: function (val) {
            return Lab.timeZone().filter(z => z.id === val)[0].name
        }
    },
    mounted: function () {
        this.list()
        document.title = '我的预约'
        if (this.$route.query.activeIndex) {
            this.activeIndex = this.$route.query.activeIndex
        }
    },
    methods: {
        splitAppointment(list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].bookHour2) {
                    let another = Common.copyObject(list[i])
                    another.bookHour = another.bookHour2
                    another.bookHour2 = ''
                    another.teacherId = another.teacherId2
                    another.teacherId2 = ''
                    list[i].bookHour2 = ''
                    list[i].teacherId2 = ''
                    this.appointments.push(list[i])
                    this.appointments.push(another)
                } else {
                    this.appointments.push(list[i])
                }
            }
            //检查当前时间是否超过预约开始时间提前一天，隐藏取消预约按钮
            //检查当前时间是否超过预约结束时间，显示评价按钮
            this.appointments.forEach(a => {
                a.cancelable = !this.dayjs().isAfter(this.dayjs(a.bookDay + ' ' + (a.bookHour < 10 ? '0' + a.bookHour : a.bookHour) + ':00:00').subtract(24, 'hour'))
            })
            this.appointments.forEach(a => {
                a.markable = this.dayjs().isAfter(this.dayjs(a.bookDay + ' ' + ((a.bookHour + 1) < 10 ? '0' + (a.bookHour + 1) : (a.bookHour + 1)) + ':00:00'))
            })

            this.ings = this.appointments.filter(a => !a.markable)
            //可评价且未评价的
            this.completes = this.appointments.filter(a => a.markable)
        },
        rate(appointment) {
            this.$router.push({
                path: 'teacherRate',
                query: {bookId: appointment.id, bookHour: appointment.bookHour, teacherId: appointment.teacherId}
            }).catch(err => err);
        },
        cancel(appointment) {
            this.$confirm('是否取消【' + appointment.laboratory.name + '】【' + appointment.bookDay + '】【' + this.$options.filters.formatZone(appointment.bookHour) + '】的预约?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let update = {}
                let aList = this.appointments.filter(a => a.id === appointment.id)
                if (aList.length === 1) {
                    Appointment.delete({id: appointment.id}).then(res => {
                        this.cancelOk(appointment)
                    })
                } else {
                    update = aList.filter(a => a.bookHour !== appointment.bookHour)[0]
                    Appointment.save(update).then(res => {
                        this.cancelOk(appointment)
                    })
                }
            }).catch(() => {
            });
        },
        cancelOk(appointment) {
            this.ings = this.ings.filter(a => (a.id !== appointment.id || a.bookHour !== appointment.bookHour))
            Common.message(this, 'success', '预约已取消', true)
        },
        list() {
            this.appointments = []
            Appointment.gets(Config.allPage).then(res => {
                let appointments = res.list
                this.splitAppointment(appointments)
            })
        },
        typeChoose() {
            this.$router.push({
                path: 'appointments',
                query: {activeIndex: this.activeIndex}
            }).catch(err => err);
        }
    },
    components: {
        AppointmentList
    },
}
</script>

<style scoped>

</style>