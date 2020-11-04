<template id="index">
    <div class="mobile-div">
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item class="mobile-item" prop="no">
                <el-input v-model="form.no" placeholder="学号"></el-input>
            </el-form-item>
            <el-form-item class="mobile-item" prop="passwordOld">
                <el-input type="password" v-model="form.passwordOld" placeholder="原密码"></el-input>
            </el-form-item>
            <el-form-item class="mobile-item" prop="passwordNew">
                <el-input type="password" v-model="form.passwordNew" placeholder="新密码"></el-input>
            </el-form-item>
            <el-button type="success" plain @click="change" class="mobile-item">确定修改</el-button>
            <el-button type="warning" plain @click="cancel" class="mobile-item">取消</el-button>
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
                passwordOld: '',
                passwordNew: ''
            },
            rules: {
                no: [
                    {required: true, message: '请输入学号', trigger: 'change'},
                ],
                passwordOld: [
                    {required: true, message: '请输入原密码', trigger: 'change'},
                ],
                passwordNew: [
                    {required: true, message: '请输入新密码', trigger: 'change'},
                ],
            }
        }
    },
    mounted: function () {

    },
    methods: {
        change() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$message({
                        showClose: true,
                        message: '密码修改成功!',
                        type: 'success',
                        duration: 3000
                    });
                    App.vueG.$router.push('/loginM').catch(err => err)
                }
            });
        },
        cancel() {
            App.vueG.$router.push('/loginM').catch(err => err)
        }
    },
    components: {},
}
</script>

<style scoped>

</style>
