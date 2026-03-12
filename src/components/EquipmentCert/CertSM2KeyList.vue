<template>
    <div class="navItem" v-loading="createdLoading">
        <el-card>
            <el-row>
                <el-col :span="10">
                    <div style="margin-top:20px;" class="boxStyle">本页用于管理SM2密钥对,包括生成,删除和设置访问控制码</div>
                </el-col>
                <el-col :span="14">
                    <keyLogo :isMakeKey='1'></keyLogo>
                </el-col>

            </el-row>

            <div style="margin-bottom:10px;margin-top:30px">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addSymmetricKey">批量创建</el-button>
                <!-- <el-button type="primary" size="mini" icon="el-icon-upload" @click="importKey">导入</el-button> -->
                <!-- <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteKey">删除</el-button> -->
                <!-- <el-button type="primary" size="mini" icon="el-icon-folder" @click="makeCard">生成证书请求</el-button> -->
            </div>
        </el-card>
        <el-card>
            <el-table ref="symmetricTable" v-loading="loading" :data="SM2keyList" :span-method="objectSpanMethod" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                <el-table-column label="用途">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_SM2 == undefined">加密</span>
                        <span v-if="scope.row.SDFE_UEK_SM2 == undefined">签名</span>
                    </template>
                </el-table-column>
                <el-table-column label="密钥长度">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_SM2 == undefined">
                            <span v-if="scope.row.SDFE_UEK_SM2.uiKeyLen=='0'">-</span>
                            <span v-else>{{scope.row.SDFE_UEK_SM2.uiKeyLen}}</span>
                        </span>
                        <span v-if="scope.row.SDFE_UEK_SM2 == undefined">
                            <span v-if="scope.row.SDFE_USK_SM2.uiKeyLen == '0'">-</span>
                            <span v-else>{{scope.row.SDFE_USK_SM2.uiKeyLen}}</span>
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="用途" prop="useType"></el-table-column>
                <el-table-column label="模长" prop="die"></el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.SDFE_USK_SM2 == undefined">
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-if="scope.row.SDFE_UEK_SM2.uiKeyLen =='0'" type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-else type="text" size="mini" class="el-icon-edit" style="color: #409EFF">更新</el-button>
                            <el-button @click.native.stop="xiangqing(scope.row,3)" :disabled="scope.row.SDFE_UEK_SM2.uiKeyLen =='0'" type="text" size="mini" class="el-icon-edit" style="color: #67C23A">修改访问码</el-button>
                            <el-button :disabled="scope.row.SDFE_UEK_SM2.uiKeyLen =='0'" @click.native.stop="deleteKey(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>
                        </div>
                        <div v-if="scope.row.SDFE_UEK_SM2 == undefined">
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-if="scope.row.SDFE_USK_SM2.uiKeyLen =='0'" type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-else type="text" size="mini" class="el-icon-edit" style="color: #409EFF">更新</el-button>
                            <el-button @click.native.stop="xiangqing(scope.row,3)" :disabled="scope.row.SDFE_USK_SM2.uiKeyLen =='0'" type="text" size="mini" class="el-icon-edit" style="color:#67C23A">修改访问码</el-button>
                            <el-button :disabled="scope.row.SDFE_USK_SM2.uiKeyLen =='0'" @click.native.stop="deleteKey(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>

                        </div>
                        <!-- <el-button @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改访问码</el-button>
                        <el-button @click.native.stop="deleteKey(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button> -->
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
                            <el-radio style="margin-left:10px" v-model="form.uiKeyBits" label="256">256</el-radio>
                            <!-- <el-radio v-model="form.uiKeyBits" label="512" disabled>512</el-radio> -->
                            <!-- <el-select style="width:68.5%;" v-model="form.uiKeyBits" placeholder="请选择模长">
                                <el-option v-for="item in dieList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px" v-if="Isbatch!=1">
                    <el-col :offset="2">
                        <el-form-item label="密钥用途:" label-width="17%" prop="uiKeyType">
                            <el-radio style="margin-left:10px" v-model="form.uiKeyType" label="5">签名</el-radio>
                            <el-radio v-model="form.uiKeyType" label="7">加密</el-radio>
                            <el-radio v-model="form.uiKeyType" label="57" v-if="isImport !='1' && isImport !='4'">签名和加密</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col :offset="2">
                        <el-form-item label="私钥访问控制码:" label-width="26%" prop="pucPINStr" style="margin-left:-5px">
                            <el-input class="searchInputClass colorStyle PINStr" style="width:60%;" v-model="form.pucPINStr" @focus="removeColor" prefix-icon="el-icon-lock" :type="flag4 ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag4 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag4 = !flag4"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- <el-row :gutter="20" style="margin-top:10px" v-if="isImport =='1'">
                <el-col :offset="3">
                    <span class="titleLabel" style="width:35px">私钥:</span>
                    <el-button style="margin-left:10px" type="primary" plain size="mini" icon="el-icon-upload">上传</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px" v-if="isImport =='1'">
                <el-col :offset="3">
                    <span class="titleLabel" style="width:35px">公钥:</span>
                    <el-button style="margin-left:10px" type="primary" plain size="mini" icon="el-icon-upload">上传</el-button>
                </el-col>
            </el-row> -->

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
import keyLogo from "../Keys/keyLogo.vue"
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
            SM2keyList: [
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
            form: {
                uiKeyIndexRangeStart: "1",
                uiKeyIndexRangeEnd: "1",
                uiKeyType: "5",
                uiKeyBits: "256",
                pucPINStr: "12345678" // 私钥控制码
            },
            rules: {
                uiKeyIndexRangeStart: [
                    {
                        required: true,
                        message: "请选择索引",
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
                uiKeyType: [
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
            IsQianMing: ""
        }
    },
    created() {
        this.getKeyState(1)
        this.$commonJs.deviceConfGet().then((res) => {
            this.total = res.data.data.sm2_key_count
        })
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
            this.SM2keyList = []
            this.$commonJs
                .getMethodData(this.$url.GetSM2KeyState, "POST", {
                    // keynum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // dataList.push(res.data.data);
                        let dataList = res.data.data
                        // this.SM2keyList = res.data.data;
                        dataList.forEach((element) => {
                            console.log(element, "element")
                            if (element.SDFE_UEK_SM2 != undefined) {
                                this.SM2keyList.push(
                                    {
                                        KeyIndex: element.KeyIndex,
                                        SDFE_USK_SM2: element.SDFE_USK_SM2
                                    },
                                    {
                                        KeyIndex: element.KeyIndex,
                                        SDFE_UEK_SM2: element.SDFE_UEK_SM2
                                    }
                                )
                            }
                        })

                        this.loading = false
                        this.createdLoading = false
                        console.log(dataList, this.SM2keyList, "res")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                        this.createdLoading = false
                    }
                    console.log(res, "res")
                })
        },
        removeColor() {
            $(".PINStr").removeClass("colorStyle")
            this.form.pucPINStr = ""
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
            // this.$refs.form.resetFields();
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
            console.log(this.rowList, "this.rowList")
            if (type == 1) {
                if (this.rowList.SDFE_USK_SM2 != undefined) {
                    // 签名
                    if (this.rowList.SDFE_USK_SM2.uiKeyLen != 0) {
                        this.form.uiKeyBits =
                            this.rowList.SDFE_USK_SM2.uiKeyLen.toString()
                    }
                    this.form.uiKeyType = 5
                } else {
                    // 加密
                    if (this.rowList.SDFE_UEK_SM2.uiKeyLen != 0) {
                        this.form.uiKeyBits =
                            this.rowList.SDFE_UEK_SM2.uiKeyLen.toString()
                    }
                    this.form.uiKeyType = 7
                }
            }
        },
        addKey(formName) {
            if (this.isImport == "") {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return
                    if (this.Isbatch == 1) {
                        this.form.uiKeyIndexRangeStart = this.rowList.KeyIndex
                        this.form.uiKeyIndexRangeEnd = this.rowList.KeyIndex
                    }
                    this.dialogVisible = false

                    let keyAddName = "生成"
                    this.SM2keyList.forEach((item) => {
                        debugger
                        if (item.SDFE_UEK_SM2 != undefined) {
                            keyAddName = "生成"
                            if (
                                item.KeyIndex ==
                                    this.form.uiKeyIndexRangeStart &&
                                item.SDFE_UEK_SM2.uiKeyLen != 0
                            ) {
                                keyAddName = "覆盖原来的"
                            }
                        }
                        if (item.SDFE_USK_SM2 != undefined) {
                            keyAddName = "生成"
                            if (
                                item.KeyIndex ==
                                    this.form.uiKeyIndexRangeStart &&
                                item.SDFE_USK_SM2.uiKeyLen != 0
                            ) {
                                keyAddName = "覆盖原来的"
                            }
                        }
                    })
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
                                this.loading = true
                                this.$commonJs
                                    .getMethodData(
                                        this.$url.GenerateECCKeyPair,
                                        "POST",
                                        this.form
                                    )
                                    .then((res) => {
                                        this.loading = false
                                        if (res.data.code == 100000) {
                                            this.$message.success(
                                                "生成SM2密钥成功."
                                            )
                                            // this.$alert(
                                            //     "生成SM2密钥成功.",
                                            //     "提示",
                                            //     {
                                            //         confirmButtonText: "确定",
                                            //         type: "success"
                                            //     }
                                            // )
                                            //     .then((res) => {
                                            this.getKeyState()
                                            // })
                                            // .catch((err) => {});
                                        } else if (res.data.code != 800000) {
                                            this.$message.error(res.data.msg)
                                        }

                                        this.form.uiKeyIndexRangeStart = "1"
                                        this.form.uiKeyIndexRangeEnd = "1"
                                        this.form.uiKeyType = "5"
                                        // this.dialogVisible = false;
                                    })
                                this.handleClose("dialogVisible")
                                console.log("成功")
                            })
                            .catch(() => {
                                console.log("222")
                                debugger

                                // this.$refs.form.resetFields();
                                this.form.uiKeyIndexRangeStart = "1"
                                this.form.uiKeyType = "5"
                                this.form.uiKeyIndexRangeEnd = "1"
                            })
                    }, 500)
                })
            } else if (this.isImport == "1") {
                this.$alert("导入SM2密钥成功.", "提示", {
                    confirmButtonText: "确定",
                    type: "success"
                })
                this.dialogVisible = false
            } else if (this.isImport == "2") {
                this.$confirm("是否永久删除SM2密钥?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then((res) => {
                        this.dialogVisible = false
                    })
                    .catch((err) => err)
            }
        },
        importKey() {
            this.isImport = "1"
            this.dialogVisible = true
            this.keyName = "导入密钥"
        },
        deleteKey(row) {
            this.$confirm("是否永久销毁SM2密钥?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then((res) => {
                    let dataVal = ""
                    if (row.SDFE_UEK_SM2 != undefined) {
                        //加密
                        dataVal = 7
                    } else {
                        // 签名
                        dataVal = 5
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
        makeCard() {},
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
                            // this.modifyForm.pucPINStr = Number(
                            //     this.modifyForm.pucPINStr
                            // );
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
                                        // this.$message.error(res.data.msg);
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
                this.loading = false
                this.modifyFormdialog = false
                // this.modifyForm = {};
                this.$refs.modifyForm.resetFields()
            }
        },
        xiangqing(row) {
            this.modifyFormdialog = true
            console.log(row, "row")
            if (row.SDFE_USK_SM2 != undefined) {
                // 签名
                this.modifyForm.type = "sig_sm2"
            } else {
                this.modifyForm.type = "enc_sm2"
            }
            this.modifyForm.uiKeyIndex = row.KeyIndex
            console.log(this.modifyForm, "this.modifyForm")
        }
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
/deep/ .colorStyle .el-input__inner {
    color: #d0cdcd;
}
</style>

                
          