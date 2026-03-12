<template>
    <div class="navItem">

        <el-card class="search">
            <el-row>
                <el-col :span="9" style="margin-left:50px">
                    <span class="demonstration">操作时间:</span>
                    <el-date-picker style="margin-left:5px;width:38%" v-model="form.start_time" type="date" placeholder="选择日期">
                    </el-date-picker>
                    <span style="margin:0 5px">-</span>
                    <el-date-picker v-model="form.end_time" style="width:38%" type="date" placeholder="选择日期">
                    </el-date-picker>

                </el-col>
                <el-col :span="8">
                    <span class="titleLabel" style="width:75px">模块标题:</span>
                    <el-input v-model="form.title" placeholder="请输入模块标题" style="width:48%" class="searchInputClass"></el-input>
                </el-col>

                <el-col :span="5">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getOperationList">查询</el-button>
                    <el-button type="success" size="mini" style="margin-left:15px;float:right;" @click="getOperationExport">日志导出</el-button>
                </el-col>

                <!-- 
                <el-col :span="4">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getOperationList">查询</el-button>
                    <el-button type="success" size="mini" style="margin-left:15px;float:right;" @click="getOperationExport">日志导出</el-button>
                </el-col> -->
                <el-col :span="9" style="margin-top:20px; ">
                    <span class="titleLabel">审计人:</span>
                    <el-radio label="1" v-model="form.audit_user" style="margin-left:10px;">当前</el-radio>
                    <el-radio label="2" v-model="form.audit_user">全部</el-radio>
                    <!-- <el-input v-model="form.audit_user" placeholder="请输入审计人" class="searchInputClass"></el-input> -->
                </el-col>
                <!-- <el-row style="margin-top:20px" v-if="isAdmin==true"> -->
                <el-col :span="7" style="margin-top:20px;margin-left:20px;">
                    <span class="titleLabel">业务操作类型:</span>
                    <el-select v-model="form.business_type" placeholder="请选择业务操作类型" class="searchInputClass" style="width:55%">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6" v-if="isAdmin==true" style="margin-top:20px;margin-left:20px;">
                    <span class="titleLabel">组织机构:</span>
                    <el-cascader style="margin-left:5px;width:60%" ref="cascaderHandle" :show-all-levels="false" :props="{ checkStrictly: true }" v-model="organizationArr" :options="organizationList" @change="handleChange" placeholder="请选择组织机构"></el-cascader>


                </el-col>
                <el-col :span="6" v-if="isAdmin==true" style="margin-top:20px;margin-left:0px;">
                    <span class="titleLabel">系统类型:</span>
                    <el-select v-model="form.systems" placeholder="请选择系统类型" class="searchInputClass" style="width:55%">
                        <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>

            </el-row>

        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="operationList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="模块标题" prop="title">
                    <template slot-scope="scope">
                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="主机地址" prop="operator_ip"></el-table-column>
                <el-table-column label="操作人" prop="user_info"></el-table-column>
                <el-table-column label="操作内容" prop="log_content" width="400" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="日志等级" prop="log_level">
                    <template slot-scope="scope">
                        <span v-if="scope.row.log_level=='info'">正常</span>
                        <span v-else-if="scope.row.log_level=='warn'">警告</span>
                        <span v-else-if="scope.row.log_level=='debug'">调试</span>
                        <span v-else>异常</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作时间" prop="log_time" width="200"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==10" class="statusGray">未审计</span>
                        <span v-else-if="scope.row.status==11" class="statusError">审计中</span>
                        <span v-else-if="scope.row.status==12" class="statusError">审计未通过</span>
                        <span v-else-if="scope.row.status==20" class="statusSuccess">审计通过</span>
                        <span v-else class="statusError">异常</span>
                    </template>
                </el-table-column>
                <el-table-column label="审计人" prop="audit_username"></el-table-column>
                <el-table-column label="审计时间" prop="audit_time" width="200"></el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.status=='20'" @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-circle-check" style="color: #1890ff">审计</el-button>
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
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                title: "", // 模块标题
                // operator_ip: "", // 主机地址
                audit_user: "2", // 审计人
                start_time: "", // 操作时间
                end_time: "",
                // operator_type: "",
                systems: "", // 系统类型
                business_type: "", // 业务操作类型
                organization_id: "", // 组织id
                pageNow: 1,
                pageSize: 10,
                organizationFatherName: ""
            },
            organizationArr: [],
            isAdmin: false,
            radio: "",
            loading: false,
            total: 0,
            operationList: [],
            typeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "11",
                    label: "新增"
                },
                {
                    value: "12",
                    label: "修改"
                },
                {
                    value: "13",
                    label: "删除"
                },
                {
                    value: "18",
                    label: "清空数据"
                },
                {
                    value: "14",
                    label: "查询"
                },
                {
                    value: "20",
                    label: "操作"
                },
                {
                    value: "50",
                    label: "审计"
                },
                {
                    value: "60",
                    label: "授权"
                },
                {
                    value: "61",
                    label: "登录"
                },
                {
                    value: "62",
                    label: "登出"
                },
                {
                    value: "71",
                    label: "导出"
                },
                {
                    value: "72",
                    label: "导入"
                },

                {
                    value: "00",
                    label: "其它"
                }
            ],
            systemList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "os",
                    label: "全局"
                },
                {
                    value: "hsm",
                    label: "密码机"
                },
                {
                    value: "svs",
                    label: "签名验签"
                },
                {
                    value: "ca",
                    label: "数字认证"
                },
                {
                    value: "kms",
                    label: "密钥管理"
                },
                {
                    value: "aio",
                    label: "一体机"
                }
            ],
            organizationList: []
        }
    },
    created() {
        this.isAdmin = this.$commonJs.getStorage().isAdmin
        if (this.$commonJs.getStorage().isAdmin != true) {
            if (this.$commonJs.getStorage().routeType == "10") {
                this.form.systems = "hsm"
            } else if (this.$commonJs.getStorage().routeType == "20") {
                this.form.systems = "svs"
            } else if (this.$commonJs.getStorage().routeType == "30") {
                this.form.systems = "ca"
            } else if (this.$commonJs.getStorage().routeType == "40") {
                this.form.systems = "kms"
            }
        }
        this.resultList()
    },

    methods: {
        // 查询列表
        getOperationList() {
            this.loading = true
            if (this.form.end_time != null) {
                if (
                    this.$commonJs.dateTimeFormatterThree(this.form.end_time) !=
                    ""
                ) {
                    this.form.end_time = this.$commonJs.dateTimeFormatterThree(
                        this.form.end_time
                    )
                }

                if (
                    this.$commonJs.dateTimeFormatterSelect(this.form.end_time,"2") != ""
                ) {
                    this.form.end_time = this.$commonJs.dateTimeFormatterSelect(
                        this.form.end_time,"2"
                    )
                }
            } else {
                this.form.end_time = ""
            }
            if (this.form.start_time != null) {
                if (
                    this.$commonJs.dateTimeFormatterThree(
                        this.form.start_time
                    ) != ""
                ) {
                    this.form.start_time =
                        this.$commonJs.dateTimeFormatterThree(
                            this.form.start_time
                        )
                }
                if (
                    this.$commonJs.dateTimeFormatterSelect(this.form.start_time,"1") != ""
                ) {
                    this.form.start_time = this.$commonJs.dateTimeFormatterSelect(
                        this.form.start_time,"1"
                    )
                }
            } else {
                this.form.start_time = ""
            }

            // if (this.form.end_time.indexOf("T") != -1) {
            if (this.form.end_time < this.form.start_time) {
                this.form.end_time = this.form.start_time
            }

            // }

            this.radio = this.form.audit_user
            if (this.form.audit_user == "2") {
                this.form.audit_user = ""
            } else {
                this.form.audit_user = JSON.parse(
                    window.sessionStorage.getItem("roles")
                )[0].user_id
            }

            this.$commonJs
                .getMethodData(this.$url.GetOperationList, "POST", this.form)
                .then((res) => {
                    if (this.form.start_time != null) {
                        this.form.start_time =
                            this.$commonJs.dateTimeFormatterTwo(
                                this.form.start_time
                            )
                    }
                    if (this.form.end_time != null) {
                        this.form.end_time =
                            this.$commonJs.dateTimeFormatterTwo(
                                this.form.end_time
                            )
                    }

                    if (res.data.code == 100000) {
                        this.operationList = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }

                    this.form.audit_user = this.radio
                    this.loading = false
                })
        },

        getDicData() {
            this.$commonJs.GetOrgList().then((res) => {
                this.organizationList = res
            })
            // this.$commonJs.GetDicData("system_type").then((res) => {
            //     res.unshift({
            //         value: "",
            //         label: ""
            //     });
            //     this.systemList = res;
            // });
        },
        handleChange(data) {
            this.$refs.cascaderHandle.dropDownVisible = false
            this.form.organization_id = data[data.length - 1]
        },

        getOperationExport() {
            if (
                this.$commonJs.dateTimeFormatterThree(this.form.start_time) !=
                ""
            ) {
                this.form.start_time = this.$commonJs.dateTimeFormatterThree(
                    this.form.start_time
                )
            }
            if (
                this.$commonJs.dateTimeFormatterThree(this.form.end_time) != ""
            ) {
                this.form.end_time = this.$commonJs.dateTimeFormatterThree(
                    this.form.end_time
                )
            }
            if (this.$commonJs.dateTimeFormatterSelect(this.form.start_time,"1") != "") {
                this.form.start_time = this.$commonJs.dateTimeFormatterSelect(
                    this.form.start_time,"1"
                )
            }

            if (this.$commonJs.dateTimeFormatterSelect(this.form.end_time,"2") != "") {
                this.form.end_time = this.$commonJs.dateTimeFormatterSelect(
                    this.form.end_time,"2"
                )
            }
            if (this.form.end_time < this.form.start_time) {
                this.form.end_time = this.form.start_time
            }
            console.log(this.form.start_time, "this.form.start_time")
            this.radio = this.form.audit_user
            if (this.form.audit_user == "2") {
                this.form.audit_user = ""
            } else {
                this.form.audit_user = JSON.parse(
                    window.sessionStorage.getItem("roles")
                )[0].user_id
            }
            let operatorType = this.getOperatorType()
            let dataList = {
                business_type: "",
                title: this.form.title, // 模块标题
                // operator_ip: "", // 主机地址
                // operator_type: operatorType,
                systems: this.form.systems,
                audit_user: this.form.audit_user, // 审计人
                start_time: this.form.start_time, // 操作时间
                end_time: this.form.end_time,
                organization_id: this.form.organization_id // 组织id
            }
            // if (this.isAdmin == false) {
            //     // dataList.business_type = "90";
            // }
            this.$commonJs
                .downLoadMethodData(
                    this.$url.OperationLogExport,
                    "POST",
                    dataList
                )
                .then((res) => {
                    this.form.start_time = this.$commonJs.dateTimeFormatterTwo(
                        this.form.start_time
                    )
                    this.form.end_time = this.$commonJs.dateTimeFormatterTwo(
                        this.form.end_time
                    )
                    this.form.audit_user = this.radio
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "JOURNAL"
                        link.style.display = "none"
                        const url =
                            window.URL || window.webkitURL || window.moxURL
                        link.href = window.URL.createObjectURL(blob)
                        link.download = _fileName //下载的文件名称
                        link.click()
                        window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                    } catch (e) {
                        this.$message.error("下载失败!")
                    }
                })
        },
        getOperatorType() {
            let operatorType = ""
            if (this.$commonJs.getStorage().organization_id != 1) {
                if (this.$commonJs.getStorage().routeType == "10") {
                    operatorType = "6"
                }
                if (this.$commonJs.getStorage().routeType == "20") {
                    operatorType = "7"
                }
                if (this.$commonJs.getStorage().routeType == "30") {
                    operatorType = "8"
                }
                if (this.$commonJs.getStorage().routeType == "40") {
                    operatorType = "9"
                }
            }
            return operatorType
        },
        // 重置搜索框
        resultList() {
            // debugger;
            let operatorType = this.getOperatorType()
            // let runTime = window.sessionStorage.getItem("runTime")
            var dateTime1 = new Date()
            let runTime = new Date(dateTime1.setDate(dateTime1.getDate() - 1))
            let NowTime = this.$commonJs.dateTimeFormatterTwo(
                this.$commonJs.dateTimeFormatter(new Date())
            )
            let morning = Number(NowTime.split("T")[0].split("-")[2]) + 1
            let StartTime =
                NowTime.split("T")[0].split("-")[0] +
                "-" +
                NowTime.split("T")[0].split("-")[1] +
                "-" +
                morning.toString()

            var dateTime = new Date()
            dateTime = new Date(dateTime.setDate(dateTime.getDate()))
            let endTime = this.$commonJs.dateTimeFormatterSelect(dateTime,"2")

            this.form = {
                title: "", // 模块标题
                audit_user: "2", // 审计人
                // end_time: this.$commonJs.dateTimeFormatterTwo(
                //     this.$commonJs
                //         .dateTimeFormatter(new Date())
                //         .split("\xa0")[0] +
                //         "\xa0" +
                //         "24:00:00"
                // ), // 操作时间
                systems: this.form.systems,

                // operator_type: operatorType,
                organization_id: this.$commonJs.getStorage().organization_id,
                end_time: endTime,
                start_time: runTime,
                // end_time: StartTime + "\xa0" + "00:00:00",
                business_type: "",
                pageNow: 1,
                pageSize: 10
            }
            this.organizationArr = []

            if (this.isAdmin == false) {
                // this.form.business_type = "90";
            }
            this.getOperationList()
            this.getDicData()
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getOperationList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getOperationList()
        },

        // 审计
        xiangqing(row, mode) {
            this.$router.push({
                path: "/operationLogDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            })
        },
        // 删除
        handleDelete(row) {
            this.$confirm("是否永久删除此条操作日志?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.OperationLogdelOne, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!")
                                this.getOperationList()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    })
                })
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
.demonstration {
    font-size: 14px;
}
/deep/ .el-input.is-disabled .el-input__inner {
    cursor: pointer !important;
}
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
/deep/ .el-input.is-disabled .el-input__inner {
    cursor: pointer !important;
}
</style>
