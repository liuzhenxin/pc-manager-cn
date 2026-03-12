<template>
    <div class="navItem">

        <el-card class="search">
            <el-row>
                <el-col :span="6">
                    <span class="titleLabel" style="width:35px">姓名:</span>
                    <el-input v-model="form.fullname" placeholder="请输入姓名" style="width:70%" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="7">
                    <span class="titleLabel" style="width:100px">联系方式:</span>
                    <el-input v-model="form.tel" placeholder="请输入联系方式" class="searchInputClass" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-col>
                <el-col :span="7">
                    <span class="titleLabel">账号:</span>
                    <el-input v-model="form.username" placeholder="请输入账号" class="searchInputClass"></el-input>
                </el-col>

                <el-col :span="4">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList()">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getUserList">查询</el-button>
                </el-col>
                <el-col :span="6" style="margin-top:20px">
                    <span class="titleLabel" style="width:35px;">类型:</span>
                    <el-select v-model="form.type" placeholder="请选择类型" class="searchInputClass" style="width:70%">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <!-- <el-col :span="7" style="margin-top:20px">
                    <span class="titleLabel" style="width:100px;">组织机构:</span>
                    <el-cascader style="margin-left:5px;width:60%" ref="cascaderHandle" :show-all-levels="false" :props="{ checkStrictly: true }" v-model="organizationArr" :options="organizationData" @change="handleChange" placeholder="请选择组织机构"></el-cascader>
                </el-col> -->

            </el-row>
            <el-row style="margin-top:70px;margin-left: 5px">
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
                <el-table-column label="姓名" prop="fullname" width="180">
                    <template slot-scope="scope">
                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">{{scope.row.fullname}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" prop="nickname" width="150"></el-table-column>
                <el-table-column label="联系方式" prop="tel" width="120"></el-table-column>
                <el-table-column label="账号" prop="username" width="150"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="类型" prop="type" width="140">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==0" class="statusSuccess">超级管理员</span>
                        <span v-else-if="scope.row.type==1" class="statusSuccess">系统用户</span>
                        <span v-else class="statusSuccess">普通用户</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time" width="200"></el-table-column>
                <el-table-column label="操作" width="485">
                    <template slot-scope="scope">
                        <el-button v-if="isBtn" @click.native.stop="resetPassword(scope.row)" key='2' type="text" size="mini" class="el-icon-warning-outline" style="color: #E6A23C;cursor:pointer">重置密码</el-button>
                        <el-button v-if="isBtn" @click.native.stop="getRole(scope.row)" key='3' type="text" size="mini" class="el-icon-edit" style="color: #F56C6C;cursor:pointer">分配角色</el-button>
                        <el-button v-if="isBtn" @click.native.stop="xiangqing(scope.row,3)" key='4' type="text" size="mini" class="el-icon-edit" style="color: #1890ff;cursor:pointer">修改</el-button>
                        <el-button v-if="isBtn" @click.native.stop="handleDelete(scope.row)" key='5' type="text" size="mini" class="el-icon-delete" style="color: #da0909;cursor:pointer">删除</el-button>
                        <el-button @click.native.stop="pushCert(scope.row)" type="text" size="mini" class="el-icon-document" style="color: #409EFF;cursor:pointer">证书</el-button>
                        <el-button v-if="scope.row.sysOrganization == null" key='1' @click.native.stop="getOrganizationTree(scope.row)" type="text" size="mini" class="el-icon-plus" style="color: #67C23A;cursor:pointer">关联组织机构</el-button>
                        <el-button v-if="scope.row.sysOrganization != null" key='1' @click.native.stop="removeOrganization(scope.row)" type="text" size="mini" class="el-icon-close" style="color: #67C23A;cursor:pointer">解绑组织机构</el-button>
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
        <el-dialog title="选择关联组织机构" :visible.sync="dialogVisible" width="30%">
            <el-row style="margin-top:-30px">
                <el-col>
                    <div class="downTree">
                        <el-tree :data="organizationList" check-strictly :expand-on-click-node="false" default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" @check=" (click, checked)=>{handleCheckChange(click, checked)}">
                            <span class=" custom-tree-node" :class="data.class" slot-scope="{node ,data}">
                                <el-radio v-model="radio" :label="data.id" @change="organizationChange(data)">
                                    <span><i :class="data.icon" style="margin-right:5px"></i>{{ node.label }}
                                    </span>
                                </el-radio>
                            </span>
                        </el-tree>

                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoorganization()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addorganization()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择分配角色" :visible.sync="roleDialogVisible" width="38%" :before-close="infoRole">
            <el-row :gutter="20" style="margin-top:10px">
                <el-col :offset="5">

                    <span class="titleLabel" style="width:70px;display:inline-block">密码机:</span>
                    <el-select style="margin-left:5px" v-model="userRoleId1" placeholder="请选择分配角色">
                        <el-option v-for="item in passwordList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="bindRole(userRoleId1)">绑 定</el-button>
                    <el-button style="margin-left:10px" size="mini" type="danger" @click="removeRole(userRoleId1,'1')">解 绑</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px">
                <el-col :offset="5">
                    <span class="titleLabel" style="width:70px;display:inline-block">签名验签:</span>
                    <el-select style="margin-left:5px" v-model="userRoleId2" placeholder="请选择分配角色">
                        <el-option v-for="item in signList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="bindRole(userRoleId2)">绑 定</el-button>
                    <el-button style="margin-left:10px" size="mini" type="danger" @click="removeRole(userRoleId2,'2')">解 绑</el-button>
                </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top:10px">
                <el-col :offset="5">
                    <span class="titleLabel" style="width:70px;display:inline-block">CA:</span>
                    <el-select style="margin-left:5px" v-model="userRoleId3" placeholder="请选择分配角色">
                        <el-option v-for="item in CAList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="bindRole(userRoleId3)">绑 定</el-button>
                    <el-button style="margin-left:10px" size="mini" type="danger" @click="removeRole(userRoleId3,'3')">解 绑</el-button>

                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px">
                <el-col :offset="5">
                    <span class="titleLabel" style="width:70px;display:inline-block">KMS:</span>
                    <el-select style="margin-left:5px" v-model="userRoleId4" placeholder="请选择分配角色">
                        <el-option v-for="item in kmsList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="bindRole(userRoleId4)">绑 定</el-button>
                    <el-button style="margin-left:10px" size="mini" type="danger" @click="removeRole(userRoleId4,'4')">解 绑</el-button>

                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoRole()" size="mini" type="warning">取 消</el-button>
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
                username: "",
                fullname: "", // 绑定角色
                tel: "",
                organization_id: "",
                type: "", // 类型
                pageNow: 1,
                pageSize: 10
            },
            organizationArr: [],
            userRoleId1: "",
            userRoleId2: "",
            userRoleId3: "",
            userRoleId4: "",
            roleDialogVisible: false,
            defaultProps: {
                children: "children",
                label: "name"
                // icon-class:"icon"
            },
            radio: "",
            organizationList: [],
            typeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: 0,
                    label: "超级管理员"
                },
                {
                    value: 1,
                    label: "系统用户"
                },
                {
                    value: 2,
                    label: "普通用户"
                }
            ],
            threeType: "",
            CAList: [],
            kmsList: [],
            signList: [],
            passwordList: [],
            dialogVisible: false,
            loading: false,
            total: 0,
            userList: [],
            ischeckList: [],
            userId: "",
            isBindOrganization: false,
            isBindRole: false,
            roleList: [],
            role1List: [],
            role2List: [],
            role3List: [],
            isBtn: true,
            organizationData: []
        };
    },
    created() {
        this.getUserList();
    },
    methods: {
        // 查询列表
        getUserList() {
            // let data = form;
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.GetUserList, "POST", this.form)
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
            this.$commonJs.GetOrgList().then((res) => {
                this.organizationData = res;
            });
        },

        handleChange(data) {
            this.$refs.cascaderHandle.dropDownVisible = false;
            this.form.organization_id = data[data.length - 1];
        },
        pushCert(row) {
            this.$router.push({
                name: "certificateList",
                query: {
                    roleId: row.id
                }
            });
            sessionStorage.setItem(
                "queryTypeList",
                JSON.stringify({
                    queryType: "YongHu",
                    certRoleId: row.id
                })
            );

            this.reload();
        },
        infoRole() {
            this.roleDialogVisible = false;
            this.userRoleId1 = "";
            this.userRoleId2 = "";
            this.userRoleId3 = "";
            this.userRoleId4 = "";
        },
        getRole(row) {
            if (row.sysOrganization == null) {
                this.$message.error("请绑定组织机构！");
                return false;
            }
            this.userId = row.id;

            this.roleDialogVisible = true;
            this.$commonJs.GetUserRole(row.id, "10").then((res) => {
                this.roleList = res.roleList;
                this.passwordList = res.roleAllList;
                this.userRoleId1 = res.userRole;
            });
            this.$commonJs.GetUserRole(row.id, "20").then((res) => {
                this.role1List = res.roleList;
                this.signList = res.roleAllList;
                this.userRoleId2 = res.userRole;
            });
            this.$commonJs.GetUserRole(row.id, "30").then((res) => {
                this.role2List = res.roleList;
                this.CAList = res.roleAllList;
                this.userRoleId3 = res.userRole;
            });

            this.$commonJs.GetUserRole(row.id, "40").then((res) => {
                this.role3List = res.roleList;
                this.kmsList = res.roleAllList;
                this.userRoleId4 = res.userRole;
            });
        },
        organizationChange(data) {
            console.log(data, "data");
            this.ischeckList = [data];
        },
        getOrganizationTree(row) {
            this.userId = row.id;
            this.dialogVisible = true;
            this.$commonJs
                .getMethodData(this.$url.GetOrganizationList, "POST", {
                    status: ""
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // debugger;
                        this.organizationList = res.data.data;
                        console.log(this.organizationList, "res");
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    console.log(res, "res");
                });
        },
        removeOrganization(row) {
            console.log(row, "row");
            this.$confirm("是否解绑组织机构?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(
                            this.$url.GetUnbindOrganization,
                            "POST",
                            {
                                user_id: row.id
                            }
                        )
                        .then((res) => {
                            console.log(res, "res");
                            if (res.data.code == 100000) {
                                console.log(res, "res");
                                this.$message.success("解绑组织机构成功!");
                                this.getUserList();
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                })
                .catch((err) => err);
        },
        infoorganization() {
            this.radio = "";
            this.dialogVisible = false;
        },
        addorganization() {
            if (this.ischeckList.length > 1) {
                this.$message.error("只能选择一个父级菜单!");
                return false;
            } else {
                this.dialogVisible = false;
                setTimeout(() => {
                    this.$confirm("是否绑定组织机构?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(
                                    this.$url.GetbindOrganization,
                                    "POST",
                                    {
                                        // code: "",
                                        // id: "",
                                        organization_id: this.ischeckList[0].id,
                                        user_id: this.userId
                                    }
                                )
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        console.log(res, "res");

                                        this.getUserList();
                                        this.dialogVisible = false;
                                        this.$message.success(
                                            "绑定组织机构已完成!"
                                        );
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg);
                                    }
                                    console.log(res, "res");
                                });
                        })
                        .catch((err) => {
                            setTimeout(() => {
                                this.dialogVisible = true;
                            }, 300);
                        });
                }, 300);
            }
        },

        removeRole(roleId, type) {
            this.$confirm("是否解绑角色?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.RoleUnbind, "POST", {
                            role_id: roleId,
                            user_id: this.userId
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this["userRoleId" + type] = "";
                                this.$message.success("解绑角色成功!");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                })
                .catch((err) => err);
        },

        bindRole(roleId) {
            this.$confirm("是否分配角色?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.GetUserBindRole, "POST", {
                            role_id: roleId,
                            user_id: this.userId
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("分配角色已完成!");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                })
                .catch((err) => err);
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
                path: "/userInformationDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w");
            this.$router.push({
                path: "/userInformationDetail",
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
                        .getMethodData(this.$url.GetdelUser, "POST", {
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
                            id: row.id
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
