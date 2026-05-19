import axios from "axios";
import router from "./../../router/index.js";
import { Loading } from "element-ui";
import { JKunitrust } from "./JKunitrust";

// axios自带的工具不需要安装npm依赖
import qs from "qs";
// 将qs挂载到全局window上
window.qs = qs;
import { Message } from "element-ui";
import url from "../../config/url.js";
// import { reject, resolve } from "core-js/fn/promise";

const common = {
  data() {
    return {
      loading: "",
      routeType: "",
      organization_id: "",
      organization_code: "",
      organization_name: "",
      roleId: ""
    };
  },
  // 调用接口方法
  getMethodData(url, method, data) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url,
        method: method,
        params: data
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
    return response;
  },
  Next(data) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.SetAioStep,
        method: "post",
        params: { step: data }
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
    return response;
  },
  // 获取组织机构数据
  GetOrgList() {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.GetOrganizationList,
        method: "post",
        params: {}
      })
        .then(res => {
          if (res.data.code == 100000) {
            function getOrgData(data, newArr) {
              data.map((item, index) => {
                newArr.push({
                  value: item.id,
                  label: item.name
                });
                if (item.children.length != 0) {
                  newArr[index].children = [];
                  getOrgData(item.children, newArr[index].children);
                }
              });
              return newArr;
            }

            let data = getOrgData(res.data.data, []);

            resolve(data);
          } else if (res.data.code != 800000) {
            Message.error(res.data.msg);
            resolve([]); // Still resolve with empty array to avoid hanging if code is not 100000
          } else {
            resolve([]);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    return response;
  },
  // 递归树形结构获取父级元素
  getFatherData(data, func, path = []) {
    if (!data) return [];

    for (const item of data) {
      // 循环每一条数据
      path.push(item.value);
      if (func(item)) return path;
      // 有子级
      if (item.children != undefined && item.children.length != 0) {
        // 重复操作所以改写成递归
        // 避免多次走循环并且pop数据 定义node 如果node里面有值直接return
        const node = this.getFatherData(item.children, func, path);
        if (node.length) {
          return node;
        }
      }
      // 没有子集并且也不等于选中id就删除最后一个元素
      path.pop();
      // console.log(item, "item");
    }
    return [];
  },
  // 获取数据字典
  GetDicData(data) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.DataAll,
        method: "POST",
        params: { dictionary_code: data }
      })
        .then(res => {
          if (res.data.code == 100000) {
            let newArr = [];
            res.data.data.forEach((item, index) => {
              newArr.push({
                label: item.name,
                value: item.val
              });
            });
            resolve(newArr);
          } else if (res.data.code != 800000) {
            Message.error(res.data.msg);
            resolve([]);
          } else {
            resolve([]);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    return response;
  },
  // 获取系统角色
  GetUserRole(userId, systemType) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.GetUserIdRole,
        method: "post",
        params: { user_id: userId, system_type: systemType }
      })
        .then(res => {
          if (res.data.code == 100000) {
            let dataList = res.data.attrs.roles;
            let roleAllList = [];
            for (var i = 0; i < dataList.length; i++) {
              let userRoleObj = {};
              userRoleObj["label"] = dataList[i].name;
              userRoleObj["value"] = dataList[i].id;
              roleAllList.push(userRoleObj);
            }
            let roleId = "";
            if (res.data.data.length != 0) {
              roleId = res.data.data[0].role_id;
            }
            resolve({
              userRole: roleId,
              roleAllList: roleAllList,
              roleList: dataList
            });
          } else if (res.data.code != 800000) {
            Message.error(res.data.msg);
            reject(res.data.msg);
          } else {
            reject("Unknown error");
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    return response;
  },

  // 下载文件
  downLoadMethodData(url, method, data) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url,
        method: method,
        params: data,
        responseType: "blob"
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
    return response;
  },
  // 调用接口方法
  getCheckNotAfter(data) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.CheckNotAfter,
        method: "post",
        params: data
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
    return response;
  },
  getCnData() {
    return [{ label: "CN", value: "CN" }];
  },
  // 以formData形式调用接口方法
  getMethodFormData(url, method, data) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url,
        method: method,
        data: qs.stringify(data)
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        // }
      }).then(res => {
        resolve(res);
      });
    });
    return response;
  },
  // 判断初始化状态
  getInitStatus() {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.GetDeviceStatus,
        method: "post",
        params: {}
      }).then(res => {
        resolve(res);
      });
    });
    return response;
  },
  // 筛选value值是否为空
  getScreenValue(data) {
    let obj = {};
    for (let key in data) {
      if (data[key] != "" || data[key] === 0 || data[key].length != 0) {
        obj[key] = data[key];
        // console.log(obj, "obj");
      }
    }
    return obj;
  },
  getScreenValueCaProf(data) {
    let obj = {},
      objVal = {},
      dataList = [];

    for (let key in data) {
      if ((data[key] != "" && data[key] != null) || data[key] == 0) {
        obj[key] = data[key];
      }
    }
    // data["caProfileExtensionItemList"].forEach(item => {
    //   for (let valKey in item) {
    //     if (
    //       (item[valKey] !== "" && item[valKey] != null) ||
    //       item[valKey] == 0
    //     ) {
    //       if (item[valKey] != "") {
    //         objVal[valKey] = item[valKey];
    //       }
    //     }
    //   }
    //   dataList.push(objVal);
    // });
    // obj["caProfileExtensionItemList"] = dataList;

    return obj;
  },
  getKeyIndex() {
    let arr = [];
    for (var i = 0; i < 20; i++) {
      arr.push({
        label: i + 1,
        value: i + 1
      });
    }
    return arr;
  },
  // 获取设备配置信息
  deviceConfGet() {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.DeviceConfGet,
        method: "post",
        params: {}
      }).then(res => {
        resolve(res);
      });
    });
    return response;
  },
  getScreenWidth() {
    let screenWidth;
    screenWidth = document.body.clientWidth;
    return screenWidth;
  },
  getCheckCert(data) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.GetCheckCert,
        method: "post",
        params: data
      }).then(res => {
        resolve(res);
      });
    });
    return response;
  },
  getCheckCertSN(data) {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.CheckCertBySN,
        method: "post",
        params: data
      }).then(res => {
        resolve(res);
      });
    });
    return response;
  },
  //   根据系统类型获取当前用户内存中数据
  getStorage() {
    let RoleList = JSON.parse(window.sessionStorage.getItem("roles"));
    if (RoleList.length == 1) {
      // 组织机构id
      //   debugger;
      let isAdmin;
      if (RoleList[0].role_system_type != "00") {
        isAdmin = false;
      } else {
        isAdmin = true;
      }
      return {
        roleId: RoleList[0].role_id,
        organization_id: RoleList[0].organization_id,
        organization_code: RoleList[0].organization_code,
        organization_name: RoleList[0].organization_name,
        isAdmin: isAdmin,
        RoleList: RoleList,
        currentRole: RoleList[0],
        routeType: RoleList[0].role_system_type
      };
    } else {
      let currentRole;
      this.routeType = window.sessionStorage.getItem("routeType");
      RoleList.forEach(item => {
        if (item.role_system_type == this.routeType) {
          // 组织机构id
          //   debugger;
          this.organization_id = item.organization_id;
          this.organization_code = item.organization_code;
          this.organization_name = item.organization_name;
          this.roleId = item.role_id;
          currentRole = item;
          //   console.log(this.routeType, item.organization_id, "routeType");
        }
      });
      return {
        roleId: this.roleId,
        organization_id: this.organization_id,
        organization_code: this.organization_code,
        organization_name: this.organization_name,
        routeType: this.routeType,
        isAdmin: false,
        RoleList: RoleList,
        currentRole: currentRole
      };
    }
  },
  getTimeOut() {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.DeviceFactoryReset,
        method: "post",
        params: {}
        // timeout: 240000
      }).then(res => {
        resolve(res);
      });
    });
    return response;
  },
  //   枚举用户
  getEnumUser() {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.GetEnumUser,
        method: "post",
        params: {}
      }).then(res => {
        resolve(res);
      });
    });
    return response;
  },

  // Loading
  getLoading() {
    this.loading = Loading.service({
      lock: true
    });
  },
  getCloseLoading() {
    this.loading.close();
  },
  //   获取系统
  GetAioStep() {
    var response = new Promise(function(resolve, reject) {
      axios({
        url: url.GetAioStep,
        method: "post",
        params: {}
      }).then(res => {
        resolve(res);
      });
    });
    return response;
  },
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
      //   console.log(data, "data");
      if (data.ret != 0) {
        return data;
      }
      if (data.param.type == 1) {
        // console.log("设备插入");
        Message.success("设备插入");
        window.sessionStorage.setItem("pullOut", "");
      } else if (data.param.type == 2) {
        // console.log("设备拔出");
        Message.success("设备拔出");
        window.sessionStorage.setItem("pullOut", true);
      }
    });
    JKunitrust.SOF_GetVersion(function(data) {
      if (data.ret != 0) {
        Message.error("获取版本号失败: " + data.msg);
        window.sessionStorage.setItem("isSuccess", "");
      } else {
        // this.MiMaVal = "插件控件版本号:" + data.param.version;
        // that.doEnumCon();
        console.log("枚举成功", data);
        window.sessionStorage.setItem("isSuccess", true);
        window.sessionStorage.setItem("pullOut", "");
      }
    });
  },

  NumberFormat(param) {
    /* 转为Number格式 */
    return (param = param != "" && param > 0 ? Number(param) : 0);
  },
  // 判断日期格式为yyyy-mm-dd
  dataFormat(obj, type) {
    debugger;
    if (type == "date") {
      var type = /^\d{4}\-\d{2}\-\d{2}$/;
      var flag = type.test(obj);
      return flag;
    } else {
      var type = /^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
      var flag = type.test(obj);
      return flag;
    }
  },

  /* 参数不能为空方法 */
  noNull(obj) {
    if (obj == null || typeof obj == "undefined") return "";
    return obj;
  },
  /* 参数为非负浮点数方法 */
  numberFloat(obj) {
    var type = /^[1-9][0-9]*([\.][0-9]{1,2})?$/;
    var flag = type.test(obj);
    return flag;
  },
  /* 参数为正整数方法 */
  numberParseInt(obj) {
    var type = /^([^0][0-9]+|0)$/;
    var flag = type.test(obj);
    return flag;
  },
  /* 参数为邮箱格式方法 */
  numberEmail(obj) {
    var type = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    var flag = type.test(obj);
    return flag;
  },
  /* 参数为手机号格式方法 */
  numberPhone(obj) {
    var type = /^1[3456789]\d{9}$/;
    var flag = type.test(obj);
    return flag;
  },
  /* 参数为金额格式方法 */
  moneyFormat(obj) {
    var type = /^\d+(?=\.{0,1}\d+$|$)/;
    var flag = type.test(obj);
    return flag;
  },
  /* 参数为身份证格式方法 */
  shenfenZheng(obj) {
    var type = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var flag = type.test(obj);
    return flag;
  },
  // 参数为税号格式方法
  suiHao(obj) {
    if (
      /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(obj)
    ) {
      return true;
    }
  },
  /* 参数只能为数字方法 */
  shuZi(obj) {
    var type = /^\d+$|^\d+[.]?\d+$/;
    var flag = type.test(obj);
    return flag;
  },
  /*时间转义方法 */
  dateTimeFormatter(date) {
    let shijian = "";
    if (typeof date != "string") {
      let getYear = date.getFullYear();
      let getMonth = date.getMonth() + 1;
      let getDate = date.getDate();
      let getHours = date.getHours();
      let getMinutes = date.getMinutes();
      let getSeconds = date.getSeconds();
      shijian =
        getYear +
        "-" +
        (getMonth < 10 ? "0" + getMonth : getMonth) +
        "-" +
        (getDate < 10 ? "0" + getDate : getDate) +
        // "T" +
        // "\xa0" +
        " " +
        (getHours < 10 ? "0" + getHours : getHours) +
        ":" +
        (getMinutes < 10 ? "0" + getMinutes : getMinutes) +
        ":" +
        (getSeconds < 10 ? "0" + getSeconds : getSeconds);
    }
    // else {
    //   shijian = date.replace(" ", "T");
    // }
    return shijian;
  },
   /*时间转义方法 查询的起始时间为 00：00：00  结束时间为 23:59:59*/ 
   dateTimeFormatterSelect(date,type) {
    let shijian = "";
    if (typeof date != "string") {
      let getYear = date.getFullYear();
      let getMonth = date.getMonth() + 1;
      let getDate = date.getDate();
      let getHours = date.getHours();
      let getMinutes = date.getMinutes();
      let getSeconds = date.getSeconds();
      shijian =
        getYear +
        "-" +
        (getMonth < 10 ? "0" + getMonth : getMonth) +
        "-" +
        (getDate < 10 ? "0" + getDate : getDate) +
        // "T" +
        // "\xa0" +
        " " +
        (type == "1" ? "00" : "23") +
        ":" +
        (type == "1" ? "00" : "59") +
        ":" +
        (type == "1" ? "00" : "59");
    }
    // else {
    //   shijian = date.replace(" ", "T");
    // }
    return shijian;
  },
  dateTimeFormatterTwo(date) {
    let shijian = "";
    if (typeof date == "string") {
      shijian = date.replace("\xa0", "T");
    }
    return shijian;
  },
  dateTimeFormatterThree(date) {
    let shijian = "";
    if (typeof date == "string") {
      shijian = date.replace("T", "\xa0");
    }
    return shijian;
  },
  /*时间转义方法 */
  dateFormatter(date) {
    let myYear = date.getFullYear();
    let myMonth = date.getMonth() + 1;
    let myDay = date.getDate();
    let time =
      myYear +
      "-" +
      (myMonth < 10 ? "0" + myMonth : myMonth) +
      "-" +
      (myDay < 10 ? "0" + myDay : myDay);
    return time;
  },
  //   时间戳转日期
  dateFtt(fmt, date) {
    //author: meizz
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  },
  //   接口报错提示
  getUrlError(obj) {
    var flag = obj;
    if (obj == "Unknown") {
      flag = "未知的失败";
    } else if (obj == "AuthFailure") {
      flag = "认证失败";
    } else if (obj == "AuthSuccessButNoAccess") {
      flag = "认证成功 但没有权限调用接口";
    } else if (obj == "AuthFailureSinceHaveNoAuthMsg") {
      flag = "认证失败 因为没有fp或Authorization";
    } else if (obj == "OperationFailure") {
      flag = "业务失败";
    } else if (obj == "OtherFailure") {
      flag = "其他的失败";
    }
    return flag;
  },
  //数据去重
  getArrylist(list) {
    //用于name判断重复
    var temp = {};

    //去重后组成的新数组
    var result = [];
    //对合并数组c进行去重处理
    list.map(function(item, index) {
      if (!temp[item.commonMasterId]) {
        result.push(item);
        temp[item.commonMasterId] = true;
      }
    });
    return result;
  },
  /* 获取数据字典数据列表 */
  getShuJuZiDianList(param) {
    var response = new Promise(function(resolve, reject) {
      axios
        .get(url.GetCommonMasterList, {
          params: {
            commonMasterName: "",
            commonMasterTypes: param,
            currentPage: 1,
            pageSize: 1000
          }
        })
        .then(function(res) {
          if (res.data.msgCode == 1) {
            resolve(dataForEach(res.data.dtList));
          }
        });
    });
    return response;
  },
  // 点击导航栏新增tab页
  addTab(targetName, path) {
    let editableTabs = window.localStorage.getItem("editableTabs");
    let editableTabsValue = "0";
    let flag = true; //判断是否需要新增页面
    var tabs = editableTabs; //活跃当前tab数组
    tabs = JSON.parse(tabs);
    for (var i = 0; i < tabs.length; i++) {
      //如果存在相同的tab页 不新增tab页
      if (tabs[i].path === path) {
        // console.log(tabs[i].path);
        editableTabsValue = tabs[i].name.toString(); //定位到已打开页面
        router.replace({ path: "/" + path });
        flag = false;
      }
    }
    window.localStorage.setItem("activeIndex", path);
  },
  // 删除服务器中的图片
  deleteImg(file, type) {
    let removeImgId = "";
    if (file.response == undefined) {
      console.log(file.name);
      removeImgId = file.name;
    } else {
      console.log(file.response.id);
      removeImgId = file.response.id;
    }
    const data1 = [removeImgId, type];
    var response = new Promise(function(resolve, reject) {
      axios
        .delete(url.DeleteOneFile, {
          data: data1,
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
        .then(res => {
          if (res.data.msgCode == 1) {
            console.log(res);
          } else {
            console.log(res.data.message);
          }
        });
    });
    return response;
  },
  // 获取小程序码
  getWeiXinGeneratingCode(type, param) {
    let page = "",
      scene = "";
    if (type == "chuZuList") {
      page = "pages/ZuFang/ZuFangDetail";
    } else if (type == "chuShowList") {
      page = "pages/ErShouFang/ErShouDetail";
    } else if (type == "xinFangList") {
      page = "pages/XinFang/XinFangDetail";
    }
    let response = new Promise(function(resolve, reject) {
      axios
        .get(url.Get_weiXinGeneratingCode, {
          params: {
            page: page,
            houseNo: param
          }
        })
        .then(function(res) {
          if (res.data.msgCode == 1) {
            let sharePic = url.xcxQrPic + res.data.imgName;
            resolve(sharePic);
          }
        })
        .catch(res => {
          reject(res.message);
        });
    });
    return response;
  }
};
export default common;
