<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="6">
                    <span class="titleLabel" style="width:35px">姓名:</span>
                    <el-input v-model="form.fullname" placeholder="请输入姓名" style="width:70%" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="7" style=" ">
                    <span class="titleLabel" style="width:35px;">类型:</span>
                    <el-select v-model="form.type" placeholder="请选择类型" class="searchInputClass">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="11">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getUserList">查询</el-button>
                </el-col>
            </el-row>
            <el-row>

                <el-col v-if="$commonJs.getStorage().isAdmin==true" :span="16" style="margin-left:4px;margin-top:20px">
                    <addOrg style="width:106%" @organization_id="organization_id"></addOrg>
                </el-col>
            </el-row>

            <el-row style="margin-left: 5px" :style="{'margin-top': $commonJs.getStorage().isAdmin==true ? '50px' : '0px'}">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="userList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="姓名" prop="fullname">
                    <template slot-scope="scope">
                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">{{scope.row.fullname}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系方式" prop="tel"></el-table-column>
                <el-table-column label="证书序列号" prop="serial_number"></el-table-column>
                <el-table-column label="类型" prop="type">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type=='judicial'">司法取证员</span>
                        <span v-else-if="scope.row.type=='other'">其他</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">

                        <el-button @click.native.stop="xiangqing(scope.row,3)" key='4' type="text" size="mini" class="el-icon-edit" style="color: #1890ff;cursor:pointer">修改</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row)" key='5' type="text" size="mini" class="el-icon-delete" style="color: #da0909;cursor:pointer">删除</el-button>


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
import addOrg from "../organization/addOrg.vue";
export default {
    inject: ["reload"],
    components: { addOrg },

    data() {
        return {
            form: {
                username: "",
                fullname: "", // 绑定角色
                tel: "",
                type: "", // 类型
                pageNow: 1,
                pageSize: 10
            },

            typeList: [
                {
                    value: "",
                    label: ""
                },

                {
                    value: "judicial",
                    label: "司法取证员"
                },
                {
                    value: "other",
                    label: "其他"
                }
            ],
            loading: false,
            total: 0,
            userList: [],
            userId: ""
        };
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
        }
        this.getUserList();
    },
    methods: {
        // 查询列表
        getUserList() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.WorkUserGetList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.userList = res.data.page.receList;
                        this.total = res.data.page.totalRows;
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
        pushCert(row) {
            this.$router.push({
                name: "certificateList",
                query: {
                    roleId: row.user_id,
                    type: "SiFa"
                }
            });
            sessionStorage.setItem("queryType", "SiFa");

            this.reload();
        },

        // 重置搜索框
        resultList() {
            this.reload();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getUserList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getUserList();
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/JudicialAdminDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w");

            this.$router.push({
                path: "/JudicialAdminDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            });
        },
        // 删除
        handleDelete(row) {
            this.$confirm("是否永久删除此用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.WorkUserDelOne, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!");
                                this.getUserList();
                                console.log(res, "res");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        resetPassword(row) {
            this.$confirm("是否重置密码?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.GetUserResetPass, "POST", {
                            id: row.user_id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("重置密码已完成!");
                                this.getUserList();
                                console.log(res, "res");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                })
                .catch((err) => err);
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
/deep/ .el-button--mini {
    padding: 5px 5px !important;
}
</style>
