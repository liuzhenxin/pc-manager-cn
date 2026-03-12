<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/CADeviceCertList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <div class="intanle">
            <el-tabs type="border-card" style="padding-bottom:0px;" class="CardClass">
                <el-form ref="formMake" :model="formMake" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6" v-if="mode == 1">
                            <el-form-item label="根证书:" label-width="21%" prop="caCertId">
                                <el-input class="inputwid" v-model="formMake.subject" placeholder="点击右边选择按钮选择所属证书颁发机构" disabled></el-input>
                                <el-button size="mini" @click="getCertListAll" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6" style="">
                            <el-form-item label="证书名称:" label-width="21%" prop="name">
                                <el-input class="inputwid" v-model="formMake.name" placeholder="请输入证书名称" :disabled="isDisable" style="width:60%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6" style=" ">
                            <el-form-item label="通用名:" label-width="21%" prop="common_name">
                                <el-input class="inputwid" v-model="formMake.common_name" placeholder="请输入组织/公司全称(Common Name)" :disabled="isDisable" style="width:60%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="使用者名称:" label-width="21%" prop="org_unit">
                                <el-input class="inputwid" v-model="formMake.org_unit" placeholder="请输入使用者名称" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="组织:" label-width="21%" prop="org">
                                <el-input class="inputwid" v-model="formMake.org" placeholder="请输入所在单位名称(org)" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="城市:" label-width="21%" prop="location">
                                <el-input class="inputwid" v-model="formMake.location" placeholder="请输入所在城市名称(Location)" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="省份:" label-width="21%" prop="state">
                                <el-input class="inputwid" v-model="formMake.state" placeholder="请输入所在省份名称(State)" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="国家/地区:" label-width="21%" prop="country">

                                <!-- <el-input class="inputwid" v-model="formMake.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable"></el-input> -->
                                <el-select class="inputwid" v-model="formMake.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable">
                                    <el-option v-for="item in $commonJs.getCnData()" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12" :offset="6">
                                <el-form-item label="证书类型:" label-width="21%" prop="cert_type">
                                    <el-select v-model="formMake.cert_type" placeholder="请输入证书类型" style="width: 60%" :disabled="isDisable">
                                        <el-option v-for="item in certTypeList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col> -->
                        <el-col :span="12" :offset="6">
                            <el-form-item label="密钥索引:" label-width="21%" prop="key_index">
                                <el-select v-model="formMake.key_index" placeholder="请选择密钥索引" style="width: 60%" :disabled="isDisable">
                                    <el-option v-for="item in keyIndexList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <!-- <el-input class="inputwid" v-model="formMake.key_index" placeholder="点击右边选择按钮选择密钥索引" disabled></el-input> -->
                                <!-- <el-button size="mini" @click="getKeyIndex()" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button> -->
                            </el-form-item>
                            <el-form-item label="私钥访问控制码:" label-width="21%" prop="pucPassword" v-if="mode==1">
                                <el-input class="inputwid" v-model="formMake.pucPassword" type="password" :disabled="isDisable" placeholder="请输入私钥访问控制码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                            <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                            <el-button size="mini" type="primary" @click="onUpdate('formMake','make')" v-if="mode != 2" style="margin-bottom:20px">生成设备证书</el-button>

                        </el-form-item>
                    </el-col>
                </el-form>
            </el-tabs>
            <el-dialog title="选择所属根证书" :visible.sync="certDialogVisible" width="35%">
                <el-row style="margin-top:-30px">
                    <el-col>
                        <div class="downTree">
                            <el-tree :data="caCertList" check-strictly :expand-on-click-node="false" default-expand-all node-key="id" ref="tree" highlight-current :props="certDefaultProps" @check=" (click, checked)=>{handleCheckChange(click, checked)}">
                                <span class=" custom-tree-node" :class="data.class" slot-scope="{node ,data}">
                                    <el-radio v-model="radio" :label="data.id" @change="caCertChange(data)">
                                        <span><i :class="data.icon" style="margin-right:5px"></i>{{ node.label }}
                                        </span>
                                    </el-radio>
                                </span>
                            </el-tree>

                        </div>
                    </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="infoorganization()" size="mini" type="warning">取 消</el-button>
                    <el-button size="mini" type="primary" @click="addCaCert()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        isInit: {
            type: Boolean
        }
    },
    data() {
        return {
            formCRL: {
                id: this.$route.query.RootCertId,
                updateTime: ""
            },
            formCRLRules: {
                updateTime: [
                    {
                        required: true,
                        message: "请输入推迟更新时长(单位:天)",
                        trigger: "blur"
                    }
                ]
            },
            activeName: "add",
            keyRadio: "",
            doubleRadio: "0",
            isEncryption: false,
            keyList: [],
            certDialogVisible: false,
            name: "",
            mode: this.$route.query.mode,
            certId: this.$route.query.id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",
            // offsetApp: 2,
            certList: [],
            isCertList: "",
            isAdmin: true,
            pageNow: 1,
            pageSize: 10,
            fileLoading: false,
            total: 10,
            loading: false,
            fileList: [],
            fileList1: [],
            fileList2: [],
            fileName: [],
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            MyHeader: { Authorization: "" },
            showFile: false,
            fileUploadList: [],
            keyIndexList: [],
            formMake: {
                name: "",
                caCertId: "",
                pucPassword: "",
                // cert_type: "", // 证书型：signature 签名 encrypt 加密
                common_name: "", // 颁发机构名称【证书中的cn】
                country: "", // 国家/地区
                key_index: "", // 密钥索引
                location: "", // 城市
                org: "", // 组织
                org_unit: "", // 使用者名称
                state: "", // 省份
                subject: ""
            },
            rules: {
                pucPassword: [
                    {
                        required: true,
                        message: "请输入私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                key_index: [
                    {
                        required: true,
                        message: "请选择密钥索引",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请输入证书名称",
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
                profile_id: [
                    {
                        required: true,
                        message: "请选择模板",
                        trigger: "blur"
                    }
                ],
                is_double: [
                    {
                        required: true,
                        message: "请选择是否双证",
                        trigger: "blur"
                    }
                ],
                cert_type: [
                    {
                        required: true,
                        message: "请选择证书类型",
                        trigger: "blur"
                    }
                ],
                cert_serial_name: [
                    {
                        required: true,
                        message: "请选择所属证书颁发机构",
                        trigger: "blur"
                    }
                ],
                common_name: [
                    {
                        required: true,
                        message: "请输入组织/公司全称",
                        trigger: "blur"
                    }
                ],
                org_unit: [
                    {
                        required: true,
                        message: "请输入使用者名称",
                        trigger: "blur"
                    }
                ],
                location: [
                    {
                        required: true,
                        message: "请输入所在城市名称",
                        trigger: "blur"
                    }
                ],
                appid: [
                    {
                        required: true,
                        message: "请选择所属CA",
                        trigger: "blur"
                    }
                ],
                state: [
                    {
                        required: true,
                        message: "请输入所在省份名称",
                        trigger: "change"
                    }
                ],

                country: [
                    {
                        required: true,
                        message: "请选择国家/地区",
                        trigger: "blur"
                    }
                ],
                org: [
                    {
                        required: true,
                        message: "请输入所在单位名称",
                        trigger: "blur"
                    }
                ]
            },
            certTypeList: [
                {
                    label: "签名",
                    value: "signature"
                },
                {
                    label: "加密",
                    value: "encrypt"
                }
            ],
            keyTypeList: [
                // {
                //     label: "SHA1WithRSA",
                //     value: "SHA1WithRSA"
                // },
                // {
                //     label: "SHA256WithRSA",
                //     value: "SHA256WithRSA"
                // },
                {
                    label: "SM3WithSM2",
                    value: "SM3WithSM2"
                }
            ],
            caCertList: [],
            rulesKey: {},
            certDefaultProps: {
                children: "children",
                label: "subject"
                // icon-class:"icon"
            },
            defaultProps: {
                children: "children",
                label: "name"
            },
            AppList: [],
            systemTypeList: [],
            ischeckList: [],
            isQianMing: false,
            keyUrl: "",
            isRSA: "",
            keyType1: "",
            keyType2: "",
            dataType: []
        }
    },

    created() {
        this.keyIndexList = this.$commonJs.getKeyIndex()
        if (this.mode != 1) {
            if (this.mode == 3) {
                this.name = "修改设备证书管理"
                this.getCertDetail()
            } else if (this.mode == 2) {
                this.isDisable = true
                this.name = "设备证书管理详情"
                this.getCertDetail()
            }
        } else {
            this.name = "申请设备证书"
        }
    },
    watch: {
        doubleRadio(val) {
            if (val == "1") {
                this.isEncryption = true
            } else {
                this.isEncryption = false
            }
        }
    },
    methods: {
        // 获取详情
        getCertDetail() {
            this.$commonJs.getLoading()
            this.$commonJs
                .getMethodData(this.$url.DeviceCertById, "POST", {
                    id: this.certId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")

                        // org 组织
                        this.formMake = res.data.data
                        // this.getUndefined(
                        //     res.data.attrs.cacert_subject,
                        //     "cert_serial_name"
                        // );
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
        getCertListAll() {
            this.certDialogVisible = true
            this.$commonJs
                .getMethodData(this.$url.CertListAll, "POST")
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.caCertList = res.data.data
                        this.formMake.caCertId = ""
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                    // this.loading = false;
                })
        },
        caCertChange(data) {
            console.log(data, "data")
            this.ischeckList = [data]
        },
        addCaCert() {
            if (this.ischeckList.length < 1) {
                this.$message.error("请选择所属根证书!")
                return false
            } else {
                this.formMake.caCertId = this.ischeckList[0].id
                this.formMake.subject = this.ischeckList[0].subject
                this.certDialogVisible = false
            }
        },
        infoorganization() {
            this.radio = ""
            this.certDialogVisible = false
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
            this.$router.push("/CADeviceCertList")
        },
        handleClick() {},
        onUpdate(formName, type) {
            let url
            // this.$url.GenCsr, "GET", {};
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.$commonJs.getLoading()
                let data
                console.log(data, "data")
                if (this.mode == 1) {
                    let subject = [
                        "CN=" + this.formMake.common_name,
                        "C=" + this.formMake.country,
                        "L=" + this.formMake.location,
                        "O=" + this.formMake.org,
                        "OU=" + this.formMake.org_unit,
                        "ST=" + this.formMake.state
                    ]

                    data = {
                        name: this.formMake.name,
                        // signer_id: this.formMake.signer_id,
                        // profile_id: this.formMake.profile_id,
                        pucPassword: this.formMake.pucPassword,
                        caCertId: this.formMake.caCertId,
                        key_index: this.formMake.key_index, // 密钥索引
                        subject: subject.join(",")
                    }
                    // data = this.$commonJs.getScreenValue(this.formMake);
                    url = this.$url.AddDeviceCertBySelf

                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.cancel()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            console.log(res, "res")
                            this.$commonJs.getCloseLoading()
                        })
                }
            })
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
</style>
