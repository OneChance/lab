<template>
    <div class="mobile-div">
        <div class="full-height">
            <div class="query-wrapper">
                <el-input v-model="keyword" placeholder="请输入知识点关键字" class="query"></el-input>
                <el-button type="success" icon="el-icon-search" @click="search"></el-button>
            </div>

            <el-card class="sample-card" v-for="sample of samples" :key="sample.id" @click="toSample(sample.id)">
                <div class="card-content">
                    <el-image class="sample-img">
                        <div slot="error" class="sample-img-error">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                    <div class="sample-name">{{ sample.code }}.{{ sample.name }}</div>
                </div>
            </el-card>
        </div>
    </div>
</template>


<script>

import Sample from '../../script/server/manage/sample'

export default {
    name: "TeacherRate",
    data: function () {
        return {
            keyword: '',
            samples: []
        }
    },
    mounted: function () {
        document.title = '知识点查询'
        this.samples = [
            {
                id: 1,
                code: '104',
                name: '项韧带',
            },
            {
                id: 2,
                code: '129',
                name: '头面肌浅层',
            }
        ]
    },
    methods: {
        search() {
            console.log(this.keyword)
        },
        toSample(id) {
            console.log(id)
        }
    },
    components: {},
}
</script>

<style scoped>

</style>