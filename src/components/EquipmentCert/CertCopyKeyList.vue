<template>
    <div class="navItem" v-loading="loading">
        <el-card class="CardClass">
            <div class="boxStyle" style=" margin-top:10px;height:auto">
                <span>(1)请准备好所有管理员USBkey，用来保存备份分量</span><br>
                <span>(2)请登录所有管理员,以满足备份所需权限</span><br>
                <span>(3)将密钥等重要信息加密后备份到文件中，请妥善保管管理员Usbkey和备份文件</span>
            </div>
            <keyLogo @keyNum="keyNum"></keyLogo>
            <div class="fontStyle" style="margin-bottom:20px">
                <!-- 请根据提示将{{adminStatesRegisterNum}}个管理员USBKey依次插入密码设备或管理终端USB插槽中。 -->
            </div>
            <span style="margin-left:2.5%;font-size:16px;font-weight:600">上次备份时间:<span style="margin-left:10px"> {{copyTime}}</span></span><br>
            <div class="fontStyle" style="padding-bottom:0px;border:0" v-if="isLogin== true && isNext == 1">
                <el-button style="" type="primary" @click="addCopyKey()" size="mini" icon="el-icon-upload" plain>开始备份</el-button>
            </div>
            <div style="margin-top:10px;padding-left: 30px;margin-bottom:20px">
                <div v-if="isLogin== false" class="fontStyle" style="border:0">
                    {{meetPermissions}}
                    <el-button style="margin-left:10px;font-size:20px" type="text" @click="getCopyLogin()" icon="el-icon-right" size="mini">去登录</el-button>

                    <!-- <span class="titleLabel" style="width:75px">UKey索引:</span>
                    <el-input style="width:40%;margin-left:10px" v-model="uKeyIndex" type="text" placeholder="请输入UKey索引" class="searchInputClass">
                    </el-input>
                    <br> -->
                    <!-- <span class="titleLabel" style="width:75px">登录UKey:</span>
                    <el-input style="width:40%;margin-left:10px" v-model="pinContent1" :type="flag1 ? 'password' : 'text'" placeholder="请输入PIN口令" class="searchInputClass"> -->
                    <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1"></i> -->
                    <!-- </el-input>
                    <el-button style="margin-left:10px" type="primary" @click="getLogin()" icon="el-icon-check" size="mini" plain>登录</el-button> -->
                </div>
                <div v-if=" isNext== 2">
                    <span class="titleLabel" style="width:75px;margin-left:10px">{{adminNum}}号管理员:</span>
                    <el-input style="width:20%;margin-left:10px" v-model="pinContent" :type="flag1 ? 'password' : 'text'" placeholder="请输入PIN口令" class="searchInputClass">
                    </el-input>
                    <el-button style="margin-left:10px" type="primary" @click="getLogin()" icon="el-icon-check" size="mini">登录</el-button>
                </div>
                <div v-if=" isNext== 3">
                    <el-button style="margin-left:10px" type="primary" @click="copyUpdate()" icon="el-icon-download" plain size="mini">下载备份文件</el-button>
                </div>
            </div>
            <!-- <div style="margin-top:30px;padding-left: 53px;margin-bottom:30px">
                <span class="titleLabel" style="width:75px">自动备份周期:</span>
                <el-input style="width:40.4%;margin-left:10px" v-model="copyCycle" placeholder="请输入自动备份周期" class="searchInputClass"></el-input>
            </div> -->
        </el-card>
    </div>
