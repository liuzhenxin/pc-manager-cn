<template>
    <div>
        <div>
            <el-table style="height:400px;overflow-y: scroll" ref="symmetricTable" :data="SM2keyList" v-loading="loading" :span-method="objectSpanMethod" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                <el-table-column label="类型" prop="KeyType"></el-table-column>
                <el-table-column label="用途">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_SM2 == undefined && scope.row.SDFE_UEK_SM2 == undefined">对称密钥</span>
                        <span v-else-if="scope.row.SDFE_USK_SM2 == undefined">加密</span>
                        <span v-else-if="scope.row.SDFE_UEK_SM2 == undefined">签名</span>
                    </template>
                </el-table-column>
                <el-table-column label="密钥长度">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_SM2 == undefined && scope.row.SDFE_UEK_SM2 == undefined">
                            <span v-if="scope.row.UIKeyLen_enc==0">-</span>
                            <span v-else>{{scope.row.UIKeyLen_enc}}</span>
                        </span>
                        <span v-else-if="scope.row.SDFE_USK_SM2== undefined">
                            <span v-if="scope.row.UIKeyLen_enc==0">-</span>
                            <span v-else>{{scope.row.UIKeyLen_enc}}</span>
                        </span>
                        <span v-else-if="scope.row.SDFE_UEK_SM2 == undefined">
                            <span v-if="scope.row.UIKeyLen_sig == 0">-</span>
                            <span v-else>{{scope.row.UIKeyLen_sig}}</span>
                        </span>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 5px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="3" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { number } from "echarts"
export default {
    props: {
        keyType: {
            type: Number
        },
        isInit: {
            type: Boolean
        }
    },
    data() {
        return {
            loading: false,
            pageNow: 1,
            pageSize: 10,
            total: 10,
            SM2keyList: [],
            keyTypeStr: ""
        }
    },
    created() {
        if (this.keyType == 1) {
            this.keyTypeStr = "sm2"
        } else if (this.keyType == 2) {
            this.keyTypeStr = "rsa"
        } else {
            this.keyTypeStr = "kek"
        }
        this.getKeyState()
    },
    methods: {
        getKeyState() {
            this.loading = true
            this.SM2keyList = []
            let url
            if (this.isInit == true) {
                url = this.$url.HSMInitGetKeyStateByType
            } else {
                url = this.$url.GetKeyStateByType
            }
            this.$commonJs
                .getMethodData(url, "POST", {
                    // keynum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow,
                    type: this.keyTypeStr
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // this.SM2keyList = res.data.data
                        let dataList = res.data.data
                        // this.SM2keyList = res.data.data;
                        dataList.forEach((element) => {
                            if (element.type != "kek") {
                                this.SM2keyList.push(
                                    {
                                        KeyIndex: element.index,
                                        KeyType: element.type,
                                        SDFE_USK_SM2: element.sig_state,
                                        UIKeyLen_sig: element.sig_bits
                                    },
                                    {
                                        KeyIndex: element.index,
                                        KeyType: element.type,
                                        SDFE_UEK_SM2: element.enc_state,
                                        UIKeyLen_enc: element.enc_bits
                                    }
                                )
                            } else {
                                this.SM2keyList.push({
                                    KeyIndex: element.index,
                                    KeyType: element.type,
                                    SDFE_UEK: element.enc_state,
                                    UIKeyLen_enc: element.enc_bits
                                })
                            }
                        })
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        //this.$message.error(res.data.msg)
                        this.loading = false
                    }
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
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (this.keyType != 3) {
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
            }
        }
    }
}
</script>
<style lang="less" scoped>
</style>