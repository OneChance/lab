<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                <el-form-item label="总学习时长(小时)" prop="studyTime">
                    <el-input v-model="form.studyTime" placeholder="参加考试要求的总学习时长" style="width: 30%"></el-input>
                </el-form-item>
                <el-form-item label="考试时长(小时)" prop="duration">
                    <el-input v-model="form.duration" placeholder="考试时长" style="width: 30%"></el-input>
                </el-form-item>
                <el-form-item label="允许考试次数" prop="times">
                    <el-input v-model="form.times" placeholder="允许考试次数" style="width: 30%"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="commit">设置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>

import FormValidator from '../../script/client/formValidator'

export default {
    name: "ExamSetting",
    data: function () {
        return {
            form: {
                times: '',
                duration: '',
                studyTime: ''
            },
            rules: {
                studyTime: [
                    {validator: FormValidator.positiveInteger, trigger: 'blur'}
                ],
                duration: [
                    {validator: FormValidator.positiveInteger, trigger: 'blur'}
                ],
                times: [
                    {validator: FormValidator.positiveInteger, trigger: 'blur'}
                ],
            },
        }
    },
    mounted: function () {

    },
    methods: {
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log(this.form)
                }
            })
        },
    },
    components: {}
}
</script>

<style scoped>

</style>