<template>
    <div class="card-content">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>学校组织机构</span>
            </div>
            <el-tree
                :data="orgs"
                :props="defaultProps"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :render-content="renderContent">
            </el-tree>
        </el-card>

        <el-dialog title="部门信息"
                   :visible.sync="dialogFormVisible"
                   :close-on-click-modal="false">
            <el-form label-width="80px">
                <el-form-item label="上级部门">
                    <el-cascader :disabled="parentDisable"
                                 :options="orgs"
                                 change-on-select
                                 v-model="curParent"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="部门名称">
                    <el-input v-model="submitDepInfo.label"></el-input>
                </el-form-item>
                <el-form-item label="部门排序">
                    <el-input v-model="submitDepInfo.sort"></el-input>
                </el-form-item>
                <el-form-item label="部门编号">
                    <el-input v-model="submitDepInfo.no"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible=false;submit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>

import Org from '../../script/server/org'

export default {
    name: "SysCampOrg",
    mounted: function () {
        this.orgs = Org.getCompOrg()
    },
    data: function () {
        return {
            orgs: [],
            dialogFormVisible: false,
            curParent: [],
            parentDisable: false,
            submitDepInfo: {
                id: 0,
                parent: 0,
                label: "",
                sort: 0,
                no: ''
            }
        }
    },
    methods: {
        add(node) {

            this.submitDepInfo.parent = node.data.value
            this.submitDepInfo.label = node.label
            this.submitDepInfo.sort = 1
            this.parentDisable = true

            this.dialogFormVisible = true

            let parentDepPath = [];

            while (node.data.id) {
                parentDepPath.push(node.data.value);
                node = node.parent
            }

            this.curParent = parentDepPath.reverse()
        },
        edit(node) {

            this.submitDepInfo.id = node.data.value
            this.submitDepInfo.parent = node.parent.data.value
            this.submitDepInfo.label = node.label
            this.submitDepInfo.sort = node.data.sort

            this.parentDisable = node.data.value === 1;

            this.dialogFormVisible = true
            let parentDepPath = [];

            while (node.parent.data.value) {
                parentDepPath.push(node.parent.data.value);
                node = node.parent
            }

            this.curParent = parentDepPath.reverse()

        },
        submit() {
            let oldParent = this.submitDepInfo.parent;
            let newParent = this.curParent[this.curParent.length - 1]
            if (oldParent !== newParent) {
                //console.log('parent change from ' + oldParent + ' to ' + newParent)
            }
            //console.log(this.submitDepInfo)
        },
        delete(node, data) {

            this.$confirm('确定删除这个部门?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.value === data.value);
                children.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        renderContent(h, {node, data}) {
            return (
                <span
                    style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                     <span>
                     <span class='tree-icon'><i class={data.className}/>{node.label}</span>
                     </span>
                     <span>
                         <el-tooltip className="item" effect="dark" content="增加" placement="left">
                             <i class="fa fa fa-plus fa-lg click-fa primary-fa" on-click={() => this.add(node)}></i>
                         </el-tooltip>
                         <el-tooltip className="item" effect="dark" content="编辑" placement="top">
                             <i class="fa fa-pencil-square-o fa-lg click-fa warning-fa"
                                on-click={() => this.edit(node)}></i>
                         </el-tooltip>
                         <el-tooltip className="item" effect="dark" content="删除" placement="right">
                             <i class="fa fa-trash-o fa-lg click-fa"
                                on-click={() => this.delete(node)}></i>
                         </el-tooltip>
                    </span>
                 </span>);
        }
    },
    components: {},
}
</script>

<style scoped>

</style>