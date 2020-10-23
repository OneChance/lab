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
    </div>
</template>


<script>

import TableComponent from "../util/TableComponent";
import NavComponent from "../util/NavComponent";
import Config from "../../script/config";
import App from "../../script/app";

export default {
    name: "OneSample",
    data: function () {
        return {
            navData: [Config.navs.samplebank, {
                'name': this.$route.params.typeName,
                'url': '/index/app/onesample'
            }],
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
        console.log(this.$route.params.typeName)
    },
    methods: {
        add() {
            /*App.router.$router.push({name: 'sampleinfo', params: {typeName: row.name}}).catch(err => err);*/
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