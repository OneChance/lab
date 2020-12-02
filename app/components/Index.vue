<template id="index">
    <div>
        <el-row :gutter="24" class="header-bar">
            <el-col :span="4">
                <div class="logo fl">
                    <i class="fa fa-bars fa-lg small-menu-bar" aria-hidden="true"></i>
                    <span class="logo-title">
                        实验室管理系统
                    </span>
                </div>
            </el-col>

            <el-col :span="16" class="header-navi">
                <el-menu :default-active="activeMenuIndex" class="el-menu-demo navi-menu banner-back" mode="horizontal"
                         text-color="#fff"
                         background-color="#347dd6"
                         active-text-color="#fff"
                         @select="handleSelect"
                         router="true">
                    <el-menu-item :index="menu.url" v-for="menu in menus" :key="menu.id">
                        {{ menu.name }}
                    </el-menu-item>
                </el-menu>
            </el-col>

            <el-col :span="4" class="header-bar-right">
                <el-menu class="el-menu-demo" mode="horizontal"
                         background-color="#347dd6"
                         text-color="#fff"
                         active-text-color="#fff"
                         @select="handleSelect">
                    <el-submenu index="userOper">
                        <template slot="title">{{ $root.loginUser.name }}</template>
                        <el-menu-item index="changePassword">修改密码</el-menu-item>
                        <el-menu-item index="signOut">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>

        </el-row>

        <div class="main_center" id="main_center">
            <router-view></router-view>
        </div>

        <el-dialog title="修改密码"
                   :visible.sync="changePasswordDialog"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="passForm" :model="passForm" :rules="passForm.rules" label-width="80px">
                    <el-form-item label="新密码" prop="newPass">
                        <el-input type='password' v-model="passForm.newPass"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPass">
                        <el-input type='password' v-model="passForm.confirmPass"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changePasswordDialog = false">取 消</el-button>
                <el-button type="primary" @click="changePassword">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import Account from '../script/server/account.js'

export default {
    created: function () {

    },
    watch: {
        $route(route) {
            this.setActive(route.path)
        }
    },
    data: function () {
        return {
            menus: [],
            activeMenuIndex: '',
            changePasswordDialog: false,
            passForm: {
                newPass: '',
                confirmPass: '',
                rules: {
                    newPass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                    ],
                    confirmPass: [
                        {required: true, message: '请确认新密码', trigger: 'blur'},
                    ],
                }
            },
        }
    },
    mounted: function () {

        Account.getLoginUser().then(res => {
            this.menus = res.menus
            res.user.menus = res.menus
            this.$root.loginUser = res.user
            this.$root.$emit('menuInfo')
            this.setActive(this.$route.path)
        })

        window.onresize = () => {
            return (() => {
                this.$root.$emit('windowResize', document.body.clientWidth)
            })();
        };
    },
    methods: {
        changePassword: function () {
            this.$refs['passForm'].validate((valid) => {
                if (valid) {
                    if (this.passForm.newPass !== this.passForm.confirmPass) {
                        this.$notify.error({
                            title: '错误',
                            message: '新密码与确认密码不一致'
                        });
                    } else {
                        Account.updatePassword({
                            password: this.passForm.newPass
                        }).then(() => {
                            this.changePasswordDialog = false
                            this.$message({
                                message: '密码已修改',
                                type: 'success'
                            });
                        })
                    }
                }
            })
        },
        signOut: function () {
            Account.logOut().then(() => {
                this.$router.push('/sign').catch(err => err);
            })
            this.$cookie.delete('ssm_token');
            localStorage.removeItem("ssm_token");
        },
        handleSelect(key) {
            if (key === 'signOut') {
                this.signOut()
            } else if (key === 'changePassword') {
                this.changePasswordDialog = true
                this.$nextTick(() => {
                    this.$refs.passForm.resetFields();
                })
            }
        },
        setActive(path) {
            let appMenu = this.$root.loginUser.menus.filter(m => m.url === '/index/app')[0]
            let sysMenu = this.$root.loginUser.menus.filter(m => m.url === '/index/sys')[0]
            if (path === '/index' || path === '/index/' || path === '/index/app' || path === '/index/app/') {
                if (appMenu) {
                    this.$router.push(appMenu.childrens[0].url).catch(err => err);
                }
            } else if (path === '/index/sys' || path === '/index/sys/') {
                if (sysMenu) {
                    this.$router.push(sysMenu.childrens[0].url).catch(err => err);
                }
            }
            this.activeMenuIndex = path.split('/').slice(0, 3).join('/')
        },
    },
    components: {},
}
</script>

<style scoped>

</style>
