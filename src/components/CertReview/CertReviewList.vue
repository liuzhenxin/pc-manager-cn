<template>
    <div class="navItem">
        <!-- <el-card class="search">
            <el-row>
                <el-col :span="6">
                    <span class="titleLabel" style="width:70px">应用名称:</span>
                    <el-input v-model="form.name" placeholder="请输入应用名称" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="7">
                    <span class="titleLabel">IP地址:</span>
                    <el-input v-model="form.ip" placeholder="请输入IP地址" class="searchInputClass"></el-input>
                </el-col>

                <el-col :span="11">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getAppList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:20px" v-if="$commonJs.getStorage().isAdmin==true">
                <el-col :span="16">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">添加应用</el-button>
                </el-col>
            </el-row>
        </el-card> -->
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="AppData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="证书主题">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">
                            {{scope.row.subject}}
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="证书主题" prop="subject"></el-table-column> -->
                <el-table-column label="申请状态" prop="status">
                    <template slot-scope="scope">
                        <!-- 状态 20:启用【enabled】 10:停用【disable】 11:申请中 90:注销【revoked】 -->
                        <span style="" v-if="scope.row.status=='10'">申请中</span>
                        <span style="" v-else-if="scope.row.status=='31'">已驳回</span>
                        <span style="" v-else-if="scope.row.status=='11'">审核成功</span>
                        <span style="" v-else-if="scope.row.status=='20'">CA同意发证</span>
                    </template>
                </el-table-column>

                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="update1(scope.row)" type="text" size="mini" class="el-icon-check" style="color: #409EFF;margin-left:0px" :disabled="scope.row.status!='10'">审核通过</el-button>
                        <el-button @click.native.stop="update2(scope.row)" type="text" size="mini" class="el-icon-close" style="color: #da0909;margin-left:0px" :disabled="scope.row.status!='10'">驳回</el-button>
                        <el-button @click.native.stop="update3(scope.row)" type="text" size="mini" class="el-icon-edit" style="color: #409EFF;margin-left:0px" :disabled="scope.row.status!='11'">签发证书</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row,'删除')" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                    </template>
                </el-table-column>

                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNow" :page-sizes="[10, 20, 50]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="证书审核" :visible.sync="shenHeDialogVisible" width="60%">
            <el-card class="intanle">
                <el-form ref="form" :model="formCRL" :rules="rulesCRL" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="签名者:" label-width="21%" prop="signer_id">
                                <el-select style="width:60%" v-model="formCRL.signer_id" placeholder="请选择签名者">
                                    <el-option v-for="item in signerList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="证书模板:" prop="profile_id">
                                <el-select class="inputwid" v-model="formCRL.profile_id" placeholder="请选择证书模板">
                                    <el-option v-for="item in profileList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="审核批注:" label-width="21%">
                                <el-input type="textarea" class="inputwid" v-model="formCRL.opinion_content" placeholder="请输入批注"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                                <el-button size="mini" type="primary" @click="getUpdata('form')" style="margin-bottom:10px">审核通过</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </el-dialog>
        <el-dialog title="驳回申请" :visible.sync="bohuiDialogVisible" width="60%">
            <el-card class="intanle">
                <el-form ref="form" :model="formCRL" :rules="rulesCRL" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="驳回批注:" label-width="21%">
                                <el-input type="textarea" class="inputwid" v-model="formCRL.refuse_content" placeholder="请输入批注"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                                <el-button size="mini" type="primary" @click="getUpdata1('form')" style="margin-bottom:10px">确定</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </el-dialog>
        <el-dialog title="签发证书" :visible.sync="fazhengDialogVisible" width="55%">
            <el-card class="intanle">
                <el-form ref="form1" :model="formCRL" :rules="rulesCRL" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6" v-if="request_mode=='ukey'">
                            <el-form-item label="PIN" label-width="21%" prop="PINStr">
                                <el-input style="width:75%" v-model="formCRL.PINStr" placeholder="请输入口令" prefix-icon="el-icon-lock" type="password">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="备注:" label-width="21%">
                                <el-input style="width:75%" type="textarea" class="inputwid" v-model="formCRL.pass_content" placeholder="请输入批注"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                                <el-button size="mini" type="primary" @click="signIssueCert('form1')" style="margin-bottom:10px">确定</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </el-dialog>
        <!-- <PinList ref="PinDialog" @PIN="PIN"></PinList> -->
    </div>
