<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="4">
                    <span class="titleLabel" style="width:35px">名称:</span>
                    <el-input v-model="form.name" placeholder="请输入名称" class="searchInputClass" style="width:80%"></el-input>
                </el-col>

                <el-col :span="20">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getRolesList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增</el-button>
                    <!-- <el-button size="mini" @click="handleDelete1()" type="warning" icon="el-icon-delete">删除</el-button> -->
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="rolesList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="名称" prop="name">
                    <template slot-scope="scope">
                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="组织机构" prop="organization_name"></el-table-column>
                <el-table-column label="系统类型" prop="system_type">
                    <template slot-scope="scope">
                        <span v-if="scope.row.system_type == '00'">系统角色</span>
                        <span v-else-if="scope.row.system_type==10">密码机</span>
                        <span v-else-if="scope.row.system_type==20">签名验签</span>
                        <span v-else-if="scope.row.system_type==30">CA</span>
                        <span v-else>KMS</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="三员类型" prop="three_type">
                    <template slot-scope="scope">
                        <span v-if="scope.row.three_type==10">系统管理员</span>
                        <span v-else-if="scope.row.three_type==20">安全管理员</span>
                        <span v-else-if="scope.row.three_type==30">审计管理员</span>
                        <span v-else>超级管理员</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==20" class="statusSuccess">启用</span>
                        <span v-else class="statusError">未启用</span>
                    </template>
                </el-table-column>
                <el-table-column label=" 创建时间" prop="create_time">
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="getMenuTree(scope.row)" type="text" size="mini" class="el-icon-share" style="color: #67C23A">分配权限</el-button>
                        <el-button @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
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
        <el-dialog title="选择分配权限" :visible.sync="dialogVisible" width="30%" class="roleDialog">
            <el-row style="margin-top:-30px;height: 600px;overflow: auto">
                <el-col>
                    <div class="downTree">
                        <el-tree :data="menuList" show-checkbox :expand-on-click-node="false" node-key="id" ref="tree" highlight-current :props="defaultProps" @node-click="handleClickFolder" @check=" (click, checked)=>{handleCheckChange(click, checked)}">
                            <span class=" custom-tree-node" :class="data.class" slot-scope="{node ,data}">
                                <!-- <el-radio v-model="radio" :label="data.id" @change="menuChange(data)"> -->
                                <span><i :class="data.icon" style="margin-right:5px"></i>{{ node.label }}
                                </span>
                                <!-- </el-radio> -->
                            </span>
                        </el-tree>

                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoMenu()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addMenu()">确 定</el-button>
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
            rolesList: [],
            ischeckList: [],
            menuList: [],
            defaultProps: {
                children: "children",
                label: "name"
            },
            menuRoleId: ""
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 查询列表
        getRolesList() {
            this.loading = true
            // let data = form;
            this.$commonJs
                .getMethodData(this.$url.GetRolesList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.rolesList = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        handleClickFolder(data, node) {},
        //获职选择的节点数组
        handleCheckChange(click, checked) {
            this.ischeckList = checked.checkedNodes
        },
        infoMenu() {
            // this.radio = "";
            this.dialogVisible = false
        },
        getMenuTree(row) {
            this.dialogVisible = true
            this.menuRoleId = row.id
            this.$commonJs
                .getMethodData(this.$url.GetMenuTreeList, "POST", {
                    status: ""
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.menuList = res.data.data
                        this.getTreeByRoleId(row)
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        getTreeByRoleId(row) {
            this.$commonJs
                .getMethodData(this.$url.GetTreeByRoleId, "POST", {
                    role_id: row.id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        let treeData = []
                        let dataList = res.data.data
                        let dataChild = []
                        for (var i = 0; i < dataList.length; i++) {
                            dataChild = dataList[i].children
                            if (dataChild.length != 0) {
                                dataChild.forEach((item) => {
                                    treeData.push(item.id)
                                })
                            } else {
                                if (dataList[i].id == 1) {
                                    treeData.push(dataList[i].id)
                                }
                            }
                        }
                        // 树形结构回显
                        console.log(treeData, dataList, "treeData")
                        this.$refs.tree.setCheckedKeys(treeData)
                    }
                })
        },
        addMenu() {
            if (this.ischeckList.length < 1) {
                this.$message.error("请选择菜单!")
                return false
            } else {
                let menuArr = []
                for (var i = 0; i < this.ischeckList.length; i++) {
                    menuArr.push(this.ischeckList[i].id)
                    if (this.ischeckList[i].parent_id != 0) {
                        menuArr.push(this.ischeckList[i].parent_id)
                    }
                }
                menuArr = [...new Set(menuArr)]
                console.log(menuArr, "parentArr")
                let menuIds = menuArr.join(",")
                this.$confirm("是否确认分配权限?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$commonJs
                            .getMethodData(this.$url.GetBindMenus, "POST", {
                                menu_ids: menuIds,
                                role_id: this.menuRoleId
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.dialogVisible = false
                                    this.getRolesList()
                                    this.$message.success("分配权限成功!")
                                    //this.reload();
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                            })
                    })
                    .catch((err) => err)
            }
        },
        // 重置搜索框
        resultList() {
            this.form = {
                name: "", //  角色名称
                pageNow: 1,
                pageSize: 10
            }
            this.getRolesList()
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getRolesList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getRolesList()
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/rolesDetail",
                query: {
                    mode: 1
                }
            })
        },
        // 修改
        xiangqing(row, mode) {
            this.$router.push({
                path: "/rolesDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            })
        },
        infoorganization() {
            // this.radio = "";
            this.dialogVisible = false
        },
        // 删除
        handleDelete(row) {
            this.$confirm("是否永久删除此角色?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.GetdelRoles, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!")
                                this.getRolesList()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch((err) => err)
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
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 6px;
    height: 10px;
    background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #ccc;
}
/deep/ .roleDialog .el-dialog {
    margin-top: 8vh !important;
}
</style>
