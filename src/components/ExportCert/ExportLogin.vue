<template>
    <div>
        <el-row>
            <el-col :span="3">
                <div style="color:#409EFF" class="boxStyle">导出权限:
                    <i class="el-icon-circle-check iconStyle" style="" v-if="allNum/2>=loginNum && loginNum!=0"></i>
                    <i class="el-icon-circle-close iconStyle" style="color:#F56C6C" v-else></i>
                </div>
            </el-col>
            <el-col :span="12">
                <div style="margin-top:0px;color:#67C23A">管理员数目: {{allNum}}, 已登录数目: {{loginNum}}。</div>
            </el-col>
            <el-col style="margin-top:20px">
                <el-button icon="el-icon-plus" type="primary" size="mini" @click="openDialog">登录</el-button>
            </el-col>
        </el-row>
        <el-dialog title="登录" :visible.sync="loginDialog" width="35%" :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="4" :span="12">
                        <div class="boxStyle" style="color:#E6A23C;background:#fff; margin-top:0px;margin-bottom:15px">请先插入UKey后再操作。</div>
                    </el-col>
                    <!-- <el-col :offset="3" v-if="$commonJs.getStorage().isAdmin==true">
                        <el-form-item label="组织机构:" label-width="21%" prop="organization_name">
                            <el-input class="inputwid" v-model="form.organization_name" placeholder="请选择组织机构" @click.native.stop="getOrganizationTree('fenpei')" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="3" v-if="$commonJs.getStorage().isAdmin==true">
                        <el-form-item label="系统类型:" label-width="21%" prop="system_type">
                            <el-select v-model="form.system_type" placeholder="请选择系统类型" style="width: 60%">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :offset="3">
                        <el-form-item label="待签名数据:" label-width="21%" prop="pucDataInput">
                            <el-input class="inputwid" v-model="form.pucDataInput" placeholder="请输入待签名数据" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="3">
                        <el-form-item label="即时签名值:" label-width="21%" prop="uiUserSign">
                            <el-input class="inputwid" v-model="form.uiUserSign" placeholder="请输入即时签名值" disabled></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :offset="3">
                        <el-form-item label="UKey:" label-width="15%">
                            <el-input class="inputwid" style="width:60%" v-model="form.subject" placeholder="请绑定UKey" id="IdCert" disabled></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="margin-top:20px" @click="resetForm" size="mini" type="warning">取 消</el-button>
                <el-button style="margin-top:20px" type="primary" @click="addKey('form')" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import addOrg from "../organization/addOrg.vue";
