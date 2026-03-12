import axios from "axios";
import router from "./../../router/index.js";
import { Loading } from "element-ui";
import { JKunitrust } from "./JKunitrust";
import { UBSEncrollAsync } from "../../assets/js/UBSEnrollAsync";
// axios自带的工具不需要安装npm依赖
import qs from "qs";
// 将qs挂载到全局window上
window.qs = qs;
import { Message } from "element-ui";
import url from "../../config/url.js";
import CommonJs from "./common.js";
import { data } from "jquery";
// import { reject, resolve } from "core-js/fn/promise";

var devices = "";
const Ukey = {
  // 初始化
  getInit() {
    // debugger;
    let that = this;
    JKunitrust.oninit(
      that.onSuccess,
      function(msg, evt) {
        // that.$message.error("初始化失败:" + msg);
        console.log(evt);
        return true;
      },
      function() {
        //   that.$message.success("连接断开");
        Message.success("连接断开");
      }
    );
  },

  onSuccess() {
    let that = this;
    JKunitrust.listenHotplug(function(data) {
      console.log(data, "data");
      if (data.ret != 0) {
        return data;
      }
      if (data.param.type == 1) {
        console.log("设备插入");
        Message.success("设备插入");
      } else if (data.param.type == 2) {
        console.log("设备拔出");
        Message.success("设备拔出");
      }
    });
    JKunitrust.SOF_GetVersion(function(data) {
      if (data.ret != 0) {
        Message.error("获取版本号失败: " + data.msg);
      } else {
        // this.MiMaVal = "插件控件版本号:" + data.param.version;
        // that.doEnumCon();
        console.log("枚举成功", data);
      }
    });
  },

  getUkeyData(cb) {
    JKunitrust.SOF_GetUserList(function(data) {
      if (data.ret != 0) {
        cb(false);
        return;
      }
      var id_con_count = data.param.count;
      var conname = data.param.certlist[0];
      if (conname == null || conname == "") {
        let obj = { count: 0 };
        cb(obj);
        return;
      }

      JKunitrust.SOF_ExportUserCert(conname, function(data) {
        if (data.ret != 0) {
          Message.error("导出用户签名证书失败");
          cb(false);
          return;
        }
        JKunitrust.SOF_GetCertInfo(data.param.cert, function(data) {
          if (data.ret != 0) {
            Message.error("获取证书信息失败");
            cb(false);
          } else {
            // console.log(data.param.serial, "data.param.serial");

            if (conname.split("|") != undefined) {
              data.param["conname"] = conname.split("|")[2];
            }
            data.param["count"] = id_con_count;
            cb(data.param);
          }
        });
      });
    });
  },
  getConname(cb, type) {
    // debugger;
    JKunitrust.SOF_GetUserList(function(data) {
      if (data.ret != 0) {
        cb(false);
        return;
      }
      //   debugger;
      console.log(data.param, "pppppp");
      var conname = data.param.certlist[0];
      if (conname == null || conname == "") {
        let obj = { conname: null };
        cb(obj);
        return;
      }
      if (data.param.certlist.length > 0 && type == "ukey") {
        let connameList = data.param.certlist;
        let list = connameList.map(item => {
          if (item.split("|") != undefined) {
            return item.split("|")[2];
          }
        });

        cb(list);
        return;
      }

      let obj = {
        conname: conname.split("|")[2]
      };
      cb(obj);
    });
  },
  // 导出签名证书
  GetExportSignCert(cb) {
    JKunitrust.SOF_GetUserList(function(data) {
      if (data.ret != 0) {
        cb(data.param);
        return;
      }
      console.log(data.param, "pppppp");
      if (data.param.certlist.length > 0) {
        var conname = data.param.certlist[0];
        JKunitrust.SOF_ExportUserCert(conname, function(data) {
          if (data.ret != 0) {
            cb(false);
            return;
          }
          let cert = data.param.cert;
          JKunitrust.SOF_GetCertInfo(data.param.cert, function(data) {
            if (data.ret != 0) {
              that.$message.error("获取证书信息失败: " + data.msg);
            } else {
              data.param["cert"] = cert;
              console.log(data.param, data.param.serial);
              cb(data.param);
              return;
            }
          });
        });
      } else {
        cb(data.param);
        return;
      }
    });
  },

  DeleteContainer(cb, pin, con_name) {
    this.GetDevices(res => {
      console.log(res.length);
      var device = null;
      device = res[0];
      //   debugger;
      UBSEncrollAsync.EnumApplication(res => {
        console.log(res, "EnumApplication");
        if (res.success === true) {
          console.log(res.data, "EnumApplication");
          let apps = res.data;

          if (null != apps && 0 < apps.length) {
            // ns.prompt("输入Usb Key口令，并确认:", function (v) {
            let userPIN = pin;
            UBSEncrollAsync.DeleteContainer(
              res => {
                console.log("apps[0]: " + apps[0]);
                if (res.success === true) {
                  console.log("apps[0]: " + res);
                  cb(true);
                } else {
                  Message.error("容器创建失败!");
                  cb(false);
                }
              },
              device,
              apps[0],
              con_name,
              userPIN
            );
            // });
          } else {
            Message.error("UKEY 没有初始化，请使用管理工具初始化！");
            cb(false);
          }
        } else {
          Message.error("UKEY 没有初始化，请使用管理工具初始化！");
          cb(false);
        }
      }, device);
    });
  },
  // ukey 发证
  MakeCert(subject, pin, data, url, cb) {
    let code = "";
    for (var i = 0; i < 32; i++) {
      code += parseInt(Math.random() * 10);
    }
    var con_name = code;
    con_name = con_name.toString();
    this.GetDevices(res => {
      console.log(res.length);
      var device = null;
      device = res[0];
      //   debugger;
      UBSEncrollAsync.EnumApplication(res => {
        console.log(res, "EnumApplication");
        if (res.success === true) {
          console.log(res.data, "EnumApplication");
          let apps = res.data;
          let alg = "sm2";
          let bits = 256;
          let handle;
          if (null != apps && 0 < apps.length) {
            // ns.prompt("输入Usb Key口令，并确认:", function (v) {
            let userPIN = pin;
            UBSEncrollAsync.CreateContainer(
              res => {
                console.log("CreateContainer: " + res.success);
                console.log("CreateContainer: " + res.data);
                // console.log("devices[0]: " + this.devices[0]);
                console.log("apps[0]: " + apps[0]);
                if (res.success === true) {
                  UBSEncrollAsync.OpenContainer(
                    res => {
                      console.log("OpenContainer: " + res);
                      if (res.success === true) {
                        handle = res.data;
                        UBSEncrollAsync.CheckPIN(
                          res => {
                            console.log("CheckPIN: " + res);
                            if (res.success) {
                              UBSEncrollAsync.GenerateKeyPair(
                                res => {
                                  if (res.success === true) {
                                    UBSEncrollAsync.CreatePKCS10(
                                      res => {
                                        console.log(
                                          "CreatePKCS10 message: " + res.message
                                        );
                                        if (res.success === true) {
                                          let pkcs10 = res.data;
                                          data["csrString"] = pkcs10;
                                          // let obj = {
                                          //     csrString: pkcs10,
                                          //     data
                                          // }

                                          // const newObj = Object.assign(obj1, obj2);
                                          CommonJs.getMethodData(
                                            url,
                                            "POST",
                                            data
                                          ).then(res => {
                                            if (res.data.code == 100000) {
                                              var cert = res.data.data.certSig;
                                              var enc_cert =
                                                res.data.data.certEnc;
                                              var enc_key =
                                                res.data.data.privateKeyEnc;
                                              var enc_symm_key = null;

                                              console.log(
                                                "ImportCertificate cert:" +
                                                  res.data.data
                                              );
                                              console.log(
                                                "ImportCertificate enc_cert:" +
                                                  res.data.data.enc_cert
                                              );
                                              console.log(
                                                "ImportKeyPair enc_key:" +
                                                  res.data.data.enc_key
                                              );
                                              UBSEncrollAsync.ImportCertificate(
                                                res => {
                                                  if (res.success) {
                                                    console.log("成功", res);

                                                    //安装加密证书
                                                    if (
                                                      enc_cert != null &&
                                                      enc_cert != "" &&
                                                      enc_cert != undefined
                                                    ) {
                                                      UBSEncrollAsync.ImportCertificate(
                                                        res => {
                                                          if (res.success) {
                                                            UBSEncrollAsync.ImportKeyPair(
                                                              res => {
                                                                if (
                                                                  res.success
                                                                ) {
                                                                  cb(true);
                                                                  Message.success(
                                                                    "签发证书成功!"
                                                                  );
                                                                  UBSEncrollAsync.FreeCertificate(
                                                                    res => {},
                                                                    handle
                                                                  );
                                                                } else {
                                                                  Message.error(
                                                                    "签发证书失败!"
                                                                  );
                                                                  UBSEncrollAsync.FreeCertificate(
                                                                    res => {},
                                                                    handle
                                                                  );
                                                                  cb(false);
                                                                }
                                                              },
                                                              handle,
                                                              enc_key,
                                                              enc_symm_key,
                                                              alg
                                                            );
                                                          } else {
                                                            Message.error(
                                                              "签发证书失败!"
                                                            );
                                                            UBSEncrollAsync.FreeCertificate(
                                                              res => {},
                                                              handle
                                                            );
                                                            cb(false);
                                                          }
                                                        },
                                                        handle,
                                                        enc_cert,
                                                        false
                                                      );
                                                    } else {
                                                      Message.success(
                                                        "签发证书失败!"
                                                      );
                                                      UBSEncrollAsync.FreeCertificate(
                                                        res => {},
                                                        handle
                                                      );
                                                      cb(false);
                                                    }
                                                  } else {
                                                    Message.error(
                                                      "签发证书失败!"
                                                    );
                                                    UBSEncrollAsync.FreeCertificate(
                                                      res => {},
                                                      handle
                                                    );
                                                    cb(false);
                                                  }
                                                },
                                                handle,
                                                cert,
                                                true
                                              );
                                            } else if (
                                              res.data.code != 800000
                                            ) {
                                              Message.error(res.data.msg);
                                              UBSEncrollAsync.FreeCertificate(
                                                res => {},
                                                handle
                                              );
                                              cb(false);
                                            }
                                          });
                                        } else {
                                          Message.error(
                                            "Usb Key产生PKCS10证书请求失败!"
                                          );
                                          UBSEncrollAsync.FreeCertificate(
                                            res => {},
                                            handle
                                          );
                                          cb(false);
                                        }
                                      },
                                      handle,
                                      subject,
                                      alg,
                                      bits
                                    );
                                  } else {
                                    Message.error("Usb Key产生签名密钥对失败!");
                                    UBSEncrollAsync.FreeCertificate(res => {},
                                    handle);
                                    cb(false);
                                  }
                                },
                                handle,
                                true
                              );
                            } else {
                              Message.error("Usb Key口令验证失败!");
                              UBSEncrollAsync.FreeCertificate(res => {},
                              handle);
                              cb(false);
                            }
                          },
                          handle,
                          userPIN
                        );
                      } else {
                        Message.error("Usb Key打开密钥容器失败!");
                        UBSEncrollAsync.FreeCertificate(res => {}, handle);
                        cb(false);
                      }
                    },
                    device,
                    apps[0],
                    con_name
                  );
                } else {
                  Message.error("容器创建失败!");
                  cb(false);
                }
              },
              device,
              apps[0],
              con_name,
              userPIN
            );
            // });
          } else {
            Message.error("UKEY 没有初始化，请使用管理工具初始化！");
            cb(false);
          }
        } else {
          Message.error("UKEY 没有初始化，请使用管理工具初始化！");
          cb(false);
        }
      }, device);
    });
  },
  doExportEncCert(cb) {
    JKunitrust.SOF_GetUserList(function(data) {
      if (data.ret != 0) {
        Message.error("枚举容器失败");
        cb(false);
        return;
      }
      var id_con_count = data.param.count;
      var conname = data.param.certlist[0];
      console.log(conname, "conname");
      if (conname == null || conname == "") {
        Message.error("请先选择一个容器");

        return;
      }

      JKunitrust.SOF_ExportExChangeUserCert(conname, function(data) {
        if (data.ret != 0) {
          Message.error("导出用户加密证书失败");
          cb(false);
          return;
        }

        JKunitrust.SOF_GetCertInfo(data.param.cert, function(data) {
          if (data.ret != 0) {
            Message.error("获取证书信息失败");
            cb(false);
          } else {
            // console.log(data.param.serial, "data.param.serial");
            data.param["count"] = id_con_count;
            if (conname.split("|") != undefined) {
              data.param["conname"] = conname.split("|")[2];
            }
            cb(data.param);
          }
        });
      });
    });
  },

  GetDevices(cb) {
    console.log("GetDevices");
    var datas = [];
    devices = [];
    UBSEncrollAsync.Lookup(res => {
      if (res.success === true) {
        console.log(res.data);
        devices = res.data;
        if (devices.length > 1) {
          for (var i = 0; i < devices.length; i++) {
            this.GetDeviceInfo(res => {
              console.log(res);
              datas.push(res);
            }, devices[i]);
          }
          var timer = setInterval(function() {
            if (datas.length == devices.length) {
              cb(datas);
              clearInterval(timer);
            }
          }, 1000);
        } else {
          datas = res.data;
          cb(datas);
        }
      } else {
        cb(datas);
      }
    });
  },
  GetDeviceInfo(cb, dev) {
    UBSEncrollAsync.GetDeviceInfo(res => {
      if (res.success === true) {
        //var tmp = {"id":res.data.SerialNumber,"Label":res.data.Label};
        var myMap = {}; //对象
        myMap["id"] = res.data.SerialNumber;
        myMap["Label"] = res.data.Label;
        cb(myMap);
      }
    }, dev);
  }
};
export default Ukey;
