<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="success" @click="add">新增</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <!--信息Dialog-->
        <el-dialog title="值班教师信息"
                   :visible.sync="userInfoDialogVisible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="state">
                        <el-radio-group v-model="form.state">
                            <el-radio-button label="NORMAL">正常</el-radio-button>
                            <el-radio-button label="DISABLE">禁用</el-radio-button>
                            <el-radio-button label="DELETE">删除</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="form.sex">
                            <el-radio-button label="男">男</el-radio-button>
                            <el-radio-button label="女">女</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="telphone">
                        <el-input v-model="form.telphone"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userInfoDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="commit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import User from "../../script/server/user";
import TableComponent from "../util/TableComponent";
import Config from "../../script/config";
import Common from '../../script/common';
import Status from "../../script/client/status";

export default {
    name: "SysUser",
    props: ['type'],
    data: function () {
        return {
            query: {
                userName: ''
            },
            addUser: true,
            form: {
                id: '',
                name: '',
                sex: '',
                state: 'NORMAL',
                email: '',
                telphone: '',
                type: 'TEACHER',
                login: false,
            },
            rules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '姓名'},
                    {prop: 'telphone', label: '联系方式'},
                    {
                        prop: 'state',
                        label: '状态',
                        width: '70',
                        formatter: Status.stateFormatter,
                        tag: true,
                        tagType: Status.stateTagFormatter,
                        tagSize: 'small'
                    },
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.edit,
                    },
                ]
            },
            userInfoDialogVisible: false
        }
    },
    mounted: function () {
        this.list()
    },
    methods: {
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.addUser) {
                        User.saveUser(this.form).then(() => {
                            this.operSuccess(this)
                            this.userInfoDialogVisible = false;
                        })
                    } else {
                        User.updateUser(this.form).then(() => {
                            this.operSuccess(this)
                            this.userInfoDialogVisible = false;
                        })
                    }
                }
            })
        },
        toPage: function (val) {
            this.list({page: val})
        },
        add: function () {
            this.userInfoDialogVisible = true
            this.addUser = true
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
                this.form.id = ''
            });
        },
        edit: function (row) {
            User.getUser({id: row.id}).then(result => {
                this.userInfoDialogVisible = true
                this.form = result.user
                this.addUser = false
            })
        },
        delete: function (row) {
            User.deleteUser({id: row.id}).then(() => {
                this.operSuccess(this)
            })
        },
        operSuccess(comp) {
            comp.dialogVisible = false
            comp.$message({
                message: '操作成功',
                type: 'success'
            });
            comp.list({page: 1})
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            data.type = 'TEACHER';
            data.login = false
            User.getUsers(data).then(res => {
                this.tableConfig.data = res.list
                this.tableConfig.total = res.count
            })
        },
    },
    components: {
        TableComponent
    }
}
</script>

<style scoped>

</style>