import { JKunitrust } from "../../assets/js/JKunitrust.js";
import $ from "jquery";
export default {
    components: {
        addOrg
    },
    inject: ["reload"],
    data() {
        return {
            loginNum: 0,
            organization_id: "",
            allNum: 0,
            loginNum: 0,
            loginDialog: false,
            form: {
                pucDataInput: "", // 待签名数据
                uiUserCert: "", // UK证书
                uiUserSign: "", //即时签名值
                subject: ""
            },
            rules: {},
            //   form: {
            //     id: "",
            //     key_type: "", //  公钥算法
            //     not_before: "", // 证书有效期开始时间
            //     not_after: "", // 证书有效期结束时间
            //     issuer: "", // 颁发者
            //     cert_sn: "" // 序列号
            // },
            rules: {
                subject: [
                    {
                        required: true,
                        message: "请插入Ukey",
                        trigger: "blur"
                    }
                ]
            },
            id_cert_serial: "", // 序列号
            MiMaVal: "",
            id_con_select: [],
            g_cert: "",
            ukey: "",
            id_cert_date: "", // 有效期
            num: 1, // 防抖
            isCheck: false,
            id_con_count: "" // 应用数量
        };
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.organization_id = this.$commonJs.getStorage().organization_id;
        }
        this.getListCount();
    },
    watch: {
        MiMaVal(val) {
            if (val == "设备插入") {
                this.doEnumCon();
            }
        },
        isCheck(val) {
            // if (val == true) {
            console.log("jjj");

            // }
        }
    },
    mounted() {
        this.getInit();
    },
    methods: {
        getListCount() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.WorkUserGetListCount, "POST", {
                    organization_id: this.organization_id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "个数");
                        this.allNum = res.data.data.allCount;
                        this.loginNum = res.data.data.loginCount;

                        console.log(
                            this.allNum / 2,
                            "this.allNum % 2 this.allNum % 2 "
                        );
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    console.log(res, "res", " this.certData", this.certData);
                    this.loading = false;
                });
        },
        openDialog() {
            this.loginDialog = true;
            this.doEnumCon();

            this.doGetRandom();
        },

        handleClose(done) {
            done();
        },
        resetForm() {
            this.reload();
        },
        addKey() {
            this.doP1VerifyData();
            // if (this.form.subject != "") {
            //     this.getLogin();
            // } else {
            //     this.$message.error("请插入设备!");
            // }
        },
        getLogin() {
            this.$refs.form.validate((valid) => {
                if (!valid) return;
                this.loading = true;
                this.$commonJs
                    .getMethodFormData(
                        this.$url.WorkUserExternalVerifyECC,
                        "POST",
                        {
                            pucDataInput: this.form.pucDataInput,
                            uiUserCert: this.g_cert,
                            uiUserSign: this.form.uiUserSign
                        }
                    )
                    .then((res) => {
                        if (res.data.code == 100000) {
                            console.log(res.data.data, "res.data.data");
                            this.reload();
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg);
                        }
                        this.loading = false;
                    });
            });
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
        // listHotPlug(data) {
        //     let that = this;
        //     console.log(data, "data");
        //     if (data.ret != 0) {
        //         return data;
        //     }
        //     if (data.param.type == 1) {
        //         that.$message.success("设备插入");
        //         that.MiMaVal = "设备已插入";
        //         that.$nextTick(() => {
        //             that.doEnumCon();
        //         });
        //     } else if (data.param.type == 2) {
        //         that.$message.success("设备拔出");
        //         that.MiMaVal = "设备已拔出";
        //         that.form = {};
        //     }
        //     console.log(that.MiMaVal, " that.MiMaVal");
        // },
        // onSuccess() {
        //     let that = this;
        //     JKunitrust.listenHotplug(that.listHotPlug);
        //     JKunitrust.SOF_GetVersion(function (data) {
        //         if (data.ret != 0) {
        //             that.$message.error("获取版本号失败: " + data.msg);
        //         } else {
        //         }
        //     });
        // },
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
                    that.MiMaVal = "设备插入";
                    that.doEnumCon();
                }
                if (data.param.type == 2) {
                    that.$nextTick(() => {
                        that.form.subject = "";
                        $("#IdCert").val("");
                        // that.reload();
                        that.loginDialog = false;
                    });
                    that.MiMaVal = "设备拔出";
                    console.log("设备拔出");

                    that.$message.success("设备拔出");
                }
            });
            JKunitrust.SOF_GetVersion(function (data) {
                if (data.ret != 0) {
                    that.$message.error("获取版本号失败: " + data.msg);
                } else {
                    // that.doEnumCon();
                }
            });
        },
        // 枚举设备
        doEnumCon() {
            let that = this;
            JKunitrust.SOF_GetUserList(function (data) {
                if (data.ret != 0) {
                    // that.$message.error("枚举容器失败: " + data.msg);
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
                    // that.$message.error("请插入设备!");
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
                console.log(
                    data,
                    data.param,
                    that.g_cert,
                    "this.id_con_select"
                );
            });
        },
        reflushCertMsg(data) {
            console.log(data, "www");
            let that = this;
            if (data.ret != 0) {
                that.$message.error("获取证书信息失败: " + data.msg);
            } else {
                $("#IdCert").val(data.param.subject);
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
        doGetRandom() {
            let that = this;
            JKunitrust.SOF_GetRandom("32", function (data) {
                if (data.ret != 0) {
                    that.$message.error("获取待签名值失败: " + data.msg);
                    return;
                }

                console.log(data.param.random, "sss");
                that.form.pucDataInput = data.param.random;
                that.doP1SignData(data.param.random);
            });
        },
        doP1SignData(data) {
            let that = this;

            var conname = that.id_con_select;
            if (conname == null || conname == "") {
                that.$message.error("请先正确插入设备!");
                return;
            }
            var pin = "12345678";
            if (pin == null || pin == "") {
                that.$message.error("请输入PIN码");
                return;
            }
            var indata = data;
            JKunitrust.SOF_SignData(conname[0], indata, pin, function (data) {
                if (data.ret != 0) {
                    that.$message.error("执行失败: " + data.msg);
                    return;
                }
                that.form.uiUserSign = data.param.signature;
            });
        },
        doP1VerifyData() {
            let that = this;
            console.log($("#IdCert").val(), "ppp");
            if ($("#IdCert").val() == null || $("#IdCert").val() == "") {
                that.$message.error("请先导出证书");
                return;
            }

            JKunitrust.SOF_VerifySignedData(
                that.g_cert,
                that.form.pucDataInput,
                that.form.uiUserSign,
                function (data) {
                    if (data.ret != 0) {
                        that.$message.error("执行失败: " + data.msg);
                        return;
                    }
                    that.isCheck = true;
                    console.log("jjjss");

                    that.getLogin();

                    // that.$message.success("验签成功");
                }
            );
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
/deep/ .el-dialog__body {
    padding: 0;
}
</style>