<template>
    <div v-loading="loading">
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/operationLogList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="模块标题:" label-width="21%" prop="title">
                            <el-input class="inputwid" v-model="form.title" placeholder="请输入模块标题" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务类型:" label-width="21%" prop="business_type">
                            <el-select v-model="form.business_type" placeholder="请选择业务类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in businessTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="操作类别:" label-width="21%" prop="operator_type">
                            <el-select v-model="form.operator_type" placeholder="请选择操作类别" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in operatorTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求参数:" label-width="21%" prop="operator_param">
                            <el-input class="inputwid" v-model="form.operator_param" placeholder="请输入请求参数" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="请求方式:" label-width="21%" prop="request_method">
                            <el-input class="inputwid" v-model="form.request_method" placeholder="请输入请求方式" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户ID:" label-width="21%" prop="user_id">
                            <el-input class="inputwid" v-model="form.user_id" placeholder="请输入用户ID" :disabled="isDisable"></el-input>
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
                        <el-form-item label="请求URL:" label-width="21%" prop="operator_url">
                            <el-input class="inputwid" v-model="form.operator_url" placeholder="请输入请求URL" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="主机地址:" label-width="21%" prop="operator_ip">
                            <el-input class="inputwid" v-model="form.operator_ip" placeholder="请输入主机地址" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户端信息:" label-width="21%" prop="user_agent">
                            <el-input class="inputwid" v-model="form.user_agent" placeholder="请输入客户端信息" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="浏览器型号:" label-width="21%" prop="browser">
                            <el-input class="inputwid" v-model="form.browser" placeholder="请输入浏览器型号" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="系统平台:" label-width="21%" prop="os">
                            <el-input class="inputwid" v-model="form.os" placeholder="请输入系统平台" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label=" 日志等级:" label-width="21%" prop="log_level">
                            <el-select v-model="form.log_level" placeholder="请选择状态" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in logLevelList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作时间:" label-width="21%" prop="log_time">
                            <el-input class="inputwid" v-model="form.log_time" placeholder="请输入操作时间" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-select v-model="form.status" placeholder="请选择状态" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审计人:" label-width="21%" prop="audit_user">
                            <el-input class="inputwid" v-model="form.audit_user" placeholder="请输入审计人" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="内容:" label-width="21%" prop="log_content">
                            <el-input class="inputwid" type="textarea" v-model="form.log_content" placeholder="请输入浏览器型号" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="方法名称:" label-width="21%" prop="method">
                            <el-input class="inputwid" v-model="form.method" type="textarea" placeholder="请输入方法名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="返回参数:" label-width="21%" prop="result_param">
                            <el-input class="inputwid" type="textarea" v-model="form.result_param" placeholder="请输入返回参数" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="错误信息:" label-width="21%" prop="error_msg">
                            <el-input class="inputwid" v-model="form.error_msg" placeholder="请输入错误参数" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="审计时间:" label-width="21%" prop="audit_time">
                            <el-input class="inputwid" v-model="form.audit_time" placeholder="请输入审计时间" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label-width="10%" style="margin-top:20px">
                    <el-button size="mini" @click="cancel" type="warning" style="margin-left:0.6%" v-if="mode != 1">取消</el-button>
                    <el-button size="mini" type="primary" @click="preOnUpdate" v-if="mode != 2">审计</el-button>
                </el-form-item>
            </el-form>

        </el-card>
        <el-dialog title="审计" :visible.sync="ShenJiDialogVisible" width="55%">
            <el-card class="intanle">
                <el-form ref="form1" :model="formCRL" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :span="12" :offset="6">
                            <el-form-item label="PIN" label-width="21%" prop="PINStr">
                                <el-input style="width:75%" v-model="formCRL.PINStr" placeholder="请输入口令" prefix-icon="el-icon-lock" type="password">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="审批内容:" label-width="21%">
                                <el-input style="width:75%" type="textarea" class="inputwid" v-model="formCRL.pass_content" placeholder="请输入批注"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" @click="onUpdate('1')" type="warning">不通过</el-button>
                                <el-button size="mini" type="primary" @click="onUpdate('2')" style="margin-bottom:10px">通过</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </el-dialog>
    </div>
