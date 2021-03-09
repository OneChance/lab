<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.username" placeholder="学号" style="width: 150px"></el-input>
                    <el-input v-model="query.name" placeholder="姓名" style="width: 150px"></el-input>
                    <el-select v-model="query.classes.id" filterable clearable placeholder="班级" style="width: 150px">
                        <el-option
                            v-for="classes in classesList"
                            :key="classes.id"
                            :label="classes.name"
                            :value="classes.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="query.classes.teacher.id" filterable clearable placeholder="实验室教师"
                               style="width: 150px">
                        <el-option
                            v-for="teacher in teachers"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="toQuery">查询</el-button>
                    <el-button type="success" @click="add">新增</el-button>
                    <el-button type="danger" @click="disableAll" plain>全部禁用</el-button>
                    <el-button type="success" @click="recoverAll" plain>全部恢复</el-button>
                    <el-upload
                        style="display: inline;margin-left: 10px"
                        :action="importAction"
                        name="formFile"
                        :on-success="importComplete"
                        :on-error="importError"
                        :before-upload="importStart"
                        :headers="uploadHeaders"
                        :limit="3"
                        :disabled="importDisable"
                        :show-file-list="false">
                        <el-button type="primary" plain :loading="importing" :disabled="importDisable">{{
                                importMsg
                            }}
                        </el-button>
                    </el-upload>

                </el-form-item>
                <el-link type="primary" style="float: right" :href="template">学生批量导入模板下载
                </el-link>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <!--信息Dialog-->
        <el-dialog title="学生信息"
                   :visible.sync="userInfoDialogVisible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
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
                            <el-radio-button label="DELETE">删除</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="form.sex">
                            <el-radio-button label="男">男</el-radio-button>
                            <el-radio-button label="女">女</el-radio-button>
                        </el-radio-group>
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
                    <el-form-item label="班级" prop="classes.id">
                        <el-select v-model="form.classes.id" filterable clearable placeholder="请选择"
                                   @change="classesChoose">
                            <el-option
                                v-for="classes in classesList"
                                :key="classes.id"
                                :label="classes.name"
                                :value="classes.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="实验室教师" prop="classes.teacher.name">
                        <el-input v-model="form.classes.teacher.name" placeholder="实验室教师" disabled></el-input>
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
import Env from "../../script/server/env";
import Upload from "../../script/server/upload";
import Status from "../../script/client/status"
import Classes from "../../script/server/manage/classes";

export default {
    name: "Student",
    data: function () {
        return {
            template: require('../../assets/学生批量导入模板.xlsx'),
            importAction: Env.baseURL + '/user/batchImport/student/',
            uploadHeaders: {
                Authorization: Upload.getToken()
            },
            importMsg: '导入',
            importing: false,
            importDisable: false,
            query: {
                username: '',
                name: '',
                classes: {id: '', teacher: {id: ''}},
            },
            addUser: true,
            form: {
                id: '',
                username: '',
                password: '',
                state: 'NORMAL',
                name: '',
                sex: '',
                overTerm: {year: '', num: ''},
                type: 'STUDENT',
                login: true,
                classes: {
                    id: '',
                    teacher: {
                        name: ''
                    }
                }
            },
            classesList: [],
            teachers: [],
            rules: {
                username: [
                    {required: true, message: '请输入学号', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'blur'},
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
                    {prop: 'username', label: '学号'},
                    {prop: 'name', label: '姓名'},
                    {
                        prop: 'state',
                        label: '状态',
                        width: '70',
                        formatter: Status.stateFormatter,
                        tag: true,
                        tagType: Status.stateTagFormatter,
                        tagSize: 'small'
                    },
                    {prop: 'term.year', label: '学期', formatter: this.termFormatter, formatterType: 'raw'},
                    {prop: 'classes.name', label: '班级'},
                    {prop: 'classes.teacher.name', label: '实验室教师'},
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
        Classes.gets(Config.allPage).then(res => {
            this.classesList = res.list
        })
        User.getNormalTeacher().then(res => {
            this.teachers = res.list
        })
    },
    methods: {
        toQuery() {
            this.list()
        },
        classesChoose: function (classes) {
            Classes.get({id: classes}).then(res => {
                this.form.classes.teacher.name = res.classes.teacher.name
            })
        },
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
                this.form.id = ''
            });
        },
        edit: function (row) {
            User.getUser({id: row.id}).then(result => {
                this.userInfoDialogVisible = true
                this.$nextTick(() => {
                    result.user.overTerm.year = result.user.overTerm.year + ""
                    this.form = result.user
                    if (!this.form.classes) {
                        this.form.classes = {id: '', teacher: {name: ''}}
                    }
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
            for (let prop in this.query) {
                data[prop] = this.query[prop]
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
        importComplete(response) {
            this.$message({
                message: '导入完成',
                type: 'success'
            });
            this.importEnd()
            this.list()
        },
        importError(err) {
            this.$message({
                showClose: true,
                duration: 20000,
                message: '导入失败:' + JSON.parse(err.message).error_msg,
                type: 'error'
            });
            this.importEnd()
        },
        importStart() {
            this.importing = true
            this.importMsg = '导入中...'
            this.importDisable = true
        },
        importEnd() {
            this.importing = false
            this.importMsg = '导入'
            this.importDisable = false
        },
        disableAll() {
            this.$confirm('将所有正常状态的学生设置为禁用状态, 是否继续?', '提示', {
                confirmButtonText: '禁用',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                User.disableNormal().then(() => {
                    this.list()
                    this.$message({
                        type: 'success',
                        message: '已禁用!'
                    });
                })
            }).catch(() => {

            });
        },
        recoverAll() {
            this.$confirm('将所有禁用状态的学生恢复为正常状态, 是否继续?', '提示', {
                confirmButtonText: '恢复',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                User.normalDisable().then(() => {
                    this.list()
                    this.$message({
                        type: 'success',
                        message: '已恢复!'
                    });
                })
            }).catch(() => {

            });
        }
    },
    components: {
        TableComponent
    }
}
</script>

<style scoped>

</style>