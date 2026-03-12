<template>
    <div>
        <el-card class="navDetailItem" v-if="this.ZuZhimode == undefined">
            <span class="h1">{{ name }}</span>
            <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px" @click="cancel()">返回</el-button>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" v-if="mode==1 && IsInitZuZhi != 1">
                        <el-form-item label="父机构:" label-width="21%" prop="organizationFatherName">
                            <el-cascader :disabled="insertType == 'insertChildren'" ref="cascaderHandle" :show-all-levels="false" :props="{ checkStrictly: true }" v-model="form.organizationFatherName" :options="organizationList" @change="handleChange" placeholder="请选择组织机构" style="width:60%"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="组织名称:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入组织名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label="详细地址:" label-width="21%" prop="address">
                            <el-input class="inputwid" v-model="form.address" placeholder="请输入详细地址" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="联系人:" label-width="21%" prop="contact">
                            <el-input class="inputwid" v-model="form.contact" placeholder="请输入联系人" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="联系方式:" label-width="21%" prop="contact_tel">
                            <el-input class="inputwid" :maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" v-model="form.contact_tel" placeholder="请输入联系方式" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="this.IsInitZuZhi != 1">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-select v-model="form.status" placeholder="请选择状态" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="this.IsInitZuZhi != 1">
                        <el-form-item label="类型:" label-width="21%" prop="type">
                            <el-select v-model="form.type" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="编码:" label-width="21%" prop="code">
                            <el-input class="inputwid" v-model="form.code" placeholder="请输入编码" :disabled="isDisable" maxlength="8"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="备注:" label-width="21%" prop="remark">
                            <el-input type="textarea" class="inputwid" v-model="form.remark" placeholder="请输入备注" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6" v-if="this.ZuZhimode == undefined">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
                <el-col v-if="this.ZuZhimode != undefined">
                    <div style="margin-top:-30px;margin-bottom:50px" v-if="this.IsInitZuZhi == undefined">
                        <el-button type="primary" style="margin-top:100px" icon="el-icon-d-arrow-right" @click="nextUpdate('form')">下一步</el-button>
                    </div>
                    <div style="margin-bottom:50px" v-if="this.IsInitZuZhi == 1">
                        <el-button type="primary" style="margin-top:50px" icon="el-icon-d-arrow-right" @click="nextUpdate('form')">下一步</el-button>
                    </div>
                </el-col>

            </el-form>

        </el-card>
    </div>
</template>
<script>
export default {
    inject: ["reload"],
    props: {
        ZuZhimode: {
            type: Number
        },
        IsInitZuZhi: {
            type: Number
        }
    },
    data() {
        return {
            name: "组织机构信息",
            radio: "",
            organizationRow: this.$route.query.organizationRow,
            mode: this.$route.query.mode,
            organizationsId: this.$route.query.id,
            insertType: this.$route.query.type,
            isDisable: false,
            isClick: true,
            organizationList: [],
            form: {
                contact: "",
                contact_tel: "",
                address: "",
                organizationFatherName: [],
                parent_id: "",
                remark: "",
                name: "",
                type: "1",
                status: "20",
                code: ""
            },
            typeList: [
                {
                    value: "0",
                    label: "系统机构"
                },
                {
                    value: "1",
                    label: "普通机构"
                }
            ],
            statusList: [],
            rules: {
                // organizationFatherName: [
                //     {
                //         required: true,
                //         message: "请选择组织机构",
                //         trigger: "blur"
                //     }
                // ],

                address: [
                    {
                        required: true,
                        message: "请输入详细地址",
                        trigger: "blur"
                    }
                ],
                code: [
                    {
                        required: true,
                        message: "请输入编码",
                        trigger: "blur"
                    },
                    {
                        min: 8,
                        max: 8,
                        message: "长度是8个字符",
                        trigger: "blur"
                    }
                ],
                contact: [
                    {
                        required: true,
                        message: "请输入联系人",
                        trigger: "blur"
                    }
                ],
                contact_tel: [
                    {
                        required: true,
                        message: "请输入联系方式",
                        trigger: "blur"
                    }
                ],

                name: [
                    {
                        required: true,
                        message: "请输入组织名称",
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
                type: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "blur"
                    }
                ]
            }
        }
    },
    watch: {
        "form.organizationFatherName"(val) {
            console.log(val, val)
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("organizationFatherName")
                })
            }
        },
        "form.type"(val) {
            console.log(val, val)
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("type")
                })
            }
        },
        "form.status"(val) {
            console.log(val, val)
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("status")
                })
            }
        }
    },
    created() {
        console.log(this.organizationRow, this.ZuZhimode)
        if (this.ZuZhimode != undefined) {
            this.mode = this.ZuZhimode
        }
        if (this.mode != 1) {
            this.getOrganizationDetail()
            if (this.mode == 3) {
                this.name = "修改组织结构"
            } else {
                this.isDisable = true
                this.name = "组织结构详情"
            }
        } else {
            this.name = "新增组织结构"
            if (this.insertType == "insertChildren") {
                this.organizationRow = JSON.parse(this.organizationRow)
                this.form.organizationFatherName = [this.organizationRow.id]
                this.form.parent_id = this.organizationRow.id
            }
        }
        if (this.ZuZhimode == undefined) {
            this.getOrganizationTree()
            this.getDicData()
        }
    },
    methods: {
        // 获取详情
        getOrganizationDetail() {
            this.$commonJs.getLoading()
            this.$commonJs
                .getMethodData(this.$url.GetOrganizationDetail, "POST", {
                    id: this.organizationsId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.form = res.data.data
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
                })
        },
        getDicData() {
            this.$commonJs.GetDicData("status").then((res) => {
                this.statusList = res
            })
        },
        handleChange(data) {
            this.$refs.cascaderHandle.dropDownVisible = false
            this.form.parent_id = data[data.length - 1]
        },
        getOrganizationTree() {
            // debugger;
            // if (this.insertType == "insertChildren") {
            //     return false;
            // }

            this.$commonJs.GetOrgList().then((res) => {
                console.log(res, "组织机构")
                this.organizationList = res
            })
        },
        cancel() {
            this.$router.push("/organizationList")
        },

        nextUpdate(formName) {
            if (this.form.parent_id == "") {
                this.form.parent_id = 0
                this.$refs.form.clearValidate("organizationFatherName")
            }
            console.log(this.form, "this.form.parent_id")
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                let data = this.$commonJs.getScreenValue(this.form)
                console.log(data, "data")
                this.$emit("getZuZhiData", data)
            })
        },
        onUpdate(formName) {
            // debugger;
            let url
            if (this.form.parent_id == "") {
                this.form.parent_id = 0
                this.$refs.form.clearValidate("organizationFatherName")
            }
            console.log(this.form, "this.form.parent_id")
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                let data = this.$commonJs.getScreenValue(this.form)
                console.log(data, "data")
                this.$delete(data, "organizationFatherName")

                if (this.mode == 1) {
                    url = this.$url.GetAddOrganizationList
                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.cancel()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                }
                if (this.mode == 3) {
                    url = this.$url.GetOrganizationModify
                    this.$confirm("是否修改此组织机构?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(url, "POST", data)
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.cancel()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                    }
                                })
                        })
                        .catch((err) => err)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.organizationFatherFont {
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
// /deep/ .el-input.is-disabled .el-input__inner {
//     cursor: pointer !important;
// }
</style>
 
