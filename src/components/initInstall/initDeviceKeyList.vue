<template>
    <div>
        <div>
            <el-table style="height:400px" ref="symmetricTable" :data="deviceKeyList" v-loading="loading"
                :span-method="objectSpanMethod" tooltip-effect="dark" :header-cell-style="{
                    'text-align': 'center',
                    'color': '#333',
                    'font-size': '14px',
                }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="索引">1</el-table-column>
                <el-table-column label="用途">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_DEV == undefined && scope.row.SDFE_UEK_DEV == undefined">对称密钥</span>
                        <span v-else-if="scope.row.SDFE_USK_DEV == undefined">加密</span>
                        <span v-else-if="scope.row.SDFE_UEK_DEV == undefined">签名</span>
                    </template>
                </el-table-column>
                <el-table-column label="密钥长度">
                    <template slot-scope="scope">
                        <span v-if="scope.row.SDFE_USK_DEV == undefined && scope.row.SDFE_UEK_DEV == undefined">
                            <span v-if="scope.row.UIKeyLen_enc == 0">-</span>
                            <span v-else>{{ scope.row.UIKeyLen_enc }}</span>
                        </span>
                        <span v-else-if="scope.row.SDFE_USK_DEV == undefined">
                            <span v-if="scope.row.UIKeyLen_enc == 0">-</span>
                            <span v-else>{{ scope.row.UIKeyLen_enc }}</span>
                        </span>
                        <span v-else-if="scope.row.SDFE_UEK_DEV == undefined">
                            <span v-if="scope.row.UIKeyLen_sig == 0">-</span>
                            <span v-else>{{ scope.row.UIKeyLen_sig }}</span>
                        </span>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 5px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
        </div>
    </div>
</template>
<script>
import { number } from "echarts"
export default {
    props: {
        Refresh: {
            type: String
        }
    },
    data() {
        return {
            loading: false,
            pageNow: 1,
            pageSize: 10,
            deviceKeyList: [],
            keyTypeStr: ""
        }
    },
    created() {
        this.getKeyState()
    },
    methods: {
        getKeyState() {
            this.loading = true
            this.deviceKeyList = []
            this.$commonJs
                .getMethodData(this.$url.HSMInitGetKeyStateByDevType, "POST", {
                    // keynum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow,
                    type: "dev"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // this.deviceKeyList = res.data.data
                        let dataList = res.data.data
                        // this.deviceKeyList = res.data.data;
                        dataList.forEach((element) => {
                            this.deviceKeyList.push(
                                {
                                    KeyIndex: element.index,
                                    KeyType: element.type,
                                    SDFE_USK_DEV: element.sig_state,
                                    UIKeyLen_sig: element.sig_bits
                                },
                                {
                                    KeyIndex: element.index,
                                    KeyType: element.type,
                                    SDFE_UEK_DEV: element.enc_state,
                                    UIKeyLen_enc: element.enc_bits
                                }
                            )
                            if (element.sig_bits != 0 && element.enc_bits != 0) {
                                this.$emit("keyAllNum", res.data.data.length)
                            }else{
                                this.$emit("keyAllNum", 0)
                            }
                        })
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        //this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
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
<style lang="less" scoped></style>