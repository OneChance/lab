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
                <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false">
                    <el-form-item label="标本编码" prop="code">
                        <el-input v-model="form.code"></el-input>
                    </el-form-item>
                    <el-form-item label="实验室" prop="laboratoryId">
                        <el-select v-model="form.laboratoryId" placeholder="请选择实验室" class="mobile-item-width"
                                   @change="chooseLab">
                            <el-option
                                v-for="lab in labs"
                                :key="lab.id"
                                :label="lab.name"
                                :value="lab.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标本名称" prop="name">
                        <el-input type="textarea" v-model="form.name" class="mobile-item-width"></el-input>
                    </el-form-item>
                    <el-form-item label="标本描述" prop="description">
                        <el-input type="textarea" v-model="form.description"
                                  class="mobile-item-width"></el-input>
                    </el-form-item>
                    <el-form-item label="标本图片" prop="imgFiles">
                        <el-upload
                            :action="uploadAction"
                            list-type="picture-card"
                            name="formFile"
                            :headers="uploadHeaders"
                            with-credentials="true"
                            :on-success="imgSuccess"
                            :on-preview="handlePictureCardPreview"
                            :before-remove="beforeRemove"
                            :on-remove="handleRemove"
                            :file-list="form.imgFiles">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="picCardVisible" size="tiny" append-to-body>
                            <img width="100%" :src="picCardUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="音频文件" prop="audioFile">
                        <el-upload
                            :action="uploadAction"
                            name="formFile"
                            :headers="uploadHeaders"
                            with-credentials="true"
                            :on-success="audioSuccess"
                            :before-remove="beforeRemove"
                            :on-remove="handleAudioRemove"
                            :file-list="form.audioFile">
                            <el-button v-if="!form.audioFile.length" type="primary">
                                上传<i class="el-icon-upload el-icon--right"></i>
                            </el-button>
                            <audio ref="audio" v-else :src="form.audioFile[0].url" controls="controls"></audio>
                        </el-upload>
                    </el-form-item>
                    <el-divider>知识点</el-divider>
                    <div v-for="(kp,index) in form.kps">
                        <el-form-item label="标题" :prop="'kps.' + index + '.title'"
                                      :rules="{required: true, message: '请填写标题', trigger: 'blur'}">
                            <el-input type="text" v-model="kp.title" style="width:626px"></el-input>
                        </el-form-item>
                        <el-form-item label="内容" :prop="'kps.' + index + '.content'"
                                      :rules="{required: true, message: '请填写内容', trigger: 'blur'}">
                            <el-input type="textarea" v-model="kp.content" style="width:626px"></el-input>
                            <el-button @click.prevent="removeKp(kp)">删除</el-button>
                        </el-form-item>
                    </div>
                    <el-button @click="addKp" type="success" plain>新增知识点</el-button>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="addCommit()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="标本二维码"
                   :visible.sync="qrVisisble"
                   width="440px"
                   :close-on-click-modal="false">
            <template>
                <section ref="qrArea" style="position: relative">
                    <div class="code" ref="qrNo">{{ qr.code }}</div>
                    <vue-qr :correctLevel="3" :autoColor="false" :colorDark="qr.color" :logoSrc="qr.logoSrc"
                            :text="qr.url" :size="qr.size" :margin="0" :logoMargin="3"></vue-qr>
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
import Env from "../../script/server/env"
import Upload from "../../script/server/upload"
import VueQr from 'vue-qr'
import Lab from "../../script/server/manage/lab";

