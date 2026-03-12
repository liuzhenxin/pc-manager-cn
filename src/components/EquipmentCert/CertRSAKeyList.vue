<template>
    <div class="navItem" v-loading="createdLoading">
        <el-card>
            <el-row>
                <el-col :span="10">
                    <div style="margin-top:20px;" class="boxStyle">本页用于管理RSA密钥,包括生成,删除和设置访问控制码</div>
                </el-col>
                <el-col :span="14">
                    <keyLogo :isMakeKey='1'></keyLogo>
                </el-col>
            </el-row>

            <div style="margin-bottom:10px;margin-top:30px">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addSymmetricKey">批量创建</el-button>
                <!-- <el-button type="primary" size="mini" icon="el-icon-upload" @click="importKey">导入</el-button>
                <el-button type="primary" size="mini" icon="el-icon-upload" @click="exportKey">导出公钥</el-button>
                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteKey">删除</el-button>
                <el-button type="primary" size="mini" icon="el-icon-folder" @click="makeCard">生成证书请求</el-button> -->
            </div>
        </el-card>
        <el-card>
            <el-table ref="symmetricTable" v-loading="loading" :data="RSAkeyList" :span-method="objectSpanMethod" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                <el-table-column label="用途">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_RSA == undefined">加密</span>
                        <span v-if="scope.row.SDFE_UEK_RSA == undefined">签名</span>
                    </template>
                </el-table-column>
                <el-table-column label="密钥长度">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_RSA == undefined">
                            <span v-if="scope.row.SDFE_UEK_RSA.uiKeyLen =='0'">-</span>
                            <span v-else>{{scope.row.SDFE_UEK_RSA.uiKeyLen}}</span>
                        </span>
                        <span v-if="scope.row.SDFE_UEK_RSA == undefined">
                            <span v-if="scope.row.SDFE_USK_RSA.uiKeyLen =='0'">-</span>
                            <span v-else>{{scope.row.SDFE_USK_RSA.uiKeyLen}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.SDFE_USK_RSA == undefined">
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-if="scope.row.SDFE_UEK_RSA.uiKeyLen =='0'" type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-else type="text" size="mini" class="el-icon-edit" style="color: #409EFF">更新</el-button>
                            <el-button @click.native.stop="xiangqing(scope.row,3)" :disabled="scope.row.SDFE_UEK_RSA.uiKeyLen =='0'" type="text" size="mini" class="el-icon-edit" style="color: #67C23A">修改访问码</el-button>
                            <el-button :disabled="scope.row.SDFE_UEK_RSA.uiKeyLen =='0'" @click.native.stop="deleteKey(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>
                        </div>
                        <div v-if="scope.row.SDFE_UEK_RSA == undefined">
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-if="scope.row.SDFE_USK_RSA.uiKeyLen =='0'" type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-else type="text" size="mini" class="el-icon-edit" style="color: #409EFF">更新</el-button>
                            <el-button @click.native.stop="xiangqing(scope.row,3)" :disabled="scope.row.SDFE_USK_RSA.uiKeyLen =='0'" type="text" size="mini" class="el-icon-edit" style="color: #67C23A">修改访问码</el-button>
                            <el-button :disabled="scope.row.SDFE_USK_RSA.uiKeyLen =='0'" @click.native.stop="deleteKey(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>

                        </div>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>

            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="3" layout="total, sizes, prev, pager, next, jumper" :total="RSAkeyList.length/2">
            </el-pagination>
        </el-card>
        <el-dialog :title="keyName" :visible.sync="dialogVisible" :width="dialogWidth">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20" v-if="Isbatch!=1">
                    <el-col :offset="2">
                        <el-row>
                            <el-col :span="13">
                                <el-form-item label="密钥索引:" label-width="32%" prop="uiKeyIndexRangeStart">
                                    <el-select style="width:120px;" v-model="form.uiKeyIndexRangeStart" @change="indexChange" placeholder="请选择索引">
                                        <el-option v-for="item in indexValList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <span style="margin-left:10px">-</span>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8">
                                <el-form-item id="indexStyle">
                                    <el-select style="margin-left:-62%;width:120px" @change="indexChangeTwo" v-model="form.uiKeyIndexRangeEnd" placeholder="请选择索引">
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
                        <!-- <span class="titleLabel" style="width:35px">模长:</span> -->
                        <el-form-item label="密钥模长:" label-width="17%" prop="uiKeyBits">
                            <el-radio style="margin-left:10px" v-model="form.uiKeyBits" label="1024">1024</el-radio>
                            <el-radio v-model="form.uiKeyBits" label="2048">2048</el-radio>
                            <!-- <el-select style="width:68.5%;" v-model="form.uiKeyBits" placeholder="请选择模长">
                                <el-option v-for="item in dieList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20" style="margin-top:10px" v-if="isImport =='1'">
                <el-col :offset="3">
                    <span class="titleLabel" style="width:35px">私钥:</span>
                    <el-button style="margin-left:10px" type="primary" plain size="mini" icon="el-icon-upload">上传</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px" v-if="isImport =='4'">
                <el-col :offset="3">
                    <span class="titleLabel" style="width:35px">公钥:</span>
                    <el-button style="margin-left:10px" type="primary" plain size="mini" icon="el-icon-upload">下载</el-button>
                </el-col>
            </el-row> -->
                <el-row :gutter="20" style="margin-top:10px" v-if="Isbatch!=1">
                    <el-col :offset="2">
                        <el-form-item label="密钥用途:" label-width="17%" prop="uiKeyType">
                            <el-radio style="margin-left:10px" v-model="form.uiKeyType" label="6">签名</el-radio>
                            <el-radio v-model="form.uiKeyType" label="8">加密</el-radio>
                            <el-radio v-model="form.uiKeyType" label="68" v-if="isImport !='1' && isImport !='4'">签名和加密</el-radio>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col :offset="2">
                        <el-form-item label="私钥访问控制码:" label-width="26%" prop="pucPINStr" style="margin-left:-5px">
                            <!-- <el-input style="width:60%;" v-model="form.pucPINStr" type="text" @focus="removeColor" placeholder="请输入私钥访问控制码" class="searchInputClass colorStyle PINStr"></el-input> -->
                            <el-input class="searchInputClass colorStyle PINStr" style="width:60%;" v-model="form.pucPINStr" @focus="removeColor" prefix-icon="el-icon-lock" :type="flag ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag = !flag"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose('dialogVisible')" size="mini" type="warning">取 消</el-button>
                <el-button type="primary" @click="addKey('form')" size="mini">确 定</el-button>

            </span>
        </el-dialog>
        <el-dialog title="修改密钥私钥访问控制码" :visible.sync="modifyFormdialog" width="30%" :before-close="handleClose">
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
                <el-button size="mini" @click="handleClose('modifyForm')">取 消</el-button>
                <el-button size="mini" type="primary" @click="addPINStr('modifyForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import keyLogo from "../Keys/keyLogo.vue"
import $ from "jquery"

export default {
    components: {
        keyLogo
    },
    data() {
        return {
            flag: true,
            dialogWidth: "30%",
            keyName: "",
            dialogVisible: false,
            loading: false,
            isImport: "",
            flag1: true,
            flag2: true,
            flag3: true,
            indexValList: [],
            keyVal: "",
            modifyFormdialog: false,
            form: {
                uiKeyIndexRangeStart: "1",
                uiKeyIndexRangeEnd: "1",
                uiKeyType: "6",
                uiKeyBits: "1024",
                pucPINStr: "12345678" // 私钥控制码
            },
            modifyForm: {
                newPucPIN: "",
                oldPucPIN: "",
                newPucPINStr1: "",
                uiKeyIndex: "",
                type: ""
            },
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
            rules: {
                uiKeyIndexRangeStart: [
                    {
                        required: true,
                        message: "请选择索引",
                        trigger: "blur"
                    }
                ],
                // uiKeyIndexRangeEnd: [
                //     {
                //         required: true,
                //         message: "请选择索引",
                //         trigger: "blur"
                //     }
                // ],
                uiKeyBits: [
                    {
                        required: true,
                        message: "请选择模长",
                        trigger: "blur"
                    }
                ],
                pucPINStr: [
                    {
                        required: true,
                        message: "请输入私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                uiKeyType: [
                    {
                        required: true,
                        message: "请选择用途",
                        trigger: "blur"
                    }
                ]
            },
            RSAkeyList: [
                {
                    key: "1",
                    useType: "用途",
                    die: "模长"
                },
                {
                    key: "1",
                    useType: "用途",
                    die: "模长"
                }
            ],
            dieList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "0",
                    label: "128"
                },
                {
                    value: "1",
                    label: "192"
                },
                {
                    value: "2",
                    label: "256"
                }
            ],
            pageNow: 1,
            pageSize: 5,
            total: 0,
            createdLoading: false,
            Isbatch: "",
            rowList: {}
        }
    },
    created() {
        this.getKeyState(1)
        if (this.$commonJs.getScreenWidth() <= 1600) {
            this.dialogWidth = "42%"
        }
    },

    methods: {
        getKeyState(type) {
            // let dataList = [];
            if (type != 1) {
                this.loading = true
            } else {
                this.createdLoading = true
            }
            this.RSAkeyList = []
            this.$commonJs
                .getMethodData(this.$url.GetRSAKeyState, "POST", {
                    keyNum: this.pageSize,
                    pageNum: this.pageNow
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // dataList.push(res.data.data);
                        let dataList = res.data.data
                        // this.RSAkeyList = res.data.data;
                        dataList.forEach((element) => {
                            console.log(element, "element")
                            if (element.SDFE_UEK_RSA != undefined) {
                                this.RSAkeyList.push(
                                    {
                                        KeyIndex: element.KeyIndex,
                                        SDFE_USK_RSA: element.SDFE_USK_RSA
                                    },
                                    {
                                        KeyIndex: element.KeyIndex,
                                        SDFE_UEK_RSA: element.SDFE_UEK_RSA
                                    }
                                )
                            }
                        })

                        this.loading = false
                        this.createdLoading = false
                        console.log(dataList, this.RSAkeyList, "res")
                        this.getRSAKeyCount()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                        this.createdLoading = false
                    }
                    console.log(res, "res")
                })
            // this.$commonJs
            //     .getMethodData(this.$url.GetKeyState, "POST", {
            //         // keynum *密钥个数
            //         keynum: 5,
            //         // uiKeyType *密钥类型
            //         uiKeyType: 8
            //     })
            //     .then((res) => {
            //         if (res.data.code == 100000) {
            //             dataList.push(res.data.data);
            //         } else {
            //             this.$message.error(res.data.msg);
            //         }
            //         console.log(res, "res");
            //     });

            console.log(this.RSAkeyList, "res")
        },
        removeColor() {
            $(".PINStr").removeClass("colorStyle")
            this.form.pucPINStr = ""
        },
        getRSAKeyCount() {
            this.$commonJs.deviceConfGet().then((res) => {
                this.total = res.data.data.rsa_key_count
                // console.log(dataList, "res");
            })
        },
        indexChange(data) {
            this.form.uiKeyIndexRangeEnd = data
        },
        indexChangeTwo(data) {
            if (data < this.form.uiKeyIndexRangeStart) {
                this.form.uiKeyIndexRangeEnd = this.form.uiKeyIndexRangeStart
                this.$message.error("输入范围有误!")
            }
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            // debugger;
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
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
                            // this.modifyForm.newPucPIN = Number(
                            //     this.modifyForm.newPucPIN
                            // );
                            // this.modifyForm.newPucPINStr1 = Number(
                            //     this.modifyForm.newPucPINStr1
                            // )
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
        handleClose(type) {
            if (type == "dialogVisible") {
                this.dialogVisible = false
                this.form.uiKeyIndexRangeEnd = "1"
                this.$refs.form.resetFields()
            } else {
                // this.modifyForm = {
                //     newPucPIN: "",
                //     oldPucPIN: "",
                //     newPucPINStr1: "",
                //     uiKeyIndex: "",
                //     uiKeyType: ""
                // };
                this.loading = false
                this.modifyFormdialog = false
                // this.modifyForm = {};
                this.$refs.modifyForm.resetFields()
            }
        },
        xiangqing(row) {
            this.modifyFormdialog = true
            if (row.SDFE_USK_RSA != undefined) {
                // 签名
                this.modifyForm.type = "sig_rsa"
            } else {
                this.modifyForm.type = "enc_rsa"
            }
            this.modifyForm.uiKeyIndex = row.KeyIndex
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
            $(".PINStr").addClass("colorStyle")

            this.keyName = "生成密钥"
            this.indexValList = []
            for (var i = 1; i <= this.total; i++) {
                this.indexValList.push({
                    label: i,
                    value: i
                })
            }
            this.Isbatch = type
            this.rowList = row
            console.log(this.rowList, "this.rowList")
            if (type == 1) {
                if (this.rowList.SDFE_USK_RSA != undefined) {
                    // 签名
                    if (this.rowList.SDFE_USK_RSA.uiKeyLen != 0) {
                        this.form.uiKeyBits =
                            this.rowList.SDFE_USK_RSA.uiKeyLen.toString()
                    }
                    this.form.uiKeyType = 6
                } else {
                    // 加密
                    if (this.rowList.SDFE_UEK_RSA.uiKeyLen != 0) {
                        this.form.uiKeyBits =
                            this.rowList.SDFE_UEK_RSA.uiKeyLen.toString()
                    }
                    this.form.uiKeyType = 8
                }
            }
        },
        addKey(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                // debugger;
                if (this.Isbatch == 1) {
                    this.form.uiKeyIndexRangeStart = this.rowList.KeyIndex
                    this.form.uiKeyIndexRangeEnd = this.rowList.KeyIndex
                }
                this.dialogVisible = false
                if (this.isImport == "") {
                    let keyAddName = "生成"
                    this.RSAkeyList.forEach((item) => {
                        if (item.SDFE_UEK_RSA != undefined) {
                            if (
                                item.KeyIndex ==
                                    this.form.uiKeyIndexRangeStart &&
                                item.SDFE_UEK_RSA.uiKeyLen != 0
                            ) {
                                keyAddName = "覆盖原来的"
                            }
                        }
                        if (item.SDFE_USK_RSA != undefined) {
                            if (
                                item.KeyIndex ==
                                    this.form.uiKeyIndexRangeStart &&
                                item.SDFE_USK_RSA.uiKeyLen != 0
                            ) {
                                keyAddName = "覆盖原来的"
                            }
                        }
                    })
                    // data = this.$commonJs.getScreenValue(data);
                    setTimeout(() => {
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
                                // this.$commonJs.getLoading();
                                this.loading = true
                                this.$commonJs
                                    .getMethodData(
                                        this.$url.GenerateRsaPair,
                                        "POST",
                                        this.form
                                    )
                                    .then((res) => {
                                        this.loading = false
                                        if (res.data.code == 100000) {
                                            // this.cancel();
                                            // this.createdLoading = false
                                            this.$message.success(
                                                "生成RSA密钥成功."
                                            )
                                            // this.$alert(
                                            //     "生成RSA密钥成功.",
                                            //     "提示",
                                            //     {
                                            //         confirmButtonText: "确定",
                                            //         type: "success"
                                            //     }
                                            // )
                                            //     .then((res) => {
                                            this.handleClose("dialogVisible")
                                            // })
                                            // .catch((err) => {
                                            //     this.handleClose(
                                            //         "dialogVisible"
                                            //     );
                                            // });
                                        } else if (res.data.code != 800000) {
                                            // this.createdLoading = false
                                            if (res.data.msg != null) {
                                                this.$message.error(
                                                    res.data.msg
                                                )
                                            }
                                        }
                                        this.form.uiKeyIndexRangeStart = "1"
                                        this.form.uiKeyIndexRangeEnd = "1"
                                        this.getKeyState()
                                        // this.dialogVisible = false;
                                    })
                                console.log("成功")
                            })
                            .catch((err) => {
                                this.form = {
                                    uiKeyIndexRangeStart: "1",
                                    uiKeyIndexRangeEnd: "1",
                                    uiKeyType: "6",
                                    uiKeyBits: "1024",
                                    pucPINStr: "12345678" // 私钥控制码
                                }
                            })
                    }, 500)
                } else if (this.isImport == "1") {
                    this.$alert("导入RSA密钥成功.", "提示", {
                        confirmButtonText: "确定",
                        type: "success"
                    })
                    this.dialogVisible = false
                } else if (this.isImport == "2") {
                    this.$confirm("是否永久删除RSA密钥?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then((res) => {
                            this.dialogVisible = false
                        })
                        .catch((err) => err)
                } else if (this.isImport == "4") {
                    this.$alert("导出RSA密钥成功.", "提示", {
                        confirmButtonText: "确定",
                        type: "success"
                    })
                    this.dialogVisible = false
                }
            })
        },
        importKey() {
            this.isImport = "1"
            this.dialogVisible = true
            this.keyName = "导入密钥"
        },
        exportKey() {
            this.isImport = "4"
            this.dialogVisible = true
            this.keyName = "导出公钥"
        },
        deleteKey(row) {
            this.$confirm("是否永久销毁RSA密钥?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then((res) => {
                    let dataVal = ""
                    if (row.SDFE_UEK_RSA != undefined) {
                        //加密
                        dataVal = 8
                    } else {
                        // 签名
                        dataVal = 6
                    }
                    this.$commonJs
                        .getMethodData(this.$url.DelUserKey, "POST", {
                            // uiKeyAlg - 删除密钥算法标识，暂不使用，默认为0
                            uiKeyAlg: 0,
                            // uiKeyIndex - 密钥内部索引号
                            uiKeyIndex: row.KeyIndex,
                            // 密钥类型
                            uiKeyType: dataVal
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res")
                                // this.$message.success(res.data.msg);
                                this.getKeyState()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                    console.log(row, "row")
                    this.dialogVisible = false
                })
                .catch((err) => err)
            // this.isImport = "2";
            // this.dialogVisible = true;
            // this.keyName = "删除密钥";
        },
        makeCard() {}
    }
}
</script>
<style lang="less" scoped>
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    // background: #f4f5f7;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #e6a23c;
    font-weight: 500;
}
/deep/ #indexStyle .el-form-item__error {
    margin-left: -65%;
}
/deep/ .colorStyle .el-input__inner {
    color: #d0cdcd;
}
</style>

                
          