<template>
    <div v-loading="CAloading">
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <el-button size="mini" class="el-button1" type="warning" @click="cancel" style="float: right;margin-bottom:15px">返回</el-button>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="formCRL" :rules="rulesCRL" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="font-size:20px;font-weight:600">证书</el-col>
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

                        <!-- <el-form-item label="私钥访问控制码:" label-width="21%" prop="pucPassword">
                            <el-input class="inputwid" v-model="formCRL.pucPassword" type="password" :disabled="isDisable" placeholder="请输入私钥访问控制码"></el-input>
                        </el-form-item> -->
                        <el-form-item label="PFX证书口令:" label-width="21%" prop="pw">
                            <el-input class="inputwid" v-model="formCRL.pw" type="password" :disabled="isDisable" placeholder="请输入PFX证书口令"></el-input>
                        </el-form-item>
                    </el-col>


                    <div>
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
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                            <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                            <el-button size="mini" v-if="mode!=2" type="primary" @click="onUpdate('form','CRL')" style="margin-bottom:10px">提交</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <!-- <PinList ref="PinDialog" @PIN="PIN"></PinList> -->
    </div>
</template>
<script>
import { UBSEncrollAsync } from "../../assets/js/UBSEnrollAsync";
import { JKunitrust } from "../../assets/js/JKunitrust";
import PinList from "./PinList.vue";
export default {
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

                pucPassword: "",
                pw: "",

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
                pw: [
                    {
                        required: true,
                        message: "请输入PFX证书口令",
                        trigger: "blur"
                    }
                ],
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
            idConCount: 0
        };
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.formCRL.organization_id =
                this.$commonJs.getStorage().organization_id;
            this.organization_id = this.$commonJs.getStorage().organization_id;
        }
        if (this.mode == 10) {
            this.name = "新增签发证书";
        } else {
            this.getCertIssueDetail();
        }
        this.getRootListAll();
        this.getSignerListAll();
        this.getProfileListAll();
    },
    mounted() {},
    methods: {
        getCheck() {
            let subject = "";
            let C = this.formCRL.country;
            if (C != null && C != "" && C != undefined) {
                subject = subject + "C=" + C;
            } else {
                this.$message.error("国家不能为空!");
                return;
            }
            let ST = this.formCRL.st;
            if (ST != null && ST != "" && ST != undefined) {
                subject = subject + ",ST=" + ST;
            }
            let L = this.formCRL.location;
            if (L != null && L != "" && L != undefined) {
                subject = subject + ",L=" + L;
            }
            let OU = this.formCRL.ou;
            if (OU != null && OU != "" && OU != undefined) {
                subject = subject + ",OU=" + OU;
            }
            let O = this.formCRL.org;
            if (O != null && O != "" && O != undefined) {
                subject = subject + ",O=" + O;
            }
            let CN = this.formCRL.common_name;
            if (CN != null && CN != "" && CN != undefined) {
                subject = subject + ",CN=" + CN;
            } else {
                this.$message.error("通用名称不能为空!");
                return;
            }

            if (subject == null || subject == "" || subject == undefined) {
                this.$message.error("证书主题不能为空!");
                return;
            } else {
                this.subjectStr = subject;
            }
        },

        // 获取详情
        getCertIssueDetail() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.CertIssueGetById, "POST", {
                    id: this.certIssueId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.formCRL = res.data.data;
                        this.formCRL.keyIndex = res.data.data.key_index;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.$commonJs.getCloseLoading();
                });
        },
        cancel() {
            this.$router.push("/CaCertList");
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
            );
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
            );
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
            );
        },
        getListAll(url, data, label, value, type, ischange) {
            let list = [];
            this.$commonJs.getMethodData(url, "POST", data).then((res) => {
                if (res.data.code == 100000) {
                    res.data.data.forEach((element) => {
                        if (type == "profileList") {
                            list.push({
                                label: element.caProfile[label],
                                value: element.caProfile[value]
                            });
                        } else {
                            list.push({
                                label: element[label],
                                value: element[value]
                            });
                        }
                    });

                    // if (this.RootCertList.length != 0) {
                    //     this.form.ca_cert_id = this.RootCertList[0].value;
                    // }
                    if (type == "signerList") {
                        this.signerList = list;
                    }
                    if (type == "RootCertList") {
                        this.RootCertList = list;
                        console.log(this.RootCertList, "RootCertList");
                    }
                    if (type == "profileList") {
                        this.profileList = list;
                        if (ischange == "change") {
                            if (this.profileList.length != 0) {
                                this.formCRL.profile_id =
                                    this.profileList[0].value;
                            }
                        }
                    }

                    console.log(list, this.signerList, "this.certList");
                } else if (res.data.code != 800000) {
                    // this.$message.error(res.data.msg);
                }
                // this.loading = false;
            });
        },
        // PIN(val) {
        //     if (val != "") {
        //         let pin = val;
        //         if (val != "false") {
        //             debugger;
        //             this.MakeCert(this.subjectStr, pin);
        //         } else {
        //             this.CAloading = false;
        //         }
        //     }
        // },
        // 现在用的
        onUpdate(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                this.CAloading = true;

                //   <!-- 将上传的文件放到数据对象中 -->

                let formData = new FormData();
                this.getCheck();
                formData.append("signer_id", this.formCRL.signer_id);
                formData.append("profile_id", this.formCRL.profile_id);
                formData.append("ca_cert_id", this.formCRL.ca_cert_id);
                formData.append(
                    "organization_id",
                    this.formCRL.organization_id
                );
                formData.append("pucPassword", this.formCRL.pucPassword);
                formData.append("pw", this.formCRL.pw);
                formData.append("subject", this.subjectStr);

                console.log(
                    this.fileList,
                    // this.fileList[0].raw,
                    formData,
                    this.formCRL,
                    "upload"
                );

                this.$http
                    .post(this.$url.GenPfxCert, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })
                    .then((res) => {
                        console.log("222", res);
                        if (res.data.code == 100000) {
                            this.$message.success("签发证书成功!");
                            this.cancel();
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg);
                        }
                        this.CAloading = false;
                    });
            });
        },

        CaChange(data) {
            if (data != "") {
                this.CADisabled = false;
                // debugger;
                this.getProfileListAll("change");
                if (this.signerList.length != 0) {
                    this.formCRL.signer_id = this.signerList[0].value;
                }
            }
        },

        handleSelectionChange(val) {
            console.log(val, "val");
        },

        getRadio(row) {
            this.keyRadio = row.KeyIndex;
        }
    }
};
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

 
