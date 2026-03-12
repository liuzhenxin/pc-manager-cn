<template>
    <div class="navItem" v-loading="createdLoading">
        <el-card>
            <el-row>
                <el-col :span="10">
                    <div style="margin-top:20px;" class="boxStyle">本页用于管理EDDSA密钥对,包括生成,删除和设置访问控制码</div>
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
            <el-table ref="symmetricTable" v-loading="loading" :data="EDDSAkeyList" :span-method="objectSpanMethod" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                <el-table-column label="用途">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_SM2 != undefined">签名</span>
                    </template>
                </el-table-column>
                <el-table-column label="密钥长度">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_SM2 != undefined">
                            <span v-if="scope.row.UIKeyLen_sig == '0'">-</span>
                            <span v-else>{{scope.row.UIKeyLen_sig}}</span>
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="用途" prop="useType"></el-table-column>
                <el-table-column label="模长" prop="die"></el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.SDFE_USK_SM2 != undefined">
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-if="scope.row.UIKeyLen_sig =='0'" type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
                            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-else type="text" size="mini" class="el-icon-edit" style="color: #409EFF">更新</el-button>
                            <!-- <el-button @click.native.stop="imSymmetricKey(1,scope.row,'导入')" type="text" size="mini" class="el-icon-edit" style="color: #9227b5">导入</el-button> -->
                            <!-- <el-button @click.native.stop="exSymmetricKey(1,scope.row,'导出')" type="text" size="mini" class="el-icon-edit" style="color: #c51d82">导出公钥</el-button> -->
                            <el-button @click.native.stop="xiangqing(scope.row,3)" :disabled="scope.row.UIKeyLen_sig =='0'" type="text" size="mini" class="el-icon-edit" style="color:#67C23A">修改访问码</el-button>
                            <el-button :disabled="scope.row.UIKeyLen_sig =='0'" @click.native.stop="deleteKey(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>

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
                        <!-- <span class="titleLabel" style="width:35px">模长:</span> -->
                        <el-form-item label="密钥模长:" label-width="17%" prop="uiKeyBits">
                            <!-- <el-radio style="margin-left:10px" v-model="form.uiKeyBits" label="256">256</el-radio> -->
                            <el-radio style="margin-left:10px" v-model="form.uiKeyBits" :label="uiKeyBitsLabel" v-if="uiKeyBitsLabel!=''">{{uiKeyBitsLabel}}</el-radio>
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
                        <el-form-item label="密钥用途:" label-width="17%" prop="type">
                            <el-radio style="margin-left:10px" v-model="form.type" label="eddsa">签名</el-radio>
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
            EDDSAkeyList: [
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
                start: "1",
                end: "1",
                type: "eddsa",
                uiKeyBits: "256",
                pucPIN: "", // 私钥控制码
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
                // end: [
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
            uiKeyBitsLabel: "256"
        }
    },
    created() {
        this.getKeyState(1)
        this.getResourceDetail("1")
        this.$commonJs.deviceConfGet().then((res) => {
            this.total = res.data.data.eddsa_num
        })
        if (this.$commonJs.getScreenWidth() <= 1600) {
            this.dialogWidth = "42%"
        }
    },
    methods: {
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
            // let dataList = [];
            if (type != 1) {
                this.loading = true
            } else {
                this.createdLoading = true
            }
            this.EDDSAkeyList = []
            this.$commonJs
                .getMethodData(this.$url.GetKeyStateByType, "POST", {
                    // keynum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow,
                    type: "eddsa"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // dataList.push(res.data.data);
                        let dataList = res.data.data
                        // this.EDDSAkeyList = res.data.data;
                        dataList.forEach((element) => {
                            this.EDDSAkeyList.push({
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
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            // if (columnIndex === 0) {
            //     if (rowIndex % 2 === 0) {
            //         return {
            //             rowspan: 2,
            //             colspan: 1
            //         }
            //     } else {
            //         return {
            //             rowspan: 0,
            //             colspan: 0
            //         }
            //     }
            // }
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
            if (type == 1) {
                if (this.rowList.UIKeyLen_sig != 0) {
                    this.form.uiKeyBits = this.rowList.UIKeyLen_sig.toString()
                }
                this.form.type = "eddsa"
            }
        },
        exSymmetricKey(type, row, typeName) {
            // console.log(row, "this.rowList")
            // console.log(row.KeyIndex, "this.KeyIndex")
            // let mtype
            // if (row.SDFE_USK_SM2 != undefined) {
            //     mtype = "sig"
            // } else {
            //     mtype = "enc"
            // }
            // this.$commonJs
            //     .downLoadMethodData(this.$url.HSMExportFileKey, "POST", {
            //         alg: "sm2",
            //         index: row.KeyIndex,
            //         type: mtype
            //     })
            //     .then((res) => {
            //         console.log(res, "res")
            //         const link = document.createElement("a")
            //         try {
            //             let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
            //             let _fileName = "key.dyk"
            //             link.style.display = "none"
            //             const url =
            //                 window.URL || window.webkitURL || window.moxURL
            //             link.href = window.URL.createObjectURL(blob)
            //             link.download = _fileName //下载的文件名称
            //             link.click()
            //             window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
            //             this.isXiaZai = true
            //         } catch (e) {
            //             this.$message.error("下载失败!")
            //         }
            //     })
            this.$message.success("导出成功!")

            const content =
                "MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAECNJudv7efvrq1v7NaeIlRD1CF7NPMk9/kYuLePp8VXr4BuuvPYjMjTFBR0azkoHBZyebV63lXPQ4wYC9SgOmuA=="
            // const file = new File([content], "test.txt", { type: "text/plain" })
            // const writer = new FileWriter()
            // writer.write(content)
            const link = document.createElement("a")
            let blob = new Blob([content], { type: "audio/wav" })

            let _fileName = "key.txt"
            link.style.display = "none"
            const url = window.URL || window.webkitURL || window.moxURL
            link.href = window.URL.createObjectURL(blob)
            link.download = _fileName //下载的文件名称
            link.click()
            window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
        },
        imSymmetricKey(type, row, typeName) {
            let mtype
            if (row.SDFE_USK_SM2 != undefined) {
                mtype = "sig"
            } else {
                mtype = "enc"
            }
            const _this = this
            const fileType = ["dyk"]
            const inputFile = document.createElement("input")
            inputFile.type = "file"
            inputFile.style.display = "none"
            document.body.appendChild(inputFile)
            inputFile.click()
            inputFile.addEventListener("change", function () {
                const file = inputFile.files[0]
                var testmsg = file.name.substring(
                    file.name.lastIndexOf(".") + 1
                )
                if (!fileType.includes(testmsg)) {
                    _this.$message.warning("上传的文件格式只能是,dyk")
                    document.body.removeChild(inputFile)
                    return false
                }
                const formData = new FormData()
                formData.append("file", file)
                _this.$commonJs
                    .getMethodData(_this.$url.HSMImportFileKey, "POST", {
                        alg: "sm2",
                        index: row.KeyIndex,
                        pucPINStr: "11111111",
                        type: mtype,
                        file: row.KeyIndex
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            _this.$message.success("导入成功")
                            _this.getKeyState()
                        } else if (res.data.code != 800000) {
                            _this.$message.error(res.data.msg)
                        } else {
                            _this.$message.error(res.data.msg)
                        }
                    })
                // window.request({
                //     url:'xxx/xxx',
                //     data:formData,
                //     success:(res)=> {
                //      if (res.code === 200) {
                //          _this.$message.success(res.message || "导入成功");
                //          _this.getTableList();
                //      }else {
                //       _this.$message.success("导入失败");
                //      }}

                // })
            })
        },
        addKey(formName) {
            if (this.isImport == "") {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return
                    let keyAddName = "生成"
                    if (this.Isbatch == 1) {
                        this.form.start = this.rowList.KeyIndex
                        this.form.end = this.rowList.KeyIndex

                        if (this.rowList.SDFE_USK_SM2 != undefined) {
                            // 签名
                            if (this.rowList.UIKeyLen_sig != 0) {
                                keyAddName = "覆盖原来的"
                            }
                        } else {
                            // 加密
                            if (this.rowList.UIKeyLen_enc != 0) {
                                keyAddName = "覆盖原来的"
                            }
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
                                                "生成EDDSA密钥成功."
                                            )
                                            this.getKeyState()
                                        } else if (res.data.code != 800000) {
                                            this.$message.error(res.data.msg)
                                        }

                                        this.form.start = "1"
                                        this.form.end = "1"
                                        this.form.type = "eddsa"
                                        // this.dialogVisible = false;
                                    })
                                this.handleClose("dialogVisible")
                                console.log("成功")
                            })
                            .catch(() => {
                                // this.$refs.form.resetFields();
                                this.form.start = "1"
                                this.form.type = "eddsa"
                                this.form.end = "1"
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
            this.$confirm("是否永久销毁EDDSA密钥?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then((res) => {
                    this.$commonJs
                        .getMethodData(this.$url.DelEDDSAKey, "POST", {
                            // uiKeyIndex - 密钥内部索引号
                            uiKeyIndex: row.KeyIndex
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res")
                                // this.$message.success(res.data.msg);
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
                            // this.modifyForm.pucPIN = Number(
                            //     this.modifyForm.pucPIN
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
                this.form.end = "1"
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
            this.modifyForm.type = "eddsa"
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

                
          