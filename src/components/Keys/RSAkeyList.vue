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
            <el-table ref="symmetricTable" v-loading="loading" :data="RSAkeyList" :span-method="objectSpanMethod"
                tooltip-effect="dark" :header-cell-style="{
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
                            <span v-if="scope.row.UIKeyLen_enc == '0'">-</span>
                            <span v-else>{{ scope.row.UIKeyLen_enc }}</span>
                        </span>
                        <span v-if="scope.row.SDFE_UEK_RSA == undefined">
                            <span v-if="scope.row.UIKeyLen_sig == '0'">-</span>
                            <span v-else>{{ scope.row.UIKeyLen_sig }}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.SDFE_USK_RSA == undefined">
                            <el-button @click.native.stop="addSymmetricKey(1, scope.row)" v-if="scope.row.UIKeyLen_enc == '0'"
                                type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
                            <el-button @click.native.stop="addSymmetricKey(1, scope.row)" v-else type="text" size="mini"
                                class="el-icon-edit" style="color: #409EFF">更新</el-button>
                            <!-- <el-button @click.native.stop="imSymmetricKey(1,scope.row,'导入')" type="text" size="mini" class="el-icon-edit" style="color: #9227b5">导入</el-button> -->
                            <el-button @click.native.stop="exSymmetricKey(2, scope.row, '导出公钥')" type="text" size="mini"
                                class="el-icon-edit" style="color: #c51d82">导出公钥</el-button>
                            <el-button @click.native.stop="xiangqing(scope.row, 3)" :disabled="scope.row.UIKeyLen_enc == '0'"
                                type="text" size="mini" class="el-icon-edit" style="color: #67C23A">修改访问码</el-button>
                            <el-button :disabled="scope.row.UIKeyLen_enc == '0'" @click.native.stop="deleteKey(scope.row)"
                                type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>
                        </div>
                        <div v-if="scope.row.SDFE_UEK_RSA == undefined">
                            <el-button @click.native.stop="addSymmetricKey(1, scope.row)" v-if="scope.row.UIKeyLen_sig == '0'"
                                type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
                            <el-button @click.native.stop="addSymmetricKey(1, scope.row)" v-else type="text" size="mini"
                                class="el-icon-edit" style="color: #409EFF">更新</el-button>
                            <!-- <el-button @click.native.stop="imSymmetricKey(1,scope.row,'导入')" type="text" size="mini" class="el-icon-edit" style="color: #9227b5">导入</el-button> -->
                            <el-button @click.native.stop="exSymmetricKey(1, scope.row, '导出公钥')" type="text" size="mini"
                                class="el-icon-edit" style="color: #c51d82">导出公钥</el-button>
                            <el-button @click.native.stop="xiangqing(scope.row, 3)" :disabled="scope.row.UIKeyLen_sig == '0'"
                                type="text" size="mini" class="el-icon-edit" style="color: #67C23A">修改访问码</el-button>
                            <el-button :disabled="scope.row.UIKeyLen_sig == '0'" @click.native.stop="deleteKey(scope.row)"
                                type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>

                        </div>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>

            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow"
                :page-sizes="[10, 20, 50]" :page-size="3" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog :title="keyName" :visible.sync="dialogVisible" :width="dialogWidth">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20" v-if="Isbatch != 1">
                    <el-col :offset="2">
                        <el-row>
                            <el-col :span="13">
                                <el-form-item label="密钥索引:" label-width="32%" prop="start">
                                    <el-select style="width:120px;" v-model="form.start" @change="indexChange"
                                        placeholder="请选择索引">
                                        <el-option v-for="item in indexValList" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <span style="margin-left:10px">-</span>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8">
                                <el-form-item id="indexStyle">
                                    <el-select style="margin-left:-62%;width:120px" @change="indexChangeTwo"
                                        v-model="form.end" placeholder="请选择索引">
                                        <el-option v-for="item in indexValList" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col style="margin-left: 17%;margin-top: -12px;color:#d2cdcd"> (例: 从1到5 选: 1-5 默认值为:
                                1-1)</el-col>

                        </el-row>
                    </el-col>
                </el-row>

                <el-row :gutter="20" style="margin-top:10px" v-if="isImport == '' && isImport != '2'">
                    <el-col :offset="2">
                        <!-- <span class="titleLabel" style="width:35px">模长:</span> -->{{uiKeyBitsLabel2}}
                        <el-form-item label="密钥模长:" label-width="17%" prop="uiKeyBits">
                            <el-radio style="margin-left:10px" v-model="form.uiKeyBits" :label="uiKeyBitsLabel"
                                v-if="uiKeyBitsLabel != ''">{{ uiKeyBitsLabel }}</el-radio>
                            <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel1"
                                v-if="uiKeyBitsLabel1 != ''">{{ uiKeyBitsLabel1 }}</el-radio>
                            <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel2"
                                v-if="uiKeyBitsLabel2 != ''">{{ uiKeyBitsLabel2 }}</el-radio>
                            <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel3"
                                v-if="uiKeyBitsLabel3 != ''">{{ uiKeyBitsLabel3 }}</el-radio>
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
                <el-row :gutter="20" style="margin-top:10px" v-if="Isbatch != 1">
                    <el-col :offset="2">
                        <el-form-item label="密钥用途:" label-width="17%" prop="type">
                            <el-radio style="margin-left:10px" v-model="form.type" label="sig_rsa">签名</el-radio>
                            <el-radio v-model="form.type" label="enc_rsa">加密</el-radio>
                            <el-radio v-model="form.type" label="rsa"
                                v-if="isImport != '1' && isImport != '4'">签名和加密</el-radio>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col :offset="2">
                        <el-form-item label="私钥访问控制码:" label-width="26%" prop="pucPIN" style="margin-left:-30px">
                            <!-- <el-input style="width:60%;" v-model="form.pucPIN" type="text" @focus="removeColor" placeholder="请输入私钥访问控制码" class="searchInputClass colorStyle PINStr"></el-input> -->
                            <el-input class="searchInputClass colorStyle PINStr" style="width:60%;" v-model="form.pucPIN"
                                @focus="removeColor" prefix-icon="el-icon-lock" :type="flag ? 'password' : 'text'"
                                placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag ? 'el-icon-minus' : 'el-icon-view']"
                                    style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag = !flag"></i>
                            </el-input>
                            <span style="color: #da0909"> 默认:{{ form.defaultPucPIN }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top:10px">
                    <el-col :offset="2">
                        <el-form-item label="确认私钥访问控制码:" label-width="26%" prop="surePucPIN" style="margin-left:-30px">
                            <el-input class="searchInputClass colorStyle surePINStr" style="width:60%;"
                                v-model="form.surePucPIN" @focus="removeColor1" prefix-icon="el-icon-lock"
                                :type="flag4 ? 'password' : 'text'" placeholder="请确认输入私钥访问控制码">
                                <i slot="suffix" :class="[flag4 ? 'el-icon-minus' : 'el-icon-view']"
                                    style="margin-top: 8px; font-size: 18px" autocomplete="auto"
                                    @click="flag4 = !flag4"></i>
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
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="原私钥访问控制码:" label-width="160px" prop="oldPucPIN">
                            <el-input style="width:75%" v-model="modifyForm.oldPucPIN" prefix-icon="el-icon-lock"
                                :type="flag1 ? 'password' : 'text'" placeholder="请输入私钥访问控制码">
                                <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']"
                                    style="margin-top: 8px; font-size: 18px" autocomplete="auto"
                                    @click="flag1 = !flag1"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新私钥访问控制码:" label-width="160px" prop="newPucPIN">
                            <el-input style="width:75%" v-model="modifyForm.newPucPIN" placeholder="请输入私钥访问控制码"
                                prefix-icon="el-icon-lock" :type="flag2 ? 'password' : 'text'">
                                <i slot="suffix" :class="[flag2 ? 'el-icon-minus' : 'el-icon-view']"
                                    style="margin-top: 8px; font-size: 18px" autocomplete="auto"
                                    @click="flag2 = !flag2"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确认私钥访问控制码:" label-width="170px" prop="newPucPINStr1" style="margin-left:-10px">
                            <el-input style="width:75%" v-model="modifyForm.newPucPINStr1" placeholder="请输入私钥访问控制码"
                                prefix-icon="el-icon-lock" :type="flag3 ? 'password' : 'text'">
                                <i slot="suffix" :class="[flag3 ? 'el-icon-minus' : 'el-icon-view']"
                                    style="margin-top: 8px; font-size: 18px" autocomplete="auto"
                                    @click="flag3 = !flag3"></i>
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
        <el-dialog title="加密密钥导入" :visible.sync="importEncDialog" width="60%">
            <el-form ref="form" :model="formKey" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="加密证书:" label-width="28%" prop="encrypt_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true"
                                :on-preview="handlePreview" :on-remove="handleRemove1" :on-exceed="handleExceed"
                                :on-change="changeFile1" :file-list="fileList1" :headers="MyHeader" :limit="1"
                                :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择加密证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="加密证书私钥:" label-width="28%" prop="encryptKey_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true"
                                :on-preview="handlePreview" :on-remove="handleRemove2" :on-exceed="handleExceed"
                                :on-change="changeFile2" :file-list="fileList2" :headers="MyHeader" :limit="1"
                                :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择加密证书私钥</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:20px">
                        <el-form-item label="私钥访问控制码:" label-width="28%" prop="pucPassword">
                            <el-input class="inputwid" v-model="formKey.pucPassword" type="password"
                                placeholder="请输入私钥访问控制码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:20px">
                        <el-form-item label="确认私钥访问控制码:" label-width="28%" prop="pucPassword">
                            <el-input class="inputwid" v-model="formKey.pucPassword1" type="password"
                                placeholder="请输入确认私钥访问控制码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:35px;margin-left:15%;">
                            <el-button size="mini" type="primary" @click="openPin()"
                                style="margin-bottom:20px">确定</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
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
            flag: true,
            dialogWidth: "40%",
            keyName: "",
            dialogVisible: false,
            loading: false,
            isImport: "",
            flag1: true,
            flag2: true,
            flag3: true,
            flag4: true,
            indexValList: [],
            keyVal: "",
            modifyFormdialog: false,
            form: {
                start: "1",
                end: "1",
                type: "sig_rsa",
                uiKeyBits: "1024",
                pucPIN: "", // 私钥控制码
                surePucPIN: "",// 私钥控制码
                defaultPucPIN: "" // 默认控制码
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
                start: [
                    {
                        required: true,
                        message: "请选择索引",
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
                        message: "请输入私钥访问控制码",
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
            pageSize: 10,
            total: 0,
            createdLoading: false,
            Isbatch: "",
            rowList: {},
            uiKeyBitsLabel: "1024",
            uiKeyBitsLabel1: "2048",
            uiKeyBitsLabel2: "3072",
            uiKeyBitsLabel3: "4096",
            importEncDialog: false,
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
                pucPassword: "",
                pucPassword1: ""
            },
            MyHeader: { Authorization: "" },
            fileList: [],
            fileList1: [],
            fileList2: []
        }
    },
    created() {
        this.getKeyState(1)
        this.getResourceDetail("1")
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
                currentPage = "initInstallList"
                code = "2"
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
                            let resultArr = result.split(",")
                            this.uiKeyBitsLabel = resultArr[0]
                            this.uiKeyBitsLabel1 = resultArr[1]
                            this.uiKeyBitsLabel2 = resultArr[2]
                            this.uiKeyBitsLabel3 = resultArr[3]
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
            this.RSAkeyList = []
            this.$commonJs
                .getMethodData(this.$url.GetKeyStateByType, "POST", {
                    keyNum: this.pageSize,
                    pageNum: this.pageNow,
                    type: "rsa"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // dataList.push(res.data.data);
                        let dataList = res.data.data
                        // this.RSAkeyList = res.data.data;
                        dataList.forEach((element) => {
                            console.log(element, "element")
                            this.RSAkeyList.push(
                                {
                                    KeyIndex: element.index,
                                    KeyType: element.type,
                                    SDFE_USK_RSA: element.sig_state,
                                    UIKeyLen_sig: element.sig_bits
                                },
                                {
                                    KeyIndex: element.index,
                                    KeyType: element.type,
                                    SDFE_UEK_RSA: element.enc_state,
                                    UIKeyLen_enc: element.enc_bits
                                }
                            )
                        })
                        this.loading = false
                        this.createdLoading = false
                        this.getRSAKeyCount()
                    } else if (res.data.code != 800000) {
                        this.loading = false
                        this.createdLoading = false
                        this.$message.error(res.data.msg)
                    }
                })
        },
        removeColor() {
            $(".PINStr").removeClass("colorStyle")
            this.form.pucPIN = ""
        },
        removeColor1() {
            $(".surePINStr").removeClass("colorStyle")
            this.form.surePucPIN = ""
        },
        getRSAKeyCount() {
            this.$commonJs.deviceConfGet().then((res) => {
                this.total = res.data.data.rsa_key_count
                // console.log(dataList, "res");
            })
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
                this.form.end = "1"
                this.$refs.form.resetFields()
            } else {
                // this.modifyForm = {
                //     newPucPIN: "",
                //     oldPucPIN: "",
                //     newPucPINStr1: "",
                //     uiKeyIndex: "",
                //     type: ""
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
            console.log(this.modifyForm, "this.modifyForm")
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
        importEnc(type, row) {
            this.form.start = row.KeyIndex
            this.form.end = row.KeyIndex
            this.importEncDialog = true
        },
        openPin() {
            this.importEncDialog = false
            this.$message.success("导入成功！")
            let url = this.$url.GenerateKeyByType
            this.form.type = "enc_rsa"
            this.$commonJs.getMethodData(url, "POST", this.form).then((res) => {
                if (res.data.code == 100000) {
                    this.getKeyState()
                }
                this.form.start = "1"
                this.form.end = "1"
                this.form.type = "enc_rsa"
                // this.dialogVisible = false;
            })
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
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        addSymmetricKey(type, row) {
            this.getResourceDetail("2")
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
            if (type == 1) {
                if (this.rowList.SDFE_USK_RSA != undefined) {
                    // 签名
                    if (this.rowList.UIKeyLen_sig != 0) {
                        this.form.uiKeyBits =
                            this.rowList.UIKeyLen_sig.toString()
                    }
                    this.form.type = "sig_rsa"
                } else {
                    // 加密
                    if (this.rowList.UIKeyLen_enc != 0) {
                        this.form.uiKeyBits =
                            this.rowList.UIKeyLen_enc.toString()
                    }
                    this.form.type = "enc_rsa"
                }
            }
        },
        exSymmetricKey(type, row, typeName) {
            console.log(row, "this.rowList")
            console.log(row.KeyIndex, "this.KeyIndex")
            let mtype
            if (row.SDFE_USK_RSA != undefined) {
                mtype = "sig"
            } else {
                mtype = "enc"
            }
            this.$commonJs
                .getMethodData(this.$url.ExportRSAPublicKey, "POST", {
                    uiKeyIndex: row.KeyIndex,
                    type: mtype
                })
                .then((res) => {
                    console.log(res, "res")
                    const link = document.createElement("a")
                    try {
                        const content = res.data.data.publicKey //如果后台返回的直接是blob对象类型，直接获取数据
                        let blob = new Blob([content], {
                            type: "audio/wav"
                        })
                        let _fileName = "key.dyk"
                        link.style.display = "none"
                        const url =
                            window.URL || window.webkitURL || window.moxURL
                        link.href = window.URL.createObjectURL(blob)
                        link.download = _fileName //下载的文件名称
                        link.click()
                        window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                        this.isXiaZai = true
                    } catch (e) {
                        this.$message.error("下载失败!")
                    }
                })
            // this.$message.success("导出成功!")

            // const content =
            //     "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4+diiKanXyk7Xlz/wJv/wxhx2GLHoqivYvcZsMTsRzrKA0eKsTBrNnkFBTRorMpEwAaH3m0Ubfv7PQWZw3tmF9K1u225i9IukzkAlVESngBnCZFZEzsjvhYzCFgOg0Rnw0E1WO7v8eTuHK95jgd5NMYA4PCzsbPe9PALOzLOBMJl3s08bV+IpJGlnv0Czp3Ie+zvPMQDk0dbib4J+wKX7YHo97ZBKNLCClChadLmnZqbzjJ0QPGeaxUB3HM+NN8U2ksTpAvRu2Rowv+5cwcDAuOseD7VCw5pn+fK0EqvP5H7QMxKaydBBXA1cNYJXI6DMitmDATnhmYLp3OU9ORlcwIDAQAB"
            // // const file = new File([content], "test.txt", { type: "text/plain" })
            // // const writer = new FileWriter()
            // // writer.write(content)
            // const link = document.createElement("a")
            // let blob = new Blob([content], { type: "audio/wav" })

            // let _fileName = "key.txt"
            // link.style.display = "none"
            // const url = window.URL || window.webkitURL || window.moxURL
            // link.href = window.URL.createObjectURL(blob)
            // link.download = _fileName //下载的文件名称
            // link.click()
            // window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
        },
        imSymmetricKey(type, row, typeName) {
            let mtype
            if (row.SDFE_USK_RSA != undefined) {
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
                        alg: "rsa",
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
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                if (this.form.pucPIN != this.form.surePucPIN) {
                    this.$message.error(
                        "两次输入不一致"
                    )
                    return
                }

                let keyAddName = "生成"
                if (this.Isbatch == 1) {
                    this.form.start = this.rowList.KeyIndex
                    this.form.end = this.rowList.KeyIndex

                    if (this.rowList.SDFE_USK_RSA != undefined) {
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
                if (this.isImport == "") {
                    // data = this.$commonJs.getScreenValue(data);
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
                                // this.$commonJs.getLoading();
                                this.loading = true
                                this.$commonJs
                                    .getMethodData(url, "POST", this.form)
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
                                        this.form.start = "1"
                                        this.form.end = "1"
                                        this.getKeyState()
                                        // this.dialogVisible = false;
                                    })
                                console.log("成功")
                            })
                            .catch((err) => {
                                // this.form = {
                                //     start: "1",
                                //     end: "1",
                                //     type: "sig_rsa",
                                //     uiKeyBits: "1024",
                                //     pucPIN: "11111111" // 私钥控制码
                                // }
                                this.form.start = "1"
                                this.form.type = "sig_sm2"
                                this.form.end = "1"
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
                        dataVal = "enc_rsa"
                    } else {
                        // 签名
                        dataVal = "sig_rsa"
                    }
                    this.$commonJs
                        .getMethodData(this.$url.DelUserKey, "POST", {
                            //alg:算法 sig_sm2:SM2签名 enc_sm2:SM2加密 sig_rsa:RSA签名 enc_rsa:RSA加密 kek:对称密钥
                            alg: dataVal,
                            // uiKeyIndex - 密钥内部索引号
                            uiKeyIndex: row.KeyIndex,
                            // 密钥类型:类型 sig_sm2:SM2签名 enc_sm2:SM2加密 sig_rsa:RSA签名 enc_rsa:RSA加密 kek:对称密钥
                            type: dataVal
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
        makeCard() { }
    }
}
</script>
<style lang="less" scoped>.boxStyle {
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
}</style>


