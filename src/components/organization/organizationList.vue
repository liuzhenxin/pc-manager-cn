<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card style="padding:20px 0">
            <tree-table ref="table" :data="organizationList" :columns="columns" :border="true" :show-index="false" :expand-type="false" :selection-type="false" index-text="#">
                <template slot="status" slot-scope="scope">
                    <span v-if="scope.row.status == '10'" class="statusError">未审核</span>
                    <span v-else-if="scope.row.status == '11'" class="statusError">审核中</span>
                    <span v-else-if="scope.row.status == '12'" class="statusError">审核未通过</span>
                    <span v-else-if="scope.row.status == '31'" class="statusError">冻结</span>
                    <span v-else-if="scope.row.status == '32'" class="statusError">封号</span>
                    <span v-else-if="scope.row.status == '38'" class="statusError">停用</span>
                    <span v-else-if="scope.row.status == '39'" class="statusError">异常</span>
                    <span v-else class="statusSuccess">正常</span>
                </template>
                <template slot="action" slot-scope="scope">
                    <el-button @click.native.stop="xiangqing(scope.row,1,'insertChildren')" type="text" size="mini" class="el-icon-plus" style="color: #67C23A">增加子组织机构</el-button>
                    <el-button @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                    <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                </template>
            </tree-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: false,
            total: 0,
            organizationList: [],
            columns: [
                { label: "组织名称", align: "left", prop: "name", tree: true },
                {
                    label: "地址",
                    align: "center",
                    prop: "address",
                    headerAlign: "center"
                },
                {
                    label: "联系人",
                    align: "center",
                    prop: "contact",
                    headerAlign: "center"
                },
                {
                    label: "联系方式",
                    align: "center",
                    prop: "contact_tel",
                    headerAlign: "center"
                },
                {
                    label: "状态",
                    align: "center",
                    prop: "status",
                    headerAlign: "center",
                    template: "status",
                    type: "template"
                },
                {
                    label: "操作",
                    align: "center",
                    prop: "action",
                    template: "action",
                    type: "template",
                    width: "300px",
                    headerAlign: "center"
                }
            ]
        };
    },
    created() {
        this.getOrganizationList();
    },
    methods: {
        // 查询列表
        getOrganizationList() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.GetOrganizationList, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.organizationList = res.data.data;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                });
        },

        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/organizationDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode, type) {
            this.$router.push({
                path: "/organizationDetail",
                query: {
                    organizationRow: JSON.stringify(row),
                    mode: mode,
                    id: row.id,
                    type: type
                }
            });
        },
        // 删除
        handleDelete(row) {
            this.$confirm("是否永久删除此组织机构?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.GetdelOrganization, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!");
                                this.getOrganizationList();
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                })
                .catch((err) => err);
        }
    }
};
</script>

<style lang="less" scoped>
.box-card {
    height: 50px;
    line-height: 50px;
}
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}
/deep/ .zk-table__header-row {
    background-color: #fff;
    font-size: 14px;
    height: 65px;
}
/deep/ .zk-table--row-hover {
    background-color: #f5f7fa;
}
/deep/ .zk-table__body-row {
    height: 56px;
    font-size: 14px;
}
</style>
