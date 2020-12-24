<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                <el-form-item label="总学习时长(分钟)" prop="learn">
                    <el-input v-model="form.learn" placeholder="参加考试要求的总学习时长" style="width: 30%"></el-input>
                </el-form-item>
                <el-form-item label="考试时长(分钟)" prop="duration">
                    <el-input v-model="form.duration" placeholder="考试时长" style="width: 30%"></el-input>
                </el-form-item>
                <el-form-item label="允许考试次数" prop="maxCount">
                    <el-input v-model="form.maxCount" placeholder="允许考试次数" style="width: 30%"></el-input>
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
import Exam from '../../script/server/manage/exam'

export default {
    name: "ExamSetting",
    data: function () {
        return {
            form: {
                id: '',
                maxCount: '',
                duration: '',
                learn: ''
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
        Exam.getSettings().then(res => {
            this.form = res.exam
            this.form.learn = this.form.learn / 60
            this.form.duration = this.form.duration / 60
        })
    },
    methods: {
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    Exam.commitSettings({
                        id: this.form.id,
                        learn: this.form.learn * 60,
                        duration: this.form.duration * 60,
                        maxCount: this.form.maxCount
                    }).then(() => {
                        this.$message({
                            message: '设定已更新!',
                            type: 'success'
                        });
                    })
                }
            })
        },
    },
    components: {}
}
</script>

<style scoped>

</style>