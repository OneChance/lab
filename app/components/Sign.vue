<template id="login">
    <div>
        <div class="center">
            <el-card class="box-card login-card">
                <div slot="header" class="clearfix header">
                    <span class="sign-title">实验室管理系统</span>
                </div>
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item prop="name">
                        <el-input v-model="form.name" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="sign-btn sign-local-btn" @click="signIn">
                            登陆
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="sign-btn" @click="authCenter">统一身份认证</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="foot">2020 版权所有 TEST</div>
    </div>
</template>

<script>

import Account from '../script/server/account.js'

export default {
    data: function () {
        return {
            form: {
                name: '',
                password: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ],
            },
        }
    },
    methods: {
        signIn: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    Account.signIn({
                        username: this.form.name,
                        password: this.form.password
                    }).then(this.signCallback);
                }
            });
        },
        authCenter: function () {
            window.location.href = "https://uaaap.yzu.edu.cn/cas/login?service=http%3a%2f%2fdemo.ceeg.cn/sys/index.page";
        },
        signCallback: function (res) {
            if (res) {
                //保存token
                localStorage.setItem("ssm_token", res.token);
                this.$cookie.set('ssm_token', res.token);
                this.$router.push('index').catch(err => err)
            }
        },
    },
    mounted: function () {
    },
}
</script>

<style scoped>

.login-card {
    width: 350px;
    height: 350px;
    margin-top: 160px;
}

.sign-title {
    font-size: x-large;
    color: #347dd6;
    font-weight: 700;
}

.header {
    text-align: center;
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}

.sign-btn {
    width: 100%;
}

.center {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-color: #f7f3f3;
    display: flex;
    justify-content: center;
}

.logo img {
    vertical-align: middle;
    padding-right: 10px;
}

.logo span {
    border-left: 1px solid #b9bfcf;
    padding-left: 10px;
}

.foot {
    text-align: center;
    margin-top: 40px;
    font-size: 12px;
    position: absolute;
    bottom: 30px;
    left: calc(50% - 55px);
    color: #347dd6;
}

.sign-local-btn {
    margin-bottom: 10px;
}
</style>
