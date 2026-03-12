<template>
    <div class="navItem">
        <el-card class="search">
            <el-row style="margin-left:-5px">
                <el-col :span="6">
                    <span class="titleLabel" style="width:35px">标题:</span>
                    <el-input v-model="form.title" placeholder="请输入标题" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="7">
                    <span class="titleLabel">OID:</span>
                    <el-input v-model="form.oid" placeholder="请输入OID" class="searchInputClass"></el-input>
                </el-col>

                <el-col :span="11">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getProfList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:20px;margin-left:-10px;width:88%" v-if="$commonJs.getStorage().isAdmin==true">
                <el-col :span="16">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">添加自定义模板</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="ProfData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="标题">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="OID" prop="oid"></el-table-column>
                <el-table-column label="是否关键">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.critical=='1'">关键</span>
                        <span style="" v-else-if="scope.row.critical=='0'">非关键</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="是否必选">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.required=='1'">必选</span>
                        <span style="" v-else-if="scope.row.required=='0'">非必选</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.status=='20'">启用</span>
                        <span style="" v-else-if="scope.row.status=='10'">停用</span>
                    </template>
                </el-table-column>
                <el-table-column label="排序" prop="sort"></el-table-column>
                <el-table-column label="描述" prop="description"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row,'删除')" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                        <!-- <el-button v-if="scope.row.status!='10'" :disabled="scope.row.status=='90'" @click.native.stop="handleDelete(scope.row,'禁用')" type="text" size="mini" class="el-icon-close" style="color: #e33ce6">禁用</el-button>
                        <el-button v-if="scope.row.status=='10'" @click.native.stop="handleDelete(scope.row,'启用')" type="text" size="mini" class="el-icon-check" style="color:#E6A23C">启用</el-button> -->

                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNow" :page-sizes="[10, 20, 50]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue";
export default {
    inject: ["reload"],
    components: { addOrg },
    data() {
        return {
            form: {
                title: "", //  标题
                type: "",
                oid: "",
                organization_id: "",
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            ProfData: [],
            menuRoleId: ""
        };
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
            console.log(
                this.$commonJs.getStorage().isAdmin,
                'v-if="$commonJs.getStorage().isAdmin==true"'
            );
        }
        this.getProfList();
    },
    methods: {
        // 查询列表
        getProfList() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.ProfList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.ProfData = res.data.page.receList;
                        this.total = res.data.page.totalRows;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                    console.log(res, "res");
                });
        },
        organization_id(val) {
            this.form.organization_id = val;
        },
        // 重置搜索框
        resultList() {
            this.reload();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getProfList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getProfList();
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/CustomTemDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w");
            this.$router.push({
                path: "/CustomTemDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            });
        },
        getType(status, type) {
            if (type == "启用") {
                if (status == "20") {
                    this.$message.info("当前状态与修改状态相同!");
                    return false;
                }
            }
            if (type == "禁用") {
                if (status == "10") {
                    this.$message.info("当前状态与修改状态相同!");
                    return false;
                }
            }
        },
        // 删除
        handleDelete(row, type) {
            console.log(row, "row");
            if (type == "删除") {
                this.$confirm("是否永久删除此条自定义模板?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.ProfDel, "POST", {
                                id: row.id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("删除成功!");
                                    this.getProfList();
                                    console.log(res, "res");
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg);
                                }
                            });
                    })
                    .catch(() => {});
            } else if (type == "禁用") {
                this.$confirm("是否禁用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    if (this.getType(row.status, "禁用") == false) {
                        return;
                    }
                    this.$commonJs
                        .getMethodData(this.$url.GetUpdApp, "POST", {
                            id: row.id,
                            status: "10"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("禁用成功!");

                                this.getProfList();
                                console.log(res, "res");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                });
            } else {
                this.$confirm("是否启用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    if (this.getType(row.status, "启用") == false) {
                        return;
                    }
                    this.$commonJs
                        .getMethodData(this.$url.GetUpdApp, "POST", {
                            id: row.id,
                            status: "20"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("启用成功!");
                                this.getProfList();
                                console.log(res, "res");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                });
            }
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
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
</style>