</template>
<script>
import { UBSEncrollAsync } from "../../assets/js/UBSEnrollAsync"

import addOrg from "../organization/addOrg.vue"
import PinList from "../CaCert/PinList.vue"
export default {
    inject: ["reload"],
    components: { addOrg, PinList },
    data() {
        return {
            form: {
                name: "", //  应用名称
                ip: "",
                organization_id: "",
                pageNow: 1,
                pageSize: 10
            },
            rulesCRL: {
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
                        message: "请选择证书模板",
                        trigger: "blur"
                    }
                ],
                PINStr: [
                    {
                        required: true,
                        message: "请输入口令",
                        trigger: "blur"
                    }
                ]
            },
            loading: false,
            total: 0,
            AppData: [],
            menuRoleId: "",
            rowList: {},
            shenHeDialogVisible: false,
            bohuiDialogVisible: false,
            fazhengDialogVisible: false,
            requestId: "",
            caCertId: "",
            formCRL: {
                signer_id: "", // 签名者
                profile_id: "", // 证书模板id
                pass_content: "",
                PINStr: ""
            },
            profileList: [],
            signerList: [],
            isDouble: 0,
            request_mode: ""
        }
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        }
        this.getAppList()
        this.getSignerListAll()
        this.$UKey.getInit()
    },
    methods: {
        // 查询列表
        getAppList() {
            // 查询列表

            // let data = form;
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.CaRequestList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.AppData = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }

                    console.log(res, "res", " this.certData", this.AppData)
                    this.loading = false
                })
        },
        getUpdata(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.$commonJs
                    .getMethodData(this.$url.CaRequestUpd, "POST", {
                        signer_id: this.formCRL.signer_id,
                        profile_id: this.formCRL.profile_id,
                        opinion_content: this.formCRL.opinion_content,
                        id: this.requestId,
                        status: "11"
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.$message.success("审核通过!")
                            this.getAppList()
                            this.cancel()
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                    })
            })
        },
        getUpdata1(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.$commonJs
                    .getMethodData(this.$url.CaRequestUpd, "POST", {
                        refuse_content: this.formCRL.refuse_content,
                        id: this.requestId,
                        status: "31"
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.$message.success("驳回成功!")
                            this.getAppList()
                            this.cancel()
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                    })
            })
        },
        cancel() {
            this.shenHeDialogVisible = false
            this.bohuiDialogVisible = false
            this.fazhengDialogVisible = false
        },
        organization_id(val) {
            this.form.organization_id = val
        },
        // 重置搜索框
        resultList() {
            this.reload()
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getAppList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getAppList()
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/managementDetail",
                query: {
                    mode: 1
                }
            })
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/CertReviewDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            })
        },
        getType(status, type) {
            if (type == "启用") {
                if (status == "20") {
                    this.$message.info("当前状态与修改状态相同!")
                    return false
                }
            }
            if (type == "禁用") {
                if (status == "10") {
                    this.$message.info("当前状态与修改状态相同!")
                    return false
                }
            }
        },
        update1(row) {
            this.caCertId = row.ca_cert_id
            this.requestId = row.id
            this.getProfileListAll()
            this.shenHeDialogVisible = true
        },
        update2(row) {
            this.caCertId = row.ca_cert_id
            this.requestId = row.id
            this.bohuiDialogVisible = true
        },
        update3(row) {
            this.rowList = row
            this.caCertId = row.ca_cert_id
            this.requestId = row.id
            //是否双证 1:是 0:否
            if (row.cert_mode == "dou") {
                this.isDouble = 1
            } else {
                this.isDouble = 0
            }
            this.request_mode = row.request_mode
            this.fazhengDialogVisible = true
        },
        // 获取签名者
        getSignerListAll(data) {
            this.getListAll(
                this.$url.SignerListAll,
                {
                    organization_id: this.form.organization_id
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
                    cert_id: this.caCertId
                },
                "name",
                "id",
                "profileList"
            )
        },
        getListAll(url, data, label, value, type) {
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
                    if (type == "signerList") {
                        this.signerList = list
                    }
                    if (type == "profileList") {
                        this.profileList = list
                    }
                } else if (res.data.code != 800000) {
                    // this.$message.error(res.data.msg);
                }
                // this.loading = false;
            })
        },
        signIssueCert(formName) {
            if (this.request_mode == "ukey") {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return
                    if (this.formCRL.PINStr != "") {
                        this.getImportData(this.formCRL.PINStr)
                        this.CAloading = false
                    }
                })
            } else {
                this.$commonJs
                    .getMethodData(this.$url.SignIssueCert, "POST", {
                        request_id: this.requestId,
                        pass_content: this.formCRL.pass_content
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.$message.success("签发成功!")
                            this.getAppList()
                            this.cancel()
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                    })
            }
        },
        ceshi(row) {
            this.rowList = row
            if (row.common_name == "0") {
                this.$refs.PinDialog.modifyFormdialog = true
                this.$refs.PinDialog.modifyForm.PINStr = ""
            } else {
                //   <!-- 将上传的文件放到数据对象中 -->

                this.$commonJs
                    .getCsrData(this.rowList.id, this.rowList.organization_id)
                    .then((res) => {
                        if (res.data.code == 100000) {
                            var certData = res.data.data
                            this.$commonJs
                                .getMethodData(this.$url.GenCertUK, "POST", {
                                    csrString: certData.remark,
                                    signer_id: certData.signer_id,
                                    profile_id: certData.profile_id,
                                    ca_cert_id: certData.ca_cert_id,
                                    isDouble: certData.key_length,
                                    organization_id: certData.organization_id,
                                    isUK: certData.common_name
                                })
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        console.log("222", res)
                                        this.$message.success("签发证书成功!")
                                        this.getAppList()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                    }
                                })
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                    })
            }
        },
        // PIN(val) {
        //     if (val != "") {
        //         let pin = val
        //         if (val != "false") {
        //             this.getImportData(pin)
        //         } else {
        //             this.CAloading = false
        //         }
        //     }
        // },
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
                                                    var certData = res.data.data
                                                    console.log(
                                                        this.rowList
                                                            .key_algorithm
                                                    )
                                                    this.$commonJs
                                                        .getMethodData(
                                                            this.$url
                                                                .SignIssueCertUK,
                                                            "POST",
                                                            {
                                                                csrStr: this
                                                                    .rowList
                                                                    .csr_base64,
                                                                // csr_base64:
                                                                //     this.rowList
                                                                //         .csr_base64,
                                                                signer_id:
                                                                    this.rowList
                                                                        .signer_id,
                                                                profile_id:
                                                                    this.rowList
                                                                        .profile_id,
                                                                ca_cert_id:
                                                                    this.rowList
                                                                        .ca_cert_id,
                                                                isDouble:
                                                                    this
                                                                        .isDouble,
                                                                key_algorithm:
                                                                    this.rowList
                                                                        .key_algorithm
                                                            }
                                                        )
                                                        .then((res) => {
                                                            if (
                                                                res.data.code ==
                                                                100000
                                                            ) {
                                                                this.fazhengDialogVisible = false
                                                                var cert =
                                                                    res.data
                                                                        .attrs
                                                                        .certSig
                                                                var enc_cert =
                                                                    res.data
                                                                        .attrs
                                                                        .certEnc
                                                                var enc_key =
                                                                    res.data
                                                                        .attrs
                                                                        .privateKeyEnc
                                                                var enc_symm_key =
                                                                    null
                                                                UBSEncrollAsync.ImportCertificate(
                                                                    (res) => {
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
        // 删除
        handleDelete(row, type) {
            console.log(row, "row")
            if (type == "删除") {
                this.$confirm("是否永久删除此条证书申请?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.CaRequestDelOne, "POST", {
                                id: row.id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("删除成功!")
                                    this.getAppList()
                                    console.log(res, "res")
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                            })
                    })
                    .catch(() => {})
            } else if (type == "禁用") {
                this.$confirm("是否禁用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    if (this.getType(row.status, "禁用") == false) {
                        return
                    }
                    this.$commonJs
                        .getMethodData(this.$url.GetUpdApp, "POST", {
                            id: row.id,
                            status: "10"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("禁用成功!")

                                this.getAppList()
                                console.log(res, "res")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
            } else {
                this.$confirm("是否启用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    if (this.getType(row.status, "启用") == false) {
                        return
                    }
                    this.$commonJs
                        .getMethodData(this.$url.GetUpdApp, "POST", {
                            id: row.id,
                            status: "20"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("启用成功!")
                                this.getAppList()
                                console.log(res, "res")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
.box-card {
    height: 50px;
    line-height: 50px;
}
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
</style>
