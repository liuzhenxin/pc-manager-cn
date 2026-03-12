<template>
    <div class="navItem">
        <el-card class="search">
            <el-row style="margin-left:-10px">
                <el-col :span="6">
                    <span class="titleLabel" style="width:70px">模板名称:</span>
                    <el-input v-model="form.name" placeholder="请输入模板名称" class="searchInputClass"></el-input>
                </el-col>
                <!-- <el-col :span="7">
                    <span class="titleLabel">IP地址:</span>
                    <el-input v-model="form.ip" placeholder="请输入IP地址" class="searchInputClass"></el-input>
                </el-col> -->

                <el-col :span="18">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getProfileList">查询</el-button>
                </el-col>
            </el-row>
            <!-- <el-row style="margin-top:20px" v-if="$commonJs.getStorage().isAdmin==true">
                <el-col :span="16">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
            </el-row> -->
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">添加模板</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="ProfileData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="模板名称">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="证书级别" prop="cert_level"></el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>

                <el-table-column label="操作" width="230">
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
import addOrg from "../organization/addOrg.vue"
export default {
    inject: ["reload"],
    components: { addOrg },
    data() {
        return {
            form: {
                name: "", //  模板名称

                organization_id: "",
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            ProfileData: [],
            menuRoleId: ""
        }
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
            console.log(
                this.$commonJs.getStorage().isAdmin,
                'v-if="$commonJs.getStorage().isAdmin==true"'
            )
        }
        this.getProfileList()
    },
    methods: {
        // 查询列表
        getProfileList() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.ProfileList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.ProfileData = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                    console.log(res, "res")
                })
        },
        organization_id(val) {
            this.form.organization_id = val
        },
        // 重置搜索框
        resultList() {
            this.reload()
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getProfileList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getProfileList()
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/TemManagementDetail",
                query: {
                    mode: 1
                }
            })
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/TemManagementDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            })
        },
        getType(status, type) {
            if (type == "启用") {
                if (status == "20") {
                    this.$message.info("当前状态与修改状态相同!")
                    return false
                }
            }
            if (type == "禁用") {
                if (status == "10") {
                    this.$message.info("当前状态与修改状态相同!")
                    return false
                }
            }
        },
        // 删除
        handleDelete(row, type) {
            console.log(row, "row")
            if (type == "删除") {
                this.$confirm("是否永久删除此条模板?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.ProfileDel, "POST", {
                                id: row.id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("删除成功!")
                                    this.getProfileList()
                                    console.log(res, "res")
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                            })
                    })
                    .catch(() => {})
            } else if (type == "禁用") {
                this.$confirm("是否禁用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    if (this.getType(row.status, "禁用") == false) {
                        return
                    }
                    this.$commonJs
                        .getMethodData(this.$url.GetUpdApp, "POST", {
                            id: row.id,
                            status: "10"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("禁用成功!")

                                this.getProfileList()
                                console.log(res, "res")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
            } else {
                this.$confirm("是否启用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    if (this.getType(row.status, "启用") == false) {
                        return
                    }
                    this.$commonJs
                        .getMethodData(this.$url.GetUpdApp, "POST", {
                            id: row.id,
                            status: "20"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("启用成功!")
                                this.getProfileList()
                                console.log(res, "res")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
            }
        }
    }
}
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
