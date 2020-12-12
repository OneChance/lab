<template>
    <el-card class="box-card">
        <el-alert
            class="code-info"
            v-if="codesNum"
            :title="codesNum"
            type="success"
            :closable="false">
        </el-alert>
        <el-button type="primary" @click="downloadQrs()" :disabled="exportDisable">{{ exportText }}</el-button>
        <div class="multi-row">
            <section :ref="code.sectionRef" class="code-wrapper"
                     v-for="code of codes">
                <div class="code" :ref="code.codeRef">{{ code.code }}</div>
                <vue-qr :correctLevel="3" :autoColor="false" :colorDark="code.color" :logoSrc="code.logoSrc"
                        :text="code.url" :size="code.size" :margin="0" :logoMargin="3"
                        :callback="code.callback"></vue-qr>
            </section>
        </div>
    </el-card>
</template>


<script>

import Sample from "../../script/server/manage/sample";
import Env from "../../script/server/env"
import VueQr from 'vue-qr'
import html2canvas from 'html2canvas'
import Config from '../../script/config'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export default {
    name: "SampleBank",
    watch: {
        loadCount: function (val) {
            if (val === this.codes.length) {
                this.exportText = '导出'
                this.exportDisable = false
                this.codesNum = '共计' + this.codes.length + '个标本二维码'
            }
        }
    },
    data: function () {
        return {
            codes: [],
            exportText: '正在加载二维码,请稍等...',
            exportDisable: true,
            loadCount: 0,
            codesNum: ''
        }
    },
    mounted: function () {
        Sample.getSBs(Config.allPage).then(sbs => {
            Sample.getSamples(Config.allPage).then(ss => {
                this.codes = ss.list.map(sample => {
                    return {
                        sectionRef: 'qrArea' + sample.id,
                        codeRef: 'qrNo' + sample.id,
                        url: Env.baseURL.replace('api', '') + '/#/wx/sample?id=' + sample.id,
                        icon: '',
                        logoSrc: '',
                        size: 400,
                        name: sample.name,
                        code: sample.code,
                        color: sbs.list.filter(sb => sb.id === sample.bankId)[0].color,
                        callback: () => {
                            this.loadCount++
                        }
                    }
                })

                this.$nextTick(() => {
                    this.codes.forEach(code => {
                        this.$refs[code.codeRef][0].style.top = (code.size / 2 - 43) + 'px'
                        this.$refs[code.codeRef][0].style.left = (code.size / 2 - 43) + 'px'
                        this.$refs[code.codeRef][0].style.border = '1px solid ' + code.color
                        this.$refs[code.codeRef][0].style.color = code.color
                    })
                })
            })
        })
    },
    methods: {
        downloadQrs() {
            let _this = this;
            let zip = new JSZip();
            let promises = [];

            this.codes.forEach(code => {
                window.pageYoffset = 0;
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                // 先获取你要转换为img的dom节点
                let node = _this.$refs[code.sectionRef][0];//传入的id名称
                let width = node.offsetWidth; //dom宽
                let height = node.offsetHeight; //dom高
                let scale = 2; //放大倍数 这个相当于清晰度 调大一点更清晰一点

                const promise = html2canvas(node, {
                    width: width,
                    heigth: height,
                    backgroundColor: "#ffffff", //背景颜色 为null是透明
                    dpi: window.devicePixelRatio * 2, //按屏幕像素比增加像素
                    scale: scale,
                    X: 0,
                    Y: 0,
                    scrollX: -3, //如果左边多个白边 设置该偏移-3 或者更多
                    scrollY: 0,
                    useCORS: true, //是否使用CORS从服务器加载图像 !!!
                    allowTaint: true //是否允许跨域图像污染画布  !!!
                }).then(canvas => {
                    let imgUri = canvas.toDataURL().split(';base64,')[1]
                    zip.file(code.code+'-'+code.name + '.png', imgUri, {base64: true});
                });
                promises.push(promise);
            })

            Promise.all(promises).then(() => {
                zip.generateAsync({type: "blob"}).then(content => {
                    FileSaver.saveAs(content, '二维码');
                });
            }).catch(() => {
                _this.$message.error('文件压缩失败');
            });
        },
    },
    components: {
        VueQr
    },
}
</script>

<style scoped>

.code-wrapper {
    position: relative;
    margin-top: 20px;
    margin-right: 20px;
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

.code-info {
    width: 200px;
    height: 40px;
    float: left;
    margin-right: 10px;
}

.multi-row {
    display: flex;
    flex-wrap: wrap;
}
</style>