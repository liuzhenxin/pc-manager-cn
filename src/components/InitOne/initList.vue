<template>
    <div>
        <el-card v-if="MessageType == 'myMessage'" style="margin-top:30px">
            <span class="h1">账户信息</span>
        </el-card>
        <div v-if="Insert==false">
            <el-card class="intanle" style="margin-bottom: 20px;" v-if="YongHumode==1 ">

                <!-- 列表 -->
                <div v-if="isInsert == false" class="tableHeight">
                    <el-button size="mini" @click="insertData('form')" style="margin-left:0%;margin-top:2%" type="primary" icon="el-icon-check">新增</el-button>
                    <el-table ref="multipleTable" v-loading="loading" :data="userList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                        <el-table-column label="姓名" prop="fullname">

                        </el-table-column>

                        <el-table-column label="联系方式" prop="tel"></el-table-column>
                        <el-table-column label="账号" prop="username"></el-table-column>

                        <el-table-column label="创建时间" prop="create_time"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click.native.stop="handleDelete(scope.row)" key='5' type="text" size="mini" class="el-icon-delete" style="color: #da0909;cursor:pointer">删除</el-button>
                            </template>
                        </el-table-column>
                        <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                            <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                            <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                        </div>
                    </el-table>
                    <!-- 分页区域 -->

                    <div style="margin-bottom:30px">
                        <el-button type="primary" style="margin-top:30px" size="mini" icon="el-icon-d-arrow-right" @click="nextUpdate('用户')">下一步</el-button>

                    </div>
                </div>
                <div v-if="isInsert == true">
                    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px;padding-top:30px">
                        <el-row :gutter="20">
                            <el-col :span="12" :offset="6">

                                <el-form-item label="账号:" label-width="21%" prop="username">
                                    <el-input class="inputwid" v-model="form.username" placeholder="请输入账号" :disabled="isDisable"></el-input>
                                </el-form-item>

                                <el-form-item label="密码:" label-width="21%" prop="password">
                                    <el-button v-if="MessageType=='myMessage'" type="primary" plain size='mini' style="margin-left: 2px;" icon="el-icon-edit" @click="modifyKey('form')">修改密码</el-button>
                                    <el-input v-else class="inputwid" v-model="form.password" prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'" placeholder="请输入密码" :disabled="isDisable">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="确认密码:" label-width="21%" prop="surePassword">
                                    <el-input class="inputwid" v-model="form.surePassword" prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'" placeholder="请输入确认密码" :disabled="isDisable">
                                    </el-input>
                                </el-form-item>

                                <el-form-item label="姓名:" label-width="21%" prop="fullname">
                                    <el-input class="inputwid" v-model="form.fullname" placeholder="请输入姓名" :disabled="isDisable"></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式:" label-width="21%" prop="tel">
                                    <el-input class="inputwid" :maxlength="11" v-model="form.tel" placeholder="请输入联系方式" :disabled="isDisable" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                                </el-form-item>
                                <el-form-item label="证件类型:" label-width="21%" prop="card_type">
                                    <el-select v-model="form.card_type" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                        <el-option v-for="item in cardTypeList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="证件号码:" label-width="21%" prop="card_no">
                                    <el-input class="inputwid" v-model="form.card_no" placeholder="请输入证件号码" :disabled="isDisable"></el-input>
                                </el-form-item>
                                <el-form-item label="通用名:" label-width="21%" prop="InitCommonName" v-if="MessageType != 'myMessage'  && initStatus.ca == true">
                                    <el-input class="inputwid" v-model="form.InitCommonName" placeholder="请输入通用名" :disabled="isDisable"></el-input>
                                    <el-button size="mini" @click="MakeCert()" style="margin-left:10px" type="primary" icon="el-icon-plus">绑定Ukey</el-button>
                                </el-form-item>
                                <el-form-item label="UKey:" label-width="21%" prop="id_cert_subject" v-if="MessageType != 'myMessage' && initStatus.ca != true">
                                    <el-input class="inputwid" v-model="form.id_cert_subject" placeholder="请输入UKey" id="IdCert" :disabled="true"></el-input>
                                    <el-button size="mini" @click="bindUkey('1')" style="margin-left:10px" type="primary" icon="el-icon-plus">绑定Ukey</el-button>
                                </el-form-item>

                                <el-col style="margin-top:7%;margin-bottom:7%" v-if="MessageType!='myMessage'">
                                    <el-button size="mini" @click="uploadData('form')" style="margin-left:30%;" type="primary" icon="el-icon-check">提交</el-button>
                                    <el-button size="mini" @click="cancel()" style="margin-left:2%; " type="primary" icon="el-icon-right">返回</el-button>
                                </el-col>
                                <el-col style="margin-top:3%" v-else></el-col>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
            <div v-if="MessageType=='myMessage'" style="padding:15px 0;">
                <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:0px;">
                    <el-tab-pane label="个人信息">
                        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px;padding-top:30px">
                            <el-row :gutter="20">
                                <el-col :span="12" :offset="6">

                                    <el-form-item label="账号:" label-width="21%">
                                        <el-input class="inputwid" v-model="form.username" placeholder="请输入账号" :disabled="isDisable"></el-input>
                                    </el-form-item>

                                    <el-form-item label="密码:" label-width="21%">
                                        <el-button type="primary" plain size='mini' style="margin-left: 2px;" icon="el-icon-edit" @click="modifyKey('form')">修改密码</el-button>

                                    </el-form-item>

                                    <el-form-item label="姓名:" label-width="21%">
                                        <el-input class="inputwid" v-model="form.fullname" placeholder="请输入姓名" :disabled="isDisable"></el-input>
                                    </el-form-item>
                                    <el-form-item label="联系方式:" label-width="21%">
                                        <el-input class="inputwid" :maxlength="11" v-model="form.tel" placeholder="请输入联系方式" :disabled="isDisable" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                                    </el-form-item>
                                    <el-form-item label="证件类型:" label-width="21%" prop="card_type">
                                        <el-select v-model="form.card_type" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                            <el-option v-for="item in cardTypeList" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="证件号码:" label-width="21%" prop="card_no">
                                        <el-input class="inputwid" v-model="form.card_no" placeholder="请输入证件号码" :disabled="isDisable"></el-input>
                                    </el-form-item>
                                    <!-- <el-form-item label="证书序列号:" label-width="21%" prop="cert_sn">
                                        <el-input class="inputwid" v-model="form.sysUserCertList[0].cert_sn" placeholder="请输入证书序列号" :disabled="isDisable"></el-input>
                                    </el-form-item>
                                    <el-form-item label="证书主题:" label-width="21%" prop="card_no">
                                        <el-input class="inputwid" v-model="form.sysUserCertList[0].subject" placeholder="请输入证书主题" :disabled="isDisable"></el-input>
                                    </el-form-item> -->

                                    <el-col style="margin-top:3%"></el-col>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="智能密码钥匙">
                        <modifyPIN></modifyPIN>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <el-card class="intanle" style="margin-bottom: 20px;" v-if="YongHumode==2">
                <el-row style="padding-top:20px;padding-bottom:40px">

                    <el-row v-for="(val,key,index) in roleLists" :key="index" :gutter="20" style="margin-bottom:10px;" v-show="val.length!=0">

                        <el-form :ref="key" :model="roleForm[key]" :rules="rolrRules[key]" label-position="right" label-width="21%" style="margin-bottom:20px; ">
                            <el-col :offset="4" class="fontStyle">
                                <span v-show="key=='hsm'">服务器密码机</span>
                                <span v-show="key=='svs'">签名验签服务器</span>
                                <span v-show="key=='ca'">CA</span>
                            </el-col>
                            <el-col :span="12" :offset="7" v-for="(item,index1) in val" :key="index1">
                                <el-form-item :label="item.name+':'" label-width="22%" :prop="'user_name'+index1">
                                    <el-input class="inpuStyle" v-model="roleForm[key]['user_name'+index1]" :placeholder="'请选择'+item.name" :disabled="isRoleDisable"></el-input>
                                    <el-button size="mini" @click="choiceData1(roleForm[key],index1)" style="margin-left:3%;" type="primary" icon="el-icon-plus">选择</el-button>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                    <el-row :gutter="20" style="margin-bottom:0px;">
                        <el-button type="primary" v-if="initStatus.ca==1" size="mini" style="margin-top:30px;" icon="el-icon-check" @click="nextUpdate('权限')">下一步</el-button>
                        <el-button type="primary" v-if="initStatus.ca!=1" size="mini" style="margin-top:30px;" icon="el-icon-check" @click="nextUpdate('权限')">完成</el-button>
                    </el-row>

                </el-row>
            </el-card>
            <el-dialog title="选择用户" :visible.sync="userDialogVisible" width="60%">
                <el-row style="margin-top:-30px">
                    <el-col>
                        <div class="downTree">
                            <el-card style="padding-bottom:15px">
                                <el-table ref="symmetricTable" @row-click="(row,column,e)=>choiceClick(row)" v-loading="loading" :data="userList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe @selection-change="handleSelectionChange">
                                    <el-table-column type="selection" width="50">
                                        <template slot-scope="scope">
                                            <el-radio style="margin-left:8px" v-model="userRadio" :label="scope.row.id" @change="getRadio(scope.row)">
                                                {{  }}
                                            </el-radio>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="姓名" prop="fullname">

                                    </el-table-column>

                                    <el-table-column label="联系方式" prop="tel"></el-table-column>
                                    <el-table-column label="账号" prop="username"></el-table-column>
                                    <el-table-column label="类型" prop="type">
                                        <template slot-scope="scope">
                                            <span v-if="scope.type==0">超级管理员</span>
                                            <span v-else-if="scope.type==1">系统用户</span>
                                            <span v-else>普通用户</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="创建时间" prop="create_time"></el-table-column>
                                    <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                                        <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                        <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                                    </div>
                                </el-table>

                            </el-card>
                        </div>
                    </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="infoUser()" size="mini" type="warning">取 消</el-button>
                    <el-button size="mini" type="primary" @click="addUser1()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="修改密码" :visible.sync="modifyDialog" width="30%" :before-close="handleClose">
                <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :offset="2">
                            <el-form-item label="原密码:" label-width="110px" prop="oldPass">
                                <el-input style="width:75%" v-model="modifyForm.oldPass" prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'" placeholder="请输入原密码">
                                    <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1"></i> -->
                                </el-input>
                            </el-form-item>
                            <el-form-item label="新密码:" label-width="110px" prop="newPass">
                                <el-input style="width:75%" v-model="modifyForm.newPass" placeholder="请输入新密码" prefix-icon="el-icon-lock" :type="flag2 ? 'password' : 'text'">
                                    <!-- <i slot="suffix" :class="[flag2 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag2 = !flag2"></i> -->
                                </el-input>
                            </el-form-item>
                            <el-form-item label="确认密码:" label-width="120px" prop="newPass1" style="margin-left:-10px">
                                <el-input style="width:75%" v-model="modifyForm.newPass1" placeholder="请确认新密码" prefix-icon="el-icon-lock" :type="flag3 ? 'password' : 'text'">
                                    <!-- <i slot="suffix" :class="[flag3 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag3 = !flag3"></i> -->
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="handleClose('modifyForm')">取 消</el-button>
                    <el-button size="mini" type="primary" @click="addPINStr('modifyForm')">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- <div v-if="Insert==true" :style="initInforMation" style="overflow: hidden;overflow-y: auto">
            <el-card>
                <div style="margin-bottom:30px">
                    <el-row>
                        <el-col :sm="12" :lg="22">
                            <el-result icon="success" title="初始化完成">
                            </el-result>
                        </el-col>
                        <el-col :span="12" :offset="7">
                            <div v-for="(item,index) in roleList" :key="index">
                                <el-descriptions class="margin-top" :column="2" :size="size" style="">
                                    <el-descriptions-item label="机构名" style="width:120px">{{item.org_name}}</el-descriptions-item>
                                    <el-descriptions-item label="权限" style="width:120px">{{item.role_name}}</el-descriptions-item>
                                    <el-descriptions-item label="姓名" style="width:120px">{{item.full_name}}</el-descriptions-item>
                                    <el-descriptions-item label="账号" style="width:120px">{{item.user_name}}</el-descriptions-item>
                                </el-descriptions>
                                <el-divider></el-divider>
                            </div>
                        </el-col>
                        <el-col :span="12" :offset="10">
                            <el-button size="mini" style="margin-left:0%; width:120px;margin-top:5%" type="primary" @click="goLogin()" :style="MraginTop">完成</el-button>

                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </div> -->
    </div>

