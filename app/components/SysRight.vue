<template>
    <div class="card-content">
        <el-card class="box-card">

            <div slot="header" class="clearfix">
                <span>权限</span>
            </div>

            <div class="right-button-group">
                <el-button type="primary" @click="expandAll()">全部展开</el-button>
                <el-button type="primary" @click="foldAll()">全部折叠</el-button>
                <el-button type="danger" @click="dialogVisible = true">添加权限</el-button>
            </div>

            <el-table :data="rights" border style="width: 100%;" size="medium" :row-class-name="rowClassNameHandler">
                <el-table-column label="权限名称" width="460" align="left" show-overflow-tooltip>
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
                <el-table-column prop="categoryid" label="菜单URL" width="80" align="center"></el-table-column>
                <el-table-column prop="parentcategoryid" label="排序号" width="80" align="center"></el-table-column>
                <el-table-column prop="undeployed" label="类型" align="left"></el-table-column>
                <el-table-column prop="deployed" label="Code" align="left"></el-table-column>
                <el-table-column prop="edit" label="操作" align="left">
                    <template slot-scope="scope" v-if="!scope.row.hasChildren">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                            <i class="fa fa-pencil-square-o fa-lg click-fa warning-fa"
                               @click="dialogVisible=true;editRight(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right">
                            <i class="fa fa-trash-o fa-lg click-fa" @click="deleteRight()"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>


        <el-dialog title="权限信息"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false">
            <el-form label-width="100px">
                <el-form-item label="所在菜单">
                    <el-cascader :options="rightPath"
                                 change-on-select
                                 v-model="curPath"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="权限点名称">
                    <el-input v-model="rightsInfo.label"></el-input>
                </el-form-item>
                <el-form-item label="权限点URL">
                    <el-input v-model="rightsInfo.url"></el-input>
                </el-form-item>
                <el-form-item label="权限点类型">
                    <template>
                        <el-radio v-model="rightsInfo.type" label="1">页面</el-radio>
                        <el-radio v-model="rightsInfo.type" label="2">按钮</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="rightsInfo.sort"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="rightsInfo.note">
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

import Right from '../script/server/right'

export default {
    name: "SysRight",
    mounted: function () {

        this.rights = Right.getRights()

        //格式化cascader数据====================================================
        let rightsPrepare = []

        for (let right of this.rights) {
            rightsPrepare.push(right);
        }

        for (let right of rightsPrepare.reverse()) {
            if (right.isLeaf) {
                continue
            }
            let addObj = {value: right.id, label: right.label, pid: right.pid}
            let last = this.rightPath.pop();
            while (last) {
                if (last.pid === right.id) {
                    if (!addObj.children) {
                        addObj.children = []
                    }
                    addObj.children.push(last)
                } else {
                    this.rightPath.push(last)
                    break;
                }
                last = this.rightPath.pop()
            }
            this.rightPath.push(addObj)
        }
        this.rightPath = this.rightPath.reverse()
        //======================================================================
    },
    data: function () {
        return {
            rights: [],
            curPath: [],
            rightsInfo: {
                id: 0,
                pid: 0,
                label: "",
                url: "",
                type: "",
                sort: 0,
                note: ''
            },
            dialogVisible: false,
            rightPath: []
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
            for (let i = 0; i < self.rights.length; i++) {
                if (self.rights[i].pid === item.id) {
                    if (isShowChildren) {
                        self.rights[i].visible = true
                    } else {
                        if (self.rights[i].visible) {
                            self.rights[i].visible = false
                            if (self.rights[i].hasChildren) {
                                self.rights[i].showChildren = false
                            }
                        }
                        self.loadSubItems(self.rights[i], false);
                    }
                }
            }
        },
        expandAll() {
            for (let i = 0; i < this.rights.length; i++) {
                if (this.rights[i].hasChildren) {
                    this.rights[i].showChildren = true;
                }
                this.rights[i].visible = true;
            }
        },
        foldAll() {
            for (let i = 0; i < this.rights.length; i++) {
                if (this.rights[i].hasChildren) {
                    this.rights[i].showChildren = false;
                }
                if (this.rights[i].level !== 1) {
                    this.rights[i].visible = false;
                }
            }
        },
        submit() {

        },
        editRight(row) {
            this.rightsInfo.id = row.id
            this.rightsInfo.pid = row.pid
            this.rightsInfo.label = row.label

            //获取cascade当前路径
            let rightsPrepare = []

            for (let right of this.rights) {
                rightsPrepare.push(right);
            }

            this.curPath = []

            let recordId = row.pid

            for (let right of rightsPrepare.reverse()) {
                if (right.id === recordId) {
                    this.curPath.push(recordId)
                    recordId = right.pid
                }
            }

            this.curPath = this.curPath.reverse()
        },
        deleteRight() {

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