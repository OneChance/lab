<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.name" placeholder="角色名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                </el-form-item>
            </el-form>
            <table-component v-bind:tableConfig="tableConfig"></table-component>
        </el-card>

        <!--角色分配用户Dialog-->
        <el-dialog :title="currentRow.name+'用户分配'"
                   :visible.sync="roleUsersDialogVisible"
                   :close-on-click-modal="false"
                   class="role-user">
            <template>
                <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    v-model="alloced"
                    :titles="['待分配', '已分配']"
                    @change="handleChange"
                    :data="alloc">
                </el-transfer>
            </template>

            <div slot="footer" class="dialog-footer">
                <el-button @click="roleUsersDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleUsersDialogVisible=false;commitRoleUsers()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import Role from '../../script/server/role'
import User from '../../script/server/user'
import Common from '../../script/common'
import TableComponent from "../util/TableComponent";
import Config from "../../script/config";

export default {
    name: "SysRole",
    mounted: function () {
        this.list()
    },
    data: function () {
        return {
            query: {
                name: '',
            },
            roleUsersDialogVisible: false,
            currentRow: {},
            alloc: [],    //角色待分配用户
            alloced: [],  //角色已分配用户
            filterMethod(query, item) {
                return item.search.indexOf(query) > -1;
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '名称', width: '180'},
                ],
                oper: [
                    {
                        class: 'fa fa fa-user-o fa-lg click-fa primary-fa',
                        tip: {content: '分配用户', placement: 'right'},
                        event: this.roleUsers,
                    },
                ]
            },
        }
    },
    methods: {
        roleUsers: function (row) {
            this.roleUsersDialogVisible = true
            this.currentRow = row
            let comp = this

            //数据清除
            comp.alloc = []
            comp.alloced = []

            //初始化穿梭框左边数据
            let data = {
                page: 1,
                pageSize: 99999999
            }

            //加载所有用户
            User.getUsers(data).then(result => {
                let search = result.list.content.map(u => u.name);
                result.list.content.forEach((user, index) => {
                    comp.alloc.push({
                        label: user.name,
                        key: user.id,
                        search: search[index]
                    });
                });
            })

            //加载已分配的用户
            Role.getRole({id: row.id}).then(result => {
                result.role.users.forEach(u => {
                    this.alloced.push(u.user.id)
                })
            })
        },
        commitRoleUsers: function () {
            let users = []
            this.alloced.forEach(u => {
                users.push({user: {id: u}})
            })
            Role.saveRoleUsers({
                id: this.currentRow.id,
                users: users
            })
        },
        handleChange(value, direction, movedKeys) {

        },
        queryList: function () {
            this.list(this.query)
        },
        toPage: function (val) {
            this.list({page: val})
        },
        list(config) {
            let data = Common.copyObject(Config.page)
            for (let prop in config) {
                data[prop] = config[prop]
            }
            this.tableConfig.currentPage = data.page
            Role.getRoles(data).then(res => {
                //如果以后多选框,清除所选数据
                this.tableConfig.data = res.list.content
                this.tableConfig.total = res.list.totalElements
            })
        },
    },
    components: {TableComponent}
}
</script>

<style scoped>

</style>