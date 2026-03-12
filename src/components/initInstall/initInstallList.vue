<template>
    <div class="navItem" v-loading="loading">
        <el-card>
            <el-tabs stretch v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="初始化密码模块" name="initHtml" :disabled="tabDisabled">

                    <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                        该操作将会销毁所有密钥信息和权限信息，请谨慎处理。</div>
                    <div class="fontStyle" style="">
                        如果您已经确定销毁所有密钥和人员信息，请点击“初始化密码设备”按钮。
                    </div>
                    <div style="margin-top:60px">
                        <span class="titleLabel" style="width:75px">当前设备状态:</span>
                        <!-- <el-radio style="margin-left:10px" v-model="statusRadio" label="1">未初始化</el-radio> -->
                        <!-- <el-radio v-model="statusRadio" label="2">已就绪</el-radio> -->
                        <span style="margin-left:20px;" v-if="statusRadio == 1"><i class="el-icon-circle-close"
                                style="color:#F56C6C;font-size:20px;margin-right:10px"></i>未初始化</span>
                        <span style="margin-left:20px;" v-if="statusRadio == 2"><i class="el-icon-circle-check"
                                style="color:#67C23A;font-size:20px;margin-right:10px"></i>已就绪</span>
                    </div>
                    <div style="margin-top:120px;margin-bottom:50px">
                        <el-button type="primary" @click="initKey()"><i
                                class="el-icon-refresh iconRight"></i>初始化密码设备</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="设备密钥" name="makeKey" :disabled="tabDisabled">
                    <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                        该操作可以为已初始化的密码设备生成密钥信息</div>
                    <initKeyTabs :key="Refresh" @keyAllNum="keyAllNum" :isInit="false" v-if="keyComponent == true">
                    </initKeyTabs>
                    <div style="margin-bottom:10px;margin-top:10px">
                        <el-button v-if="isNext == '1'" type="primary" style="margin-top:5px" @click="makeKeyNextStep"><i
                                class="el-icon-d-arrow-right iconRight"></i>下一步</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="初始化管理员" name="initAdmin" :disabled="tabDisabled">

                    <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                        该操作可以为已初始化的密码设备添加管理人员。</div>

                    <div class="fontStyle" style="">
                        <span>请将管理员USBKey插入密码设备或管理终端USB插槽，USBKey指示灯亮起时请输入PIN口令，点击“添加管理员”按钮。</span><br>
                        <span>已添加{{ adminStatesRegisterNum }}个管理员。初始USBKey口令提示:{{ pinString }}，将对应的USBKey插入后输入口令</span>
                    </div>
                    <div style="margin-top:20px">
                        <el-button style="margin-left:10px;width:5%" type="primary" @click="userAdd('管理')"
                            size="mini">注<span style="margin-left:7px">册</span></el-button>
                        <el-button style="margin-left:10px;width:5%" type="primary" @click="userLogin('管理')"
                            size="mini">登<span style="margin-left:7px">录</span></el-button>
                    </div>
                    <initUser @loginAllNum="loginAllNum" v-if="addManagement == true" :key="Refresh" :adminType="1">
                    </initUser>
                    <div style="margin-bottom:50px">
                        <!-- <el-button type="primary" @click="activeName='initHtml'"><i class="el-icon-d-arrow-left iconRight"></i>上一步</el-button> -->
                        <el-button v-if="isNext == '2'" type="primary" style="margin-top:50px" @click="NextInitOperator"><i
                                class="el-icon-d-arrow-right iconRight"></i>下一步</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="初始化操作员" name="initOperator" :disabled="tabDisabled">

                    <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                        该操作可以为已初始化的密码设备添加操作人员。</div>

                    <div class="fontStyle" style="">
                        <span>请将操作员USBKey插入密码设备或理终端USB插槽，USBKey指示灯亮起时请输入PIN口令，点击“添加操作员"按钮。</span><br>
                        <span>请至少添加1个操作员。初始USBKey口令提示:{{ pinString }}，将对应的USBKey插入后输入口令</span>
                    </div>
                    <div style="margin-top:20px">
                        <el-button style="margin-left:10px;width:5%" type="primary" @click="userAdd('操作')"
                            size="mini">注<span style="margin-left:7px">册</span></el-button>
                        <el-button style="margin-left:10px;width:5%" type="primary" @click="userLogin('操作')"
                            size="mini">登<span style="margin-left:7px">录</span></el-button>
                    </div>
                    <initUser @loginAllNum="loginAllNum" v-if="addManagement1 == true" :key="Refresh" :adminType="2">
                    </initUser>
                </el-tab-pane>

            </el-tabs>
        </el-card>
        <el-dialog title="提示" :visible.sync="isOKdialog" width="420px" class="isOKdialogStyle">
            <i class="el-icon-warning " style="color:#E6A23C;font-size:23px"></i><span class="isOkStyle">是否初始化密码设备?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isOKdialog = false" size="medium">取消</el-button>
                <!-- <el-button type="success" @click="initFactory('否')" size="medium">否</el-button> -->
                <el-button type="primary" @click="initFactory('是')" size="medium">初始化</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加管理员" :visible.sync="addminPushDialog" width="30%">
            <div style="margin-top:20px;padding-left:20%">
                <span class="titleLabel" style="width:75px">PIN口令:</span>
                <el-input style="width:60%;margin-left:10px" v-model="pinAdminAdd" :type="flag1 ? 'password' : 'text'"
                    placeholder="请输入PIN口令" class="searchInputClass">
                    <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1" ></i> -->
                </el-input>
                <!-- <el-button style="margin-left:10px" type="primary" @click="addAdmin()" size="mini"><i class="el-icon-plus iconRight"></i>添加管理员</el-button> -->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addminPushDialog = false" size="mini">取消</el-button>
                <!-- <el-button type="success" @click="initFactory('否')" size="medium">否</el-button> -->
                <el-button type="primary" @click="addAdmin('管理')" size="mini">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="登录管理员" :visible.sync="addminLoginDialog" width="30%">
            <div style="margin-top:20px;padding-left:20%">
                <span class="titleLabel" style="width:75px">PIN口令:</span>
                <el-input style="width:60%;margin-left:10px" v-model="pinAdminLogin" :type="flag1 ? 'password' : 'text'"
                    placeholder="请输入PIN口令" class="searchInputClass">
                    <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1" ></i> -->
                </el-input>
                <!-- <el-button style="margin-left:10px" type="primary" @click="addAdmin()" size="mini"><i class="el-icon-plus iconRight"></i>添加管理员</el-button> -->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addminLoginDialog = false" size="mini">取消</el-button>
                <!-- <el-button type="success" @click="initFactory('否')" size="medium">否</el-button> -->
                <el-button type="primary" @click="loginUser('管理')" size="mini">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加操作员" :visible.sync="operPushDialog" width="30%">
            <div style="margin-top:20px;padding-left:20%">
                <span class="titleLabel" style="width:75px">PIN口令:</span>
                <el-input style="width:60%;margin-left:10px" v-model="pinOperAdd" :type="flag1 ? 'password' : 'text'"
                    placeholder="请输入PIN口令" class="searchInputClass">
                    <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1" ></i> -->
                </el-input>
                <!-- <el-button style="margin-left:10px" type="primary" @click="addAdmin()" size="mini"><i class="el-icon-plus iconRight"></i>添加管理员</el-button> -->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="operPushDialog = false" size="mini">取消</el-button>
                <!-- <el-button type="success" @click="initFactory('否')" size="medium">否</el-button> -->
                <el-button type="primary" @click="addAdmin('操作')" size="mini">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="登录操作员" :visible.sync="operLoginDialog" width="30%">
            <div style="margin-top:20px;padding-left:20%">
                <span class="titleLabel" style="width:75px">PIN口令:</span>
                <el-input style="width:60%;margin-left:10px" v-model="pinOperLogin" :type="flag1 ? 'password' : 'text'"
                    placeholder="请输入PIN口令" class="searchInputClass">
                    <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1" ></i> -->
                </el-input>
                <!-- <el-button style="margin-left:10px" type="primary" @click="addAdmin()" size="mini"><i class="el-icon-plus iconRight"></i>添加管理员</el-button> -->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="operLoginDialog = false" size="mini">取消</el-button>
                <!-- <el-button type="success" @click="initFactory('否')" size="medium">否</el-button> -->
                <el-button type="primary" @click="loginUser('操作')" size="mini">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { Loading } from "element-ui"
