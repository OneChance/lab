<template id="index">
    <div class="mobile-div">
        <el-form :model="form" :rules="rules" ref="form" class="login">
            <el-form-item class="mobile-item" prop="name">
                <el-input v-model="form.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item class="mobile-item" prop="username">
                <el-input v-model="form.username" placeholder="学号"></el-input>
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
            },
            rules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'change'},
                ],
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
                    Account.signIn(this.form).then(res => {
                        localStorage.setItem("ssm_token", res.token);
                        this.$cookie.set('ssm_token', res.token);
                        this.$router.push(localStorage.getItem('currentPath')).catch(err => err)
                    });
                }
            });
        },
        changePassword() {
            this.$router.push('/wx/changePasswordM').catch(err => err)
        }
    },
    components: {},
}
</script>

<style scoped>
.login {
    /*margin-top: 20vh;*/
    height: calc(100vh - 20px);
}
</style>
