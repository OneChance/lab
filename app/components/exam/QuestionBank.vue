<template>
    <div>
        <nav-component v-bind:data="navData"></nav-component>
        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" @click="add">添加题目</el-button>
                        </el-form-item>
                    </el-form>
                    <table-component v-bind:tableConfig="tableConfig" style="margin-top: 20px"></table-component>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="题目信息"
                   :visible.sync="visible"
                   class="form-dialog"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
                    <el-form-item label="题目" prop="title">
                        <el-input type="textarea" v-model="form.title" style="width:700px"></el-input>
                    </el-form-item>
                    <div v-for="(option,index) in form.options">
                        <el-form-item label="选项" :prop="'options.' + index + '.answer'"
                                      :rules="{required: true, message: '请填写选项内容', trigger: 'blur'}">
                            <el-input v-model="option.answer" style="width:560px"></el-input>
                            <el-tooltip :content="option.correct?'正确答案':'错误答案'" placement="top">
                                <el-switch
                                    style="margin-left: 10px"
                                    v-model="option.correct"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </el-tooltip>
                        </el-form-item>
                        <el-button @click.prevent="removeOption(option)">删除</el-button>
                    </div>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button @click="addOption">新增选项</el-button>
                <el-button type="primary" @click="addCommit()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>


<script>

import TableComponent from "../util/TableComponent";
import NavComponent from "../util/NavComponent";
import Config from "../../script/config";
import Common from "../../script/common";
import Exam from "../../script/server/manage/exam";

export default {
    name: "QuestionBank",
    data: function () {
        return {
            navData: [Config.navs.questionbank, {
                'name': this.$route.query.name,
                'url': '/index/app/questionbank?id=' + this.$route.query.id + '&name=' + this.$route.query.name
            }],
            visible: false,
            form: {
                id: '',
                bankId: this.$route.query.id,
                title: '',
                options: [{answer: '', correct: false}],
            },
            rules: {
                question: [
                    {required: true, message: '请填写题目内容', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'title', label: '题目', width: '800'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o  fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
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
        }
    },
    mounted: function () {
        this.list()
    },
    methods: {
        add() {
            this.visible = true
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
            });
        },
        edit(row) {
            Exam.getQuestion({id: row.id}).then(result => {
                this.visible = true
                this.form = result.question
            })
        },
        delete(row) {
            Exam.deleteQuestion({id: row.id}).then(() => {
                this.operSuccess(this)
            })
        },
        addCommit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    Exam.saveQuestion(this.form).then(() => {
                        this.operSuccess(this)
                        this.visible = false;
                    })
                }
            })
        },
        addOption: function () {
            this.form.options.push({
                answer: '',
                correct: false,
            })
        },
        removeOption: function (option) {
            let index = this.form.options.indexOf(option)
            if (index > 0) {
                this.form.options.splice(index, 1)
            } else {
                this.$message({
                    message: '第一行无法删除',
                    type: 'warning'
                });
            }
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            data.bankId = this.$route.query.id
            Exam.getQuestions(data).then(res => {
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
        TableComponent, NavComponent
    },
}
</script>

<style scoped>

</style>