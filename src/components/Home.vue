<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <!-- <div style="width:250px;height:40px"> -->
            <div class="LogoDiv" :style="{'--logoDivWidth':logoDivWidth,'--logoDivHeight':logoDivHeight}">
                <div id="PageLogoDiv" class="PageLogoStyle PageLogoStyle1" :style="{'--background1':banner1,'--background2':banner2,'--backgroundSize1':backgroundSize1,'--backgroundSize2':backgroundSize2,'--backgroundSize3':backgroundSize3}">
                    <!-- <img src="../../public/img/pageLogo.png" alt="">
                <span style="color:rgb(15, 25, 60)">服务器密码机</span> -->
                    <span style="color:rgb(15, 25, 60);font-size:26px;margin-left:54px;font-weight:bold;">{{logoContent}}</span>
                </div>
                <div class="toggle-button" @click="toggleCollapse" style="color:rgb(15, 25, 60)"><i class="el-icon-s-unfold"></i></div>

            </div>

            <!-- <el-button type="info" @click="logout">退出</el-button> -->
            <el-dropdown @command="handleCommand">
                <div>
                    <img class="headPortraitStyle" src="../../public/img/noTouXiang.png" style="
       
              " />
                    <span style="font-size: 14px; margin-right: 30px; color:#000;vertical-align:middle;cursor:pointer"> {{userName}} <i class="el-icon-caret-bottom"></i></span>

                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled>{{ROleName}}</el-dropdown-item>
                    <el-dropdown-item @click.native="userMessage()">账户信息</el-dropdown-item>

                    <div v-for="item in userList" :key="item.type">
                        <el-dropdown-item :command="item.label" @click.native="changeUser(item)">
                            {{ item.label }}
                        </el-dropdown-item>
                    </div>
                    <!-- <el-dropdown-item divided></el-dropdown-item> -->
                    <!-- <el-dropdown-item command="修改个人信息">修改个人信息</el-dropdown-item> -->
                    <!-- <el-dropdown-item command="修改密码">修改密码</el-dropdown-item> -->
                    <!-- <el-dropdown-item command="CA">CA</el-dropdown-item>
                    <el-dropdown-item command="KMS">KMS</el-dropdown-item>
                    <el-dropdown-item command="签名验签">签名验签</el-dropdown-item>
                    <el-dropdown-item command="密码机">密码机</el-dropdown-item>
                    <el-dropdown-item command="退出登录">退出登录</el-dropdown-item> -->
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <!--页面区域-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse ? '47px' : '205px'">
                <!--侧边栏菜单区-->
                <!-- background: #c0d9ea; -->
                <!-- background-color="#333744" -->
                <el-menu background-color="#fff" text-color="rgb(15 25 60)" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                    <!--一级菜单-->
                    <div v-for="item in menuList" :key="item.id">
                        <el-menu-item v-if="item.children.length == 0" :disabled="isDisable" :index="item.path + ''" :key="item.path" @click="getHomePage(item.path),saveNavState(item.path,item,'')">
                            <i :class="item.icon" style="margin-right:10px;color:rgb(15 25 60)"></i>
                            <!-- {{item}} -->
                            <span>{{ item.authName }}</span>
                        </el-menu-item>
                        <el-submenu v-else :disabled="item.authName != '设备管理' && isDisable==true" :index="item.id" :key="item.id" class="twoMenu">
                            <template slot="title">
                                <!--图标-->
                                <!-- <i :class="iconObj[item.id]"></i> -->
                                <i :class="item.icon" style="color:rgb(15 25 60)"></i>
                                <span>{{ item.authName }}</span>
                            </template>
                            <!--二级菜单-->
                            <el-menu-item :disabled="subItem.path !='initInstallList' && isDisable==true" :index="'/'  +  subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="getHomePage(item.path),saveNavState('/'  +  subItem.path,item,subItem)">
                                <!--二级菜单的模板区-->

                                <template slot="title" v-if="subItem.children.length == 0">
                                    <!--图标-->
                                    <i :class="subItem.icon" style="color:rgb(15 25 60)"></i>
                                    <!--文本-->
                                    <!--<span>二级菜单</span>-->
                                    <span>{{ subItem.authName }}</span>
                                </template>
                                <!-- 三级 -->
                                <!-- <el-submenu v-else :index="subItem.id" :key="subItem.id" class="threeMenu">
                                    <template slot="title">
                                        <i :class="subItem.icon" style="color:rgb(15 25 60)"></i>
                                        <span>{{ subItem.authName }}</span>
                                    </template>

                                    <el-menu-item :index="'/'  +  threeItem.path" v-for="threeItem in subItem.children" :key="threeItem.id" @click="getHomePage(threeItem.path),saveNavState('/'  +  threeItem.path)">
                                        <template slot="title">
                                            <i :class="threeItem.icon" style="color:rgb(15 25 60)"></i>
                                            <span>{{ threeItem.authName }}</span>
                                        </template>
                                    </el-menu-item>
                                </el-submenu> -->
                            </el-menu-item>
                        </el-submenu>
                    </div>
                </el-menu>
            </el-aside>
            <!--右侧内容主体-->
            <el-main>
                <!-- 路由占位符 -->
                <breadcrumb style="margin-top:-5px !important;margin-bottom:30px" v-if="this.isHomepPage == null"></breadcrumb>
                <router-view></router-view>
            </el-main>

        </el-container>
    </el-container>
