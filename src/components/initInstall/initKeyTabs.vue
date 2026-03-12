<template>
    <div v-loading="loading">
        <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:30px;height:550px">
            <el-tab-pane label="SM2密钥">
                <el-row :gutter="20">
                    <el-col :span="16" style="width:100%">
                        <div style="margin-top:0px;margin-bottom:0px">
                            <el-button style="margin-left:10px;width:5%" type="primary" @click="addKey('1')" size="mini">生成密钥</el-button>
                        </div>
                        <initKeyList :keyType="1" :isInit='isInit'></initKeyList>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="RSA密钥">
                <el-row :gutter="20">
                    <el-col :span="16" style="width:100%">
                        <div style="margin-top:0px;margin-bottom:0px">
                            <el-button style="margin-left:10px;width:5%" type="primary" @click="addKey('2')" size="mini">生成密钥</el-button>
                        </div>
                        <initKeyList :keyType="2" :isInit='isInit'></initKeyList>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="kek密钥">
                <el-row :gutter="20">
                    <el-col :span="16" style="width:100%">
                        <div style="margin-top:0px;margin-bottom:0px">
                            <el-button style="margin-left:10px;width:5%" type="primary" @click="addKey('3')" size="mini">生成密钥</el-button>
                        </div>
                        <initKeyList :keyType="3" :isInit='isInit'></initKeyList>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>

        <el-dialog :title="keyName" :visible.sync="dialogVisible" :width="dialogWidth">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="3">
                        <el-row>
                            <el-col :span="13">
                                <el-form-item label="密钥索引:" label-width="31%" prop="start">
                                    <el-select style="width:120px;" v-model="form.start" @change="indexChange" placeholder="请选择索引">
                                        <el-option v-for="item in indexValList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <span style="margin-left:10px">-</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item id="indexStyle">
                                    <el-select style="margin-left:-65%;width:120px" @change="indexChangeTwo" v-model="form.end" placeholder="请选择索引">
                                        <el-option v-for="item in indexValList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col style="margin-left: 17%;margin-top: -12px;color:#d2cdcd"> (例: 从1到5 选: 1-5 默认值为: 1-1)</el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col>
                        <el-form-item label="密钥模长:" label-width="31%" prop="uiKeyBits" style="margin-left:-10px">
                            <el-radio style="margin-left:10px" v-model="form.uiKeyBits" :label="uiKeyBitsLabel" v-if="uiKeyBitsLabel!=''">{{uiKeyBitsLabel}}</el-radio>
                            <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel1" v-if="uiKeyBitsLabel1!=''">{{uiKeyBitsLabel1}}</el-radio>
                            <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel2" v-if="uiKeyBitsLabel2!=''">{{uiKeyBitsLabel2}}</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px" v-if="keyType != '3'">
                    <el-col>
                        <el-form-item label="密钥用途:" label-width="31%" prop="type " style="margin-left:-10px">
                            <el-radio style="margin-left:10px" v-model="form.type " :label="QianMing">签名</el-radio>
                            <el-radio v-model="form.type " :label="JiaMi">加密</el-radio>
                            <el-radio v-model="form.type " :label="All">签名和加密</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px" v-if="keyType !='3'">
                    <el-col :offset="2">
                        <el-form-item label="私钥访问控制码:" label-width="30%" prop="pucPIN" style="margin-left:-5px">
                            <el-input class="searchInputClass colorStyle PINStr" style="width:60%;" v-model="form.pucPIN" @focus="removeColor" prefix-icon="el-icon-lock" :type="flag ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag = !flag"></i>
                            </el-input>
                            <!-- <el-input style="width:60%;" v-model="form.pucPIN" type="text" @focus="removeColor" placeholder="请输入私钥访问控制码" class="searchInputClass colorStyle PINStr"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="resetFields()" size="mini" type="warning">取 消</el-button>
                <el-button type="primary" @click="addRSA('form')" size="mini">确 定</el-button>

            </span>
        </el-dialog>
    </div>
