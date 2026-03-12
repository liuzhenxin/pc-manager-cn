<template>
    <div class="navItem">

        <el-card class="search">
            <el-row>
                <el-col :span="6">
                    <span class="titleLabel" style="width:50px">用户名:</span>
                    <el-input v-model="form.username" placeholder="请输入用户名" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="6">
                    <span class="titleLabel" style="width:35px">姓名:</span>
                    <el-input v-model="form.fullname" placeholder="请输入姓名" style="width:70%" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="7">
                    <span class="titleLabel" style="width:100px">联系方式:</span>
                    <el-input v-model="form.tel" placeholder="请输入联系方式" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getUserList">查询</el-button>
                </el-col>

            </el-row>
            <el-row style="margin-top:20px;margin-left: 5px">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增</el-button>
                    <!-- <el-button size="mini" @click="handleDelete1()" type="warning" icon="el-icon-delete">删除</el-button> -->
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
                <el-table-column label="用户名" prop="fullname">
                    <template slot-scope="scope">
                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">{{scope.row.fullname}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="nickname"></el-table-column>

                <el-table-column label="联系方式" prop="tel"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="状态" prop="type">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==0">超级管理员</span>
                        <span v-else-if="scope.row.type==1">系统用户</span>
                        <span v-else>普通用户</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否在线" prop="username"></el-table-column>

                <el-table-column label="操作" width="350">
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <el-button v-if="isBtn" @click.native.stop="resetPassword(scope.row)" key='2' type="text" size="mini" class="el-icon-warning-outline" style="color: #E6A23C;cursor:pointer">重置密码</el-button>
                        <el-button v-if="isBtn" @click.native.stop="xiangqing(scope.row,3)" key='4' type="text" size="mini" class="el-icon-edit" style="color: #1890ff;cursor:pointer">修改</el-button>
                        <el-button v-if="isBtn" @click.native.stop="handleDelete(scope.row)" key='5' type="text" size="mini" class="el-icon-delete" style="color: #da0909;cursor:pointer">删除</el-button>
                        <el-button v-if="scope.row.sysOrganization == null" key='1' @click.native.stop="getOrganizationTree(scope.row)" type="text" size="mini" class="el-icon-plus" style="color: #67C23A;cursor:pointer">启动</el-button>
                        <el-button v-if="scope.row.sysOrganization != null" key='1' @click.native.stop="removeOrganization(scope.row)" type="text" size="mini" class="el-icon-close" style="color: #67C23A;cursor:pointer">禁用</el-button>
                        <el-button @click.native.stop="pushCert(scope.row)" type="text" size="mini" class="el-icon-document" style="color: #409EFF;cursor:pointer">踢出</el-button>

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
        <el-dialog title="选择分配角色" :visible.sync="roleDialogVisible" width="30%" :before-close="infoRole">
            <el-row :gutter="20" style="margin-top:10px">
                <el-col :offset="5">
                    <!-- <div class="downTree"> -->
                    <span class="titleLabel" style="width:70px;display:inline-block">密码机:</span>
                    <el-select style="margin-left:5px" v-model="userRoleId1" placeholder="请选择分配角色">
                        <!-- <el-option>&nbsp;</el-option> -->
                        <el-option v-for="item in passwordList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="addRole()">确 定</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px">
                <el-col :offset="5">
                    <!-- <div class="downTree"> -->
                    <span class="titleLabel" style="width:70px;display:inline-block">签名验签:</span>
                    <el-select style="margin-left:5px" v-model="userRoleId2" placeholder="请选择分配角色">
                        <!-- <el-option>&nbsp;</el-option> -->
                        <el-option v-for="item in signList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="addRole1()">确 定</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px">
                <el-col :offset="5">
                    <!-- <div class="downTree"> -->
                    <span class="titleLabel" style="width:70px;display:inline-block">kms:</span>
                    <el-select style="margin-left:5px" v-model="userRoleId3" placeholder="请选择分配角色">
                        <!-- <el-option>&nbsp;</el-option> -->
                        <el-option v-for="item in kmsList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="addRole2()">确 定</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:10px">
                <el-col :offset="5">
                    <!-- <div class="downTree"> -->
                    <span class="titleLabel" style="width:70px;display:inline-block">CA:</span>
                    <el-select style="margin-left:5px" v-model="userRoleId4" placeholder="请选择分配角色">
                        <!-- <el-option>&nbsp;</el-option> -->
                        <el-option v-for="item in CAList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="addRole3()">确 定</el-button>
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
                type: "", // 类型
                pageNow: 1,
                pageSize: 10
            },
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
            isBtn: true
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
        },
        pushCert(row) {
            this.$router.push({
                name: "certificateList",
                query: {
                    roleId: row.id
                }
            });
            window.sessionStorage.setItem("activePath", "/certificateList");
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
            console.log(row, "row");
            if (row.sysOrganization == null) {
                this.$message.error("请绑定组织机构！");
                return false;
            }
            this.userId = row.id;
            // this.threeType = row.three_type;
            this.passwordList = [
                {
                    value: "",
                    label: ""
                }
            ];
            this.signList = [
                {
                    value: "",
                    label: ""
                }
            ];
            this.CAList = [
                {
                    value: "",
                    label: ""
                }
            ];
            this.kmsList = [
                {
                    value: "",
                    label: ""
                }
            ];
            this.roleDialogVisible = true;
            this.$commonJs.GetUserRole(row.id, "10").then((res) => {
                this.roleList = res.roleList;
                this.passwordList = this.passwordList.concat(res.roleAllList);
                this.userRoleId1 = res.userRole;
            });
            this.$commonJs.GetUserRole(row.id, "20").then((res) => {
                this.role1List = res.roleList;
                this.signList = this.signList.concat(res.roleAllList);
                this.userRoleId2 = res.userRole;
            });
            this.$commonJs.GetUserRole(row.id, "30").then((res) => {
                this.role2List = res.roleList;
                this.CAList = this.CAList.concat(res.roleAllList);
                this.userRoleId3 = res.userRole;
            });

            this.$commonJs.GetUserRole(row.id, "40").then((res) => {
                this.role3List = res.roleList;
                this.kmsList = this.kmsList.concat(res.roleAllList);
                this.userRoleId4 = res.userRole;
            });
            // this.$commonJs
            //     .getMethodData(this.$url.GetUserIdRole, "POST", {
            //         user_id: row.id,
            //         organization_id: row.sysOrganizationUser.organization_id,
            //         system_type: "10"
            //     })
            //     .then((res) => {
            //         console.log(res.data.data, "res");
            //         if (res.data.code == 100000) {
            //             let userRoleObj = {};
            //             let dataList = res.data.data;
            //             this.userRoleId1 = res.data.attrs.select_role;
            //             this.roleDialogVisible = true;

            //             for (var i = 0; i < dataList.length; i++) {
            //                 let userRoleObj = {};
            //                 userRoleObj["label"] = dataList[i].name;
            //                 userRoleObj["value"] = dataList[i].id;
            //                 this.passwordList.push(userRoleObj);
            //             }

            //             this.roleList = res.data.data;
            //             console.log(this.userRoleList, "ddd");
            //         } else if (res.data.code != 800000) {
            //             this.$message.error(res.data.msg);
            //         }
            //     });
            // this.$commonJs
            //     .getMethodData(this.$url.GetUserIdRole, "POST", {
            //         user_id: row.id,
            //         organization_id: row.sysOrganizationUser.organization_id,
            //         system_type: "20"
            //     })
            //     .then((res) => {
            //         console.log(res.data.data, "res");
            //         if (res.data.code == 100000) {
            //             // this.userRoleList = [];
            //             let userRoleObj = {};
            //             let dataList = res.data.data;
            //             this.userRoleId2 = res.data.attrs.select_role;
            //             this.roleDialogVisible = true;
            //             for (var i = 0; i < dataList.length; i++) {
            //                 let userRoleObj = {};
            //                 userRoleObj["label"] = dataList[i].name;
            //                 userRoleObj["value"] = dataList[i].id;
            //                 this.signList.push(userRoleObj);
            //             }
            //             this.role1List = res.data.data;
            //             console.log(this.userRoleList, "ddd");
            //         } else if (res.data.code != 800000) {
            //             this.$message.error(res.data.msg);
            //         }
            //     });
            // this.$commonJs
            //     .getMethodData(this.$url.GetUserIdRole, "POST", {
            //         user_id: row.id,
            //         organization_id: row.sysOrganizationUser.organization_id,
            //         system_type: "30"
            //     })
            //     .then((res) => {
            //         console.log(res.data.data, "res");
            //         if (res.data.code == 100000) {
            //             // this.userRoleList = [];
            //             let userRoleObj = {};
            //             let dataList = res.data.data;
            //             this.userRoleId3 = res.data.attrs.select_role;
            //             this.roleDialogVisible = true;
            //             for (var i = 0; i < dataList.length; i++) {
            //                 let userRoleObj = {};
            //                 userRoleObj["label"] = dataList[i].name;
            //                 userRoleObj["value"] = dataList[i].id;
            //                 this.CAList.push(userRoleObj);
            //             }
            //             this.role2List = res.data.data;

            //             console.log(this.userRoleList, "ddd");
            //         } else if (res.data.code != 800000) {
            //             this.$message.error(res.data.msg);
            //         }
            //     });
            // this.$commonJs
            //     .getMethodData(this.$url.GetUserIdRole, "POST", {
            //         user_id: row.id,
            //         organization_id: row.sysOrganizationUser.organization_id,
            //         system_type: "40"
            //     })
            //     .then((res) => {
            //         console.log(res.data.data, "res");
            //         if (res.data.code == 100000) {
            //             let userRoleObj = {};
            //             let dataList = res.data.data;
            //             this.userRoleId4 = res.data.attrs.select_role;
            //             this.roleDialogVisible = true;
            //             for (var i = 0; i < dataList.length; i++) {
            //                 let userRoleObj = {};
            //                 userRoleObj["label"] = dataList[i].name;
            //                 userRoleObj["value"] = dataList[i].id;
            //                 this.kmsList.push(userRoleObj);
            //             }
            //             this.role3List = res.data.data;
            //             console.log(this.userRoleList, "ddd");
            //         } else if (res.data.code != 800000) {
            //             this.$message.error(res.data.msg);
            //         }
            //     });
        },
        organizationChange(data) {
            console.log(data, "data");
            this.ischeckList = [data];
        },
        getOrganizationTree(row) {
            console.log(row);
            this.userId = row.id;
            this.dialogVisible = true;
            // let data = form;
            this.$commonJs
                .getMethodData(this.$url.GetOrganizationList, "POST", {
                    status: ""
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // debugger;
                        this.organizationList = JSON.parse(res.data.data);
                        console.log(this.organizationList, "res");
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    console.log(res, "res");
                });
        },
        removeOrganization(row) {
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
                    .catch((err) => err);
            }
        },

        addRole(row) {
            console.log(this.userRoleId, "pp");
            let dataObj1 = {};
            if (this.roleList == undefined) {
                this.roleDialogVisible = true;
                return false;
            }
            if (this.roleList.length != 0) {
                this.roleList.forEach((item) => {
                    if (item.id == this.userRoleId1) {
                        dataObj1["organization_id"] = item.organization_id;
                        dataObj1["role_id"] = item.id;
                        dataObj1["system_type"] = item.system_type;
                        dataObj1["user_id"] = this.userId;
                        dataObj1["three_type"] = item.three_type;
                    }
                });
            }
            if (this.userRoleId1 == "") {
                dataObj1["role_id"] = "";
                dataObj1["system_type"] = "10";
                dataObj1["user_id"] = this.userId;
                dataObj1["three_type"] = "";
                //  this.threeType
            }
            console.log(dataObj1, "dataObj1");
            this.$confirm("是否分配角色?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(
                            this.$url.GetUserBindRole,
                            "POST",
                            dataObj1
                        )
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res");
                                this.getUserList();
                                // this.roleDialogVisible = false;
                                this.$message.success("分配角色已完成!");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            console.log(res, "res");
                        });
                })
                .catch((err) => {
                    this.roleDialogVisible = true;
                });
        },
        addRole1() {
            let dataObj2 = {};
            console.log(this.role1List, "this.role1List");
            if (this.role1List == undefined) {
                this.roleDialogVisible = true;
                return false;
            }
            if (this.role1List.length != 0) {
                this.role1List.forEach((item) => {
                    if (item.id == this.userRoleId2) {
                        dataObj2["organization_id"] = item.organization_id;
                        dataObj2["role_id"] = item.id;
                        dataObj2["system_type"] = item.system_type;
                        dataObj2["user_id"] = this.userId;
                        dataObj2["three_type"] = item.three_type;
                    }
                });
            }
            if (this.userRoleId2 == "") {
                dataObj2["role_id"] = "";
                dataObj2["system_type"] = "20";
                dataObj2["user_id"] = this.userId;
                dataObj2["three_type"] = "";
            }
            this.$confirm("是否分配角色?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(
                            this.$url.GetUserBindRole,
                            "POST",
                            dataObj2
                        )
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res");
                                this.getUserList();
                                // this.roleDialogVisible = false;
                                this.$message.success("分配角色已完成!");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            console.log(res, "res");
                        });
                })
                .catch((err) => {
                    this.roleDialogVisible = true;
                });
        },
        addRole2() {
            let dataObj3 = {};
            if (this.role2List == undefined) {
                this.roleDialogVisible = true;
                return false;
            }
            if (this.role2List.length != 0) {
                this.role2List.forEach((item) => {
                    if (item.id == this.userRoleId3) {
                        dataObj3["organization_id"] = item.organization_id;
                        dataObj3["role_id"] = item.id;
                        dataObj3["system_type"] = item.system_type;
                        dataObj3["user_id"] = this.userId;
                        dataObj3["three_type"] = item.three_type;
                    }
                });
            }
            if (this.userRoleId3 == "") {
                dataObj3["role_id"] = "";
                dataObj3["system_type"] = "30";
                dataObj3["user_id"] = this.userId;
                dataObj3["three_type"] = "";
            }
            this.$confirm("是否分配角色?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(
                            this.$url.GetUserBindRole,
                            "POST",
                            dataObj3
                        )
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res");
                                this.getUserList();
                                // this.roleDialogVisible = false;
                                this.$message.success("分配角色已完成!");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            console.log(res, "res");
                        });
                })
                .catch((err) => err);
        },
        addRole3() {
            let dataObj4 = {};
            if (this.role3List == undefined) {
                this.roleDialogVisible = true;
                return false;
            }
            if (this.role3List.length != 0) {
                this.role3List.forEach((item) => {
                    if (item.id == this.userRoleId4) {
                        dataObj4["organization_id"] = item.organization_id;
                        dataObj4["role_id"] = item.id;
                        dataObj4["system_type"] = item.system_type;
                        dataObj4["user_id"] = this.userId;
                        dataObj4["three_type"] = item.three_type;
                    }
                });
            }
            if (this.userRoleId4 == "") {
                dataObj4["role_id"] = "";
                dataObj4["system_type"] = "40";
                dataObj4["user_id"] = this.userId;
                dataObj4["three_type"] = "";
            }
            this.$confirm("是否分配角色?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(
                            this.$url.GetUserBindRole,
                            "POST",
                            dataObj4
                        )
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res");
                                this.getUserList();
                                // this.roleDialogVisible = false;
                                this.$message.success("分配角色已完成!");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            console.log(res, "res");
                        });
                })
                .catch((err) => {
                    this.roleDialogVisible = true;
                });
        },
        // 重置搜索框
        resultList() {
            this.form = {
                username: "",
                fullname: "", // 绑定角色
                tel: "",
                type: "", // 类型
                pageNow: 1,
                pageSize: 10
            };
            this.getUserList();
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
                path: "/AdminDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w");
            this.$router.push({
                path: "/AdminDetail",
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
