<template>
    <div class="card-content">
        <el-card class="box-card">

            <div slot="header" class="clearfix">
                <span>菜单</span>
            </div>

            <div class="right-button-group">
                <el-button type="primary" @click="expandAll()">全部展开</el-button>
                <el-button type="primary" @click="foldAll()">全部折叠</el-button>
                <el-button type="danger" @click="dialogVisible = true">添加菜单</el-button>
            </div>

            <el-table :data="menuList"
                      max-height="550"
                      border
                      style="width: 100%;"
                      size="medium"
                      :row-class-name="rowClassNameHandler">
                <el-table-column label="菜单名称" width="460" align="left" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :style="{marginLeft: scope.row.level * 23 + 'px'}">&ensp;</span>
                        <i v-if="scope.row.showChildren"
                           :class="{'fa fa-folder-open-o':scope.row.showChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                           @click="onExpand(scope.row)"
                           :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                        <i v-else
                           :class="{'fa fa-folder-o':scope.row.hasChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                           @click="onExpand(scope.row)"
                           :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                        <span :data-level="scope.row.level" :style="{marginLeft: 4 + 'px'}">{{ scope.row.label }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="URL" width="300" align="center"></el-table-column>
                <el-table-column label="操作" align="left">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                            <i class="fa fa-pencil-square-o fa-lg click-fa warning-fa"
                               @click="dialogVisible=true;editMenuInfo(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right">
                            <i class="fa fa-trash-o fa-lg click-fa" @click="deleteRight()"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>


        <el-dialog title="菜单信息"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false">
            <el-form label-width="100px">
                <el-form-item label="上级菜单">
                    <el-cascader :options="menuPath"
                                 change-on-select
                                 v-model="curPath"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="菜单名称">
                    <el-input v-model="menuInfo.label"></el-input>
                </el-form-item>
                <el-form-item label="URL">
                    <el-input v-model="menuInfo.url"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="menuInfo.sort"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="menuInfo.note">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible=false;submit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>

import Menu from '../script/server/menu'

export default {
    name: "SysMenu",
    mounted: function () {
        let comp = this
        Menu.getMenu().then(res => {
            comp.menus = res.menus
            comp.treeToList(this.menus, this, 0, 1)
            comp.menuPath = this.menus
        })
    },
    data: function () {
        return {
            menus: [],
            menuList: [],
            curPath: [],
            menuInfo: {
                id: 0,
                pid: 0,
                label: "",
                url: "",
                sort: 0,
                note: ''
            },
            dialogVisible: false,
            menuPath: []
        }
    },
    methods: {
        rowClassNameHandler({row}) {
            let className = 'pid-' + row.pid
            if (row.pid !== 0 && row['visible'] !== true) {
                className += ' hiddenRow'
            }
            return className
        },
        onExpand(row) {
            let self = this
            let isShowChildren = !row['showChildren']
            row['showChildren'] = isShowChildren
            self.loadSubItems(row, isShowChildren)
        },
        loadSubItems(item, isShowChildren) {
            let self = this
            for (let i = 0; i < self.menuList.length; i++) {
                if (self.menuList[i].pid === item.id) {
                    if (isShowChildren) {
                        self.menuList[i].visible = true
                    } else {
                        if (self.menuList[i].visible) {
                            self.menuList[i].visible = false
                            if (self.menuList[i].hasChildren) {
                                self.menuList[i].showChildren = false
                            }
                        }
                        self.loadSubItems(self.menuList[i], false);
                    }
                }
            }
        },
        expandAll() {
            for (let i = 0; i < this.menuList.length; i++) {
                if (this.menuList[i].hasChildren) {
                    this.menuList[i].showChildren = true;
                }
                this.menuList[i].visible = true;
            }
        },
        foldAll() {
            for (let i = 0; i < this.menuList.length; i++) {
                if (this.menuList[i].hasChildren) {
                    this.menuList[i].showChildren = false;
                }
                if (this.menuList[i].level !== 1) {
                    this.menuList[i].visible = false;
                }
            }
        },
        submit() {

        },
        editMenuInfo(row) {
            this.menuInfo.id = row.id
            this.menuInfo.pid = row.pid
            this.menuInfo.label = row.label
            this.menuInfo.url = row.url

            //获取cascade当前路径
            //获取cascade当前路径
            let tmp = []

            for (let menu of this.menuList) {
                tmp.push(menu);
            }

            this.curPath = []

            let recordId = row.pid

            for (let menu of tmp.reverse()) {
                if (menu.id === recordId) {
                    this.curPath.push(recordId)
                    recordId = menu.pid
                }
            }
            this.curPath = this.curPath.reverse()
        },
        deleteRight() {

        },
        treeToList(tree, comp, pid, level) {
            for (let t of tree) {
                let item = {
                    id: t.value,
                    pid: pid,
                    label: t.label,
                    url: t.value,
                    level: level,
                    showChildren: false,
                    hasChildren: t.children !== null,
                    visible: level === 1,
                    isLeaf: t.children === null
                }
                comp.menuList.push(item)
                if (t.children) {
                    this.treeToList(t.children, comp, t.value, level + 1)
                }
            }
        }
    },
    components: {},
}
</script>

<style scoped>
.right-button-group {
    margin-bottom: 20px;
}
</style>