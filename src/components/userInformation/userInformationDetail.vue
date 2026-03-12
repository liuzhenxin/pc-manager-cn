<template>
    <div>
        <el-card class="navDetailItem" v-if="this.YongHumode == undefined">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/userInformationList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
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
                            <el-select v-model="form.type" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
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
                                <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1"></i> -->
                            </el-input>
                            <!-- <el-input class="inputwid" v-model="form.password" placeholder="请输入密码" :disabled="isDisable"></el-input> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="mode!=1">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-select v-model="form.status" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="证件类型:" label-width="21%">
                            <el-select v-model="form.card_type" placeholder="请选择类型" style="width: 60%" :disabled="isAdminDisable">
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
                            <el-input class="inputwid" v-model="form.sex" placeholder="请输入性别" :disabled="isDisable"></el-input>
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
                        <el-form-item label="联系方式:" label-width="21%" prop="tel">
                            <el-input class="inputwid" :maxlength="11" v-model="form.tel" placeholder="请输入联系方式" :disabled="isDisable" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
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

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注:" label-width="21%" prop="remark">
                            <el-input type="textarea" class="inputwid" v-model="form.remark" placeholder="请输入备注" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" v-if="this.YongHumode != undefined">
                        <el-form-item label="证书PIN:" label-width="21%" prop="pin">
                            <el-input class="inputwid" v-model="form.pin" prefix-icon="el-icon-lock" :type="flag2 ? 'password' : 'text'" placeholder="请输入证书PIN" :disabled="isDisable">
                                <i slot="suffix" :class="[flag2 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag2 = !flag2" />
                            </el-input>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <!-- <div class="logtime">
                    <el-col :span="12">
                        <el-form-item v-if="this.mode != 1" label="创建时间:" label-width="20%">{{ form.create_time }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="this.mode != 1" label="更新时间:" label-width="20%">{{ form.update_time }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="this.mode != 1" label="创建人:" label-width="20%">{{ form.create_by }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="this.mode != 1" label="更新人:" label-width="20%">{{ form.update_by }}</el-form-item>
                    </el-col>
                </div> -->
                <el-form-item label-width="10%" style="margin-top:20px" v-if="this.YongHumode == undefined">
                    <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1">取消</el-button>
                    <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2">确定</el-button>
                </el-form-item>
                <el-col v-if="this.YongHumode != undefined">
                    <div style="margin-top:-30px;margin-bottom:50px">
                        <el-button type="primary" style="margin-top:100px" icon="el-icon-plus" @click="bindUkey('form')">绑定Ukey</el-button>
                        <el-button type="primary" style="margin-top:100px" icon="el-icon-d-arrow-left" @click="prevBtn()">上一步</el-button>
                        <el-button type="primary" v-if="this.YongHumode!=3" style="margin-top:100px" icon="el-icon-d-arrow-right" @click="nextUpdate('form',YongHumode)">下一步</el-button>
                        <el-button type="primary" v-else style="margin-top:100px" icon="el-icon-check" @click="nextUpdate('form',YongHumode)">完成</el-button>
                    </div>
                </el-col>
            </el-form>

        </el-card>
    </div>
</template>
<script>
import { JKunitrust } from "../../assets/js/JKunitrust.js";

export default {
    props: {
        YongHumode: {
            type: Number
        }
    },
    data() {
        return {
            name: "用户信息",
            mode: this.$route.query.mode,
            userId: this.$route.query.id,
            isDisable: false,
            ukey: "",
            ukey1: "",
            ukey2: "",
            flag1: true,
            flag2: true,
            form: {
                id: "",
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
            // url:"",
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
                        message: "请输入联系方式",
                        trigger: "blur"
                    }
                ]
            },
            typeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "0",
                    label: "超级管理员"
                },
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
            MiMaVal: "",
            id_con_select: [],
            g_cert: "",
            isAdminDisable: false,
            ukey: "",
            id_cert_date: "", // 有效期
            num: 1, // 防抖
            id_con_count: "" // 应用数量
        };
    },

    created() {
        if (
            this.$commonJs.getStorage().organization_id != 1 ||
            (this.$commonJs.getStorage().organization_id == 1 && this.mode == 2)
        ) {
            this.isAdminDisable = true;
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
        if (this.YongHumode == 1) {
            this.getInit();
        }
    },
    methods: {
        // 获取详情
        getUserDetail() {
            // this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.GetUserDetail, "POST", {
                    id: this.userId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                        this.form.type = "2";
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    // this.$commonJs.getCloseLoading();
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
        listHotPlug(data) {
            let that = this;
            console.log(data, "data");
            if (data.ret != 0) {
                return data;
            }
            if (data.param.type == 1) {
                that.$message.success("设备插入");
                that.MiMaVal = "设备已插入";
            } else if (data.param.type == 2) {
                that.$message.success("设备拔出");
                that.MiMaVal = "设备已拔出";
            }
            // window.sessionStorage.setItem("MiMaVal", that.MiMaVal);
            console.log(that.MiMaVal, " that.MiMaVal");
        },
        onSuccess() {
            let that = this;
            JKunitrust.listenHotplug(that.listHotPlug);
            JKunitrust.SOF_GetVersion(function (data) {
                if (data.ret != 0) {
                    that.$message.error("获取版本号失败: " + data.msg);
                } else {
                    // that.MiMaVal = "";
                    // this.MiMaVal = "插件控件版本号:" + data.param.version;
                    // that.doEnumCon();
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
            // debugger;
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
                // console.log(
                //     that.g_cert1,
                //     "that.g_cert1",
                //     that.g_cert2,
                //     " that.g_cert2",
                //     that.g_cert3,
                //     " that.g_cert3"
                // );
                that.g_cert = data.param.cert;
                JKunitrust.SOF_GetCertInfo(that.g_cert, that.reflushCertMsg);
                console.log(data, data.param, "this.id_con_select");
            });
        },
        reflushCertMsg(data) {
            let that = this;
            if (data.ret != 0) {
                that.$message.error("获取证书信息失败: " + data.msg);
            } else {
                that.id_cert_serial1 = data.param.serial;
                if (that.YongHumode == 1) {
                    that.$commonJs
                        .getCheckCert({
                            cert_sn: that.id_cert_serial1,
                            card_no: that.form.card_no,
                            username: that.form.username,
                            tel: that.form.tel
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                window.sessionStorage.setItem(
                                    "id_cert_serial1",
                                    that.id_cert_serial1
                                );
                                window.sessionStorage.setItem(
                                    "g_cert1",
                                    that.g_cert
                                );
                                that.$message.success("绑定成功!");
                            } else if (res.data.code != 800000) {
                                that.$message.error(res.data.msg);
                            }
                        });
                } else if (that.YongHumode == 2) {
                    if (
                        window.sessionStorage.getItem("id_cert_serial1") ==
                        data.param.serial
                    ) {
                        this.$message.error("证书重复!");
                        return;
                    } else {
                        that.$commonJs
                            .getCheckCert({
                                cert_sn: that.id_cert_serial1,
                                card_no: that.form.card_no,
                                username: that.form.username,
                                tel: that.form.tel
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    window.sessionStorage.setItem(
                                        "id_cert_serial2",
                                        that.id_cert_serial1
                                    );
                                    window.sessionStorage.setItem(
                                        "g_cert2",
                                        that.g_cert
                                    );
                                    that.$message.success("绑定成功!");
                                } else if (res.data.code != 800000) {
                                    that.$message.error(res.data.msg);
                                }
                            });
                    }
                } else if (that.YongHumode == 3) {
                    // window.sessionStorage.setItem("formData", that.form);

                    if (
                        window.sessionStorage.getItem("id_cert_serial2") ==
                        data.param.serial
                    ) {
                        this.$message.error("证书重复!");
                        return;
                    } else {
                        that.$commonJs
                            .getCheckCert({
                                cert_sn: that.id_cert_serial1,
                                card_no: that.form.card_no,
                                username: that.form.username,
                                tel: that.form.tel
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    window.sessionStorage.setItem(
                                        "id_cert_serial3",
                                        that.id_cert_serial1
                                    );
                                    window.sessionStorage.setItem(
                                        "g_cert3",
                                        that.g_cert
                                    );
                                    that.$message.success("绑定成功!");
                                } else if (res.data.code != 800000) {
                                    that.$message.error(res.data.msg);
                                }
                            });
                    }
                }
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
        getCheck(data, type) {
            // debugger;
            let formData1 = JSON.parse(
                window.sessionStorage.getItem("formData1")
            );
            let formData2 = JSON.parse(
                window.sessionStorage.getItem("formData2")
            );
            let dataList;
            if (this.YongHumode == 2) {
                dataList = formData1;
            }
            if (this.YongHumode == 3) {
                dataList = formData2;
                if (type == "3") {
                    dataList = formData1;
                }
            }
            if (dataList.card_no === data.card_no) {
                this.$message.error("证件号重复!");
                return false;
            }
            if (dataList.username === data.username) {
                this.$message.error("账号重复!");
                return false;
            }
            if (dataList.tel === data.tel) {
                this.$message.error("联系方式重复!");
                return false;
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
        prevBtn() {
            if (this.YongHumode == 1) {
                this.$emit("getPrev", "first");
            } else if (this.YongHumode == 2) {
                this.$emit("getPrev", "second");
            } else if (this.YongHumode == 3) {
                this.$emit("getPrev", "third");
            }
        },
        nextUpdate(formName, mode) {
            this.ukey = window.sessionStorage.getItem("g_cert1");
            this.ukey1 = window.sessionStorage.getItem("g_cert2");
            this.ukey2 = window.sessionStorage.getItem("g_cert3");
            if (this.form.parent_id == "") {
                this.form.parent_id = 0;
                this.$refs.form.clearValidate("organizationFatherName");
            }
            console.log(this.form, "this.form.parent_id");
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                if (this.YongHumode == 1) {
                    if (this.ukey == null) {
                        this.$message.error("请绑定Ukey!");
                        return false;
                    }
                } else if (this.YongHumode == 2) {
                    if (this.ukey1 == null) {
                        this.$message.error("请绑定Ukey!");
                        return false;
                    }
                    if (this.getCheck(this.form) == false) {
                        return false;
                    }
                } else if (this.YongHumode == 3) {
                    if (this.ukey2 == null) {
                        this.$message.error("请绑定Ukey!");
                        return false;
                    }
                    if (this.getCheck(this.form) != false) {
                        if (this.getCheck(this.form, "3") == false) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                this.$commonJs
                    .getCheckCert({
                        cert_sn: this.id_cert_serial1,
                        card_no: this.form.card_no,
                        username: this.form.username,
                        tel: this.form.tel
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            let data = this.$commonJs.getScreenValue(this.form);
                            console.log(data, "data");
                            if (this.YongHumode == 1) {
                                window.sessionStorage.setItem(
                                    "formData1",
                                    JSON.stringify(this.form)
                                );
                                this.$emit("getYongHuData", data, this.ukey);
                            } else if (this.YongHumode == 2) {
                                window.sessionStorage.setItem(
                                    "formData2",
                                    JSON.stringify(this.form)
                                );
                                this.$emit(
                                    "getYongHuAnQuanData",
                                    data,
                                    this.ukey1
                                );
                            } else if (this.YongHumode == 3) {
                                this.$emit(
                                    "getYongHuShenJiData",
                                    data,
                                    this.ukey2
                                );
                            }
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg);
                            return;
                        }
                    });
            });
        },
        cancel() {
            this.$router.push("/userInformationList");
        },
        onUpdate(formName) {
            let url;
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let data = this.$commonJs.getScreenValue(this.form);
                console.log(data, "data");
                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.GetAddUserList;
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
