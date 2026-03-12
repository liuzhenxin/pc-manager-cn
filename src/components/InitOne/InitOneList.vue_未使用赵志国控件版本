<template>
    <div class="typeBgStyle">
        <div class="initBox">
            <el-card style="background:#f3f3f3;">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="初始化组织机构" name="first" :disabled="tabDisabled">
                        <ZuZhiJiGou :ZuZhimode='1' :IsInitZuZhi="1" class="ZuZhiStyle" @getZuZhiData='getZuZhiData' style="margin-bottom:20px;"></ZuZhiJiGou>
                    </el-tab-pane>
                    <el-tab-pane label="根证书" name="four" :disabled="tabDisabled" v-if="initStatus.ca == true">
                        <CARootCer ref="CARootCer1" :aio_step="aio_step" @AddUser1="AddUser1" v-show="aio_step=='2'"></CARootCer>
                    </el-tab-pane>
                    <el-tab-pane label="导入证书" name="four1" :key="num" :disabled="tabDisabled" v-if="initStatus.ca == true && aio_step == '3'">
                        <CARootCer ref="CARootCer1" :aio_step="aio_step" @AddUser1="AddUser1" v-show="aio_step == '3'"></CARootCer>
                    </el-tab-pane>
                    <el-tab-pane label="CA设备证书" name="five" :disabled="tabDisabled" v-if="initStatus.ca == true">
                        <CARootCer ref="CARootCer1" :aio_step="aio_step" @AddUser2="AddUser2" v-if="initStatus.ca == true && aio_step == '4'"></CARootCer>
                    </el-tab-pane>
                    <el-tab-pane label="用户" name="second" :disabled="tabDisabled">
                        <initOne :YongHumode='1' :isAddOrg="isAddOrg" @userListNum="userListNum"></initOne>
                    </el-tab-pane>
                    <el-tab-pane label="权限" name="third" :disabled="tabDisabled">
                        <initOne :YongHumode='2' @AddUser="AddUser" :key="Refresh" v-show="Insert!=true"></initOne>
                    </el-tab-pane>

                </el-tabs>
                <div class="initSuccess">
                    <div v-if="Insert==true&& activeName == 'third'" :style="initInforMation" style="overflow: hidden;overflow-y: auto">
                        <el-card>
                            <div style="margin-bottom:30px">
                                <el-row>
                                    <el-col :sm="12" :lg="22">
                                        <el-result icon="success" title="初始化完成">
                                        </el-result>
                                    </el-col>
                                    <el-col :span="12" :offset="7">
                                        <div v-for="(item,index) in roleList" :key="index">
                                            <el-descriptions class="margin-top" :column="2" :size="size" style="">
                                                <el-descriptions-item label="机构名" style="width:120px">{{item.org.name}}</el-descriptions-item>
                                                <el-descriptions-item label="权限" style="width:120px">{{item.role.name}}</el-descriptions-item>
                                                <el-descriptions-item label="姓名" style="width:120px">{{item.users[0].fullname}}</el-descriptions-item>
                                                <el-descriptions-item label="账号" style="width:120px">{{item.users[0].username}}</el-descriptions-item>
                                            </el-descriptions>
                                            <el-divider></el-divider>
                                        </div>
                                    </el-col>
                                    <el-col :span="12" :offset="10">
                                        <el-button size="mini" style="margin-left:0%; width:120px;margin-top:5%" type="primary" @click="goLogin()" :style="MraginTop">完成</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-card>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import ZuZhiJiGou from "../organization/organizationDetail.vue"
