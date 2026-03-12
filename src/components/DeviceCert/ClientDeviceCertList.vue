<template>
    <div class="navItem">
        <el-card class="search">
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">导入证书</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="appcertData" tooltip-effect="dark" :header-cell-style="{
                'text-align': 'center',
                'color': '#333',
                'font-size': '14px',
            }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code"
                :tree-props="{ children: 'children' }">

                <el-table-column label="证书序列号" prop="serial_number"></el-table-column>
                <el-table-column label="设备标识" prop="device_id"></el-table-column>
                <el-table-column label="颁发者" prop="issuer"></el-table-column>
                <el-table-column label="主题" prop="subject"></el-table-column>
                <el-table-column label="算法" prop="key_algorithm" width="180"></el-table-column>
                <el-table-column label="证书状态" prop="status" width="100">
                    <template slot-scope="scope">
                        <!-- 状态 20:启用【enabled】 10:停用【disable】 11:申请中 90:注销【revoked】 -->
                        <span style="" v-if="scope.row.status == '10'">停用</span>
                        <span style="" v-else-if="scope.row.status == '20'">启用</span>
                        <span style="" v-else-if="scope.row.status == '11'">申请中</span>
                        <span style="" v-else-if="scope.row.status == '90'">注销</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="xiangqing(scope.row)" type="text" size="mini" class="el-icon-view"
                            style="color: #67C23A;mar">查看详情</el-button>
                        <el-button @click.native.stop="xiaZai(scope.row)" type="text" size="mini" class="el-icon-upload"
                            style="color: #1890ff;margin-left:0px" :disabled="scope.row.status != '20'">下载证书</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row, '删除')" type="text" size="mini"
                            class="el-icon-delete" style="color: #da0909">删除</el-button>
                        <el-button v-if="scope.row.status == '10'" @click.native.stop="handleDelete(scope.row, '启用')"
                            type="text" size="mini" class="el-icon-check"
                            style="color:#E6A23C;padding-right: 100px">启用</el-button>

                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="form.pageNow" :page-sizes="[10, 20, 50]" :page-size="form.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="导入证书" :visible.sync="importCertDialog" width="50%">
            <el-form ref="form" :model="formCert" :rules="rules" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="设备标识:" label-width="28%" prop="device_id">
                            <el-input class="inputwid" v-model="formCert.device_id" placeholder="请输入设备id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="上传证书:" label-width="28%" prop="request_name">
                            <el-upload style="" action="" class="upload-demo" ref="upload" :show-file-list="true"
                                :on-remove="handleRemove" :on-exceed="handleExceed" :on-change="changeFile"
                                :file-list="fileList" :headers="MyHeader" :limit="1" :auto-upload="false"
                                :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" :offset="10">
                        <el-button size="" type="primary" @click="importDeviceCert('form')"
                            style="margin-top:30px;">确定</el-button>
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
                pageNow: 1,
                pageSize: 10
            },
            formCert: {
                device_id: ""
            },
            rules: {
                device_id: [
                    {
                        required: true,
                        message: "请输入设备唯一标识",
                        trigger: "blur"
                    }, {
                        min: 32,
                        max: 32,
                        message: "长度必须为32字符",
                        trigger: "blur"
                    }
                ]
            },
            loading: false,
            total: 0,
            appcertData: [],
            menuRoleId: "",
            selectId: [],
            rowList: {},
            importCertDialog: false,
            fileList: []
        }
    },
    created() {
        // if (this.$commonJs.getStorage().organization_id != 1) {
        //     this.form.organization_id =
        //         this.$commonJs.getStorage().organization_id
        // }
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
                .getMethodData(
                    this.$url.ClientDeviceCertList,
                    "POST",
                    this.form
                )
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.appcertData = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },

        handleClose(type) {
            this.loading = false
            this.modifyPinDialog = false
            this.$refs.modifyPinForm.resetFields()
        },
        handleRemove(file, fileList) {
            this.fileList = []
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        changeFile(file, fileList) {
            this.fileList = fileList
        },
        handleSuccess(file) {
            this.loading = false
            return
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
            this.importCertDialog = true
        },
        // 修改
        xiangqing(row) {
            console.log(row, "w")
            this.$router.push({
                path: "/clientCertDetail",
                query: {
                    id: row.id
                }
            })
        },
        importDeviceCert(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                let formData = new FormData()
                formData.append("device_id", this.formCert.device_id)
                if (this.fileList.length != 0) {
                    formData.append("certFile", this.fileList[0].raw)
                } else {
                    return this.$message.error("请选择证书!")
                }
                this.$http
                    .post(this.$url.ImportClientDevCert, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.$message.success("导入成功!")
                            this.getCertList()
                            this.importCertDialog = false
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
            })
        },
        // 删除
        handleDelete(row, type) {
            if (type == "删除") {
                console.log(row, "row")
                this.$confirm("是否删除证书?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(
                                this.$url.ClientDevCertDelete,
                                "POST",
                                {
                                    id: row.id
                                }
                            )
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
            }
        },
        xiaZai(row){
            this.$commonJs.getLoading()
            this.$commonJs
                .downLoadMethodData(this.$url.ExportClientCert, "POST", {
                    id: row.id
                })
                .then((res) => {
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "client.cer"
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
