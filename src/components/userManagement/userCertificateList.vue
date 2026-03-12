<template>
    <div class="navItem">
        <el-card class="search">
            <!-- <el-row> -->
            <!-- <el-col :span="6">
                    <span class="titleLabel" style="width:70px">用户名称:</span>
                    <el-input v-model="form.fullname" placeholder="请输入用户名称" class="searchInputClass"></el-input>
                </el-col> -->
            <!-- <el-col :span="7">
                    <span class="titleLabel">密钥类型:</span>
                    <el-select v-model="form.key_algorithm" placeholder="请选择系统类型" style="width: 60%" class="searchInputClass">
                        <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col> -->

            <!-- <el-col :span="18">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCertSvsList">查询</el-button>
                </el-col>
            </el-row> -->
            <el-row style="margin-top:0px;margin-left:-10px" v-if="$commonJs.getStorage().isAdmin == true">
                <el-col :span="16">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
                <el-col :span="8">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCertSvsList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
                <el-col>
                    <!-- <el-button size="mini" @click="jumpToInsert(1)" type="primary" icon="el-icon-plus">添加用户证书</el-button> -->
                    <el-button size="mini" @click="jumpToInsert(10)" type="primary" icon="el-icon-plus">证书导入</el-button>
                    <el-button size="mini" @click="backupCert" type="primary" icon="el-icon-folder-checked">备份</el-button>
                    <el-button size="mini" @click="restoreCertPre" type="primary" icon="el-icon-refresh-right">恢复</el-button>

                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="certSvsData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="证书序列号">
                    <template slot-scope="scope">
                        <!-- <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)"> -->
                        {{scope.row.serial_number}}
                        <!-- </span> -->
                    </template>
                </el-table-column>
                <el-table-column label="主题" prop="subject" width="240"></el-table-column>
                <el-table-column label="证书类型" width="80">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.cert_type == 'signature'">签名</span>
                        <span style="" v-else>加密</span>
                    </template>

                </el-table-column>
                <!-- <el-table-column label="密钥标识码" prop="key_value"></el-table-column>
                <el-table-column label="密钥索引" width="80" prop="key_index"></el-table-column> -->
                <el-table-column label="密钥类型" prop="key_algorithm"></el-table-column>
                <el-table-column label="密钥长度" width="80" prop="key_length"></el-table-column>
                <el-table-column label="所属用户">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.svsUser !=null">{{scope.row.svsUser.fullname}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="是否上传证书" prop="remark"></el-table-column> -->
                <el-table-column label="证书状态" width="100" prop="status">
                    <template slot-scope="scope">
                        <!-- 状态 20:启用【enabled】 10:停用【disable】 11:申请中 90:注销【revoked】 -->
                        <span style="" v-if="scope.row.status=='10'">停用</span>
                        <span style="" v-else-if="scope.row.status=='20'">启用</span>
                        <span style="" v-else-if="scope.row.status=='11'">申请中</span>
                        <span style="" v-else-if="scope.row.status=='90'">注销</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="450">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="xiangqing(scope.row,2)" type="text" size="mini" class="el-icon-view" style="color: #67C23A;mar">详情</el-button>
                        <!-- <el-button :disabled="scope.row.status!='11'" @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #F56C6C">修改</el-button> -->
                        <!-- <el-button @click.native.stop="configCRL(scope.row)" type="text" size="mini" class="el-icon-setting" style="color: #1890ff" :disabled="scope.row.status!='20' || scope.row.serial_number == null">配置CRL验证</el-button> -->
                        <!-- <el-button @click.native.stop="xiangqing1(scope.row,5)" type="text" size="mini" class="el-icon-s-tools" style="color: #67C23A" :disabled="scope.row.status!='20' || scope.row.serial_number == null">配置OCSP验证</el-button> -->
                        <!-- <el-button @click.native.stop="xiaZai(scope.row,4)" type="text" size="mini" class="el-icon-upload" style="color: #1890ff;margin-left:0px" :disabled="scope.row.status=='20'">下载CSR</el-button> -->
                        <!-- <el-upload class="upload-demo" style="display:inline-block" :show-file-list="showFile" :headers="MyHeader" :action="actionUrl" :on-success="handleSuccess" multiple :limit="3" :file-list="fileList"> -->
                        <!-- <el-button type="text" size="mini" class="el-icon-check" @click="jumpToInsert(scope.row,10)" style="color: #67C23A">证书导入</el-button> -->
                        <!-- </el-upload> -->
                        <el-button @click.native.stop="xiaZai1(scope.row,4)" type="text" size="mini" class="el-icon-upload" style="color: #1890ff;margin-left:0px" :disabled="scope.row.status!='20'">下载证书</el-button>
                        <el-button @click.native.stop="update1(scope.row,1)" type="text" size="mini" class="el-icon-edit" style="color: #409EFF;margin-left:0px" :disabled="scope.row.status!='20'">更新证书</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row,'删除')" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                        <el-button v-if="scope.row.status!='10'" :disabled="scope.row.status=='90' || scope.row.status=='11'" @click.native.stop="handleDelete(scope.row,'禁用')" type="text" size="mini" class="el-icon-close" style="color: #e33ce6;padding-right: 25px">禁用</el-button>
                        <el-button v-if="scope.row.status=='10'" @click.native.stop="handleDelete(scope.row,'启用')" type="text" size="mini" class="el-icon-check" style="color:#E6A23C;padding-right: 25px">启用</el-button>

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
        <el-dialog title="上传证书" :visible.sync="certDialogVisible" width="40%">
            <el-form ref="form" label-position="right" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:10px;">
                        <el-form-item label="证书:" label-width="35%" prop="signature_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed" :on-change="changeFile" :file-list="fileList" :headers="MyHeader" :limit="1" :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini" type="primary">选择证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="15%" style="margin-top:35px;margin-left:20%;">
                            <el-button size="mini" @click="cancelUpdate()" type="warning" style="margin-bottom:10px">取消</el-button>
                            <el-button size="mini" type="primary" @click="updateCert()" style="margin-bottom:20px">确定</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <el-dialog title="恢复证书" :visible.sync="restoreDialogVisible" width="40%">
            <el-form ref="form" label-position="right" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:10px;">
                        <el-form-item label="" label-width="25%" prop="signature_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed" :on-change="changeFile" :file-list="fileList" :headers="MyHeader" :limit="1" :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini" type="primary">请上传备份文件</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="15%" style="margin-top:35px;margin-left:20%;">
                            <el-button size="mini" @click="cancelUpdate()" type="warning" style="margin-bottom:10px">取消</el-button>
                            <el-button size="mini" type="primary" @click="restoreCert()" style="margin-bottom:20px">确定</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue"
