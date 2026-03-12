import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import TreeTable from "vue-table-with-tree-grid";
import preventReClick from "../src/components/Home/Disable.vue";
import md5 from "js-md5";
import axios from "axios";
import url from "./config/url.js";
import "./assets/css/global.css";
import "./assets/css/icon/iconfont.css";
import "./assets/css/icon2/iconfont.css";
import "default-passive-events";
import $ from "jquery";


import UKey from "./assets/js/Ukey.js"; // ukey js
import commonJs from "./assets/js/common.js"; //共通js方法
// import JKunitrust from "./assets/js/JKunitrust.js"; // 密码机共通方法
var JKunitrust = require("./assets/js/JKunitrust.js");
import Router from "vue-router";
import ElementUI, { Loading } from "element-ui";

import "element-ui/lib/theme-chalk/index.css"; // element-ui的css
import iconPicker from "vue-fontawesome-elementui-icon-picker";
// import echarts from "echarts";

// Vue.prototype.$echarts = echarts;
Vue.use(iconPicker);
Vue.use(ElementUI); // 使用elementUI

let Message = ElementUI.Message;
Vue.use(Loading.directive);
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};
Vue.use(preventReClick);

Vue.prototype.$ = $;
Vue.prototype.$md5 = md5;
Vue.prototype.$http = axios;
Vue.prototype.$url = url;
Vue.prototype.$commonJs = commonJs;

Vue.prototype.$UKey = UKey;
Vue.prototype.$JKunitrust = JKunitrust;

axios.interceptors.response.use(
  function(response) {
    if (response.data.code == "990001") {
      router.replace({ path: "/GetLogin" }).catch(err => err);
      sessionStorage.clear();
      //   Message.error("登录时间超时,请重新登录!");
    } else if (response.data.code == "990000") {
      router.replace({ path: "/GetLogin" }).catch(err => err);
      sessionStorage.clear();
      //   Message.error("权限错误!");
    } else if (response.data.code == "800000") {
      Message.warning(response.data.msg);
    } else if (response.data.code == "980001") {
      router.replace({ path: "/LicenceList" }).catch(err => err);
      sessionStorage.clear();
    }
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("Authorization");

  console.log(to, to.fullPath, "to.fullPath");
  if (to.name == "issuanceDetail") {
    if (to.query.type != undefined) {
      if (to.query.type == "user") {
        to.meta.breadcrumb = ["用户管理", "用户证书管理详情"];
      }
      if (to.query.type == "app") {
        to.meta.breadcrumb = ["应用管理", "应用证书管理详情"];
      }
    } else {
      to.meta.breadcrumb = ["根证书管理", "证书颁发机构详情"];
    }

    // console.log(to.meta, to.query.type, "to.meta");
  }
  if (token) {
    next();
  } else {
    if (to.fullPath == "/") {
      next();
    } else if (to.fullPath == "/GetLogin") {
      next();
    } else if (to.name == "InitOneList") {
      next();
    } else if (to.name == "LicenceList") {
      next();
    } else if (to.name == "InitPassCard") {
      next();
    } else {
      next({ path: "/GetLogin" });
    }
  }
});
Vue.prototype.resetSetItem = function(key, newVal) {
  if (key === "IsCertificateList") {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent("StorageEvent");
    const storage = {
      setItem: function(k, val) {
        sessionStorage.setItem(k, val);
        // 初始化创建的事件
        newStorageEvent.initStorageEvent(
          "setItem",
          false,
          false,
          k,
          null,
          val,
          null,
          null
        );
        // 派发对象
        window.dispatchEvent(newStorageEvent);
      }
    };
    return storage.setItem(key, newVal);
  }
};
Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);

new Vue({
  router,
  Message,
  render: h => h(App)
}).$mount("#app");