</template>

<script>
import Breadcrumb from "./Home/Breadcrumb"

export default {
    inject: ["reload"],
    name: "home",
    components: {
        Breadcrumb
    },
    data() {
        return {
            banner1: "",
            banner2: "",
            imageUrl1:
                this.$url.ImageURL +
                "system/direct/resource/getByCodeIO?page=GetStatistics&code=1",
            imageUrl2:
                this.$url.ImageURL +
                "system/direct/resource/getByCodeIO?page=GetStatistics&code=2",
            backgroundSize1: "",
            backgroundSize2: "",
            backgroundSize3: "",
            logoDivWidth: "",
            logoDivHeight: "",
            logoContent: "",
            userRoleList: [], // 内存中权限列表
            menuList: [],
            userName: "",
            routeTypeId: "",
            keyList: [],
            isDisable: false,
            nodeList: [],
            userList: [],
            iconFatherObj: {
                1: "el-icon-menu",
                2: "el-icon-user"
            },
            iconObj: {
                125: "iconfont el-icon-user",
                103: "iconfont icon-shikong-kongjianxuanzhong",
                101: "iconfont icon-shangpingouwudai2",
                102: "iconfont icon-danju-tianchong",
                145: "iconfont con-baobiao"
            },
            ROleName: "",
            // 是否折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: "",
            isHomepPage: true
        }
    },
    created() {
        this.userName = JSON.parse(
            window.sessionStorage.getItem("userList")
        ).nickname
        this.activePath = window.sessionStorage.getItem("activePath")
        this.$nextTick(() => {
            this.isHomepPage = window.sessionStorage.getItem("isHomepPage")
        })
        this.userRoleList = JSON.parse(window.sessionStorage.getItem("roles"))
        this.getMenuList()
        this.getRoleList()
        if (this.imageUrl1.startsWith("http://")) {
            this.banner1 = 'url("' + this.imageUrl1 + '")'
            this.banner2 = 'url("' + this.imageUrl2 + '")'
        } else {
            this.banner1 = 'url("../' + this.imageUrl1 + '")'
            this.banner2 = 'url("../' + this.imageUrl2 + '")'
        }
        this.getResourceDetail("8")
        this.getResourceDetail("9")
    },
    methods: {
        // 获取详情
        getResourceDetail(code) {
            this.loading = true
            let url = this.$url.ResourceGetByCode
            this.$commonJs
                .getMethodData(url, "POST", {
                    page: "GetStatistics",
                    code: code
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        if (code == "8") {
                            this.logoContent = res.data.data.content
                        } else {
                            var content = res.data.data.content
                            var arr = content.split(",")
                            this.backgroundSize1 = arr[0]
                            this.backgroundSize2 = arr[1]
                            this.backgroundSize3 = arr[2]
                            this.logoDivWidth = arr[3]
                            this.logoDivHeight = arr[4]
                            if (this.backgroundSize3 == "none") {
                                document
                                    .getElementById("PageLogoDiv")
                                    .classList.remove("PageLogoStyle1")
                            }
                        }
                    }
                    this.loading = false
                })
        },
        logout() {
            window.sessionStorage.clear()
            // 跳转到登录页
            this.$router.push("/GetLogin").catch((err) => {
                console.log("输出报错", err)
            })
        },
        getRoleList() {
            // debugger;
            // 侧边栏禁用
            // this.$commonJs.getInitStatus().then((res) => {
            //     let data = res.data.data,
            //         routeType = this.$commonJs.getStorage().routeType,
            //         RoleList = this.$commonJs.getStorage().RoleList;
            //     if (data == true) {
            //         this.isDisable = false;
            //     } else if (data == false) {
            //         // admin 或者1个系统

            //         if (routeType != undefined) {
            //             if (routeType != "10") {
            //                 this.isDisable = false;
            //             } else {
            //                 this.isDisable = true;
            //             }
            //         } else {
            //             if (RoleList[0].system_type == "10") {
            //                 this.isDisable = true;
            //             }
            //         }
            //     }
            // });
            // 结束
            this.userList = []
            // 10:密码机 20:签名验签 30:CA 40:KMS
            // for (var i = 0; i < this.userRoleList.length; i++) {

            // if (this.userRoleList[i].system_type == "10") {
            //     this.userList.push({
            //         label: "密码机",
            //         type: "10"
            //     });
            // }
            // if (this.userRoleList[i].system_type == "20") {
            //     this.userList.push({
            //         label: "签名验签",
            //         type: "20"
            //     });
            // }
            // if (this.userRoleList[i].system_type == "30") {
            //     this.userList.push({
            //         label: "CA",
            //         type: "30"
            //     });
            // }
            // if (this.userRoleList[i].system_type == "40") {
            //     this.userList.push({
            //         label: "KMS",
            //         type: "40"
            //     });
            // }
            // if (this.userRoleList[i].system_type == "00") {
            //     this.userList = [];
            //     this.userList.push(
            //         {
            //             label: "密码机",
            //             type: "10"
            //         },
            //         {
            //             label: "签名验签",
            //             type: "20"
            //         },
            //         {
            //             label: "CA",
            //             type: "30"
            //         },
            //         {
            //             label: "KMS",
            //             type: "40"
            //         }
            //     );
            // }
            // }

            for (var i = 0; i < this.userRoleList.length; i++) {
                if (this.routeTypeId != undefined) {
                    if (this.userRoleList[i].system_type == this.routeTypeId) {
                        this.ROleName = this.userRoleList[i].role_name
                    }
                } else {
                    this.ROleName = this.userRoleList[0].role_name
                }
            }
            if (
                this.userRoleList.length > 1 &&
                this.userRoleList[0].system_type != "00"
            ) {
                this.userList.push({
                    label: "切换系统",
                    type: "1"
                })
            }
            this.userList.push(
                // {
                //     label: "修改PIN",
                //     type: "3"
                // },
                {
                    label: "退出登录",
                    type: "0"
                }
            )
        },
        userMessage() {
            window.sessionStorage.setItem("isHomepPage", true)
            let userId = JSON.parse(
                window.sessionStorage.getItem("userList")
            ).id
            this.$router.push({
                name: "initList",
                query: {
                    MessageType: "myMessage",
                    id: userId
                }
            })
            this.reload()
        },
        changeUser() {},
        handleCommand(command) {
            if (command == "CA") {
                this.$message.success("CA")
            } else if (command == "KMS") {
                this.$message.success("KMS")
            } else if (command == "签名验签") {
                this.$message.success("签名验签")
            } else if (command == "密码机") {
                this.$message.success("密码机")
            } else if (command == "退出登录") {
                this.logout()
            } else if (command == "关机") {
                this.sysClose()
            } else if (command == "重启") {
                this.sysReboot()
            } else if (command == "切换系统") {
                // this.sysReboot();
                this.$router.push("/GetTypeLogin")
                window.sessionStorage.setItem("activePath", "GetTypeLogin")
            } else if (command == "修改PIN") {
                // this.sysReboot();
                this.$router.push("/modifyPINList")
                window.sessionStorage.setItem("activePath", "/modifyPINList")
                this.reload()
            } else if (command == this.ROleName) {
                return false
            }
            console.log(command, "command")
        },
        sysClose() {
            this.$confirm("是否确认关机?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.SysClose, "POST", {})
                        .then((res) => {
                            console.log(res.data.data, "res")
                        })
                })
                .catch((err) => err)
        },
        sysReboot() {
            this.$confirm("是否确认重启?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.SysReboot, "POST", {})
                        .then((res) => {
                            console.log(res.data.data, "res")
                        })
                })
                .catch((err) => err)
        },
        // 获取所有的菜单
        async getMenuList() {
            // debugger;

            this.routeTypeId = window.sessionStorage.getItem("routeType")

            this.$commonJs
                .getMethodData(this.$url.GetRoute, "POST", {
                    role_id: this.$commonJs.getStorage().roleId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.menuList = res.data.attrs.route
                    }
                    // console.log(res, "res");
                })
            // this.menuList = [
            //     {
            //         id: "1",
            //         icon: "el-icon-s-home",
            //         path: "GetStatistics",
            //         authName: "首页"
            //     },
            //     {
            //         id: "2",
            //         icon: "el-icon-user",
            //         authName: "个人信息",
            //         children: [
            //             {
            //                 id: "1-1",
            //                 authName: "用户",
            //                 path: "userInformationList",
            //                 icon: "el-icon-s-opportunity"
            //             },
            //             {
            //                 id: "1-2",
            //                 authName: "角色",
            //                 path: "rolesList",
            //                 icon: "el-icon-s-custom"
            //             }
            //         ]
            //     },
            //     {
            //         id: "3",
            //         icon: "el-icon-notebook-2",
            //         path: "operationLogList",
            //         authName: "操作日志"
            //         // path: "operationLogList"
            //     },
            //     {
            //         id: "4",
            //         path: "menuList",
            //         icon: "el-icon-edit-outline",
            //         authName: "菜单管理"
            //         // path: "operationLogList"
            //     },
            //     {
            //         id: "5",
            //         path: "3",
            //         authName: "应用管理",
            //         icon: "el-icon-warning-outline",
            //         // path: "operationLogList"
            //         children: [
            //             {
            //                 id: "3-1",
            //                 authName: "应用证书管理",
            //                 path: "certificateList",
            //                 icon: "el-icon-reading"
            //             }
            //         ]
            //     },
            //     {
            //         id: "6",
            //         authName: "参数配置",
            //         path: "paramsConfigurationList",
            //         icon: "el-icon-setting"
            //     },
            //     {
            //         id: "7",
            //         authName: "组织机构",
            //         path: "organizationList",
            //         icon: "iconfont icon-zuzhijigou"
            //     },
            //     {
            //         id: "8",
            //         icon: "el-icon-user",
            //         authName: "IP相关",
            //         children: [
            //             {
            //                 id: "8-1",
            //                 authName: "配置网卡",
            //                 path: "ipConfig",
            //                 icon: "el-icon-s-opportunity"
            //             },
            //             {
            //                 id: "8-2",
            //                 authName: "网络诊断",
            //                 path: "ipDiagnose",
            //                 icon: "el-icon-s-custom"
            //             }
            //         ]
            //     },
            //     {
            //         id: "9",
            //         icon: "el-icon-user",
            //         authName: "密码机管理",
            //         children: [
            //             {
            //                 id: "9",
            //                 authName: "安装向导",
            //                 path: "initInstallList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "10",
            //                 authName: "对称密钥管理",
            //                 path: "symmetricKeyList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "11",
            //                 authName: "RSA密钥管理",
            //                 path: "RSAkeyList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "12",
            //                 authName: "SM2密钥管理",
            //                 path: "SM2KeyList",
            //                 icon: "el-icon-folder-checked"
            //             },

            //             {
            //                 id: "13",
            //                 authName: "服务配置管理",
            //                 path: "ServiceList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "14",
            //                 authName: "设备自检",
            //                 path: "selfInspectionList",
            //                 icon: "el-icon-folder-checked"
            //             },

            //             {
            //                 id: "15",
            //                 authName: "设备升级",
            //                 path: "selfUpList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "16",
            //                 authName: "用户登录",
            //                 path: "userLoginList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "17",
            //                 authName: "修改PIN命令",
            //                 path: "modifyPINList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "18",
            //                 authName: "备份密钥信息",
            //                 path: "copyKeyList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "19",
            //                 authName: "恢复密钥信息",
            //                 path: "recoveryKeyList",
            //                 icon: "el-icon-folder-checked"
            //             },
            //             {
            //                 id: "20",
            //                 authName: "白名单",
            //                 path: "whiteMenuList",
            //                 icon: "el-icon-folder-checked"
            //             }
            //         ]
            //     }
            // ];
            window.sessionStorage.setItem(
                "menuList",
                JSON.stringify(this.menuList)
            )
            for (var i = 0; i < this.menuList.length; i++) {
                if (this.menuList[i].children == undefined) {
                    this.keyList.push(this.menuList[i])
                } else {
                    this.nodeList.push(this.menuList[i])
                }
            }
            // console.log(res)
        },
        // 点击按钮，切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态 高亮状态
        saveNavState(activePath, father, children) {
            window.sessionStorage.setItem("activePath", activePath)
            console.log(father, children, "name")
            // 设置面包屑
            // if (children != "") {
            //     this.$route.meta.breadcrumb = [
            //         father.authName,
            //         children.authName
            //     ];
            // } else {
            //     this.$route.meta.breadcrumb = [father.authName];
            // }
            this.activePath = activePath
            if (activePath == "/certificateList") {
                this.resetSetItem("IsCertificateList", activePath)
                this.reload()
            }
        },
        // 判断是否为首页
        getHomePage(path) {
            if (path == "GetStatistics") {
                // this.isHomepPage = true;
                window.sessionStorage.setItem("isHomepPage", true)
            } else {
                // window.sessionStorage.setItem("isHomepPage", false);
                window.sessionStorage.removeItem("isHomepPage")
            }
            this.isHomepPage = window.sessionStorage.getItem("isHomepPage")
        }
    }
}
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    // background: #373d41;
    // background: #c0d9ea;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    div {
        display: flex;
        align-items: center;
    }

    .PageLogoStyle {
        // background: url("../../public/img/pageLogo.png") no-repeat;
        width: 100%;
        height: 100%;
        margin-left: 20px;
        // margin-top: 20px;
    }

    span {
        margin-left: 15px;
    }
}

