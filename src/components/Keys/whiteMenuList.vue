<template>
    <div class="navItem">
        <el-card>
            <div style="margin-top:20px;" class="boxStyle">本页可以配置密码服务的白名单，对客户端机器进行授权。只有在白名单中的IP地址才被允许访问密码服务</div>
            <div style="margin-bottom:10px;margin-top:30px">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addWhite()">添加</el-button>
                <el-button type="primary" size="mini" icon="el-icon-check" @click="addWhiteFiles()" v-if="$commonJs.getStorage().routeType != '20'">生成文件</el-button>
            </div>
        </el-card>
        <el-card>
            <el-table ref="symmetricTable" v-loading="loading" :data="whiteList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="IP" prop="start_ip"> </el-table-column>
                <el-table-column label="系统类型">
                    <!-- 10:密码机 20:签名验签 30:CA 40:KMS -->
                    <template slot-scope="scope">
                        <span v-if="scope.row.system_type=='10'">密码机</span>
                        <span v-else-if="scope.row.system_type=='20'">签名验签</span>
                        <span v-else-if="scope.row.system_type=='30'">CA</span>
                        <span v-else>KMS</span>
                    </template>
                </el-table-column>
                <el-table-column label="组织机构" prop="organization_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='20'" class="statusSuccess">启用</span>
                        <span v-else class="statusError">未启用</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="xiangqing(scope.row,2)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="IPform.pageNow" :page-sizes="[10, 20, 50]" :page-size="IPform.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog :title="whiteName" :visible.sync="IPdialogVisible" width="42%" :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="3" v-if="$commonJs.getStorage().isAdmin==true">
                        <el-form-item label="组织机构:" label-width="21%" prop="organization_name">
                            <el-cascader style="width:60%" ref="cascaderHandle" :show-all-levels="false" :props="{ checkStrictly: true }" v-model="form.organization_name" :options="organizationList" @change="handleChange" placeholder="请选择组织机构"></el-cascader>

                            <!-- <el-input class="inputwid" v-model="form.organization_name" placeholder="请选择组织机构" @click.native.stop="getOrganizationTree('fenpei')" disabled></el-input> -->
                        </el-form-item>
                    </el-col>
                    <el-col :offset="3" v-if="$commonJs.getStorage().isAdmin==true">
                        <el-form-item label="系统类型:" label-width="21%" prop="system_type">
                            <el-select v-model="form.system_type" placeholder="请选择系统类型" style="width: 60%">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="3">
                        <el-form-item label="IP:" label-width="21%" prop="start_ip">
                            <el-input class="inputwid" v-model="form.start_ip" placeholder="请输入IP"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="3">
                        <el-form-item label="状态:" label-width="21%" prop="is_system">
                            <el-radio v-model="form.status" label="20">启用</el-radio>
                            <el-radio v-model="form.status" label="10">未启用</el-radio>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm" size="mini" type="warning">取 消</el-button>
                <el-button type="primary" @click="addKey('form')" size="mini">确 定</el-button>

            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    data() {
        return {
            isAdmin: false,
            whiteName: "",
            IPdialogVisible: false,
            loading: false,
            organizationList: [],
            isImport: "",
            indexVal: "",
            IPVal: "",
            agreementVal: "",
            whiteList: [],
            agreementList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "0",
                    label: "128"
                },
                {
                    value: "1",
                    label: "192"
                },
                {
                    value: "2",
                    label: "256"
                }
            ],
            systemTypeList: [],
            mode: 0,
            radio: "",
            form: {
                organization_name: [],
                start_ip: "",
                organization_id: "",
                status: "20",
                system_type: "",
                type: "1"
            },
            IPform: {
                pageNow: 1,
                pageSize: 10,
                organization_id: "",
                system_type: ""
            },
            defaultProps: {
                children: "children",
                label: "name"
                // icon-class:"icon"
            },
            rules: {
                organization_id: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ],
                start_ip: [
                    {
                        required: true,
                        message: "请输入IP",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择状态",
                        trigger: "blur"
                    }
                ],

                system_type: [
                    {
                        required: true,
                        message: "请选择系统类型",
                        trigger: "blur"
                    }
                ],
                organization_name: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ]
            },
            total: 10,
            dialogVisible: false,
            ischeckList: []
        };
    },
    watch: {
        "form.organization_id"(val) {
            if (val != "") {
                this.$nextTick(() => {
                    if (this.isAdmin == true) {
                        this.$refs.form.clearValidate("organization_id");
                    }
                });
            }
        },
        "form.system_type"(val) {
            if (val != "") {
                this.$nextTick(() => {
                    if (this.isAdmin == true) {
                        this.$refs.form.clearValidate("system_type");
                    }
                });
            }
        }
    },
    created() {
        if (this.$commonJs.getStorage().organization_id == 1) {
            this.isAdmin == true;
        } else {
            this.IPform.system_type = this.$commonJs.getStorage().routeType;
            this.IPform.organization_id =
                this.$commonJs.getStorage().organization_id;
        }
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.GetIPList, "POST", this.IPform)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.whiteList = res.data.page.receList;
                        this.total = res.data.page.totalRows;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                        this.loading = false;
                    }
                    this.loading = false;
                });
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.IPform.pageSize = newSize;
            this.getList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.IPform.pageNow = newPage;
            this.getList();
        },

        resetForm() {
            this.IPdialogVisible = false;
            this.$refs.form.resetFields();
        },

        getOrganizationTree(row, type) {
            this.$commonJs.GetOrgList().then((res) => {
                this.organizationList = res;
                if (type == "updata") {
                    this.form.organization_name = this.$commonJs.getFatherData(
                        res,
                        (data) => data.value == row.organization_id
                    );
                }
            });
            this.$commonJs.GetDicData("system_type").then((res) => {
                this.systemTypeList = res;
            });
        },
        handleChange(data) {
            this.$refs.cascaderHandle.dropDownVisible = false;
            this.form.organization_id = data[data.length - 1];
        },
        addWhiteFiles() {
            this.$commonJs
                .getMethodData(this.$url.HsmWriteIn, "POST", {
                    organization_id: JSON.parse(
                        window.sessionStorage.getItem("roles")
                    )[0].organization_id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$alert("生成文件成功.", "提示", {
                            confirmButtonText: "确定",
                            type: "success"
                        });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        addWhite() {
            this.isImport = "";
            this.IPdialogVisible = true;
            this.whiteName = "添加白名单";
            this.mode = 1;
            this.$refs.form.resetFields();
            this.getOrganizationTree();
        },

        addKey(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                if (this.isImport == "") {
                    if (this.$commonJs.getStorage().organization_id != 1) {
                        this.form.organization_id =
                            this.$commonJs.getStorage().organization_id;
                        this.form.system_type =
                            this.$commonJs.getStorage().routeType;
                    }
                    let data = this.$commonJs.getScreenValue(this.form);
                    this.$delete(data, "organization_name");
                    let url;
                    let name = "";
                    if (this.mode == 1) {
                        // 新增
                        url = this.$url.GetAddWhiteList;
                        name = "添加";
                    }
                    if (this.mode == 2) {
                        // 修改
                        url = this.$url.GetUpdList;
                        name = "修改";
                    }
                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success(name + "白名单成功");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            this.mode = 0;
                            this.resetForm();
                            this.getList();
                        });
                }
            });
        },
        xiangqing(row) {
            this.getOrganizationTree(row, "updata");
            this.IPdialogVisible = true;
            //浅拷贝
            // this.form = row; 
            //深拷贝
            this.$nextTick(() => {
                this.form = JSON.parse(JSON.stringify(row));
            });

            this.mode = 2;
        },
        // 删除
        handleDelete(row) {
            this.$confirm("是否永久删除此条白名单?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.IPDelOne, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!");
                                this.getList();
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
        handleClose(done) {
            done();
            location.reload();
        }
    }
};
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

                
          