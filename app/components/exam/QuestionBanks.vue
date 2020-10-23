<template>
    <div>
        <nav-component v-bind:data="navData"></nav-component>
        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" @click="add">添加题库</el-button>
                        </el-form-item>
                    </el-form>
                    <table-component v-bind:tableConfig="tableConfig" style="margin-top: 20px"></table-component>
                </el-card>
            </el-col>
        </el-row>


        <el-dialog :visible.sync="visible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="addCommit()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>


<script>

import TableComponent from "../util/TableComponent";
import App from "../../script/app";
import NavComponent from "../util/NavComponent";
import Config from "../../script/config"

export default {
    name: "QuestionBanks",
    data: function () {
        return {
            navData: [Config.navs.questionbank],
            visible: false,
            form: {
                name: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入库名', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '名称', width: '600'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '修改', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-file-text-o fa-lg click-fa primary-fa',
                        tip: {content: '查看', placement: 'top'},
                        event: this.view,
                    },
                ]
            },
            list: [{name: 'test1'}, {name: 'test2'}],
        }
    },
    mounted: function () {
        this.tableConfig.currentPage = 1
        this.tableConfig.data = this.list
    },
    methods: {
        add() {
            this.visible = true
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
            });
        },
        edit(row) {
            this.visible = true
        },
        view(row) {
            App.router.$router.push({path: 'questionbank', query: {id: '1', name: row.name}}).catch(err => err);
        },
        addCommit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.visible = false
                    console.log('add complete')
                }
            })
        }
    },
    components: {
        TableComponent, NavComponent
    },
}
</script>

<style scoped>

</style>