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
        <el-dialog title="学生信息"
                   :visible.sync="userInfoDialogVisible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="学号" prop="username">
                        <el-input v-model="form.username" placeholder="学号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type='password' v-model="form.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="state">
                        <el-radio-group v-model="form.state">
                            <el-radio-button label="NORMAL">正常</el-radio-button>
                            <el-radio-button label="DISABLE">禁用</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="学年" prop="overTerm.year">
                        <el-date-picker
                            v-model="form.overTerm.year"
                            type="year"
                            format="yyyy"
                            value-format="yyyy"
                            placeholder="选择学年">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="学期" prop="overTerm.num">
                        <el-select v-model="form.overTerm.num" placeholder="请选择">
                            <el-option
                                v-for="num in nums"
                                :key="num.value"
                                :label="num.label"
                                :value="num.value">
                            </el-option>
                        </el-select>
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

export default {
    name: "Student",
    data: function () {
        return {
            query: {
                username: ''
            },
            addUser: true,
            form: {
                username: '',
                password: '',
                state: '',
                name: '',
                overTerm: {year: '', num: ''},
                type: 'STUDENT'
            },
            rules: {
                username: [
                    {required: true, message: '请输入学号', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                'overTerm.year': [
                    {required: true, message: '请选择学年', trigger: 'change'},
                ],
                'overTerm.num': [
                    {required: true, message: '请选择学期', trigger: 'change'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '姓名'},
                    {
                        prop: 'state',
                        label: '状态',
                        width: '80',
                        formatter: this.stateFormatter,
                        tag: true,
                        tagType: this.stateTagFormatter,
                        tagSize: 'small'
                    },
                    {prop: 'term.year', label: '学期', formatter: this.termFormatter, formatterType: 'raw'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa danger-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.delete,
                        check: true
                    }
                ]
            },
            userInfoDialogVisible: false,
            nums: [{value: 1, label: '第一学期'}, {value: 2, label: '第二学期'}],
            passwordTemp: '',
        }
    },
    mounted: function () {
        this.list()
    },
    methods: {
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    //如果密码未修改,当前显示的是加密后的密码,保存时不在传递,防止重复加密
                    if (this.form.password === this.passwordTemp) {
                        this.form.password = ''
                    }
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
            });
        },
        edit: function (row) {
            User.getUser({id: row.id}).then(result => {
                this.userInfoDialogVisible = true
                this.$nextTick(() => {
                    result.user.overTerm.year = result.user.overTerm.year + ""
                    this.form = result.user
                    this.addUser = false
                    this.passwordTemp = result.user.password
                });
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
            data.type = 'STUDENT';
            User.getUsers(data).then(res => {
                this.tableConfig.data = res.list
                this.tableConfig.total = res.count
            })
        },
        termFormatter(row) {
            return row.overTerm.year + '年第' + row.overTerm.num + '学期'
        },
        stateTagFormatter(value) {
            switch (value) {
                case 'NORMAL':
                    return 'success'
                case 'DISABLE':
                    return 'warning'
                case 'DELETE':
                    return 'danger'
                default:
                    return ''
            }
        },
        stateFormatter(value) {
            switch (value) {
                case 'NORMAL':
                    return '正常'
                case 'DISABLE':
                    return '禁用'
                case 'DELETE':
                    return '删除'
                default:
                    return ''
            }
        },
    },
    components: {
        TableComponent
    }
}
</script>

<style scoped>

</style>