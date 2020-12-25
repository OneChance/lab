<template>
    <div class="mobile-div">
        <div class="full-height">
            <table v-for="appointment of appointments" :key="appointment.id" class="form-table mobile-item"
                   v-if="appointments.length>0">
                <tr>
                    <th style="width: 30%">实验室</th>
                    <td>{{ appointment.laboratory.name }}</td>
                </tr>
                <tr>
                    <th style="width: 30%">日期</th>
                    <td>{{ appointment.bookDay }}</td>
                </tr>
                <tr>
                    <th style="width: 30%">时间段</th>
                    <td>{{ appointment.bookHour | formatZone }}</td>
                </tr>
                <tr v-if="appointment.cancelable">
                    <td colspan="2">
                        <el-button type="danger" plain class="mobile-item-width"
                                   @click="cancel(appointment)">取消预约
                        </el-button>
                    </td>
                </tr>
                <tr v-if="appointment.markable">
                    <td colspan="2">
                        <el-button type="success" plain class="mobile-item-width"
                                   @click="rate(appointment)">值班教师评价
                        </el-button>
                    </td>
                </tr>
            </table>
            <el-alert v-if="appointments.length===0"
                      title="无预约记录"
                      type="info"
                      center
                      show-icon
                      :closable="false">
            </el-alert>
        </div>
    </div>
</template>


<script>

import Appointment from "../../script/server/manage/appointment";
import Config from "../../script/config"
import Common from "../../script/common"
import Lab from "../../script/server/manage/lab"

export default {
    name: "Appointments",
    data: function () {
        return {
            appointments: []
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
    },
    methods: {
        splitAppointment(list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].bookHour2) {
                    let another = Common.copyObject(list[i])
                    another.bookHour = another.bookHour2
                    another.bookHour2 = ''
                    list[i].bookHour2 = ''
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
        },
        rate(appointment) {
            this.$router.push({path: 'teacherRate', query: {id: appointment.id}}).catch(err => err);
        },
        cancel(appointment) {
            this.$confirm('是否取消' + appointment.laboratory.name + appointment.bookDay + '日' + this.$options.filters.formatZone(appointment.bookHour) + '的预约?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let update = {}
                let aList = this.appointments.filter(a => a.id === appointment.id)
                if (aList.length === 1) {
                    Appointment.delete({id: appointment.id}).then(res => {
                        this.cancelOk()
                    })
                } else {
                    update = aList.filter(a => a.bookHour !== appointment.bookHour)[0]
                    Appointment.save(update).then(res => {
                        this.cancelOk()
                    })
                }
            }).catch(() => {
            });
        },
        cancelOk() {
            Common.message(this, 'success', '预约已取消', true)
            this.list()
        },
        list() {
            this.appointments = []
            Appointment.gets(Config.allPage).then(res => {
                let appointments = res.list
                this.splitAppointment(appointments)
            })
        }
    },
    components: {},
}
</script>

<style scoped>

</style>