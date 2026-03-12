<template>
    <div class="navItem">
        <el-card class="search">
            <el-row style="margin-left:-10px">
                <el-col :span="6">
                    <span class="titleLabel" style="width:70px">用户名称:</span>
                    <el-input v-model="form.fullname" placeholder="请输入用户名称" class="searchInputClass"></el-input>
                </el-col>


                <el-col :span="18">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getSvsUserList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:20px;margin-left:-10px" v-if="$commonJs.getStorage().isAdmin==true">
                <el-col :span="16">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="UserData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="用户名称">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">{{scope.row.fullname}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户标识" prop="userid"></el-table-column>
                <el-table-column label="用户部门" prop="dept_name"></el-table-column>
                <el-table-column label="联系方式" prop="tel"></el-table-column>
                <el-table-column label="用户状态">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.status=='10'">停用</span>
                        <span style="" v-else-if="scope.row.status=='20'">启用</span>
                        <span style="" v-else>注销</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="350">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="showUserId(scope.row)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">应用标识</el-button>
                        <el-button @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row,'删除')" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                        <el-button v-if="scope.row.status!='10'" :disabled="scope.row.status=='90'" @click.native.stop="handleDelete(scope.row,'禁用')" type="text" size="mini" class="el-icon-close" style="color: #e33ce6">禁用</el-button>
                        <el-button v-if="scope.row.status=='10'" @click.native.stop="handleDelete(scope.row,'启用')" type="text" size="mini" class="el-icon-check" style="color:#E6A23C">启用</el-button>

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
        <el-dialog title="用户标识" :visible.sync="showUserIdDialog" width="35%" :before-close="handleClose">
            <el-form label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="userid:" label-width="110px">
                            <el-input style="width:50%" id="myInput" readonly="true" v-model="userId" type="text">
                            </el-input>
                            <el-button size="mini" type="primary" style="padding:3px 30px;margin-left:17px" @click="copyData">复制</el-button>

                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleClose()">取 消</el-button>
            </span>
        </el-dialog>

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
                fullname: "", //  用户名称
                ip: "",
                tel: "",
                organization_id: "",
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            UserData: [],
            menuRoleId: "",
            showUserIdDialog: false,
            userId: ""
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
        this.getSvsUserList()
    },
    methods: {
        // 查询列表
        getSvsUserList() {
            // let data = form;
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.SvsUserList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.UserData = res.data.page.receList
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
            this.getSvsUserList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getSvsUserList()
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/userManagementDetail",
                query: {
                    mode: 1
                }
            })
        },
        showUserId(row) {
            this.showUserIdDialog = true
            this.userId = row.userid
        },
        handleClose(type) {
            this.showUserIdDialog = false
        },
        copyData() {
            /* 获取文本内容 */
            var copyText = document.getElementById("myInput")

            /* 选择复制内容 */
            copyText.select()
            copyText.setSelectionRange(0, 99999) /* 为移动设备设置 */

            /* 复制内容到文本域 */
            navigator.clipboard.writeText(copyText.value)

            /* 弹出已复制的内容 */
            // alert("复制的文本为: " + copyText.value);

            this.$message.success("复制的文本为: " + copyText.value)
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/userManagementDetail",
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
                this.$confirm("是否永久删除此条用户管理?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.GetDelOneSvsUser, "POST", {
                                id: row.id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("删除成功!")
                                    this.getSvsUserList()
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
                        .getMethodData(this.$url.UpdSvsUser, "POST", {
                            id: row.id,
                            status: "10"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("禁用成功!")

                                this.getSvsUserList()
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
                        .getMethodData(this.$url.UpdSvsUser, "POST", {
                            id: row.id,
                            status: "20"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("启用成功!")
                                this.getSvsUserList()
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
