<template>
    <div>
        <nav-component v-bind:data="navData"></nav-component>

        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" @click="add">添加班级</el-button>
                        </el-form-item>
                    </el-form>
                    <table-component v-bind:tableConfig="tableConfig" style="margin-top: 20px"></table-component>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="班级信息"
                   :visible.sync="visible"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="编号" prop="code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="实验室老师" prop="teacher.id">
                    <el-select v-model="form.teacher.id" filterable clearable placeholder="请选择">
                        <el-option
                            v-for="teacher in teachers"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="addCommit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>

import TableComponent from "../util/TableComponent";
import Config from "../../script/config"
import Classes from "../../script/server/manage/classes"
import Common from "../../script/common";
import User from "../../script/server/user";

export default {
    name: "Classes",
    data: function () {
        return {
            teachers: [],
            visible: false,
            form: {
                id: '',
                code: '',
                name: '',
                teacher: {
                    id: ''
                }
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'code', label: '编号', width: '200'},
                    {prop: 'name', label: '名称', width: '300'},
                    {prop: 'teacher.name', label: '实验室教师', width: '300'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '查看', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa danger-fa',
                        tip: {content: '删除', placement: 'right'},
                        event: this.delete,
                        check: true
                    },
                ]
            },
            rules: {
                code: [
                    {required: true, message: '请输入编号', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请输入名称', trigger: 'blur'},
                ],
                'teacher.id': [
                    {required: true, message: '请选择实验室教师', trigger: 'blur'},
                ],
            },
        }
    },
    mounted: function () {
        this.list()
        User.getNormalTeacher().then(res => {
            this.teachers = res.list
        })
    },
    methods: {
        toPage: function (val) {
            this.list({page: val})
        },
        add() {
            this.visible = true
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
                this.form.id = ''
            })
        },
        edit(row) {
            this.chooseTimeZone = []
            Classes.get({id: row.id}).then(result => {
                this.visible = true
                this.$nextTick(() => {
                    this.form = result.classes
                });
            })
        },
        addCommit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    Classes.save(this.form).then(() => {
                        this.operSuccess(this)
                        this.visible = false;
                    })
                }
            })
        },
        delete(row) {
            Classes.delete({id: row.id}).then(() => {
                this.operSuccess(this)
            })
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            Classes.gets(data).then(res => {
                this.tableConfig.data = res.list
                this.tableConfig.total = res.count
            })
        },
        operSuccess(comp) {
            this.visible = false
            comp.$message({
                message: '操作成功',
                type: 'success'
            });
            comp.list({page: 1})
        },
    },
    components: {
        TableComponent
    },
}
</script>

<style scoped>
</style>