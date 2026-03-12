<template>
    <div v-loading="CAloading">
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <el-button size="mini" class="el-button1" type="warning" @click="cancel" style="float: right;margin-bottom:15px">返回</el-button>

        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="formCRL" :rules="rulesCRL" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="根证书:" prop="ca_cert_id">
                            <el-select class="inputwid" v-model="formCRL.ca_cert_id" placeholder="请选择" :disabled="isDisable">
                                <el-option v-for="item in RootCertList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="请求内容:" label-width="21%">
                            <el-input type="textarea" class="inputwid" v-model="formCRL.request_content" placeholder="请输入备注" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="">
                        <el-form-item label="是否双证:" label-width="21%">
                            <el-switch v-model="formCRL.isDouble" active-value="1" :disabled="isDisable" inactive-value="0" @change='switchClickDouble($event)' active-color="#13ce66"></el-switch>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" :offset="6" style="">

                        <el-form-item label="是否CSR:" label-width="21%" prop="isUK">
                            <el-switch v-model="formCRL.isUK" active-value="1" inactive-value="0" @change='switchClick($event)' active-color="#13ce66" :disabled="isDisable"></el-switch>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" :offset="6" style="">
                        <el-form-item label="模式:" label-width="21%" prop="isMode">
                            <el-radio-group v-model="formCRL.isMode" @change="modeChange" :disabled="isDisable">
                                <el-radio label="0">csr</el-radio>
                                <el-radio class="radioStyle" label="1">主题</el-radio>
                                <el-radio class="radioStyle" label="2">ukey</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="根证书:" prop="ca_cert_id">
                            <el-select class="inputwid" v-model="formCRL.ca_cert_id" @change="CaChange()" placeholder="请选择CA" :disabled="isDisable">
                                <el-option v-for="item in RootCertList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>-->

                    <!-- <div v-if="mode==2">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书开始时间:" label-width="21%">
                                <el-input class="inputwid" v-model="formCRL.not_before" placeholder="请输入颁发者" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书结束时间:" label-width="21%">
                                <el-input class="inputwid" v-model="formCRL.not_after" placeholder="请输入颁发者" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="颁发者:" label-width="21%">
                                <el-input class="inputwid" v-model="formCRL.issuer" placeholder="请输入颁发者" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书主题:" label-width="21%">
                                <el-input class="inputwid" v-model="formCRL.subject" placeholder="请输入颁发者" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书序列号:" label-width="21%" prop="serial_number">
                                <el-input class="inputwid" v-model="formCRL.serial_number" placeholder="请输入颁发者" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </div> -->
                    <div v-if="formCRL.isMode=='1'">
                        <!-- <el-col :span="12" :offset="6" style="font-size:20px;font-weight:600" v-if="this.mode=='1'">证书公钥</el-col> -->
                        <el-col :span="12" :offset="6">
                            <el-form-item label="密钥算法:" label-width="21%" prop="key_algorithm">
                                <el-select class="inputwid" v-model="formCRL.key_algorithm" placeholder="请选择密钥算法" :disabled="isDisable">
                                    <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="公钥base64:" label-width="21%" prop="public_key_base64">
                                <el-input type="textarea" class="inputwid" v-model="formCRL.public_key_base64" placeholder="请输入公钥" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>

                    </div>
                    <div v-if="formCRL.isMode!='0' && this.mode=='1'">
                        <el-col :span="12" :offset="6" style="font-size:20px;font-weight:600">证书主题</el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="通用名:" label-width="21%" prop="common_name">
                                <el-input class="inputwid" v-model="formCRL.common_name" :disabled="isDisable" placeholder="请输入通用名(Common Name)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="组织:" label-width="21%" prop="org">
                                <el-input class="inputwid" v-model="formCRL.org" placeholder="请输入组织(Org)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="部门:" label-width="21%" prop="ou">
                                <el-input class="inputwid" v-model="formCRL.ou" :disabled="isDisable" placeholder="请输入部门(OrgUnit)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="国家/地区:" label-width="21%" prop="country">
                                <el-select class="inputwid" v-model="formCRL.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable">
                                    <el-option v-for="item in $commonJs.getCnData()" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="省份:" label-width="21%" prop="st">
                                <el-input class="inputwid" v-model="formCRL.st" :disabled="isDisable" placeholder="请输入省份(State)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="城市:" label-width="21%" prop="location">
                                <el-input class="inputwid" v-model="formCRL.location" :disabled="isDisable" placeholder="请输入城市(Location)"></el-input>
                            </el-form-item>
                        </el-col>

                    </div>
                    <div v-if="formCRL.isMode=='0' && mode==1">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="PKCS10:" label-width="21%" prop="fileList">
                                <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed" :on-change="changeFile" :file-list="fileList" :headers="MyHeader" :limit="1" :auto-upload="false" :on-success="handleSuccess">
                                    <el-button slot="trigger" icon="el-icon-plus" plain size="mini" type="primary">选择文件</el-button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </div>
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                            <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                            <el-button size="mini" v-if="mode!=2" type="primary" @click="onUpdate('form','CRL')" style="margin-bottom:10px">提交</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <PinList ref="PinDialog" @PIN="PIN"></PinList>
    </div>
