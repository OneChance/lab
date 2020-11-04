<template id="index">
    <div class="mobile-div">
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item class="mobile-item" prop="no">
                <el-input v-model="form.no" placeholder="学号"></el-input>
            </el-form-item>
            <el-form-item class="mobile-item" prop="password">
                <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-button type="success" plain @click="login" class="mobile-item">登陆</el-button>
            <el-button type="warning" plain @click="changePassword" class="mobile-item">修改密码</el-button>
        </el-form>
    </div>
</template>

<script>

import App from "../script/app";

export default {
    created: function () {

    },
    data: function () {
        return {
            form: {
                no: '',
                password: '',
            },
            rules: {
                no: [
                    {required: true, message: '请输入学号', trigger: 'change'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'change'},
                ],
            }
        }
    },
    mounted: function () {

    },
    methods: {
        login() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log(this.form)
                    /*localStorage.setItem("apm_token", res.token);
                    this.$cookie.set('apm_token', res.token);*/
                }
            });
        },
        changePassword() {
            App.vueG.$router.push('/changePasswordM').catch(err => err)
        }
    },
    components: {},
}
</script>

<style scoped>

</style>