import initUser from "./initUserList.vue"
import initKeyTabs from "../initInstall/initDeviceKeyTabs.vue"
import $ from "jquery"
export default {
    inject: ["reload"],
    components: {
        initUser,
        initKeyTabs
    },
    data() {
        return {
            tabDisabled: false,
            currentAddIndex: 0,
            uKeyIndex: "1",
            addManagementType: 0,
            keyComponent: false,
            addManagement: false,
            addManagement1: false,
            adminStatesLoginNum: 0,
            adminStatesRegisterNum: 0,
            operStatesregisterNum: 0,
            isOKdialog: false,
            isNext: "",
            adminNum: "1",
            adminNum1: "0",
            adminRegisterNum: 0,
            activeName: "",
            isDisabled: false,
            addminPushDialog: false,
            addminLoginDialog: false,
            operPushDialog: false,
            operLoginDialog: false,
            Refresh: "",
            statusRadio: "",
            userLoginList: [],
            indexVal: "1",
            indexVal1: "1",
            radio: "1",
            keyType: "",
            copyTime: "2022.03.27 12:23",
            pinContent2: "",
            pinContent3: "",
            pinContent6: "",
            pinAdminAdd: "",
            pinAdminLogin: "",
            pinOperAdd: "",
            pinOperLogin: "",
            dieVal: "",
            isLogin: true,
            flag1: true,
            flag2: true,
            flag3: true,
            enumUserData: {},
            loading: false,
            isXiaZai: true,
            regNum: "",
            pinString: "",
            tempAdminList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            tempOperList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adminList: [],
            operList: []
        }
    },
    created() {
        this.getInitStatus()
        this.getEnumUser()
        this.getResourceDetail()
        // this.$commonJs.deviceConfGet().then((res) => {
        //     this.countList = res.data.data
        //     console.log(this.countList, "this.countList")
        // })
    },
    mounted() { },
    methods: {
        // 获取详情
        getResourceDetail() {
            this.loading = true
            let url = this.$url.ResourceGetByCode
            this.$commonJs
                .getMethodData(url, "POST", {
                    page: "initInstallList",
                    code: "5"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.pinString = res.data.data.content
                    }
                    this.loading = false
                })
        },
        addAdminFocus() {
            this.Refresh = ""
        },
        handleClick(tab, event) {
            console.log(tab, event)
            console.log(tab.label, "ppp")
            if (tab.label == "设备密钥") {
                this.keyComponent = true
                this.addManagement = false
                this.addManagement1 = false
            } else if (tab.label == "初始化管理员") {
                this.addManagementType = "1"
                this.addManagement = true
                this.addManagement1 = false
                this.keyComponent = false
            } else if (tab.label == "初始化操作员") {
                this.addManagement1 = true
                this.addManagement = false
                this.keyComponent = false
                this.addManagementType = "2"
            }
        },
        // 枚举用户
        getEnumUser() {
            this.$commonJs.getLoading()
            //this.loading = true
            this.adminStatesRegisterNum = 0
            this.adminStatesLoginNum = 0
            this.$commonJs
                .getMethodData(this.$url.GetEnumUser, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.enumUserData = res.data.data
                        this.adminList = res.data.data.manager
                        this.operList = res.data.data.operator
                        this.adminStatesRegisterNum = Number(
                            res.data.data.managerRegister
                        )
                        this.adminStatesLoginNum = Number(
                            res.data.data.managerLogin
                        )
                        this.operStatesregisterNum = Number(
                            res.data.data.operatorRegister
                        )
                    } else if (res.data.code != 800000) {
                        //this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
                })
        },
        // 获取状态
        getInitStatus() {
            this.$commonJs.getInitStatus().then((res) => {
                //4:未初始化
                if (res.data.data.fsm_state < 4) {
                    this.statusRadio = 1
                } else {
                    this.statusRadio = 2
                }
                this.activeName = "initHtml"
            })
        },
        userAdd(type) {
            this.getEnumUser()
            if (type == "管理") {
                this.pinAdminAdd = ""
                this.addminPushDialog = true
            } else {
                this.pinOperAdd = ""
                this.operPushDialog = true
            }
        },
        userLogin(type) {
            if (type == "管理") {
                this.pinAdminLogin = ""
                this.addminLoginDialog = true
            } else {
                this.pinOperLogin = ""
                this.operLoginDialog = true
            }
        },
        keyAllNum(val) {
            if (val > 0) {
                this.isNext = "1"
            }
        },
        loginAllNum(val) {
            this.regNum = val
            if (this.addManagementType == "1") {
                this.adminStatesRegisterNum = val
                if (val >= this.adminNum) {
                    this.isNext = "2"
                }
            }
        },
        async initFactory(type) {
            this.isOKdialog = false
            this.$commonJs.getLoading()
            // this.loading = true;
            if (type == "是") {
                this.$message.info("初始化过程大概需要3-5分钟")
                await this.$commonJs
                    .getMethodData(this.$url.DeviceFactoryReset, "POST", {})
                    // .getTimeOut()
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.getEnumUser()
                            this.$alert("设备初始化成功", "提示", {
                                confirmButtonText: "确定",
                                type: "success"
                            }).then(() => {
                                this.activeName = "makeKey"
                                this.addManagement = false
                                this.addManagement1 = false
                                this.keyComponent = true
                                this.Refresh = new Date().getTime()
                            })
                            // this.loading = false;
                            this.$commonJs.getCloseLoading()
                        } else {
                            this.$message.error(res.data.msg)
                            // this.loading = false;
                            this.$commonJs.getCloseLoading()
                        }
                    })
            }
        },
        makeKeyNextStep() {
            this.activeName = "initAdmin"
            this.addManagement = true
            this.addManagementType = "1"
            this.addManagement1 = false
            this.keyComponent = false
        },
        NextInitOperator() {
            this.activeName = "initOperator"
            this.addManagement1 = true
            this.addManagementType = "2"
            this.addManagement = false
            this.keyComponent = false
        },
        initKey() {
            this.isOKdialog = true
        },
        // 添加管理员
        addAdmin(type) {
            let currentType = ""
            let pucPasswordStr = ""
            let TipsName = ""
            if (type == "管理") {
                currentType = "manager"
                TipsName = "管理员"
                if (this.adminStatesRegisterNum == 10) {
                    this.$message.error("最多注册10个管理员")
                    return false
                }
                pucPasswordStr = this.pinAdminAdd
                this.pinAdminLogin = this.pinAdminAdd
                // this.currentAddIndex = this.adminStatesRegisterNum + 1

                for (let i = 0; i < this.adminList.length; i++) {
                    let index = this.adminList[i].index
                    this.tempAdminList[index] = 1
                }
                for (let i = 1; i <= this.tempAdminList.length - 1; i++) {
                    if (this.tempAdminList[i] == 0) {
                        this.currentAddIndex = i
                        break
                    }
                }
            } else {
                currentType = "operator"
                TipsName = "操作员"
                if (this.operStatesregisterNum == 10) {
                    this.$message.error("最多注册10个操作员")
                    return false
                }
                pucPasswordStr = this.pinOperAdd
                this.pinOperLogin = this.pinOperAdd
                // this.currentAddIndex = this.operStatesregisterNum + 1

                for (let i = 0; i < this.operList.length; i++) {
                    let index = this.operList[i].index
                    this.tempOperList[index] = 1
                }
                for (let i = 1; i <= this.tempOperList.length - 1; i++) {
                    if (this.tempOperList[i] == 0) {
                        this.currentAddIndex = i
                        break
                    }
                }
            }
            this.addminPushDialog = false
            this.operPushDialog = false
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.AddUser, "POST", {
                    // pucPasswordStr - 用户口令, 固定 16 字节
                    pucPassword: pucPasswordStr,
                    // uiUserIndex - 用户索引
                    // uiUserIndex: this.adminStatesRegisterNum + 1,
                    uiUserIndex: this.currentAddIndex,
                    // uiUserType *用户类型
                    // uiUserType: "1"
                    type: currentType
                })
                .then((res) => {
                    // this.$commonJs.getLoading();
                    if (res.data.code == 100000) {
                        this.loginUser(type)
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.currentAddIndex--
                    }
                })
        },
        //登录管理员/操作员
        loginUser(type) {
            let currentType = ""
            let pucPasswordStr = ""
            let TipsName = ""
            if (type == "管理") {
                currentType = "manager"
                TipsName = "管理员"
                pucPasswordStr = this.pinAdminLogin
            } else {
                currentType = "operator"
                TipsName = "操作员"
                pucPasswordStr = this.pinOperLogin
            }
            this.loading = true
            this.addminLoginDialog = false
            this.operLoginDialog = false
            this.$commonJs
                .getMethodData(this.$url.LoginUser, "POST", {
                    // pucPasswordStr - 用户口令, 固定 16 字节
                    pucPassword: pucPasswordStr,
                    // uiUserType *用户类型
                    type: currentType
                })
                .then((res) => {
                    this.loading = false
                    if (res.data.code == 100000) {
                        this.$alert("登录" + TipsName + "成功", "提示", {
                            confirmButtonText: "确定",
                            type: "success",
                            callback: (action) => {
                                //this.reload()
                                this.Refresh = new Date().getTime()
                            }
                        })
                        this.getEnumUser()
                        this.pinAdminAdd = ""
                        this.pinAdminLogin = ""
                        this.pinOperAdd = ""
                        this.pinOperLogin = ""
                        // window.location.reload()
                        this.$commonJs.getCloseLoading()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.$commonJs.getCloseLoading()
                    }
                })
        }
    }
}
</script>
<style lang="less" scoped>
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    background: #f4f5f7;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #67c23a;
    font-weight: 500;
}

.fontStyle {
    margin-top: 10px;
    font-size: 14px;
    width: 100%;
    line-height: 30px;
    // height: 32px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5f5;
    margin-bottom: 10px;
}

.isOkStyle {
    // font-size: 25px;
    line-height: 11px;
    vertical-align: text-top;
    margin-left: 10px;
}

/deep/ .isOKdialogStyle .el-dialog {
    height: 135px;
    margin-top: 43vh !important;
    padding: 0 !important;
    border-radius: 5px !important;

    .el-dialog__body {
        padding: 0px 16px !important;
        padding-top: 5px !important;
    }

    .el-dialog__header {
        padding: 13px 15px 10px !important;
    }
}

/deep/ .colorStyle .el-input__inner {
    color: #d0cdcd;
}
</style>