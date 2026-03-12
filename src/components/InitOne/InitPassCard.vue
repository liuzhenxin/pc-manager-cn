<template>
    <div class="navItem typeBgStyle" v-loading="loading">
        <div class="initBox">
            <el-card style="padding:20px">
                <el-tabs stretch v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="初始化密码模块" name="initHtml" :disabled="tabDisabled[0]">
                        <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                            该操作将会销毁所有密钥信息和权限信息，请谨慎处理。</div>
                        <div class="fontStyle" style="">
                            如果您已经确定销毁所有密钥和人员信息，请点击“初始化密码设备”按钮。
                        </div>
                        <div style="margin-top:60px">
                            <span class="titleLabel" style="width:75px">当前设备状态:</span>
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
                    <el-tab-pane label="设备密钥" name="makeKey" :disabled="tabDisabled[1]">
                        <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                            该操作可以为已初始化的密码设备生成密钥信息</div>
                        <initKeyTabs :key="Refresh" @keyAllNum="keyAllNum" :isInit="true" v-if="keyComponent == true">
                        </initKeyTabs>
                        <div style="margin-bottom:10px;margin-top:10px">
                            <el-button v-if="isNext == '1'" type="primary" style="margin-top:5px" @click="makeKeyNextStep"><i
                                    class="el-icon-d-arrow-right iconRight"></i>下一步</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="根证书" name="rootCert" :disabled="tabDisabled[2]">
                        <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                            该操作可以为已初始化的密码设备生成根证书</div>
                        <initDeviceCert :certType="1" @certAllNum="certAllNum" :key="Refresh"
                            v-if="rootCertComponent == true"></initDeviceCert>
                        <div style="margin-bottom:10px;margin-top:10px">
                            <el-button v-if="isNext == '2'" type="primary" style="margin-top:5px" @click="rootCertNextStep"><i
                                    class="el-icon-d-arrow-right iconRight"></i>下一步</el-button>
                            <el-button v-if="isNext == '2'" type="primary" style="margin-top:5px" @click="skipNextStep"><i
                                    class="el-icon-d-arrow-right iconRight"></i>跳过</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="设备证书" name="deviceCert" :disabled="tabDisabled[3]">
                        <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                            该操作可以为已初始化的密码设备生成设备证书</div>
                        <initDeviceCert :certType="2" @certAllNum="certAllNum" :key="Refresh"
                            v-if="deviceCertComponent == true"></initDeviceCert>
                        <div style="margin-bottom:10px;margin-top:10px">
                            <el-button v-if="isNext == '3'" type="primary" style="margin-top:5px"
                                @click="deviceCertNextStep"><i class="el-icon-d-arrow-right iconRight"></i>下一步</el-button>
                            <el-button v-if="isNext == '3'" type="primary" style="margin-top:5px" @click="skipNextStep"><i
                                    class="el-icon-d-arrow-right iconRight"></i>跳过</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="初始化管理员" name="initAdmin" :disabled="tabDisabled[4]">
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
                        <initUser :isInit='true' @loginAllNum="loginAllNum" @registeAllNum="registeAllNum"
                            v-if="adminComponent == true" :key="Refresh" :adminType="1"></initUser>
                        <div style="margin-bottom:10px;margin-top:10px">
                            <el-button v-if="isNext == '4'" type="primary" style="margin-top:5px" @click="adminNextStep"><i
                                    class="el-icon-d-arrow-right iconRight"></i>下一步</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="初始化操作员" name="initOperator" :disabled="tabDisabled[5]">
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
                        <initUser :isInit='true' @loginAllNum="loginAllNum" v-if="operComponent == true" :key="Refresh"
                            :adminType="2"></initUser>
                        <div style="margin-bottom:10px;margin-top:10px">
                            <!-- <el-button type="primary" v-if="isNext == '5'" style="margin-top:5px" @click="operNextStep"><i
                                    class="el-icon-d-arrow-right iconRight"></i>下一步</el-button> -->
                            <el-button type="primary" v-if="isNext == '5'" style="margin-top:5px" @click="submit"><i
                                    class="el-icon-d-arrow-right iconRight"></i>完成</el-button>
                        </div>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="同步密钥" name="initSyncKey" :disabled="tabDisabled[6]">
                        <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;">
                            该操作可以为已初始化的密码设备同步密钥</div>
                        <initSyncKeyTabs></initSyncKeyTabs>
                        <div style="margin-bottom:10px;margin-top:10px">
                            <el-button type="primary" style="margin-top:5px" @click="submit"><i
                                    class="el-icon-d-arrow-right iconRight"></i>完成</el-button>
                        </div>
                    </el-tab-pane> -->


                </el-tabs>
            </el-card>

            <el-dialog title="提示" :visible.sync="isOKdialog" width="420px" class="isOKdialogStyle">
                <i class="el-icon-warning " style="color:#E6A23C;font-size:23px"></i><span
                    class="isOkStyle">是否初始化密码设备?</span>
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
    </div>
