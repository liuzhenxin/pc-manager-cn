<template>
    <div v-loading="CAloading">
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <el-button size="mini" class="el-button1" type="warning" @click="cancel" style="float: right;margin-bottom:15px">返回</el-button>

        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="formCRL" :rules="rulesCRL" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <!-- <el-col :span="12" :offset="6" style="font-size:20px;font-weight:600">证书</el-col> -->
                    <el-col :span="12" :offset="6" style="" v-if="mode=='1'">

                        <!-- <el-form-item label="是否发给UKey:" label-width="21%" prop="isUK">
                            <el-switch v-model="formCRL.isUK" active-value="0" inactive-value="1" @change='switchClick($event)' active-color="#13ce66"></el-switch>
                        </el-form-item> -->
                        <el-form-item label="是否双证:" label-width="21%">
                            <el-switch v-model="formCRL.isDouble" active-value="1" :disabled="isUK" inactive-value="0" @change='switchClickDouble($event)' active-color="#13ce66"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="根证书:" prop="ca_cert_id">
                            <el-select class="inputwid" v-model="formCRL.ca_cert_id" @change="CaChange()" placeholder="请选择CA" :disabled="isDisable">
                                <el-option v-for="item in RootCertList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="签名者:" label-width="21%" prop="signer_id">
                            <el-select style="width:60%" :disabled="CADisabled" v-model="formCRL.signer_id" placeholder="请选择签名者">
                                <el-option v-for="item in signerList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>


                    <el-col :span="12" :offset="6">
                        <el-form-item label="证书模板:" prop="profile_id">
                            <el-select class="inputwid" v-model="formCRL.profile_id" placeholder="请选择证书模板" :disabled="CADisabled">
                                <el-option v-for="item in profileList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="审核批注:" label-width="21%" prop="pass_content">
                            <el-input type="textarea" class="inputwid" v-model="formCRL.pass_content" placeholder="请输入批注" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>

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
                    <!-- <div v-if="formCRL.isUK=='0'">
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
                    <div v-if="formCRL.isUK=='1'">
                        <el-col :span="12" :offset="6" style="font-size:20px;font-weight:600">证书请求</el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="PKCS10:" label-width="21%" prop="fileList">
                                <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed" :on-change="changeFile" :file-list="fileList" :headers="MyHeader" :limit="1" :auto-upload="false" :on-success="handleSuccess">
                                    <el-button slot="trigger" icon="el-icon-plus" plain size="mini" type="primary">选择文件</el-button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </div> -->
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                            <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                            <!-- <el-button size="mini" v-if="mode!=2" type="primary" @click="ceshi('form','CRL')" style="margin-bottom:10px">提交</el-button> -->
                            <el-button size="mini" v-if="mode!=2" type="primary" @click="getUpdata('form')" style="margin-bottom:10px">审核通过</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-dialog title="选择密钥索引" :visible.sync="keyDialogVisible" width="60%">
            <el-row style="margin-top:-30px" class="keyStyle">
                <el-col>
                    <div class="downTree">
                        <el-card>
                            <el-table ref="symmetricTable" v-loading="loading" :data="keyList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="50">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-radio :disabled="scope.row.SDFE_UEK_SM2.uiKeyLen=='0'" style="margin-left:8px" v-model="keyRadio" :label="scope.row.KeyIndex" @change="getRadio(scope.row)">
                                                {{  }}
                                            </el-radio>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                                <el-table-column label="用途">
                                    <template>
                                        <span>加密</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="模长">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.SDFE_UEK_SM2.uiKeyLen=='0'">-</span>
                                        <span v-else>{{scope.row.SDFE_UEK_SM2.uiKeyLen}}</span>
                                    </template>
                                </el-table-column>
                                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                                </div>
                            </el-table>
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoKeyIndex()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addKeyIndex()">确 定</el-button>
            </span>
        </el-dialog>
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
            keyDialogVisible: false,
            MyHeader: { Authorization: "" },
            mode: this.$route.query.mode,
            formCRL: {
                csr: "", // 文件
                signer_id: "", // 签名者
                profile_id: "", // 证书模板id
                ca_cert_id: "", // 根证书id
                organization_id: 1,
                keyIndex: "", // 密钥索引
                isUK: "1",
                pucPassword: "",

                isDouble: "1", // 是否双证
                down_url: "",
                delay_minutes: "",
                common_name: "",
                org: "",
                ou: "",
                country: "",
                st: "",
                location: ""
            },
            placeholder: "点击右边选择按钮选择密钥索引",
            actionUrl: "",
            profileList: [],
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
            UKey: this.$route.query.isUK,
            pageSize: 10,
            total: 0,
            pageNow: 1,
            signerList: [],
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
            isUK: false,
            RowSubject: this.$route.query.RowSubject
        }
    },
    created() {
        this.$UKey.getInit()
        this.$UKey.GetDevices((res) => {
            console.log(res.length)
            var device = null
            device = res[0]
            UBSEncrollAsync.EnumApplication((res) => {
                console.log(res, device, "ooo")
                if (res.success === true) {
                    if (res.data.length == 0) {
                        //         console.log(res.data, "ggg");
                        UBSEncrollAsync.CreateApplication(
                            (res) => {
                                console.log(res, "成功")
                            },
                            device,
                            "APP",
                            "1234567812345678",
                            "123456",
                            0x10
                        )
                    }
                }
            }, device)
        })
        if (this.UKey == "0") {
            this.isUK = true
        }

        if (this.$commonJs.getStorage().organization_id != 1) {
            this.formCRL.organization_id =
                this.$commonJs.getStorage().organization_id
            this.organization_id = this.$commonJs.getStorage().organization_id
        }
        if (this.mode == 1) {
            this.name = "证书审核"
            this.getProfileListAll()
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
        this.getSignerListAll()
    },
    mounted() {},
    methods: {
        getCheck() {
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

            if (subject == null || subject == "" || subject == undefined) {
                this.$message.error("证书主题不能为空!")
                return
            } else {
                this.subjectStr = subject
                this.$refs.PinDialog.modifyFormdialog = true
                this.$refs.PinDialog.modifyForm.PINStr = ""
                // let pin = "12345678";
                // this.MakeCert(this.subjectStr, pin);
                // this.CAloading = true;
                console.log(
                    this.$refs.PinDialog,
                    this.$refs.PinDialog.modifyForm,
                    "this.$refs.PinDialog"
                )
            }
        },
        ceshi() {
            this.$refs.PinDialog.modifyFormdialog = true
            this.$refs.PinDialog.modifyForm.PINStr = ""
        },
        PIN(val) {
            if (val != "") {
                let pin = val
                if (val != "false") {
                    this.getImportData(pin)
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
                                console.log("CreateContainer: " + res.success)
                                console.log("CreateContainer: " + res.data)
                                console.log("devices[0]: " + this.devices[0])
                                console.log("apps[0]: " + apps[0])
                                if (res.success === true) {
                                    UBSEncrollAsync.OpenContainer(
                                        (res) => {
                                            console.log("OpenContainer: " + res)
                                            if (res.success === true) {
                                                handle = res.data
                                                UBSEncrollAsync.CheckPIN(
                                                    (res) => {
                                                        console.log(
                                                            "CheckPIN: " + res
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
                                                                                    UBSEncrollAsync.FreeCertificate(
                                                                                        (
                                                                                            res
                                                                                        ) => {},
                                                                                        handle
                                                                                    )
                                                                                    this.CAloading = false
                                                                                    // this.$commonJs
                                                                                    //     .getMethodData(
                                                                                    //         this
                                                                                    //             .$url
                                                                                    //             .GenCertUK,
                                                                                    //         "POST",
                                                                                    //         {
                                                                                    //             csrString:
                                                                                    //                 pkcs10,
                                                                                    //             signer_id:
                                                                                    //                 this
                                                                                    //                     .formCRL
                                                                                    //                     .signer_id,
                                                                                    //             profile_id:
                                                                                    //                 this
                                                                                    //                     .formCRL
                                                                                    //                     .profile_id,
                                                                                    //             ca_cert_id:
                                                                                    //                 this
                                                                                    //                     .formCRL
                                                                                    //                     .ca_cert_id,

                                                                                    //             isDouble:
                                                                                    //                 this
                                                                                    //                     .formCRL
                                                                                    //                     .isDouble,
                                                                                    //             // keyIndex:
                                                                                    //             //     this
                                                                                    //             //         .formCRL
                                                                                    //             //         .keyIndex,

                                                                                    //             organization_id:
                                                                                    //                 this
                                                                                    //                     .formCRL
                                                                                    //                     .organization_id
                                                                                    //         }
                                                                                    //     )
                                                                                    //     .then(
                                                                                    //         (
                                                                                    //             res
                                                                                    //         ) => {
                                                                                    //             if (
                                                                                    //                 res
                                                                                    //                     .data
                                                                                    //                     .code ==
                                                                                    //                 100000
                                                                                    //             ) {
                                                                                    //                 var cert =
                                                                                    //                     res
                                                                                    //                         .data
                                                                                    //                         .data
                                                                                    //                         .certSig;
                                                                                    //                 var enc_cert =
                                                                                    //                     res
                                                                                    //                         .data
                                                                                    //                         .data
                                                                                    //                         .certEnc;
                                                                                    //                 var enc_key =
                                                                                    //                     res
                                                                                    //                         .data
                                                                                    //                         .data
                                                                                    //                         .privateKeyEnc;
                                                                                    //                 var enc_symm_key =
                                                                                    //                     null;

                                                                                    //                 console.log(
                                                                                    //                     "ImportCertificate cert:" +
                                                                                    //                         res
                                                                                    //                             .data
                                                                                    //                             .data
                                                                                    //                 );
                                                                                    //                 console.log(
                                                                                    //                     "ImportCertificate enc_cert:" +
                                                                                    //                         res
                                                                                    //                             .data
                                                                                    //                             .data
                                                                                    //                             .enc_cert
                                                                                    //                 );
                                                                                    //                 console.log(
                                                                                    //                     "ImportKeyPair enc_key:" +
                                                                                    //                         res
                                                                                    //                             .data
                                                                                    //                             .data
                                                                                    //                             .enc_key
                                                                                    //                 );
                                                                                    //                 UBSEncrollAsync.ImportCertificate(
                                                                                    //                     (
                                                                                    //                         res
                                                                                    //                     ) => {
                                                                                    //                         if (
                                                                                    //                             res.success
                                                                                    //                         ) {
                                                                                    //                             console.log(
                                                                                    //                                 "成功",
                                                                                    //                                 res
                                                                                    //                             );

                                                                                    //                             //安装加密证书
                                                                                    //                             if (
                                                                                    //                                 enc_cert !=
                                                                                    //                                     null &&
                                                                                    //                                 enc_cert !=
                                                                                    //                                     "" &&
                                                                                    //                                 enc_cert !=
                                                                                    //                                     undefined
                                                                                    //                             ) {
                                                                                    //                                 UBSEncrollAsync.ImportCertificate(
                                                                                    //                                     (
                                                                                    //                                         res
                                                                                    //                                     ) => {
                                                                                    //                                         if (
                                                                                    //                                             res.success
                                                                                    //                                         ) {
                                                                                    //                                             UBSEncrollAsync.ImportKeyPair(
                                                                                    //                                                 (
                                                                                    //                                                     res
                                                                                    //                                                 ) => {
                                                                                    //                                                     if (
                                                                                    //                                                         res.success
                                                                                    //                                                     ) {
                                                                                    //                                                         this.$message.success(
                                                                                    //                                                             "签发证书成功!"
                                                                                    //                                                         );
                                                                                    //                                                         UBSEncrollAsync.FreeCertificate(
                                                                                    //                                                             (
                                                                                    //                                                                 res
                                                                                    //                                                             ) => {},
                                                                                    //                                                             handle
                                                                                    //                                                         );

                                                                                    //                                                         this.reload();
                                                                                    //                                                     } else {
                                                                                    //                                                         this.$message.error(
                                                                                    //                                                             "签发证书失败!"
                                                                                    //                                                         );
                                                                                    //                                                         UBSEncrollAsync.FreeCertificate(
                                                                                    //                                                             (
                                                                                    //                                                                 res
                                                                                    //                                                             ) => {},
                                                                                    //                                                             handle
                                                                                    //                                                         );
                                                                                    //                                                         this.CAloading = false;
                                                                                    //                                                     }
                                                                                    //                                                 },
                                                                                    //                                                 handle,
                                                                                    //                                                 enc_key,
                                                                                    //                                                 enc_symm_key,
                                                                                    //                                                 alg
                                                                                    //                                             );
                                                                                    //                                         } else {
                                                                                    //                                             this.$message.error(
                                                                                    //                                                 "签发证书失败!"
                                                                                    //                                             );
                                                                                    //                                             UBSEncrollAsync.FreeCertificate(
                                                                                    //                                                 (
                                                                                    //                                                     res
                                                                                    //                                                 ) => {},
                                                                                    //                                                 handle
                                                                                    //                                             );
                                                                                    //                                             this.CAloading = false;
                                                                                    //                                         }
                                                                                    //                                     },
                                                                                    //                                     handle,
                                                                                    //                                     enc_cert,
                                                                                    //                                     false
                                                                                    //                                 );
                                                                                    //                             } else {
                                                                                    //                                 this.$message.success(
                                                                                    //                                     "签发证书成功!"
                                                                                    //                                 );
                                                                                    //                                 UBSEncrollAsync.FreeCertificate(
                                                                                    //                                     (
                                                                                    //                                         res
                                                                                    //                                     ) => {},
                                                                                    //                                     handle
                                                                                    //                                 );
                                                                                    //                                 this.CAloading = false;
                                                                                    //                             }
                                                                                    //                         } else {
                                                                                    //                             this.$message.error(
                                                                                    //                                 "签发证书失败!"
                                                                                    //                             );
                                                                                    //                             UBSEncrollAsync.FreeCertificate(
                                                                                    //                                 (
                                                                                    //                                     res
                                                                                    //                                 ) => {},
                                                                                    //                                 handle
                                                                                    //                             );
                                                                                    //                             this.CAloading = false;
                                                                                    //                         }
                                                                                    //                     },
                                                                                    //                     handle,
                                                                                    //                     cert,
                                                                                    //                     true
                                                                                    //                 );
                                                                                    //                 //         } else {
                                                                                    //                 //             ns.tip.toast.error(
                                                                                    //                 //                 data.message
                                                                                    //                 //             );
                                                                                    //                 //             UBSEncrollAsync.FreeCertificate(
                                                                                    //                 //                 (
                                                                                    //                 //                     res
                                                                                    //                 //                 ) => {},
                                                                                    //                 //                 handle
                                                                                    //                 //             );
                                                                                    //                 //         }
                                                                                    //                 //     }
                                                                                    //                 // );
                                                                                    //             } else if (
                                                                                    //                 res
                                                                                    //                     .data
                                                                                    //                     .code !=
                                                                                    //                 800000
                                                                                    //             ) {
                                                                                    //                 this.$message.error(
                                                                                    //                     res
                                                                                    //                         .data
                                                                                    //                         .msg
                                                                                    //                 );
                                                                                    //                 UBSEncrollAsync.FreeCertificate(
                                                                                    //                     (
                                                                                    //                         res
                                                                                    //                     ) => {},
                                                                                    //                     handle
                                                                                    //                 );
                                                                                    //                 this.CAloading = false;
                                                                                    //             }
                                                                                    //         }
                                                                                    //     );
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
        },
        getUpdata(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.$commonJs
                    .getMethodData(this.$url.SaveCsrData, "POST", {
                        signer_id: this.formCRL.signer_id,
                        profile_id: this.formCRL.profile_id,
                        ca_cert_id: this.formCRL.ca_cert_id,
                        key_length: this.formCRL.isDouble,
                        id: this.certIssueId
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.$message.success("审核通过!")
                            console.log("ss", res)
                            this.cancel()
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                    })
            })
        },
        getImportData(pin) {
            this.$UKey.getConname((res) => {
                var conname = res.conname
                let alg = "sm2"
                this.$UKey.GetDevices((res) => {
                    console.log(res.length)
                    var device = null
                    device = res[0]
                    UBSEncrollAsync.EnumApplication((res) => {
                        if (res.success === true) {
                            UBSEncrollAsync.OpenContainer(
                                (res) => {
                                    console.log("OpenContainer: ", res)
                                    if (res.success === true) {
                                        var handle = res.data
                                        UBSEncrollAsync.CheckPIN(
                                            (res) => {
                                                console.log("CheckPIN: " + res)
                                                if (res.success) {
                                                    this.$commonJs
                                                        .getMethodData(
                                                            this.$url
                                                                .RaCertOutCertCsr,
                                                            "POST",
                                                            {
                                                                csr_id: this
                                                                    .certIssueId,
                                                                organization_id:
                                                                    this.formCRL
                                                                        .organization_id
                                                            }
                                                        )
                                                        .then((res) => {
                                                            if (
                                                                res.data.code ==
                                                                100000
                                                            ) {
                                                                var certData =
                                                                    res.data
                                                                        .data
                                                                this.$commonJs
                                                                    .getMethodData(
                                                                        this
                                                                            .$url
                                                                            .GenCertUK,
                                                                        "POST",
                                                                        {
                                                                            csrString:
                                                                                certData.remark,
                                                                            signer_id:
                                                                                certData.signer_id,
                                                                            profile_id:
                                                                                certData.profile_id,
                                                                            ca_cert_id:
                                                                                certData.ca_cert_id,
                                                                            isDouble:
                                                                                certData.key_length,
                                                                            organization_id:
                                                                                certData.organization_id,
                                                                            isUK: certData.common_name
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
                                                                                var cert =
                                                                                    res
                                                                                        .data
                                                                                        .data
                                                                                        .certSig
                                                                                var enc_cert =
                                                                                    res
                                                                                        .data
                                                                                        .data
                                                                                        .certEnc
                                                                                var enc_key =
                                                                                    res
                                                                                        .data
                                                                                        .data
                                                                                        .privateKeyEnc
                                                                                var enc_symm_key =
                                                                                    null

                                                                                console.log(
                                                                                    "ImportCertificate cert:" +
                                                                                        res
                                                                                            .data
                                                                                            .data
                                                                                )
                                                                                console.log(
                                                                                    "ImportCertificate enc_cert:" +
                                                                                        res
                                                                                            .data
                                                                                            .data
                                                                                            .enc_cert
                                                                                )
                                                                                console.log(
                                                                                    "ImportKeyPair enc_key:" +
                                                                                        res
                                                                                            .data
                                                                                            .data
                                                                                            .enc_key
                                                                                )
                                                                                UBSEncrollAsync.ImportCertificate(
                                                                                    (
                                                                                        res
                                                                                    ) => {
                                                                                        if (
                                                                                            res.success
                                                                                        ) {
                                                                                            console.log(
                                                                                                "成功",
                                                                                                res
                                                                                            )

                                                                                            //安装加密证书
                                                                                            if (
                                                                                                enc_cert !=
                                                                                                    null &&
                                                                                                enc_cert !=
                                                                                                    "" &&
                                                                                                enc_cert !=
                                                                                                    undefined
                                                                                            ) {
                                                                                                UBSEncrollAsync.ImportCertificate(
                                                                                                    (
                                                                                                        res
                                                                                                    ) => {
                                                                                                        if (
                                                                                                            res.success
                                                                                                        ) {
                                                                                                            debugger
                                                                                                            UBSEncrollAsync.ImportKeyPair(
                                                                                                                (
                                                                                                                    res
                                                                                                                ) => {
                                                                                                                    if (
                                                                                                                        res.success
                                                                                                                    ) {
                                                                                                                        this.$commonJs
                                                                                                                            .getMethodData(
                                                                                                                                this
                                                                                                                                    .$url
                                                                                                                                    .RaCertIsCsrtoCert,
                                                                                                                                "POST",
                                                                                                                                {
                                                                                                                                    organization_id:
                                                                                                                                        this
                                                                                                                                            .formCRL
                                                                                                                                            .organization_id,
                                                                                                                                    rv: true,
                                                                                                                                    subject:
                                                                                                                                        this
                                                                                                                                            .RowSubject
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
                                                                                                                                            "签发证书成功!"
                                                                                                                                        )
                                                                                                                                        UBSEncrollAsync.FreeCertificate(
                                                                                                                                            (
                                                                                                                                                res
                                                                                                                                            ) => {},
                                                                                                                                            handle
                                                                                                                                        )
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

                                                                                                                                        UBSEncrollAsync.FreeCertificate(
                                                                                                                                            (
                                                                                                                                                res
                                                                                                                                            ) => {},
                                                                                                                                            handle
                                                                                                                                        )
                                                                                                                                        this.CAloading = false
                                                                                                                                    }
                                                                                                                                    console.log(
                                                                                                                                        res,
                                                                                                                                        "res"
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            )
                                                                                                                    } else {
                                                                                                                        this.$message.error(
                                                                                                                            "签发证书失败!"
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
                                                                                                                enc_key,
                                                                                                                enc_symm_key,
                                                                                                                alg
                                                                                                            )
                                                                                                        } else {
                                                                                                            this.$message.error(
                                                                                                                "签发证书失败!"
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
                                                                                                    enc_cert,
                                                                                                    false
                                                                                                )
                                                                                            } else {
                                                                                                this.$message.success(
                                                                                                    "签发证书成功!"
                                                                                                )
                                                                                                UBSEncrollAsync.FreeCertificate(
                                                                                                    (
                                                                                                        res
                                                                                                    ) => {},
                                                                                                    handle
                                                                                                )
                                                                                                this.CAloading = false
                                                                                            }
                                                                                        } else {
                                                                                            this.$message.error(
                                                                                                "签发证书失败!"
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
                                                                                    cert,
                                                                                    true
                                                                                )
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
                                                                                UBSEncrollAsync.FreeCertificate(
                                                                                    (
                                                                                        res
                                                                                    ) => {},
                                                                                    handle
                                                                                )
                                                                                this.CAloading = false
                                                                            }
                                                                        }
                                                                    )
                                                            } else if (
                                                                res.data.code !=
                                                                800000
                                                            ) {
                                                                this.$message.error(
                                                                    res.data.msg
                                                                )
                                                                UBSEncrollAsync.FreeCertificate(
                                                                    (res) => {},
                                                                    handle
                                                                )
                                                                this.CAloading = false
                                                            }
                                                        })
                                                } else {
                                                    this.$message.error(
                                                        "口令验证失败!"
                                                    )
                                                    UBSEncrollAsync.FreeCertificate(
                                                        (res) => {},
                                                        handle
                                                    )
                                                }
                                            },
                                            handle,
                                            pin
                                        )
                                    }
                                },
                                device,
                                res.data[0],
                                conname
                            )
                        }
                    }, device)

                    console.log(res, "res", " this.certData", this.certData)
                    this.loading = false
                })
            })
        },
        GetDevices(cb) {
            console.log("GetDevices")
            var datas = []
            this.devices = []
            UBSEncrollAsync.Lookup((res) => {
                if (res.success === true) {
                    console.log(res.data)
                    this.devices = res.data
                    if (this.devices.length > 1) {
                        for (var i = 0; i < this.devices.length; i++) {
                            this.GetDeviceInfo((res) => {
                                console.log(res)
                                datas.push(res)
                            }, this.devices[i])
                        }
                        var timer = setInterval(function () {
                            if (datas.length == this.devices.length) {
                                cb(datas)
                                clearInterval(timer)
                            }
                        }, 1000)
                    } else {
                        datas = res.data
                        cb(datas)
                    }
                } else {
                    cb(datas)
                }
            })
        },
        GetDeviceInfo(cb, dev) {
            UBSEncrollAsync.GetDeviceInfo((res) => {
                if (res.success === true) {
                    //var tmp = {"id":res.data.SerialNumber,"Label":res.data.Label};
                    var myMap = {} //对象
                    myMap["id"] = res.data.SerialNumber
                    myMap["Label"] = res.data.Label
                    cb(myMap)
                }
            }, dev)
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
                        this.getProfileListAll()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
                })
        },
        cancel() {
            this.$router.push("/CertReviewList")
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
        // 获取签名者
        getSignerListAll(data) {
            this.getListAll(
                this.$url.SignerListAll,
                {
                    organization_id: this.organization_id
                },
                "name",
                "id",
                "signerList"
            )
        },
        // 获取模板
        getProfileListAll(data) {
            this.getListAll(
                this.$url.CertProfileList,
                {
                    cert_id: this.formCRL.ca_cert_id
                },
                "name",
                "id",
                "profileList",
                data
            )
        },
        getListAll(url, data, label, value, type, ischange) {
            let list = []
            this.$commonJs.getMethodData(url, "POST", data).then((res) => {
                if (res.data.code == 100000) {
                    res.data.data.forEach((element) => {
                        if (type == "profileList") {
                            list.push({
                                label: element.caProfile[label],
                                value: element.caProfile[value]
                            })
                        } else {
                            list.push({
                                label: element[label],
                                value: element[value]
                            })
                        }
                    })

                    // if (this.RootCertList.length != 0) {
                    //     this.form.ca_cert_id = this.RootCertList[0].value;
                    // }
                    if (type == "signerList") {
                        this.signerList = list
                    }
                    if (type == "RootCertList") {
                        this.RootCertList = list
                        console.log(this.RootCertList, "RootCertList")
                    }
                    if (type == "profileList") {
                        this.profileList = list
                        if (ischange == "change") {
                            if (this.profileList.length != 0) {
                                this.formCRL.profile_id =
                                    this.profileList[0].value
                            }
                        }
                    }

                    console.log(list, this.signerList, "this.certList")
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
                if (this.UKey == "0") {
                    this.$UKey.getUkeyData((res) => {
                        console.log(res, "pppp")
                        if (res != false) {
                            this.idConCount = res.count
                            console.log(res, this.idConCount, "dfff")

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
                    if (this.fileList.length != 0) {
                        formData.append("csrFile", this.fileList[0].raw)

                        // this.formCRL.csr = this.fileList[0].raw;
                    } else {
                        this.CAloading = false
                        return this.$message.error("请选择文件!")
                    }

                    formData.append("signer_id", this.formCRL.signer_id)
                    formData.append("profile_id", this.formCRL.profile_id)
                    formData.append("ca_cert_id", this.formCRL.ca_cert_id)
                    // formData.append("isUK", this.formCRL.isUK);
                    formData.append("isDouble", this.formCRL.isDouble)
                    // formData.append("keyIndex", this.formCRL.keyIndex);
                    formData.append(
                        "organization_id",
                        this.formCRL.organization_id
                    )
                    // formData.append("pucPassword", this.formCRL.pucPassword);

                    console.log(
                        this.fileList,
                        this.fileList[0].raw,
                        formData,
                        this.formCRL,
                        "upload"
                    )

                    this.$http
                        .post(this.$url.CertIssueGenCert, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            },
                            responseType: "blob"
                        })
                        .then((res) => {
                            console.log("222", res)
                            // if (res.data.code == 100000) {
                            // this.cancel();
                            const link = document.createElement("a")
                            try {
                                this.$message.success("签发证书成功!")
                                let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                                let _fileName =
                                    res.headers["content-disposition"].split(
                                        "filename="
                                    )[1]
                                link.style.display = "none"
                                const url =
                                    window.URL ||
                                    window.webkitURL ||
                                    window.moxURL
                                link.href = window.URL.createObjectURL(blob)
                                link.download = _fileName //下载的文件名称
                                link.click()
                                window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                            } catch (error) {
                                setTimeout(() => {
                                    this.$message.error("文件下载失败!")
                                }, 1000)
                            }

                            // console.log(res, "res");
                            // } else if (res.data.code != 800000) {
                            //     this.$message.error(res.data.msg);
                            // }
                            this.reload()
                            this.CAloading = false
                        })
                }
            })
        },
        // onUpdate(formName) {
        //     if (this.formCRL.isUK == "0") {
        //         this.getCheck();
        //     }

        // },
        CaChange(data) {
            if (data != "") {
                this.CADisabled = false
                // debugger;
                this.getProfileListAll("change")
                if (this.signerList.length != 0) {
                    this.formCRL.signer_id = this.signerList[0].value
                }
            }
        },
        infoKeyIndex() {
            this.radio = ""
            this.keyDialogVisible = false
        },
        addKeyIndex() {
            this.keyDialogVisible = false
            this.formCRL.keyIndex = this.keyRadio
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
        getKeyIndex() {
            this.keyDialogVisible = true
            // this.$commonJs.deviceConfGet().then((res) => {
            //     this.total = res.data.data.sm2_key_count;
            // });
            // this.pageSize = 5;
            if (this.formCRL.keyIndex == "") {
                this.keyRadio = ""
            }
            this.getKeyList()
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
        switchClick(data) {
            if (data == "0") {
                this.isUK = true
                this.formCRL.isDouble = "1"
            } else {
                this.isUK = false
            }
            console.log(data, "switchClick")
        },
        switchClickDouble(data) {
            console.log(data, "switchClick")
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

 
