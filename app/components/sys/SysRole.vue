<template>
    <div class="card-content">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.name" placeholder="角色名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                    <el-button type="success" @click="add">新增</el-button>
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
                <el-button type="primary" @click="commitRoleUsers()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="角色信息"
                   :visible.sync="roleInfoDialogVisible"
                   :close-on-click-modal="false">
            <template>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="角色名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="标识" prop="sign">
                        <el-input v-model="form.sign"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleInfoDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="commit()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="菜单权限"
                   :visible.sync="roleMenusVisible"
                   :close-on-click-modal="false">
            <template>
                <el-tree
                    :data="menus"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps">
                </el-tree>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleMenusVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitRoleMenus()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import Role from '../../script/server/role'
import Common from '../../script/common'
import TableComponent from "../util/TableComponent";
import Config from "../../script/config";
import User from "../../script/server/user";
import Menu from "../../script/server/menu"

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
            form: {
                id: '',
                name: '',
                sign: ''
            },
            roleInfoDialogVisible: false,
            addRole: false,
            roleUsersDialogVisible: false,
            roleMenusVisible: false,
            currentRow: {},
            alloc: [],    //角色待分配用户
            alloced: [],  //角色已分配用户
            filterMethod(query, item) {
                return item.search.indexOf(query) > -1;
            },
            rules: {
                name: [
                    {required: true, message: '请输入角色名', trigger: 'blur'},
                ],
                sign: [
                    {required: true, message: '请输入标识', trigger: 'blur'},
                ],
            },
            tableConfig: {
                data: [],
                page: true,
                pageMethod: this.toPage,
                cols: [
                    {prop: 'name', label: '名称', width: '580'},
                ],
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa warning-fa',
                        tip: {content: '编辑', placement: 'top'},
                        event: this.edit,
                    },
                    {
                        class: 'fa fa-trash-o fa-lg click-fa danger-fa',
                        tip: {content: '删除', placement: 'top'},
                        event: this.delete,
                        check: true
                    }, {
                        class: 'fa fa fa-user-o fa-lg click-fa primary-fa',
                        tip: {content: '分配用户', placement: 'top'},
                        event: this.roleUsers,
                    },
                    {
                        class: 'fa fa fa-bars fa-lg click-fa success-fa',
                        tip: {content: '分配菜单', placement: 'right'},
                        event: this.roleMenus,
                    },
                ]
            },
            menus: []
        }
    },
    methods: {
        add: function () {
            this.roleInfoDialogVisible = true
            this.addRole = true
            this.$nextTick(() => {
                this.$refs['form'].resetFields();
                this.form.id = ''
            });
        },
        edit: function (row) {
            this.roleInfoDialogVisible = true
            Role.getRole({id: row.id}).then(result => {
                this.roleInfoDialogVisible = true
                this.$nextTick(() => {
                    this.form = result.role
                    this.addRole = false
                })
            })
        },
        delete: function (row) {
            Role.deleteRole({id: row.id}).then(() => {
                this.operSuccess(this)
            })
        },
        commit: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.addRole) {
                        Role.saveRole(this.form).then(() => {
                            this.operSuccess(this)
                            this.roleInfoDialogVisible = false;
                        })
                    } else {
                        Role.updateRole(this.form).then(() => {
                            this.operSuccess(this)
                            this.roleInfoDialogVisible = false;
                        })
                    }
                }
            })
        },
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
                pageSize: 99999999,
            }

            //加载所有用户
            User.getUsers(data).then(result => {
                let search = result.list.map(u => u.name);
                result.list.forEach((user, index) => {
                    comp.alloc.push({
                        label: user.name,
                        key: user.id,
                        search: search[index]
                    });
                });
            })

            //加载已分配的用户
            Role.getRoleUsers({id: row.id, page: 1, pageSize: 9999999}).then(result => {
                result.list.forEach(u => {
                    this.alloced.push(u.userId)
                })
            })
        },
        roleMenus(row) {
            this.roleMenusVisible = true
            this.currentRow = row
            Menu.getMenu({page: 1, pageSize: 9999999}).then(res => {
                //构建菜单树
                const idMapping = res.list.reduce((map, node, index) => {
                    map[node.id] = index
                    return map
                }, {})
                let root = {id: 0};
                res.list.forEach(menu => {
                    let p = menu.pid === 0 ? root : res.list[idMapping[menu.pid]]
                    menu.label = menu.name
                    p.children = [...(p.children || []), menu]
                })
                this.menus = root.children

                //获得已分配菜单
                Role.getRoleMenus({id: row.id, page: 1, pageSize: 9999999}).then(res => {
                    this.$refs.tree.setCheckedKeys(res.list.map(m => m.menuId));
                })
            })
        },
        commitRoleMenus: function () {
            //如果父节点勾选,清除其子节点
            let checked = []
            let needCheck = [...this.menus]
            while (needCheck.length > 0) {
                let node = needCheck.pop()
                if (this.$refs.tree.getCheckedKeys().includes(node.id)) {
                    checked.push(node)
                } else {
                    if (node.children) {
                        needCheck = [...needCheck, ...node.children]
                    }
                }
            }
            Role.saveRoleMenus({
                id: this.currentRow.id,
                menus: checked.map(n => Object({menuId: n.id}))
            }).then(() => {
                this.roleMenusVisible = false;
                this.$message({
                    message: '分配成功',
                    type: 'success'
                });
            })
        },
        commitRoleUsers: function () {
            let users = []
            this.alloced.forEach(u => {
                users.push({userId: u})
            })
            Role.saveRoleUsers({
                id: this.currentRow.id,
                users: users
            }).then(() => {
                this.roleUsersDialogVisible = false;
                comp.$message({
                    message: '分配成功',
                    type: 'success'
                });
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
                this.tableConfig.data = res.list
                this.tableConfig.total = res.count
            })
        },
        operSuccess(comp) {
            this.roleInfoDialogVisible = false
            comp.$message({
                message: '操作成功',
                type: 'success'
            });
            comp.list({page: 1})
        },
    },
    components: {TableComponent}
}
</script>

<style scoped>

</style>