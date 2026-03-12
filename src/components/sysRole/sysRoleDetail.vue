<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/sysRoleList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle" v-loading="loading">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="组织机构:" label-width="21%" prop="organizationArr">
                            <el-cascader :disabled="isDisable" ref="cascaderHandle" :show-all-levels="false" :props="{ checkStrictly: true }" v-model="form.organizationArr" :options="organizationList" @change="handleChange" placeholder="请选择组织机构" style="width:60%"></el-cascader>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" :offset="6" v-if="$commonJs.getStorage().isAdmin==true">
                        <el-form-item label="系统类型:" label-width="21%" prop="system_type">
                            <el-select v-model="form.system_type" placeholder="请选择系统类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="名称:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入名称" :disabled="isDisable"></el-input>
                            <!-- <el-select v-model="form.name" placeholder="请选择名称" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in threeTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                        </el-form-item>

                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="编码:" label-width="21%" prop="code">
                            <el-input class="inputwid" v-model="form.code" placeholder="请输入编码" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="必要人数:" label-width="21%" prop="people_must">
                            <el-input class="inputwid" v-model="form.people_must" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入必要人数" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="排序:" label-width="21%" prop="sort">
                            <el-input class="inputwid" v-model="form.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="是否系统自带:" label-width="21%" prop="system_possess">
                            <el-radio-group v-model="form.system_possess">
                                <el-radio v-for="item in systemPossessList" :key="item.value" :label="item.value" :disabled="isDisable">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="是否初始化:" label-width="21%" prop="init_possess">
                            <el-radio-group v-model="form.init_possess">
                                <el-radio v-for="item in systemPossessList" :key="item.value" :label="item.value" :disabled="isDisable">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="item in statusList" :key="item.value" :label="item.value" :disabled="isDisable">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col> -->

                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>

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
            name: "角色信息",
            mode: this.$route.query.mode,
            roleId: this.$route.query.id,
            isDisable: false,
            form: {
                organizationArr: [],
                organization_id: "", // 组织机构id
                status: "20", // 20:启用 10:未启用
                name: "",
                sort: "", // 排序
                system_type: "", // 00:系统 10:密码机 20:签名验签 30:CA 40:KMS 90:一体机
                people_must: "", // 必要人数
                code: "", // code编码
                init_possess: "0", //是否初始化
                system_possess: "0" // 是否系统自带 0:否 1:是
            },
            rules: {
                organizationArr: [
                    {
                        required: true,
                        message: "请选择组织机构",
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
                init_possess: [
                    {
                        required: true,
                        message: "请选择是否初始化",
                        trigger: "blur"
                    }
                ],
                system_possess: [
                    {
                        required: true,
                        message: "请选择是否系统自带",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择状态",
                        trigger: "change"
                    }
                ],

                name: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ],
                people_must: [
                    {
                        required: true,
                        message: "请输入必要人数",
                        trigger: "blur"
                    }
                ],
                code: [
                    {
                        required: true,
                        message: "请输入编码",
                        trigger: "blur"
                    }
                ]
            },
            loading: false,
            systemTypeList: [],
            statusList: [
                {
                    value: "20",
                    label: "启用"
                },
                {
                    value: "10",
                    label: "未启用"
                }
            ],
            systemPossessList: [
                {
                    value: "0",
                    label: "否"
                },
                {
                    value: "1",
                    label: "是"
                }
            ],
            organizationList: [],
            threeTypeList: []
        };
    },
    watch: {
        // "form.organizationArr"(val) {
        //     console.log(val, val);
        //     if (val.length != 0) {
        //         this.$nextTick(() => {
        //             this.$refs.form.clearValidate("organizationArr");
        //         });
        //     }
        // }
    },
    created() {
        this.getDicData();
        this.getOrganizationTree();
        if (this.mode != 1) {
            this.getRolesDetail();

            if (this.mode == 3) {
                this.name = "修改用户信息";
            } else {
                this.isDisable = true;
                this.name = "用户详情";
            }
        } else {
            this.name = "新增角色";
        }

        // this.$nextTick(() => {
        //     this.$refs.form.resetFields();
        // });
    },

    methods: {
        getDicData(newArr) {
            this.$commonJs.GetDicData("system_type").then((res) => {
                this.systemTypeList = res;
            });
            this.$commonJs.GetDicData("threeType").then((res) => {
                this.threeTypeList = res;
            });

            this.$commonJs.GetOrgList().then((res) => {
                if (this.mode != 1) {
                    this.getRolesDetail();
                }
            });
        },

        // 获取详情
        getRolesDetail() {
            this.loading = true;

            this.$commonJs
                .getMethodData(this.$url.RolesPresetDetail, "POST", {
                    id: this.roleId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.form = res.data.data;
                        // this.form.organizationArr =
                        //     this.$commonJs.getFatherData(
                        //         this.organizationList,
                        //         (data) =>
                        //             data.value == res.data.data.organization_id
                        //     );
                        this.loading = false;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                        this.loading = false;
                    }
                });
        },
        handleChange(data) {
            this.$refs.cascaderHandle.dropDownVisible = false;
            this.form.organization_id = data[data.length - 1];
        },
        getOrganizationTree(type) {
            this.$commonJs.GetOrgList().then((res) => {
                console.log(res, "组织机构");
                this.organizationList = res;
            });
            // if (type == "fenpei" && this.mode == "1") {
            //     this.dialogVisible = true;
            // }
        },

        cancel() {
            this.$router.push("/sysRoleList");
        },

        onUpdate(formName) {
            let url;
            console.log(
                this.$commonJs.getScreenValue(this.form),
                "this.$commonJs.getScreenValue(this.form);"
            );
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let data = this.$commonJs.getScreenValue(this.form);
                this.$delete(data, "organizationArr");

                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.AddRolesPresetList;
                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.cancel();
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            console.log(res, "res");
                        });
                }
                if (this.mode == 3) {
                    url = this.$url.RolesPresetModify;
                    this.$confirm("是否修改此角色?", "提示", {
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
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg);
                                    }
                                    console.log(res, "res");
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
/deep/ .el-input.is-disabled .el-input__inner {
    cursor: pointer !important;
}
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
</style>
