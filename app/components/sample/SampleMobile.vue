<template>
    <div class="mobile-div">
        <div class="full-height">
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
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item :name="kp.id" v-for="kp in kps" :key="kp.id" class="kp-title">
                        <template slot="title">
                            <span :style="'color:'+(kp.studied?'green':'')" @click="studyKp(kp.id)">{{
                                    kp.title
                                }}</span>
                        </template>
                        <div class="kp-content">{{ kp.content }}</div>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </div>
    </div>
</template>


<script>

import Sample from "../../script/server/manage/sample";
import Env from "../../script/server/env";
import Aplayer from 'vue-aplayer'

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
            fingerDistance: 0
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
        }).catch((e) => {
            clearInterval(this.studyChecker)
            this.$router.push({path: '/wx/error'}).catch(err => err);
        })

        document.title = '标本信息'

        //触摸事件转鼠标事件,用于el-image
        document.addEventListener("touchstart", this.touchHandler, true);
        document.addEventListener("touchmove", this.touchHandler, true);
        document.addEventListener("touchend", this.touchHandler, true);
        document.addEventListener("touchcancel", this.touchHandler, true);

        //记录学习时间
        this.studyChecker = setInterval(() => {
            Sample.study({id: this.$route.query.id, interval: this.interval})
        }, 11000)
    },
    beforeDestroy() {
        clearInterval(this.studyChecker)
    },
    methods: {
        study() {
            console.log(111)
        },
        studyKp(id) {
            console.log(id)
        },
        touchHandler(event) {
            let touches = event.changedTouches

            let first = touches[0],
                type = "";
            switch (event.type) {
                case "touchstart":
                    type = "mousedown";
                    break;
                case "touchmove":
                    type = "mousemove";
                    break;
                case "touchend":
                    type = "mouseup";
                    break;
                default:
                    return;
            }

            let simulatedEvent = document.createEvent("MouseEvent");


            if (touches.length === 2) {


                if (type === 'mousemove') {
                    let now = touches
                    if (this.getDistance(now[0], now[1]) < this.fingerDistance) {
                        simulatedEvent = document.createEvent("WheelEvent");
                        simulatedEvent.initEvent()
                        this.$message('1')
                    } else {

                    }
                    this.fingerDistance = this.getDistance(now[0], now[1])
                }

            } else {
                simulatedEvent.initMouseEvent(type, true, true, window, 1,
                    first.screenX, first.screenY,
                    first.clientX, first.clientY, false,
                    false, false, false, 0/*left*/, null);
            }

            first.target.dispatchEvent(simulatedEvent);

        },
        getDistance(p1, p2) {
            let x = p2.pageX - p1.pageX,
                y = p2.pageY - p1.pageY;
            return Math.sqrt((x * x) + (y * y));
        }
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
</style>