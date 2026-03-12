<template>
    <div class="navItem" v-loading="createdLoading">
        <el-card>
            <el-row>
                <el-col :span="10">
                    <div style="margin-top:20px;" class="boxStyle">本页用于查看量子密钥</div>
                </el-col>
                <el-col :span="14">
                    <keyLogo :isMakeKey='1'></keyLogo>
                </el-col>
            </el-row>
        </el-card>
        <el-card>
            <el-table ref="symmetricTable" v-loading="loading" :data="quantumKeyList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="索引" prop="index"> </el-table-column>
                <el-table-column label="密钥长度">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sig_bits=='0'">-</span>
                        <span v-else>{{scope.row.sig_bits}}</span>

                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="deleteKey(scope.row)" :disabled="scope.row.enc_bits =='0'" type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
import keyLogo from "./keyLogo.vue"
export default {
    components: {
        keyLogo
    },
    data() {
        return {
            keyName: "",
            dialogVisible: false,
            loading: false,
            isImport: "",
            indexValList: [],
            indexVal: "1",
            indexVal1: "1",
            keyVal: "",
            pucKeyStr: "",
            Isbatch: "",
            quantumKeyList: [],
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
                ]
            },
            form: {
                start: "1",
                end: "1",
                uiKeyBits: "128",
                type: "kek"
                // pucPINStr: "12345678" // 私钥控制码
            },
            pageNow: 1,
            pageSize: 10,
            total: 0,
            dialogWidth: "30%",
            createdLoading: false,
            rowList: {},
            uiKeyBitsLabel: "128",
            uiKeyBitsLabel1: "",
            uiKeyBitsLabel2: ""
        }
    },
    created() {
        if (this.$commonJs.getScreenWidth() <= 1600) {
            this.dialogWidth = "42%"
        }
        this.getKeyState()
    },
    methods: {
        getKeyState(type) {
            if (type != 1) {
                this.loading = true
            } else {
                this.createdLoading = true
            }
            this.$commonJs
                .getMethodData(this.$url.GetKeyStateByType, "POST", {
                    // keyNum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow,
                    type: "quantum"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // this.quantumKeyList = [res.data.data];
                        this.quantumKeyList = res.data.data
                        this.$commonJs.deviceConfGet().then((res) => {
                            this.total = res.data.data.kek_count
                            // console.log(dataList, "res");
                        })
                        this.loading = false
                        this.createdLoading = false
                    } else if (res.data.code != 800000) {
                        this.loading = false
                        this.createdLoading = false
                        this.$message.error(res.data.msg)
                    } else {
                        this.loading = false
                        this.createdLoading = false
                    }
                    console.log(res, "res")
                })
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
        deleteKey(row) {
            this.$confirm("是否永久销毁对称密钥?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then((res) => {
                    this.$commonJs
                        .getMethodData(this.$url.DelUserKey, "POST", {
                            //alg:算法 sig_sm2:SM2签名 enc_sm2:SM2加密 sig_rsa:RSA签名 enc_rsa:RSA加密 kek:对称密钥
                            alg: "quantum",
                            // uiKeyIndex - 密钥内部索引号
                            uiKeyIndex: row.index,
                            // 密钥类型:类型 sig_sm2:SM2签名 enc_sm2:SM2加密 sig_rsa:RSA签名 enc_rsa:RSA加密 kek:对称密钥
                            type: "quantum"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(row, res, "row")
                                this.getKeyState()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                    this.dialogVisible = false
                })
                .catch((err) => err)

            // this.isImport = "2";
            // this.dialogVisible = true;
            // this.keyName = "删除密钥";
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
</style>

                
          