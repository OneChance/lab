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
                    <el-form-item label="名称" prop="username">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-form>
            </template>

            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="visible=false;addCommit()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>


<script>

import TableComponent from "../TableComponent";
import App from "../../script/app";
import NavComponent from "../NavComponent";
import Config from "../../script/config"

export default {
    name: "Banks",
    data: function () {
        return {
            navData: [Config.navs.questionbank],
            visible: false,
            form: {
                name: ''
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '名称', width: '900'},
                ],
                oper: [
                    {
                        class: 'fa fa fa-user-o fa-lg click-fa primary-fa',
                        tip: {content: '查看', placement: 'right'},
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
        },
        view(row) {
            App.router.$router.push({name: 'onebank', params: {bankName: row.name}}).catch(err => err);
        },
        addCommit() {
            this.list.push(this.form);
            this.tableConfig.data = this.list;
            this.tableConfig.total = this.list.length
        }
    },
    components: {
        TableComponent, NavComponent
    },
}
</script>

<style scoped>

</style>