export default {
    name: "SampleBank",
    watch: {
        visible(vis) {
            if (!vis) {
                if (this.$refs.audio) {
                    this.$refs.audio.pause()
                }
            } else {
                if (this.$refs['form']) {
                    this.$refs['form'].resetFields();
                }
                this.form.kps = [{title: '', content: ''}]
            }
        }
    },
    data: function () {
        return {
            visible: false,
            qrVisisble: false,
            picCardVisible: false,
            picCardUrl: '',
            navData: [Config.navs.samplebank, {
                'name': this.$route.query.name,
                'url': '/index/app/samplebank?id=' + this.$route.query.id + '&name=' + this.$route.query.name
            }],
            form: {
                id: '',
                code: '',
                bankId: this.$route.query.id,
                laboratoryId: '',
                name: '',
                description: '',
                imgFiles: [],
                audioFile: [],
                kps: [{title: '', content: ''}],
                imgIds: '',
                audioId: '',
            },
            rules: {
                'code': [
                    {required: true, message: '请填写标本编码', trigger: 'blur'},
                ],
                'laboratory.id': [
                    {required: true, message: '请选择实验室', trigger: 'blur'},
                ],
                name: [
                    {required: true, message: '请填写标本名称', trigger: 'blur'},
                ],
                imgFiles: [
                    {required: true, message: '请上传图片', trigger: 'blur'},
                ],
                audioFile: [
                    {required: true, message: '请上传音频', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '标本名称', width: '600'},
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
                url: '',
                icon: '',
                color: '',
                logoSrc: '',
                size: 400,
                code: ''
            },
            labs: [],
        }
    },
    mounted: function () {
        this.list()
        this.uploadAction = Env.baseURL + '/file/upload/'
        this.uploadHeaders = {
            Authorization: Upload.getToken()
        }
        Lab.gets(Config.allPage).then(res => {
            this.labs = res.list
        })
        Sample.getSB({id: this.$route.query.id}).then(res => {
            this.qr.color = res.specimen_bank.color
        })
    },
    methods: {
        add() {
            this.form.id = ''
            this.visible = true
        },
        edit(row) {
            Sample.getSample({id: row.id}).then(result => {
                this.visible = true
                this.$nextTick(() => {
                    let _this = this
                    for (let prop in result.specimen) {
                        this.form[prop] = result.specimen[prop]
                    }
                    //image
                    if (this.form.imgIds) {
                        this.form.imgIds.split(',').forEach(id => {
                            this.form.imgFiles.push({
                                id: id,
                                url: Env.baseURL + '/file/download/?id=' + id
                            })
                        })
                    }
                    //audio
                    if (this.form.audioId) {
                        this.form.audioFile.push({
                            id: this.form.audioId,
                            name: result.specimen.audio.name,
                            url: Env.baseURL + '/file/download/?id=' + this.form.audioId
                        })
                    }
                })
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
                    this.form.imgIds = this.form.imgFiles.map(img => img.id).toString()
                    this.form.audioId = this.form.audioFile[0].id
                    console.log(this.form)
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
        imgSuccess: function (response, file) {
            this.form.imgFiles.push({
                id: response.id,
                uid: file.uid,
                url: Env.baseURL + '/file/download/?id=' + response.id
            })
        },
        audioSuccess: function (response, file) {
            this.form.audioFile.push({
                id: response.id,
                uid: file.uid,
                name: file.name,
                url: Env.baseURL + '/file/download/?id=' + response.id
            })
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${file.name}？`)
        },
        handlePreview(file) {
            window.open(Env.baseURL + file.url)
        },
        handleRemove(file) {
            this.form.imgFiles = this.form.imgFiles.filter(f => f.uid !== file.uid)
        },
        handleAudioRemove() {
            this.form.audioFile = []
        },
        handlePictureCardPreview(file) {
            this.picCardUrl = file.url;
            this.picCardVisible = true;
        },
        genQr(row) {
            this.qr.code = row.code
            this.qr.url = Env.baseURL.replace('api', '') + '/#/wx/sample?id=' + row.id
            this.qrVisisble = true
            this.$nextTick(() => {
                this.$refs.qrNo.style.top = (this.qr.size / 2 - 43) + 'px'
                this.$refs.qrNo.style.left = (this.qr.size / 2 - 43) + 'px'
                this.$refs.qrNo.style.border = '1px solid ' + this.qr.color
                this.$refs.qrNo.style.color = this.qr.color
            })
        },
        printQr() {
            this.$print(this.$refs.qrArea)
        },
        addKp() {
            this.form.kps.push({
                title: '', content: ''
            })
        },
        removeKp(kp) {
            let index = this.form.kps.indexOf(kp)
            if (index > 0) {
                this.form.kps.splice(index, 1)
            } else {
                this.$message({
                    message: '第一行无法删除',
                    type: 'warning'
                });
            }
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

.code {
    height: 86px;
    width: 86px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    border-radius: 5px;
    font-size: 30px;
    font-weight: bold;
}
</style>