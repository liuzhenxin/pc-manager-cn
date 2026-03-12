<template>
    <div v-loading="loading">
        <el-card class="navDetailItem" v-if="this.YongHumode == undefined">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/JudicialAdminList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">

                <el-row :gutter="20">
                    <el-col :span="20" :offset="3" v-if="$commonJs.getStorage().isAdmin == true">
                        <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                            <addOrg style="margin-left:20px;width:1680px" @organization_id="organization_id" :detail="1" :organizationId="organizationId"></addOrg>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="姓名:" label-width="21%" prop="fullname">
                            <el-input class="inputwid" v-model="form.fullname" placeholder="请输入姓名" :disabled="isDisable"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式:" label-width="21%">
                            <el-input class="inputwid" :maxlength="11" v-model="form.tel" placeholder="请输入联系方式" :disabled="isDisable" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                        </el-form-item>
                        <el-form-item label="类型:" label-width="21%" prop="type">
                            <el-select v-model="form.type" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in cardTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="证书:" label-width="21%" prop="subject">
                            <el-input class="inputwid" v-model="form.subject" placeholder="请绑定Ukey" id="IdCert" :disabled="true"></el-input>
                            <el-button size="mini" v-if="mode==1" @click="bindUkey('form')" style="margin-left:10px" type="primary" icon="el-icon-plus">绑定Ukey</el-button>
                        </el-form-item>
                        <el-col :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px">
                                <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1">取消</el-button>
                                <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2">确定</el-button>
                            </el-form-item>
                        </el-col>

                    </el-col>
                </el-row>
            </el-form>


        </el-card>
    </div>
