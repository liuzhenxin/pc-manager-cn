<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/applicationCertExtList' }">
                <el-button size="mini" class="el-button1" type="warning"
                    style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle" v-if="mode == 2">
            <el-form ref="form" :model="formKey" :rules="rulesKey" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20" v-if="isDoubleOrNot">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="所属应用:" label-width="21%" prop="appid">
                            <el-select v-model="formKey.appid" placeholder="请选择所属应用" style="width: 35%"
                                :disabled="isDisable">
                                <el-option v-for="item in AppList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="应用环境标识:" label-width="21%">
                            <el-input class="inputwid" v-model="formKey.app_env" placeholder="请输入应用环境标识"
                                :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="证书名称:" label-width="21%">
                            <el-input class="inputwid" v-model="formKey.name" placeholder="证书名称"
                                :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="是否双证:" label-width="21%" prop="doubleRadio">
                            <el-radio-group v-model="doubleRadio">
                                <el-radio label="1" :disabled="isDisable">是</el-radio>
                                <el-radio class="radioStyle" label="0" :disabled="isDisable">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:10px;">
                        <el-form-item label="签名证书:" label-width="21%" prop="signature_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl"
                                :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed"
                                :on-change="changeFile" :file-list="fileList" :headers="MyHeader" :limit="1"
                                :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择签名证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="isEncryption == true" style="margin-top:20px;">
                        <el-form-item label="加密证书:" label-width="21%" prop="encrypt_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl"
                                :on-preview="handlePreview" :on-remove="handleRemove1" :on-exceed="handleExceed"
                                :on-change="changeFile1" :file-list="fileList1" :headers="MyHeader" :limit="1"
                                :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择加密证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="加密私钥格式:" v-if="isEncryption == true" label-width="21%" prop="encKeyTypeValue">
                            <el-radio-group v-model="encKeyTypeValue">
                                <el-radio label="1" :disabled="isDisable">0016加密格式</el-radio>
                                <el-radio class="radioStyle" label="0" :disabled="isDisable">SM2加密格式</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="isEncryption == true" style="margin-top:20px;">
                        <el-form-item label="加密证书私钥:" label-width="21%" prop="encryptKey_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl"
                                :on-preview="handlePreview" :on-remove="handleRemove2" :on-exceed="handleExceed"
                                :on-change="changeFile2" :file-list="fileList2" :headers="MyHeader" :limit="1"
                                :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择加密证书私钥</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isEncryption == true" :offset="6" style="margin-top:20px">
                        <el-form-item label="私钥访问控制码:" label-width="21%">
                            <el-input class="inputwid" v-model="pucPassword" type="password" style="width:25%"
                                placeholder="请填写"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:35px;margin-left:12%;">
                            <el-button size="mini" @click="cancel" type="warning" style="margin-bottom:10px">取消</el-button>
                            <el-button size="mini" type="primary" @click="openPin()"
                                style="margin-bottom:20px">确定</el-button>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
        </el-card>
        <el-card class="intanle" v-if="mode == 1">
            <el-form ref="form" :model="form" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <div style="display: flex;flex-direction: column;width: 50%;margin: auto;">
                        <borderTitle title="证书信息" style="display:inline-block">
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="证书序列号:" label-width="42%" prop="serial_number">
                                    {{ form.serial_number }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="应用ID:" label-width="42%" prop="appid">
                                    {{ form.appid }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="应用环境标识:" label-width="42%">
                                    {{ form.app_env }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="证书名称:" label-width="42%">
                                    {{ form.name }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="证书开始时间:" label-width="42%" prop="not_before">
                                    {{form.not_before}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="证书结束时间:" label-width="42%" prop="not_after">
                                    {{ form.not_after }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                        <borderTitle title="证书主题" style="display:inline-block">
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="通用名:" label-width="42%" prop="common_name">
                                    {{ form.common_name }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="组织单位:" label-width="42%">
                                    {{ form.org_unit }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="组织:" label-width="42%">
                                    {{ form.org }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="城市:" label-width="42%">
                                    {{ form.location }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="省份:" label-width="42%">
                                    {{ form.state }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="国家/地区:" label-width="42%">
                                    {{ form.country }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                    </div>
                </el-row>

            </el-form>
        </el-card>
        <el-dialog title="选择所属根证书" :visible.sync="certDialogVisible" width="35%">
            <el-row style="margin-top:-30px">
                <el-col>
                    <div class="downTree">
                        <el-tree :data="certList" check-strictly :expand-on-click-node="false" default-expand-all
                            node-key="id" ref="tree" highlight-current :props="certDefaultProps"
                            @check="(click, checked) => { handleCheckChange(click, checked) }">
                            <span class=" custom-tree-node" :class="data.class" slot-scope="{node ,data}">
                                <el-radio v-model="radio" :label="data.id" @change="organizationChange(data)">
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
                <el-button size="mini" type="primary" @click="addorganization()">确 定</el-button>
            </span>
        </el-dialog>

        <PinList ref="PinDialog" @PIN="PIN"></PinList>
    </div>
</template>
<script>
import PinList from "../CaCert/PinList.vue"
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    components: {
        PinList,
        borderTitle
    },
    data() {
        return {
            keyRadio: "",
            doubleRadio: "0",
            isEncryption: false,
            keyList: [],
            certDialogVisible: false,
            doubleKeyDialogVisible: false,
            name: "",
            mode: this.$route.query.mode,
            appcertId: this.$route.query.id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",
            organizationList: [],
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
            form: {
                organizationArr: [],
                cert_serial_name: "",
                appid: "",
                is_double: "0",
                cert_serial_number: "", // 根证书颁发机构id【根证书序列号】
                cert_type: "", // 证书型：signature 签名 encrypt 加密
                common_name: "", // 颁发机构名称【证书中的cn】
                country: "", // 国家/地区
                key_index: "", // 密钥索引
                key_algorithm: "", // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                location: "", // 城市
                org: "", // 组织
                pucPassword: "",
                org_unit: "", // 组织单位
                organization_id: "1", // 组织机构id
                state: "", // 省份
                app_env: "",//应用环境标识(机构标识)
                name: ""    //证书名称
            },

            pucPassword: "",
            rules: {
                organizationArr: [
                    {
                        required: true,
                        message: "请选择组织机构",
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
                key_index: [
                    {
                        required: true,
                        message: "请选择密钥索引",
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
                common_name: [
                    {
                        required: true,
                        message: "请输入组织/公司全称",
                        trigger: "blur"
                    }
                ],
                key_algorithm: [
                    {
                        required: true,
                        message: "请输入密钥类型",
                        trigger: "blur"
                    }
                ],
                appid: [
                    {
                        required: true,
                        message: "请选择所属应用",
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
                //     label: "SHA1_RSA",
                //     value: "SHA1WithRSA"
                // },
                // {
                //     label: "SHA256_RSA",
                //     value: "SHA256WithRSA"
                // },
                // {
                //     label: "SM3_SM2",
                //     value: "SM3WithSM2"
                // }
            ],
            typeObj1: { label: "", value: "" },
            typeObj2: { label: "", value: "" },
            typeObj3: { label: "", value: "" },
            typeObj4: { label: "", value: "" },
            formKey: {
                signature_name: "", // 签名证书名字
                encrypt_name: "", // 加密证书名字
                encryptKey_name: "", // 加密证书私钥
                signature_cert: "", // 签名证书
                encrypt_cert: "", // 加密证书
                encrypt_key_prv: "", // 加密证书私钥
                cert_serial_name: "",
                cert_serial_number: "",
                appid: "",
                sort1: "",
                app_env: "",//应用环境标识(机构标识)
                name: "", //证书名称
                organization_id: ""
            },
            rulesKey: {},
            certDefaultProps: {
                children: "children",
                label: "subject"
                // icon-class:"icon"
            },

            AppList: [],
            systemTypeList: [],
            ischeckList: [],
            isQianMing: false,
            keyUrl: "",
            isRSA: "",
            keyType1: "",
            keyType2: "",
            dataType: [],
            organizationList: [],
            isDoubleOrNot: true,
            encKeyTypeValue: "1",
            encrypt_key_type: "0016" //0016  sm2
        }
    },

    created() {
        if (this.mode == 1) {
            this.isDisable = true
            this.name = "外部证书管理详情"
            this.getAppcertDetail()
        } else if (this.mode == 2) {
            // this.isDisable = true;
            this.name = "导入外部证书"
        }

        this.actionUrl = this.$url.ImportCertExt
        // this.$nextTick(() => {
        //     this.$refs.form.resetFields();
        // });
        // this.actionUrl = this.$url.ImportCert;
        this.getAppList()
        this.MyHeader = {
            Authorization: window.sessionStorage.getItem("Authorization"),
            "Content-Type": "multipart/form-data"
        }
        // setInterval(() => {
        //     this.getAppList();
        // }, 30000);
        this.getResourceDetail("1")
        this.getResourceDetail("2")
    },
    watch: {
        doubleRadio(val) {
            if (val == "1") {
                this.isEncryption = true
            } else {
                this.isEncryption = false
            }
        },
        encKeyTypeValue(val) {
            if (val == "1") {
                this.encrypt_key_type = "0016"
            } else {
                this.encrypt_key_type = "sm2"
            }
        }
    },
    methods: {
        // 获取详情
        getResourceDetail(code) {
            this.loading = true
            let url = this.$url.ResourceGetByCode
            this.$commonJs
                .getMethodData(url, "POST", {
                    page: "applicationCertDetail",
                    code: code
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (code == "1") {
                            let string = res.data.data.content
                            let number = string.split("")
                            if (number[0] == 1) {
                                //this.keyTypeList.splice(1,1)
                                this.typeObj1.label = "SHA1_RSA"
                                this.typeObj1.value = "SHA1WithRSA"
                                this.keyTypeList.push(this.typeObj1)
                            }
                            if (number[1] == 1) {
                                this.typeObj2.label = "SHA256_RSA"
                                this.typeObj2.value = "SHA256WithRSA"
                                this.keyTypeList.push(this.typeObj2)
                            }
                            if (number[2] == 1) {
                                this.typeObj3.label = "SM3_SM2"
                                this.typeObj3.value = "SM3WithSM2"
                                this.keyTypeList.push(this.typeObj3)
                            }
                            if (number[3] == 1) {
                                this.typeObj4.label = "SM9"
                                this.typeObj4.value = "SM9"
                                this.keyTypeList.push(this.typeObj4)
                            }
                        } else {
                            if (res.data.data.content == 0) {
                                this.isDoubleOrNot = false
                            } else {
                                this.isDoubleOrNot = true
                            }
                        }
                    }
                    this.loading = false
                })
        },
        // 获取详情
        getAppcertDetail() {
            this.$commonJs.getLoading()
            let url
            // if (this.type == "isProject") {
            //     url = this.$url.GetDictionaryItemById;
            // } else {
            url = this.$url.GetAppcertExtById
            // }
            this.$commonJs
                .getMethodData(url, "POST", {
                    id: this.appcertId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // org 组织

                        this.form = res.data.data
                        this.form.organizationArr =
                            this.$commonJs.getFatherData(
                                this.organizationList,
                                (data) =>
                                    data.value == res.data.data.organization_id
                            )
                        // this.form.cert_serial_name =
                        //     res.data.attrs.cacert_subject;
                        this.getUndefined(
                            res.data.attrs.cacert_subject,
                            "cert_serial_name"
                        )

                        // this.form.org = res.data.attrs.O;
                        this.getUndefined(res.data.attrs.subject.o, "org")

                        // this.form.location = res.data.attrs.L;
                        this.getUndefined(res.data.attrs.subject.l, "location")

                        // this.form.country = res.data.attrs.C;
                        this.getUndefined(res.data.attrs.subject.c, "country")

                        // org_unit 组织单位
                        // this.form.org_unit = res.data.attrs.OU;
                        this.getUndefined(res.data.attrs.subject.ou, "org_unit")

                        // state 省份
                        // if (res.data.attrs.ST != undefined) {
                        //     this.form.state = res.data.attrs.ST;
                        // } else {
                        //     this.form.state = "";
                        // }
                        this.getUndefined(res.data.attrs.subject.st, "state")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
                })
        },
        getUndefined(data, type) {
            // debugger;
            if (data != undefined) {
                if (data != "null") {
                    this.form[type] = data
                }
            } else {
                this.form[type] = ""
            }
        },
        getAppList() {
            this.AppList = []
            let organization_id = ""
            if (this.$commonJs.getStorage().organization_id != "1") {
                organization_id = this.$commonJs.getStorage().organization_id
            }
            this.$commonJs
                .getMethodData(this.$url.GetList, "POST", {
                    organization_id: organization_id,
                    status: "20"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        let dataList = res.data.data
                        dataList.forEach((item) => {
                            this.AppList.push({
                                label: item.name,
                                value: item.appid
                            })
                        })
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getKeyList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.pageNow = newPage
            this.getKeyList()
        },
        organizationChange(data) {
            console.log(data, "data")
            this.ischeckList = [data]
        },
        handleSelectionChange(val) {
            console.log(val, "val")
        },
        getRadio(row) {
            this.keyRadio = row.KeyIndex
        },
        infoorganization() {
            this.radio = ""
            this.certDialogVisible = false
            this.doubleKeyDialogVisible = false
        },
        addorganization() {
            if (this.ischeckList.length < 1) {
                this.$message.error("请选择所属根证书!")
                return false
            } else {
                if (this.isCertList == "fenpei") {
                    this.formKey.cert_serial_name = this.ischeckList[0].subject
                    this.formKey.cert_serial_number =
                        this.ischeckList[0].serial_number
                    this.certDialogVisible = false
                }
            }
        },
        addKeyIndex() {
            this.doubleKeyDialogVisible = false
            this.form.key_index = this.keyRadio
        },
        handleSuccess(file) {
            console.log(file, "file")

            if (file.code == 100000) {
                this.$message.success("上传成功!")
                this.showFile = true
                this.$router.push("/applicationCertList")
            }
            // else {
            //     this.fileList = [];
            //     this.$message.error(file.msg);
            //     this.showFile = false;
            // }
            this.loading = false
            return
        },

        changeFile(file, fileList) {
            // console.log(fileList, "fileList");
            this.fileList = fileList
            this.formKey.signature_name = file.name
            // this.fileLoading = true;
            // this.$commonJs.getLoading();
        },
        changeFile1(file, fileList) {
            // console.log(fileList, "fileList");
            this.fileList1 = fileList
            this.formKey.encrypt_name = file.name
        },
        changeFile2(file, fileList) {
            this.fileList2 = fileList
            this.formKey.encryptKey_name = file.name
        },
        openPin() {
            // if (this.doubleRadio == "1") {
            //     this.$refs.PinDialog.modifyFormdialog = true
            //     this.$refs.PinDialog.modifyForm.PINStr = ""
            //     this.$refs.PinDialog.title = "私钥访问控制码"
            //     this.$refs.PinDialog.PIN = "私钥访问控制码"
            // } else {
            //     this.submitUpload()
            // }
            this.submitUpload()
        },
        PIN(val) {
            this.pucPassword = val
            this.submitUpload()
        },
        submitUpload() {
            let formData = new FormData()
            //   <!-- 将上传的文件放到数据对象中 -->
            if (this.formKey.appid != "") {
                formData.append("appid", this.formKey.appid)
            } else {
                return this.$message.error("请选择应用!")
            }
            formData.append(
                "organization_id",
                this.$commonJs.getStorage().organization_id
            )
            formData.append(
                "app_env ",
                this.formKey.app_env
            )
            formData.append(
                "name ",
                this.formKey.name
            )
            if (this.fileList.length != 0) {
                formData.append("signature_cert", this.fileList[0].raw)
            } else {
                return this.$message.error("请选择签名证书!")
            }
            this.$http
                .post(this.actionUrl, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("上传成功!")
                        this.cancel()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        handleRemove(file, fileList) {
            this.fileList = []
        },
        handleRemove1(file, fileList) {
            this.fileList1 = []
        },
        handleRemove2(file, fileList) {
            this.fileList2 = []
        },
        handlePreview(file) {
            console.log(file)
        },
        getUploadFile(file) { },
        cancel() {
            this.$router.push("/applicationCertExtList")
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

.el-form {
    .el-form-item {
        /deep/ .el-form-item__label {
            font-weight: 600;
            font-size: 15px;
        }
    }
}
</style>
