<template>
    <div class="navItem">
        <el-card class="search">
            <el-row v-if="isAdmin==true">
                <el-col :span="18">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
                <el-col :span="6">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getrCertList">查询</el-button>
                </el-col>
                <!-- <el-col :span="6" style="margin-bottom:20px;margin-left:20px;">
                    <span class="titleLabel">组织机构:</span>
                    <el-input disabled @click.native.stop="getOrganizationTree" v-model="form.organizationFatherName" placeholder="请选择组织机构" style="width:55%" class="searchInputClass disabledPointer"></el-input>
                </el-col> -->
            </el-row>
            <el-row>
                <el-col>
                    <el-button :style="{'margin-top':isAdmin==true?'20px':'0px'}" size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">添加根证书</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="issuanceData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column label="组织名称" style="text-align:left !important">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer;text-align:left !important" @click="xiangqing(scope.row,2)">
                            {{scope.row.subject}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="证书主题" prop="issuer"></el-table-column>

                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <!-- 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】 -->
                        <span v-if="scope.row.status=='20'" class="statusSuccess">启用</span>
                        <span v-else-if="scope.row.status=='10'" class="statusError">停用</span>
                        <span v-else class="statusError">注销</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="155">
                    <template slot-scope="scope"  >
                        <el-button @click.native.stop="handleDelete(scope.row,'删除')" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                        <el-button v-if="scope.row.status=='20'" @click.native.stop="handleDelete(scope.row,'禁用')" type="text" size="mini" class="el-icon-close" style="color: #e33ce6">禁用</el-button>
                        <el-button v-if="scope.row.status=='10'" @click.native.stop="handleDelete(scope.row,'启用')" type="text" size="mini" class="el-icon-check" style="color:#E6A23C">启用</el-button>
                    </template>
                </el-table-column> -->
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
                organization_id: "",
                organizationFatherName: "",
                status: "", // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                // issuer: "", // 证书颁发者
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 10,
            issuanceData: [],
            menuRoleId: "",
            isAdmin: false
        };
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
        } else {
            this.isAdmin = true;
        }
        this.getrCertList();
    },
    methods: {
        // 查询列表
        getrCertList() {
            // let data = form;
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.CertList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.issuanceData = res.data.data;
                        // this.total = res.data.page.totalRows;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }

                    console.log(
                        res,
                        "res",
                        " this.issuanceData",
                        this.issuanceData
                    );
                    this.loading = false;
                });
        },
        organization_id(data) {
            console.log(data, "pppppppppppp");
            this.form.organization_id = data;
        },
        getOrganizationTree() {
            this.dialogVisible = true;
            // let data = form;
            this.$commonJs
                .getMethodData(this.$url.GetOrganizationList, "POST", {
                    status: ""
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // debugger;
                        this.organizationList = JSON.parse(res.data.data);
                        console.log(this.organizationList, "res");
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    console.log(res, "res");
                });
        },
        // 重置搜索框
        resultList() {
            this.reload();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getrCertList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getrCertList();
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/RootCertDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w");
            this.$router.push({
                path: "/RootCertDetail",
                query: {
                    mode: mode,
                    id: row.id,
                    appcertNum: row.serial_number
                }
            });
        },
        // 删除
        handleDelete(row, type) {
            console.log(row, "row");
            if (type == "删除") {
                this.$confirm("是否永久删除此条证书颁发机构?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.DelOneCert, "POST", {
                                id: row.id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("删除成功!");
                                    this.getrCertList();
                                    console.log(res, "res");
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg);
                                }
                                this.getrCertList();
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            } else if (type == "禁用") {
                this.$confirm("是否禁用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                    this.$commonJs
                        .getMethodData(this.$url.UpdStatus, "POST", {
                            id: row.id,
                            status: "10"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("禁用成功!");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            this.getrCertList();
                        });
                });
            } else {
                this.$confirm("是否启用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    this.$commonJs
                        .getMethodData(this.$url.UpdStatus, "POST", {
                            id: row.id,
                            status: "20"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("启用成功!");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            this.getrCertList();
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
