<template>
    <div class="navItem">
        <el-card class="CardClass">
            <div class="boxStyle" style=" margin-top:10px;height:auto">
                <span>本页可以修改USBKey的口令，请将需要修改的USBkey插入密码设备的USB插槽中。</span>
            </div>
            <div style="margin-top:30px;margin-left:200px">
                <!-- <el-form-item label="证书序列号:" label-width="21%" prop="cert_sn">
                    <el-input class="inputwid" v-model="form.sysUserCertList[0].cert_sn" placeholder="请输入证书序列号" :disabled="isDisable"></el-input>
                </el-form-item>
                <el-form-item label="证书主题:" label-width="21%" prop="card_no">
                    <el-input class="inputwid" v-model="form.sysUserCertList[0].subject" placeholder="请输入证书主题" :disabled="isDisable"></el-input>
                </el-form-item> -->
                <div v-if="isPIN == undefined">
                    <span class="titleLabel" style="width:75px;margin-left:-32px;">证书序列号:</span>
                    <!-- <el-input style="width:45%;margin-left:10px" v-model="certSn" :type="flag1 ? 'password' : 'text'" placeholder="请输入原口令">
                </el-input> -->
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
                    <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1"></i> -->
                </el-input>
                <br>
                <span class="titleLabel" style="width:75px;margin-top:30px;">新口令:</span>
                <el-input style="width:45%;margin-left:10px" v-model="newPinContent" prefix-icon="el-icon-lock" :type="flag2 ? 'password' : 'text'" placeholder="请输入新口令(新密码由大写字母，小写字母，数字，特殊字符中的三种组成的长度为8的字符串)">
                    <!-- <i slot="suffix" :class="[flag2 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag2 = !flag2"></i> -->
                </el-input>
                <!-- <el-input style="width:40%;margin-left:10px" v-model="newPinContent" placeholder="请输入新口令(新密码由大写字母，小写字母，数字，特殊字符中的三种组成的长度为8的字符串)" class="searchInputClass"></el-input> -->
                <br>
                <span class="titleLabel" style="width:75px;margin-left:-32px;margin-top:30px;">确认新口令:</span>
                <el-input style="width:45%;margin-left:10px" v-model="addNewPinContent" prefix-icon="el-icon-lock" :type="flag3 ? 'password' : 'text'" placeholder="请确认新口令">
                    <!-- <i slot="suffix" :class="[flag3 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag3 = !flag3"></i> -->
                </el-input>
                <!-- <el-input style="width:40%;margin-left:10px" v-model="addNewPinContent" placeholder="请确认新口令" class="searchInputClass"></el-input> -->
                <br>
                <div style="margin-left:60px;margin-top:20px;margin-bottom:30px;">
                    <el-button style="" type="primary" @click="resetSelf()" size="mini"><i class="el-icon-refresh-right iconRight"></i>重置</el-button>
                    <el-button style="margin-left:10px;margin-top:30px;" type="primary" @click="uploadSelf()" size="mini"><i class="el-icon-document-checked iconRight"></i>提交修改</el-button>
                    <el-button v-if="isPIN != undefined" style="margin-left:10px;margin-top:30px;" type="primary" @click="cancel()" size="mini"><i class="el-icon-right"></i>返回</el-button>
                </div>

            </div>

        </el-card>
    </div>
</template>
<script>
import { JKunitrust } from "../../assets/js/JKunitrust.js"
import $ from "jquery"
export default {
    data() {
        return {
            isPIN: this.$route.query.isPIN,
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
            currentType: this.$route.query.type
        }
    },
    created() {
        this.$commonJs.getInit()
        this.isSuccess = window.sessionStorage.getItem("isSuccess")
        console.log(this.userId, "userId")
        // if (this.isSuccess == "true") {
        //     this.doEnumApp();
        // }
        if (this.isPIN == undefined) {
            this.getUserById()
        }
    },
    mounted() {
        if (this.isPIN == undefined) {
            $(".CardClass").addClass("boxShadowNone")
        }
    },
    methods: {
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
                    let uiUserType = ""
                    if (this.currentType == "1") {
                        uiUserType = "manager"
                    } else if (this.currentType == "2") {
                        uiUserType = "operator"
                    } else {
                        uiUserType = "user"
                    }

                    let data = {
                        pucNewPassword: this.newPinContent, // 新口令
                        pucOldPassword: this.pinContent, // 旧用户口令
                        uiUserIndex: this.isPIN, // 用户索引
                        type: uiUserType // 用户类型
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
            console.log(this.aaa, "aaa")
            this.$router.push("/userLoginList")
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
                console.log(
                    data.param.count,
                    data.param.applist,
                    "data.param.applist"
                )
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