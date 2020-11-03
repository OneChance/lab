<template>
    <div class="mobile-div">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item :title="teacher.name" :name="teacher.id" v-for="teacher of teachers"
                              :key="teacher.id">
                <div class="mobile-item-row">
                    <el-rate v-model="teacher.rate"
                             show-text
                             :texts="texts"></el-rate>
                </div>
                <div class="mobile-item-row">
                    <el-input type="textarea" v-model="teacher.comment" placeholder="请填写评价"></el-input>
                </div>
                <div>
                    <el-button type="success" plain @click="submitRate(teacher)">提交评价</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>


<script>

import Common from "../../script/common";
import Config from "../../script/config";
import User from "../../script/server/user";

export default {
    name: "TeacherRate",
    data: function () {
        return {
            teachers: [],
            texts: ['极差', '失望', '一般', '满意', '很棒']
        }
    },
    mounted: function () {
        User.getUsers({
            page: 1,
            pageSize: 99999999,
            type: 'TEACHER',
            login: false
        }).then(res => {
            this.teachers = res.list
        })
    },
    methods: {
        submitRate(teacher) {
            console.log({id: teacher.id, rate: teacher.rate, comment: teacher.comment})
        }
    },
    components: {},
}
</script>

<style scoped>
.mobile-div {
    padding: 20px;
}
</style>