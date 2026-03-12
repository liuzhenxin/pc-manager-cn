<template>
    <div class="navItem">
        <el-card class="search">
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" v-if="activeName == 1" @click="jumpToInsert(1)" type="primary"
                        icon="el-icon-plus">添加根证书</el-button>
                    <el-button size="mini" v-else @click="jumpToInsert(2)" type="primary"
                        icon="el-icon-plus">添加设备证书</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:30px" v-model="activeName">
                <el-tab-pane label="根证书" name="1">
                    <el-row :gutter="20">
                        <el-col :span="16" style="width:100%">
                            <div class="divBorderStyle" style="margin-top:0px;margin-bottom:0px">
                                <deviceCert :key="Refresh" :cerType="1" @formMakeTemp1="formMakeTemp1"></deviceCert>
                            </div>
                            <div v-show="formMakeRes1 == null" style=" margin-bottom: 50px;text-align: center">
                                <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="设备证书" name="2">
                    <el-row :gutter="20">
                        <el-col :span="16" style="width:100%">
                            <div style="margin-top:0px;margin-bottom:0px">
                                <div class="divBorderStyle" style="width:100%;float:left">
                                    <deviceCert :key="Refresh" :cerType="2" @formMakeTemp2="formMakeTemp2"></deviceCert>
                                </div>
                                <!-- <div class="divBorderStyle" style="width:49.2%;float:right">
                                    <deviceCert :key="Refresh" :cerType="3" @formMakeTemp2="formMakeTemp2"></deviceCert>
                                </div> -->
                            </div>
                            <div style="margin-bottom: 50px;text-align: center" v-show="formMakeRes2 == null">
                                <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="添加证书" :visible.sync="deviceCertDialogVisible" width="50%">
            <el-row style="margin-top:-30px">
                <el-col>
                    <el-form ref="form" :model="formMake" :rules="rules" label-position="right" label-width="21%"
                        style="margin-bottom:20px">
                        <el-row :gutter="20">
                            <el-col :span="12" :offset="6">
                                <el-form-item label="设备标识:" label-width="25%" prop="device_id">
                                    <el-input class="inputwid" v-model="formMake.device_id"
                                        placeholder="请输入设备id"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="通用名:" label-width="25%" prop="common_name">
                                    <el-input class="inputwid" v-model="formMake.common_name"
                                        placeholder="请输入组织/公司全称(Common Name)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="使用者名称:" label-width="25%" prop="org_unit">
                                    <el-input class="inputwid" v-model="formMake.org_unit"
                                        placeholder="请输入使用者名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="组织:" label-width="25%" prop="org">
                                    <el-input class="inputwid" v-model="formMake.org"
                                        placeholder="请输入所在单位名称(org)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="城市:" label-width="25%" prop="location">
                                    <el-input class="inputwid" v-model="formMake.location"
                                        placeholder="请输入所在城市名称(Location)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="省份:" label-width="25%" prop="state">
                                    <el-input class="inputwid" v-model="formMake.state"
                                        placeholder="请输入所在省份名称(State)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="国家/地区:" label-width="25%">
                                    <!-- <el-input class="inputwid" v-model="formMake.country"
                                        placeholder="请选择国家/地区(Country)"></el-input> -->
                                    <el-select class="inputwid" v-model="formMake.country" placeholder="请选择国家/地区(Country)">
                                        <el-option v-for="item in $commonJs.getCnData()" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="infoorganization()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addDeviceCert('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue"
import deviceCert from "./DeviceCert.vue"
export default {
    inject: ["reload"],
    components: { addOrg, deviceCert },
    data() {
        return {
            MyHeader: { Authorization: "" },
            loading: false,
            formMake: {
                device_id: "",
                common_name: "",
                country: "", // 国家/地区
                location: "", // 城市
                org: "", // 组织
                org_unit: "", // 使用者名称
                state: "", // 省份
                subject: ""
            },
            rules: {
                device_id: [
                    {
                        required: true,
                        message: "请输入设备唯一标识",
                        trigger: "blur"
                    }, {
                        min: 32,
                        max: 32,
                        message: "长度必须为32字符",
                        trigger: "blur"
                    }
                ],
                common_name: [
                    {
                        required: true,
                        message: "请输入通用名",
                        trigger: "blur"
                    }
                ],
                org_unit: [
                    {
                        required: true,
                        message: "请输入使用者",
                        trigger: "blur"
                    }
                ],
                org: [
                    {
                        required: true,
                        message: "请输入组织名称",
                        trigger: "blur"
                    }
                ]
            },
            formMakeRes1: {},
            formMakeRes2: {},
            activeName: "1", //1 根证书 2 设备证书
            deviceCertDialogVisible: false,
            Refresh: ""
        }
    },
    created() {
        // if (this.$commonJs.getStorage().organization_id != 1) {
        //     this.form.organization_id =
        //         this.$commonJs.getStorage().organization_id
        // }
        this.MyHeader.Authorization =
            window.sessionStorage.getItem("Authorization")
    },

    methods: {
        handleClick(tab, event) {
            if (tab.label == "根证书") {
                this.activeName = "1"
            }
            if (tab.label == "设备证书") {
                this.activeName = "2"
            }
        },
        formMakeTemp1(val) {
            this.formMakeRes1 = val
        },
        formMakeTemp2(val) {
            this.formMakeRes2 = val
        },
        // 新增
        jumpToInsert() {
            this.deviceCertDialogVisible = true
            if(this.$refs.form){
                this.$refs.form.resetFields()
            }
            //this.$refs["formMake"].resetFields()
        },
        infoorganization() {
            this.deviceCertDialogVisible = false
        },
        addDeviceCert(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.$commonJs.getLoading()
                let subject = [
                    "CN=" + this.formMake.common_name,
                    "C=" + this.formMake.country,
                    "L=" + this.formMake.location,
                    "O=" + this.formMake.org,
                    "OU=" + this.formMake.org_unit,
                    "ST=" + this.formMake.state
                ]
                let url
                if (this.activeName == "1") {
                    url = this.$url.SignIssueDeviceRoot
                } else {
                    url = this.$url.SignIssueDevice
                }
                this.$commonJs
                    .getMethodData(url, "POST", {
                        device_id: this.formMake.device_id,
                        subjectDir: subject.join(",")
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.deviceCertDialogVisible = false
                            this.$message.success("签发成功")
                            this.Refresh = new Date().getTime()
                        } else {
                            this.$message.error(res.data.msg)
                        }
                        this.$commonJs.getCloseLoading()
                    })
            })

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

.el-button--mini {
    padding: 5px 5px;
}

.divBorderStyle {
    border: 0.5px solid lightgray;
}

.inputwid {
    width: 80%;
}

.dialog-footer {
    text-align: center;
}
</style>