</template>
<script>
import { usbKey} from "@/ubsControl/usbKey";
import { JKunitrust } from "../../assets/js/JKunitrust"
import modifyPIN from "../selfInspection/modifyPINList.vue"
import $ from "jquery"
export default {
    props: {
        YongHumode: {
            type: Number
        },
        isAddOrg: {
            type: Boolean
        },
        Refresh: {
            type: String
        }
    },
    components: {
        modifyPIN
    },
    data() {
        return {
            Insert: false,
            size: "",
            flag1: false,
            flag2: false,
            flag3: false,
            MraginTop: "",
            initInforMation: { height: "570px" },
            aio_step: "",
            MessageType: this.$route.query.MessageType,
            userId: this.$route.query.id,
            userDialogVisible: false,
            modifyDialog: false,
            userRadio: "",
            isRoleDisable: false,
            isInsert: false,
            id_con_count: "", // 设备个数
            id_con_select: [], // 列表菜单
            id_cert_date: "",
            g_cert: "", // 证书
            checkType: "",
            userList: [],
            mode: "",

            loading: false,
            flag1: true,
            flag2: true,
            flag3: true,
            isDisable: false,
            pageNow: 1,
            pageSize: 10,
            total: 10,
            checkList: {},
            modifyForm: {
                oldPass: "",
                newPass: "",
                newPass1: ""
            },
            modifyRules: {
                oldPass: [
                    {
                        required: true,
                        message: "请输入原密码",
                        trigger: "blur"
                    }
                ],
                newPass: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur"
                    }
                ],
                newPass1: [
                    {
                        required: true,
                        message: "请确认新密码",
                        trigger: "blur"
                    }
                ]
            },
            form: {
                id: "",
                // pin: "12345678",
                tel: "",
                status: "10",
                card_no: "", // 证件号码
                certStr: "",
                type: "1",
                fullname: "",
                username: "",
                nickname: "",
                organization_id: "",
                password: "",
                surePassword: "",
                card_type: "1", // 证件类型 1:身份证 2:护照
                id_cert_subject: "", // 使用者
                id_cert_serial: "", // 序列号
                InitCommonName: ""
            },
            currentSelectItem: {},
            rules: {
                InitCommonName: [
                    {
                        required: true,
                        message: "请输入通用名",
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
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ],
                surePassword: [
                    {
                        required: true,
                        message: "请输入确认密码",
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
                id_cert_subject: [
                    {
                        required: true,
                        message: "请绑定Ukey",
                        trigger: "blur"
                    }
                ],

                username1: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur"
                    }
                ],

                password1: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ],
                fullname1: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ],
                tel1: [
                    {
                        required: true,
                        message: "请输入联系方式",
                        trigger: "blur"
                    }
                ],
                id_cert_subject1: [
                    {
                        required: true,
                        message: "请绑定Ukey",
                        trigger: "blur"
                    }
                ],
                username2: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur"
                    }
                ],
                password2: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ],
                fullname2: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ],
                tel2: [
                    {
                        required: true,
                        message: "请输入联系方式",
                        trigger: "blur"
                    }
                ],
                id_cert_subject2: [
                    {
                        required: true,
                        message: "请绑定Ukey",
                        trigger: "blur"
                    }
                ]
            },
            HSMform: {
                fullname: "",
                fullname1: "",
                fullname2: "",
                id: "",
                id1: "",
                id2: ""
            },
            HSMrules: {
                fullname: [
                    {
                        required: true,
                        message: "请选择系统管理员",
                        trigger: "blur"
                    }
                ],
                fullname1: [
                    {
                        required: true,
                        message: "请选择安全管理员",
                        trigger: "blur"
                    }
                ],
                fullname2: [
                    {
                        required: true,
                        message: "请选择审计管理员",
                        trigger: "blur"
                    }
                ]
            },
            forms: [],
            SVSform: {
                fullname: "",
                fullname1: "",
                fullname2: "",
                id: "",
                id1: "",
                id2: ""
            },
            rolrRules: {},
            CAform: {
                fullname: "",
                fullname1: "",

                id: "",
                id1: ""
            },
            CArules: {
                fullname: [
                    {
                        required: true,
                        message: "请选择超级管理员",
                        trigger: "blur"
                    }
                ],
                fullname1: [
                    {
                        required: true,
                        message: "请选择审计管理员",
                        trigger: "blur"
                    }
                ]
            },
            cardTypeList: [
                {
                    value: "1",
                    label: "身份证"
                },
                {
                    value: "2",
                    label: "护照"
                }
            ],
            pullOut: "",
            timer: "",
            initStatus: {
                ca: false,
                kms: false,
                svs: false,
                hsm: false,
                ra: false
            },
            roleList: [],
            num: 0,
            roleLists: {},
            roleForm: {},
            roleData: {},
            roleIndex: ""
        }
    },
    created() {
        this.getAioServiceExist()
        this.form.organization_id = window.sessionStorage.getItem("orgId")
        if (this.MessageType == "myMessage") {
            this.isInsert = true
            this.isDisable = true
            this.getMessageById()
        }
        if (this.YongHumode == 1) {
            this.getOrgList()
        }
        this.getInit()
        this.onSuccess()
        if (this.YongHumode == 2) {
            this.getRoles()
        }
        // this.getOrgList();
    },
    mounted() {
        this.getInitStatus()
    },
    watch: {
        isAddOrg(val) {
            if (val == true) {
                this.getOrgList()
            }
        }
    },
    methods: {
        // 获取存在哪些系统
        getAioServiceExist() {
            this.$commonJs
                .getMethodData(this.$url.AioServiceExist, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.sysList = res.data.data
                        window.sessionStorage.setItem(
                            "sysList",
                            JSON.stringify(res.data.data)
                        )
                        this.initStatus = JSON.parse(
                            window.sessionStorage.getItem("sysList")
                        )
                    } else if (res.data.code != 800000) {
                        this.$commonJs.getCloseLoading()
                        this.$message.error(res.data.msg)
                    } else {
                        this.$commonJs.getCloseLoading()
                    }
                })
        },
        getRoles() {
            let orgId = -1
            if (
                this.form.organization_id != null &&
                this.form.organization_id != ""
            ) {
                orgId = this.form.organization_id
            }
            this.$commonJs
                .getMethodData(this.$url.GetRoles, "POST", {
                    organization_id: orgId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.roleLists = res.data.data
                        let obj = {},
                            rulesObj = {}

                        for (var key in this.roleLists) {
                            let roleChildren = this.roleLists[key]
                            let objArr = {},
                                rules = {}
                            if (roleChildren.length != 0) {
                                roleChildren.forEach((item, index) => {
                                    console.log(item.id, "itemId")

                                    objArr["role_id" + index] = item.id
                                    objArr["user_id" + index] = ""
                                    objArr["user_name" + index] = ""
                                    rules["user_name" + index] = [
                                        {
                                            required: true,
                                            message: "请选择" + item.name,
                                            trigger: "blur"
                                        }
                                    ]
                                })
                            }
                            rulesObj[key] = rules
                            obj[key] = objArr
                        }
                        this.roleForm = obj
                        this.rolrRules = rulesObj
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
                })
        },
        nextStep(data) {
            this.$emit("userListNum", 3)
            // this.getInitStatus();
        },
        MakeCert() {
            let subject = "C=CN,CN=" + this.form.InitCommonName
            this.$UKey.MakeCert(
                subject,
                "12345678",
                {
                    isDouble: "1",
                    organization_id: this.form.organization_id,
                    isUK: "0"
                },
                this.$url.InitGenCertUK,
                (res) => {
                    if (res == true) {
                        this.bindUkey("1")
                    }
                }
            )
        },
        insertData() {
            this.isInsert = true
        },
        uploadData(formName) {
            let url
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                if (this.form.certStr == "") {
                    this.$message.error("请先绑定UKey!")
                    return
                }
                this.form.nickname = this.form.username
                let data = this.$commonJs.getScreenValue(this.form)
                console.log(data, "data")
                url = this.$url.GetInitAddUser
                this.$commonJs.getMethodData(url, "POST", data).then((res) => {
                    if (res.data.code == 100000) {
                        this.getOrgList()
                        this.cancel()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
                })
            })
        },
        getMessageById() {
            this.$commonJs
                .getMethodData(this.$url.GetUserDetail, "POST", {
                    id: this.userId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.form = res.data.data
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    // this.$commonJs.getCloseLoading();
                })
        },
        modifyKey() {
            this.modifyDialog = true
        },
        addPINStr(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                if (this.modifyForm.newPass === this.modifyForm.oldPass) {
                    this.$message.error("新密码不能与原密码重复!")
                    return false
                }
                if (this.modifyForm.newPass !== this.modifyForm.newPass1) {
                    this.$message.error("新密码和确认密码不一致!")
                    return false
                }

                this.modifyDialog = false
                setTimeout(() => {
                    this.$confirm("是否修改密码?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then((res) => {
                            this.$commonJs
                                .getMethodData(
                                    this.$url.UpdatePassword,
                                    "POST",
                                    {
                                        id: this.userId,
                                        new_password: this.modifyForm.newPass,
                                        old_password: this.modifyForm.oldPass
                                    }
                                )
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.handleClose()
                                        this.$message.success(
                                            "修改密码成功,请重新登录!"
                                        )
                                        setTimeout(() => {
                                            this.$router.push("/GetLogin")
                                        }, 1000)
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                        this.handleClose()
                                    } else {
                                        this.handleClose()
                                    }
                                })
                                .catch((err) => {
                                    this.handleClose()
                                })
                        })
                        .catch((err) => err)
                }, 300)
            })
        },
        handleClose() {
            this.$refs.modifyForm.resetFields()
            this.modifyDialog = false
        },
        getAllByOrgId() {
            this.$commonJs
                .getMethodData(this.$url.InitGetAllByOrgId, "POST", {
                    organization_id: this.form.organization_id
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.roleList = res.data.data
                        console.log(this.roleList, " this.roleList")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
                })
        },
        choiceData(type, mode) {
            this.getOrgList()
            this.userDialogVisible = true
            this.userRadio = ""
            this.checkList = {
                type: type,
                mode: mode
            }
        },
        choiceData1(row, index) {
            console.log(row, index, "index")
            this.getOrgList()
            this.userDialogVisible = true
            this.userRadio = ""
            this.roleData = row
            this.roleIndex = index
        },
        addUser1() {
            this.userDialogVisible = false
            this.roleData["user_name" + this.roleIndex] =
                this.currentSelectItem.fullname
            this.roleData["user_id" + this.roleIndex] =
                this.currentSelectItem.user_id
            console.log("this.roleData", this.roleData)
        },
        infoUser() {
            this.userDialogVisible = false
            this.userRadio = ""
        },
        choiceClick(row) {
            console.log(row)
            this.userRadio = row.id
            this.currentSelectItem = row
        },

        nextUpdate(type) {
            if (type == "用户") {
                this.$emit("userListNum", this.userList.length)
            }
            if (type == "权限") {
                let list = []

                let arr = []
                for (var key in this.roleLists) {
                    if (JSON.stringify(this.rolrRules[key]) != "{}") {
                        list.push(this.getCheck(key))
                        console.log(
                            key,
                            this.roleForm[key],
                            this.roleLists[key],
                            "pp"
                        )
                        this.roleLists[key].forEach((item, index) => {
                            console.log(index)
                            arr.push({
                                role_id: this.roleForm[key]["role_id" + index],
                                user_id: this.roleForm[key]["user_id" + index]
                            })
                        })
                    }
                }

                Promise.all(list)
                    .then((res) => {
                        console.log("通过")

                        this.$commonJs
                            .getMethodFormData(this.$url.InitUserAuth, "POST", {
                                bindingStr: JSON.stringify(arr),
                                organization_id: this.form.organization_id
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    console.log(res.data.data, "res.data.data")
                                    this.form.organization_id = res.data.data
                                    this.$emit("AddUser", "true")
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                }
                                this.loading = false
                                console.log(res, "res")
                            })
                    })
                    .catch((err) => {
                        console.log("不通过")
                    })
            }
        },
        getInitStatus() {
            this.$commonJs
                .getMethodData(this.$url.GetAioStep, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        // this.initStatus = JSON.parse(
                        //     window.sessionStorage.getItem("sysList")
                        // );
                        this.aio_step = res.data.data
                        if (this.aio_step == "3") {
                            this.form.organization_id =
                                window.sessionStorage.getItem("orgId")
                            this.getAllByOrgId()
                            console.log(this.form.organization_id)
                        }
                        if (this.initStatus.ca == true) {
                            this.$UKey.getInit()
                        }
                        console.log(this.initStatus, "this.initStatus")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
                })
        },

        getOrgList() {
            this.$commonJs
                .getMethodFormData(this.$url.GetOrg, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (res.data.data == null) {
                            return
                        }
                        console.log(res.data.data, "res,data.data")
                        this.form.organization_id = res.data.data.id
                        this.getUserList(res.data.data.id)
                        window.sessionStorage.setItem("orgId", res.data.data.id)
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                })
        },
        goLogin() {
            this.$commonJs
                .getMethodData(this.$url.InitFinish, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.getInitStatus()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        handleSelectionChange(val) {
            console.log(val, "val")
        },
        getRadio(row) {
            this.userRadio = row.KeyIndex
        },
        getCheck(formName) {
            return new Promise((resolve, reject) => {
                this.$refs[formName][0].validate((valid) => {
                    if (!valid) {
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        },
        cancel() {
            this.isInsert = false
            this.$refs.form.resetFields()
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getOrgList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.pageNow = newPage
            this.getOrgList()
        },
        // 查询列表
        getUserList(num) {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.InitGetById, "POST", {
                    organization_id: num
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.userList = res.data.data
                        // this.total = res.data.page.totalRows;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                    console.log(res, "res")
                })
        },
        bindUkey(type) {
            let that = this
            that.checkType = type
            that.doEnumCon()
        },
        // 删除
        handleDelete(row) {
            console.log(row, "row")
            this.$confirm("是否永久删除此用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.InitDelOne, "POST", {
                            user_id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!")
                                this.getOrgList()
                                console.log(res, "res")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    })
                })
        },
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
                    that.$nextTick(() => {
                        that.form.id_cert_subject = ""
                        $("#IdCert").val("")
                    })

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
            // JKunitrust.SOF_GetUserList(function (data) {
            //     if (data.ret != 0) {
            //         alert("枚举容器失败: " + data.msg)
            //         return
            //     }
            //     that.id_con_count = data.param.count
            //     console.log(data.param.certlist, "data.param.certlist")
            //     that.id_con_select = data.param.certlist
            //     that.doExportSignCert()
            // })
            try {
              usbKey.Lookup(res => {
                console.log(res.data)
                if(res.data){
                  that.id_con_count = res.data.length;
                  usbKey.FindCertificates(res => {
                    if(res.success){
                      let certOptions = [];
                      console.log(res.data)
                      let subjects = res.data;
                      if (subjects.length === 0){
                      }else {
                        let filter = subjects[0].split("/");
                        let key = "";
                        for(let j=0; j<filter.length; j++)
                        {
                          let val = filter[j].split("=");
                          if(val[0]=='CN')
                          {
                            key = val[1];
                            break;
                          }
                        }
                      }
                      for (let i=0;i<subjects.length;i++) {
                        if(i == 1)
                          return;
                        let filter = subjects[i].split("/");
                        let key = "";
                        for(let j=0; j<filter.length; j++)
                        {
                          let val = filter[j].split("=");
                          if(val[0]=='CN')
                          {
                            key = val[1];
                            break;
                          }
                        }
                        let subject = subjects[i].replaceAll("/",",");
                        certOptions.push({
                          label: subject,
                          value: key
                        })
                        that.id_con_select.push(certOptions);
                        usbKey.SelectCertificate(res => {
                          console.log(res)
                          if(res.success){
                            let hCert = res.data;
                            usbKey.GetCertInfo( res=>{
                              console.log(res);

                              $("#IdCert").val(res.data.subject)
                              that.form.id_cert_subject = res.data.subject
                              that.form.id_cert_serial = res.data.serialNumber

                            },hCert,true)
                            usbKey.ExportCertificate( res => {
                              if(res.success){
                                console.log(res);
                                console.log("cccc")
                                that.g_cert = res.data;
                                that.form.certStr = res.data;
                              }else {
                                usbKey.FreeCertificate( res => {
                                },hCert);
                              }
                            },hCert,true)
                          }
                        },window.btoa(key))
                        //that.g_cert = data.param.cert
                      }
                    }else if (res.code === 'ERR_NETWORK'){
                      that.$message.error("证书插件没有启动.")
                    }else {
                      //proxy.$modal.msgError("枚举证书异常:" + res.message);
                      that.$message.error("枚举证书异常.")
                    }
                  })
                }

              })
            }catch (e){
              console.log(e)
            }
        },

        reflushCertMsg(data) {
            console.log(data)
            let that = this
            if (data.ret != 0) {
                alert("获取证书信息失败: " + data.msg)
            } else {
                // that.form.id_cert_subject = "563";
                $("#IdCert").val(data.param.subject)
                that.form.id_cert_subject = data.param.subject
                that.form.id_cert_serial = data.param.serial
                that.id_cert_date = data.param.date.split("~")[1]
            }

            that.count()
            console.log(that.id_cert_date, "that.id_cert_date")
        },
        count() {
            let that = this

            this.$commonJs
                .getCheckNotAfter({
                    certDate: that.id_cert_date
                })
                .then((res) => {
                    console.log(res, "有效期")
                    if (res.data.data == false) {
                        console.log("证书可以正常使用")
                    } else {
                        that.$message.error("证书已过有效期!")
                        that.form.id_cert_subject = ""
                        return false
                    }
                })
        },

        doExportSignCert() {
            let that = this

            var conname = that.id_con_select[0]
            if (conname == null || conname == "") {
                that.$message.error("请先正确插入设备!")
                return
            }

            JKunitrust.SOF_ExportUserCert(conname, function (data) {
                if (data.ret != 0) {
                    alert("导出用户签名证书失败: " + data.msg)
                    return
                }
                // $("#id_cert_type").text("签名证书");
                that.g_cert = data.param.cert
                that.form.certStr = data.param.cert
                JKunitrust.SOF_GetCertInfo(that.g_cert, that.reflushCertMsg)
            })
        },

        getCheckData() {
            let data = {},
                that = this
            if (this.checkType == "1") {
                data = {
                    cert_sn: that.id_cert_serial1,
                    card_no: that.form.card_no,
                    username: that.form.username,
                    tel: that.form.tel
                }
            }
            this.$commonJs
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
                        )
                        window.sessionStorage.setItem("g_cert1", that.g_cert)
                        that.$message.success("绑定成功!")
                    } else if (res.data.code != 800000) {
                        that.$message.error(res.data.msg)
                    }
                })
        },
        handleClick(tab, event) {}
    }
}
</script>
<style lang="less" scoped>
.fontStyle {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 600;
}
.inpuStyle {
    width: 50%;
    // margin-left: 10px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
/deep/.el-table__row .cell {
    line-height: 50px;
}
/deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
}
.el-divider--horizontal {
    margin: 10px 0 !important;
}
.el-result {
    padding: 20px 30px !important;
}
.tableHeight {
    max-height: 700px;
    overflow: hidden;
    overflow-y: auto;
}
</style>
