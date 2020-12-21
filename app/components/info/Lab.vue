<template>
    <div>
        <nav-component v-bind:data="navData"></nav-component>

        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" @click="add">添加实验室</el-button>
                        </el-form-item>
                    </el-form>
                    <table-component v-bind:tableConfig="tableConfig" style="margin-top: 20px"></table-component>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="实验室信息"
                   :visible.sync="visible"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="编号" prop="code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="容纳人数" prop="capacity">
                    <el-input type="number" v-model="form.capacity"></el-input>
                </el-form-item>
                <el-form-item label="预留人数" prop="reserve">
                    <el-input type="number" v-model="form.reserve"></el-input>
                </el-form-item>
                <el-divider>开放时段</el-divider>
                <el-checkbox-group v-model="chooseTimeZone">
                    <el-checkbox :label="zone.id" border v-for="zone of this.availableTimeZone"
                                 :key="zone.id"
                                 class="time-zone">{{ zone.name }}
                    </el-checkbox>
                </el-checkbox-group>
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
import NavComponent from "../util/NavComponent";
import Lab from "../../script/server/manage/lab"
import Common from "../../script/common";

export default {
    name: "Lab",
    data: function () {
        return {
            navData: [Config.navs.duty],
            visible: false,
            zoneVisible: false,
            form: {
                code: '',
                name: '',
                capacity: 0,
                reserve: 0,
                allowHours: "",
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'code', label: '编号', width: '200'},
                    {prop: 'name', label: '名称', width: '300'},
                    {prop: 'capacity', label: '容纳人数', width: '100'},
                    {prop: 'reserve', label: '预留人数', width: '100'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '查看', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-clock-o fa-lg click-fa success-fa',
                        tip: {content: '开放时间', placement: 'top'},
                        event: this.openTime,
                    },
                    {
                        class: 'fa fa fa-calendar fa-lg click-fa primary-fa',
                        tip: {content: '值班表', placement: 'top'},
                        event: this.duty,
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
                capacity: [
                    {required: true, message: '请输入容纳人数', trigger: 'blur'},
                ],
                reserve: [
                    {required: true, message: '请选择预留人数', trigger: 'change'},
                ],
            },
            chooseTimeZone: [],
            availableTimeZone: Lab.timeZone()
        }
    },
    mounted: function () {
        this.list()
    },
    methods: {
        add() {
            this.visible = true
            this.chooseTimeZone = []
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
            })
        },
        openTime(row) {
            this.$router.push({path: 'opentime', query: {id: row.id, name: row.name}}).catch(err => err);
        },
        duty(row) {
            this.$router.push({path: 'duty', query: {id: row.id, name: row.name}}).catch(err => err);
        },
        edit(row) {
            this.chooseTimeZone = []
            Lab.get({id: row.id}).then(result => {
                this.visible = true
                this.$nextTick(() => {
                    this.form = result.laboratory
                    this.form.allowHours.split(',').forEach(zoneId => {
                        this.chooseTimeZone.push(Number(zoneId))
                    })
                });
            })
        },
        addCommit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.chooseTimeZone.length === 0) {
                        this.$notify.error({title: '错误', message: '请选择开放时段'});
                    } else {
                        this.form.allowHours = this.chooseTimeZone.toString()
                        Lab.save(this.form).then(() => {
                            this.operSuccess(this)
                            this.visible = false;
                        })
                    }
                }
            })
        },
        delete(row) {
            Lab.delete({id: row.id}).then(() => {
                this.operSuccess(this)
            })
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            Lab.gets(data).then(res => {
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
    }
    ,
    components: {
        TableComponent, NavComponent
    }
    ,
}
</script>

<style scoped>
.time-zone {
    width: 30%;
    margin-bottom: 10px !important;
    margin-left: 0 !important;
    margin-right: 18px
}
</style>