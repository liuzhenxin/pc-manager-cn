<template>
    <div class="navItem" v-loading="createdLoading">
        <el-card>
            <el-row>
                <el-col :span="10">
                    <div style="margin-top:20px;" class="boxStyle">本页用于管理ML-DSA密钥对,包括生成,删除和设置访问控制码</div>
                </el-col>
                <el-col :span="14">
                    <keyLogo :isMakeKey='1'></keyLogo>
                </el-col>

            </el-row>

            <div style="margin-bottom:10px;margin-top:30px">
                <el-radio-group v-model="algoType" @change="algoTypeChange" style="margin-right:20px">
                    <el-radio label="mldsa">ML-DSA 签名</el-radio>
                    <el-radio label="mlkem">ML-KEM 封装</el-radio>
                </el-radio-group>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addSymmetricKey">批量创建</el-button>
            </div>
        </el-card>
        <el-card>
            <el-table ref="symmetricTable" v-loading="loading" :data="MLDSAkeyList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                <el-table-column label="用途">
                    <span>签名</span>
                </el-table-column>
                <el-table-column label="密钥长度">
                    <template slot-scope="scope">
                        <span>{{mlDsaLabel(scope.row.UIKeyLen_sig)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-if="scope.row.UIKeyLen_sig =='0'" type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
                        <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-else type="text" size="mini" class="el-icon-edit" style="color: #409EFF">更新</el-button>
                        <el-button @click.native.stop="xiangqing(scope.row)" :disabled="scope.row.UIKeyLen_sig =='0'" type="text" size="mini" class="el-icon-edit" style="color:#67C23A">修改访问码</el-button>
                        <el-button :disabled="scope.row.UIKeyLen_sig =='0'" @click.native.stop="deleteKey(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="3" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog :title="keyName" :visible.sync="dialogVisible" :width="dialogWidth">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20" v-if="Isbatch!=1">
                    <el-col :offset="2">
                        <el-row>
                            <el-col :span="13">
                                <el-form-item label="密钥索引:" label-width="32%" prop="start">
                                    <el-select style="width:120px;" v-model="form.start" @change="indexChange" placeholder="请选择索引">
                                        <el-option v-for="item in indexValList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <span style="margin-left:10px">-</span>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8">
                                <el-form-item id="indexStyle">
                                    <el-select style="margin-left:-62%;width:120px" @change="indexChangeTwo" v-model="form.end" placeholder="请选择索引">
                                        <el-option v-for="item in indexValList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col style="margin-left: 17%;margin-top: -12px;color:#d2cdcd"> (例: 从1到5 选: 1-5 默认值为: 1-1)</el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px" v-if="isImport == '' && isImport !='2'">
                    <el-col :offset="2">
                        <el-form-item label="密钥模长/参数集:" label-width="26%" prop="uiKeyBits">
                            <template v-if="algoType=='mlkem'">
                                <el-radio style="margin-left:10px" v-model="form.uiKeyBits" label="512">512 (MLKEM-512)</el-radio>
                                <el-radio v-model="form.uiKeyBits" label="768">768 (MLKEM-768)</el-radio>
                                <el-radio v-model="form.uiKeyBits" label="1024">1024 (MLKEM-1024)</el-radio>
                            </template>
                            <template v-else>
                                <el-radio style="margin-left:10px" v-model="form.uiKeyBits" :label="uiKeyBitsLabel" v-if="uiKeyBitsLabel!=''">2560 (MLDSA-44)</el-radio>
                                <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel1" v-if="uiKeyBitsLabel1!=''">3168 (MLDSA-65)</el-radio>
                                <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel2" v-if="uiKeyBitsLabel2!=''">4896 (MLDSA-87)</el-radio>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px" v-if="Isbatch!=1">
                    <el-col :offset="2">
                        <el-form-item label="密钥用途:" label-width="17%" prop="type">
                            <el-radio style="margin-left:10px" v-model="form.type" label="mldsa">签名</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col :offset="2">
                        <el-form-item label="私钥访问控制码:" label-width="26%" prop="pucPIN" style="margin-left:-5px">
                            <el-input class="searchInputClass colorStyle PINStr" style="width:60%;" v-model="form.pucPIN" @focus="removeColor" prefix-icon="el-icon-lock" :type="flag4 ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag4 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag4 = !flag4"></i>
                            </el-input>
                            <span style="color: #da0909"> 默认:{{ form.defaultPucPIN }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose('dialogVisible')" size="mini" type="warning">取 消</el-button>
                <el-button type="primary" @click="addKey('form')" size="mini">确 定</el-button>

            </span>
        </el-dialog>
        <el-dialog title="修改密钥私钥访问控制码" :visible.sync="modifyFormdialog" :width="dialogWidth" :before-close="handleClose">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="原私钥访问控制码:" label-width="160px" prop="oldPucPIN">
                            <el-input style="width:75%" v-model="modifyForm.oldPucPIN" prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新私钥访问控制码:" label-width="160px" prop="newPucPIN">
                            <el-input style="width:75%" v-model="modifyForm.newPucPIN" placeholder="请输入私钥访问控制码" prefix-icon="el-icon-lock" :type="flag2 ? 'password' : 'text'">
                                <i slot="suffix" :class="[flag2 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag2 = !flag2"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确认私钥访问控制码:" label-width="170px" prop="newPucPINStr1" style="margin-left:-10px">
                            <el-input style="width:75%" v-model="modifyForm.newPucPINStr1" placeholder="请输入私钥访问控制码" prefix-icon="el-icon-lock" :type="flag3 ? 'password' : 'text'">
                                <i slot="suffix" :class="[flag3 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag3 = !flag3"></i>
                            </el-input>
                        </el-form-item>


                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()" size="mini">取 消</el-button>
                <el-button type="primary" @click="addPINStr('modifyForm')" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import keyLogo from "./keyLogo.vue"
import $ from "jquery"

export default {
    components: {
        keyLogo
    },
    data() {
        return {
            keyName: "",
            dialogWidth: "30%",
            dialogVisible: false,
            loading: false,
            createdLoading: false,
            isImport: "",
            radio: "1",
            indexValList: [],
            indexVal: "1",
            indexVal1: "1",
            keyVal: "",
            modifyForm: {
                newPucPIN: "",
                oldPucPIN: "",
                newPucPINStr1: "",
                uiKeyIndex: "",
                type: ""
            },
            modifyFormdialog: false,
            modifyRules: {
                newPucPIN: [
                    {
                        required: true,
                        message: "请输入新私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                oldPucPIN: [
                    {
                        required: true,
                        message: "请输入私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                newPucPINStr1: [
                    {
                        required: true,
                        message: "请确认私钥访问控制码",
                        trigger: "blur"
                    }
                ]
            },
            dieVal: "",
            MLDSAkeyList: [],
            algoType: "mldsa",
            form: {
                start: "1",
                end: "1",
                type: this.algoType,
                uiKeyBits: "2560",
                pucPIN: "",// 私钥控制码
                surePucPIN: "",// 私钥控制码
                defaultPucPIN: "" // 默认控制码
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
            flag4: true,
            flag1: true,
            flag2: true,
            flag3: true,
            pageNow: 1,
            pageSize: 10,
            total: 10,
            Isbatch: "",
            rowList: {},
            IsQianMing: "",
            uiKeyBitsLabel: "2560",
            uiKeyBitsLabel1: "3168",
            uiKeyBitsLabel2: "4896",
            uiKeyBitsLabel3: "",
            uiKeyBitsLabel4: "",
            uiKeyBitsLabel5: "",
            uiKeyBitsLabel6: "",
            uiKeyBitsLabel7: "",
            uiKeyBitsLabel8: ""
        }
    },
    created() {
        this.getKeyState(1)
        this.getResourceDetail("1")
        this.$commonJs.deviceConfGet().then((res) => {
            this.total = res.data.data.mldsa_num || res.data.data.mldsa_key_count || 0
        })
        if (this.$commonJs.getScreenWidth() <= 1600) {
            this.dialogWidth = "42%"
        }
    },
    methods: {
        algoTypeChange() {
            this.pageNow = 1
            this.form.uiKeyBits = this.algoType == "mlkem" ? "512" : "2560"
            this.form.type = this.algoType
            this.getKeyState(1)
        },
        mlDsaLabel(bits) {
            if (bits == "0" || bits == 0 || bits == "" || bits == undefined) return "-"
            if (bits == "2560" || bits == 2560) return "MLDSA-44"
            if (bits == "3168" || bits == 3168) return "MLDSA-65"
            if (bits == "4896" || bits == 4896) return "MLDSA-87"
            if (bits == "512" || bits == 512) return "MLKEM-512"
            if (bits == "768" || bits == 768) return "MLKEM-768"
            if (bits == "1024" || bits == 1024) return "MLKEM-1024"
            return bits
        },
        // 获取详情
        getResourceDetail(type) {
            this.loading = true
            let url = this.$url.ResourceGetByCode
            let currentPage = ""
            let code = ""
            if (type == "1") {
                currentPage = "AllKeysList"
                code = "1"
            } else {
                currentPage = ""
                code = ""
            }
            this.$commonJs
                .getMethodData(url, "POST", {
                    page: currentPage,
                    code: code
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        let result = res.data.data.content
                        if (type == "1") {
                            this.form.pucPIN = result
                            this.form.surePucPIN = result
                            this.form.defaultPucPIN = result
                        } else {
                        }
                    }
                    this.loading = false
                })
        },
        getKeyState(type) {
            if (type != 1) {
                this.loading = true
            } else {
                this.createdLoading = true
            }
            this.MLDSAkeyList = []
            this.$commonJs
                .getMethodData(this.$url.GetKeyStateByType, "POST", {
                    // keynum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow,
                    type: this.algoType
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        let dataList = res.data.data
                        dataList.forEach((element) => {
                            this.MLDSAkeyList.push({
                                KeyIndex: element.index,
                                KeyType: element.type,
                                SDFE_USK_SM2: element.sig_state,
                                UIKeyLen_sig: element.sig_bits
                            })
                        })

                        this.loading = false
                        this.createdLoading = false
                    } else {
                        this.$message.error(res.data.msg)
                        this.loading = false
                        this.createdLoading = false
                    }
                })
        },
        removeColor() {
            $(".PINStr").removeClass("colorStyle")
            this.form.pucPIN = ""
        },
        indexChange(data) {
            this.form.end = data
        },
        indexChangeTwo(data) {
            if (data < this.form.start) {
                this.form.end = this.form.start
                this.$message.error("输入范围有误!")
            }
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getKeyState()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.pageNow = newPage
            this.getKeyState()
        },
        addSymmetricKey(type, row) {
            this.isImport = ""
            this.dialogVisible = true
            this.keyName = "生成密钥"
            this.indexValList = []
            $(".PINStr").addClass("colorStyle")

            for (var i = 1; i <= this.total; i++) {
                this.indexValList.push({
                    label: i,
                    value: i
                })
            }
            this.Isbatch = type
            this.rowList = row
            if (type == 1) {
                // 签名
                this.form.uiKeyBits = this.rowList.UIKeyLen_sig.toString()
                this.form.type = this.algoType
            }
        },
        addKey(formName) {
            if (this.isImport == "") {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return
                    let keyAddName = "生成"
                    if (this.Isbatch == 1) {
                        this.form.start = this.rowList.KeyIndex
                        this.form.end = this.rowList.KeyIndex

                        if (this.rowList.UIKeyLen_sig != 0) {
                            keyAddName = "覆盖原来的"
                        }
                    }
                    this.dialogVisible = false

                    setTimeout(() => {
                        let url = this.$url.GenerateKeyByType
                        this.$confirm(
                            "是否确定要" + keyAddName + "密钥?",
                            "提示",
                            {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }
                        )
                            .then((res) => {
                                this.loading = true
                                this.$commonJs
                                    .getMethodData(url, "POST", this.form)
                                    .then((res) => {
                                        this.loading = false
                                        if (res.data.code == 100000) {
                                            this.$message.success(
                                                "生成ML-DSA密钥成功."
                                            )
                                            this.getKeyState()
                                        } else if (res.data.code != 800000) {
                                            this.$message.error(res.data.msg)
                                        }

                                        this.form.start = "1"
                                        this.form.end = "1"
                                        this.form.type = this.algoType
                                    })
                                this.handleClose("dialogVisible")
                                console.log("成功")
                            })
                            .catch(() => {
                                this.form.start = "1"
                                this.form.type = this.algoType
                                this.form.end = "1"
                            })
                    }, 500)
                })
            }
        },
        deleteKey(row) {
            this.$confirm("是否永久销毁ML-DSA密钥?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then((res) => {
                    this.$commonJs
                        .getMethodData(this.$url.DelUserKey, "POST", {
                            // alg - 算法
                            alg: this.algoType,
                            // uiKeyIndex - 密钥内部索引号
                            uiKeyIndex: row.KeyIndex,
                            // type - 密钥类型
                            type: this.algoType
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res")
                                this.$message.success("销毁成功！")
                                this.getKeyState()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                    console.log(row, "row")
                    this.dialogVisible = false
                })
                .catch((err) => err)
        },
        addPINStr(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                if (
                    this.modifyForm.newPucPIN !== this.modifyForm.newPucPINStr1
                ) {
                    this.$message.error(
                        "新私钥访问控制码和确认私钥访问控制码不一致!"
                    )
                    return false
                }
                this.modifyFormdialog = false
                setTimeout(() => {
                    this.$confirm("是否修改私钥访问控制码?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then((res) => {
                            this.loading = true
                            this.$commonJs
                                .getMethodData(
                                    this.$url.SetUserPriKeyPIN,
                                    "POST",
                                    this.modifyForm
                                )
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.handleClose()
                                        this.$message.success(
                                            "修改私钥访问控制码成功!"
                                        )
                                    } else if (res.data.code != 800000) {
                                        this.handleClose()
                                        this.$message.error(res.data.msg)
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
        handleClose(type) {
            if (type == "dialogVisible") {
                this.dialogVisible = false
                this.form.end = "1"
                this.$refs.form.resetFields()
            } else {
                this.loading = false
                this.modifyFormdialog = false
                this.$refs.modifyForm.resetFields()
            }
        },
        xiangqing(row) {
            this.modifyFormdialog = true
            this.modifyForm.type = this.algoType
            this.modifyForm.uiKeyIndex = row.KeyIndex
        }
    }
}
</script>
<style lang="less" scoped>
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #e6a23c;
    font-weight: 500;
}
/deep/ .colorStyle .el-input__inner {
    color: #d0cdcd;
}
</style>
