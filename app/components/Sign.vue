<template id="login">
    <div>
        <div class="center">
            <el-card class="box-card login-card">
                <div slot="header" class="clearfix header">
                    <span class="sign-title">实验管理系统</span>
                </div>
                <el-form :model="form">
                    <el-form-item>
                        <el-input v-model="name" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" class="sign-btn sign-local-btn" @click="signIn" disabled="disabled">
                            登陆
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" class="sign-btn" @click="authCenter">统一身份认证</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="foot">2020 版权所有 TEST</div>
    </div>
</template>

<script>

import Account from '../script/server/account.js'
import App from '../script/app.js'
import md5 from 'js-md5';

export default {
    data: function () {
        return {
            name: '',
            password: ''
        }
    },
    watch: {
        name: function () {
            this.checkInput();
        },
        password: function () {
            this.checkInput();
        }
    },
    methods: {
        checkInput: function () {
            if (this.password && this.name) {
                $(".sign-local-btn").removeAttr("disabled").removeClass("is-disabled")
            } else {
                $(".sign-local-btn").attr("disabled", "disabled").addClass("is-disabled")
            }
        },
        signIn: function () {
            /*Account.signIn({
                username: this.name,
                password: md5(this.password)
            }).then(this.signCallback);*/
            console.log(this.name)
            if (this.name === '1') {
                App.router.$router.push('index').catch(err => err)
            } else {
                App.router.$router.push('application').catch(err => err)
            }
        },
        authCenter: function () {
            window.location.href = "https://uaaap.yzu.edu.cn/cas/login?service=http%3a%2f%2fdemo.ceeg.cn/sys/index.page";
        },
        signCallback: function (res) {
            if (res) {
                //保存token
                localStorage.setItem("apm_token", res.token);
                this.$cookie.set('apm_token', res.token);
                App.router.$router.push('index').catch(err => err)
            }
        },
    },
    mounted: function () {
        let comp = this
        $(document).on('keydown', (e) => {
            if (e.keyCode === 13) {
                if (comp.password && comp.name) {
                    comp.signIn();
                }
            }
        });
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
    color: #2f673c;
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
    color: #2f673c;
}

.sign-local-btn {
    margin-bottom: 10px;
}
</style>
