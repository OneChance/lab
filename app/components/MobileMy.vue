<template>
    <div class="mobile-div">
        <div class="full-height">
            <table class="form-table mobile-item" v-if="$root.loginUser.name">
                <tr>
                    <th style="width: 30%">姓名</th>
                    <td>{{ $root.loginUser.name }}</td>
                </tr>
                <tr>
                    <th style="width: 30%">学号</th>
                    <td>{{ $root.loginUser.username }}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <el-button type="warning" plain @click="changePassword" class="mobile-item">修改密码</el-button>
                        <el-button type="danger" plain class="mobile-item"
                                   @click="logout()">注销
                        </el-button>
                    </td>
                </tr>
            </table>
            <div class="mobile-center-text" v-else>
                您已退出登录!
            </div>
        </div>
    </div>
</template>

<script>

import Account from "../script/server/account";

export default {
    created: function () {

    },
    data: function () {
        return {}
    },
    mounted: function () {
        Account.getLoginUser().then(res => {
            this.$root.loginUser = res.user
        })
        document.title = '个人信息'
    },
    methods: {
        logout() {
            Account.logOut().then(() => {

            })
            this.$root.loginUser = {}
            this.$cookie.delete('ssm_token');
            localStorage.removeItem("ssm_token");
        },
        changePassword() {
            this.$router.push('/wx/changePasswordM').catch(err => err)
        }
    },
    components: {},
}
</script>

<style scoped>

</style>