</template>
<script>
import keyLogo from "../Keys/keyLogo.vue";
// import $ from "jquery";
export default {
    inject: ["reload"],
    components: {
        keyLogo
    },
    props: {
        initNum: {
            type: Number
        }
    },
    data() {
        return {
            adminStatesLoginNum: 0,
            adminStatesRegisterNum: 0,
            uKeyIndex: "1",
            isLogin: true,
            pinContent1: "",
            pinContent: "",
            copyCycle: "",
            flag1: true,
            isDisabled: true,
            meetPermissions: "",
            loading: false,
            addminKeyNum: 0,
            isNext: 1,
            adminNum: 1,
            copyTime: "N/A"
        };
    },
    created() {
        // this.getEnumUser();
        this.getTime();
    },
    mounted() {
        if (this.initNum == 1) {
            this.$(".CardClass").addClass("boxShadowNone");
        }
    },
    methods: {
        getTime() {
            this.$commonJs
                .getMethodData(this.$url.HsmGetLastBackupTime, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.copyTime = res.data.data || "N/A";
                    } else if (res.data.code != 800000) {
                        // this.copyTime = " ";
                        // this.$message.error(res.data.msg);
                    }
                });
        },
        getLogin() {
            if (this.pinContent == "") {
                this.$message.error("请输入PIN口令");
                return false;
            }
            this.$commonJs
                .getMethodData(this.$url.SetShare, "POST", {
                    // pucPasswordStr - 用户口令, 固定 16 字节
                    pwd: this.pinContent,
                    // uiUserIndex - 用户索引
                    indexNum: this.adminNum
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data);

                        this.adminNum = res.data.data + 1;
                        this.$message.success(res.data.msg);
                        this.pinContent = "";
                        if (res.data.data == 3) {
                            this.isNext = 3;
                        }
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    } else {
                    }
                });
        },
        getCopyLogin() {
            this.$router.push({
                name: "userLoginList",
                query: {
                    type: 1
                }
            });
        },
        getEnumUser() {
            this.loading = true;
            this.adminStatesLoginNum = 0;
            this.$commonJs
                .getMethodData(this.$url.GetEnumUser, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        let num = 0;
                        this.enumUserData = res.data.data;
                        // for (var i in this.enumUserData) {
                        //     num++;
                        //     console.log(i);
                        //     if (num <= 3) {
                        //         let adminStatesRegister =
                        //             this.enumUserData[
                        //                 "adminStates" + num + "register"
                        //             ];
                        //         let adminStatesLogin =
                        //             this.enumUserData[
                        //                 "adminStates" + num + "login"
                        //             ];

                        //         this.adminStatesLoginNum +=
                        //             Number(adminStatesLogin);

                        //         this.adminStatesRegisterNum +=
                        //             Number(adminStatesRegister);
                        //     }
                        // }
                        this.adminStatesRegisterNum = Number(
                            res.data.data.allAdminStatesregister
                        );
                        this.adminStatesLoginNum = Number(
                            res.data.data.allAdminStateslogin
                        );
                        // if (
                        //     this.adminStatesRegisterNum !=
                        //     this.adminStatesLoginNum
                        // ) {
                        //     this.meetPermissions =
                        //         "未满足备份密钥权限，请先登录！";
                        //     // this.isLogin = false;
                        // } else {
                        //     // this.isLogin = true;
                        // }
                        console.log(
                            this.adminStatesLoginNum,
                            this.adminStatesRegisterNum,
                            "meetPermissions"
                        );
                        // this.loading = false;
                    }
                    // this.$commonJs.getCloseLoading();
                });
        },
        keyNum(data) {
            console.log(data, "keyNum");
            this.addminKeyNum = data;
            // this.getStatus();
        },
        async getStatus() {
            let that = this;
            await this.$commonJs
                .getMethodData(this.$url.HsmGetUserinfo, "POST", {
                    num: -1
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        that.isLogin = res.data.data;
                        this.loading = false;
                    } else if (res.data.code != 800000) {
                        if (res.data.data == false) {
                            that.meetPermissions =
                                "未满足恢复密钥权限，请先登录";
                            console.log(
                                that.meetPermissions,
                                "this.meetPermissions"
                            );
                            this.loading = false;
                        }
                        that.$message.error(res.data.msg);
                    }
                });
        },
        addCopyKey() {
            // if (this.adminStatesLoginNum == this.adminStatesRegisterNum) {
            // if (this.pinContent == "") {
            //     this.$message.error("请输入PIN口令");
            //     return false;
            // }
            this.loading = true;

            this.$commonJs
                .getMethodData(this.$url.BackKey, "POST", {
                    // pinStr *备份密钥口令
                    // pinStr: this.pinContent
                    num: 3
                })
                .then((res) => {
                    this.loading = false;

                    if (res.data.code == 100000) {
                        this.isDisabled = false;
                        this.getTime();

                        this.$alert("产生备份文件成功.", "提示", {
                            confirmButtonText: "确定",
                            type: "success"
                        }).then(() => {
                            // this.copyUpdate();
                            this.isNext = 2;
                        });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {});
            // } else {
            //     this.$message.error("无权限!");
            //     return false;
            // }
        },
        copyUpdate() {
            this.$commonJs
                .downLoadMethodData(this.$url.FilesExport, "GET", {})
                .then((res) => {
                    console.log(res, "res");
                    const link = document.createElement("a");
                    try {
                        let blob = res.data; //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "FILE";
                        link.style.display = "none";
                        const url =
                            window.URL || window.webkitURL || window.moxURL;
                        link.href = window.URL.createObjectURL(blob);
                        link.download = _fileName; //下载的文件名称
                        link.click();
                        window.URL.revokeObjectURL(url); // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                        this.isXiaZai = true;
                        this.reload();
                    } catch (e) {
                        this.$message.error("下载失败!");
                    }
                });
        }
    }
};
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
.fontStyle {
    padding-left: 42px;
    font-size: 20px;
    font-weight: 600;
    margin-top: 10px;
    // font-size: 14px;
    width: 100%;
    line-height: 30px;
    // height: 32px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5f5;
    margin-bottom: 10px;
}
</style>
