<template>
    <div class="mobile-div">
        <el-form ref="form" :model="form" :rules="rules" class="full-height">
            <el-form-item>
                <el-select v-model="form.laboratory.id" placeholder="请选择实验室" class="mobile-item" @change="chooseLab">
                    <el-option
                        v-for="lab in labs"
                        :key="lab.id"
                        :label="lab.name"
                        :value="lab.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="appointmentDate">
                <el-date-picker v-model="form.bookDay"
                                format="yyyy-MM-dd"
                                @change="dateChoose"
                                class="mobile-item"
                                :disabled="dateDisable"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd" type="date" :placeholder="chooseDateTip">
                </el-date-picker>
            </el-form-item>

            <el-checkbox-group v-model="chooseTimeZone">
                <el-checkbox :label="zone.id" border v-for="zone of this.availableTimeZone"
                             :key="zone.id"
                             class="time-zone">{{ zone.name }}
                </el-checkbox>
            </el-checkbox-group>


            <el-button type="primary" plain class="btn-mobile-full" @click="commitAppointment">提交预约</el-button>
        </el-form>

    </div>
</template>

<script>

import Lab from "../../script/server/manage/lab"
import Config from "../../script/config"
import Common from "../../script/common"
import Appointment from "../../script/server/manage/appointment";
import App from "../../script/app";

export default {
    data: function () {
        return {
            form: {
                laboratory: {id: ''},
                bookDay: '',
                bookHour: '',
                bookHour2: '',
            },
            availableTimeZone: [],
            labs: [],
            pickerOptions: {
                disabledDate: time => {
                    return this.disabled(time)
                }
            },
            chooseTimeZone: [],
            aviStart: '',
            aviEnd: '',
            applyBookingDates: [],
            dateDisable: true,
            chooseDateTip: '选择预约时间(先选择实验室)'
        }
    },
    watch: {},
    methods: {
        disabled: function (time) {
            return !this.applyBookingDates.includes(this.dayjs(time).format('YYYY-MM-DD'))
        },
        dateChoose(date) {
            this.form.bookDay = date
        },
        commitAppointment() {
            if (!this.form.laboratory.id) {
                Common.message(this, 'error', '请选择实验室', true);
            } else if (!this.form.bookDay) {
                Common.message(this, 'error', '请选择预约日期', true);
            } else if (this.chooseTimeZone.length === 0) {
                Common.message(this, 'error', '请选择预约时段', true);
            } else if (this.chooseTimeZone.length > 2) {
                Common.message(this, 'error', '选择的时段不能超过2小时', true);
            } else {
                this.form.bookHour = this.chooseTimeZone[0]
                if (this.chooseTimeZone.length === 2) {
                    this.form.bookHour2 = this.chooseTimeZone[1]
                } else {
                    this.form.bookHour2 = ''
                }
                Appointment.save(this.form).then(res => {
                    Common.message(this, 'success', '预约成功!', true)
                    App.vueG.$router.push('/wx/appointments').catch(err => err)
                })
            }
        },
        chooseLab(labId) {
            Lab.get({id: labId}).then(res => {
                let zondIds = res.laboratory.allowHours.split(",")
                this.availableTimeZone = Lab.timeZone().filter(lab => zondIds.includes(String(lab.id)))
                if (res.laboratory.applyBookingDates) {
                    this.applyBookingDates = res.laboratory.applyBookingDates
                    this.dateDisable = false
                    this.chooseDateTip = '选择预约时间'
                }
            })
        }
    },
    mounted: function () {
        Lab.gets(Config.allPage).then(res => {
            this.labs = res.list
        })
        document.title = '实验室预约'
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
