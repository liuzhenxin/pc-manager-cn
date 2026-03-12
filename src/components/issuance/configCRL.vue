<template>
    <div v-loading="loading">
        <!-- 配置CRL验证 -->
        <el-card class="navDetailItem">
            <el-form ref="form" :model="formCRL" :rules="rulesCRL" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="从应用证书获取CRL:" label-width="21%" prop="enable_cdp">
                            <el-switch v-model="formCRL.enable_cdp" active-value="1" inactive-value="0" @change='switchClick($event)' active-color="#13ce66"></el-switch>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" :offset="6">
                        <el-form-item label="是否启用CRL分发点:" label-width="23%" prop="enable_cdp">
                            <el-switch v-model="formCRL.enable_cdp" active-value="1" inactive-value="0" @change='switchClick1($event)' active-color="#13ce66"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="从证书获取CRL地址:" label-width="23%" prop="down_url">
                            <el-input class="inputwid" v-model="formCRL.down_url" placeholder="下载CRL地址"></el-input>
                            <el-button size="mini" type="primary" @click="getCrlAddress()" style="margin-bottom:10px;margin-left:5px">获取CRL</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="推迟更新时长(分钟):" label-width="23%" prop="delay_minutes">
                            <el-input class="inputwid" v-model="formCRL.delay_minutes" placeholder="推迟更新时长(分钟)" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                            <el-button size="mini" @click="cancel" type="warning">取消</el-button>
                            <el-button size="mini" type="primary" @click="onUpdate('form','CRL')" style="margin-bottom:10px">提交</el-button>
                            <el-button size="mini" type="primary" @click="CrlUpdate()" style="margin-bottom:10px">同步</el-button>

                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="search">
            <el-row :style="{'margin-top': $commonJs.getStorage().isAdmin==true ? '15px':'0px'}">
                <el-col>
                    <el-upload class="upload-demo" style="display:inline-block" :show-file-list="false" :headers="MyHeader" :action="actionUrl" multiple :on-change="changeFile" :on-success="handleSuccess">
                        <el-button style="" type="primary" size="mini" icon="l-icon-plus">上传CRL</el-button>
                    </el-upload>
                    <el-button size="mini" @click="checkCrlUpdCert()" type="primary" style="margin-left:5px">证书同步效验</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="CrlData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="证书序列号" prop="end_serial_number"></el-table-column>
                <el-table-column label="颁发者" prop="issuer"></el-table-column>
                <el-table-column label="本次更新时间" prop="this_update"></el-table-column>
                <el-table-column label="下次更新时间" prop="next_update"></el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="xiaZai(scope.row)" type="text" size="mini" class="el-icon-upload" style="color: #1890ff">下载CRL</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
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
    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue"
