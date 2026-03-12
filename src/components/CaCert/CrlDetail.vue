<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <!-- <router-link :to="{ path: '/CrlList' }"> -->
            <el-button size="mini" @click="cancel" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            <!-- </router-link> -->
        </el-card>
        <el-card class="intanle">
            <div v-if="mode!=5">
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

                        <el-col :span="12" :offset="5" style="font-size:20px;font-weight:600" v-if="mode==2">根证书</el-col>
                        <!-- <el-col :span="12" :offset="6" v-if=" $commonJs.getStorage().isAdmin == true">
                            <el-form-item label="组织结构:" label-width="21%" prop="crl_no">
                                <el-input class="inputwid" v-model="organizationFatherName" placeholder="请输入组织结构" disabled></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="20" :offset="3" v-if=" $commonJs.getStorage().isAdmin == true">
                            <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                                <addOrg style="margin-left:20px;width:1680px" :isDisable="isDisable" @organization_id="organization_id" :organizationId="organizationId" :detail="1"></addOrg>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" :offset="6">
                            <el-form-item label="根证书:" label-width="21%" prop="ca_cert_id">
                                <el-select style="width:60%" :disabled="isCrl" v-model="form.ca_cert_id " placeholder="请选择根证书">
                                    <el-option v-for="item in RootCertList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12" :offset="6">
                            <el-form-item label="签名者:" label-width="21%" prop="signer_id">
                                <el-select style="width:60%" :disabled="isDisable" v-model="form.signer_id" placeholder="请选择签名者">
                                    <el-option v-for="item in signerList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12" :offset="6" v-if="mode!=1">
                            <el-form-item label="CRL编号:" label-width="21%" prop="crl_no">
                                <el-input class="inputwid" v-model="form.crl_no" placeholder="请输入CRL编号" disabled></el-input>
                            </el-form-item>
                        </el-col>

                        <!-- </div> -->
                        <el-col :span="12" :offset="6">
                            <el-form-item label="当前更新时间:" label-width="21%" prop="thisupdates">
                                <el-date-picker v-model="form.thisupdates" type="datetime" :disabled="isDisable1" style="width: 60%" placeholder="选择当前更新时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="下次更新时间:" label-width="21%" prop="nextupdates">
                                <el-date-picker v-model="form.nextupdates" type="datetime" :disabled="isDisable1" style="width: 60%" placeholder="选择下次更新时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="发布地址:" label-width="21%" prop="">
                                <el-input class="inputwid" v-model="form.release_url" placeholder="请输入发布地址" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <div v-if="mode == 2">
                            <el-col :span="12" :offset="5" style="font-size:20px;font-weight:600;margin-top:30px;margin-bottom:30px">吊销证书</el-col>
                            <el-table style="margin-left:20%;width:60%" ref="multipleTable" v-loading="certLoading" :data="certCrlData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                                <el-table-column label="吊销证书" prop="cerIssue.serial_number"></el-table-column>
                                <el-table-column label="吊销时间" prop="reDate"></el-table-column>
                                <el-table-column label="吊销原因" prop="reason">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.reason=='0'">证书已被吊销</span>
                                        <span v-if="scope.row.reason=='1'">证书使用者的私钥已被泄露,仅适用于结束实体证书</span>
                                        <span v-if="scope.row.reason=='2'">证书使用者的私钥已被泄露,仅适用于证书颁发机构(CA)证书</span>
                                        <span v-if="scope.row.reason=='3'">受试者的姓名或其他信息已更改</span>
                                        <span v-if="scope.row.reason=='4'">证书已被取代</span>
                                        <span v-if="scope.row.reason=='5'">不再需要证书</span>
                                        <span v-if="scope.row.reason=='6'">证书已被搁置</span>
                                        <span v-if="scope.row.reason=='7'">未使用</span>
                                        <span v-if="scope.row.reason=='8'">证书以前被保留应从CRL中删除,它用于增量CRL</span>
                                        <span v-if="scope.row.reason=='9'">证书已被撤回</span>
                                        <span v-if="scope.row.reason=='10'">证书使用者的私钥已被泄露,仅适用于授权属性(AA)证书</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" @click="cancel" type="warning" v-if="mode == 3" style="margin-bottom:10px">取消</el-button>
                                <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>
            <div v-if="mode == 5 ">
                <el-form ref="certForm" :model="certForm" :rules="certRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="吊销证书:" label-width="21%" prop="common_name">
                                <el-input style="cursor:pointer" disabled class="inputwid" v-model="certForm.common_name" placeholder="请选择吊销证书"></el-input>
                                <!-- <el-button @click.stop.native="">选择</el-button> -->
                                <el-button size="mini" @click="getCertSn('certForm')" style="margin-left:3%;" type="primary" icon="el-icon-plus">选择</el-button>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="吊销原因:" label-width="21%" prop="reason">
                                <el-select style="width:60%" v-model="certForm.reason" placeholder="请选择吊销原因">
                                    <el-option v-for="item in CaCertList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="吊销时间:" label-width="21%" prop="revokedates">
                                <el-date-picker v-model="certForm.revokedates" type="datetime" style="width: 60%" placeholder="选择吊销时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                            <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                            <el-button size="mini" type="primary" @click="onUpdate('certForm')" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
        </el-card>
        <el-dialog title="选择吊销证书" :visible.sync="certDialogVisible" width="60%">
            <el-row style="margin-top:-30px">
                <el-col>
                    <div class="downTree">
                        <el-card style="padding-bottom:15px">
                            <el-table ref="symmetricTable" @row-click="(row,column,e)=>choiceClick(row)" v-loading="loading" :data="certList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="50">
                                    <template slot-scope="scope">
                                        <el-radio style="margin-left:8px" v-model="certRadio" :label="scope.row.serial_number" @change="getRadio(scope.row)">
                                            {{  }}
                                        </el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column label="证书名称" prop="common_name">
                                    <!-- <template slot-scope="scope"  >
                                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">{{scope.row.fullname}}</span>
                                    </template> -->
                                </el-table-column>
                                <el-table-column label="证书序列号" prop="serial_number"></el-table-column>
                                <!-- <el-table-column label="联系方式" prop="tel"></el-table-column>
                                <el-table-column label="账号" prop="username"></el-table-column> -->
                                <!-- <el-table-column label="类型" prop="type">
                                    <template slot-scope="scope">
                                        <span v-if="scope.type==0">超级管理员</span>
                                        <span v-else-if="scope.type==1">系统用户</span>
                                        <span v-else>普通用户</span>
                                    </template>
                                </el-table-column> -->
                                <!-- <el-table-column label="创建时间" prop="create_time"></el-table-column> -->
                                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                                </div>
                            </el-table>
                            <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination> -->
                        </el-card>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoCert()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addCert()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue";
