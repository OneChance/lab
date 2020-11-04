<template id="index">
    <div class="mobile-div">
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item class="mobile-item" prop="no">
                <el-input v-model="form.no" placeholder="学号"></el-input>
            </el-form-item>
            <el-button type="success" plain @click="bind" class="btn-mobile-full">绑定</el-button>
        </el-form>
    </div>
</template>

<script>

export default {
    created: function () {

    },
    data: function () {
        return {
            form: {
                no: '',
            },
            rules: {
                no: [
                    {required: true, message: '请输入学号', trigger: 'change'},
                ],
            }
        }
    },
    mounted: function () {

    },
    methods: {
        bind() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    alert('submit!');
                }
            });
        }
    },
    components: {},
}
</script>

<style scoped>

</style>
