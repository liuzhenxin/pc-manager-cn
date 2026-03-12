<template>
    <div class="navItem">
        <el-card>
            <el-tabs v-model="activeName">
                <el-tab-pane label="初始化组织机构" name="first" disabled>
                    <ZuZhiJiGou :ZuZhimode='1' @getZuZhiData='getZuZhiData'></ZuZhiJiGou>
                </el-tab-pane>
                <el-tab-pane label="初始化用户 系统管理员" name="second" disabled>
                    <YongHu :YongHumode='1' @getPrev='getPrev' @getYongHuData='getYongHuData'></YongHu>
                </el-tab-pane>
                <el-tab-pane label="初始化用户 安全管理员" name="third" disabled>
                    <YongHu :YongHumode='2' @getPrev='getPrev' @getYongHuAnQuanData='getYongHuAnQuanData'></YongHu>
                </el-tab-pane>
                <el-tab-pane label="初始化用户 审计管理员" name="fourth" disabled>
                    <YongHu :YongHumode='3' @getPrev='getPrev' @getYongHuShenJiData='getYongHuShenJiData'></YongHu>
                </el-tab-pane>
            </el-tabs>
            <!-- 列表 -->
        </el-card>



    </div>
</template>
<script>
import ZuZhiJiGou from "../organization/organizationDetail.vue";
import YongHu from "../userInformation/userInformationDetail.vue";
import { JKunitrust } from "../../assets/js/JKunitrust.js";
export default {
    components: {
        ZuZhiJiGou,
        YongHu
    },
    inject: ["reload"],
    data() {
        return {
            activeName: "first",
            form: {
                job_name: "", //  角色名称
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            jobList: [],
            menuRoleId: "",
            g_cert1: "", // 系统证书
            g_cert2: "", // 安全证书
            g_cert3: "", // 审计证书
            zuZhiList: {},
            XiTongYongHuList: {},
            AnQuanYongHuList: {},
            ShenJiYongHuList: {},
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
        // if (window.sessionStorage.getItem("ukey3") != null) {
        //     this.ukey = window.sessionStorage.getItem("ukey3");
        // }
    },
    mounted() {
        // this.getInit();
    },
    methods: {
        // 初始化
        getInit() {
            let that = this;
            JKunitrust.oninit(
                that.onSuccess,
                function (msg, evt) {
                    that.$message.error("初始化失败:" + msg);
                    console.log(evt);
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
        },
        onSuccess() {
            let that = this;
            JKunitrust.listenHotplug(that.listHotPlug);
            JKunitrust.SOF_GetVersion(function (data) {
                if (data.ret != 0) {
                    that.$message.error("获取版本号失败: " + data.msg);
                } else {
                    // this.MiMaVal = "插件控件版本号:" + data.param.version;
                    that.doEnumCon();
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
                // debugger;

                console.log(
                    that.g_cert1,
                    "that.g_cert1",
                    that.g_cert2,
                    " that.g_cert2",
                    that.g_cert3,
                    " that.g_cert3"
                );
                that.g_cert = data.param.cert;

                JKunitrust.SOF_GetCertInfo(that.g_cert, that.reflushCertMsg);

                console.log(data, data.param, "this.id_con_select");
                if (that.activeName == "second") {
                    window.sessionStorage.setItem("g_cert1", that.g_cert1);
                } else if (that.activeName == "third") {
                    window.sessionStorage.setItem("g_cert2", that.g_cert2);
                } else if (that.activeName == "fourth") {
                    window.sessionStorage.setItem("g_cert3", that.g_cert3);
                }
            });
        },
        reflushCertMsg(data) {
            console.log(data, "www");
            let that = this;
            if (data.ret != 0) {
                that.$message.error("获取证书信息失败: " + data.msg);
            } else {
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
        getZuZhiData(data) {
            this.zuZhiList = data;
            this.activeName = "second";
            console.log(data, "data");
            console.log(this.zuZhiList, "this.zuZhiList");
        },
        getPrev(val) {
            this.activeName = val;
        },
        getYongHuData(data, val) {
            this.XiTongYongHuList = data;
            this.activeName = "third";
            this.g_cert1 = val;
            console.log(
                this.XiTongYongHuList,
                data,
                val,
                "this.XiTongYongHuList"
            );
        },
        getYongHuAnQuanData(data, val) {
            this.AnQuanYongHuList = data;
            this.activeName = "fourth";
            this.g_cert2 = val;
            console.log(
                this.AnQuanYongHuList,
                data,
                val,
                "this.AnQuanYongHuList"
            );
        },
        getYongHuShenJiData(data, val) {
            this.ShenJiYongHuList = data;
            this.g_cert3 = val;
            let organizationStr = JSON.stringify(this.zuZhiList),
                oper_adminStr = JSON.stringify(this.AnQuanYongHuList),
                system_adminStr = JSON.stringify(this.XiTongYongHuList),
                audit_adminStr = JSON.stringify(this.ShenJiYongHuList);
            let dataObj = {
                audit_adminCert: this.g_cert3, //审计管理员用户证书
                audit_adminStr: audit_adminStr, //审计管理员用户设定
                oper_adminCert: this.g_cert2, // 安全管理员用户证书
                oper_adminStr: oper_adminStr, // - 安全管理员用户设定
                organizationStr: organizationStr, // - 组织机构设定
                system_adminCert: this.g_cert1, //- 系统管理员用户证书
                system_adminStr: system_adminStr //  *系统管理员用户设定
            };

            this.$commonJs
                .getMethodFormData(this.$url.GetinitHsm, "POST", dataObj)
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "res,data.data");
                        this.$message.success("初始化成功!");
                        // this.reload();
                        this.$router.push("/GetStatistics");
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    window.sessionStorage.removeItem("g_cert1");
                    window.sessionStorage.removeItem("g_cert2");
                    window.sessionStorage.removeItem("g_cert3");
                    window.sessionStorage.removeItem("formData1");
                    window.sessionStorage.removeItem("formData2");
                });

            //     console.log(
            //         this.zuZhiList,
            //         this.YongHuList,
            //         this.AnQuanYongHuList,
            //         this.ShenJiYongHuList,

            //         data,
            //         val,
            //         "this.ShenJiYongHuList"
            //     );
        }
    }
};
</script>

<style lang="less" scoped>
.box-card {
    height: 50px;
    line-height: 50px;
}
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
</style>
