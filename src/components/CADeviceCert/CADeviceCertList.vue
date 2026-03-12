<template>
    <div class="navItem">
        <el-card class="search">
            <!-- <el-row> -->
            <!-- <el-col :span="6">
                    <span class="titleLabel" style="width:70px">应用名称:</span>
                    <el-input v-model="form.name" placeholder="请输入应用名称" class="searchInputClass"></el-input>
                </el-col> -->
            <!-- <el-col :span="7">
                    <span class="titleLabel">密钥类型:</span>
                    <el-select v-model="form.key_type" placeholder="请选择系统类型" style="width: 60%" class="searchInputClass">
                        <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col> -->

            <!-- <el-col :span="18">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCertList">查询</el-button>
                </el-col> -->
            <!-- </el-row> -->
            <el-row style="margin-top:0px;margin-left:-10px" v-if="$commonJs.getStorage().isAdmin == true">
                <el-col :span="16">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
                <el-col :span="8">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCertList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert(1)" type="primary" icon="el-icon-plus">添加设备证书</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="appcertData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">

                <el-table-column label="证书名称" prop="name"></el-table-column>
                <el-table-column label="证书序列号" prop="serial_number"></el-table-column>
                <el-table-column label="密钥索引" prop="key_index"></el-table-column>
                <el-table-column label="签名算法" prop="key_algorithm"></el-table-column>
                <el-table-column label="密钥长度" prop="key_length">{{256}}</el-table-column>

                <!-- <el-table-column label="是否上传证书" prop="remark"></el-table-column> -->
                <el-table-column label="证书状态" prop="status">
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
                        <el-button @click.native.stop="openPin(scope.row,4)" type="text" size="mini" class="el-icon-edit" style="color: #409EFF;margin-left:0px">修改访问控制码</el-button>

                        <el-button @click.native.stop="xiangqing(scope.row,2)" type="text" size="mini" class="el-icon-view" style="color: #67C23A;mar">查看详情</el-button>
                        <el-button @click.native.stop="xiaZai1(scope.row,4)" :disabled="scope.row.status!='20'" type="text" size="mini" class="el-icon-upload" style="color: #D87093;margin-left:17px">下载证书</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row,'删除')" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                        <el-button v-if="scope.row.status!='10'" :disabled="scope.row.status=='90' || scope.row.status=='11'" @click.native.stop="handleDelete(scope.row,'禁用')" type="text" size="mini" class="el-icon-close" style="color: #e33ce6;padding-right: 100px">禁用</el-button>
                        <el-button v-if="scope.row.status=='10'" @click.native.stop="handleDelete(scope.row,'启用')" type="text" size="mini" class="el-icon-check" style="color:#E6A23C;padding-right: 100px">启用</el-button>

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
        <el-dialog title="修改密钥私钥访问控制码" :visible.sync="modifyPinDialog" width="30%" :before-close="handleClose">
            <el-form ref="modifyPinForm" :model="modifyPinForm" :rules="modifyRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="原私钥访问控制码:" label-width="160px" prop="oldPucPwd">
                            <el-input style="width:75%" v-model="modifyPinForm.oldPucPwd " prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新私钥访问控制码:" label-width="160px" prop="newPucPwd">
                            <el-input style="width:75%" v-model="modifyPinForm.newPucPwd" placeholder="请输入私钥访问控制码" prefix-icon="el-icon-lock" :type="flag2 ? 'password' : 'text'">
                                <i slot="suffix" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag2 = !flag2"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确认私钥访问控制码:" label-width="170px" prop="surePucPwd" style="margin-left:-10px">
                            <el-input style="width:75%" v-model="modifyPinForm.surePucPwd" placeholder="请输入私钥访问控制码" prefix-icon="el-icon-lock" :type="flag3 ? 'password' : 'text'">
                                <i slot="suffix" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag3 = !flag3"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleClose('modifyPinForm')">取 消</el-button>
                <el-button size="mini" type="primary" @click="addPINStr('modifyPinForm')">确 定</el-button>
            </span>
        </el-dialog>
        <PinList ref="PinDialog" @PIN="PIN"></PinList>
    </div>
