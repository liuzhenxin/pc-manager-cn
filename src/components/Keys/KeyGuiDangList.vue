<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="1">
                    <el-button type="primary" size="mini" style="float:right;" @click="getList">查询</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="dataList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="操作类型" prop="type">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 'upd'">更新</span>
                        <span v-else-if="scope.row.type=='del'">销毁</span>
                    </template>

                </el-table-column>
                <el-table-column label="密钥算法" prop="alg">
                    <template slot-scope="scope">
                        <span v-if="scope.row.alg == 'sm2'">SM2</span>
                        <span v-else-if="scope.row.alg=='rsa'">RSA</span>
                        <span v-else>KEK</span>
                    </template>
                </el-table-column>
                <el-table-column label="密钥索引" prop="index"></el-table-column>
                <el-table-column label="密钥类型" prop="keyType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.keyType == 'sig'">签名</span>
                        <span v-else>加密</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="createTime" :formatter="formatDate"></el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNow" :page-sizes="[10, 20, 50]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
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
            dataList: [],
            pageNow: 1,
            pageSize: 10,
            total: 0,
            createdLoading: false,
            Isbatch: "",
            rowList: {},
            typeName: ""
        }
    },
    created() {
        this.getList(1)
        if (this.$commonJs.getScreenWidth() <= 1400) {
            this.dialogWidth = "42%"
        }
    },

    methods: {
        getList(type) {
            if (type != 1) {
                this.loading = true
            } else {
                this.createdLoading = true
            }
            this.dataList = []
            this.$commonJs
                .getMethodData(this.$url.HSMListDangAn, "POST", {
                    keyNum: this.pageSize,
                    pageNum: this.pageNow
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // dataList.push(res.data.data);
                        this.dataList = res.data.data
                        this.total = res.data.attrs.total
                        this.dataList.forEach((element) => {
                            console.log(element, "element")
                        })
                        this.loading = false
                        this.createdLoading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                        this.createdLoading = false
                    }
                    console.log(res, "res")
                })
        },
        formatDate(row, column) {
            let da = row[column.property]
            let dt = new Date(parseInt(da))
            let yyyy = dt.getFullYear()
            let MM = dt.getMonth() + 1
            let dd = dt.getDate()
            let HH = dt.getHours()
            let mm = dt.getMinutes()
            let ss = dt.getSeconds()
            MM = MM < 10 ? "0" + MM : MM
            dd = dd < 10 ? "0" + dd : dd
            HH = HH < 10 ? "0" + HH : HH
            mm = mm < 10 ? "0" + mm : mm
            ss = ss < 10 ? "0" + ss : ss
            return yyyy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.pageNow = newPage
            this.getList()
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
/deep/ #indexStyle .el-form-item__error {
    margin-left: -65%;
}
/deep/ .colorStyle .el-input__inner {
    color: #d0cdcd;
}
</style>

                
          