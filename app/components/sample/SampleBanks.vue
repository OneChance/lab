<template>
    <div>
        <nav-component v-bind:data="navData"></nav-component>
        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" @click="add">添加标本大类</el-button>
                        </el-form-item>
                    </el-form>
                    <table-component v-bind:tableConfig="tableConfig" style="margin-top: 10px"></table-component>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog :visible.sync="visible"
                   :close-on-click-modal="false">

            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="二维码颜色" prop="color">
                        <el-color-picker v-model="form.color"></el-color-picker>
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
import Sample from "../../script/server/manage/sample";
import Common from "../../script/common";

export default {
    name: "SampleBanks",
    data: function () {
        return {
            navData: [Config.navs.samplebank],
            visible: false,
            form: {
                id: '',
                name: '',
                color: '#347dd6'
            },
            rules: {
                name: [
                    {required: true, message: '请输入大类名', trigger: 'blur'},
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
                        class: 'fa fa-trash-o fa-lg click-fa danger-fa',
                        tip: {content: '删除', placement: 'top'},
                        event: this.delete,
                        check: true
                    },
                    {
                        class: 'fa fa-file-text-o fa-lg click-fa primary-fa',
                        tip: {content: '查看', placement: 'right'},
                        event: this.view,
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
                this.form.id = ''
            });
        },
        edit(row) {
            Sample.getSB({id: row.id}).then(result => {
                this.visible = true
                this.$nextTick(() => {
                    this.form = result.specimen_bank
                })
            })
        },
        view(row) {
            this.$router.push({path: 'samplebank', query: {id: row.id, name: row.name}}).catch(err => err);
        },
        addCommit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    Sample.saveSB(this.form).then(() => {
                        this.operSuccess(this)
                        this.visible = false;
                    })
                }
            })
        },
        delete(row) {
            Sample.deleteSB({id: row.id}).then(() => {
                this.operSuccess(this)
            })
        },
        toPage: function (val) {
            this.list({page: val})
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            Sample.getSBs(data).then(res => {
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