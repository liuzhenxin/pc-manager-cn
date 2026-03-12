<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="1">
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getList">查询</el-button>
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
                        <span v-else-if="scope.row.type=='exp'">导出</span>
                        <span v-else-if="scope.row.type=='imp'">导入</span>
                        <span v-else-if="scope.row.type=='add'">生成</span>
                        <span v-else-if="scope.row.type=='res'">恢复</span>
                        <span v-else-if="scope.row.type=='bac'">备份</span>
                    </template>

                </el-table-column>
                <el-table-column label="密钥算法" prop="alg">
                    <template slot-scope="scope">
                        <span v-if="scope.row.alg == 'sm2'">SM2</span>
                        <span v-else-if="scope.row.alg=='rsa'">RSA</span>
                        <span v-else-if="scope.row.alg=='all'">ALL</span>
                        <span v-else>KEK</span>
                    </template>
                </el-table-column>
                <el-table-column label="密钥索引" prop="index"></el-table-column>
                <el-table-column label="密钥类型" prop="keyType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.keyType == 'sig'">签名</span>
                        <span v-else-if="scope.row.keyType == 'enc'">加密</span>
                        <span v-else>ALL</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="createTime" :formatter="formatDate"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='1'">未审计</span>
                        <span v-else-if="scope.row.status=='2'" style="color: green">审计通过</span>
                        <span v-else-if="scope.row.status=='3'" style="color: red">审计不通过</span>
                    </template>
                </el-table-column>
                <el-table-column label="审计时间" prop="updateTime">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status!='1'" :formatter="scope.row.updateTime">{{scope.row.updateTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status!='1'">已审计</span>
                        <el-button @click.native.stop="getShenJiShow(scope.row)" v-if="scope.row.status=='1'" type="text" size="mini" class="el-icon-share" style="color: #67C23A">审计</el-button>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNow" :page-sizes="[10, 20, 50]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="审计" :visible.sync="dialogVisible" width="20%">
            <el-row style="margin-top:-30px">
                <el-col style="text-align: center;margin-top: 12px">
                    <el-radio-group v-model="updStatus" @change="chaStatus">
                        <el-radio :label="2" border>通过</el-radio>
                        <el-radio :label="3" border>不通过</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="quxiao()" size="mini" type="warning">取 消</el-button>
                <el-button @click="myenter()" size="mini" type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    inject: ["reload"],
    data() {
        return {
            form: {
                name: "", //  角色名称
                pageNow: 1,
                pageSize: 10
            },
            dialogVisible: false,
            loading: false,
            total: 0,
            dataList: [],
            pageNow: 1,
            pageSize: 10,
            updStatus: "",
            sjId: ""
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 查询列表
        getList() {
            this.loading = true
            // let data = form;
            this.dataList = []
            this.$commonJs
                .getMethodData(this.$url.HSMListShenJi, "POST", {
                    keyNum: this.pageSize,
                    pageNum: this.pageNow
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // dataList.push(res.data.data);
                        this.dataList = res.data.data
                        this.total = res.data.attrs.total
                        this.dataList.forEach((element) => {
                            let ut = element.updateTime
                            if (ut == null) {
                                element.updateTime = ""
                            } else {
                                let dt = new Date(parseInt(ut))
                                element.updateTime = this.forDate(dt)
                                console.log(element.updateTime)
                            }
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
        getShenJiShow(row) {
            this.dialogVisible = true
            this.sjId = row.id
            this.updStatus = ""
        },
        chaStatus(val) {
            // alert(this.updStatus)
            // alert(val)
        },
        myenter() {
            if (this.updStatus == "") {
                this.$message.error("请选择!")
                return false
            } else {
                this.$confirm("是否确认审计?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.HSMUpdShenJi, "POST", {
                                id: this.sjId,
                                status: this.updStatus
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    // debugger;
                                    // this.menuList = JSON.parse(res.data.data);
                                    console.log(res, "res")
                                    this.dialogVisible = false
                                    this.getList()
                                    this.$message.success("审计成功!")
                                    this.reload()
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                                console.log(res, "res")
                            })
                    })
                    .catch((err) => err)
            }
        },
        formatDate(row, column) {
            let da = row[column.property]
            let dt = new Date(parseInt(da))
            return this.forDate(dt)
        },
        forDate(dt) {
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
        },
        quxiao() {
            // this.radio = "";
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.box-card {
    height: 50px;
    line-height: 50px;
}
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
</style>