</template>
<script>
import { UBSEncrollAsync } from "../../assets/js/UBSEnrollAsync"
import { JKunitrust } from "../../assets/js/JKunitrust"
import PinList from "../CaCert/PinList.vue"
export default {
    inject: ["reload"],
    components: {
        PinList
    },
    data() {
        return {
            name: "",
            fileList: [],
            certIssueId: this.$route.query.id,
            MyHeader: { Authorization: "" },
            mode: this.$route.query.mode,
            formCRL: {
                csr: "", // 文件
                signer_id: "", // 签名者
                profile_id: "", // 证书模板id
                ca_cert_id: "", // 根证书id
                organization_id: 1,
                keyIndex: "", // 密钥索引
                isMode: "0", //0:csr  1：主题  2：ukey
                request_mode: "csr", // csr: CSR方式   sub:主题方式  ukey:key模式
                pucPassword: "",
                isDouble: "1",
                cert_mode: "dou", //  sig:签名证书 enc:加密证书 dou:双证
                down_url: "",
                delay_minutes: "",
                common_name: "",
                org: "",
                ou: "",
                country: "",
                st: "",
                location: "",
                request_content: "",
                public_key_base64: "",
                key_algorithm: ""
            },
            placeholder: "点击右边选择按钮选择密钥索引",
            actionUrl: "",
            rulesCRL: {
                pucPassword: [
                    {
                        required: true,
                        message: "请输入私钥访问控制码",
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
                country: [
                    {
                        required: true,
                        message: "请输入国家",
                        trigger: "blur"
                    }
                ],
                signer_id: [
                    {
                        required: true,
                        message: "请选择签名者",
                        trigger: "blur"
                    }
                ],
                keyIndex: [
                    {
                        required: true,
                        message: "请选择密钥索引",
                        trigger: "blur"
                    }
                ],
                profile_id: [
                    {
                        required: true,
                        message: "请选择证书模板",
                        trigger: "blur"
                    }
                ],
                ca_cert_id: [
                    {
                        required: true,
                        message: "请选择根证书",
                        trigger: "blur"
                    }
                ],
                csr: [
                    {
                        required: true,
                        message: "请选择文件",
                        trigger: "blur"
                    }
                ],
                public_key_base64: [
                    {
                        required: true,
                        message: "请输入公钥",
                        trigger: "blur"
                    }
                ],
                key_algorithm: [
                    {
                        required: true,
                        message: "请选择密钥算法",
                        trigger: "blur"
                    }
                ]
            },
            keyTypeList: [
                {
                    value: "1",
                    label: "SM2"
                },
                {
                    value: "0",
                    label: "RSA"
                },
                {
                    value: "2",
                    label: "对称密钥"
                }
            ],
            pageSize: 10,
            total: 0,
            pageNow: 1,
            RootCertList: [],
            CADisabled: true,
            isDisable: false,
            organization_id: "",
            keyRadio: "",
            keyList: [],
            CAloading: false,
            loading: false,
            userPIN: "12345678",
            subjectStr: "",
            device: null,
            devices: [],
            deviceLength: 0,
            idConCount: 0,
            keyTypeList: [
                // {
                //     label: "SHA1WithRSA",
                //     value: "SHA1WithRSA"
                // },
                {
                    label: "SHA256WithRSA",
                    value: "SHA256WithRSA"
                },
                {
                    label: "SM3WithSM2",
                    value: "SM3WithSM2"
                }
            ]
        }
    },
    created() {
        this.$UKey.getInit()

        if (this.$commonJs.getStorage().organization_id != 1) {
            this.formCRL.organization_id =
                this.$commonJs.getStorage().organization_id
            this.organization_id = this.$commonJs.getStorage().organization_id
        }
        if (this.mode == 1) {
            this.name = "新增证书申请"
        } else {
            this.getCertIssueDetail()
        }
        if (this.mode == 2) {
            this.placeholder = "请选择密钥索引"
            this.name = "证书详情"
            this.isDisable = true
        }
        this.MyHeader = {
            Authorization: window.sessionStorage.getItem("Authorization"),
            "Content-Type": "multipart/form-data"
        }
        this.actionUrl = this.$url.CertIssueGenCert
        this.getRootListAll()
    },
    mounted() {},
    methods: {
        modeChange(val) {
            if (val == "1") {
                this.formCRL.request_mode = "sub"
            } else if (val == "2") {
                this.formCRL.request_mode = "ukey"
            } else {
                this.formCRL.request_mode = "csr"
            }
        },
        getCheck() {
            let subject = this.makeSubject()
            if (subject == null || subject == "" || subject == undefined) {
                this.$message.error("证书主题不能为空!")
                return
            } else {
                this.subjectStr = subject
                this.$refs.PinDialog.modifyFormdialog = true
                this.$refs.PinDialog.modifyForm.PINStr = ""
            }
        },

        makeSubject() {
            let subject = ""
            let C = this.formCRL.country
            if (C != null && C != "" && C != undefined) {
                subject = subject + "C=" + C
            } else {
                this.$message.error("国家不能为空!")
                return
            }
            let ST = this.formCRL.st
            if (ST != null && ST != "" && ST != undefined) {
                subject = subject + ",ST=" + ST
            }
            let L = this.formCRL.location
            if (L != null && L != "" && L != undefined) {
                subject = subject + ",L=" + L
            }
            let OU = this.formCRL.ou
            if (OU != null && OU != "" && OU != undefined) {
                subject = subject + ",OU=" + OU
            }
            let O = this.formCRL.org
            if (O != null && O != "" && O != undefined) {
                subject = subject + ",O=" + O
            }
            let CN = this.formCRL.common_name
            if (CN != null && CN != "" && CN != undefined) {
                subject = subject + ",CN=" + CN
            } else {
                this.$message.error("通用名称不能为空!")
                return
            }
            return subject
        },
        PIN(val) {
            if (val != "") {
                let pin = val
                if (val != "false") {
                    this.MakeCert(this.subjectStr, pin)
                } else {
                    this.CAloading = false
                }
            }
        },

        MakeCert(subject, pin) {
            let code = ""
            for (var i = 0; i < 32; i++) {
                code += parseInt(Math.random() * 10)
            }
            var con_name = code
            con_name = con_name.toString()
            this.$UKey.GetDevices((res) => {
                console.log(res.length)

                this.device = null
                this.device = res[0]

                UBSEncrollAsync.EnumApplication((res) => {
                    console.log(res, "EnumApplication")
                    if (res.success === true) {
                        console.log(res.data, "EnumApplication")
                        let apps = res.data
                        let alg = "sm2"
                        let bits = 256
                        let handle
                        if (null != apps && 0 < apps.length) {
                            // ns.prompt("输入Usb Key口令，并确认:", function (v) {
                            let userPIN = pin
                            UBSEncrollAsync.CreateContainer(
                                (res) => {
                                    console.log(
                                        "CreateContainer: " + res.success
                                    )
                                    console.log("CreateContainer: " + res.data)
                                    console.log(
                                        "devices[0]: " + this.devices[0]
                                    )
                                    console.log("apps[0]: " + apps[0])
                                    if (res.success === true) {
                                        UBSEncrollAsync.OpenContainer(
                                            (res) => {
                                                console.log(
                                                    "OpenContainer: " + res
                                                )
                                                if (res.success === true) {
                                                    handle = res.data
                                                    UBSEncrollAsync.CheckPIN(
                                                        (res) => {
                                                            console.log(
                                                                "CheckPIN: " +
                                                                    res
                                                            )
                                                            if (res.success) {
                                                                UBSEncrollAsync.GenerateKeyPair(
                                                                    (res) => {
                                                                        if (
                                                                            res.success ===
                                                                            true
                                                                        ) {
                                                                            UBSEncrollAsync.CreatePKCS10(
                                                                                (
                                                                                    res
                                                                                ) => {
                                                                                    console.log(
                                                                                        "CreatePKCS10 message: " +
                                                                                            res.message
                                                                                    )
                                                                                    if (
                                                                                        res.success ===
                                                                                        true
                                                                                    ) {
                                                                                        let pkcs10 =
                                                                                            res.data
                                                                                        console.log(
                                                                                            "PKCS10: " +
                                                                                                pkcs10
                                                                                        )
                                                                                        window.sessionStorage.setItem(
                                                                                            "pkcs10",
                                                                                            pkcs10
                                                                                        )
                                                                                        this.$commonJs
                                                                                            .getMethodData(
                                                                                                this
                                                                                                    .$url
                                                                                                    .CaRequestAdd,
                                                                                                "POST",
                                                                                                {
                                                                                                    csr_base64:
                                                                                                        pkcs10,
                                                                                                    organization_id:
                                                                                                        this
                                                                                                            .formCRL
                                                                                                            .organization_id,
                                                                                                    request_mode:
                                                                                                        this
                                                                                                            .formCRL
                                                                                                            .request_mode,
                                                                                                    ca_cert_id:
                                                                                                        this
                                                                                                            .formCRL
                                                                                                            .ca_cert_id,
                                                                                                    cert_mode:
                                                                                                        this
                                                                                                            .formCRL
                                                                                                            .cert_mode,
                                                                                                    request_content:
                                                                                                        this
                                                                                                            .formCRL
                                                                                                            .request_content,
                                                                                                    status: "10"
                                                                                                }
                                                                                            )
                                                                                            .then(
                                                                                                (
                                                                                                    res
                                                                                                ) => {
                                                                                                    if (
                                                                                                        res
                                                                                                            .data
                                                                                                            .code ==
                                                                                                        100000
                                                                                                    ) {
                                                                                                        this.$message.success(
                                                                                                            "申请成功"
                                                                                                        )
                                                                                                        UBSEncrollAsync.FreeCertificate(
                                                                                                            (
                                                                                                                res
                                                                                                            ) => {},
                                                                                                            handle
                                                                                                        )
                                                                                                        this.CAloading = false
                                                                                                        this.cancel()
                                                                                                    } else if (
                                                                                                        res
                                                                                                            .data
                                                                                                            .code !=
                                                                                                        800000
                                                                                                    ) {
                                                                                                        this.$message.error(
                                                                                                            res
                                                                                                                .data
                                                                                                                .msg
                                                                                                        )
                                                                                                    }
                                                                                                    UBSEncrollAsync.FreeCertificate(
                                                                                                        (
                                                                                                            res
                                                                                                        ) => {},
                                                                                                        handle
                                                                                                    )
                                                                                                    this.CAloading = false
                                                                                                }
                                                                                            )
                                                                                    } else {
                                                                                        this.$message.error(
                                                                                            "Usb Key产生PKCS10证书请求失败!"
                                                                                        )
                                                                                        UBSEncrollAsync.FreeCertificate(
                                                                                            (
                                                                                                res
                                                                                            ) => {},
                                                                                            handle
                                                                                        )
                                                                                        this.CAloading = false
                                                                                    }
                                                                                },
                                                                                handle,
                                                                                subject,
                                                                                alg,
                                                                                bits
                                                                            )
                                                                        } else {
                                                                            this.$message.error(
                                                                                "Usb Key产生签名密钥对失败!"
                                                                            )
                                                                            UBSEncrollAsync.FreeCertificate(
                                                                                (
                                                                                    res
                                                                                ) => {},
                                                                                handle
                                                                            )
                                                                            this.CAloading = false
                                                                        }
                                                                    },
                                                                    handle,
                                                                    true
                                                                )
                                                            } else {
                                                                this.$message.error(
                                                                    "Usb Key口令验证失败!"
                                                                )
                                                                UBSEncrollAsync.FreeCertificate(
                                                                    (res) => {},
                                                                    handle
                                                                )
                                                                this.CAloading = false
                                                            }
                                                        },
                                                        handle,
                                                        userPIN
                                                    )
                                                } else {
                                                    this.$message.error(
                                                        "Usb Key打开密钥容器失败!"
                                                    )
                                                    UBSEncrollAsync.FreeCertificate(
                                                        (res) => {},
                                                        handle
                                                    )
                                                    this.CAloading = false
                                                }
                                            },
                                            this.device,
                                            apps[0],
                                            con_name
                                        )
                                    } else {
                                        this.$message.error("容器创建失败!")
                                        this.CAloading = false
                                    }
                                },
                                this.device,
                                apps[0],
                                con_name,
                                userPIN
                            )
                            // });
                        } else {
                            this.$message.error(
                                "UKEY 没有初始化，请使用管理工具初始化！"
                            )
                            this.CAloading = false
                        }
                    } else {
                        this.$message.error(
                            "UKEY 没有初始化，请使用管理工具初始化！"
                        )
                        this.CAloading = false
                    }
                }, this.device)
            })
        },

        // 获取详情
        getCertIssueDetail() {
            this.$commonJs.getLoading()
            this.$commonJs
                .getMethodData(this.$url.CaRequestGetById, "POST", {
                    id: this.certIssueId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.formCRL = res.data.data
                        this.formCRL.keyIndex = res.data.data.key_index
                        if (res.data.data.request_mode == "sub") {
                            this.formCRL.isMode = "1"
                        } else if (res.data.data.request_mode == "ukey") {
                            this.formCRL.isMode = "2"
                        } else {
                            this.formCRL.isMode = "0"
                        }

                        if (res.data.data.cert_mode == "sig") {
                            this.formCRL.isDouble = "0"
                        } else {
                            this.formCRL.isDouble = "1"
                        }
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
                })
        },
        cancel() {
            this.$router.push("/CertRequestList")
        },

        // 获取根证书
        getRootListAll(data) {
            this.getListAll(
                this.$url.CertListAll,
                {
                    organization_id: this.organization_id
                },
                "name",
                "id",
                "RootCertList"
            )
        },
        getListAll(url, data, label, value, type, ischange) {
            let list = []
            this.$commonJs.getMethodData(url, "POST", data).then((res) => {
                if (res.data.code == 100000) {
                    res.data.data.forEach((element) => {
                        list.push({
                            label: element[label],
                            value: element[value]
                        })
                    })

                    // if (this.RootCertList.length != 0) {
                    //     this.form.ca_cert_id = this.RootCertList[0].value;
                    // }
                    if (type == "RootCertList") {
                        this.RootCertList = list
                        console.log(this.RootCertList, "RootCertList")
                    }
                } else if (res.data.code != 800000) {
                    // this.$message.error(res.data.msg);
                }
                // this.loading = false;
            })
        },

        // 现在用的
        onUpdate(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.CAloading = true
                if (this.formCRL.isMode == "2") {
                    this.$UKey.getUkeyData((res) => {
                        if (res != false) {
                            this.idConCount = res.count

                            if (this.idConCount < 1) {
                                this.getCheck()
                                return
                            } else {
                                this.$message.error(
                                    "设备中已存在容器,请重新插入设备！"
                                )
                                this.CAloading = false
                                return
                            }
                        } else {
                            this.CAloading = false
                            return
                        }
                    })
                } else {
                    //   <!-- 将上传的文件放到数据对象中 -->
                    let formData = new FormData()
                    if (this.formCRL.isMode == "0") {
                        if (this.fileList.length != 0) {
                            formData.append("csr", this.fileList[0].raw)
                        } else {
                            this.CAloading = false
                            return this.$message.error("请选择文件!")
                        }
                    } else {
                        formData.append(
                            "public_key_base64",
                            this.formCRL.public_key_base64
                        )
                        formData.append("subject", this.makeSubject())
                        formData.append(
                            "key_algorithm",
                            this.formCRL.key_algorithm
                        )
                    }

                    // formData.append("signer_id", this.formCRL.signer_id);
                    // formData.append("profile_id", this.formCRL.profile_id);
                    formData.append("ca_cert_id", this.formCRL.ca_cert_id)
                    formData.append("request_mode", this.formCRL.request_mode)
                    formData.append("cert_mode", this.formCRL.cert_mode)
                    formData.append(
                        "request_content",
                        this.formCRL.request_content
                    )
                    formData.append("status", "10")
                    // formData.append("keyIndex", this.formCRL.keyIndex);
                    formData.append(
                        "organization_id",
                        this.formCRL.organization_id
                    )
                    // formData.append("pucPassword", this.formCRL.pucPassword);

                    this.$http
                        .post(this.$url.CaRequestAdd, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        })
                        .then((res) => {
                            console.log("222", res)
                            if (res.data.code == 100000) {
                                this.cancel()
                                // const link = document.createElement("a");
                                // try {
                                //     this.$message.success("签发证书成功!");
                                //     let blob = res.data; //如果后台返回的直接是blob对象类型，直接获取数据
                                //     let _fileName =
                                //         res.headers["content-disposition"].split(
                                //             "filename="
                                //         )[1];
                                //     link.style.display = "none";
                                //     const url =
                                //         window.URL ||
                                //         window.webkitURL ||
                                //         window.moxURL;
                                //     link.href = window.URL.createObjectURL(blob);
                                //     link.download = _fileName; //下载的文件名称
                                //     link.click();
                                //     window.URL.revokeObjectURL(url); // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                                // } catch (error) {
                                //     setTimeout(() => {
                                //         this.$message.error("文件下载失败!");
                                //     }, 1000);
                                // }

                                console.log(res, "res")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            // this.reload();
                            this.CAloading = false
                        })
                }
            })
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getKeyList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.pageNow = newPage
            this.getKeyList()
        },
        handleSelectionChange(val) {
            console.log(val, "val")
        },
        getRadio(row) {
            this.keyRadio = row.KeyIndex
        },
        getKeyList() {
            this.loading = true
            this.keyList = []
            this.$commonJs
                .getMethodData(this.$url.GetSM2KeyState, "POST", {
                    // keynum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.keyList = res.data.data
                        this.loading = false
                        console.log(this.keyList, "keyList")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
                })
        },
        // switchClick(data) {
        //     if (data == "0") {
        //         this.formCRL.request_mode = "sub"
        //         this.formCRL.isDouble = "1"
        //         this.formCRL.cert_mode = "dou"
        //     } else {
        //         this.formCRL.request_mode = "csr"
        //     }
        // },
        switchClickDouble(data) {
            if (data == "0") {
                this.formCRL.isDouble = "0"
                this.formCRL.cert_mode = "sig"
            } else {
                this.formCRL.isDouble = "1"
                this.formCRL.cert_mode = "dou"
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
            this.fileList2 = []
        },
        handlePreview(file) {
            console.log(file)
        },
        changeFile(file, fileList) {
            // console.log(fileList, "fileList");
            this.fileList = fileList
            // this.formKey.signature_name = file.name;
            // this.fileLoading = true;
            // this.$commonJs.getLoading();
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        handleSuccess(file) {
            console.log(file, "file")
            // this.$nextTick(() => {
            //     this.$commonJs.getCloseLoading();
            // });
            if (file.code == 100000) {
                this.$message.success("上传成功!")
                this.showFile = true
                // this.$router.push("/CARootCertList");
            }
            // else {
            //     this.fileList = [];
            //     this.$message.error(file.msg);
            //     this.showFile = false;
            // }
            this.loading = false
            return
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-textarea__inner {
    height: 100px !important;
}
.inputWidth {
    width: 50%;
}
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
</style> 

 