</template>
<script>
import { number } from "echarts"
import initKeyList from "../initInstall/initKeyList.vue"
import $ from "jquery"
export default {
    components: {
        initKeyList
    },
    props: {
        keyTypeStr: {
            type: String
        },
        isInit: {
            type: Boolean
        },
        Refresh: {
            type: String
        }
    },
    data() {
        return {
            flag: true,
            uiKeyBitsLabel: "",
            uiKeyBitsLabel1: "",
            uiKeyBitsLabel2: "",
            QianMing: "",
            JiaMi: "",
            All: "",
            keyType: "1",
            keyName: "",
            loading: false,
            form: {
                start: "1",
                end: "1",
                type: "sig_rsa",
                uiKeyBits: "1024",
                pucPIN: "12345678" // 私钥控制码
            },
            rules: {
                start: [
                    {
                        required: true,
                        message: "请选择索引",
                        trigger: "blur"
                    }
                ],
                pucPIN: [
                    {
                        required: true,
                        message: "请输入私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                uiKeyBits: [
                    {
                        required: true,
                        message: "请选择模长",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择用途",
                        trigger: "blur"
                    }
                ]
            },
            countList: {},
            indexValList: [],
            dialogVisible: false,
            dialogWidth: "30%"
        }
    },
    created() {
        this.getDeviceConfGet()
        if (this.$commonJs.getScreenWidth() <= 1600) {
            this.dialogWidth = "42%"
        }
    },
    methods: {
        // 获取详情
        getResourceDetail(code) {
            this.loading = true
            let url = this.$url.ResourceGetByCode
            this.$commonJs
                .getMethodData(url, "POST", {
                    page: "initInstallList",
                    code: code
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        let result = res.data.data.content
                        let resultArr = result.split(",")
                        this.uiKeyBitsLabel = resultArr[0]
                        this.uiKeyBitsLabel1 = resultArr[1]
                        this.uiKeyBitsLabel2 = resultArr[2]
                    }
                    this.loading = false
                })
        },
        getDeviceConfGet() {
            let url
            if (this.isInit == true) {
                url = this.$url.HSMInitDeviceConfGet
            } else {
                url = this.$url.DeviceConfGet
            }
            this.$commonJs.getMethodData(url, "POST", {}).then((res) => {
                if (res.data.code == 100000) {
                    this.countList = res.data.data
                    console.log(this.countList, "this.countList")
                }
            })
        },
        handleClick(tab, event) {
            console.log(tab, event)
            if (tab.label == "SM2密钥") {
                this.keyType = "1"
            }
            if (tab.label == "RSA密钥") {
                this.keyType = "2"
            }
            if (tab.label == "Ukey密钥") {
                this.keyType = "3"
            }
        },
        // 点击生成密钥
        addKey(type) {
            this.keyType = type
            let num = 0
            console.log(this.keyType, "this.keyType ")
            if (this.keyType == "1") {
                this.keyName = "添加SM2密钥"
                this.QianMing = "sig_sm2"
                this.JiaMi = "enc_sm2"
                this.All = "sm2"
                // this.uiKeyBitsLabel = "256"
                // this.uiKeyBitsLabel1 = "512"
                this.getResourceDetail(1)
                this.form.uiKeyBits = "256"
                this.form.type = "sig_sm2"
                num = this.countList.sm2_key_count
            } else if (this.keyType == "2") {
                this.keyName = "添加RSA密钥"
                this.QianMing = "sig_rsa"
                this.JiaMi = "enc_rsa"
                this.All = "rsa"
                // this.uiKeyBitsLabel = "1024"
                // this.uiKeyBitsLabel1 = "2048"
                this.getResourceDetail(2)
                this.form.uiKeyBits = "1024"
                this.form.type = "sig_rsa"
                num = this.countList.rsa_key_count
            } else {
                this.keyName = "添加对称密钥"
                // this.uiKeyBitsLabel = "128"
                // this.uiKeyBitsLabel1 = "256"
                this.getResourceDetail(3)
                this.form.uiKeyBits = "128"
                this.form.type = "kek"
                num = this.countList.kek_count
            }

            this.dialogVisible = true
            this.indexValList = []
            for (var i = 1; i <= num; i++) {
                this.indexValList.push({
                    label: i,
                    value: i
                })
            }
        },
        // 生成密钥
        addRSA(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                let url
                if (this.isInit == true) {
                    url = this.$url.HSMInitGenerateKeyByType
                } else {
                    url = this.$url.GenerateKeyByType
                }
                if (this.keyType == "1") {
                    this.loading = true
                    this.$message.success("正在生成密钥,请等待!")
                    // this.resetFields();
                    this.dialogVisible = false
                    this.$commonJs
                        .getMethodData(url, "POST", this.form)
                        .then((res) => {
                            this.resetFields()
                            if (res.data.code == 100000) {
                                this.loading = false
                                setTimeout(() => {
                                    this.$alert("生成SM2密钥成功.", "提示", {
                                        confirmButtonText: "确定",
                                        type: "success"
                                    })
                                        .then((res) => {
                                            this.keyType = ""
                                            this.isMakeKey = true
                                            // this.reload()
                                            window.location.reload()
                                            //this.submit()
                                        })
                                        .catch((err) => {
                                            this.dialogVisible = false
                                            this.keyType = ""
                                        })
                                }, 300)
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                } else if (this.keyType == "2") {
                    this.loading = true
                    this.$message.success("正在生成密钥,请等待!")
                    // this.resetFields();
                    this.dialogVisible = false
                    this.$commonJs
                        .getMethodData(url, "POST", this.form)
                        .then((res) => {
                            this.resetFields()
                            if (res.data.code == 100000) {
                                this.loading = false
                                setTimeout(() => {
                                    this.$alert("生成RSA密钥成功.", "提示", {
                                        confirmButtonText: "确定",
                                        type: "success"
                                    })
                                        .then((res) => {
                                            this.keyType = ""
                                            this.isMakeKey = true
                                            // this.reload()
                                            window.location.reload()
                                            //this.submit()
                                        })
                                        .catch((err) => {
                                            this.dialogVisible = false
                                            this.keyType = ""
                                        })
                                }, 300)
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                } else {
                    this.loading = true
                    this.$message.success("正在生成密钥,请等待!")
                    // this.resetFields();
                    this.dialogVisible = false
                    this.$commonJs
                        .getMethodData(url, "POST", this.form)
                        .then((res) => {
                            this.resetFields()
                            if (res.data.code == 100000) {
                                this.loading = false
                                setTimeout(() => {
                                    this.$alert("生成对称密钥成功.", "提示", {
                                        confirmButtonText: "确定",
                                        type: "success"
                                    })
                                        .then((res) => {
                                            this.keyType = ""
                                            // this.reload()
                                            window.location.reload()
                                            // this.isMakeKey = true;
                                            //this.submit()
                                        })
                                        .catch((err) => {
                                            this.dialogVisible = false
                                            this.keyType = ""
                                        })
                                }, 300)
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                }
            })
        }, // 索引范围
        indexChange(data) {
            this.form.end = data
        },
        // 索引范围
        indexChangeTwo(data) {
            if (data < this.form.start) {
                this.form.end = this.form.start
                this.$message.error("输入范围有误!")
            }
        },
        removeColor() {
            $(".PINStr").removeClass("colorStyle")
            this.form.pucPIN = ""
        },
        resetFields() {
            this.dialogVisible = false
            this.$refs.form.resetFields()
            this.form.end = "1"
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-dialog {
    height: 400px;
    margin-top: 23vh !important;
    padding: 0 !important;
    border-radius: 5px !important;
    .el-dialog__body {
        padding: 0px 16px !important;
        padding-top: 5px !important;
    }
    .el-dialog__header {
        padding: 13px 15px 10px !important;
    }
}
/deep/ .colorStyle .el-input__inner {
    color: #d0cdcd;
}
</style>