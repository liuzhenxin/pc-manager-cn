<template>
    <div class="navItem">
        <el-card v-if="userLoginType == 1">
            <el-tooltip :content="roleToolTips" placement="top-end" effect="light">
                <div style="width:50px;float:right">
                    <el-button style="margin:10px;float:right;font-size:14px" :disabled="isMeetRole" type="primary" @click="getCopy(1)" size="mini" icon="el-icon-right">备份密钥</el-button>
                </div>
            </el-tooltip>
        </el-card>
        <el-card v-if="userLoginType == 2">
            <el-tooltip :content="roleToolTips1" placement="top-end" effect="light">
                <div style="width:50px;float:right">
                    <el-button style="margin:10px;float:right;font-size:14px" :disabled="isMeetRole1" type="primary" @click="getCopy(2)" size="mini" icon="el-icon-right">恢复密钥</el-button>
                </div>
            </el-tooltip>
        </el-card>
        <el-card>
            <div class="boxStyle" style=" margin-top:10px;height:auto">
                <span>本页可以将已添加的人员进行登录操作，从而具备对应权限,</span><br>
                <span>请将已添加的USBKey插入到密码设备USB插槽，然后输入PIN口令(长度为8位)，点击“登录”按钮。</span>
            </div>
            <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:30px" v-model="activeName">
                <el-tab-pane label="管理员" name="1">
                    <el-row :gutter="20">
                        <el-col :span="16" style="width:100%">
                            <div style="margin-top:0px;margin-bottom:0px">
                                <el-button style="margin-left:10px;width:5%" type="primary" @click="userAdd('管理')" size="mini">注<span style="margin-left:7px">册</span></el-button>
                                <el-button style="margin-left:10px;width:5%" type="primary" @click="userLogin('管理')" size="mini">登<span style="margin-left:7px">录</span></el-button>
                            </div>
                            <userTable :key="Refresh" :adminType="1"></userTable>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="操作员" name="2">
                    <el-row :gutter="20">
                        <el-col :span="16" style="width:100%">
                            <div style="margin-top:0px;margin-bottom:0px">
                                <el-button style="margin-left:10px;width:5%" type="primary" @click="userAdd('操作')" size="mini">注<span style="margin-left:7px">册</span></el-button>
                                <el-button style="margin-left:10px;width:5%" type="primary" @click="userLogin('操作')" size="mini">登<span style="margin-left:7px">录</span></el-button>
                            </div>
                            <userTable :key="Refresh" :adminType="2"></userTable>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="添加管理员" :visible.sync="addminPushDialog" width="30%">
            <div style="margin-top:20px;padding-left:20%">
                <span class="titleLabel" style="width:75px">PIN口令:</span>
                <el-input style="width:60%;margin-left:10px" v-model="pinAdminAdd" :type="flag1 ? 'password' : 'text'" placeholder="请输入PIN口令" class="searchInputClass">
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
                <el-input style="width:60%;margin-left:10px" v-model="pinAdminLogin" :type="flag1 ? 'password' : 'text'" placeholder="请输入PIN口令" class="searchInputClass">
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
                <el-input style="width:60%;margin-left:10px" v-model="pinOperAdd" :type="flag1 ? 'password' : 'text'" placeholder="请输入PIN口令" class="searchInputClass">
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
                <el-input style="width:60%;margin-left:10px" v-model="pinOperLogin" :type="flag1 ? 'password' : 'text'" placeholder="请输入PIN口令" class="searchInputClass">
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
import userTable from "./userLoginTable.vue"
export default {
    inject: ["reload"],
    components: {
        userTable
    },
    data() {
        return {
            roleToolTips: "",
            isMeetRole: true,
            roleToolTips1: "未满足恢复密钥权限，请先登录",
            isMeetRole1: true,
            isDisabled: false,
            uKeyIndex: "1",
            uiUserType: "1",
            adminStatesRegisterNum: 0,
            operStatesregisterNum: 0,
            adminStatesLoginNum: 0,
            pinContent: "",
            flag1: true,
            enumUserData: {},
            userLoginType: this.$route.query.type,
            Refresh: "",
            addminPushDialog: false,
            addminLoginDialog: false,
            operPushDialog: false,
            operLoginDialog: false,
            pinAdminAdd: "",
            pinAdminLogin: "",
            pinOperAdd: "",
            pinOperLogin: "",
            currentAddIndex: 0,
            activeName: "1", //1 管理员 2 操作员
            tempAdminList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            tempOperList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adminList: [],
            operList: []
        }
    },
    created() {
        //this.getList()
    },
    methods: {
        getList() {
            this.$commonJs.getLoading()
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
                        if (
                            this.adminStatesRegisterNum !=
                            this.adminStatesLoginNum
                        ) {
                            this.roleToolTips = "未满足备份密钥权限，请先登录！"
                        } else {
                            this.isMeetRole = false
                            this.roleToolTips = "已满足备份密钥权限"
                        }
                        this.$commonJs.getCloseLoading()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.$commonJs.getCloseLoading()
                    }
                })
        },
        userAdd(type) {
            this.getList()
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
        }, // 添加管理员/操作员
        addAdmin(type) {
            this.addminPushDialog = false
            this.operPushDialog = false
            let pucPasswordStr = ""
            let TipsName = ""
            let currentType = ""
            this.tempAdminList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.tempOperList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
                    if (res.data.code == 100000) {
                        this.loginUser(type)
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        //登录管理员/操作员
        loginUser(type) {
            this.addminLoginDialog = false
            this.operLoginDialog = false
            this.$commonJs.getLoading()
            let currentType = ""
            let pucPasswordStr = ""
            let TipsName = ""
            if (type == "管理") {
                currentType = "manager"
                // TipsName = "管理员"
                pucPasswordStr = this.pinAdminLogin
            } else {
                currentType = "operator"
                // TipsName = "操作员"
                pucPasswordStr = this.pinOperLogin
            }
            this.$commonJs
                .getMethodData(this.$url.LoginUser, "POST", {
                    // pucPasswordStr - 用户口令, 固定 16 字节
                    pucPassword: pucPasswordStr,
                    // uiUserType *用户类型
                    type: currentType
                })
                .then((res) => {
                    this.$commonJs.getCloseLoading()
                    if (res.data.code == 100000) {
                        this.$alert("登录" + TipsName + "成功", "提示", {
                            confirmButtonText: "确定",
                            type: "success",
                            callback: (action) => {
                                // window.location.reload()
                                this.Refresh = new Date().getTime()
                            }
                        })
                        this.pinAdminAdd = ""
                        this.pinAdminLogin = ""
                        this.pinOperAdd = ""
                        this.pinOperLogin = ""
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        handleClick(tab, event) {
            if (tab.label == "管理员") {
                this.activeName = "1"
            }
            if (tab.label == "操作员") {
                this.activeName = "2"
            }
        },
        getCopy(type) {
            if (type == 1) {
                this.$router.push("/copyKeyList")
            }
            if (type == 2) {
                this.$router.push("/recoveryKeyList")
            }
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