<template>
    <div>
        <el-table ref="userLoginTable" style="margin-top:30px;margin-bottom:50px" v-loading="loading" :data="userLoginList" tooltip-effect="dark" :header-cell-style="{
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
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.login!='1'" @click.native.stop="pushPIN(scope.row)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改PIN</el-button>
                    <el-button :disabled="scope.row.login != 1" @click.native.stop="logoutUser(scope.row)" type="text" size="mini" style="color: #1E90FF">登出</el-button>
                    <el-button @click.native.stop="deleteUser(scope.row)" type="text" size="mini" style="color: #da0909">删除</el-button>
                </template>
            </el-table-column>
            <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
            </div>
        </el-table>
        <el-dialog :title="'修改'+TipsName+'PIN'" :visible.sync="modifyPINDialog" width="45%">
            <div class="navItem">
                <el-card class="CardClass">
                    <div class="boxStyle" style=" margin-top:10px;height:auto">
                        <span>本页可以修改USBKey的口令，请将需要修改的USBkey插入密码设备的USB插槽中。</span>
                    </div>
                    <div style="margin-top:30px;margin-left:200px">
                        <div v-if="isPIN == undefined">
                            <span class="titleLabel" style="width:75px;margin-left:-32px;">证书序列号:</span>
                            <el-select v-model="certSn" placeholder="请选择证书序列号" style="width:45%;margin-left:10px" @change="certChange">
                                <el-option v-for="item in certSnList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <br>
                            <span class="titleLabel" style="width:75px;margin-left:-17px;">证书主题:</span>
                            <el-input style="width:45%;margin-left:10px" disabled v-model="subject" placeholder="请输入证书主题">
                            </el-input>
                            <br>
                        </div>
                        <span class="titleLabel" style="width:75px;">原口令:</span>
                        <el-input style="width:45%;margin-left:10px" v-model="pinContent" prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'" placeholder="请输入原口令">
                        </el-input>
                        <br>
                        <span class="titleLabel" style="width:75px;margin-top:30px;">新口令:</span>
                        <el-input style="width:45%;margin-left:10px" v-model="newPinContent" prefix-icon="el-icon-lock" :type="flag2 ? 'password' : 'text'" placeholder="请输入新口令(新密码由大写字母，小写字母，数字，特殊字符中的三种组成的长度为8的字符串)">
                        </el-input>
                        <br>
                        <span class="titleLabel" style="width:75px;margin-left:-32px;margin-top:30px;">确认新口令:</span>
                        <el-input style="width:45%;margin-left:10px" v-model="addNewPinContent" prefix-icon="el-icon-lock" :type="flag3 ? 'password' : 'text'" placeholder="请确认新口令">
                        </el-input>
                        <br>
                        <div style="margin-left:60px;margin-top:20px;margin-bottom:30px;">
                            <el-button style="" type="primary" @click="resetSelf()" size="mini"><i class="el-icon-refresh-right iconRight"></i>重置</el-button>
                            <el-button style="margin-left:10px;margin-top:30px;" type="primary" @click="uploadSelf()" size="mini"><i class="el-icon-document-checked iconRight"></i>提交修改</el-button>
                            <el-button v-if="isPIN != undefined" style="margin-left:10px;margin-top:30px;" type="primary" @click="cancel()" size="mini">取消</el-button>
                        </div>

                    </div>

                </el-card>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { JKunitrust } from "../../assets/js/JKunitrust.js"