.el-aside {
    // background: #333744;
    // background: #c0d9ea;
    transition-duration: 1s;

    .el-menu {
        border-right: 0;
    }
}

.el-main {
    background: #eaedf1;
}
.el-menu-item {
    padding-left: 26px !important;
}
.iconfont {
    margin-right: 10px;
}
.headPortraitStyle {
    border-radius: 50%;
    // width: 40px;
    // height: 40px;
    cursor: pointer;
    vertical-align: middle;
}
/deep/ .el-submenu__title:hover {
    background: #ecf2ff !important;
}
/deep/ .threeMenu:hover {
    background: #ecf2ff;
}
/deep/ .threeMenu {
    .el-submenu__title {
        padding-left: 0px !important;
    }
    .el-menu-item {
        padding: 0 !important;
    }
    .el-submenu__icon-arrow {
        right: -9px;
    }
}
// /deep/ .twoMenu {
//     .el-menu-item {
//         padding-left: 0 20px !important;
//     }
// }
@media screen and (min-width: 1400px) {
    .PageLogoStyle {
        // background: url("../../public/img/pageLogo.png") no-repeat;
        background: var(--background1) no-repeat;
        // background-size: 23% 100%;
        background-size: var(--backgroundSize1) var(--backgroundSize2);
    }
    .PageLogoStyle1 {
        background-size: var(--backgroundSize3);
    }
    .LogoDiv {
        width: var(--logoDivWidth);
        height: var(--logoDivHeight);
    }
    .toggle-button {
        font-size: 25px;
    }
    .headPortraitStyle {
        width: 40px;
        height: 40px;
    }
}
@media screen and (max-width: 1400px) {
    /deep/ .el-menu-item {
        height: 40px;
        line-height: 40px !important;
    }
    /deep/ .el-submenu__title {
        height: 40px;
        line-height: 40px !important;
    }
    .el-header {
        height: 50px !important;
    }
    .PageLogoStyle {
        // background: url("../../public/img/page.png") no-repeat;
        background: var(--background2) no-repeat;
        //margin-top: 5px;
        //background-size: 23% 100%;
        background-size: var(--backgroundSize1) var(--backgroundSize2);
    }
    .PageLogoStyle1 {
        background-size: var(--backgroundSize3);
    }
    .LogoDiv {
        width: var(--logoDivWidth);
        height: var(--logoDivHeight);
    }
    .toggle-button {
        font-size: 20px;
    }
    .headPortraitStyle {
        width: 30px;
        height: 30px;
    }
}
.toggle-button {
    // background: #4a5064;
    // background: #c0d9ea;
    color: #fff;
    // font-size: 25px;
    // text-align: center;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
/deep/ .el-aside .el-icon-arrow-right:before {
    display: none;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 6px;
    height: 10px;
    background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #ccc;
}
</style>