</template>
<script>
import { JKunitrust } from "../../assets/js/JKunitrust.js";
import addOrg from "../organization/addOrg.vue";
import $ from "jquery";
export default {
    inject: ["reload"],
    components: { addOrg },
    props: {
        YongHumode: {
            type: Number
        }
    },
    data() {
        return {
            loading: false,
            name: "用户信息",
            mode: this.$route.query.mode,
            userId: this.$route.query.id,
            isDisable: false,
            organizationId: 0,
            form: {
                certStr: "",
                organization_id: "",
                tel: "",
                fullname: "",
                type: "",
                subject: ""
            },
            rules: {
                type: [
                    {
                        required: true,
                        message: "请选择类型",
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
                subject: [
                    {
                        required: true,
                        message: "请插入Ukey",
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
                        message: "请输入联系方式",
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
                    value: "judicial",
                    label: "司法取证员"
                },
                {
                    value: "other",
                    label: "其他"
                }
            ],
            id_cert_serial1: "", // 序列号

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
            MiMaVal: "",
            id_con_select: [],
            g_cert: "",

            id_cert_date: "", // 有效期
            num: 1, // 防抖
            id_con_count: "" // 应用数量
        };
    },

    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
        }
        if (this.YongHumode != undefined) {
            this.mode = 1;
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
    mounted() {
        this.getInit();
    },
    watch: {
        "form.organization_id"(val) {
            console.log(val, "valval");
        },
        MiMaVal(val) {
            if (val == "设备已拔出") {
                this.form.subject = "";
            }
        }
    },
    methods: {
        // 获取详情
        getUserDetail() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.WorkUserGetById, "POST", {
                    id: this.userId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                        this.organizationId = res.data.data.organization_id;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                });
        },
        organization_id(val) {
            this.form.organization_id = val;
        },
        // 初始化
        getInit() {
            let that = this;
            JKunitrust.oninit(
                that.onSuccess,
                function (msg, evt) {
                    // that.$message.error("初始化失败:" + msg);
                    console.log(evt);
                    // that.doEnumCon();
                },
                function () {
                    that.$message.success("连接断开");
                }
            );
        },

        onSuccess() {
            let that = this;
            JKunitrust.listenHotplug(function (data) {
                console.log(data, "data");
                if (data.ret != 0) {
                    return data;
                }
                if (data.param.type == 1) {
                    console.log("设备插入");
                    that.$message.success("设备插入");
                }
                if (data.param.type == 2) {
                    that.$nextTick(() => {
                        that.form.subject = "";
                        $("#IdCert").val("");
                    });

                    console.log("设备拔出");
                    that.$message.success("设备拔出");
                }
            });
            JKunitrust.SOF_GetVersion(function (data) {
                if (data.ret != 0) {
                    that.$message.error("获取版本号失败: " + data.msg);
                } else {
                    console.log("枚举成功");
                }
            });
        },

        // 枚举设备
        doEnumCon() {
            // debugger;
            let that = this;
            JKunitrust.SOF_GetUserList(function (data) {
                if (data.ret != 0) {
                    that.$message.error("枚举容器失败: " + data.msg);
                    return;
                }
                that.id_con_count = data.param.count;
                that.id_con_select = [];
                for (var i = 0; i < data.param.certlist.length; i++) {
                    that.id_con_select.push(data.param.certlist[i]);
                }

                console.log(
                    that.id_con_count,
                    that.id_con_select,
                    "that.id_con_select"
                );
                if (that.id_con_select.length != 0) {
                    that.doExportSignCert();
                } else {
                    that.$message.error("请插入设备!");
                }
            });
        },
        // 导出签名证书
        doExportSignCert() {
            let that = this;
            var conname = that.id_con_select;
            if (conname == null || conname == "") {
                that.$message.error("请先正确插入设备!");
                return;
            }
            console.log(conname, "conname");
            JKunitrust.SOF_ExportUserCert(conname[0], function (data) {
                if (data.ret != 0) {
                    that.$message.error("导出用户签名证书失败: " + data.msg);
                    return;
                }

                that.g_cert = data.param.cert;
                JKunitrust.SOF_GetCertInfo(that.g_cert, that.reflushCertMsg);
                console.log(data, data.param, "this.id_con_select");
            });
        },
        reflushCertMsg(data) {
            console.log(data, "www");
            let that = this;
            if (data.ret != 0) {
                that.$message.error("获取证书信息失败: " + data.msg);
            } else {
                $("#IdCert").val(data.param.subject);
                that.id_cert_serial1 = data.param.serial;
                that.form.subject = data.param.subject;

                that.id_cert_date = data.param.date.split("~")[1];
                if (that.num > 1) {
                    that.num = 1;
                    return false;
                }
                that.count();
                that.num++;
                console.log(that.id_cert_date, "that.id_cert_date");
            }
        },

        count() {
            let that = this;
            this.$commonJs
                .getCheckNotAfter({
                    certDate: that.id_cert_date
                })
                .then((res) => {
                    console.log(res, "有效期");
                    if (res.data.data == false) {
                        console.log("证书可以正常使用");
                    } else {
                        that.$message.error("证书已过有效期!");
                    }
                });
        },
        bindUkey() {
            let that = this;
            // debugger;
            that.doEnumCon();
        },

        cancel() {
            this.$router.push("/JudicialAdminList");
        },
        onUpdate(formName) {
            let url;
            console.log(this.form, "data");
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let data = {
                    certStr: this.g_cert,
                    organization_id: this.form.organization_id,
                    tel: this.form.tel,
                    fullname: this.form.fullname,
                    type: this.form.type
                };
                console.log(data, "data");

                if (this.mode == 1) {
                    url = this.$url.WorkUserAdd;
                    this.$commonJs
                        .getMethodFormData(url, "POST", data)
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
                    url = this.$url.WorkUserUpd;

                    this.$confirm("是否修改此用户?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            let dataVal = {
                                id: this.userId,
                                certStr: this.g_cert,
                                organization_id: this.form.organization_id,
                                tel: this.form.tel,
                                fullname: this.form.fullname,
                                type: this.form.type
                            };
                            this.$commonJs
                                .getMethodFormData(
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
        }
    }
};
</script>
<style lang="less" scoped>
/deep/ .ORG .el-form-item__error {
    left: 89px !important;
}
</style>
