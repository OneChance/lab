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
                    <el-form-item label="题目" prop="question">
                        <el-input type="textarea" v-model="form.question" style="width:700px"
                                  :rules="{required: true, message: '请填写题目内容', trigger: 'blur'}"></el-input>
                    </el-form-item>
                    <div v-for="(option,index) in form.options">
                        <el-form-item label="选项" :prop="'options.' + index + '.answer'"
                                      :rules="{required: true, message: '请填写选项内容', trigger: 'blur'}">
                            <el-input v-model="option.answer" style="width:560px"></el-input>
                            <el-tooltip :content="option.right?'正确答案':'错误答案'" placement="top">
                                <el-switch
                                    style="margin-left: 10px"
                                    v-model="option.right"
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

import TableComponent from "../TableComponent";
import NavComponent from "../NavComponent";
import Config from "../../script/config";

export default {
    name: "QuestionItem",
    data: function () {
        return {
            navData: [Config.navs.questionbank, {'name': this.$route.params.bankName, 'url': '/index/onebank'}],
            visible: false,
            form: {
                question: '',
                options: [{answer: '', right: false}],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'question', label: '题目', width: '900'},
                ],
                oper: [
                    {
                        class: 'fa fa fa-user-o fa-lg click-fa primary-fa',
                        tip: {content: '查看', placement: 'right'},
                        event: this.view,
                    },
                ]
            },
            list: [],
        }
    },
    mounted: function () {
        this.tableConfig.currentPage = 1
        this.tableConfig.data = this.list
    },
    methods: {
        add() {
            this.visible = true
        },
        view() {

        },
        addCommit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log(this.form)
                    this.list.push(this.form);
                    this.tableConfig.data = this.list;
                    this.tableConfig.total = this.list.length
                }
            })
        },
        addOption: function () {
            this.form.options.push({
                answer: '',
                right: false,
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
    },
    components: {
        TableComponent, NavComponent
    },
}
</script>

<style scoped>

</style>