export default {
    inject: ["reload"],
    components: { addOrg },
    data() {
        return {
            name: "",
            certRadio: "",
            loading: false,
            certLoading: false,
            mode: this.$route.query.mode,
            CrlId: this.$route.query.id,
            type: this.$route.query.type,
            caCertId: this.$route.query.ca_cert_id,
            RootCertId: this.$route.query.RootCertId,
            organizationIdCert: this.$route.query.organization_id,
            isDisable: false,
            isDisable1: false,
            certDialogVisible: false,
            radio: "",
            certList: [
                {
                    fullname: "555"
                }
            ],
            isCrl: false,
            certCrlData: [],
            RootCertList: [],
            CaCertList: [
                {
                    label: "证书已被吊销",
                    value: "0"
                },
                {
                    label: "证书使用者的私钥已被泄露,仅适用于结束实体证书",
                    value: "1"
                },
                {
                    label: "证书使用者的私钥已被泄露,仅适用于证书颁发机构(CA)证书",
                    value: "2"
                },
                {
                    label: "受试者的姓名或其他信息已更改",
                    value: "3"
                },
                {
                    label: "证书已被取代",
                    value: "4"
                },
                {
                    label: "不再需要证书",
                    value: "5"
                },
                {
                    label: "证书已被搁置",
                    value: "6"
                },
                {
                    label: "未使用",
                    value: "7"
                },
                {
                    label: "证书以前被保留应从CRL中删除,它用于增量CRL",
                    value: "8"
                },
                {
                    label: "证书已被撤回",
                    value: "9"
                },
                {
                    label: "证书使用者的私钥已被泄露,仅适用于授权属性(AA)证书",
                    value: "10"
                }
            ],
            signerList: [],
            form: {
                id: "",
                ca_cert_id: "",
                signer_id: "",
                thisupdates: "",
                nextupdates: "",
                release_url: "",
                crl_no: "",
                organization_id: ""
            },
            organizationFatherName: "",
            rules: {
                release_url: [
                    {
                        required: true,
                        message: "请输入发布地址",
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
                ca_cert_id: [
                    {
                        required: true,
                        message: "请选择根证书",
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
                thisupdates: [
                    {
                        required: true,
                        message: "请选择本次更新时间",
                        trigger: "blur"
                    }
                ],
                nextupdates: [
                    {
                        required: true,
                        message: "请选择下次更新时间",
                        trigger: "blur"
                    }
                ]
            },
            certForm: {
                reason: "",
                serial_number_in_req: "",
                common_name: "",
                revokedates: "",
                id: ""
            },
            certRules: {
                reason: [
                    {
                        required: true,
                        message: "请选择吊销原因",
                        trigger: "blur"
                    }
                ],
                common_name: [
                    {
                        required: true,
                        message: "请选择吊销证书",
                        trigger: "blur"
                    }
                ],
                revokedates: [
                    {
                        required: true,
                        message: "请选择吊销时间",
                        trigger: "blur"
                    }
                ]
            },
            organizationId: 0
        };
    },
    watch: {
        // "certForm.common_name"(val) {
        //     console.log(val, "pppp");
        //     if (val != "") {
        //         this.$refs.form.clearValidate("common_name");
        //     }
        // }
    },

    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
            this.getSignerListAll(this.form.organization_id);
            this.getRootListAll(this.form.organization_id);
        }

        if (this.mode != 1) {
            this.getCrlDetail();
            this.isDisable1 = true;
            if (this.mode == 3) {
                this.name = "修改CRL";
                this.isCrl = true;
            } else {
                this.isDisable = true;
                this.isCrl = true;
                this.name = "CRL详情";
            }
        } else {
            this.name = "新增CRL";
        }
        if (this.mode == 1) {
            this.caCertId = 0;
            if (this.type == "crl") {
                this.getOrganizationList();
                this.getRootListAll(this.organizationIdCert);
                this.isCrl = true;
                this.form.ca_cert_id = this.RootCertId;
                this.getSignerListAll(this.organizationIdCert);
            }
        }
        this.getCaCertList();
        if (this.mode != 5) {
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
        } else {
            this.$nextTick(() => {
                this.$refs.certForm.resetFields();
            });
            this.name = "吊销证书";
        }
    },
    methods: {
        // 获取详情
        getCrlDetail() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.GetCrlById, "POST", {
                    id: this.CrlId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.organizationId = res.data.data.organization_id;
                        this.form = res.data.data;
                        this.certCrlData = res.data.attrs.list;
                        // this.certForm.common_name = "";
                        this.getSignerListAll(this.form.organization_id);
                        this.getRootListAll(this.form.organization_id);
                        console.log(res, "this.certForm.common_name");
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                });
        },
        getOrganizationList(type) {
            this.$commonJs
                .getMethodData(this.$url.GetOrganizationList, "POST", {
                    status: ""
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.organizationList = JSON.parse(res.data.data);
                        let data = this.organizationList.filter((item) => {
                            return this.organizationIdCert == item.id;
                        });
                        console.log(data, "oo");
                        this.organizationFatherName = data[0].name;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    console.log(res, "GetOrganizationList");
                });
        },
        getSignerListAll(data) {
            this.signerList = [];
            this.$commonJs
                .getMethodData(this.$url.SignerListAll, "POST", {
                    organization_id: this.form.organization_id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        res.data.data.forEach((element) => {
                            this.signerList.push({
                                label: element.name,
                                value: element.id
                            });
                        });
                        if (this.signerList.length != 0) {
                            this.form.signer_id = this.signerList[0].value;
                        }
                        console.log(this.certList, "this.certList");
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                    // this.loading = false;
                });
        },
        getRootListAll(data) {
            this.RootCertList = [];
            this.$commonJs
                .getMethodData(this.$url.CertListAll, "POST", {
                    organization_id: this.form.organization_id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        res.data.data.forEach((element) => {
                            this.RootCertList.push({
                                label: element.name,
                                value: element.id
                            });
                        });
                        if (this.RootCertList.length != 0) {
                            this.form.ca_cert_id = this.RootCertList[0].value;
                        }
                        console.log(this.certList, "this.certList");
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                    // this.loading = false;
                });
        },
        getCaCertList() {
            this.$commonJs
                .getMethodData(this.$url.CertIssueList, "POST", {
                    id: this.caCertId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.certList = res.data.data;
                        console.log(this.certList, "this.certList");
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                    // this.loading = false;
                });
        },

        organization_id(val) {
            this.form.organization_id = val;
            this.getSignerListAll(val);
            this.getRootListAll(val);
        },
        cancel() {
            if (this.type == "crl") {
                this.$router.push("/CARootCertList");
            } else {
                this.$router.push("/CrlList");
            }
        },
        getCertSn(data) {
            this.certDialogVisible = true;
        },
        getRadio(row) {
            console.log(row, "row选择");
            this.certForm.serial_number_in_req = "ppp";
        },
        handleSelectionChange(val) {
            console.log(val, "val");
        },
        infoCert() {
            this.certDialogVisible = false;
            this.certRadio = "";
        },
        addCert() {
            if (this.certRadio == "") {
                return this.$message.error("请选择吊销证书!");
            } else {
                // debugger;
                this.certDialogVisible = false;
                this.certForm.serial_number_in_req = this.certRadio;
                this.certForm.common_name = this.currentSelectItem.common_name;
                this.certForm.common_name = "88";
                console.log(
                    this.certRadio,
                    this.certForm.common_name,
                    this.certForm.serial_number_in_req,
                    "this.certForm.serial_number_in_req"
                );
            }
        },
        choiceClick(row) {
            console.log(row);
            this.certRadio = row.serial_number;
            this.currentSelectItem = row;
        },
        onUpdate(formName) {
            let url;
            // debugger;
            console.log(this.form, this.$refs.form, "ppppppp");
            // if (this.certForm.common_name != "") {
            //     this.$refs.form.clearValidate("common_name");
            // }
            // this.form.thisupdates = this.$commonJs.dateTimeFormatter(
            //     this.form.thisupdates
            // );
            // this.form.nextupdates = this.$commonJs.dateTimeFormatter(
            //     this.form.nextupdates
            // );

            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let dataForm;
                if (this.mode != 5) {
                    // dataForm = this.$commonJs.getScreenValue(this.form);
                    dataForm = {
                        id: this.form.id,
                        ca_cert_id: this.form.ca_cert_id,
                        signer_id: this.form.signer_id,
                        thisdate: this.form.thisupdates,
                        nextdate: this.form.nextupdates,
                        release_url: this.form.release_url,
                        crl_no: this.form.crl_no,
                        organization_id: this.form.organization_id
                    };
                    console.log(dataForm, "data");
                }

                if (this.mode == 1) {
                    if (this.type != "crl") {
                        url = this.$url.AddCrl;
                        this.$commonJs
                            .getMethodData(url, "POST", dataForm)
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.cancel();
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg);
                                }
                                console.log(res, "res");
                            });
                    } else {
                        // 配置crl
                        url = this.$url.AddCrl;
                        let dataVal = {
                            id: this.form.id,
                            ca_cert_id: this.form.ca_cert_id,
                            signer_id: this.form.signer_id,
                            thisdate: this.form.thisupdates,
                            nextdate: this.form.nextupdates,
                            release_url: this.form.release_url,
                            crl_no: this.form.crl_no,
                            organization_id: this.organizationIdCert
                        };
                        this.$commonJs
                            .getMethodData(url, "POST", dataVal)
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.cancel();
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg);
                                }
                                console.log(res, "res");
                            });
                    }
                }
                if (this.mode == 3) {
                    url = this.$url.UpdateInfoCrl;
                    this.$commonJs;
                    this.$confirm("是否修改此条CRL管理?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(url, "POST", dataForm)
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.cancel();
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg);
                                    }
                                    console.log(res, "res");
                                });
                        })
                        .catch((err) => err);
                }
                if (this.mode == 5) {
                    this.certForm.id = this.CrlId;
                    let data = this.$commonJs.getScreenValue(this.certForm);
                    this.$confirm("是否吊销此条证书?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(
                                    this.$url.UpdateCrl,
                                    "POST",
                                    data
                                )
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.cancel();
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg);
                                    }
                                    console.log(res, "res");
                                });
                        })
                        .catch((err) => err);
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
/deep/ .ORG .el-form-item__error {
    left: 90px !important;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
/deep/.el-table__row .cell {
    line-height: 50px;
}
/deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
}
</style>
