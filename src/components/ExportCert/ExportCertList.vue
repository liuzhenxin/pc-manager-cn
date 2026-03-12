<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col>
                    <exportLogin></exportLogin>
                </el-col>
                <!-- <el-col :span="6">
                    <span class="titleLabel" style="width:70px">应用名称:</span>
                    <el-input v-model="form.name" placeholder="请输入应用名称" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="7">
                    <span class="titleLabel">IP地址:</span>
                    <el-input v-model="form.ip" placeholder="请输入IP地址" class="searchInputClass"></el-input>
                </el-col>

                <el-col :span="11">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCertList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:20px" v-if="$commonJs.getStorage().isAdmin==true">
                <el-col :span="16">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>-->
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="certData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="证书序列号" width="190">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">
                            {{scope.row.serial_number}}
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="证书主题" prop="code"></el-table-column> -->
                <el-table-column label="颁发者" prop="issuer" width="200"></el-table-column>
                <el-table-column label="使用者" prop="subject" width="225"></el-table-column>
                <el-table-column label="密钥类型" prop="key_algorithm"></el-table-column>
                <el-table-column label="密钥长度" prop="key_length">{{256}}</el-table-column>
                <el-table-column label="证书类型">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.cert_type == 'signature'">签名</span>
                        <span style="" v-else>加密</span>
                    </template>

                </el-table-column>
                <el-table-column label="证书状态" prop="status">
                    <template slot-scope="scope">
                        <!-- 状态 20:启用【enabled】 10:停用【disable】 11:申请中 90:注销【revoked】 -->
                        <span style="" v-if="scope.row.status=='10'">停用</span>
                        <span style="" v-else-if="scope.row.status=='20'">启用</span>
                        <span style="" v-else-if="scope.row.status=='11'">申请中</span>
                        <span style="" v-else-if="scope.row.status=='90'">注销</span>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" prop="not_before"></el-table-column>
                <el-table-column label="结束时间" prop="not_after"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="xiaZai(scope.row,4)" type="text" size="mini" class="el-icon-upload" style="color: #00DDDD;margin-left:0px">下载证书</el-button>
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
import addOrg from "../organization/addOrg.vue"
import exportLogin from "./ExportLogin.vue"
export default {
    inject: ["reload"],
    components: {
        addOrg,
        exportLogin
    },
    data() {
        return {
            form: {
                organization_id: "",
                organizationFatherName: "",
                status: "", // 状态 20:启用【enabled】 10:停用【disable】 90:注销【revoked】
                // issuer: "", // 证书颁发者
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            certData: [],
            menuRoleId: ""
        }
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        }
        this.getCertList()
    },
    methods: {
        // 查询列表
        getCertList() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.CertListByPage, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.certData = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res", " this.certData", this.certData)
                    this.loading = false
                })
        },
        organization_id(val) {
            this.form.organization_id = val
        },
        // 重置搜索框
        resultList() {
            this.reload()
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getCertList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getCertList()
        },
        xiaZai(row, mode) {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.WorkUserDownCert, "POST", {
                    cert_issue_id: row.id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$commonJs
                            .downLoadMethodData(
                                this.$url.WorkUserDownCert,
                                "POST",
                                {
                                    cert_issue_id: row.id
                                }
                            )
                            .then((res) => {
                                console.log(res, "res")
                                const link = document.createElement("a")
                                try {
                                    let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                                    let _fileName = "cert.cer"
                                    link.style.display = "none"
                                    const url =
                                        window.URL ||
                                        window.webkitURL ||
                                        window.moxURL
                                    link.href = window.URL.createObjectURL(blob)
                                    link.download = _fileName //下载的文件名称
                                    link.click()
                                    window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                                    this.isXiaZai = true
                                } catch (error) {
                                    this.$message.error("下载失败!")
                                }
                            })
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res", " this.certData", this.certData)
                    this.loading = false
                })
        },
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/ExportCertDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
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
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
</style>