</template>
<script>
import igConfig from "../ip/ipConfig.vue"
import { Loading } from "element-ui"
import initKeyTabs from "../initInstall/initDeviceKeyTabs.vue"
import initDeviceCert from "../initInstall/iniDeviceCertTabs.vue"
import initUser from "../initInstall/initUserList.vue"
import initSyncKeyTabs from "../initInstall/initSyncKeyTabs.vue"
import copyKey from "../Keys/copyKeyList.vue"
import $ from "jquery"
export default {
    inject: ["reload"],
    components: {
        igConfig,
        initUser,
        initKeyTabs,
        initDeviceCert,
        initSyncKeyTabs,
        copyKey
    },
    data() {
        return {
            tabDisabled: [true, true, true, true, true, true, true],
            currentAddIndex: 1,
            adminStatesRegisterNum: 0,
            operStatesregisterNum: 0,
            isOKdialog: false,
            isNext: "",
            adminNum: "1",
            operNum: "0",
            activeName: "initHtml",
            isDisabled: false,
            Refresh: "",
            statusRadio: "",
            userLoginList: [],
            radio: "1",
            pinAdminAdd: "",
            pinAdminLogin: "",
            pinOperAdd: "",
            pinOperLogin: "",
            addminPushDialog: false,
            addminLoginDialog: false,
            operPushDialog: false,
            operLoginDialog: false,
            flag1: true,
            flag2: true,
            flag3: true,
            loading: false,
            keyComponent: false,
            rootCertComponent: false,
            deviceCertComponent: false,
            adminComponent: false,
            operComponent: false,
            initStatus: 0,
            currentClickStatus: 0,
            pinString: "",
            tempAdminList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            tempOperList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adminList: [],
            operList: []
        }
    },
    watch: {},
    created() {
        this.getInitStatus()
        this.getResourceDetail()
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
        getInit() {
            this.$commonJs
                .getMethodData(this.$url.HSMInitServerInit, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "oooooo")
                        this.initStatus = res.data.data
                        this.currentClickStatus = this.initStatus
                        // 0:未初始化 1:密码卡初始化完成 2:设备密钥初始化完成 3:根证书初始化完成 4:设备证书初始化完成 5:密码卡管理员初始化完成 6:密码卡操作员初始化完成 99:初始化完成
                        if (this.initStatus == 0) {
                            this.activeName = "initHtml"
                        }

                        if (this.initStatus == 1) {
                            this.activeName = "makeKey"
                            this.keyComponent = true
                            this.initTabValue(2)
                            this.isNext = "1"
                        }
                        if (this.initStatus == 2) {
                            this.activeName = "rootCert"
                            this.rootCertComponent = true
                            this.initTabValue(3)
                            this.isNext = "2"
                        }
                        if (this.initStatus == 3) {
                            this.activeName = "deviceCert"
                            this.deviceCertComponent = true
                            this.initTabValue(4)
                            this.isNext = "3"
                        }
                        if (this.initStatus == 4) {
                            this.activeName = "initAdmin"
                            this.adminComponent = true
                            this.initTabValue(5)
                            this.isNext = "4"
                        }
                        if (this.initStatus == 5) {
                            this.activeName = "initOperator"
                            this.operComponent = true
                            this.initTabValue(6)
                            this.isNext = "5"
                        }
                        if (this.initStatus == 6) {
                            this.activeName = "initSyncKey"
                            this.initTabValue(7)
                        }
                        if (this.initStatus != 0) {
                            this.getEnumUser()
                        }
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        initTabValue(num) {
            for (let i = 0; i < num; i++) {
                this.tabDisabled[i] = false
            }
        },
        addAdminFocus() {
            this.Refresh = ""
        },
        handleClick(tab, event) {
            this.currentClickStatus = tab.index
            if (tab.label == "设备密钥") {
                this.keyComponent = true
            } else if (tab.label == "根证书") {
                this.rootCertComponent = true
            } else if (tab.label == "设备证书") {
                this.deviceCertComponent = true
            } else if (tab.label == "初始化管理员") {
                this.adminComponent = true
            } else if (tab.label == "初始化操作员") {
                this.operComponent = true
            }
        },
        getEnumUser() {
            // this.$commonJs.getLoading();
            this.loading = true
            this.adminStatesRegisterNum = 0
            this.operStatesregisterNum = 0
            this.$commonJs
                .getMethodData(this.$url.HSMInitEnumUser, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.adminList = res.data.data.manager
                        this.operList = res.data.data.operator
                        this.adminStatesRegisterNum = Number(
                            res.data.data.managerRegister
                        )
                        this.operStatesregisterNum = Number(
                            res.data.data.operatorRegister
                        )
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }

                    this.loading = false
                })
        },
        getInitStatus() {
            this.$commonJs
                .getMethodData(this.$url.HSMInitGetDeviceStatus, "POST", {})
                .then((res) => {
                    //4:未初始化
                    if (res.data.data.fsm_state < 4) {
                        this.statusRadio = 1
                    } else {
                        this.statusRadio = 2
                    }
                    this.getInit()
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
        submit() {
            this.$commonJs
                .getMethodData(this.$url.HSMInitFinish, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.reload()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        keyAllNum(val) {
            if (this.currentClickStatus == this.initStatus) {
                if (this.initStatus == 1) {
                    if (val > 0) {
                        this.isNext = "1"
                    } else {
                        this.isNext = ""
                    }
                }
            }
        },
        certAllNum(val) {
            // if (this.currentClickStatus == this.initStatus) {
            //     if (this.initStatus == 2) {
            //         if (val > 0) {
            //             this.isNext = "2"
            //         } else {
            //             this.isNext = ""
            //         }
            //     }
            //     if (this.initStatus == 3) {
            //         if (val > 0) {
            //             this.isNext = "3"
            //         } else {
            //             this.isNext = ""
            //         }
            //     }
            // }
        },
        loginAllNum(val) {
            if (this.currentClickStatus == this.initStatus) {
                if (this.initStatus == 4) {
                    if (val >= this.adminNum) {
                        this.isNext = "4"
                    } else {
                        this.isNext = ""
                        if (this.adminStatesRegisterNum == 0) {
                            this.$message.success("请注册管理员")
                        } else {
                            this.$message.success("请登录管理员")
                        }
                    }
                }
                if (this.initStatus == 5) {
                    if (val >= this.operNum) {
                        this.isNext = "5"
                    } else {
                        this.isNext = ""
                    }
                }
            }
        },
        registeAllNum(val) {
            this.getEnumUser()
        },
        async initFactory(type) {
            this.isOKdialog = false
            // this.$commonJs.getLoading();
            this.loading = true
            if (type == "是") {
                this.$message.info("初始化过程大概需要3-5分钟")
                await this.$commonJs
                    .getMethodData(
                        this.$url.HSMInitDeviceFactoryReset,
                        "POST",
                        {}
                    )
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.$alert("设备初始化成功", "提示", {
                                confirmButtonText: "确定",
                                type: "success"
                            }).then(() => {
                                this.reload()
                                this.activeName = "makeKey"
                                this.keyComponent = true
                                this.initTabValue(2)
                                this.initStatus = 1
                                this.currentClickStatus = 1
                                this.isNext = "1"
                            })
                            this.loading = false
                        } else {
                            this.$message.error(res.data.msg)
                            this.loading = false
                        }
                    })
            } else {
            }
        },
        makeKeyNextStep() {
            this.activeName = "rootCert"
            this.isNext = "2"
            this.initStatus = 2
            this.currentClickStatus = 2
            this.rootCertComponent = true
            this.tabDisabled[2] = false
            this.$commonJs
                .getMethodData(
                    this.$url.HSMInitGenerateDevKeyFinish,
                    "POST",
                    {}
                )
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "oooooo")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        rootCertNextStep() {
            this.activeName = "deviceCert"
            this.isNext = "3"
            this.initStatus = 3
            this.currentClickStatus = 3
            this.deviceCertComponent = true
            this.tabDisabled[3] = false
            this.$commonJs
                .getMethodData(this.$url.HSMInitSignIssueRootFinish, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "oooooo")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        deviceCertNextStep() {
            this.activeName = "initAdmin"
            this.initStatus = 4
            this.currentClickStatus = 4
            this.isNext = "4"
            this.adminComponent = true
            this.tabDisabled[4] = false
            this.$commonJs
                .getMethodData(
                    this.$url.HSMInitSignIssueDeviceFinish,
                    "POST",
                    {}
                )
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "oooooo")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        skipNextStep() {
            this.tabDisabled[3] = false
            this.deviceCertNextStep()
        },
        adminNextStep() {
            this.activeName = "initOperator"
            this.initStatus = 5
            this.currentClickStatus = 5
            this.isNext = "5"
            this.operComponent = true
            this.tabDisabled[5] = false

            this.$commonJs
                .getMethodData(this.$url.HSMInitManagerFinish, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "oooooo")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        operNextStep() {
            this.activeName = "initSyncKey"
            this.initStatus = 6
            this.currentClickStatus = 6
            this.tabDisabled[6] = false
            this.$commonJs
                .getMethodData(this.$url.HSMInitOperatorFinish, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "oooooo")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        getMessage(msg) {
            this.isOKdialog = false
            this.$message.error(msg)
            this.loading = false
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
                .getMethodData(this.$url.HSMInitAddUser, "POST", {
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
                    if (res.data.code == 100000) {
                        this.loginUser(type)
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                        this.currentAddIndex--
                    }
                })
        },
        //登录管理员/操作员
        loginUser(type) {
            this.loading = true
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
                .getMethodData(this.$url.HSMInitLoginUser, "POST", {
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
.typeBgStyle {
    background: #f2f6fc;
    background: url("../../../public/img/typeBg.png") no-repeat;
    height: 100%;
    width: 100%;
    // padding-top: 5%;
}

.initBox {
    width: 80%;
    padding-top: 5%;
    margin-left: 10%;
}

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
}</style>