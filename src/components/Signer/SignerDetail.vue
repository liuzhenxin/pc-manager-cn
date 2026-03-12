<template>
    <div v-loading="loading">
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/SignerList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">

                <el-row :gutter="20">

                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="系统类型:" label-width="21%" prop="system_type">
                            <el-select v-model="form.system_type" placeholder="请选择系统类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="20" :offset="3" v-if="$commonJs.getStorage().isAdmin == true">
                        <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                            <addOrg style="margin-left:20px;width:1680px" :isDisable="isDisable" @organization_id="organization_id" :organizationId="organizationId" :detail="1"></addOrg>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="名称:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="用途:" label-width="21%" prop="purpose">
                            <el-radio-group v-model="form.purpose">
                                <el-radio label="cert" :disabled="isDisable">证书</el-radio>
                                <el-radio class="radioStyle" label="crl" :disabled="isDisable">吊销</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="类型:" label-width="21%" prop="type">
                            <el-radio-group v-model="form.type">
                                <el-radio label="soft" :disabled="isDisable">软件</el-radio>
                                <el-radio class="radioStyle" label="cryptocard" :disabled="isDisable">硬件</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="签名算法:" label-width="21%" prop="sig_alg_oid">
                            <el-select @change="sigChange" v-model="form.sig_alg_oid" placeholder="请选择签名算法" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in sigList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="厂家名称:" label-width="21%" prop="factory_name">
                            <el-input class="inputwid" v-model="form.factory_name" placeholder="请输入厂家名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="厂家标识:" label-width="21%" prop="factory_id">
                            <el-input class="inputwid" v-model="form.factory_id" placeholder="请输入厂家标识" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>

    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue"
export default {
    inject: ["reload"],
    components: { addOrg },
    data() {
        return {
            name: "",
            mode: this.$route.query.mode,
            SignerId: this.$route.query.id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",
            loading: false,
            form: {
                id: "",
                purpose: "cert",
                factory_name: "",
                factory_id: "",
                type: "soft",
                name: "", // 名称
                organization_id: "",
                sig_alg_oid: "",
                sig_alg_name: ""
            },
            rules: {
                purpose: [
                    {
                        required: true,
                        message: "请选择用途",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur"
                    }
                ],
                organization_id: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ],
                sig_alg_oid: [
                    {
                        required: true,
                        message: "请选择签名算法",
                        trigger: "blur"
                    }
                ]
            },
            sigList: [
                {
                    value: "1.2.156.197.1.501",
                    label: "SM3WithSM2"
                },
                {
                    value: "1.2.840.113549.1.1.5",
                    label: "SHA1WithRSA"
                },
                {
                    value: "1.2.840.113549.1.1.11",
                    label: "SHA256WithRSA"
                }
            ],
            organizationId: 0
        }
    },

    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        }

        if (this.mode != 1) {
            this.getSignerDetail()
            if (this.mode == 3) {
                this.name = "修改签名者"
            } else {
                this.isDisable = true
                this.name = "签名者详情"
            }
        } else {
            this.name = "新增签名者"
        }

        this.$nextTick(() => {
            this.$refs.form.resetFields()
        })
    },
    methods: {
        // 获取详情
        getSignerDetail() {
            this.$commonJs.getLoading()
            this.$commonJs
                .getMethodData(this.$url.SignerById, "POST", {
                    id: this.SignerId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.form = res.data.data
                        this.organizationId = this.form.organization_id
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
                })
        },
        organization_id(val) {
            this.form.organization_id = val
        },
        cancel() {
            this.$router.push("/SignerList")
        },

        onUpdate(formName) {
            let url
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.loading = true
                let data = this.$commonJs.getScreenValue(this.form)
                console.log(data, "data")
                if (this.mode == 1) {
                    url = this.$url.SignerAdd
                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.cancel()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            this.loading = false
                            console.log(res, "res")
                        })
                }
                if (this.mode == 3) {
                    url = this.$url.SignerUpd
                    this.$commonJs
                    this.$confirm("是否修改此条签名者?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(url, "POST", data)
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.cancel()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                    }
                                    this.loading = false
                                    console.log(res, "res")
                                })
                        })
                        .catch((err) => {
                            this.loading = false
                        })
                }
            })
        },
        sigChange(data) {
            let sigAlgName
            sigAlgName = this.sigList.find((item) => item.value == data)
            this.form.sig_alg_name = sigAlgName.label
            console.log(data, sigAlgName, "data")
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .ORG .el-form-item__error {
    left: 90px !important;
}
</style>
