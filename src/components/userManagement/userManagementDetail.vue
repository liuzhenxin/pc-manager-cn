<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/userManagementList' }">
                <el-button size="mini" class="el-button1" type="warning"
                    style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle" v-if="mode != 2">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%"
                style="margin-bottom:20px">

                <el-row :gutter="20">

                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="系统类型:" label-width="21%" prop="system_type">
                            <el-select v-model="form.system_type" placeholder="请选择系统类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="20" :offset="3" v-if="$commonJs.getStorage().isAdmin == true">
                        <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                            <addOrg style="margin-left:20px;width:1680px" @organization_id="organization_id"
                                :organizationId="organizationId" :detail="1"></addOrg>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">

                        <el-form-item label="用户名称:" label-width="21%" prop="fullname">
                            <el-input class="inputwid" v-model="form.fullname" placeholder="请输入用户名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="用户部门:" label-width="21%" prop="dept_name">
                            <el-input class="inputwid" v-model="form.dept_name" placeholder="请输入用户部门"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label="联系方式:" label-width="21%" prop="tel">
                            <el-input :maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" class="inputwid"
                                v-model="form.tel" placeholder="请输入联系方式"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="用户描述:" label-width="21%" prop="profile">
                            <el-input class="inputwid" v-model="form.profile" placeholder="请输入用户描述"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')"
                            style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>
        <el-card class="intanle" v-if="mode == 2">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20">
                    <div style="display: flex;flex-direction: column;width: 50%;margin: auto;">
                        <borderTitle title="用户信息" style="display:inline-block">
                            <el-col :span="12" :offset="6">
                                <el-form-item label="用户名称:" label-width="42%" prop="">
                                    {{ form.fullname }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="用户标识:" label-width="42%" prop="">
                                    {{ form.userid }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="用户部门:" label-width="42%" prop="">
                                    {{ form.dept_name }}
                                </el-form-item>
                            </el-col>

                            <el-col :span="12" :offset="6">
                                <el-form-item label="联系方式:" label-width="42%" prop="">
                                    {{ form.tel }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="用户描述:" label-width="42%" prop="">
                                    {{ form.profile }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="创建时间:" label-width="42%" prop="">
                                    {{ form.create_time }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                    </div>
                </el-row>
            </el-form>
        </el-card>

    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue";
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    inject: ["reload"],
    components: { addOrg, borderTitle },
    data() {
        return {
            name: "",
            mode: this.$route.query.mode,
            svsUserById: this.$route.query.id,
            type: this.$route.query.type,
            radio: "",
            form: {
                id: "",
                dept_name: "",
                tel: "",
                fullname: "", // 名称
                organization_id: "",
                profile: ""
            },
            rules: {
                dept_name: [
                    {
                        required: true,
                        message: "请输入用户部门",
                        trigger: "blur"
                    }
                ],
                tel: [
                    {
                        required: true,
                        message: "请输入联系方式",
                        trigger: "blur"
                    }
                ],
                fullname: [
                    {
                        required: true,
                        message: "请输入用户名称",
                        trigger: "blur"
                    }
                ],
                organization_id: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ]
            },
            organizationId: 0
        };
    },

    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
        }

        if (this.mode != 1) {
            this.getAppDetail();
            if (this.mode == 3) {
                this.name = "修改用户";
            } else {
                this.name = "用户详情";
            }
        } else {
            this.name = "新增用户";
        }

        this.$nextTick(() => {
            this.$refs.form.resetFields();
        });
    },
    methods: {
        // 获取详情
        getAppDetail() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.GetSvsUserById, "POST", {
                    id: this.svsUserById
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                        this.organizationId = this.form.organization_id;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.$commonJs.getCloseLoading();
                });
        },
        organization_id(val) {
            this.form.organization_id = val;
        },
        cancel() {
            this.$router.push("/userManagementList");
        },

        onUpdate(formName) {
            let url;
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let data = this.$commonJs.getScreenValue(this.form);
                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.GetAddSvsUser;
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
                    url = this.$url.UpdSvsUser;
                    this.$commonJs;
                    this.$confirm("是否修改此条用户管理?", "提示", {
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
/deep/ .ORG .el-form-item__error {
    left: 90px !important;
}

.el-form {
    .el-form-item {
        /deep/ .el-form-item__label {
            font-weight: 600;
            font-size: 15px;
        }
    }
}
</style>