export default {
    inject: ["reload"],
    components: { addOrg },
    data() {
        return {
            showFile: false,
            MyHeader: { Authorization: "" },
            form: {
                serial_number: "", //  角色名称
                pageNow: 1,
                pageSize: 10,
                organization_id: ""
            },
            keyTypeList: [
                {
                    label: "",
                    value: ""
                },
                {
                    label: "SM2",
                    value: "sm2"
                },
                {
                    label: "RSA",
                    value: "rsa"
                }
            ],
            loading: false,
            total: 0,
            certSvsData: [],
            menuRoleId: "",
            fileList: [],
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            certDialogVisible: false,
            restoreDialogVisible: false,
            rowData: {}
        }
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        }
        this.MyHeader.Authorization =
            window.sessionStorage.getItem("Authorization")
        // this.actionUrl = this.$url.ImportCert;
        this.getCertSvsList()
    },
    methods: {
        // 查询列表
        getCertSvsList() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.CertSvsList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.certSvsData = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                    console.log(res, "res")
                })
        },
        organization_id(val) {
            this.form.organization_id = val
        },
        // 重置搜索框
        resultList() {
            this.reload()
        },
        handleSuccess(file) {
            if (file.code == 100000) {
                this.$message.success("上传成功!")
                this.isSuccess = true
            } else {
                this.$message.error(file.msg + "导入失败")
                this.isSuccess = false
            }
            //  this.$commonJs.getCloseLoading();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getCertSvsList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getCertSvsList()
        },
        // 新增
        jumpToInsert(mode) {
            this.$router.push({
                path: "/userCertificateDetail",
                query: {
                    mode: mode
                    // id: row.id
                }
            })
        },
        xiangqing1(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/issuanceDetail",
                query: {
                    mode: mode,
                    id: row.id,
                    appcertNum: row.serial_number,
                    organization_id: row.organization_id,
                    type: "user"
                }
            })
        },
        configCRL(row) {
            console.log(row, "w")
            this.$router.push({
                path: "/configCRL",
                query: {
                    id: row.id,
                    appcertNum: row.serial_number,
                    organization_id: row.organization_id,
                    type: "user"
                }
            })
        },
        xiaZai(row, mode) {
            // this.$message.success("下载CSR按钮");
            this.$commonJs.getLoading()
            this.$commonJs
                .downLoadMethodData(this.$url.UserCertGenCsr, "POST", {
                    id: row.id
                })
                .then((res) => {
                    // debugger;
                    console.log(res, "res")
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "appcert.csr"
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
                    this.$commonJs.getCloseLoading()
                    // console.log(res, "res");
                })
        },
        xiaZai1(row, mode) {
            // this.$message.success("下载CSR按钮");
            this.$commonJs.getLoading()
            this.$commonJs
                .downLoadMethodData(this.$url.ExportUserCert, "POST", {
                    id: row.id
                })
                .then((res) => {
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "usercert.cer"
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
                    this.$commonJs.getCloseLoading()
                    // console.log(res, "res");
                })
        },
        update1(row, type) {
            this.certDialogVisible = true
            this.rowData = row
        },
        // uploadCert(row, mode) {
        //     this.$message.success("证书导入按钮");
        // },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/userCertificateDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            })
        },

        // 删除
        handleDelete(row, type) {
            if (type == "删除") {
                console.log(row, "row")
                this.$confirm("是否永久删除此条用户证书管理?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.UserCertSvsDel, "POST", {
                                id: row.id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("删除成功!")
                                    this.getCertSvsList()
                                    console.log(res, "res")
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                            })
                    })
                    .catch(() => {
                        // this.$message({
                        //     type: "info",
                        //     message: "已取消删除"
                        // });
                    })
            } else if (type == "禁用") {
                this.$confirm("是否禁用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    this.$commonJs
                        .getMethodData(this.$url.UserCertUpdStatus, "POST", {
                            userid: row.userid,
                            id: row.id,
                            status: "10" // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.getCertSvsList()
                                console.log(res, "res")
                                this.$message.success("禁用成功!")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
            } else if (type == "启用") {
                this.$confirm("是否启用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    this.$commonJs
                        .getMethodData(this.$url.UserCertUpdStatus, "POST", {
                            userid: row.userid,
                            id: row.id,
                            status: "20" // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.getCertSvsList()
                                console.log(res, "res")
                                this.$message.success("启用成功!")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
            }
        },
        handlePreview(file) {
            console.log(file)
        },
        handleRemove(file, fileList) {
            this.fileList = []
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        changeFile(file, fileList) {
            // console.log(fileList, "fileList");
            this.fileList = fileList
            // this.fileLoading = true;
            // this.$commonJs.getLoading();
        },
        handleSuccess(file) {
            console.log(file, "file")

            if (file.code == 100000) {
                this.$message.success("上传成功!")
            }
            this.loading = false
            return
        },
        cancelUpdate() {
            this.certDialogVisible = false
            this.restoreDialogVisible = false
            this.fileList = []
        },
        updateCert() {
            this.loading = true
            let formData = new FormData()
            if (this.fileList.length != 0) {
                formData.append("cert", this.fileList[0].raw)
            } else {
                return this.$message.error("请选择签名证书!")
            }
            formData.append("id", this.rowData.id)

            this.$http
                .post(this.$url.UpdateUserCert, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("更新证书成功!")
                        this.getCertSvsList()
                        this.cancelUpdate()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        restoreCertPre() {
            this.restoreDialogVisible = true
        },
        backupCert() {
            this.$commonJs.getLoading()
            this.$commonJs
                .downLoadMethodData(this.$url.BackupUserCert, "POST", {})
                .then((res) => {
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "usercert.bak"
                        link.style.display = "none"
                        const url =
                            window.URL || window.webkitURL || window.moxURL
                        link.href = window.URL.createObjectURL(blob)
                        link.download = _fileName //下载的文件名称
                        link.click()
                        window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                        this.isXiaZai = true
                    } catch (error) {
                        this.$message.error("备份失败!")
                    }
                    this.$commonJs.getCloseLoading()
                    // console.log(res, "res");
                })
        },
        restoreCert() {
            this.loading = true
            let formData = new FormData()
            if (this.fileList.length != 0) {
                formData.append("file", this.fileList[0].raw)
            } else {
                this.loading = false
                return this.$message.error("请上传备份文件!")
            }

            this.$http
                .post(this.$url.RestoreUserCert, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("恢复成功!")
                        this.getCertSvsList()
                        this.cancelUpdate()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
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
.el-button--mini {
    padding: 5px 5px;
}
</style>
