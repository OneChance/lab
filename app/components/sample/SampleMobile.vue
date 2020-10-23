<template>
    <el-card class="box-card mobile-card">
        <div slot="header" class="clearfix">
            <span>XXX标本</span>
        </div>

        <div><img :src="img" alt="" style="width: 100%"></div>

        <div>
            <audio :src="sound" controls="controls"></audio>
        </div>

        <div>简化流程：设计简洁直观的操作流程；</div>

        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="知识点1" name="1">
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item title="知识点2" name="2">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
        </el-collapse>
    </el-card>
</template>


<script>


export default {
    name: "SampleMobile",
    data: function () {
        return {
            img: require("../../assets/images/1.jpg"),
            sound: require("../../assets/sounds/1.mp3"),
        }
    },
    mounted: function () {

    },
    methods: {},
    components: {},
}
</script>

<style scoped>

</style>