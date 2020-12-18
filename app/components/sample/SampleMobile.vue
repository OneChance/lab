<template>
    <div class="mobile-div">
        <div class="full-height">

            <el-card class="box-card mobile-card study-info">
                已学习该标本{{ studyTime }}分钟
            </el-card>


            <el-card class="box-card mobile-card">
                <div slot="header" class="sample-title">
                    <span>{{ name }}</span>
                </div>
                <div class="mobile-item-row">
                    <aplayer autoplay :music="audio"/>
                </div>
                <div class="mobile-item-row sample-description">{{ description }}</div>
                <div class="mobile-item-row" v-for="img of imgs">
                    <img :src="img" preview="0" style="width: 100%" alt="">
                </div>
                <el-collapse v-model="activeNames">
                    <div v-for="kp in kps" :key="kp.id" class="kp-title" @click="kpClick(kp)">
                        <el-collapse-item :name="kp.id">
                            <template slot="title">
                            <span :style="{'color':(kp.studied?'#41b883':'#303133')}">
                                {{ kp.title }}
                            </span>
                            </template>
                            <div class="kp-content">{{ kp.content }}</div>
                        </el-collapse-item>
                    </div>
                </el-collapse>
            </el-card>
        </div>

        <el-dialog
            title="提示"
            center
            :visible.sync="timeout"
            width="90%"
            :show-close="false"
            :close-on-click-modal="false">
            <span style="font-weight: bold">30分钟已到,点击确定关闭.如需继续学习,请重新扫码!</span>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="exit()">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>


<script>

import Sample from "../../script/server/manage/sample";
import Env from "../../script/server/env";
import Aplayer from 'vue-aplayer'
import Router from "../../script/client/router";
import Common from "../../script/common"

export default {
    name: "SampleMobile",
    data: function () {
        return {
            name: '',
            description: '',
            imgs: [],
            audio: {},
            kps: [],
            interval: 10,
            studyChecker: {},
            fingerDistance: 0,
            studyTime: 0,
            timeout: false
        }
    },
    mounted: function () {

        Sample.study({id: this.$route.query.id, interval: this.interval}).then(res => {
            this.name = res.specimen.name
            this.description = res.specimen.description
            let imgId = ''
            res.specimen.imgIds.split(',').forEach(id => {
                if (!imgId) {
                    imgId = id
                }
                this.imgs.push(Env.baseURL + '/file/download/?id=' + id)
            })
            this.sound = Env.baseURL + '/file/download/?id=' + res.specimen.audioId
            this.kps = res.specimen.kps
            this.audio = {
                title: res.specimen.name,
                artist: ' ',
                src: Env.baseURL + '/file/download/?id=' + res.specimen.audioId,
                pic: Env.baseURL + '/file/download/?id=' + imgId
            }
            this.studyTime = Math.floor(res.study_timing / 60)
        }).catch((e) => {
            clearInterval(this.studyChecker)
            Router.toError(this)
        })

        document.title = '标本信息'

        //记录学习时间
        this.studyChecker = setInterval(() => {
            Sample.study({id: this.$route.query.id, interval: this.interval}).then(res => {
                this.studyTime = Math.floor(res.study_timing / 60)
            }).catch((e) => {
                clearInterval(this.studyChecker)
                Router.toError(this)
            })
        }, 11000)

        //30分钟后退出
        setTimeout(() => {
            this.timeout = true
            clearInterval(this.studyChecker)
        }, 1800000)
    },
    beforeDestroy() {
        clearInterval(this.studyChecker)
    },
    methods: {
        kpClick(kp) {
            if (!kp.studied) {
                console.log('请求后台记录')
                kp.studied = true
                this.$forceUpdate()
            }
        },
        exit() {
            this.timeout = false
            Common.closeWindow()
        },
    },
    components: {Aplayer},
}
</script>

<style scoped>
.sample-title {
    font-size: 1.1em;
    font-weight: bold;
}

.sample-description {
    font-weight: 300;
    font-size: 0.9em;
}

.kp-content {
    font-weight: 300;
    font-size: 0.8em;
}

.study-info {
    text-align: center;
    font-weight: bold;
    color: #41b883;
}

</style>