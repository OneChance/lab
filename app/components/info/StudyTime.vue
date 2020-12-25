<template>
    <div class="mobile-div">
        <div class="full-height">
            <el-card class="box-card mobile-card">
                <div class="mobile-center-text">
                    总学习时长<p class="sum">{{ sum }}</p>分钟
                </div>
            </el-card>
            <el-card class="box-card mobile-card">
                <el-select v-model="sampleId" placeholder="请选择标本" class="mobile-item"
                           filterable
                           @change="chooseSample">
                    <el-option
                        v-for="sample in samples"
                        :key="sample.id"
                        :label="sample.name"
                        :value="sample.id">
                    </el-option>
                </el-select>

                <div class="samples-study">
                    <div v-for="sample of samples" :key="sample.id" class="one-sample-study">
                        {{ sample.name }}:
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>


<script>

import Sample from '../../script/server/manage/sample'
import Config from '../../script/config'

export default {
    name: "TeacherRate",
    data: function () {
        return {
            sum: 50,
            sampleId: '',
            samples: [],
            options: {}
        }
    },
    mounted: function () {
        document.title = '学习时长'
        Sample.getSamples(Config.allPage).then(res => {
            this.samples = res.list
            console.log(res.list)
        },)
    },
    methods: {
        chooseSample(value) {

        }
    },
    components: {},
}
</script>

<style scoped>
.sum {
    color: #41b883;
    margin: 0;
    font-weight: bold;
}

.samples-study {
    margin-top: 10px;
}

.one-sample-study {
    background: #41b883;
    color: white;
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 2px;
}
</style>