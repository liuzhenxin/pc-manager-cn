<template>
    <div>
        <div>
            <el-table ref="userLoginTable" style="margin-top:50px;height:400px" v-loading="loading" :data="userRegisterList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',   
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="序号" prop="index"> </el-table-column>
                <el-table-column label="登录状态" prop="login">
                    <template slot-scope="scope">
                        <span v-if="scope.row.login==1">已登录</span>
                        <span v-else-if="scope.row.login==0">未登录</span>
                        <span v-else> {{scope.row.login}}</span>
                    </template>
                </el-table-column>
                <el-table-column label=" 操作">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.login != 1" @click.native.stop="logoutUser(scope.row)" type="text" size="mini" style="color: #1E90FF">登出</el-button>
                        <el-button @click.native.stop="deleteUser(scope.row)" type="text" size="mini" style="color: #da0909">删除</el-button>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
        </div>
    </div>
</template>
<script>
import { number } from "echarts"
export default {
    props: {
        // adminNum: {
        //     type: String
        // },
        adminType: {
            type: Number
        },
        Refresh: {
            type: String
        },
        isInit: {
            type: Boolean
        }
    },
    data() {
        return {
            loading: false,
            flag1: true,
            currentAddIndex: "",
            userRegisterList: []
        }
    },
    watch: {
        // adminNum(val) {
        //     this.addAdminList()
        // }
    },
    created() {
        this.addAdminList()
    },
    methods: {
        addAdminList() {
            this.loading = true
            let url
            if (this.isInit == true) {
                url = this.$url.HSMInitEnumUser
            } else {
                url = this.$url.GetEnumUser
            }
            this.$commonJs.getMethodData(url, "POST", {}).then((res) => {
                if (res.data.code == 100000) {
                    let adminList = res.data.data.manager
                    let operList = res.data.data.operator

                    if (this.adminType == 1) {
                        this.userRegisterList = adminList
                        this.$emit("loginAllNum", res.data.data.managerLogin)
                    }
                    if (this.adminType == 2) {
                        this.userRegisterList = operList
                        this.$emit("loginAllNum", res.data.data.operatorLogin)
                    }
                    this.addManagement = true
                    this.loading = false
                } else if (res.data.code != 800000) {
                    this.$message.error(res.data.msg)
                    this.loading = false
                }
            })
        },
        logoutUser(row) {
            this.currentAddIndex = row.index
            let currentType = "manager"
            let TipsName = "管理员"
            if (this.adminType == "2") {
                currentType = "operator"
                TipsName = "操作员"
            }
            this.$confirm("是否确认登出" + TipsName + "?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let url
                    if (this.isInit == true) {
                        url = this.$url.HSMInitLogoutUser
                    } else {
                        url = this.$url.LogoutUser
                    }
                    this.loading = true
                    this.$commonJs
                        .getMethodData(url, "POST", {
                            // uiUserIndex - 用户索引
                            uiUserIndex: this.currentAddIndex,
                            // uiUserIndex: this.adminStatesRegisterNum + 1,
                            // uiUserType *用户类型
                            type: currentType
                        })
                        .then((res) => {
                            this.loading = false
                            if (res.data.code == 100000) {
                                this.$alert(
                                    "登出" + TipsName + "成功",
                                    "提示",
                                    {
                                        confirmButtonText: "确定",
                                        type: "success",
                                        callback: (action) => {
                                            this.addAdminList()
                                            // window.location.reload()
                                        }
                                    }
                                )
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch((err) => (this.loading = false))
        },
        deleteUser(row) {
            this.currentAddIndex = row.index
            let currentType = "manager"
            let TipsName = "管理员"
            if (this.adminType == "2") {
                currentType = "operator"
                TipsName = "操作员"
            }
            this.$confirm("是否确认删除" + TipsName + "?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let url
                    if (this.isInit == true) {
                        url = this.$url.HSMInitDelUser
                    } else {
                        url = this.$url.DelUser
                    }
                    this.loading = true
                    this.$commonJs
                        .getMethodData(url, "POST", {
                            // uiUserIndex - 用户索引
                            uiUserIndex: this.currentAddIndex,
                            // uiUserIndex: this.adminStatesRegisterNum + 1,
                            // uiUserType *用户类型
                            type: currentType
                        })
                        .then((res) => {
                            this.loading = false
                            if (res.data.code == 100000) {
                                this.$alert(
                                    "删除" + TipsName + "成功",
                                    "提示",
                                    {
                                        confirmButtonText: "确定",
                                        type: "success",
                                        callback: (action) => {
                                            //window.location.reload()
                                            this.addAdminList()
                                            if(this.adminType!=2){
                                                this.$emit("registeAllNum", "1")
                                            }
                                        }
                                    }
                                )
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch((err) => (this.loading = false))
        }
    }
}
</script>
<style lang="less" scoped>
</style>