<template>
    <div class="navItem">
        <el-card class="search">
            <!-- <el-row>
                <el-col :span="6">
                    <span class="titleLabel" style="width:70px">所属根证书:</span>
                    <el-input v-model="form.name" placeholder="请输入CRL名称" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="7">
                    <span class="titleLabel">IP地址:</span>
                    <el-input v-model="form.ip" placeholder="请输入IP地址" class="searchInputClass"></el-input>
                </el-col>

                <el-col :span="11">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCrlList">查询</el-button>
                </el-col>
            </el-row> -->
            <el-row style="margin-top:0px;margin-left:-10px" v-if="$commonJs.getStorage().isAdmin==true">
                <el-col :span="16">
                    <addOrg @organization_id="organization_id"></addOrg>
                </el-col>
                <el-col :span="8">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getCrlList">查询</el-button>
                </el-col>

            </el-row>
            <el-row :style="{'margin-top': $commonJs.getStorage().isAdmin==true ? '15px':'0px'}">
                <el-col>
                    <el-button size="mini" @click="Revocation()" type="primary" icon="el-icon-plus">吊销同步</el-button>
                    <!-- <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">添加CRL</el-button> -->
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="CrlData" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="所属根证书">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">
                            <span v-if="scope.row.caCert !=null">
                                {{scope.row.caCert.common_name}}</span>
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="发布地址" prop="release_url"></el-table-column> -->
                <el-table-column label="证书开始时间" prop="thisupdates"></el-table-column>
                <el-table-column label="证书结束时间" prop="nextupdates"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button @click.native.stop="xiangqing(scope.row,5)" type="text" size="mini" class="el-icon-close" style="color: #67C23A">吊销</el-button> -->

                        <el-button @click.native.stop="xiaZai(scope.row)" type="text" size="mini" class="el-icon-upload" style="color: #1890ff">下载CRL</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row,'删除')" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                        <!-- <el-button v-if="scope.row.status!='10'" :disabled="scope.row.status=='90'" @click.native.stop="handleDelete(scope.row,'禁用')" type="text" size="mini" class="el-icon-close" style="color: #e33ce6">禁用</el-button>
                        <el-button v-if="scope.row.status=='10'" @click.native.stop="handleDelete(scope.row,'启用')" type="text" size="mini" class="el-icon-check" style="color:#E6A23C">启用</el-button> -->
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
        <PinList ref="PinDialog" @PIN="PIN"></PinList>

    </div>
</template>
<script>
import PinList from "../CaCert/PinList.vue";
import addOrg from "../organization/addOrg.vue";
export default {
    inject: ["reload"],
    components: { addOrg, PinList },
    data() {
        return {
            form: {
                name: "", //  CRL名称
                ip: "",
                organization_id: "",
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            CrlData: [],
            menuRoleId: ""
        };
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
            console.log(
                this.$commonJs.getStorage().isAdmin,
                'v-if="$commonJs.getStorage().isAdmin==true"'
            );
        }
        this.getCrlList();
    },
    methods: {
        // 查询列表
        getCrlList() {
            // let data = form;
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.GetCrlList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.CrlData = res.data.page.receList;
                        this.total = res.data.page.totalRows;
                        // this.CrlData.push({ name: "CRL管理" });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                    console.log(res, "res");
                });
        },
        organization_id(val) {
            this.form.organization_id = val;
        },
        // 重置搜索框
        resultList() {
            this.reload();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getCrlList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getCrlList();
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/CrlDetail",
                query: {
                    mode: 1
                }
            });
        },
        openRevocation() {
            this.$refs.PinDialog.modifyFormdialog = true;
            this.$refs.PinDialog.modifyForm.PINStr = "";
        },
        PIN(val) {
            // if (val != "") {
            //     let pin = val;
            //     if (val != "false") {
            //         this.Revocation(pin);
            //     } else {
            //         this.loading = false;
            //     }
            // }
        },
        Revocation(pin) {
            this.$confirm("是否吊销同步?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.loading = true;
                    this.$commonJs
                        .getMethodData(this.$url.UpdateCrl, "POST", {
                            // pucPassword: pin
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("吊销同步成功!");
                                this.getCrlList();
                                console.log(res, "res");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            this.loading = false;
                        });
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        xiaZai(row) {
            this.loading = true;
            this.$commonJs
                .downLoadMethodData(this.$url.DownCrl, "POST", {
                    id: row.id
                })
                .then((res) => {
                    // debugger;
                    console.log(res, "res");
                    const link = document.createElement("a");
                    try {
                        let blob = res.data; //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "CRL.crl";
                        link.style.display = "none";
                        const url =
                            window.URL || window.webkitURL || window.moxURL;
                        link.href = window.URL.createObjectURL(blob);
                        link.download = _fileName; //下载的文件名称
                        link.click();
                        window.URL.revokeObjectURL(url); // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                    } catch (error) {
                        this.$message.error("下载失败!");
                    }
                    this.loading = false;
                    // console.log(res, "res");
                });
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w");
            this.$router.push({
                path: "/CrlDetail",
                query: {
                    mode: mode,
                    id: row.id,
                    ca_cert_id: row.ca_cert_id
                }
            });
        },
        getType(status, type) {
            if (type == "启用") {
                if (status == "20") {
                    this.$message.info("当前状态与修改状态相同!");
                    return false;
                }
            }
            if (type == "禁用") {
                if (status == "10") {
                    this.$message.info("当前状态与修改状态相同!");
                    return false;
                }
            }
        },
        // 删除
        handleDelete(row, type) {
            console.log(row, "row");
            if (type == "删除") {
                this.$confirm("是否永久删除此条CRL管理?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.CrlDel, "POST", {
                                id: row.id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("删除成功!");
                                    this.getCrlList();
                                    console.log(res, "res");
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg);
                                }
                            });
                    })
                    .catch(() => {});
            } else if (type == "禁用") {
                this.$confirm("是否禁用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    if (this.getType(row.status, "禁用") == false) {
                        return;
                    }
                    this.$commonJs
                        .getMethodData(this.$url.GetUpdApp, "POST", {
                            id: row.id,
                            status: "10"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("禁用成功!");

                                this.getCrlList();
                                console.log(res, "res");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                });
            } else {
                this.$confirm("是否启用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then((res) => {
                    if (this.getType(row.status, "启用") == false) {
                        return;
                    }
                    this.$commonJs
                        .getMethodData(this.$url.GetUpdApp, "POST", {
                            id: row.id,
                            status: "20"
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("启用成功!");
                                this.getCrlList();
                                console.log(res, "res");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                });
            }
        }
    }
};
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
