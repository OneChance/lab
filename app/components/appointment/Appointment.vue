<template>
    <el-card class="box-card mobile-card">
        <el-form :model="form">
            <el-form-item prop="appointmentDate">
                <el-date-picker v-model="aForm.appointmentDate"
                                format="yyyy-MM-dd"
                                @change="dateChoose"
                                value-format="yyyy-MM-dd" type="date" placeholder="选择预约时间">
                </el-date-picker>
            </el-form-item>

            <el-checkbox-group v-model="aForm.chooseTimeZone">
                <el-checkbox :label="zone.id" border v-for="zone of this.availableTimeZone"
                             :key="zone.id"
                             class="time-zone">{{ zone.name }}
                </el-checkbox>
            </el-checkbox-group>


            <el-button type="primary" plain class="btn-mobile-full" @click="commitAppointment">提交预约</el-button>
        </el-form>

    </el-card>
</template>

<script>

export default {
    data: function () {
        return {
            aForm: {
                appointmentDate: '',
                chooseTimeZone: []
            },
            availableTimeZone: [
                {id: 1, name: '8:00--9:00'},
                {id: 2, name: '9:00--10:00'},
                {id: 3, name: '10:00--11:00'},
                {id: 4, name: '11:00--12:00'},
                {id: 5, name: '12:00--13:00'},
                {id: 6, name: '13:00--14:00'},
                {id: 7, name: '14:00--15:00'},
                {id: 8, name: '15:00--16:00'},
                {id: 9, name: '16:00--17:00'},
                {id: 10, name: '17:00--18:00'},
            ],
        }
    },
    watch: {},
    methods: {
        dateChoose(date) {
            this.aForm.appointmentDate = date
        },
        commitAppointment() {
            if (!this.aForm.appointmentDate) {
                this.$message.error('请选择预约日期');
            } else if (this.aForm.chooseTimeZone.length === 0) {
                this.$message.error('请选择预约时段');
            } else if (this.aForm.chooseTimeZone.length > 2) {
                this.$message.error('选择的时段不能超过2小时');
            } else if (this.aForm.chooseTimeZone.length === 2 && Math.abs(this.aForm.chooseTimeZone[0] - this.aForm.chooseTimeZone[1]) !== 1) {
                this.$message.error('必须选择相邻的时段');
            } else {
                console.log(this.aForm.chooseTimeZone)
            }
        }
    },
    mounted: function () {

    },
}
</script>

<style scoped>
.time-zone {
    width: 100%;
    margin-bottom: 10px !important;
    margin-left: 0 !important;
}
</style>
