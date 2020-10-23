<template>
    <div>
        <nav-component v-bind:data="navData"></nav-component>
        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" @click="add">添加标本</el-button>
                        </el-form-item>
                    </el-form>
                    <table-component v-bind:tableConfig="tableConfig" style="margin-top: 20px"></table-component>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="标本信息"
                   :visible.sync="visible"
                   class="form-dialog"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
                    <el-form-item label="题目" prop="question">
                        <el-input type="textarea" v-model="form.question" style="width:700px"
                                  :rules="{required: true, message: '请填写题目内容', trigger: 'blur'}"></el-input>
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
import NavComponent from "../util/NavComponent";
import Config from "../../script/config";

export default {
    name: "OneSample",
    data: function () {
        return {
            navData: [Config.navs.samplebank, {'name': this.$route.params.typeName, 'url': '/index/onesample'}],
            visible: false,
            form: {
                name: '',
                img: '',
                description: '',
                kps: []
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'sampleName', label: '标本名称', width: '900'},
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
    },
    components: {
        TableComponent, NavComponent
    },
}
</script>

<style scoped>

</style>