<template>
  <div style="overflow-y: hidden;">
    <div id="avatarDiv" class="avatar_box avatar_box1"
         :style="{ '--background1': banner1, '--background2': banner2, '--backgroundSize1': logoStyle.backgroundSize1, '--backgroundSize2': logoStyle.backgroundSize2, '--backgroundSize3': logoStyle.backgroundSize3, '--marginLeft': logoStyle.marginLeft, '--marginTop': logoStyle.marginTop, '--width': logoStyle.width }">
    </div>

    <div class="login_container" :style="{ '--bgImage1': bgImage1, '--bgImage2': bgImage2 }">

      <div class="bigImage">

      </div>
      <div class="login_box" :style="{ '--justifyContent': justifyContent, '--paddingRight': paddingRight }">
        <!-- 头像区域 -->
        <div style="padding-top: 10px;" class="loginDiv">
          <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsHeader">
            <el-tab-pane label="证书登录" name="two"></el-tab-pane>
            <el-tab-pane label="账号登录" name="first" v-if="isShow == 0"></el-tab-pane>
          </el-tabs>
          <!-- 登录表单区域 -->
          <el-form v-loading="loading" ref="loginFormRef" :rules="loginFormRules" :model="loginForm"
                   label-width="0px" class="login_form" style="width: 85%;">
            <!-- 用户名 -->
            <div id="MiMa" style="margin-bottom: 7%;" v-if="isAdmin == false">
              <div> {{ MIMaData }}</div>
              <div>{{ MiMaVal }}</div>
            </div>
            <el-form-item prop="userName" v-if="isAdmin == true">
              <el-input style="40px !important" v-model="loginForm.userName" prefix-icon="el-icon-user"
                        maxlength="20" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" prefix-icon="el-icon-lock"
                        :type="flag1 ? 'password' : 'text'" :placeholder="placeholder"
                        @keyup.enter.native="islogin">
              </el-input>
            </el-form-item>
            <el-form-item prop="password" v-if="activeName == 'two'">
              <el-input v-model="password1" prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'"
                        placeholder="请输入密码" @keyup.enter.native="islogin">
              </el-input>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item prop="loginCode" class="codeStyle" style="" v-if="isAdmin == true">
              <el-input v-model="loginForm.loginCode" style="" prefix-icon="icon-CAS iconfont" maxlength="5"
                        type="text" placeholder="请输入验证码" @keyup.enter.native="login">
              </el-input>
            </el-form-item>
            <el-form-item class="codeImg" style="" v-if="isAdmin == true">
              <div @click="changeCode">
                <img :src="imgUrl" style="border-radius:0" />
              </div>

            </el-form-item>
            <!-- 按钮区域 -->
            <el-button id="btn" type="primary" v-preventReClick @click="login" :disabled="isHaveDate"
                       style="background-color: dodgerblue;">登录</el-button>

          </el-form>
        </div>
      </div>
    </div>
    <div class="copyrightStyle" style="">{{ titleBottom }}</div>
  </div>
</template>
<script src="../../assets/js/jquery1.min.js"></script>
<script type="text/javascript">
import md5 from "js-md5" //md5加密
import Fingerprint2 from "fingerprintjs2" //浏览器指纹获取
import preventReClick from "../Home/preventReClick" //防多次点击，重复提交
import $ from "jquery"
import { JKunitrust } from "../../assets/js/JKunitrust.js"
import url from "../../config/url"
import { usbKey} from "@/ubsControl/usbKey";

