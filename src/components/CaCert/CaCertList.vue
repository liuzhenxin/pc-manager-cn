<template>
    <div class="navItem">
        <el-card class="search" v-if="$commonJs.getStorage().currentRole.three_type=='41' || $commonJs.getStorage().isAdmin == true">
            <!-- <el-row v-if="isAdmin==true">
                <el-col :span="18">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
                <el-col :span="6">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCertList">查询</el-button>
                </el-col>
            </el-row> -->
            <el-row>
                <el-col>
                    <el-button size="mini" @click="jumpToInsert2(10)" type="primary" icon="el-icon-plus">签发PFX</el-button>
                    <el-button size="mini" @click="copyList()" type="primary" icon="el-icon-plus">备份证书</el-button>
                    <el-upload style="display:inline-block;margin-left:5px" class="upload-demo" ref="upload" :show-file-list="false" :action="actionUrl" :file-list="fileList" name="sqlFile" :headers="MyHeader" :limit="1" :on-success="handleSuccess">
                        <el-button slot="trigger" icon="el-icon-plus" size="mini" type="primary">恢复证书</el-button>
                    </el-upload>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="certData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="证书序列号" width="190">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">
                            {{scope.row.serial_number}}
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="证书主题" prop="code"></el-table-column> -->
                <el-table-column label="颁发者" prop="issuer" width="200"></el-table-column>
                <el-table-column label="使用者" prop="subject" width="150"></el-table-column>
                <el-table-column label="密钥类型" prop="key_algorithm" width="120"></el-table-column>
                <el-table-column label="密钥长度" prop="key_length">{{256}}</el-table-column>
                <el-table-column label="证书用途">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.common_name == '0'">UKEY</span>
                        <span style="" v-else-if="scope.row.common_name=='1'">应用</span>

                    </template>
                </el-table-column>
                <el-table-column label="证书类型">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.cert_type == 'signature'">签名</span>
                        <span style="" v-else-if="scope.row.cert_type=='encrypt'">加密</span>
                        <span style="" v-else>{{scope.row.cert_type}}</span>

                    </template>

                </el-table-column>
                <el-table-column label="证书状态" prop="status">
                    <template slot-scope="scope">
                        <!-- 状态 20:启用【enabled】 10:停用【disable】 11:申请中 90:注销【revoked】 -->
                        <span style="" v-if="scope.row.status=='10'">停用</span>
                        <span style="" v-else-if="scope.row.status=='20'">启用</span>
                        <span style="" v-else-if="scope.row.status=='11'">申请中</span>
                        <span style="" v-else-if="scope.row.status=='90'">注销</span>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" prop="not_before" width="120"></el-table-column>
                <el-table-column label="结束时间" prop="not_after" width="120"></el-table-column>
                <el-table-column label="创建时间" prop="create_time" width="180"></el-table-column>
                <el-table-column label="操作" :width="$commonJs.getStorage().currentRole.three_type=='45'?250:420">
                    <template slot-scope="scope">
                        <div v-if="$commonJs.getStorage().currentRole.three_type=='45'">
                            <el-button v-if="scope.row.cert_type=='signature'" @click.native.stop="xiaZai(scope.row,'root','RA')" type="text" size="mini" class="el-icon-upload" style="color: #00DDDD;margin-left:0px">下载证书</el-button>
                            <el-button v-if="scope.row.cert_type=='encrypt'" @click.native.stop="xiaZai(scope.row,'key','RA')" type="text" size="mini" class="el-icon-upload" style="color: #67C23A;margin-left:0px">下载密钥</el-button>
                            <el-button v-if="scope.row.cert_type=='PFX'" @click.native.stop="updateIssuedCert(scope.row)" type="text" size="mini" class="el-icon-upload" style="color: #FF6699;margin-left:0px">下载PFX</el-button>
                            <el-button @click.native.stop="update1(scope.row,1)" type="text" size="mini" class="el-icon-edit" style="color: #409EFF;margin-left:0px">更新证书</el-button>
                        </div>
                        <div v-show="$commonJs.getStorage().currentRole.three_type!='45'">

                            <el-button v-show="scope.row.cert_type=='signature'" @click.native.stop="xiaZai(scope.row,'root','CA')" type="text" size="mini" class="el-icon-upload" style="color: #00DDDD;margin-left:0px">下载证书</el-button>
                            <el-button v-show="scope.row.cert_type=='encrypt'" @click.native.stop="xiaZai(scope.row,'key','CA')" type="text" size="mini" class="el-icon-upload" style="color: #67C23A;margin-left:0px">下载密钥</el-button>
                            <el-button v-if="scope.row.cert_type=='PFX'" @click.native.stop="updateIssuedCert(scope.row)" type="text" size="mini" class="el-icon-upload" style="color: #FF6699;margin-left:0px">下载PFX</el-button>
                            <el-button @click.native.stop="update1(scope.row,1)" type="text" size="mini" class="el-icon-edit" style="color: #409EFF;margin-left:0px">更新证书</el-button>
                            <el-button @click.native.stop=" xiangqing1(scope.row,6)" :disabled="scope.row.status == '90'" type="text" size="mini" class="el-icon-close" style="color: #67C23A">吊销</el-button>
                            <el-button @click.native.stop="handleDelete(scope.row,'删除')" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                            <el-button v-show="scope.row.status=='10'" @click.native.stop="handleDelete(scope.row,'启用')" type="text" size="mini" class="el-icon-check" style="color:#E6A23C">启用</el-button>
                            <el-button v-show="scope.row.status!='10'" :disabled="scope.row.status=='90' || scope.row.status=='11'" @click.native.stop="handleDelete(scope.row,'禁用')" type="text" size="mini" class="el-icon-close" style="color: #e33ce6;">禁用</el-button>
                        </div>
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
        <el-dialog title="吊销证书" :visible.sync="certDialogVisible" width="35%">
            <el-form ref="certForm" :model="certForm" :rules="certRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row>
                    <el-col :offset="2">
                        <el-form-item label="吊销原因:" label-width="25%" prop="revoked_reason">
                            <el-select style="width:60%" v-model="certForm.revoked_reason" placeholder="请选择吊销原因">
                                <el-option v-for="item in CaCertList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoCert()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addCert()">确 定</el-button>
            </span>
        </el-dialog>
        <PinList ref="PinDialog" @PIN="PIN"></PinList>
    </div>
