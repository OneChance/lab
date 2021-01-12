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
                           clearable
                           @change="chooseSample">
                    <el-option
                        v-for="sample in samplesData"
                        :key="sample.id"
                        :label="sample.name"
                        :value="sample.id">
                    </el-option>
                </el-select>

                <div class="samples-study">
                    <div v-for="sample of samples" :key="sample.id" class="one-sample-study"
                         :style="'background:'+sample.color ">
                        <div class="sample-progress" :id="'process_'+sample.id"
                             :style="'background-color:'+sample.progressColor+';width:'+sample.progressWidth"></div>
                        <div class="sample-content" :id="'sample_content_'+sample.id"
                             :style="'color:'+sample.contentColor">
                            {{ sample.name }}: {{ sample.time }}分钟
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>


<script>

import Sample from '../../script/server/manage/sample'
import ColorConverter from '../../script/colorConverter'

export default {
    name: "TeacherRate",
    data: function () {
        return {
            sum: 0,
            sampleId: '',
            samples: [],
            samplesData: [],
            maxTime: 0
        }
    },
    mounted: function () {
        document.title = '学习时长'
        let progressChange = 70 //进度条颜色差异值
        Sample.getSampleTime().then(res => {
            this.samplesData = res.list.map(s => {
                return {
                    id: s[0], name: s[1],
                    time: s[2] ? Math.floor(s[2] / 60) : 0,
                    color: s[3]
                }
            })
            this.maxTime = Math.max(...this.samplesData.map(s => s.time))
            this.sum = this.samplesData.map(s => s.time).reduce(function (prev, curr, idx, arr) {
                return prev + curr
            })
            //初始化颜色信息
            this.samplesData.forEach(s => {
                let rgb = ColorConverter.hex2rgb(s.color)
                s.progressWidth = (s.time / this.maxTime * 100) + '%'
                //根据底色决定进度条颜色和文字颜色
                if (ColorConverter.bright(rgb)) {
                    s.progressColor = "rgb(" + (rgb[0] - progressChange) + "," + (rgb[1] - progressChange) + "," + (rgb[2] - progressChange) + ")"
                    s.contentColor = "#000"
                } else {
                    s.progressColor = "rgb(" + (rgb[0] + progressChange) + "," + (rgb[1] + progressChange) + "," + (rgb[2] + progressChange) + ")"
                    s.contentColor = "#fff"
                }
            })
            this.samples = this.samplesData
        },)
    },
    methods: {
        chooseSample(value) {
            if (value) {
                this.samples = this.samplesData.filter(s => s.id === value)
            } else {
                this.samples = this.samplesData
            }
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
    color: white;
    margin-bottom: 10px;
    position: relative;
    height: 48px;
}

.sample-progress {
    background-color: rgb(47, 132, 94);
    position: absolute;
    height: 48px;
}

.sample-content {
    padding: 8px;
    position: absolute;
    height: 32px;
    font-weight: bold;
    display: flex;
    align-items: center;
}
</style>