<template>
    <div class="navItem" v-loading="createdLoading">


        <el-card class="search">
            <el-row>
                <el-col>
                    <exportLogin></exportLogin>
                </el-col>
            </el-row>
        </el-card>

        <el-card>
            <el-table ref="symmetricTable" v-loading="loading" :data="SM2keyList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                <el-table-column label="用途">
                    <template slot-scope="scope">
                        <!-- <span v-if="scope.row.SDFE_USK_SM2!=undefined">
                            签名
                        </span> -->
                        <span v-if="scope.row.SDFE_UEK_SM2 != undefined">加密</span>
                        <span v-if="scope.row.SDFE_USK_SM2 != undefined">签名</span>
                    </template>
                </el-table-column>

                <el-table-column label="密钥长度">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_UEK_SM2 != undefined">

                            <span>{{scope.row.SDFE_UEK_SM2.uiKeyLen}}</span>
                        </span>
                        <span v-if="scope.row.SDFE_USK_SM2 != undefined">

                            <span>{{scope.row.SDFE_USK_SM2.uiKeyLen}}</span>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.SDFE_USK_SM2 != undefined">
                            <!-- 签名 -->
                            <el-button @click.native.stop="xiaZai(scope.row,'sig')" type="text" size="mini" class="el-icon-upload" style="color: #409EFF">下载密钥</el-button>
                        </div>
                        <div v-if="scope.row.SDFE_UEK_SM2 != undefined">
                            <!-- 加密 -->
                            <el-button @click.native.stop="xiaZai(scope.row,'enc')" type="text" size="mini" class="el-icon-upload" style="color: #409EFF">下载密钥</el-button>
                        </div>

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


    </div>
</template>
<script>
import $ from "jquery";
import addOrg from "../organization/addOrg.vue";
import exportLogin from "../ExportCert/ExportLogin.vue";
export default {
    inject: ["reload"],
    components: {
        addOrg,
        exportLogin
    },
    data() {
        return {
            keyName: "",
            dialogWidth: "30%",
            loading: false,
            createdLoading: false,
            isImport: "",
            radio: "1",
            indexValList: [],
            indexVal: "1",
            indexVal1: "1",
            keyVal: "",
            modifyForm: {
                newPucPINStr: "",
                oldPucPINStr: "",
                newPucPINStr1: "",
                uiKeyIndex: "",
                uiKeyType: ""
            },
            modifyRules: {
                newPucPINStr: [
                    {
                        required: true,
                        message: "请输入新私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                oldPucPINStr: [
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
            IsQianMing: "",
            organization_id: ""
        };
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.organization_id = this.$commonJs.getStorage().organization_id;
        }
        this.getKeyState(1);
    },
    methods: {
        getKeyState(type) {
            // let dataList = [];
            if (type != 1) {
                this.loading = true;
            } else {
                this.createdLoading = true;
            }
            this.SM2keyList = [];
            this.$commonJs
                .getMethodData(this.$url.GetSM2KeyStateforCA, "POST", {
                    // keynum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // dataList.push(res.data.data);
                        // let dataList = res.data.data;
                        this.SM2keyList = res.data.data;
                        this.total =
                            res.data.data[res.data.data.length - 1].SM2_UK_SUM;
                        this.loading = false;
                        this.createdLoading = false;
                        console.log(
                            this.SM2keyList[0].SDFE_USK_SM2.uiKeyLen,
                            "res999"
                        );
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                        this.loading = false;
                        this.createdLoading = false;
                    }
                    console.log(res, "res");
                });
        },
        xiaZai(row, type) {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.WorkUserDownPrivateKeyEnc, "POST", {
                    key_index: row.KeyIndex, // 密钥索引
                    key_type: type, // 密钥类型：sig(签名) enc(加密)
                    organization_id: this.organization_id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$commonJs
                            .downLoadMethodData(
                                this.$url.WorkUserDownPrivateKeyEnc,
                                "POST",
                                {
                                    key_index: row.KeyIndex, // 密钥索引
                                    key_type: type, // 密钥类型：sig(签名) enc(加密)
                                    organization_id: this.organization_id
                                }
                            )
                            .then((res) => {
                                console.log(res, "res");
                                const link = document.createElement("a");
                                try {
                                    let blob = res.data; //如果后台返回的直接是blob对象类型，直接获取数据
                                    let _fileName = "cert.cer";
                                    link.style.display = "none";
                                    const url =
                                        window.URL ||
                                        window.webkitURL ||
                                        window.moxURL;
                                    link.href =
                                        window.URL.createObjectURL(blob);
                                    link.download = _fileName; //下载的文件名称
                                    link.click();
                                    window.URL.revokeObjectURL(url); // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                                    this.isXiaZai = true;
                                } catch (error) {
                                    this.$message.error("下载失败!");
                                }
                            });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    console.log(res, "res", " this.certData", this.certData);
                    this.loading = false;
                });
        },

        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.getKeyState();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.pageNow = newPage;
            this.getKeyState();
        },

        makeCard() {},

        handleClose(type) {
            if (type == "dialogVisible") {
                this.dialogVisible = false;
                this.form.uiKeyIndexRangeEnd = "1";
                this.$refs.form.resetFields();
            } else {
                this.loading = false;
                this.modifyFormdialog = false;
                // this.modifyForm = {};
                this.$refs.modifyForm.resetFields();
            }
        },
        xiangqing(row) {
            this.modifyFormdialog = true;
            console.log(row, "row");
            if (row.SDFE_USK_SM2 != undefined) {
                // 签名
                this.modifyForm.uiKeyType = 5;
            } else {
                this.modifyForm.uiKeyType = 7;
            }
            this.modifyForm.uiKeyIndex = row.KeyIndex;
            console.log(this.modifyForm, "this.modifyForm");
        }
    }
};
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

                
          