</template>
<script>
import { UBSEncrollAsync } from "../../assets/js/UBSEnrollAsync"
import PinList from "./PinList.vue"
import addOrg from "../organization/addOrg.vue"
export default {
    inject: ["reload"],
    components: { addOrg, PinList },
    data() {
        return {
            certDialogVisible: false,
            form: {
                organization_id: "",
                organizationFatherName: "",
                status: "", // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                // issuer: "", // 证书颁发者
                pageNow: 1,
                pageSize: 10
            },
            actionUrl: "",
            loading: false,
            total: 10,
            certData: [],
            menuRoleId: "",
            isAdmin: false,
            certForm: {
                revoked_reason: "",
                id: ""
            },
            certRules: {
                revoked_reason: [
                    {
                        required: true,
                        message: "请选择吊销原因",
                        trigger: "blur"
                    }
                ]
            },
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
            MyHeader: {},
            UkeyData: {},
            fileList: [],
            PinRow: {},
            pinType: ""
        }
    },
    created() {
        this.actionUrl = this.$url.RestoreDB
        this.MyHeader = {
            Authorization: window.sessionStorage.getItem("Authorization")
            // "Content-Type": "multipart/form-data"
        }
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        } else {
            this.isAdmin = true
        }
        this.getCertList()
    },
    mounted() {
        this.$UKey.getInit()
    },
    methods: {
        // 查询列表
        getCertList() {
            // let data = form;
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.CertIssueList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.certData = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }

                    console.log(res, "res", " this.certData", this.certData)
                    this.loading = false
                })
        },
        organization_id(data) {
            console.log(data, "pppppppppppp")
            this.form.organization_id = data
        },

        // 重置搜索框
        resultList() {
            this.reload()
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getCertList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getCertList()
        },
        copyList() {
            this.$commonJs
                .downLoadMethodData(this.$url.BackupDB, "POST", {})
                .then((res) => {
                    // debugger;
                    console.log(
                        res,
                        // res.headers["content-disposition"].split(
                        //     "filename="
                        // )[1],
                        "resupdate"
                    )
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "cert.sql"
                        // res.headers["content-disposition"].split(
                        //     "filename="
                        // )[1];
                        link.style.display = "none"
                        const url =
                            window.URL || window.webkitURL || window.moxURL
                        link.href = window.URL.createObjectURL(blob)
                        link.download = _fileName //下载的文件名称
                        link.click()
                        window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                        this.loading = false
                    } catch (error) {
                        this.$message.error("下载失败!")
                        this.loading = false
                    }
                })
        },
        handleSuccess(file) {
            console.log(file, "file")

            if (file.code == 100000) {
                this.$message.success("上传成功!")
            } else {
                this.fileList = []
                this.$message.error(file.msg)
                if (file.code == "990001") {
                    this.$router.push("/GetLogin")
                    sessionStorage.clear()
                }
            }
            this.loading = false
        },
        jumpToInsert2(mode) {
            this.$router.push({
                path: "/IssueCert",
                query: {
                    mode: mode
                }
            })
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/CaCertDetail",
                query: {
                    mode: mode,
                    id: row.id,
                    appcertNum: row.serial_number
                }
            })
        },
        PIN(val) {
            if (val != "") {
                let pin = val
                if (this.pinType == 1 && val != "false") {
                    this.update(this.PinRow, pin)
                }
            } else {
                return
            }
        },
        xiangqing1(row, mode) {
            this.certDialogVisible = true
            this.certForm.revoked_reason = ""
            this.certForm.id = row.id
            console.log(this.certForm, "this.certForm")
        },
        update1(row, type) {
            row.common_name = "1"
            if (row.common_name == "1") {
                this.loading = true
                this.$commonJs
                    .getMethodData(this.$url.UpdateCert, "POST", {
                        id: row.id
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            var cert = res.data.data
                            this.$message.success("更新证书成功!")
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                        this.loading = false
                    })
            } else {
                if (row.cert_type == "PFX") {
                    this.updateIssuedCert(row)
                } else {
                    this.$UKey.getUkeyData((res) => {
                        console.log(res, "更新")
                        // if (res == false) {
                        //     return;
                        // }
                        if (res.count == 0) {
                            this.$message.error("请先正确插入设备!")
                            return
                        } else {
                            // if (
                            //     res.serial != row.serial_number ||
                            //     res.serial == undefined
                            // ) {
                            //     this.$message.error("证书与UKey不匹配,请重新插入设备!");
                            //     return;
                            // }
                            this.$refs.PinDialog.modifyFormdialog = true
                            this.$refs.PinDialog.modifyForm.PINStr = ""
                            this.PinRow = row
                            this.pinType = type
                            // this.update(this.PinRow, "");
                            console.log(
                                this.$refs.PinDialog,
                                this.$refs.PinDialog.modifyForm,
                                "this.$refs.PinDialog"
                            )
                        }
                    })
                }
            }
        },
        updateIssuedCert(row) {
            this.$commonJs
                .downLoadMethodData(this.$url.DownPfxCert, "POST", {
                    cert_issue_id: row.id
                })
                .then((res) => {
                    this.loading = true
                    console.log(
                        res,
                        res.headers["content-disposition"].split(
                            "filename="
                        )[1],
                        "resupdate"
                    )
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName =
                            res.headers["content-disposition"].split(
                                "filename="
                            )[1]
                        link.style.display = "none"
                        const url =
                            window.URL || window.webkitURL || window.moxURL
                        link.href = window.URL.createObjectURL(blob)
                        link.download = _fileName //下载的文件名称
                        link.click()
                        window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                    } catch (error) {
                        this.$message.error("下载失败!")
                    }
                    this.loading = false
                    // console.log(res, "res");
                })
        },

        update(row, pin) {
            if (row.cert_type == "signature") {
                // 签名
                this.$UKey.getUkeyData((res) => {
                    this.UkeyData = res
                    console.log(res, "dfff")
                    this.getImportData(
                        this.UkeyData.serial,
                        row,
                        "",
                        this.UkeyData.conname,
                        pin
                    )
                })
            } else if (row.cert_type == "encrypt") {
                // 加密
                this.$UKey.doExportEncCert((res) => {
                    this.UkeyData = res
                    console.log(res, "dfff")
                    this.getImportData(
                        this.UkeyData.serial,
                        row,
                        "encrypt",
                        this.UkeyData.conname,
                        pin
                    )
                })
            }
        },
        getImportData(data, row, type, conname, pin) {
            if (data != row.serial_number || data == undefined) {
                this.$message.error("证书与UKey不匹配,请重新插入设备!")
                return
            }
            if (data == row.serial_number && data != undefined) {
                this.loading = true

                let isSign = true //  签名
                this.$commonJs
                    .getMethodData(this.$url.UpdateCert, "POST", {
                        cert_issue_id: row.id
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            var cert = res.data.data
                            if (type == "encrypt") {
                                isSign = false
                            }
                            this.$UKey.GetDevices((res) => {
                                console.log(res.length)

                                var device = null
                                device = res[0]

                                UBSEncrollAsync.EnumApplication((res) => {
                                    if (res.success === true) {
                                        UBSEncrollAsync.OpenContainer(
                                            (res) => {
                                                console.log(
                                                    "OpenContainer: ",
                                                    res
                                                )
                                                if (res.success === true) {
                                                    var handle = res.data
                                                    UBSEncrollAsync.CheckPIN(
                                                        (res) => {
                                                            console.log(
                                                                "CheckPIN: " +
                                                                    res
                                                            )
                                                            if (res.success) {
                                                                UBSEncrollAsync.ImportCertificate(
                                                                    (res) => {
                                                                        if (
                                                                            res.success
                                                                        ) {
                                                                            if (
                                                                                res.success
                                                                            ) {
                                                                                this.$message.success(
                                                                                    "更新证书成功!"
                                                                                )

                                                                                UBSEncrollAsync.FreeCertificate(
                                                                                    (
                                                                                        res
                                                                                    ) => {},
                                                                                    handle
                                                                                )
                                                                            } else {
                                                                                this.$message.error(
                                                                                    "更新证书失败!"
                                                                                )
                                                                                UBSEncrollAsync.FreeCertificate(
                                                                                    (
                                                                                        res
                                                                                    ) => {},
                                                                                    handle
                                                                                )
                                                                            }
                                                                        } else {
                                                                            this.$message.error(
                                                                                "更新证书失败!"
                                                                            )
                                                                            UBSEncrollAsync.FreeCertificate(
                                                                                (
                                                                                    res
                                                                                ) => {},
                                                                                handle
                                                                            )
                                                                        }
                                                                    },
                                                                    handle,
                                                                    cert,
                                                                    isSign
                                                                )
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
                            })
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                        console.log(res, "res", " this.certData", this.certData)
                        this.loading = false
                    })
            } else {
                this.$message.error("证书与UKey不匹配,请重新插入设备!")
            }
        },

        xiaZai(row, type, isRA) {
            let url
            if (isRA == "RA") {
                if (type == "root") {
                    url = this.$url.CertDownCert
                } else {
                    url = this.$url.RADownloadEnc
                }
            } else {
                // if (type == "root" && row.key_length == "1") {
                //     this.updateIssuedCert(row);
                //     return;
                // }
                if (type == "root") {
                    // 下载证书
                    url = this.$url.CertDownCert
                } else {
                    // 下载密钥
                    url = this.$url.CADownloadEnc
                }
            }
            this.$commonJs
                .downLoadMethodData(url, "POST", {
                    id: row.id
                })
                .then((res) => {
                    this.loading = true
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName
                        if (type == "root") {
                            _fileName = "cert.cer"
                        } else {
                            _fileName =
                                res.headers["content-disposition"].split(
                                    "filename="
                                )[1]
                        }

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
                    this.loading = false
                    // console.log(res, "res");
                })
        },
        // 删除
        handleDelete(row, type) {
            console.log(row, "row")
            if (type == "删除") {
                this.$confirm("是否永久删除此条证书颁发机构?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.CertIssuedelOne, "POST", {
                                id: row.id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("删除成功!")
                                    this.getCertList()
                                    console.log(res, "res")
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                                this.getCertList()
                            })
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        })
                    })
            } else if (type == "禁用") {
                this.$confirm("是否禁用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                    this.$commonJs
                        .getMethodData(this.$url.UpdateStatus, "POST", {
                            id: row.id,
                            status: "10"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("禁用成功!")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            this.getCertList()
                        })
                })
            } else {
                this.$confirm("是否启用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    this.$commonJs
                        .getMethodData(this.$url.UpdateStatus, "POST", {
                            id: row.id,
                            status: "20"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("启用成功!")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            this.getCertList()
                        })
                })
            }
        },
        addCert() {
            console.log(this.certForm, "this.certForm")
            this.$refs.certForm.validate((valid) => {
                if (!valid) return
                let data = this.$commonJs.getScreenValue(this.certForm)
                this.certDialogVisible = false
                setTimeout(() => {
                    this.$confirm("是否吊销此条证书?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(
                                    this.$url.RevokeCert,
                                    "POST",
                                    data
                                )
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.reload()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                    }
                                    console.log(res, "res")
                                })
                        })
                        .catch((err) => {
                            setTimeout(() => {
                                this.certDialogVisible = true
                            }, 300)
                        })
                }, 300)
            })
        },
        infoCert() {
            this.certDialogVisible = false
            this.$refs.certForm.resetFields()
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