export default {
    components: { addOrg },
    data() {
        return {
            master_statusVal: "20",
            name: "角色信息",
            CertId: this.$route.query.id,
            appcertNum: this.$route.query.appcertNum,
            judgmentType: this.$route.query.type,
            organizationId: "",
            isDisable: false,
            radio: "",
            loading: false,
            fileList: [],
            MyHeader: { Authorization: "" },
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            dialogVisible: false,
            form: {},
            rules: {},
            formCRL: {
                id: "",
                organization_id: "",
                end_serial_number: "",
                enable_cdp: "0",
                down_url: "",
                delay_minutes: "",
                type: ""
            },
            form: {
                organization_id: "",
                end_serial_number: "",
                pageNow: 1,
                pageSize: 10
            },
            total: 0,
            CrlData: [],
            rulesCRL: {
                down_url: [
                    {
                        required: true,
                        message: "请输入下载CRL地址",
                        trigger: "blur"
                    }
                ],
                delay_minutes: [
                    {
                        required: true,
                        message: "请输入推迟更新时长(分钟)",
                        trigger: "blur"
                    }
                ]
            },
            rulesOCSP: {
                master_ocsp: [
                    {
                        required: true,
                        message: "请输入主OCSP服务器地址",
                        trigger: "blur"
                    }
                ]
            },
            isAdmin: false
        }
    },
    watch: {
        "form.organization_name"(val) {
            console.log(val, val)
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("organization_name")
                })
            }
        },
        "form.status"(val) {
            console.log(val, val)
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("status")
                })
            }
        }
    },
    created() {
        this.MyHeader.Authorization =
            window.sessionStorage.getItem("Authorization")
        this.name = "配置CRL验证"
        this.formCRL.organization_id =
            this.$commonJs.getStorage().organization_id
        this.GetCrlCfgBySN()
        this.getCrlList()
    },
    methods: {
        // 获取CRL详情
        GetCrlCfgBySN() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.GetCrlCfgBySN, "POST", {
                    end_serial_number: this.appcertNum,
                    type: this.judgmentType
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        if (res.data.data != null) {
                            this.formCRL = res.data.data
                            this.formCRL.organization_id =
                                this.$commonJs.getStorage().organization_id
                            if (this.formCRL.enable_cdp != null) {
                                this.formCRL.enable_cdp =
                                    res.data.data.enable_cdp.toString()
                            }
                        }
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
        },
        // 查询列表
        getCrlList() {
            // let data = form;
            this.loading = true
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
            this.form.end_serial_number = this.appcertNum
            this.$commonJs
                .getMethodData(this.$url.CRLList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.CrlData = res.data.page.receList
                        this.total = res.data.page.totalRows
                        // this.CrlData.push({ name: "CRL管理" });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                    console.log(res, "res")
                })
        },
        cancel() {
            if (this.judgmentType != undefined) {
                if (this.judgmentType == "app") {
                    this.$router.push("/applicationCertList")
                    return
                }
                if (this.judgmentType == "user") {
                    this.$router.push("/userCertificateList")
                    return
                }
            }

            this.$router.push("/issuanceList")
        },
        // 同步地址
        CrlUpdate() {
            this.$confirm("是否同步RL?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.loading = true
                    this.$commonJs
                        .getMethodData(this.$url.crlSync, "POST", {
                            end_serial_number: this.appcertNum,
                            type: this.judgmentType
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.loading = false
                                this.$message.success("同步成功")
                                this.getCrlList()
                            } else if (res.data.code != 800000) {
                                this.loading = false
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch((err) => err)
        },
        getCrlAddress() {
            this.loading = true
            let url = ""
            if (this.judgmentType != undefined) {
                url = this.$url.GetCrlUrlBySN
                this.$commonJs
                    .getMethodData(url, "POST", {
                        end_serial_number: this.appcertNum,
                        type: this.judgmentType
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            console.log(res.data.data, "res.data.res.data.")
                            this.formCRL.down_url = res.data.data
                            this.loading = false
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                            this.loading = false
                        }
                        console.log(res, "res")
                    })
            }
        },
        switchClick1($event) {
            console.log($event, "--CRL--")
            this.formCRL.enable_cdp = $event
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        changeFile(file, fileList) {
            this.fileList = fileList
        },
        handleSuccess(response, file, fileList) {
            this.fileList = fileList
            let formData = new FormData()
            //   <!-- 将上传的文件放到数据对象中 -->

            if (this.fileList.length != 0) {
                formData.append("crl_file", this.fileList[0].raw)
            } else {
                return this.$message.error("请选择CRL!")
            }
            formData.append(
                "organization_id ",
                this.$commonJs.getStorage().organization_id
            )
            formData.append("type ", this.judgmentType)
            formData.append("end_serial_number ", this.appcertNum)
            this.$http
                .post(this.$url.crlAdd, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("上传成功!")
                        this.getCrlList()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
            this.loading = false
        },
        onUpdate(formName, type) {
            let url
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.formCRL.end_serial_number = this.appcertNum
                this.formCRL.delay_minutes = Number(this.formCRL.delay_minutes)
                this.formCRL.type = this.judgmentType
                let data = this.$commonJs.getScreenValue(this.formCRL)
                if (this.judgmentType != undefined) {
                    url = this.$url.UpdCfgStatus
                }
                this.$confirm("是否配置CRL验证?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.loading = true
                        this.$commonJs
                            .getMethodData(url, "POST", data)
                            .then((res) => {
                                this.loading = false
                                if (res.data.code == 100000) {
                                    this.$message.success("配置成功")
                                    this.GetCrlCfgBySN()
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                            })
                    })
                    .catch((err) => err)
            })
        },
        checkCrlUpdCert() {
            this.$confirm("是否同步效验?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.loading = true
                    let url = ""
                    if (this.judgmentType != undefined) {
                        url = this.$url.checkCrlUpdCert
                        this.$commonJs
                            .getMethodData(url, "POST", {
                                end_serial_number: this.appcertNum,
                                type: this.judgmentType
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("同步效验成功！")
                                    this.loading = false
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                    this.loading = false
                                }
                            })
                    }
                })
                .catch((err) => err)
        },
        xiaZai(row) {
            this.loading = true
            this.$commonJs
                .downLoadMethodData(this.$url.crlExp, "POST", {
                    id: row.id
                })
                .then((res) => {
                    // debugger;
                    console.log(res, "res")
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "CRL.crl"
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
        handleDelete(row) {
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.loading = true
                    let url = this.$url.crlDelOne
                    this.$commonJs
                        .getMethodData(url, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功！")
                                this.getCrlList()
                                this.loading = false
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                                this.loading = false
                            }
                        })
                })
                .catch((err) => err)
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getCrlList()
        } /* 监听页码值改变的事件 */,
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getCrlList()
        }
    }
}
</script>
