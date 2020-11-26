<template>
    <div class="mobile-div">
        <div style="height: 100vh">
            <el-card class="box-card mobile-card">
                <div slot="header" class="clearfix">
                    <span>{{ name }}</span>
                </div>
                <div class="mobile-item-row">{{ description }}</div>
                <div class="mobile-item-row">
                    <img :src="img" alt="" style="width: 100%">
                </div>
                <div class="mobile-item-row">
                    <audio :src="sound" controls="controls"></audio>
                </div>
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item :title="kp.title" :name="kp.id" v-for="kp in kps" :key="kp.id">
                        <div>{{ kp.content }}</div>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </div>
    </div>
</template>


<script>

import Sample from "../../script/server/manage/sample";
import Env from "../../script/server/env";

export default {
    name: "SampleMobile",
    data: function () {
        return {
            name: '',
            description: '',
            img: '',
            sound: '',
            kps: []
        }
    },
    mounted: function () {
        Sample.getSample({id: this.$route.query.id}).then(res => {
            console.log(res)
            this.name = res.specimen.name
            this.description = res.specimen.description
            let imgId = res.specimen.imgIds
            if (imgId.indexOf(',') !== -1) {
                imgId = imgId.split(',')[0]
            }
            this.img = Env.baseURL + '/file/download/?id=' + imgId
            this.sound = Env.baseURL + '/file/download/?id=' + res.specimen.audioId
            this.kps = res.specimen.kps
        })
    },
    methods: {},
    components: {},
}
</script>

<style scoped>

</style>