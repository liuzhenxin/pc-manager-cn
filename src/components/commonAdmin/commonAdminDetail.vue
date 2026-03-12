<template>
    <div v-loading="loading">
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px" @click="cancel()">返回</el-button>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名:" label-width="21%" prop="fullname">
                            <el-input class="inputwid" v-model="form.fullname" placeholder="请输入姓名" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型:" label-width="21%" prop="type">
                            <el-select v-model="form.type" placeholder="请选择类型" style="width: 60%" :disabled="isAdminDisable">
                                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="账号:" label-width="21%" prop="username">
                            <el-input class="inputwid" v-model="form.username" placeholder="请输入账号" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="mode==1">
                        <el-form-item label="密码:" label-width="21%" prop="password">
                            <el-input class="inputwid" v-model="form.password" prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'" placeholder="请输入密码" :disabled="isDisable">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="mode!=1">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-select v-model="form.status" placeholder="请选择类型" style="width: 60%" disabled>
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="证件类型:" label-width="21%">
                            <el-select v-model="form.card_type" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in cardTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件号码:" label-width="21%">
                            <el-input class="inputwid" v-model="form.card_no" placeholder="请输入证件号码" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="昵称:" label-width="21%" prop="nickname">
                            <el-input class="inputwid" v-model="form.nickname" placeholder="请输入昵称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别:" label-width="21%" prop="sex">
                            <!-- <el-input class="inputwid" v-model="form.sex" placeholder="请输入性别" :disabled="isDisable"></el-input> -->
                            <el-select v-model="form.sex" placeholder="请选择状态" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">

                        <el-form-item label="年龄:" label-width="21%" prop="age">
                            <el-input class="inputwid" v-model="form.age" placeholder="请输入年龄" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码:" label-width="21%" prop="tel">
                            <el-input class="inputwid" v-model="form.tel" placeholder="请输入手机号码" :disabled="isDisable" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="邮箱:" label-width="21%" prop="email">
                            <el-input class="inputwid" v-model="form.email" placeholder="请输入邮箱" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="mode==1">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-select v-model="form.status" placeholder="请选择状态" style="width: 60%" @change="getData" disabled>
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="$commonJs.getStorage().isAdmin == true && mode == 3">
                        <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                            <addOrg style="margin-left:-70px;width:1707px" :isDisable="isDisable" @organization_id="organization_id" :organizationId="organizationId" :detail="1"></addOrg>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注:" label-width="21%" prop="remark">
                            <el-input type="textarea" class="inputwid" v-model="form.remark" placeholder="请输入备注" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="$commonJs.getStorage().isAdmin == true && mode == 1">
                        <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                            <addOrg style="margin-left:-70px;width:1707px" :isDisable="isDisable" @organization_id="organization_id" :organizationId="organizationId" :detail="1"></addOrg>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-form-item label-width="10%" style="margin-top:20px">
                    <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1">取消</el-button>
                    <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2">确定</el-button>
                </el-form-item>

            </el-form>

        </el-card>
    </div>