import machineList from "../machine/machineList.vue"
import initOne from "../InitOne/initList.vue"
import CARootCer from "./InitRoot.vue"
export default {
    inject: ["reload"],
    components: {
        machineList,
        initOne,
        ZuZhiJiGou,
        CARootCer
    },
    data() {
        return {
            num: 0,
            size: "",
            MraginTop: "",
            aio_step: "",

            initInforMation: { height: "570px" },
            Insert: false,
            tabDisabled: true,
            IsHaveZuZhi: true,
            activeName: "first",
            zuZhiList: [],
            statusRadio: "1",
            initStatus: {
                ca: false,
                kms: false,
                svs: false,
                hsm: false,
                ra: false
            },
            isAddOrg: false,
            organization_id: 0,
            roleList: [],
            Refresh: ""
        }
    },
    created() {
        this.getAioServiceExist()
        this.getInitStatus()
    },
    mounted() {
        this.getShow()
    },
    methods: {
        // 获取存在哪些系统
        getAioServiceExist() {
            this.$commonJs
                .getMethodData(this.$url.AioServiceExist, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.sysList = res.data.data
                        window.sessionStorage.setItem(
                            "sysList",
                            JSON.stringify(res.data.data)
                        )
                        this.initStatus = JSON.parse(
                            window.sessionStorage.getItem("sysList")
                        )
                    } else if (res.data.code != 800000) {
                        this.$commonJs.getCloseLoading()
                        this.$message.error(res.data.msg)
                    } else {
                        this.$commonJs.getCloseLoading()
                    }
                })
        },
        getZuZhiData(data) {
            this.zuZhiList = data
            let dataObj = this.$commonJs.getScreenValue(this.zuZhiList)
            this.$commonJs
                .getMethodFormData(this.$url.AddOrg, "POST", dataObj)
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (this.initStatus.ca == true) {
                            this.activeName = "four"
                            this.$commonJs
                                .getMethodData(this.$url.SetAioSteps, "POST", {
                                    step: "2"
                                })
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.getInitStatus()
                                        this.getOrgList()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                    }
                                })
                        } else {
                            this.activeName = "second"
                            this.isAddOrg = true
                        }
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        getOrgList() {
            this.$commonJs
                .getMethodFormData(this.$url.GetOrg, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "res,data.data")
                        window.sessionStorage.setItem("orgId", res.data.data.id)
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                })
        },
        goLogin() {
            this.$commonJs
                .getMethodData(this.$url.InitFinish, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.getInitStatus()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        getInitStatus() {
            console.log(this.initStatus, "this.initStatus")
            this.$commonJs
                .getMethodData(this.$url.GetAioStep, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.aio_step = res.data.data
                        sessionStorage.setItem("aio_step", this.aio_step)
                        if (this.aio_step == "90") {
                            this.activeName = "third"
                            this.Insert = true
                            this.organization_id =
                                window.sessionStorage.getItem("orgId")
                            this.getAllByOrgId()
                        }

                        this.getShow()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
                })
        },
        getShow() {
            setTimeout(() => {
                if (this.aio_step == "2" && this.initStatus.ca == true) {
                    this.getOrgList()
                    this.activeName = "four"
                    if (this.$refs.CARootCer1 != undefined) {
                        console.log(
                            this.$refs.CARootCer1,
                            "this.$refs.CARootCer2"
                        )
                        this.$refs.CARootCer1.$refs.ADD.style = "display:block"
                    }
                } else if (this.aio_step == "80") {
                    this.activeName = "second"
                } else if (this.aio_step == "90") {
                    this.activeName = "third"
                    this.Insert = true
                } else if (this.aio_step == "1") {
                    this.activeName = "first"
                } else if (this.aio_step == "4" && this.initStatus.ca == true) {
                    this.activeName = "five"
                    if (this.$refs.CARootCer1 != undefined) {
                        console.log(
                            this.$refs.CARootCer1,
                            "this.$refs.CARootCer2"
                        )
                        // this.$refs.CARootCer1.$refs.deviceCA.style =
                        //     "display:block";
                    }
                } else if (this.aio_step == "3" && this.initStatus.ca == true) {
                    this.activeName = "four1"
                    if (this.$refs.CARootCer1 != undefined) {
                        console.log(
                            this.$refs.CARootCer1,
                            "this.$refs.CARootCer2"
                        )
                        this.$refs.CARootCer1.$refs.Import.style =
                            "display:block"
                    }
                }
            }, 200)
        },
        AddUser(val) {
            this.getInitStatus()
            if (this.initStatus.ca == true) {
                this.activeName = "four"
            }
        },
        AddUser1(val) {
            this.getInitStatus()
            this.activeName = "four1"
            this.num++
            console.log("AddUser1", "num", this.activeName)
        },
        AddUser2(val) {
            this.getInitStatus()
            this.activeName = "second"
            this.isAddOrg = true
        },
        getAllByOrgId() {
            this.$commonJs
                .getMethodData(this.$url.InitGetAllByOrgId, "POST", {
                    organization_id: this.organization_id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.roleList = res.data.data
                        console.log(this.roleList, " this.roleList")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
                })
        },
        userListNum(data) {
            console.log(data, "assssss")
            let num = 2
            if (
                this.initStatus.svs_auth == true ||
                this.initStatus.hsm_auth == true
            ) {
                num = 3
            }
            if (data < num) {
                this.$message.error("请至少添加" + num + "个用户!")
                return false
            } else {
                this.activeName = "third"
                this.Refresh = new Date().getTime()
            }
            this.$commonJs
                .getMethodData(this.$url.PopUser, "POST", {
                    organization_id: this.organization_id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                    } else if (res.data.code != 800000) {
                        return false
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
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
    width: 70%;
    padding-top: 4%;
    margin-left: 15%;
}
/deep/ .ZuZhiStyle {
    .el-card__body {
        padding-top: 60px !important;
    }
}
.initSuccess {
    height: 100%;
    width: 100%;
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
</style>
