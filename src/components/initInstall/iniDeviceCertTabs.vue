<template>
    <div v-loading="loading">
        <el-row :gutter="20">
            <el-col :span="16" style="width:100%">
                <div style="margin-top:20px;margin-bottom:20px">
                    <el-button style="margin-left:10px;width:8%" type="primary" @click="addCert('1')" size="mini"
                        v-if="certType == '1'">生成根证书</el-button>
                    <el-button style="margin-left:10px;width:8%" type="primary" @click="addCert('2')" size="mini"
                        v-else>生成设备证书</el-button>
                </div>
                <el-table ref="multipleTable" style="margin-top:50px;height:400px" v-loading="loading"
                    :data="appcertData" tooltip-effect="dark" :header-cell-style="{
        'text-align': 'center',
        'color': '#333',
        'font-size': '14px',
    }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code"
                    :tree-props="{ children: 'children' }">

                    <el-table-column label="证书序列号" prop="serial_number" width="200"></el-table-column>
                    <el-table-column label="设备标识" prop="device_id"></el-table-column>
                    <el-table-column label="颁发者" prop="issuer" width="280"></el-table-column>
                    <el-table-column label="主题" prop="subject" width="280"></el-table-column>
                    <el-table-column label="算法" prop="key_algorithm" width="180"></el-table-column>
                    <el-table-column label="证书状态" prop="status" width="100">
                        <template slot-scope="scope">
                            <!-- 状态 20:启用【enabled】 10:停用【disable】 11:申请中 90:注销【revoked】 -->
                            <span style="" v-if="scope.row.status == '10'">停用</span>
                            <span style="" v-else-if="scope.row.status == '20'">启用</span>
                            <span style="" v-else-if="scope.row.status == '11'">申请中</span>
                            <span style="" v-else-if="scope.row.status == '90'">注销</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click.native.stop="xiaZai(scope.row)" type="text" size="mini"
                                class="el-icon-upload" style="color: #1890ff;margin-left:0px">下载证书</el-button>
                        </template>
                    </el-table-column>
                    <div slot="empty" style="display: inline-grid; margin-bottom: 0px;">
                        <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                        <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                    </div>
                </el-table>
            </el-col>
        </el-row>

        <el-dialog :title="dialogTitle" :visible.sync="deviceCertDialogVisible" width="50%">
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
                                <el-form-item label="国家/地区:" label-width="25%" prop="country">
                                    <!-- <el-input class="inputwid" v-model="formMake.country"
                                        placeholder="请选择国家/地区(Country)"></el-input> -->
                                    <el-select class="inputwid" v-model="formMake.country"
                                        placeholder="请选择国家/地区(Country)">
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
            <div slot="footer" class="dialog-footer dialogDiv">
                <el-button @click="infoorganization()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addDeviceCert('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { number } from "echarts"
import $ from "jquery"
export default {
    components: {},
    props: {
        keyTypeStr: {
            type: String
        },
        certType: {
            type: Number
        },
        Refresh: {
            type: String
        }
    },
    data() {
        return {
            flag: true,
            loading: false,
            deviceCertDialogVisible: false,
            dialogWidth: "30%",
            appcertData: [],
            cert_Type: "",
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
            dialogTitle: "",
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
            }
        }
    },
    created() {
        if (this.$commonJs.getScreenWidth() <= 1600) {
            this.dialogWidth = "42%"
        }
        this.getCertList()
    },
    methods: {
        // 查询列表
        getCertList() {
            // let data = form;
            this.loading = true
            if (this.certType == "1") {
                this.cert_Type = "root"
                this.dialogTitle = "添加根证书"
            } else {
                this.cert_Type = "signature"
                this.dialogTitle = "添加设备证书"
            }
            this.$commonJs
                .getMethodData(this.$url.HSMInitGetListByCertType, "POST", {
                    cert_type: this.cert_Type
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.appcertData = res.data.data
                        this.$emit("certAllNum", res.data.data.length)
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },

        addCert(type) {
            this.deviceCertDialogVisible = true
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
                if (this.certType == "1") {
                    url = this.$url.HSMInitSignIssueRoot
                } else {
                    url = this.$url.HSMInitSignIssueDevice
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
                            this.getCertList()
                        } else {
                            this.$message.error(res.data.msg)
                        }
                        this.$commonJs.getCloseLoading()
                    })
            })
        },
        xiaZai(row) {
            this.$commonJs.getLoading()
            this.$commonJs
                .downLoadMethodData(this.$url.HSMInitExportDeviceCert, "POST", {
                    id: row.id
                })
                .then((res) => {
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "device.cer"
                        link.style.display = "none"
                        const url =
                            window.URL || window.webkitURL || window.moxURL
                        link.href = window.URL.createObjectURL(blob)
                        link.download = _fileName //下载的文件名称
                        link.click()
                        window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                        this.isXiaZai = true
                    } catch (error) {
                        this.$message.error("下载失败!")
                    }
                    this.$commonJs.getCloseLoading()
                    // console.log(res, "res");
                })
        },
        resetFields() {
            this.deviceCertDialogVisible = false
            this.$refs.form.resetFields()
            this.form.end = "1"
        },
        infoorganization() {
            this.deviceCertDialogVisible = false
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-dialog {
    //height: 300px;
    margin-top: 23vh !important;
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

.dialogDiv {
    text-align: center;
}
</style>