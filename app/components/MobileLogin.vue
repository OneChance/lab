<template id="index">
    <div class="mobile-div">
        <el-form :model="form" :rules="rules" ref="form" class="login">
            <el-form-item class="mobile-item" prop="name" v-if="!form.guest">
                <el-input v-model="form.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item class="mobile-item" prop="username"
                          :rules="{ required: true, message: '请输入' + usernameText, trigger: 'change'}">
                <el-input v-model="form.username" :placeholder="usernameText">
                </el-input>
            </el-form-item>
            <el-form-item class="mobile-item" prop="password">
                <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-button type="success" plain @click="login" class="mobile-item">登陆</el-button>
            <el-link type="success" @click="changeType">{{ loginTypeText }}</el-link>
        </el-form>
    </div>
</template>

<script>

import Account from "../script/server/account";

export default {
    created: function () {

    },
    data: function () {
        return {
            form: {
                username: '',
                password: '',
                name: '',
                guest: false,
            },
            usernameText: '学号',
            loginTypeText: '切换到访客登陆',
            rules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'change'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'change'},
                ],
            }
        }
    },
    mounted: function () {
        document.title = '登录'
    },
    methods: {
        login() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    Account.signIn(this.form).then(res => {
                        localStorage.setItem("ssm_token", res.token);
                        this.$cookie.set('ssm_token', res.token);
                        this.$router.push(localStorage.getItem('currentPath')).catch(err => err)
                    });
                }
            });
        },
        changeType() {
            this.form.guest = !this.form.guest
            this.usernameText = this.form.guest ? '用户名' : '学号'
            this.loginTypeText = this.form.guest ? '切换到学生登陆' : '切换到访客登陆'
        }
    },
    components: {},
}
</script>

<style scoped>
.login {
    /*margin-top: 20vh;*/
    height: calc(100vh - 20px);
    text-align: center;
}
</style>