</template>
<script>
import { JKunitrust } from "../../assets/js/JKunitrust"
export default {
    data() {
        return {
            name: "用户信息",
            mode: this.$route.query.mode,
            operationId: this.$route.query.id,
            isDisable: false,
            loading: false,
            form: {
                id: "",
                title: "", // 模块标题
                business_type: "", // 业务类型
                operator_type: "", // 操作类别
                method: "", // 方法名称
                request_method: "", // 请求方式
                user_id: "", // 用户Id
                nickname: "", // 昵称
                operator_url: "", // 请求路径
                operator_ip: "", // 主机地址
                user_agent: "", // 客户端信息
                browser: "", // 浏览器型号
                os: "", // 系统平台
                operator_param: "", //请求参数
                result_param: "", // 返回参数
                error_msg: "", // 错误消息
                log_level: "", //  日志等级
                log_time: "", // 操作时间
                status: "", // 状态
                audit_user: "", // 审计人
                audit_time: "", // 审计时间
                systems: "",
                service: "",
                modules: "",
                log_content: ""
            },
            rules: {
                // nickname: [
                //     {
                //         required: true,
                //         message: "请输入昵称",
                //         trigger: "blur"
                //     }
                // ],
                username: [
                    {
                        required: true,
                        message: "请输入账号",
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
                // status: [
                //     {
                //         required: true,
                //         message: "请选择状态",
                //         trigger: "change"
                //     }
                // ],
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
                ],
                PINStr: [
                    {
                        required: true,
                        message: "请输入口令",
                        trigger: "blur"
                    }
                ]
            },
            operatorTypeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "0",
                    label: "其它"
                },
                {
                    value: "1",
                    label: "后台用户"
                },
                {
                    value: "2",
                    label: "手机端用户"
                }
            ],
            businessTypeList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "10",
                    label: "新增"
                },
                {
                    value: "20",
                    label: "修改"
                },
                {
                    value: "30",
                    label: "删除"
                },
                {
                    value: "40",
                    label: "查询"
                },
                {
                    value: "61",
                    label: "登录"
                },
                {
                    value: "62",
                    label: "登出"
                }
            ],

            logLevelList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: 1,
                    label: "正常"
                },
                {
                    value: 2,
                    label: "警告"
                },
                {
                    value: 0,
                    label: "调试"
                },
                {
                    value: 9,
                    label: "异常"
                }
            ],

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
                    label: "未审计"
                },
                {
                    value: "11",
                    label: "审核中"
                },
                {
                    value: "12",
                    label: "审计未通过"
                },
                {
                    value: "39",
                    label: "异常"
                }
            ],
            id_con_select: [], // 列表菜单
            ShenJiDialogVisible: false,
            formCRL: {
                PINStr: "",
                pass_content: ""
            },
            audit_indata: "",
            audit_signature: ""
        }
    },

    created() {
        if (this.mode != 1) {
            this.getOperationDetail()
            if (this.mode == 3) {
                this.isDisable = true

                this.name = "操作日志信息"
            } else {
                this.isDisable = true
                this.name = "操作日志信息"
            }
        }
        this.getInit()
        this.onSuccess()
    },
    methods: {
        // 初始化
        getInit() {
            // debugger;
            let that = this
            JKunitrust.oninit(
                that.onSuccess,
                function (msg, evt) {
                    // that.$message.error("初始化失败:" + msg);
                    console.log(evt)
                    return true
                },
                function () {
                    //   that.$message.success("连接断开");
                    that.$message.success("连接断开")
                }
            )
        },

        onSuccess() {
            let that = this
            JKunitrust.listenHotplug(function (data) {
                console.log(data, "data")
                if (data.ret != 0) {
                    return data
                }
                if (data.param.type == 1) {
                    console.log("设备插入")
                    that.$message.success("设备插入")
                }
                if (data.param.type == 2) {
                    console.log("设备拔出")
                    that.$message.success("设备拔出")
                }
            })
            JKunitrust.SOF_GetVersion(function (data) {
                if (data.ret != 0) {
                    that.$message.error("获取版本号失败: " + data.msg)
                } else {
                    // this.MiMaVal = "插件控件版本号:" + data.param.version;
                    // that.doEnumCon();
                    console.log("枚举成功")
                }
            })
        },
        doEnumCon() {
            let that = this
            JKunitrust.SOF_GetUserList(function (data) {
                if (data.ret != 0) {
                    alert("枚举容器失败: " + data.msg)
                    return
                }
                that.id_con_select = data.param.certlist
                that.doExportSignCert()
            })
        },
        doExportSignCert() {
            let that = this

            var conname = that.id_con_select[0]
            if (conname == null || conname == "") {
                that.$message.error("请在本机插入审计管理员ukey!")
                return
            }

            JKunitrust.SOF_ExportUserCert(conname, function (data) {
                if (data.ret != 0) {
                    alert("导出用户签名证书失败: " + data.msg)
                    return
                }
                console.log("--", data.param.cert)
                that.audit_indata = data.param.cert
            })
        },
        // 获取详情
        getOperationDetail() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.GetOperationDetail, "POST", {
                    id: this.operationId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.form = res.data.data
                        console.log(this.form)
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        cancel() {
            this.$router.push("/operationLogList")
            this.ShenJiDialogVisible = false
        },
        preOnUpdate() {
            this.doEnumCon()
            this.ShenJiDialogVisible = true
        },
        onUpdate(type) {
            let that = this
            var conname1 = that.id_con_select
            if (conname1 == null || conname1 == "") {
                that.$message.error("请在本机插入审计管理员ukey!")
                return
            }
            // 原文
            var indata =
                that.form.id +
                that.form.systems +
                that.form.service +
                that.form.modules +
                that.form.operator_type +
                that.form.business_type +
                that.form.title +
                that.form.method +
                that.form.request_method +
                that.form.operator_url +
                that.form.user_id +
                that.form.log_content +
                that.form.operator_param +
                that.form.result_param +
                that.form.error_msg
            console.log("---", indata)
            JKunitrust.SOF_SignData(
                conname1[0],
                indata,
                that.formCRL.PINStr,
                function (data) {
                    if (data.ret != 0) {
                        that.$message.error("执行失败: " + data.msg)
                        return
                    }
                    that.audit_signature = data.param.signature
                    let status
                    if (type == "1") {
                        status = "12"
                    } else {
                        status = "20"
                    }
                    let data1 = that.$commonJs.getScreenValue({
                        id: that.operationId,
                        status: status,
                        audit_content: that.formCRL.pass_content,
                        audit_indata: that.audit_indata,
                        audit_signature: that.audit_signature
                    })
                    if (that.mode == 3) {
                        that.$commonJs
                            .getMethodData(
                                that.$url.GetUpdateOperation,
                                "POST",
                                data1
                            )
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    that.cancel()
                                } else {
                                    that.$message.error(res.data.msg)
                                }
                            })
                    }
                    // JKunitrust.SOF_VerifySignedData(
                    //     that.audit_indata,
                    //     indata,
                    //     that.audit_signature,
                    //     function (data) {
                    //         if (data.ret != 0) {
                    //             that.$message.error("执行失败: " + data.msg)
                    //             return
                    //         }
                    //         debugger
                    //         console.log(data)
                    //         that.isCheck = true
                    //         console.log("jjjss")

                    //         // that.$message.success("验签成功");
                    //     }
                    // )
                }
            )
        }
    }
}
</script>
