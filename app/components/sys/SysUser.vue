<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.userName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="success" @click="add" v-if="type!=='sysuser'">新增</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <!--信息Dialog-->
        <el-dialog title="用户信息"
                   :visible.sync="userInfoDialogVisible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="单位名称" prop="thirdPartyName" v-if="type === 'intermediary'">
                        <el-input v-model="form.thirdPartyName"></el-input>
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
import Common from '../../script/common'
import md5 from 'js-md5';

export default {
    name: "SysUser",
    props: ['type'],
    data: function () {
        return {
            query: {
                userName: ''
            },
            form: {
                username: '',
                password: '888888',
                name: '',
                email: '',
                telphone: '',
                thirdPartyName: '',
                thirdParty: false,
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                ],
                thirdPartyName: [
                    {required: true, message: '请输入单位名称', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.delete,
                        check: true
                    }
                ]
            },
            userInfoDialogVisible: false
        }
    },
    mounted: function () {
        this.list()
        if (this.type === 'sysuser') {
            this.tableConfig.cols = [
                {prop: 'username', label: '用户名', width: '180'},
                {prop: 'name', label: '姓名', width: '180'},
                {prop: 'telphone', label: '联系方式', width: '180'},
            ]
        } else {
            this.tableConfig.cols = [
                {prop: 'thirdPartyName', label: '单位', width: '180'},
                {prop: 'name', label: '姓名', width: '180'},
                {prop: 'telphone', label: '联系方式', width: '180'},
            ]
        }
    },
    methods: {
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.form.password = md5(this.form.password)
                    User.saveUser(this.form).then(() => {
                        this.operSuccess(this)
                        this.userInfoDialogVisible = false;
                    })
                }
            })
        },
        toPage: function (val) {
            this.list({page: val})
        },
        add: function () {
            this.userInfoDialogVisible = true
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
            });
        },
        edit: function (row) {
            User.getUser({id: row.id}).then(result => {
                this.userInfoDialogVisible = true
                this.form = result.user
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
            //过滤用户类别
            data.thirdParty = this.type !== 'sysuser';
            User.getUsers(data).then(res => {
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
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