</template>
<script>
import { JKunitrust } from "../../assets/js/JKunitrust.js";
import addOrg from "../organization/addOrg.vue";
export default {
    inject: ["reload"],
    components: { addOrg },
    props: {},
    data() {
        return {
            loading: false,
            name: "用户信息",
            mode: this.$route.query.mode,
            userId: this.$route.query.id,
            isDisable: false,
            ukey: "",
            ukey1: "",
            ukey2: "",
            flag1: true,
            flag2: true,
            organizationId: 0,
            form: {
                role_code: this.$route.query.roleCode,
                id: "",
                organization_id: "",
                pin: "12345678",
                tel: "",
                remark: "",
                status: "10",
                age: "",
                sex: "",
                card_no: "", // 证件号码
                type: "2",
                email: "",
                nickname: "",
                fullname: "",
                username: "",
                password: "",
                card_type: "" // 证件类型 1:身份证 2:护照
            },

            rules: {
                nickname: [
                    {
                        required: true,
                        message: "请输入昵称",
                        trigger: "blur"
                    }
                ],
                username: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur"
                    }
                ],
                pin: [
                    {
                        required: true,
                        message: "请输入证书PIN",
                        trigger: "blur"
                    }
                ],
                card_type: [
                    {
                        required: true,
                        message: "请选择证件类型",
                        trigger: "change"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "change"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择状态",
                        trigger: "change"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ],
                card_no: [
                    {
                        required: true,
                        message: "请输入证件号码",
                        trigger: "blur"
                    }
                ],
                fullname: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ],
                tel: [
                    {
                        required: true,
                        message: "请输入手机号码",
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
            typeList: [
                // {
                //     value: "",
                //     label: ""
                // },
                // {
                //     value: "0",
                //     label: "超级管理员"
                // },
                {
                    value: "1",
                    label: "系统用户"
                },
                {
                    value: "2",
                    label: "普通用户"
                }
            ],
            cardTypeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "1",
                    label: "身份证"
                },
                {
                    value: "2",
                    label: "护照"
                }
            ],
            sexList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "女",
                    label: "女"
                },
                {
                    value: "男",
                    label: "男"
                }
            ],
            id_cert_serial1: "", // 序列号
            id_cert_serial2: "", // 序列号
            id_cert_serial3: "", // 序列号

            statusList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "20",
                    label: "正常"
                },
                {
                    value: "10",
                    label: "未审核"
                },
                {
                    value: "11",
                    label: "审核中"
                },
                {
                    value: "12",
                    label: "审核未通过"
                },
                {
                    value: "31",
                    label: "冻结"
                },
                {
                    value: "32",
                    label: "封号"
                },
                {
                    value: "38",
                    label: "停用"
                },
                {
                    value: "39",
                    label: "异常"
                }
            ],
            isAdminDisable: false,
            MiMaVal: "",
            id_con_select: [],
            g_cert: "",
            ukey: "",
            id_cert_date: "", // 有效期
            num: 1, // 防抖
            id_con_count: "" // 应用数量
        };
    },

    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
            this.isAdminDisable = true;
        }
        if (
            this.$commonJs.getStorage().organization_id == 1 &&
            this.mode == 2
        ) {
            this.isAdminDisable = true;
        }
        if (this.mode != 1) {
            this.getUserDetail();
            if (this.mode == 3) {
                this.name = "修改用户信息";
            } else {
                this.isDisable = true;
                this.name = "用户详情";
            }
        } else {
            this.name = "新增用户";
        }
    },
    mounted() {},
    watch: {
        "form.organization_id"(val) {
            console.log(val, "valval");
        }
    },
    methods: {
        // 获取详情
        getUserDetail() {
            this.loading = true;
            let url,
                dataList = {};

            url = this.$url.GetUserDetail;
            dataList = {
                id: this.userId
            };
            // }
            this.$commonJs
                .getMethodData(this.$url.GetUserDetail, "POST", {
                    id: this.userId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                        if (this.mode == 2) {
                            this.organizationId = this.form.organization_id;
                        }
                        if (this.mode == 3) {
                            this.organizationId =
                                res.data.data.sysOrganizationUser.organization_id;
                            this.form.organization_id =
                                res.data.data.sysOrganizationUser.organization_id;
                        }

                        this.form.type = "2";
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                });
        },
        organization_id(val) {
            this.form.organization_id = val;
        },

        cancel() {
            let path = window.sessionStorage.getItem("activePath");
            this.$router.push(path);
        },
        onUpdate(formName) {
            let url;
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let data = this.$commonJs.getScreenValue(this.form);
                console.log(data, "data");

                if (this.mode == 1) {
                    url = this.$url.AddUserByRoleOrg;
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
                    url = this.$url.GetUserModify;

                    this.$confirm("是否修改此用户?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            let dataVal = {
                                remark: this.form.remark,
                                status: this.form.status,
                                age: this.form.age,
                                sex: this.form.sex,
                                card_no: this.form.card_no, // 证件号码
                                type: this.form.type,
                                tel: this.form.tel,
                                id: this.userId,
                                email: this.form.email,
                                nickname: this.form.nickname,
                                fullname: this.form.fullname,
                                username: this.form.username,
                                // password: this.form.password,
                                card_type: this.form.card_type // 证件类型 1:身份证 2:护照
                            };
                            this.$commonJs
                                .getMethodData(
                                    url,
                                    "POST",
                                    this.$commonJs.getScreenValue(dataVal)
                                )
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
        },
        getData() {
            console.log(this.form.type, "ooo");
        }
    }
};
</script>
