<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <!-- <router-link :to="{ path: '/menuList' }"> -->
            <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px" @click="cancel()">返回</el-button>
            <!-- </router-link> -->
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" v-if="mode==1">
                        <el-form-item label="父级菜单:" label-width="21%" prop="menuFatherName">
                            <el-input class="inputwid" v-model="form.menuFatherName" placeholder="请选择父级菜单" @click.native.stop="getMenuTree" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="菜单名称:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入菜单名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="菜单类型:" label-width="21%" prop="type">
                            <el-radio v-model="form.type" label="1">菜单</el-radio>
                            <el-radio v-model="form.type" label="2">目录</el-radio>
                            <el-radio v-model="form.type" label="3">按钮</el-radio>
                            <!-- <el-select v-model="form.type" placeholder="请选择菜单类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="菜单状态:" label-width="21%" prop="status">
                            <el-radio v-model="form.status" label="1">正常</el-radio>
                            <el-radio v-model="form.status" label="0">停用</el-radio>
                            <!-- <el-select v-model="form.status" placeholder="请选择菜单状态" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="是否为系统菜单:" label-width="21%" prop="is_system">
                            <el-radio v-model="form.is_system" label="1">是</el-radio>
                            <el-radio v-model="form.is_system" label="0">否</el-radio>
                            <!-- <el-select v-model="form.is_system" placeholder="请选择系统菜单状态" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="菜单图标:" label-width="21%" prop="icon">
                            <icon-picker v-model="form.icon" style="width:60%"></icon-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="路由地址:" label-width="21%" prop="path">
                            <el-input class="inputwid" v-model="form.path" placeholder="请输入路由地址" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="权限标识:" label-width="21%" prop="perms">
                            <el-input class="inputwid" v-model="form.perms" placeholder="请输入权限标识" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="等级:" label-width="21%" prop="lv">
                            <el-input class="inputwid" v-model="form.lv" placeholder="请输入等级" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" :offset="6">
                        <el-form-item label="排序:" label-width="21%" prop="sort">
                            <el-input class="inputwid" v-model="form.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="备注:" label-width="21%" prop="remark">
                            <el-input type="textarea" class="inputwid" v-model="form.remark" placeholder="请输入备注" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-dialog title="选择父级菜单" :visible.sync="dialogVisible" width="30%">
                <el-row style="margin-top:-30px">
                    <el-col>
                        <div class="downTree">
                            <el-tree :data="menuList" check-strictly :expand-on-click-node="false" default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" @node-click="handleClickFolder" @check=" (click, checked)=>{handleCheckChange(click, checked)}">
                                <span class=" custom-tree-node" :class="data.class" slot-scope="{node ,data}">
                                    <el-radio v-model="radio" :label="data.id" @change="menuChange(data)">
                                        <span><i :class="data.icon" style="margin-right:5px"></i>{{ node.label }}
                                        </span>
                                    </el-radio>
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

        </el-card>
    </div>
