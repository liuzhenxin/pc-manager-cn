<template>
    <div v-loading="loading">
        <el-row :gutter="20">
            <el-col :span="16" style="width:100%">
                <div style="margin-top:20px;margin-bottom:20px">
                    <el-button style="margin-left:10px;width:8%" type="primary" @click="addKey('1')" size="mini">生成设备密钥</el-button>
                </div>
                <initKeyList @keyAllNum="keyAllNum" :key="Refresh" :isInit='isInit'></initKeyList>
            </el-col>
        </el-row>

        <el-dialog :title="keyName" :visible.sync="dialogVisible" :width="dialogWidth">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col :offset="2">
                        <el-form-item label="私钥访问控制码:" label-width="30%" prop="pucPIN" style="margin-left:-5px">
                            <el-input class="searchInputClass colorStyle PINStr" style="width:60%;" v-model="form.pucPIN" @focus="removeColor" prefix-icon="el-icon-lock" :type="flag ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag = !flag"></i>
                            </el-input>
                            <!-- <el-input style="width:60%;" v-model="form.pucPIN" type="text" @focus="removeColor" placeholder="请输入私钥访问控制码" class="searchInputClass colorStyle PINStr"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col :offset="2">
                        <el-form-item label="确认私钥访问控制码:" label-width="30%" prop="surePucPIN" style="margin-left:-5px">
                            <el-input class="searchInputClass colorStyle surePINStr" style="width:60%;" v-model="form.surePucPIN" @focus="removeColor1" prefix-icon="el-icon-lock" :type="flag ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag = !flag"></i>
                            </el-input>
                            <!-- <el-input style="width:60%;" v-model="form.pucPIN" type="text" @focus="removeColor" placeholder="请输入私钥访问控制码" class="searchInputClass colorStyle PINStr"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- <span slot="footer" class="dialog-footer"> -->
            <div class="dialogDiv">
                <el-button @click="resetFields()" size="mini" type="warning">取 消</el-button>
                <el-button type="primary" @click="addDevKey('form')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { number } from "echarts"
import initKeyList from "./initDeviceKeyList.vue"
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
            keyName: "",
            loading: false,
            countList: {},
            indexValList: [],
            dialogVisible: false,
            dialogWidth: "30%",
            form: {
                uiKeyIndex: 1,
                type: "devAll",
                pucPIN: "",
                surePucPIN: ""
            },
            rules: {
                pucPIN: [
                    {
                        required: true,
                        message: "请输入私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                surePucPIN: [
                    {
                        required: true,
                        message: "请输入确认私钥访问控制码",
                        trigger: "blur"
                    }
                ]
            }
        }
    },
    created() {
        if (this.$commonJs.getScreenWidth() <= 1600) {
            this.dialogWidth = "42%"
        }
    },
    methods: {
        keyAllNum(val) {
            this.$emit("keyAllNum", val)
        },
        // 点击生成密钥
        addKey(type) {
            let num = 0
            this.keyName = "生成设备密钥对"
            this.dialogVisible = true
        },
        // 生成密钥
        addDevKey(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                let url
                if (this.isInit == true) {
                    url = this.$url.HSMInitGenerateDevKey
                } else {
                    url = this.$url.GenerateDevKey
                }
                this.loading = true
                this.$commonJs
                    .getMethodData(url, "POST", this.form)
                    .then((res) => {
                        this.loading = false
                        this.resetFields()
                        if (res.data.code == 100000) {
                            this.$message.success("生成设备密钥成功")
                            this.Refresh = new Date().getTime()
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                    })
            })
        },
        removeColor() {
            this.form.pucPIN = ""
        },
        removeColor1() {
            this.form.surePucPIN = ""
        },
        resetFields() {
            this.dialogVisible = false
            this.$refs.form.resetFields()
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-dialog {
    height: 300px;
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
.dialogDiv {
    text-align: center;
}
</style>