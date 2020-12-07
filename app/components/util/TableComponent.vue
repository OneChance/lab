<template>
    <div>
        <el-table
            :data="tableConfig.data"
            border
            stripe
            style="width: 100%"
            :max-height="maxHeight"
            @selection-change="tableConfig.checkBoxChange">
            <el-table-column v-if="tableConfig.checkable"
                             type="selection"
                             width="55">
            </el-table-column>
            <el-table-column
                label="#"
                type="index"
                fixed
                width="50"></el-table-column>
            <el-table-column v-for="col in tableConfig.cols" :prop="col.prop" :label="col.label" :key="col.prop"
                             :fixed="col.fixed"
                             :formatter="col.formatter" :sortable="col.sortable"
                             :width="col.width">
                <template slot-scope="scope">
                    <vif v-if="col.tag"><!--tag标签-->
                        <el-tag :type="col.tagType(scope.row[col.prop])" :size="col.tagSize">
                            {{ colValue(scope.row, col, getProp(scope.row, col.prop)) }}
                        </el-tag>
                    </vif>
                    <vif v-else>
                        {{ colValue(scope.row, col, getProp(scope.row, col.prop)) }}
                    </vif>
                </template>
            </el-table-column>
            <el-table-column
                prop="roleOper"
                fixed="right"
                :width="tableConfig.operWidth"
                label="操作">
                <template slot-scope="scope">
                    <el-tooltip v-for="o in tableConfig.oper" class="item" effect="dark" :content="o.tip.content"
                                :key="o.tip.content"
                                :placement="o.tip.placement">
                        <i :class="o.class"
                           @click="click(scope.row,o.event,o.check)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-if="tableConfig.page"
                       class="page-nav"
                       background
                       :small="small"
                       :current-page.sync="tableConfig.currentPage"
                       layout="prev, pager, next"
                       @current-change="handleCurrentChange"
                       :total="tableConfig.total">
        </el-pagination>

        <el-dialog
            title="提示"
            :visible.sync="deleteConfirm"
            width="30%"
            :close-on-click-modal="false">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="deleteConfirm = false">取 消</el-button>
            <el-button type="primary" @click="deleteConfirm = false;toDelete()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import App from '../../script/app.js'
import Config from "../../script/config";

export default {
    data: function () {
        return {
            small: false,
            maxHeight: 620,
            deleteConfirm: false,
            deleteOper: {event: {}, row: {}},
        }
    },
    props: ['tableConfig'],
    watch: {},
    methods: {
        click(row, event, check) {
            if (check) {
                this.deleteConfirm = true
                this.deleteOper.event = event
                this.deleteOper.row = row
            } else {
                event(row)
            }
        },
        toDelete() {
            this.deleteOper.event(this.deleteOper.row);
        },
        handleCurrentChange: function (val) {
            this.tableConfig.pageMethod(val)
        },
        elementSize: function (width) {
            this.small = width <= Config.size.pageNavSmallSize
        },
        getProp(row, prop) {
            if (prop.indexOf('.') !== -1) {
                let value = row
                prop.split('.').forEach(p => {
                    if (value) {
                        value = value[p]
                    }
                })
                return value
            } else {
                return row[prop]
            }
        },
        colValue(row, col, value) {
            if (col.formatter) {
                if (col.formatterType === 'raw') {
                    return col.formatter(row)
                } else {
                    return col.formatter(value)
                }
            }
            return value
        },
    },
    mounted: function () {
        let comp = this
        comp.elementSize(document.body.clientWidth)
        App.vueG.$on('windowResize', (width) => {
            comp.elementSize(width)
        })
    },
}
</script>

<style scoped>


</style>