</template>
<script>
export default {
    inject: ["reload"],
    data() {
        return {
            name: "参数配置信息",
            radio: "",
            menuRow: this.$route.query.menuRow,
            mode: this.$route.query.mode,
            menusId: this.$route.query.id,
            insertType: this.$route.query.type,
            isDisable: false,
            dialogVisible: false,
            isClick: true,
            menuList: [],
            form: {
                is_system: "1",
                menuFatherName: "",
                parent_id: 0,
                remark: "",
                name: "",
                icon: "",
                type: "1",
                path: "",
                perms: "",
                status: "1",
                // lv: "",
                sort: ""
            },
            ischeckList: [],
            typeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "1",
                    label: "菜单"
                },
                {
                    value: "2",
                    label: "目录"
                },
                {
                    value: "3",
                    label: "按钮"
                }
            ],
            statusList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "1",
                    label: "正常"
                },
                {
                    value: "0",
                    label: "停用"
                }
            ],
            systemList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "1",
                    label: "是"
                },
                {
                    value: "0",
                    label: "否"
                }
            ],
            rules: {
                is_system: [
                    {
                        required: true,
                        message: "请选择系统菜单状态",
                        trigger: "blur"
                    }
                ],
                // menuFatherName: [
                //     {
                //         required: true,
                //         message: "请选择父级菜单",
                //         trigger: "blur"
                //     }
                // ],
                name: [
                    {
                        required: true,
                        message: "请输入菜单名称",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请输入菜单状态",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请输入菜单类型",
                        trigger: "blur"
                    }
                ]
            },
            defaultProps: {
                children: "children",
                label: "name"
            }
        };
    },
    watch: {
        // "form.menuFatherName"(val) {
        //     console.log(val, val);
        //     if (val != "") {
        //         this.$nextTick(() => {
        //             this.$refs.form.clearValidate("menuFatherName");
        //         });
        //     }
        // },
        "form.type"(val) {
            console.log(val, val);
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("type");
                });
            }
        },
        "form.status"(val) {
            console.log(val, val);
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("status");
                });
            }
        }
    },
    created() {
        console.log(this.menuRow);
        if (this.mode != 1) {
            this.getmenuDetail();
            if (this.mode == 3) {
                this.name = "修改菜单信息";
            } else {
                this.isDisable = true;
                this.name = "菜单详情";
            }
        } else {
            this.name = "新增菜单";
            if (this.insertType == "insertChildren") {
                this.menuRow = JSON.parse(this.menuRow);
                this.form.menuFatherName = this.menuRow.name;
                this.form.parent_id = this.menuRow.id;
            }
        }
    },
    methods: {
        // 获取详情
        getmenuDetail() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.GetmenuDetail, "POST", {
                    id: this.menusId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.$commonJs.getCloseLoading();
                });
        },
        handleClickFolder(data, node) {
            console.log(data, node);
        },
        //获职选择的节点数组
        handleCheckChange(click, checked) {
            // this.ischeckList = checked.checkedNodes;
            console.log(this.ischeckList, "this.ischeckList"); //获取全选数组
        },
        menuChange(data) {
            console.log(data, "data");
            this.ischeckList = [data];
        },
        addMenu() {
            if (this.ischeckList.length > 1) {
                this.$message.error("只能选择一个父级菜单!");
                return false;
            } else if (this.ischeckList.length < 1) {
                this.$message.error("请选择父级菜单!");
                return false;
            } else {
                this.form.menuFatherName = this.ischeckList[0].name;
                console.log(this.ischeckList[0], "this.ischeckList[0]");
                this.form.parent_id = this.ischeckList[0].id;
                this.dialogVisible = false;
                this.isClick = false;
            }
        },
        getMenuTree() {
            if (this.insertType == "insertChildren") {
                return false;
            }
            this.dialogVisible = true;

            this.$commonJs
                .getMethodData(this.$url.GetMenuTreeList, "POST", {
                    status: ""
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.menuList = res.data.data;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        cancel() {
            this.$router.push("/menuList");
        },
        infoMenu() {
            this.radio = "";
            this.dialogVisible = false;
        },
        onUpdate(formName) {
            let url;
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let data = this.$commonJs.getScreenValue(this.form);

                if (this.mode == 1) {
                    url = this.$url.GetAddMenuList;
                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.cancel();
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                }
                if (this.mode == 3) {
                    url = this.$url.GetMenuModify;
                    this.$confirm("是否修改此菜单?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(url, "POST", data)
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.cancel();
                                        this.reload();
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg);
                                    }
                                });
                        })
                        .catch((err) => err);
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.menuFatherFont {
    color: #b9bcc1;
    margin-left: -78%;
}
/deep/ .pickerIcon {
    transform-origin: center bottom;
    z-index: 2009;
    width: 300px !important;
    position: absolute;
    top: 404px;
    left: 873px;
}

[class^="el-icon-fa"],
[class*=" el- icon-fa"] {
    display: inline - block;
    font: normal normal normal 14px/1 FontAwesome !important;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.downTree {
    padding: 5px;
    height: 300px;
    // max-height:;
    display: block;
    overflow-y: auto;
}
.el-tree-node__content {
    margin-top: 10px;
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
 
