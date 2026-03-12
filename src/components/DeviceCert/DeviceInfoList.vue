<template>
    <div class="navItem">
        <el-card class="search">
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增配置</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="deviceInfoList" tooltip-effect="dark"
                :header-cell-style="{
                    'text-align': 'center',
                    'color': '#333',
                    'font-size': '14px',
                }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code"
                :tree-props="{ children: 'children' }">

                <el-table-column label="编码" prop="code"></el-table-column>
                <el-table-column label="类型" prop="type"></el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="值" prop="val"></el-table-column>
                <el-table-column label="说明" prop="illustrate"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="updDevice(scope.row)" type="text" size="mini" class="el-icon-view"
                            style="color: #67C23A;mar">修改配置</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini"
                            class="el-icon-delete" style="color: #da0909">删除</el-button>
                    </template>
                </el-table-column>
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
        </el-card>
        <el-dialog title="新增配置" :visible.sync="addDeviceInfoDialog" width="50%">
            <el-form ref="formDevice" :rules="rules" :model="formDevice" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="编码:" label-width="28%" prop="code">
                            <el-input class="inputwid" v-model="formDevice.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="名称:" label-width="28%" prop="name">
                            <el-input class="inputwid" v-model="formDevice.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="设备值:" label-width="28%" prop="val">
                            <el-input class="inputwid" v-model="formDevice.val"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="类型:" label-width="28%" prop="type">
                            <el-select v-model="formDevice.type" placeholder="请选类型">
                                <el-option v-for="item in typeList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="说明:" label-width="28%" prop="illustrate">
                            <el-input class="inputwid" v-model="formDevice.illustrate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" :offset="10">
                        <el-button size="" type="primary" @click="addDeviceInfo('formDevice')"
                            style="margin-top:30px;">确定</el-button>
                    </el-col>

                </el-row>
            </el-form>
        </el-dialog>
        <el-dialog title="修改配置" :visible.sync="updDeviceInfoDialog" width="50%">
            <el-form ref="updform" :model="rowData" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="信息名称:" label-width="28%" prop="name">
                            <el-input class="inputwid" v-model="rowData.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:20px;">
                        <el-form-item label="设备值:" label-width="28%" prop="val">
                            <el-input class="inputwid" v-model="rowData.val"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" :offset="10">
                        <el-button size="" type="primary" @click="updDeviceInfo('updform')"
                            style="margin-top:30px;">确定</el-button>
                    </el-col>

                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue"
export default {
    inject: ["reload"],
    components: { addOrg },
    data() {
        return {
            loading: false,
            total: 0,
            formDevice: {
                code: "",
                type: "",
                name: "",
                val: "",
                illustrate: ""
            },
            typeList: [
                {
                    value: "10000001",
                    label: "设备"
                },
                {
                    value: "10000002",
                    label: "系统"
                },
                {
                    value: "10000003",
                    label: "管理"
                },
                {
                    value: "110000004",
                    label: "其他"
                }
            ],
            rules: {
                code: [
                    {
                        required: true,
                        message: "请输入编码",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur"
                    }
                ],
                val: [
                    {
                        required: true,
                        message: "请输入值",
                        trigger: "blur"
                    }
                ]
            },
            deviceInfoList: [],
            updDeviceInfoDialog: false,
            addDeviceInfoDialog: false,
            rowData: {}
        }
    },
    created() {
        this.getDeviceList()
    },

    methods: {
        // 查询列表
        getDeviceList() {
            this.loading = true
            this.$commonJs
                .getMethodData(
                    this.$url.DeviceInfoList,
                    "POST"
                )
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.deviceInfoList = res.data.data
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        // 修改
        updDevice(row) {
            this.rowData = row
            this.updDeviceInfoDialog = true
        },
        updDeviceInfo(form) {
            this.loading = true
            this.$commonJs
                .getMethodData(
                    this.$url.UpdDeviceInfo,
                    "POST", this.rowData
                )
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.updDeviceInfoDialog = false
                        this.$message.success("修改成功")
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        jumpToInsert() {
            this.addDeviceInfoDialog = true
            // if (this.$refs['formDevice'] != undefined) {
            //     this.$refs['formDevice'].resetFields()
            // }
            if (this.$refs.formDevice != undefined) {
                this.$refs.formDevice.resetFields()
            }
        },
        addDeviceInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.loading = true
                this.$commonJs
                    .getMethodData(
                        this.$url.AddDeviceInfo,
                        "POST", this.formDevice
                    )
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.addDeviceInfoDialog = false
                            this.getDeviceList()
                            this.$message.success("添加成功")
                        } else {
                            this.$message.error(res.data.msg)
                        }
                        this.loading = false
                    })
            })
        },
        // 删除
        handleDelete(row) {
            this.$confirm("是否删除配置?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(
                            this.$url.DelDeviceInfo,
                            "POST",
                            {
                                id: row.id
                            }
                        )
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!")
                                this.getDeviceList()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch(() => {
                    // this.$message({
                    //     type: "info",
                    //     message: "已取消删除"
                    // });
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

.el-button--mini {
    padding: 5px 5px;
}
</style>
