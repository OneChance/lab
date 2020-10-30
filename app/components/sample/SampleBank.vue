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
                    <el-form-item label="标本名称" prop="name">
                        <el-input type="textarea" v-model="form.name" style="width:700px"></el-input>
                    </el-form-item>
                    <el-form-item label="标本描述" prop="name">
                        <el-input type="textarea" v-model="form.name" style="width:700px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-upload class="upload-demo" action="noAction" :http-request="upload"
                                   :with-credentials="true" :on-preview="handlePreview"
                                   :on-remove="handleRemove" :before-remove="beforeRemove"
                                   multiple
                                   :file-list="form.imgFile">
                            <el-button size="small" type="primary" class="upload-btn" @click="toUpload('img')">
                                上传标本图片
                            </el-button>
                        </el-upload>
                    </el-form-item>
                    <div v-for="(kp,index) in form.kps">
                        <el-button @click.prevent="removeOption(kp)">删除</el-button>
                    </div>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button @click="addOption">新增选项</el-button>
                <el-button type="primary" @click="addCommit()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="标本二维码"
                   :visible.sync="qrVisisble"
                   width="440px"
                   :close-on-click-modal="false">
            <template>
                <section ref="qrArea">
                    <vue-qr :correctLevel="3" :autoColor="false" colorDark="#313a90" :logoSrc="qr.icon"
                            :text="qr.url" size="400" :margin="0" :logoMargin="3"></vue-qr>
                </section>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="qrVisisble = false">取 消</el-button>
                <el-button type="primary" @click="printQr()">打印</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>

import TableComponent from "../util/TableComponent";
import NavComponent from "../util/NavComponent";
import Config from "../../script/config";
import Sample from "../../script/server/manage/sample";
import Common from "../../script/common";
import Upload from "../../script/server/upload";
import VueQr from 'vue-qr'

export default {
    name: "SampleBank",
    data: function () {
        return {
            visible: false,
            qrVisisble: false,
            navData: [Config.navs.samplebank, {
                'name': this.$route.query.name,
                'url': '/index/app/samplebank?id=' + this.$route.query.id + '&name=' + this.$route.query.name
            }],
            form: {
                name: '',
                description: '',
                imgFiles: [],
                audioFiles: [],
                kps: []
            },
            rules: {
                name: [
                    {required: true, message: '请填写标本名称', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'sampleName', label: '标本名称', width: '600'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o  fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa danger-fa',
                        tip: {content: '删除', placement: 'top'},
                        event: this.delete,
                        check: true
                    }, {
                        class: 'fa fa-qrcode fa-lg click-fa success-fa',
                        tip: {content: '二维码', placement: 'right'},
                        event: this.genQr,
                    },
                ]
            },
            uploadType: '',
            qr: {
                url: 'http://www.baidu.com',
                icon: ''
            }
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
            Sample.getSample({id: row.id}).then(result => {
                this.visible = true
                this.form = result.question
            })
        },
        delete(row) {
            Sample.deleteSample({id: row.id}).then(() => {
                this.operSuccess(this)
            })
        },
        addCommit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    Sample.saveSample(this.form).then(() => {
                        this.operSuccess(this)
                        this.visible = false;
                    })
                }
            })
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            data.bankId = this.$route.query.id
            Sample.getSamples(data).then(res => {
                res.count = 1
                res.list = [{name: 'test'}]
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
        toUpload(type) {
            this.uploadType = type
        },
        upload(content) {
            let comp = this
            let fd = new FormData()
            fd.append('formFile', content.file)
            Upload.upload(comp.uploadParams.id, fd, (event) => {
                let num = event.loaded / event.total * 100 | 0;
                content.onProgress({
                    percent: num
                })
            }).then(res => {
                content.onSuccess()
                let fileData = {
                    'id': res.id,
                    'uid': content.file.uid,
                    'name': content.file.name
                }
                if (this.uploadType === 'img') {
                    this.form.imgFiles.push(fileData)
                } else {
                    this.form.audioFiles.push(fileData)
                }
            })
        },
        handlePreview(file) {
            window.open(Env.baseURL + file.url)
        },
        handleRemove(file) {

        },
        beforeRemove(file) {

        },
        genQr() {
            this.qrVisisble = true
        },
        printQr() {
            this.$print(this.$refs.qrArea)
        }
    },
    components: {
        TableComponent, NavComponent, VueQr
    },
}
</script>

<style scoped>
.el-dialog {
    width: 295px;
}
</style>