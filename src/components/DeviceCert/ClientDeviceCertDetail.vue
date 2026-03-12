<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/clientCertList' }">
                <el-button size="mini" class="el-button1" type="warning"
                    style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <div class="intanle">
            <el-tabs type="border-card" style="padding-bottom:0px;" class="CardClass">
                <el-form ref="formMake" :model="formMake" :rules="rules" label-position="right" label-width="21%"
                    style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <div style="display: flex;flex-direction: column;width: 50%;margin: auto;">
                            <borderTitle title="证书信息" style="display:inline-block">
                                <el-col :span="12" :offset="6">
                                    <el-form-item label="序列号:" label-width="42%" prop="serial_number">
                                            {{formMake.serial_number}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" :offset="6">
                                    <el-form-item label="设备标识:" label-width="42%" prop="device_id">
                                            {{formMake.device_id}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" :offset="6">
                                    <el-form-item label="密钥类型:" label-width="42%" prop="key_algorithm">
                                            {{formMake.key_algorithm}}
                                    </el-form-item>
                                </el-col>
                            </borderTitle>
                            <borderTitle title="证书信息" style="display:inline-block">
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
                            </borderTitle>
                        </div>
                    </el-row>
                </el-form>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    components: {
        borderTitle
    },
    props: {
        isInit: {
            type: Boolean
        }
    },
    data() {
        return {
            activeName: "add",
            keyRadio: "",
            isEncryption: false,
            keyList: [],
            name: "",
            certId: this.$route.query.id,
            type: this.$route.query.type,
            radio: "",
            loading: false,
            keyIndexList: [],
            formMake: {
                device_id: "",
                serial_number: "",
                country: "", // 国家/地区
                location: "", // 城市
                org: "", // 组织
                org_unit: "", // 使用者名称
                state: "", // 省份
                subject: ""
            },
            caCertList: [],
            ischeckList: [],
            isDisable: true
        }
    },

    created() {
        this.getCertDetail()
    },
    methods: {
        // 获取详情
        getCertDetail() {
            this.$commonJs.getLoading()
            this.$commonJs
                .getMethodData(this.$url.ClientDevCertGetDetail, "POST", {
                    id: this.certId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")

                        // org 组织
                        this.formMake = res.data.data
                        if (res.data.data.length != 0) {
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
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
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
        cancel() {
            this.$router.push("/clientCertList")
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}

/deep/ .el-tree-node__content {
    height: 50px !important;
}

/deep/.el-table__row .cell {
    line-height: 40px;
}

/deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
}

.keyStyle {
    height: 490px;
    overflow: hidden;
    overflow-y: auto;

    .el-dialog__footer {
        padding: 0px 20px 25px !important;
    }
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 6px;
    height: 10px;
    background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #ccc;
}

@media screen and (min-width: 1400px) {
    .offsetApp {
        margin-left: 15px;
    }
}

@media screen and (max-width: 1400px) {
    .offsetApp {
        margin-left: 8px;
    }
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
