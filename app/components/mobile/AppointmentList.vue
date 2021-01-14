<template>
    <div>
        <table v-for="appointment of appointments" :key="appointment.id" class="form-table mobile-item mobile-table"
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
                  title="无记录"
                  type="info"
                  center
                  show-icon
                  :closable="false">
        </el-alert>
    </div>
</template>

<script>
export default {
    name: "AppointmentList",
    props: ['appointments', 'cancel', 'rate']
}
</script>

<style scoped>

</style>