import $ from "jquery"
export default {
    props: {
        adminType: {
            type: Number
        },
        Refresh: {
            type: String
        }
    },
    data() {
        return {
            loading: false,
            flag1: true,
            currentAddIndex: 0,
            userLoginList: [],
            adminStatesRegisterNum: 0,
            operStatesregisterNum: 0,
            adminStatesLoginNum: 0,
            isPIN: "", //修改PIN
            flag1: true,
            flag2: true,
            flag3: true,
            pinContent: "",
            newPinContent: "",
            addNewPinContent: "",
            aaa: "",
            id_app_count: 0,
            id_app_select: [],
            isSuccess: "",
            certSn: "",
            subject: "",
            certSnList: [],
            userId: this.$route.query.id,
            userCertList: [],
            uiUserType: "", //manager:管理员  operator:操作员 user：用户
            TipsName: "",
            modifyPINDialog: false
        }
    },
    created() {
        if (this.adminType == "1") {
            this.uiUserType = "manager"
            this.TipsName = "管理员"
        } else if (this.adminType == "2") {
            this.uiUserType = "operator"
            this.TipsName = "操作员"
        } else {
            this.uiUserType = "user"
            this.TipsName = "用户"
        }

        this.addAdminList()
    },
    methods: {
        addAdminList() {
            this.loading = true
            this.userLoginList = []
            this.$commonJs
                .getMethodData(this.$url.GetEnumUser, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        let adminList = res.data.data.manager
                        let operList = res.data.data.operator

                        if (this.adminType == 1) {
                            this.userLoginList = adminList
                        }
                        if (this.adminType == 2) {
                            this.userLoginList = operList
                        }
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        logoutUser(row) {
            this.loading = true
            this.currentAddIndex = row.index
            this.$confirm("是否确认登出" + this.TipsName + "?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let url
                    url = this.$url.LogoutUser
                    this.$commonJs
                        .getMethodData(url, "POST", {
                            // uiUserIndex - 用户索引
                            uiUserIndex: this.currentAddIndex,
                            // uiUserType *用户类型
                            type: this.uiUserType
                        })
                        .then((res) => {
                            this.loading = false
                            if (res.data.code == 100000) {
                                this.$alert(
                                    "登出" + this.TipsName + "成功",
                                    "提示",
                                    {
                                        confirmButtonText: "确定",
                                        type: "success",
                                        callback: (action) => {
                                            //window.location.reload()
                                            this.addAdminList()
                                        }
                                    }
                                )
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch((err) => {
                    this.loading = false
                })
        },
        deleteUser(row) {
            this.currentAddIndex = row.index
            this.$confirm("是否确认删除" + this.TipsName + "?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.loading = true
                    this.$commonJs
                        .getMethodData(this.$url.DelUser, "POST", {
                            // uiUserIndex - 用户索引
                            uiUserIndex: this.currentAddIndex,
                            // uiUserIndex: this.adminStatesRegisterNum + 1,
                            // uiUserType *用户类型
                            type: this.uiUserType
                        })
                        .then((res) => {
                            this.loading = false
                            if (res.data.code == 100000) {
                                this.$alert(
                                    "删除" + this.TipsName + "成功",
                                    "提示",
                                    {
                                        confirmButtonText: "确定",
                                        type: "success",
                                        callback: (action) => {
                                            //window.location.reload()
                                            this.addAdminList()
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
        pushPIN(row) {
            // this.$router.push({
            //     name: "modifyPINList",
            //     query: {
            //         isPIN: row.index,
            //         type: this.adminType
            //     }
            // })
            this.isPIN = row.index
            this.$commonJs.getInit()
            this.isSuccess = window.sessionStorage.getItem("isSuccess")
            if (this.isPIN == undefined) {
                this.getUserById()
                $(".CardClass").addClass("boxShadowNone")
            }
            this.resetSelf()
            this.modifyPINDialog = true
        },
        resetSelf() {
            this.pinContent = ""
            this.newPinContent = ""
            this.addNewPinContent = ""
        },
        uploadSelf() {
            if (this.pinContent == "") {
                this.$message.error("请输入原口令!")
                return
            }
            if (this.newPinContent == "") {
                this.$message.error("请输入新口令!")
                return
            }
            if (this.addNewPinContent == "") {
                this.$message.error("请输入确认新口令!")
                return
            }
            if (this.userCertList.length == 0 && this.isPIN == undefined) {
                this.$message.error("请先绑定证书!")
                return
            }
            if (this.newPinContent === this.addNewPinContent) {
                if (this.isPIN == undefined) {
                    this.doEnumApp()
                } else {
                    let data = {
                        pucNewPassword: this.newPinContent, // 新口令
                        pucOldPassword: this.pinContent, // 旧用户口令
                        uiUserIndex: this.isPIN, // 用户索引
                        type: this.uiUserType // 用户类型
                    }
                    this.$commonJs
                        .getMethodData(this.$url.SetUserPIN, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("修改口令成功!")
                                this.$router.push("/userLoginList")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            this.modifyPINDialog = false
                            //  else {
                            //     this.$router.push("/userLoginList");
                            // }
                        })
                }
            } else {
                this.$message.error("新口令和确认新口令不一致, 请重新输入!")
                return
            }
        },
        getUserById() {
            this.certSnList = []
            this.$commonJs
                .getMethodData(this.$url.GetUserDetail, "POST", {
                    id: this.userId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")

                        this.userCertList = res.data.data.sysUserCertList
                        this.userCertList.forEach((item) => {
                            this.certSnList.push({
                                label: item.cert_sn,
                                value: item.cert_sn
                            })
                            this.certSn = this.certSnList[0].value
                            if (this.certSn == item.cert_sn) {
                                this.subject = item.subject
                            }
                        })
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        certChange(data) {
            console.log(data, "data")
            this.userCertList.forEach((item) => {
                if (data == item.cert_sn) {
                    this.subject = item.subject
                }
            })
        },
        cancel() {
            // this.$router.push("/userLoginList")
            this.modifyPINDialog = false
        },
        doEnumApp() {
            let that = this
            JKunitrust.SOF_GetAppList(function (data) {
                if (data.ret != 0) {
                    // alert("枚举应用失败: " + data.msg);
                    that.$message.error("枚举应用失败: " + data.msg)
                    return
                }
                that.id_app_count = data.param.count
                that.id_app_select = data.param.applist
                that.doChangePIN()
            })
        },
        doChangePIN() {
            let that = this
            let appath = that.id_app_select
            if (appath == null || appath == "") {
                // alert("请先选择一个应用");
                that.$message.error("请先插入设备")
                return
            }
            let oldpin = that.pinContent
            let newpin = that.newPinContent
            JKunitrust.SOF_ChangePassWd(
                appath[0],
                oldpin,
                newpin,
                function (data) {
                    if (data.ret != 0) {
                        that.$message.error(data.msg)
                        // that.$router.push("/userLoginList");
                        return
                    }
                    that.$message.success("修改口令成功!")
                    that.pinContent = ""
                    that.newPinContent = ""
                    that.addNewPinContent = ""
                    that.modifyPINDialog = false
                    // that.$router.push("/userLoginList");
                }
            )
        }
    }
}
</script>
<style lang="less" scoped>
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    // background: #f4f5f7;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #e6a23c;
    font-weight: 500;
}
</style>