<template>
    <div>
        <el-form ref="formMake" :model="formMake" label-position="right" label-width="21%" style="margin-bottom:20px"
            v-if="formMake != null">
            <el-row :gutter="20">
                <div style="display: flex;flex-direction: column;width: 50%;margin: auto;">
                    <borderTitle title="证书信息" style="display:inline-block">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书序列号:" label-width="42%" prop="serial_number">
                                    {{formMake.serial_number}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="设备标识:" label-width="42%" prop="device_id">
                                    {{formMake.device_id}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书类型:" label-width="42%" prop="cert_type">
                                    {{formMake.cert_type}}
                            </el-form-item>
                        </el-col>
                    </borderTitle>
                    <borderTitle title="证书主题" style="display:inline-block">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="通用名:" label-width="42%" prop="common_name">
                                    {{formMake.common_name}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="使用者名称:" label-width="42%" prop="org_unit">
                                    {{formMake.org_unit}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="组织:" label-width="42%" prop="org">
                                    {{formMake.org}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="城市:" label-width="42%" prop="location">
                                    {{formMake.location}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="省份:" label-width="42%" prop="state">
                                    {{formMake.state}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="国家/地区:" label-width="42%" prop="country">
                                    {{formMake.country}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" :offset="9">
                            <el-button size="mini" type="primary" @click="downDeviceCert()">下载证书</el-button>
                        </el-col>
                    </borderTitle>
                </div>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    components: {
        borderTitle
    },
    props: {
        cerType: {
            type: Number
        },
        Refresh: {
            type: String
        }
    },
    data() {
        return {
            loading: false,
            formMake: {
                id: "",
                device_id: "",
                serial_number: "",
                cert_type: "",
                common_name: "",
                country: "", // 国家/地区
                location: "", // 城市
                org: "", // 组织
                org_unit: "", // 使用者名称
                state: "", // 省份
                subject: ""
            },
            isDisable: true,
            deviceCertType: ""
        }
    },
    created() {
        if (this.cerType == "1") {
            this.deviceCertType = "root"
        } else if (this.cerType == "2") {
            this.deviceCertType = "signature"
        } else {
            this.deviceCertType = "encrypt"
        }
        this.getDeviceCert()
    },
    methods: {
        getDeviceCert() {
            this.loading = true
            let that = this
            this.$commonJs
                .getMethodData(this.$url.GetDeviceCertByType, "POST", {
                    cert_type: that.deviceCertType
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.formMake = res.data.data
                        if (this.cerType == "1") {
                            this.$emit("formMakeTemp1", res.data.data)
                        } else {
                            this.$emit("formMakeTemp2", res.data.data)
                        }
                        if (res.data.data != null) {
                            this.getUndefined(
                                res.data.attrs.subject.cn,
                                "common_name"
                            )

                            this.getUndefined(res.data.attrs.subject.o, "org")
                            this.getUndefined(
                                res.data.attrs.subject.l,
                                "location"
                            )
                            this.getUndefined(
                                res.data.attrs.subject.c,
                                "country"
                            )
                            // org_unit 使用者名称
                            this.getUndefined(
                                res.data.attrs.subject.ou,
                                "org_unit"
                            )
                            this.getUndefined(
                                res.data.attrs.subject.st,
                                "state"
                            )
                        }
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        getUndefined(data, type) {
            if (data != undefined) {
                if (data != "null") {
                    this.formMake[type] = data
                }
            } else {
                this.formMake[type] = ""
            }
        },
        downDeviceCert() {
            this.$commonJs.getLoading()
            this.$commonJs
                .downLoadMethodData(this.$url.ExportCertDevice, "POST", {
                    id: this.formMake.id
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

.el-form {
    .el-form-item {
        /deep/ .el-form-item__label {
            font-weight: 600;
            font-size: 15px;
        }
    }
}
</style>