</template>
<script>
import PinList from "../CaCert/PinList.vue"
import addOrg from "../organization/addOrg.vue"
export default {
    inject: ["reload"],
    components: { addOrg, PinList },
    data() {
        return {
            getRowKeys(row) {
                return row.id // id为列表数据的唯一标识
            },
            flag1: true,
            flag2: true,
            flag3: true,
            modifyPinForm: {
                id: "",
                oldPucPwd: "",
                newPucPwd: "",
                surePucPwd: ""
            },
            modifyRules: {
                newPucPwd: [
                    {
                        required: true,
                        message: "请输入新私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                oldPucPwd: [
                    {
                        required: true,
                        message: "请输入私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                surePucPwd: [
                    {
                        required: true,
                        message: "请确认私钥访问控制码",
                        trigger: "blur"
                    }
                ]
            },

            modifyPinDialog: false,
            ProfileLoading: false,
            ProfileTotal: 0,
            ProfileData: [],
            multipleSelection: [],
            showFile: false,
            MyHeader: { Authorization: "" },
            profilePageNow: 1,
            profilePageSize: 10,
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
            appcertData: [],
            menuRoleId: "",
            fileList: [],
            selectId: [],
            rowList: {}
        }
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        }
        this.MyHeader.Authorization =
            window.sessionStorage.getItem("Authorization")

        this.getCertList()
    },

    methods: {
        // 查询列表
        getCertList() {
            // let data = form;
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.DeviceCertList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.appcertData = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    // this.appcertData.push({ serial_number: "aaa" });
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
        handleClose(type) {
            this.loading = false
            this.modifyPinDialog = false
            this.$refs.modifyPinForm.resetFields()
        },
        addPINStr(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                if (
                    this.modifyPinForm.newPucPwd !==
                    this.modifyPinForm.surePucPwd
                ) {
                    this.$message.error(
                        "新私钥访问控制码和确认私钥访问控制码不一致!"
                    )
                    return false
                }
                this.modifyPinDialog = false
                setTimeout(() => {
                    this.$confirm("是否修改私钥访问控制码?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then((res) => {
                            this.loading = true
                            this.modifyPinForm.id = this.rowList.id
                            this.$commonJs
                                .getMethodData(
                                    this.$url.ModifyDevicePucPassword,
                                    "POST",
                                    this.modifyPinForm
                                )
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.handleClose()
                                        this.$message.success(
                                            "修改私钥访问控制码成功!"
                                        )
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                        this.handleClose()
                                    } else {
                                        this.handleClose()
                                    }
                                })
                                .catch((err) => {
                                    this.handleClose()
                                })
                        })
                        .catch((err) => err)
                }, 500)
            })
        },
        openPin(row) {
            this.modifyPinDialog = true
            this.rowList = row
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
        // 新增
        jumpToInsert(mode) {
            this.$router.push({
                path: "/CADeviceCertDetail",
                query: {
                    mode: mode
                    // id: row.id
                }
            })
        },
        handleSelectionChange(val) {
            // val[0]
            let list = []

            this.multipleSelection = val
            // val = this.multipleSelection;
            console.log(
                val[0] === this.multipleSelection[0],
                this.multipleSelection,
                list,
                "val"
            )
        },
        openXiaZai(row) {
            this.rowList = row
            this.$refs.PinDialog.modifyFormdialog = true
            this.$refs.PinDialog.modifyForm.PINStr = ""
        },
        PIN(val) {
            if (val != "") {
                let pin = val
                if (val != "false") {
                    this.xiaZai(this.rowList, pin)
                } else {
                    this.loading = false
                }
            }
        },
        xiaZai1(row, mode) {
            // this.$message.success("下载CSR按钮");
            this.loading = true
            this.$commonJs
                .downLoadMethodData(this.$url.ExportDeviceSingleCert, "POST", {
                    id: row.id
                })
                .then((res) => {
                    // debugger;
                    console.log(res, "res")
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "cert.cer"
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
        // uploadCert(row, mode) {
        //     this.$message.success("证书导入按钮");
        // },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/CADeviceCertDetail",
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
                this.$confirm("是否永久删除此条根证书管理?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.DeviceCertDel, "POST", {
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
                })
                    .then((res) => {
                        this.$commonJs
                            .getMethodData(this.$url.DeviceCertUpd, "POST", {
                                id: row.id,
                                status: "10" // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.getCertList()
                                    console.log(res, "res")
                                    this.$message.success("禁用成功!")
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                            })
                    })
                    .catch((err) => err)
            } else if (type == "启用") {
                this.$confirm("是否启用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then((res) => {
                        this.$commonJs
                            .getMethodData(this.$url.DeviceCertUpd, "POST", {
                                id: row.id,
                                status: "20" // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.getCertList()
                                    console.log(res, "res")
                                    this.$message.success("启用成功!")
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                            })
                    })
                    .catch((err) => err)
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
.el-button--mini {
    padding: 5px 5px;
}
</style>
