<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/rolesList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">

                <el-row :gutter="20">

                    <el-col :span="12" :offset="6" v-if="isAdmin==true">
                        <el-form-item label="系统类型:" label-width="21%" prop="system_type">
                            <el-select v-model="form.system_type" placeholder="请选择系统类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label="三员类型:" label-width="21%" prop="three_type">
                            <el-select v-model="form.three_type" placeholder="请选择三员类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in threeTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label="名称:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="排序:" label-width="21%" prop="sort">
                            <el-input class="inputwid" v-model="form.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-select v-model="form.status" placeholder="请选择状态" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
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

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: "角色信息",
            mode: this.$route.query.mode,
            roleId: this.$route.query.id,
            isDisable: false,
            radio: "",

            dialogVisible: false,
            form: {
                // id: "",
                correct_num: "", // correct_num - 修正(s)
                // ntp_ip - NTPIP
                ntp_ip: "",
                // ntp_port - NTP端口
                ntp_port: "",
                // ntp_time - NTP服务时间
                ntp_time: "",
                // sync_status - 同步状态 1:成功 0:失败
                sync_status: "1",
                // sysNtpSyncLog *
                // system_time *同步时系统时间
                system_time: "",
                status: "", // 状态 20:正常 10:未审计 11:审计中 12:审计未通过 39:异常
                remark: "",
                name: "",
                organization_name: "",

                sort: "", // 排序
                system_type: "", // 10:密码机 20:签名验签 30:CA 40:KMS
                three_type: "" // 10:系统管理员 20:安全管理员 30:审计管理员 00:超级管理员
            },
            rules: {
                organization_name: [
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
                three_type: [
                    {
                        required: true,
                        message: "请选择三员类型",
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
                sort: [
                    {
                        required: true,
                        message: "请输入排序",
                        trigger: "blur"
                    }
                ]
            },

            threeTypeList: [
                {
                    value: "",
                    label: ""
                },

                {
                    value: "10",
                    label: "系统管理员"
                },
                {
                    value: "20",
                    label: "安全管理员"
                },
                {
                    value: "30",
                    label: "审计管理员"
                },
                {
                    value: "40",
                    label: "业务管理员"
                },
                {
                    value: "31",
                    label: "审计操作员"
                },
                {
                    value: "41",
                    label: "业务操作员"
                },
                {
                    value: "42",
                    label: "司法取证员"
                },
                {
                    value: "90",
                    label: "CA超级管理员"
                },
                {
                    value: "00",
                    label: "系统超级管理员"
                }
            ],
            systemTypeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "10",
                    label: "密码机"
                },
                {
                    value: "20",
                    label: "签名验签"
                },
                {
                    value: "30",
                    label: "CA"
                },
                {
                    value: "40",
                    label: "KMS"
                }
            ],
            statusList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "20",
                    label: "启用"
                },
                {
                    value: "10",
                    label: "未启用"
                }
            ],
            isAdmin: false
        };
    },
    watch: {
        "form.organization_name"(val) {
            console.log(val, val);
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("organization_name");
                });
            }
        },
        "form.system_type"(val) {
            console.log(val, val);
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("system_type");
                });
            }
        },
        "form.three_type"(val) {
            console.log(val, val);
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("three_type");
                });
            }
        }
    },
    created() {
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

        this.$nextTick(() => {
            this.$refs.form.resetFields();
        });
        this.isAdmin = this.$commonJs.getStorage().isAdmin;
    },
    methods: {
        // 获取详情
        getRolesDetail() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.GetRolesDetail, "POST", {
                    id: this.roleId
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

        cancel() {
            this.$router.push("/rolesList");
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
                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.GetAddRolesList;
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
                    url = this.$url.GetRolesModify;
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
