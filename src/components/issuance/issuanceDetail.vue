<template>
    <div v-loading="loading">
        <div v-if="mode==1">
            <el-card class="navDetailItem">
                <span class="h1">新增证书颁发机构</span>
                <el-button size="mini" class="el-button1" type="warning" @click="cancel()" style="float: right;margin-bottom:15px">返回</el-button>
            </el-card>
            <el-card class="navDetailItem" style="margin-top:10px !important">
                <div style="margin-bottom:15px;margin-top:15px">
                    <el-row>
                        <el-col :span="3">
                            <el-upload :disabled="organizationId==''&& isAdmin == true" class="upload-demo" style="display:inline-block" :show-file-list="showFile" :headers="MyHeader" :action="actionUrl" :on-success="handleSuccess" :on-exceed="handleExceed" multiple :limit="1" :file-list="fileList">
                                <el-button :disabled="organizationId=='' && isAdmin == true" style="" type="primary" size="mini" icon="l-icon-plus">上传根证书文件(.cer)</el-button>
                            </el-upload>
                        </el-col>
                        <el-col :span="15" v-if="isAdmin == true">
                            <addOrg @organization_id="organization_id"></addOrg>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </div>
        <div v-if="mode==2">
            <el-card class="navDetailItem">
                <span class="h1">{{ name }}</span>
                <router-link :to="{ path: '/issuanceList' }">
                    <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
                </router-link>
            </el-card>
            <el-card class="intanle">
                <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <div style="display: flex;flex-direction: column;width: 50%;margin: auto;">
                        <borderTitle title="证书信息" style="display:inline-block">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书序列号:" label-width="42%" prop="serial_number">
                                {{form.serial_number}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="颁发机构名称:" label-width="42%" prop="subject">
                            {{form.subject}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="颁发者:" label-width="42%" prop="issuer">
                                {{form.issuer}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="开始时间:" label-width="42%" prop="not_before">
                                {{form.not_before}}
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" :offset="6">
                            <el-form-item label="结束时间:" label-width="42%" prop="not_after">
                                {{form.not_after}}
                            </el-form-item>
                        </el-col>
                    </borderTitle>
                        <!-- <el-col :span="12" :offset="6">
                            <el-form-item label="颁发给:" label-width="21%" prop="job_group">
                                <el-input class="inputwid" v-model="form.job_group" placeholder="请输入颁发给" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <borderTitle title="密钥信息" style="display:inline-block">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="密钥类型:" label-width="42%" prop="key_algorithm">
                                <!-- <el-radio-group v-model="form.key_type" style="width: 50%"> -->
                                {{form.key_algorithm}}
                                <!-- <el-radio label="10">RSA</el-radio>
                                    <el-radio label="30">SM2</el-radio> -->
                                <!-- <el-radio label="20">http</el-radio> -->
                                <!-- </el-radio-group> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="密钥长度:" label-width="42%" prop="key_length">
                                {{form.key_length}}
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书状态:" label-width="42%" prop="status">
                                <!-- <el-radio label="20" v-model="form.status" :disabled="isDisable">正常</el-radio>
                                <el-radio label="10" v-model="form.status" :disabled="isDisable">暂停</el-radio>
                                <el-radio label="90" v-model="form.status" :disabled="isDisable">注销</el-radio> -->
                                <span v-if="form.status='20'">正常</span>
                                <span v-else-if="form.status='10'">暂停</span>
                                <span v-else>注销</span>
                            </el-form-item>
                        </el-col>
                    </borderTitle>
                    </div>
                    </el-row>
                </el-form>

            </el-card>
        </div>
        <!-- 配置CRL验证 -->
        <div v-if="mode==4">
            <el-card class="navDetailItem">
                <el-form ref="form" :model="formCRL" :rules="rulesCRL" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <!-- <el-col :span="12" :offset="6">
                            <el-form-item label="颁发机构:" label-width="21%" prop="job_name">
                                <el-input class="inputwid" v-model="formCRL.job_name" placeholder="请输入颁发机构"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12" :offset="6">
                            <el-form-item label="是否启用CRL分发点:" label-width="21%" prop="enable_cdp">
                                <el-switch v-model="formCRL.enable_cdp" active-value="1" inactive-value="0" @change='switchClick($event)' active-color="#13ce66"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="下载CRL地址:" label-width="21%" prop="down_url">
                                <el-input class="inputwid" v-model="formCRL.down_url" :disabled="downUrlDisabled" placeholder="下载CRL地址"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="推迟更新时长(分钟):" label-width="21%" prop="delay_minutes">
                                <el-input class="inputwid" v-model="formCRL.delay_minutes" placeholder="推迟更新时长(分钟)" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                                <el-button size="mini" type="primary" @click="onUpdate('form','CRL')" style="margin-bottom:10px">提交</el-button>
                                <el-button size="mini" type="primary" @click="CrlUpdate()" style="margin-bottom:10px">同步</el-button>

                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>
        <!-- 配置OCSP验证 -->
        <div v-if="mode==5">
            <el-card class="navDetailItem">
                <el-form ref="form" :model="formOCSP" :rules="rulesOCSP" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <!-- <el-col :span="12" :offset="6">
                            <el-form-item label="颁发机构:" label-width="21%" prop="appcert_serial_number">
                                <el-input class="inputwid" v-model="formOCSP.appcert_serial_number" disabled placeholder="请输入颁发机构"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12" :offset="6">
                            <el-form-item label="主OCSP服务器地址:" label-width="21%" prop="master_ocsp">
                                <el-input class="inputwid" v-model="formOCSP.master_ocsp" placeholder="请输入主OCSP服务器地址"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="是否启用:" label-width="21%" prop="master_status">
                                <el-switch active-value="20" inactive-value="10" v-model="formOCSP.master_status" active-color="#13ce66"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="从OCSP服务器地址:" label-width="21%" prop="slave_ocsp">
                                <el-input class="inputwid" v-model="formOCSP.slave_ocsp" placeholder="请输入从OCSP服务器地址"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="是否启用:" label-width="21%" prop="slave_status">
                                <el-switch active-value="20" inactive-value="10" v-model="formOCSP.slave_status" active-color="#13ce66"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                                <el-button size="mini" type="primary" @click="onUpdate('form','OCSP')" style="margin-bottom:10px">提交</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue"
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    components: { addOrg,borderTitle},
    data() {
        return {
            master_statusVal: "20",
            showFile: false,
            downUrlDisabled: false,
            name: "角色信息",
            mode: this.$route.query.mode,
            CertId: this.$route.query.id,
            appcertNum: this.$route.query.appcertNum,
            judgmentType: this.$route.query.type,
            organizationId: "",
            isDisable: false,
            radio: "",
            loading: false,
            fileList: [],
            MyHeader: { Authorization: "" },
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            dialogVisible: false,
            form: {
                // code: "", // 编码
                // // 并发执行 0:禁止 1:允许
                // concurrent: "0",
                // // cron_expression - cron执行表达式
                // cron_expression: "",
                // // invoke_target - 调用目标字符串
                // invoke_target: "",
                // // invoke_type - 请求类型 10:bean方法 20:http
                // invoke_type: "10",
                // // job_group * 任务组名
                // job_group: "",
                // // job_name *名称
                // serial_number: "",
                // status: "1", // 任务状态  1:正常 2:暂停
                // remark: "",
                // misfire_policy: "0" //  计划策略 0:默认 1:立即触发执行 2:触发一次执行 3:不触发立即执行
            },
            rules: {
                code: [
                    {
                        required: true,
                        message: "请输入编码",
                        trigger: "blur"
                    }
                ],
                concurrent: [
                    {
                        required: true,
                        message: "请选择允许并发执行",
                        trigger: "blur"
                    }
                ],
                cron_expression: [
                    {
                        required: true,
                        message: "请输入cron执行表达式",
                        trigger: "blur"
                    }
                ],
                // status: [
                //     {
                //         required: true,
                //         message: "请选择任务状态",
                //         trigger: "change"
                //     }
                // ],

                invoke_target: [
                    {
                        required: true,
                        message: "请输入调用目标字符串",
                        trigger: "blur"
                    }
                ],
                invoke_type: [
                    {
                        required: true,
                        message: "请输入请求类型",
                        trigger: "blur"
                    }
                ],
                job_group: [
                    {
                        required: true,
                        message: "请输入任务组名",
                        trigger: "blur"
                    }
                ],
                job_name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur"
                    }
                ],

                misfire_policy: [
                    {
                        required: true,
                        message: "请选择计划策略",
                        trigger: "blur"
                    }
                ]
            },
            formCRL: {
                organization_id: "",
                end_serial_number: "",
                enable_cdp: "0",
                down_url: "",
                delay_minutes: "",
                type: ""
            },
            rulesCRL: {
                // down_url: [
                //     {
                //         required: true,
                //         message: "请输入下载CRL地址",
                //         trigger: "blur"
                //     }
                // ],
                delay_minutes: [
                    {
                        required: true,
                        message: "请输入推迟更新时长(分钟)",
                        trigger: "blur"
                    }
                ]
            },
            formOCSP: {
                appcert_serial_number: "", // 根证书颁发机构【根证书序列号】
                organization_id: "", // 组织机构id
                master_ocsp: "", // 主地址
                master_status: "10", // 主状态 20:启用【enabled】 10:停用【disable】
                slave_ocsp: "", // 从地址
                slave_status: "10" // 从状态
            },
            rulesOCSP: {
                master_ocsp: [
                    {
                        required: true,
                        message: "请输入主OCSP服务器地址",
                        trigger: "blur"
                    }
                ]
                // master_status: [
                //     {
                //         required: true,
                //         message: "请选择主状态",
                //         trigger: "blur"
                //     }
                // ]
            },
            misfireList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "0",
                    label: "默认"
                },
                {
                    value: "1",
                    label: "立即触发执行"
                },
                {
                    value: "2",
                    label: "触发一次执行"
                },
                {
                    value: "3",
                    label: "不触发立即执行"
                }
            ],
            TimeList: [],
            isAdmin: false
        }
    },
    watch: {
        "formOCSP.master_status"(val) {
            if (val == "20") {
            }
        },
        "form.organization_name"(val) {
            console.log(val, val)
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("organization_name")
                })
            }
        },
        "form.status"(val) {
            console.log(val, val)
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("status")
                })
            }
        },
        "form.cron_expression"(val) {
            console.log(val, val)
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("cron_expression")
                })
            }
        }
    },
    created() {
        this.MyHeader.Authorization =
            window.sessionStorage.getItem("Authorization")
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.actionUrl =
                this.$url.UploadCert +
                "?" +
                "organization_id=" +
                this.$commonJs.getStorage().organization_id
        } else {
            this.isAdmin = true
        }

        this.getTimeList()
        if (this.mode != 1) {
            if (this.mode == 3) {
                this.name = "修改证书颁发机构信息"
            } else if (this.mode == 2) {
                this.isDisable = true
                this.name = "证书颁发机构详情"
                this.getCertById()
            } else if (this.mode == 4) {
                this.name = "配置CRL验证"
                this.formCRL.organization_id =
                    this.$commonJs.getStorage().organization_id
                this.getCrlById()
            } else if (this.mode == 5) {
                this.name = "配置OCSP验证"
                this.formOCSP.organization_id =
                    this.$commonJs.getStorage().organization_id
                this.getOcspById()
            }
        } else {
            this.name = "新增证书颁发机构"
        }
    },
    methods: {
        // 获取详情
        getCertById() {
            this.loading = false

            this.$commonJs
                .getMethodData(this.$url.GetCertById, "POST", {
                    id: this.CertId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.form = res.data.data
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        // 获取Ocsp详情
        getOcspById() {
            this.loading = false
            // this.$commonJs
            //     .getMethodData(this.$url.GetOcspById, "POST", {
            //         id: this.CertId
            //     })
            //     .then((res) => {
            //         if (res.data.code == 100000) {
            //             console.log(res, "res");
            //             this.formOCSP = res.data.data;
            //         } else if (res.data.code != 800000) {
            //             this.$message.error(res.data.msg);
            //         }
            //     });
            let url = ""
            if (this.judgmentType == "user") {
                url = this.$url.GetOcspUrlBySNByUser
            }
            if (this.judgmentType == "app") {
                url = this.$url.GetOcspUrlBySN
            }
            this.$commonJs
                .getMethodData(url, "POST", {
                    appcert_serial_number: this.appcertNum
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        // this.formOCSP.appcert_serial_number = res.data.data;
                        if (res.data.data != null) {
                            this.formOCSP = res.data.data
                        }
                        this.formOCSP.organization_id =
                            this.$commonJs.getStorage().organization_id
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
        },
        organization_id(data) {
            console.log(data, "pppppppppppp")
            this.organizationId = data
            this.actionUrl =
                this.$url.UploadCert + "?" + "organization_id=" + data
        },
        // 获取CRL详情
        getCrlById() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.GetCrlCfgBySN, "POST", {
                    end_serial_number: this.appcertNum
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        // this.formOCSP.appcert_serial_number = res.data.data;

                        if (res.data.data != null) {
                            this.formCRL = res.data.data
                            this.formCRL.organization_id =
                                this.$commonJs.getStorage().organization_id
                            if (this.formCRL.enable_cdp != null) {
                                this.formCRL.enable_cdp =
                                    res.data.data.enable_cdp.toString()
                            }
                        }
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
        },
        cancel() {
            if (this.judgmentType != undefined) {
                if (this.judgmentType == "app") {
                    this.$router.push("/applicationCertList")
                    return
                }
                if (this.judgmentType == "user") {
                    this.$router.push("/userCertificateList")
                    return
                }
                // if (this.mode == 4 || this.mode == 5) {
                //     this.$router.push("/applicationCertList");
                //     return;
                // }
            }

            this.$router.push("/issuanceList")
        },
        // 同步地址
        CrlUpdate() {
            if (this.formCRL.down_url == null || this.formCRL.down_url == "") {
                this.$message.error("请输入下载地址!")
                return false
            }

            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.Sync, "POST", {
                    end_serial_number: this.appcertNum,
                    down_url: this.formCRL.down_url
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.loading = false
                        this.$message.success("同步成功")
                    } else if (res.data.code != 800000) {
                        this.loading = false
                        this.$message.error(res.data.msg)
                    }
                })
        },
        getTimeList() {
            this.$commonJs
                .getMethodData(this.$url.DataAll, "POST", {
                    dictionary_code: "cron_expression"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.TimeList = res.data.data
                        console.log(res.data.data, "formPing")
                    }
                })
        },
        switchClick($event) {
            console.log($event, "999")
            if ($event == 1) {
                this.downUrlDisabled = true
                this.loading = true
                let url = ""
                if (this.judgmentType != undefined) {
                    url = this.$url.GetCrlUrlBySN
                    this.$commonJs
                        .getMethodData(url, "POST", {
                            end_serial_number: this.appcertNum,
                            type: this.judgmentType
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res.data.data, "res.data.res.data.")
                                this.formCRL.down_url = res.data.data
                                this.loading = false
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                                this.loading = false
                            }
                            console.log(res, "res")
                        })
                }
            } else {
                this.downUrlDisabled = false
                this.formCRL.down_url = ""
            }
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        onUpdate(formName, type) {
            let url
            console.log(
                this.formOCSP,
                "this.$commonJs.getScreenValue(this.formOCSP);"
            )
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                if (this.mode == 5) {
                    if (this.judgmentType != undefined) {
                        if (this.judgmentType == "user") {
                            url = this.$url.GetAddOcspByUser
                        } else if (this.judgmentType == "app") {
                            url = this.$url.GetAddOcsp
                        }
                    }
                    this.formOCSP.appcert_serial_number = this.appcertNum
                    let data = this.$commonJs.getScreenValue(this.formOCSP)

                    this.$confirm("是否配置OCSP验证?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.loading = true
                            this.$commonJs
                                .getMethodData(url, "POST", data)
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.loading = false
                                        this.cancel()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                        this.loading = false
                                    }
                                    console.log(res, "res")
                                })
                        })
                        .catch((err) => err)
                }
                if (this.mode == 4) {
                    this.formCRL.end_serial_number = this.appcertNum
                    this.formCRL.delay_minutes = Number(
                        this.formCRL.delay_minutes
                    )
                    this.formCRL.type = this.judgmentType
                    let data = this.$commonJs.getScreenValue(this.formCRL)
                    if (this.judgmentType != undefined) {
                        url = this.$url.AddCrlCfg
                    }
                    this.$confirm("是否配置CRL验证?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.loading = true
                            this.$commonJs
                                .getMethodData(url, "POST", data)
                                .then((res) => {
                                    this.loading = false
                                    if (res.data.code == 100000) {
                                        this.$message.success("配置成功")
                                        this.cancel()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                    }
                                })
                        })
                        .catch((err) => err)
                }
            })
        },
        addWhite() {},
        addWhiteFiles() {},

        handleSuccess(file) {
            if (file.code == 100000) {
                this.showFile = true
                this.$message.success(file.attrs.CheckCaCertMsg)
                this.cancel()
            } else {
                this.fileList = []
                this.$nextTick(() => {
                    this.showFile = false
                })

                if (JSON.stringify(file.attrs) != "{}") {
                    this.$message.error(file.attrs.CheckCaCertMsg)
                    console.log(this.fileList, " this.fileList")

                    setTimeout(() => {
                        this.$message.error(file.msg)
                    }, 1000)
                } else {
                    this.$message.error(file.msg)
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.el-form {
    .el-form-item {
        /deep/ .el-form-item__label {
            font-weight: 600;
            font-size: 15px;
        }
    }
}
</style>