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
                <div class="mobile-item-row">
                    <img :src="img" alt="" style="width: 100%">
                </div>
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item :title="kp.title" :name="kp.id" v-for="kp in kps" :key="kp.id" class="kp-title">
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
            img: '',
            audio: {},
            kps: []
        }
    },
    mounted: function () {
        Sample.getSample({id: this.$route.query.id}).then(res => {
            this.name = res.specimen.name
            this.description = res.specimen.description
            let imgId = res.specimen.imgIds
            if (imgId.indexOf(',') !== -1) {
                imgId = imgId.split(',')[0]
            }
            this.img = Env.baseURL + '/file/download/?id=' + imgId
            this.sound = Env.baseURL + '/file/download/?id=' + res.specimen.audioId
            this.kps = res.specimen.kps
            this.audio = {
                title: res.specimen.name,
                artist: ' ',
                src: Env.baseURL + '/file/download/?id=' + res.specimen.audioId,
                pic: Env.baseURL + '/file/download/?id=' + imgId
            }
        })
        document.title = '标本信息'
    },
    methods: {},
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