export default {
  inject: ["reload"],
  data() {
    return {
      //http://10.10.11.27:8000/stage-api/system/direct/resource/getByCodeIO?page=GetLogin&code=3
      banner1: "",
      banner2: "",
      bgImage1: "",
      bgImage2: "",
      imageUrl1:
        this.$url.ImageURL +
        "system/direct/resource/getByCodeIO?page=GetLogin&code=3",
      imageUrl2:
        this.$url.ImageURL +
        "system/direct/resource/getByCodeIO?page=GetLogin&code=4",
      imageUrl3:
        this.$url.ImageURL +
        "system/direct/resource/getByCodeIO?page=GetLogin&code=9",
      imageUrl4:
        this.$url.ImageURL +
        "system/direct/resource/getByCodeIO?page=GetLogin&code=10",
      password1: "",
      isHaveDate: false,
      placeholder: "请输入PIN口令",
      radio: "",
      activeName: "two",
      isAdmin: false,
      imgUrl: "", // 验证码图片地址
      codeId: "", // 验证码id
      // 登录表单的数据绑定对象
      loginForm: {
        userName: "", // 登录用户名
        password: "", // 登录密码
        loginCode: "" // 验证码
      },
      dialogVisible: false,
      flag1: true, //登陆密码是否显示（true为不显示，false为显示）
      loading: false, //是否加载loading动画（true为加载，false为不加载）
      rolesList: [],
      // 登陆表单的验证规则对象
      loginFormRules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入PIN口令",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ]
      },
      haveDate: "",
      item: "",
      id_con_count: "", // 应用数量
      id_con_select: [], // 应用列表
      id_cert_serial: "", // 序列号
      id_cert_date: "", // 有效期
      g_cert: "", // 签名证书信息
      MiMaVal: "请插入设备", // 设备信息
      MIMaData: "",
      num: 1, // 防抖
      id_p1_inData: "",//原文
      id_p1_signdata: "", // 签名值
      titleHead: "",
      titleBottom: "",
      htmString1: "",
      htmString2: "",
      mainTitleStyle: {
        paddingTopTitle: "",
        marginTopTitle: "",
        marginLeftTitle: "",
        fontSizeTitle: "",
        fontWeightTitle: ""
      },
      subTitleStyle: {
        paddingTopSub: "",
        marginTopSub: "",
        marginLeftSub: "",
        fontSizeSub: "",
        fontWeightSub: ""
      },
      logoStyle: {
        backgroundSize1: "",
        backgroundSize2: "",
        backgroundSize3: "",
        marginLeft: "",
        marginTop: "",
        width: ""
      },
      justifyContent: "",
      paddingRight: "",
      sysList: {},
      isShow: ""
    }
  },
  created() {
    // this.$router.push("/InitOneList");
    this.changeCode()
    // this.getInitStatus();
    // doInit();
    this.getAioServiceExist()

    this.getResourceDetail("1")
    this.getResourceDetail("2")
    this.getResourceDetail("7")
    this.getResourceDetail("8")
    this.getResourceDetail("5")
    this.getResourceDetail("6")
    this.getResourceDetail("11")
    this.getResourceDetail("12")
    this.getResourceDetail("13")
    if (this.imageUrl1.startsWith("http://")) {
      this.banner1 = 'url("' + this.imageUrl1 + '")'
      this.banner2 = 'url("' + this.imageUrl2 + '")'
      this.bgImage1 = 'url("' + this.imageUrl3 + '")'
      this.bgImage2 = 'url("' + this.imageUrl4 + '")'
    } else {
      this.banner1 = 'url("../' + this.imageUrl1 + '")'
      this.banner2 = 'url("../' + this.imageUrl2 + '")'
      this.bgImage1 = 'url("../' + this.imageUrl3 + '")'
      this.bgImage2 = 'url("../' + this.imageUrl4 + '")'
    }

    // this.htmString =
    //     "<div class='avatar_Font' v-if='sysList.svs == true'> SGSign 签名验签服务器 </div><div class='avatar_Font' v-if='sysList.hsm == true'> SGCM 服务器密码机 </div>"
  },
  watch: {
    isAdmin(val) {
      console.log(val, "val")
      if (val == false) {
        this.loginFormRules.password = [
          {
            required: true,
            message: "请输入PIN口令",
            trigger: "blur"
          }
        ]
      } else {
        this.loginFormRules.password = [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    },
    MiMaVal(val) {
      if (val == "设备已插入") {
        this.doEnumCon()
      }
      if (val == "设备已拔出") {
        this.MiMaVal = "设备已拔出"
      }
    }
  },
  mounted() {
    this.rolesList = JSON.parse(window.sessionStorage.getItem("roles"))
    this.getInit()
  },
  beforeUpdate() {
    this.sysList = JSON.parse(window.sessionStorage.getItem("sysList"))
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
          } else if (res.data.code != 800000) {
            this.$commonJs.getCloseLoading()
            this.$message.error(res.data.msg)
          } else {
            this.$commonJs.getCloseLoading()
          }
        })
    },
    // 获取详情
    getResourceDetail(code) {
      this.loading = true
      let url = this.$url.ResourceGetByCode
      this.$commonJs
        .getMethodData(url, "POST", {
          page: "GetLogin",
          code: code
        })
        .then((res) => {
          if (res.data.code == 100000) {
            console.log(res, "res")
            if (code == "1") {
              this.titleHead = res.data.data.content
            } else if (code == "2") {
              this.titleBottom = res.data.data.content
            } else if (code == "5") {
              this.htmString1 = res.data.data.style
            } else if (code == "6") {
              this.htmString2 = res.data.data.style
            } else if (code == "7") {
              var content = res.data.data.content
              var arr = content.split(",")
              this.mainTitleStyle.paddingTopTitle = arr[0]
              this.mainTitleStyle.marginTopTitle = arr[1]
              this.mainTitleStyle.marginLeftTitle = arr[2]
              this.mainTitleStyle.fontSizeTitle = arr[3]
              this.mainTitleStyle.fontWeightTitle = arr[4]
            } else if (code == "8") {
              var content = res.data.data.content
              var arr = content.split(",")
              this.subTitleStyle.paddingTopSub = arr[0]
              this.subTitleStyle.marginTopSub = arr[1]
              this.subTitleStyle.marginLeftSub = arr[2]
              this.subTitleStyle.fontSizeSub = arr[3]
              this.subTitleStyle.fontWeightSub = arr[4]
            } else if (code == "11") {
              var content = res.data.data.content
              var arr = content.split(",")
              this.justifyContent = arr[0]
              this.paddingRight = arr[1]
            } else if (code == "12") {
              var content = res.data.data.content
              var arr = content.split(",")
              this.logoStyle.backgroundSize1 = arr[0]
              this.logoStyle.backgroundSize2 = arr[1]
              this.logoStyle.backgroundSize3 = arr[2]
              this.logoStyle.marginLeft = arr[3]
              this.logoStyle.marginTop = arr[4]
              this.logoStyle.width = arr[5]
              if (this.logoStyle.backgroundSize3 == "none") {
                document
                  .getElementById("avatarDiv")
                  .classList.remove("avatar_box1")
              }
            } else {
              console.log(res.data.data.content + "---------")
              this.isShow = res.data.data.content
            }
          }
          this.loading = false
        })
    },
    listHotPlug(data) {
      let that = this
      console.log(data, "data")
      if (data.ret != 0) {
        return data
      }
      if (data.param.type == 1) {
        // that.$message.success("设备插入");
        that.MiMaVal = "设备已插入"
      } else if (data.param.type == 2) {
        // that.$message.success("设备拔出");
        that.MiMaVal = "设备已拔出"
      }
    },
    onSuccess() {
      let that = this
      JKunitrust.listenHotplug(that.listHotPlug)
      JKunitrust.SOF_GetVersion(function (data) {
        if (data.ret != 0) {
          that.$message.error("获取版本号失败: " + data.msg)
        } else {
          // this.MiMaVal = "插件控件版本号:" + data.param.version;
          that.doEnumCon()
        }
      })
    },
    islogin() {
      if (this.isAdmin == false) {
        this.login()
      } else {
        return false
      }
    },
    // 初始化
    getInit() {
      // debugger;
      let that = this
      // JKunitrust.oninit(
      //   that.onSuccess,
      //   function (msg, evt) {
      //     // that.$message.error("初始化失败:" + msg);
      //     console.log(evt)
      //     that.doEnumCon()
      //   },
      //   function () {
      //     that.$message.success("连接断开")
      //   }
      // )
      that.getUsbKeyCerts();
    },
    //枚举证书
    getUsbKeyCerts(){
      let that = this
      try {
        usbKey.Lookup(res => {
          console.log(res.data)
          console.log("===============" + res.data.length)
          if(res.data){
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
                        that.id_cert_serial = res.data.serialNumber;
                      },hCert,true)
                      usbKey.ExportCertificate( res => {
                        if(res.success){
                          console.log(res);
                          console.log("cccc")
                          that.g_cert = res.data;
                          that.MiMaVal = "设备已插入"
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
    // 枚举设备
    doEnumCon() {
      // debugger;
      let that = this
      JKunitrust.SOF_GetUserList(function (data) {
        if (data.ret != 0) {
          that.$message.error("枚举容器失败: " + data.msg)
          return
        }
        that.id_con_count = data.param.count
        that.id_con_select = []
        for (var i = 0; i < data.param.certlist.length; i++) {
          that.id_con_select.push(data.param.certlist[i])
        }
        console.log(
          that.id_con_count,
          that.id_con_select,
          "that.id_con_select"
        )
        if (that.id_con_select.length != 0) {
          that.doExportSignCert()
        }
      })
    },
    // 验证PIN口令
    doVerifyPIN() {
      let that = this
      var appath = this.id_con_select
      if (appath == null || appath == "") {
        that.$message.error("请先插入设备")
        return
      }

      var pin = $("#id_input_pin").val()
      JKunitrust.SOF_Login(appath, pin, function (data) {
        if (data.ret != 0) {
          that.$message.error("验证口令失败: " + data.msg)
          return
        }
        that.$message.success("验证口令成功")
      })
    },
    // 签名
    doP1SignDataLiuzx() {
      let that = this
      var conname1 = that.id_con_select
      if (conname1 == null || conname1 == "") {
        that.$message.error("请先正确插入设备!")
        return
      }

      var pin = that.loginForm.password
      if (pin == null || pin == "") {
        that.$message.error("请输入PIN码")
        return
      }
      // 原文
      that.id_p1_inData = this.random32Bytes();
      // JKunitrust.SOF_SignData(conname1[0], indata, pin, function (data) {
      //   if (data.ret != 0) {
      //     that.$message.error("执行失败: " + data.msg)
      //     return
      //   }
      //   that.id_p1_signdata = data.param.signature
      //   console.log(
      //     that.id_p1_signdata,
      //     that.id_cert_serial,
      //     "data.param.signature"
      //   )
      //   that.getCertSnLoginc()
      // })

      try {
        usbKey.Lookup(res => {
          console.log(res.data)
          console.log("===============" + res.data.length)
          if(res.data){
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
                for (let i =0;i<subjects.length;i++) {
                  console.log("i = ",i)
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
                      usbKey.CheckPIN( res=>{
                        if(res.success){
                          console.log(that.id_p1_inData,"inData");
                          usbKey.Digest( res => {
                            if(res.success){
                              console.log(res.data,"digest")
                              let digest = res.data;
                              usbKey.SignData( res => {
                                if(res.success){
                                  that.id_p1_signdata = res.data;
                                  console.log(
                                    that.id_p1_signdata,
                                    that.id_cert_serial,
                                    "data.param.signature"
                                  )
                                  that.getCertSnLoginc()
                                }else {
                                  usbKey.FreeCertificate( res =>{

                                  },hCert);
                                }
                              },hCert,window.btoa(that.id_p1_inData),3);
                            }else {
                              usbKey.FreeCertificate( res => {
                              },hCert);
                            }
                          },hCert,window.btoa(that.id_p1_inData),3)
                        }else {
                          that.$message.error("PIN码不正确.")
                          usbKey.FreeCertificate( res => {
                          },hCert);
                        }
                      },hCert,pin)

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
    // 签名
    doP1SignData() {
      let that = this
      var conname1 = that.id_con_select
      if (conname1 == null || conname1 == "") {
        that.$message.error("请先正确插入设备!")
        return
      }

      var pin = that.loginForm.password
      if (pin == null || pin == "") {
        that.$message.error("请输入PIN码")
        return
      }
      // 原文
      var indata = "12345678123456781234567812345678"
      that.id_p1_inData = this.random32Bytes();
      JKunitrust.SOF_SignData(conname1[0], indata, pin, function (data) {
        if (data.ret != 0) {
          that.$message.error("执行失败: " + data.msg)
          return
        }
        that.id_p1_signdata = data.param.signature
        console.log(
          that.id_p1_signdata,
          that.id_cert_serial,
          "data.param.signature"
        )

        that.getCertSnLoginc()
      })
    },
    getCertSnLoginc() {
      this.$commonJs
        .getMethodData(this.$url.GetCertSnLoginc, "POST", {
          // uiUserCart - UK证书
          uiUserCart: this.g_cert,
          uiUserData: this.id_p1_inData,
          // uiUserSign *即时签名值
          uiUserSign: this.id_p1_signdata,
          password: this.password1
        })
        .then((res) => {
          console.log(res.data.data, "data")
          if (res.data.code == 100000) {
            // window.sessionStorage.setItem("g_cert", this.g_cert);
            window.sessionStorage.setItem(
              "Authorization",
              res.data.data.access_token
            )
            window.sessionStorage.setItem(
              "roles",
              JSON.stringify(res.data.attrs.roles)
            )
            window.sessionStorage.setItem(
              "userList",
              JSON.stringify(res.data.attrs.user)
            )
            window.sessionStorage.setItem(
              "activePath",
              "GetStatistics"
            )
            window.sessionStorage.setItem("isHomepPage", true)

            if (
              (res.data.attrs.roles.length == 1 &&
                res.data.attrs.roles[0].system_type != "00") ||
              (res.data.attrs.roles.length == 1 &&
                res.data.attrs.roles[0].system_type == "00")
            ) {
              this.$router.push("/GetStatistics")
              // this.$message.success("登录成功");
            } else {
              this.$router.push("/GetTypeLogin")
            }
          } else if (res.data.code != 800000) {
            this.$message.error(res.data.msg)
          }
        })
    },
    // 导出签名证书
    doExportSignCert() {
      // debugger;
      let that = this
      var conname = that.id_con_select
      if (conname == null || conname == "") {
        that.$message.error("请先正确插入设备!")
        return
      }
      console.log(conname, "conname")
      JKunitrust.SOF_ExportUserCert(conname[0], function (data) {
        if (data.ret != 0) {
          // that.$message.error("导出用户签名证书失败: " + data.msg);
          // that.$message.error("请先正确插入设备!");
          return
        }
        // debugger;
        that.g_cert = data.param.cert
        JKunitrust.SOF_GetCertInfo(that.g_cert, that.reflushCertMsg)
        console.log(data, data.param, "this.id_con_select")
        // window.sessionStorage.setItem("g_cert", that.g_cert);
      })
    },
    reflushCertMsg(data) {
      console.log(data, "www")
      let that = this
      if (data.ret != 0) {
        that.$message.error("获取证书信息失败: " + data.msg)
      } else {
        that.id_cert_serial = data.param.serial
        that.id_cert_date = data.param.date.split("~")[1]
        if (that.num > 1) {
          that.num = 1
          return false
        }
        that.count()
        that.num++
        console.log(
          that.id_cert_serial,
          that.id_cert_date,
          "that.id_cert_date"
        )
        if (that.id_cert_serial != "") {
          that.MiMaVal = "设备已插入"
        }
      }
    },

    count() {
      let that = this
      // let date = that.$commonJs.dateTimeFormatter(new Date());
      // console.log(date, "有效期", that.id_cert_date);
      this.$commonJs
        .getCheckNotAfter({
          certDate: that.id_cert_date
        })
        .then((res) => {
          console.log(res, "有效期")
          if (res.data.data == false) {
            that.isHaveDate = false
            that.haveDate = ""
          } else {
            that.$message.error("证书已过有效期!")
            that.isHaveDate = true
            that.haveDate = "1"
          }
        })
        .catch((err) => err)
      // if (that.id_cert_date >= date) {
      //     that.$message.error("证书已过有效期!");
      //     that.isHaveDate = true;
      //     that.haveDate = "1";
      // } else {
      //     that.isHaveDate = false;
      //     that.haveDate = "";
      // }
    },

    // 登录
    login() {
      console.log($(".login_form").text())

      if (this.placeholder == "请输入PIN口令") {
        //this.doP1SignData()
        this.doP1SignDataLiuzx()
        return false
      }

      this.loading = true
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        let userList = {
          username: this.loginForm.userName,
          password: this.loginForm.password
        }
        this.$commonJs
          .getMethodData(
            this.$url.GetLogin +
            "?" +
            "captcha_code=" +
            this.loginForm.loginCode +
            "&captcha_uuid=" +
            this.codeId,
            "POST",
            userList
          )
          .then((res) => {
            console.log(res, "data")
            let userList = res.data.attrs.user
            if (res.data.code == 100000) {
              // this.$message.success("登录成功");
              window.sessionStorage.setItem(
                "Authorization",
                res.data.data.access_token
              )
              window.sessionStorage.setItem(
                "roles",
                JSON.stringify(res.data.attrs.roles)
              )
              window.sessionStorage.setItem(
                "userList",
                JSON.stringify(res.data.attrs.user)
              )

              window.sessionStorage.setItem("isHomepPage", true)
              // debugger;

              if (
                res.data.attrs.roles.length == 1 ||
                (res.data.attrs.roles.length == 1 &&
                  res.data.attrs.roles[0].system_type == "00")
              ) {
                // this.$commonJs.getInitStatus().then((res) => {
                if (
                  // res.data.data == true ||
                  // (res.data.data == false &&
                  this.$commonJs.getStorage().routeType !=
                  "10"
                ) {
                  if (userList.status == "10") {
                    this.$router.push("/FirstLogin")
                  } else {
                    if (
                      res.data.attrs.roles[0]
                        .system_type == "30"
                    ) {
                      this.$router.push("/GetStatistics")
                      window.sessionStorage.setItem(
                        "activePath",
                        "GetStatistics"
                      )
                    } else {
                      this.$router.push("/GetStatistics")
                      window.sessionStorage.setItem(
                        "activePath",
                        "GetStatistics"
                      )
                    }
                    //
                  }
                } else if (
                  // res.data.data == false &&
                  this.$commonJs.getStorage().routeType ==
                  "10"
                ) {
                  // this.$router.push("/initInstallList");
                  // window.sessionStorage.setItem(
                  //     "activePath",
                  //     "/initInstallList"
                  // );
                  this.$router.push("/GetStatistics")
                  window.sessionStorage.setItem(
                    "activePath",
                    "GetStatistics"
                  )
                }
                console.log(res.data.data, "res")
                // });
                // this.$message.success("登录成功");
              } else {
                if (userList.status == "10") {
                  this.$router.push("/FirstLogin")
                } else {
                  this.$router.push("/GetTypeLogin")
                  // this.$router.push("/AuthorizedCAList");
                }
              }
              this.loading = false
            } else if (res.data.code != 800000) {
              this.$message.error(res.data.msg)
              this.changeCode()
              this.loading = false
            } else {
              this.$message.error(res.data.msg)
              this.changeCode()
              this.loading = false
            }
          })
      })
    },
    handleClick(tab, event) {
      console.log(tab.label, 11, event)
      this.isAdmin = !this.isAdmin

      this.$refs.loginFormRef.resetFields()
      if (tab.label == "证书登录") {
        this.isAdmin = false
        this.placeholder = "请输入PIN口令"

        if (this.haveDate == "1") {
          this.isHaveDate = true
        }
      } else {
        this.isHaveDate = false
        this.isAdmin = true
        this.placeholder = "请输入密码"
      }
    },
    // switchingMode() {
    //     this.isAdmin = !this.isAdmin;
    //     this.$refs.loginFormRef.resetFields();
    //     if (this.isAdmin == false) {
    //         this.$message.success("目前为证书登录方式!");
    //         this.placeholder = "请上传证书";
    //         this.loginFormRules.userName.message = "请上传证书";
    //     } else {
    //         this.$message.success("目前为用户名登录方式!");
    //         this.placeholder = "请输入用户名";
    //         this.loginFormRules.userName.message = "请输入用户名";
    //     }
    //     // this.dialogVisible = true;
    // },
    // 刷新验证码（登陆）
    changeCode() {
      this.$http.get(this.$url.GetImageCode).then((res) => {
        console.log(res, res)
        this.codeId = res.data.attrs.captcha_uuid
        this.imgUrl = "data: image/png;base64," + res.data.attrs.img
      })
    },
    random32Bytes () {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
  }
}
</script>
<style lang="less">
.avatar_Font {
  // margin-top: 5px;
  // margin-left: 80px;
  // font-size: 35px;
  // font-weight: 600;
  padding-top: var(--paddingTopTitle);
  margin-top: var(--marginTopTitle);
  margin-left: var(--marginLeftTitle);
  font-size: var(--fontSizeTitle);
  font-weight: var(--fontWeightTitle);
}

.avatar_Font1 {
  // margin-top: 10px;
  // margin-left: 80px;
  // font-size: 15px;
  // font-weight: 500;
  padding-top: var(--paddingTopSub);
  margin-top: var(--marginTopSub);
  margin-left: var(--marginLeftSub);
  font-size: var(--fontSizeSub);
  font-weight: var(--fontWeightSub);
}
</style>
<style lang="less" scoped>
.login_container {
  width: 98%;
  height: 600px;
  padding: 1% 1%;
  margin-top: 50px;

  display: flex;
  justify-content: center;
}

.bigImage {
  width: 40%;
  margin-top: 30px;
  background-size: contain;
}

.loginDiv {
  background-color: aliceblue;
  border-radius: 5px;
  height: 400px;
  margin-top: 30px;
}

#btn {
  width: 100%;
  margin-left: 3px;
  margin-top: 5%;
}

.avatar_box {
  width: 288px;
  height: 95px;
}

img {
  width: 100%;
  height: 40px;
  background-color: #eee;
}

.copyrightStyle {
  font-size: 20px;
  margin-top: 50px;
  text-align: center;
  font-weight: 700;
}

.tabsHeader {
  margin-left: 20px;
}

/*去下划线 */
::v-deep .el-tabs__nav-wrap::after {
  position: static !important;
}

/* 下划线颜色 */
::v-deep .el-tabs__active-bar {
  background-color: rgb(0, 102, 255);
}

.loginDiv /deep/ .el-input__inner {
  background-color: transparent;
  border-radius: 0px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  /*outline: medium;*/
}

.loginDiv /deep/ .el-input__inner::placeholder {
  color: rgba(105, 103, 103, 0.932);
}

.login_box {
  width: 45%;
  display: flex;
  // justify-content: flex-end;
  // padding-right: 15%;
  justify-content: var(--justifyContent);
  // align-items: center;
  padding-right: var(--paddingRight);
}

.codeStyle {
  float: left;
  width: 59%;
  margin-bottom: 10px;
}

.codeImg {
  float: right;
  margin-bottom: 10px;
}

@media screen and (min-width: 1600px) {
  .login_container {
    height: 600px;
  }

  /deep/ #tab-two,
  /deep/ #tab-first {
    font-size: 17px !important;
  }

  .WelcomeClass {
    font-size: 35px;
  }

  #MiMa {
    font-size: 17px !important;
  }

  .loginDiv {
    width: 50%;
  }

  .login_box {
    padding-top: 3%;
  }

  .copyrightStyle {
    font-size: 20px;
    margin-top: 50px;
    text-align: center;
    font-weight: 700;
  }

  .tabsHeader {
    margin-top: 10%;
  }

  .login_container {
    // background: url("../../../public/img/bg.png") no-repeat;
    background: var(--bgImage1) no-repeat;
  }

  .bigImage {
    background: url("../../../public/img/bigImg.png") no-repeat;
  }

  .avatar_box {
    // background: url("../../../public/img/shuXinLogo.png") no-repeat;
    // background: url("../../../public/img/shuXinLogo.png") no-repeat;
    //background-image: url("http://10.10.11.27:8000/stage-api/system/direct/resource/getByCodeIO?page=GetLogin&code=3");
    // background-image: url(var(--imageURL) + "system/direct/resource/getByCodeIO?page=GetLogin&code=3");
    background: var(--background1) no-repeat;
    // background-size: 12% 74%;
    // margin-left: 4%;
    // margin-top: 1%;
    // width: 500px;
    background-size: var(--backgroundSize1) var(--backgroundSize2);
    margin-left: var(--marginLeft);
    margin-top: var(--marginTop);
    width: var(--width);
  }

  .avatar_box1 {
    background-size: var(--backgroundSize3);
  }
}

@media screen and (max-width: 1600px) {
  .login_container {
    height: 600px;
  }

  /deep/ #tab-two,
  /deep/ #tab-first {
    font-size: 15px !important;
  }

  .WelcomeClass {
    font-size: 30px;
  }

  #MiMa {
    font-size: 15px !important;
  }

  .loginDiv {
    width: 55%;
  }

  .copyrightStyle {
    font-size: 20px;
    margin-top: 50px;
    text-align: center;
    font-weight: 700
  }

  .tabsHeader {
    margin-top: 5%;
  }

  .login_container {
    // background: url("../../../public/img/bg1.png") no-repeat;
    background: var(--bgImage2) no-repeat;
    background-size: cover;
  }

  .bigImage {
    background: url("../../../public/img/bigImg.png") no-repeat;
  }

  .avatar_box {
    // background: url("../../../public/img/shuXinLogo2.png") no-repeat;
    background: var(--background2) no-repeat;
    background-size: var(--backgroundSize1) var(--backgroundSize2);
    margin-left: var(--marginLeft);
    margin-top: var(--marginTop);
    width: var(--width);
  }

  .avatar_box1 {
    background-size: var(--backgroundSize3);
  }

  .codeImg {
    width: 115px;
  }
}

.login_form {
  margin-left: 5% !important;
  margin-top: 3%;
}

.btns {
  width: 100%;
  margin-top: 5%;
  display: flex;
  justify-content: center;
}

.el-card__body {
  text-align: center !important;
}

.el-col-12 {
  width: 100% !important;
}

/deep/ .el-input__icon.icon-CAS.iconfont::before {
  margin-left: 5px !important;
}

/deep/ .el-input--prefix .el-input__inner {
  // padding-left: 30px;
  height: 40px !important;
}

/deep/ .el-input__icon {
  line-height: 40px;
}

/deep/ .el-tabs__nav-wrap::after {
  width: 42%;
}
</style>
