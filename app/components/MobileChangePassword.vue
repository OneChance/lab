<template id="index">
    <div class="mobile-div">
        <el-form :model="form" :rules="rules" ref="form" class="full-height">
            <el-form-item class="mobile-item" prop="passwordNew">
                <el-input type="password" v-model="form.passwordNew" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item class="mobile-item" prop="passwordConfirm">
                <el-input type='password' v-model="form.passwordConfirm" placeholder="确认密码"></el-input>
            </el-form-item>
            <el-button type="success" plain @click="change" class="mobile-item">确定修改</el-button>
            <el-button type="warning" plain @click="cancel" class="mobile-item">取消</el-button>
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
                passwordNew: '',
                passwordConfirm: '',
            },
            rules: {
                passwordNew: [
                    {required: true, message: '请输入新密码', trigger: 'change'},
                ],
                passwordConfirm: [
                    {required: true, message: '请输入确认密码', trigger: 'change'},
                ],
            }
        }
    },
    mounted: function () {
        document.title = '修改密码'
    },
    methods: {
        change() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.passwordNew !== this.form.passwordConfirm) {
                        this.$message({
                            message: '新密码与确认密码不一致',
                            type: 'error'
                        });
                    } else {
                        Account.updatePassword({
                            password: this.form.passwordNew
                        }).then(() => {
                            this.$message({
                                message: '密码已修改',
                                type: 'success'
                            });
                            this.$router.push('/wx/my').catch(err => err)
                        })
                    }
                }
            });
        },
        cancel() {
            this.$router.push('/wx/my').catch(err => err)
        }
    },
    components: {},
}
</script>

<style scoped>

</style>
