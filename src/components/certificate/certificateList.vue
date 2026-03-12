<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="6">
                    <span class="titleLabel" style="width:93px;margin-left: -12px">证书颁发者:</span>
                    <el-input v-model="form.issuer" placeholder="请输入证书颁发者" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="18">
                    <el-button v-if="isAddBtn==true" type="success" size="mini" style="margin-left:5px;float:right;" @click="cancel">返回</el-button>
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCertList">查询</el-button>

                </el-col>
            </el-row>
            <el-row style="margin-top:15px;" v-if="isAddBtn==true">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">绑定</el-button>

                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="CertList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="证书序列号">
                    <template slot-scope="scope">
                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">
                            {{scope.row.serial_number}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="证书颁发者" prop="issuer" width="450"></el-table-column>
                <el-table-column label="证书结束时间" prop="not_after"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button> -->
                        <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">解绑</el-button>
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
        <el-dialog title="新增证书" :visible.sync="addDialogVisible" width="60%">
            <el-card class="intanle" v-loading="loading">
                <el-form ref="addForm" :model="addForm" :rules="rules" label-position="right" label-width="10%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:10px;margin-bottom:30px">请先插入UKey后再操作。
                        </div>
                        <div style="text-align:center">
                            <el-col :span="15" :offset="5">
                                <el-form-item label="" label-width="0%" prop="CommonName">
                                    <el-input v-model="addForm.CommonName" class="inputwid" placeholder="请获取证书信息" :disabled="false"></el-input>
                                    <el-button size="mini" @click="getCert()" style="margin-left:10px" type="primary">获取证书</el-button>
                                </el-form-item>
                            </el-col>
                        </div>
                    </el-row>
                    <div style="text-align:center;margin-top:50px">
                        <el-button type="primary" @click="clear()" style="margin-left:10px">清空</el-button>
                        <el-button type="primary" @click="bindCert()" style="margin-left:10px">确 定</el-button>
                    </div>
                </el-form>
            </el-card>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                user_id: "",
                issuer: "", // 颁发者
                cert_sn: "", // 证书序列号
                subject: "", // 证书主题
                key_idcode: "", // 密钥标识码
                type: "", // 菜单类型
                organization_id: "",
                pageNow: 1,
                pageSize: 10
            },
            addForm: {
                CommonName: "",
                certBase64: ""
            },
            rules: {
                CommonName: [
                    {
                        required: true,
                        message: "请先获取证书信息",
                        trigger: "blur"
                    }
                ]
            },
            isAddBtn: false,
            roleId: this.$route.query.roleId,
            routeType: "",
            loading: false,
            total: 0,
            CertList: [],
            typeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "1",
                    label: "菜单"
                },
                {
                    value: "2",
                    label: "目录"
                },
                {
                    value: "3",
                    label: "按钮"
                }
            ],
            addDialogVisible: false
        }
    },
    created() {
        if (sessionStorage.getItem("queryTypeList") != null) {
            let queryTypeList = JSON.parse(
                sessionStorage.getItem("queryTypeList")
            )
            this.routeType = queryTypeList["queryType"]
            this.roleId = queryTypeList["certRoleId"]
        }
        if (this.routeType != null && this.routeType != "") {
            this.isAddBtn = true
        }
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        }
        this.getCertList()

        window.addEventListener("setItem", () => {
            sessionStorage.removeItem("queryTypeList")
            sessionStorage.removeItem("IsCertificateList")
        })
    },
    methods: {
        // 查询列表
        getCertList() {
            this.loading = true
            let url, data
            if (this.roleId != undefined) {
                url = this.$url.GetByUserId
                data = {
                    user_id: this.roleId
                }
            } else {
                url = this.$url.GetCertList
                data = this.form
            }
            this.$commonJs.getMethodData(url, "POST", data).then((res) => {
                if (res.data.code == 100000) {
                    if (this.roleId != undefined) {
                        this.CertList = res.data.data
                        this.total = res.data.data.length
                    } else {
                        this.CertList = res.data.page.receList
                        this.total = res.data.page.totalRows
                    }
                } else if (res.data.code != 800000) {
                    this.$message.error(res.data.msg)
                }
                this.loading = false
                console.log(res, "res")
            })
        },
        cancel() {
            // if (this.routeType == "YeWu") {
            //     // 业务管理员
            //     this.$router.push({
            //         path: "/BusinessAdminList"
            //     });
            // }
            // if (this.routeType == "YongHu") {
            //     this.$router.push({
            //         path: "/userInformationList"
            //     });
            // }
            // if (this.routeType == "SiFa") {
            //     // 司法取证
            //     this.$router.push({
            //         path: "/JudicialAdminList"
            //     });
            // }
            // if (this.routeType == "ShenJi") {
            //     this.$router.push({
            //         path: "/AuditOperationList"
            //     });
            // }
            // if (this.routeType == "YeWuCaoZuo") {
            //     this.$router.push({
            //         path: "/BusinessOperationList"
            //     });
            // }
            let path = window.sessionStorage.getItem("activePath")
            this.$router.push(path)
            sessionStorage.removeItem("queryTypeList")
        },
        // 重置搜索框
        resultList() {
            this.form = {
                name: "", // 名称
                type: "", // 菜单类型
                pageNow: 1,
                pageSize: 10
            }
            this.getCertList()
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
        jumpToInsert() {
            this.$UKey.getInit()
            this.addDialogVisible = true
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/certificateDetail",
                query: {
                    mode: mode,
                    certSn: row.serial_number
                }
            })
        },
        // 删除
        handleDelete(row) {
            this.$confirm("是否永久删除此条证书?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.UnbindById, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!")
                                this.getCertList()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    })
                })
        },
        getCert() {
            this.loading = true
            this.$UKey.GetExportSignCert((res) => {
                let serial = ""
                if (res != false && res.count != 0) {
                    serial = res.serial
                } else {
                    this.$message.warning("UKey为空，没有证书!")
                    this.loading = false
                    return
                }
                this.$commonJs
                    .getMethodData(this.$url.GetByCert, "POST", {
                        serial_number: serial
                    })
                    .then((res1) => {
                        this.loading = false
                        if (res1.data.code == 100000) {
                            if (res1.data.data != null) {
                                this.$message.warning(
                                    "UKey已重复使用,请重新插入设备!"
                                )
                            } else {
                                let dataList = res
                                this.count((res2) => {
                                    if (res2 == true) {
                                        this.addForm.CommonName = res.subject
                                        this.certBase64 = dataList.cert
                                    }
                                }, dataList.date.split("~")[1])
                            }
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                    })
            })
        },
        bindCert() {
            this.$refs.addForm.validate((valid) => {
                if (!valid) return
                this.loading = true
                this.$commonJs
                    .getMethodData(this.$url.BindCertByUserId, "POST", {
                        certBase64: this.certBase64,
                        userId: this.roleId
                    })
                    .then((res) => {
                        this.loading = false
                        if (res.data.code == 100000) {
                            this.addDialogVisible = false
                            this.$message.success("绑定成功")
                            this.addForm.CommonName = ""
                            this.getCertList()
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                    })
            })
        },
        clear() {
            this.addForm.CommonName = ""
        },
        count(cb, data) {
            let that = this
            this.$commonJs
                .getCheckNotAfter({
                    certDate: data
                })
                .then((res) => {
                    console.log(res, "有效期")
                    if (res.data.data == false) {
                        // console.log("证书可以正常使用");
                        cb(true)
                    } else {
                        that.$message.error("证书已过有效期!")
                    }
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
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    background: #f4f5f7;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #67c23a;
    font-weight: 500;
}
</style>
