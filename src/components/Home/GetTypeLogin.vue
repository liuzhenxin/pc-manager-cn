<template>
    <!-- <el-card> -->
    <div class="typeBgStyle" style="">
        <div class="fontStyle">请选择系统类型</div>
        <div style="margin-left:21%">
            <div class="divBox divBox3" :disabled="disabledList.isDisabled3" @mouseover="divBoxmouseOver(1)" @mouseleave="divBoxmouseLeave(1)" @click="getLogin('CA')">
                <div class="iconStyle"><i class="icon-CAS iconfont fontSize"></i></div>
                <p class="fontTypeStyle CAStyle">CA</p>
            </div>
            <!-- 
        <div class="divBox divBox4" :disabled="disabledList.isDisabled3" @click="getLogin('KMS')" @mouseleave="divBoxmouseLeave(2)" @mouseover="divBoxmouseOver(2)">
            <div class="iconStyle"><i class="icon-KMSguanli iconfont fontSize"></i></div>
            <p class="fontTypeStyle KMSStyle" style="margin-left: 36%;">KMS</p>
        </div> -->

            <div class="divBox divBox2" :disabled="disabledList.isDisabled2" @click="getLogin('qianming')" @mouseleave="divBoxmouseLeave(3)" @mouseover="divBoxmouseOver(3)">
                <div class="iconStyle"><i class="icon-qianmingyanqianshebei iconfont fontSize"></i></div>
                <p class="fontTypeStyle QMStyle" style="margin-left: 8%;">签名验签服务器</p>
            </div>
            <div class="divBox divBox1" :disabled="disabledList.isDisabled1" @click="getLogin('mima')" @mouseleave="divBoxmouseLeave(4)" @mouseover="divBoxmouseOver(4)">
                <div class="iconStyle"><i class="el-icon-lock  fontSize"></i></div>
                <p class="fontTypeStyle HMSStyle" style="margin-left: 14%;">服务器密码机</p>
            </div>
        </div>
    </div>

</template>
<script>
import $ from "jquery"

export default {
    data() {
        return {
            systemType: [],
            type: [],
            disabledList: {
                isDisabled1: true,
                isDisabled2: true,
                isDisabled3: true,
                isDisabled4: true
            }
        }
    },
    created() {
        this.systemType = JSON.parse(window.sessionStorage.getItem("roles"))
        console.log(this.systemType, " this.systemType ")
    },

    mounted() {
        this.getRole()
    },
    methods: {
        getRole() {
            // 10:密码机 20:签名验签 30:CA 40:KMS
            var dom1 = document.querySelector(".divBox1")
            var dom2 = document.querySelector(".divBox2")
            var dom3 = document.querySelector(".divBox3")
            // var dom4 = document.querySelector(".divBox4");
            this.type = []
            for (var i = 0; i < this.systemType.length; i++) {
                if (this.systemType[i].role_system_type == "10") {
                    dom1.style.cursor = "pointer"
                    this.disabledList.isDisabled1 = false
                    this.type.push("10")
                }
                if (this.systemType[i].role_system_type == "20") {
                    dom2.style.cursor = "pointer"
                    this.disabledList.isDisabled2 = false
                    this.type.push("20")
                }
                if (this.systemType[i].role_system_type == "30") {
                    dom3.style.cursor = "pointer"
                    this.disabledList.isDisabled3 = false
                    this.type.push("30")
                }
                // if (this.systemType[i].role_system_type == "40") {
                //     dom4.style.cursor = "pointer";
                //     this.disabledList.isDisabled4 = false;
                //     this.type.push("40");
                // }
                if (this.systemType[i].role_system_type == "00") {
                    dom1.style.cursor = "pointer"
                    dom2.style.cursor = "pointer"
                    dom3.style.cursor = "pointer"
                    // dom4.style.cursor = "pointer";
                    this.type.push("00")
                }
            }
            for (var key in this.disabledList) {
                if (this.disabledList[key] == true) {
                    if (key == "isDisabled1") {
                        this.getStyle(dom1)
                    }
                    if (key == "isDisabled2") {
                        this.getStyle(dom2)
                    }
                    if (key == "isDisabled3") {
                        this.getStyle(dom3)
                    }
                    // if (key == "isDisabled4") {
                    //     this.getStyle(dom4);
                    // }
                }
            }
        },
        getStyle(data) {
            data.style.background = "#a4a6a9"
            data.style.border = "1px solid #a4a6a9"
        },
        getMessage() {
            this.$message.success("登录成功")
        },
        getLogin(type) {
            if (this.type.indexOf("00") != -1) {
                this.$router.push("/GetStatistics")
                window.sessionStorage.setItem("routeType", "00")
                // this.getMessage();
            }
            if (type == "mima") {
                if (this.type.indexOf("10") != -1) {
                    if (this.disabledList.isDisabled1 != true) {
                        window.sessionStorage.setItem("routeType", "10")
                        // this.$router.push("/GetStatistics");
                        // this.getMessage();
                        this.getInitStatus()
                    }
                } else {
                    return false
                }
            }
            if (type == "qianming") {
                if (this.type.indexOf("20") != -1) {
                    if (this.disabledList.isDisabled2 != true) {
                        window.sessionStorage.setItem("routeType", "20")
                        // this.$router.push("/GetStatistics");
                        // this.getMessage();
                        this.getInitStatus()
                    }
                } else {
                    return false
                }
            }
            if (type == "CA") {
                if (this.type.indexOf("30") != -1) {
                    this.$commonJs.getLoading()
                    if (this.disabledList.isDisabled3 != true) {
                        window.sessionStorage.setItem("routeType", "30")
                        // this.$router.push("/GetStatistics");
                        // this.getMessage();
                        // this.getInitStatus();
                        this.getInitStatus()
                        this.$commonJs.getCloseLoading()
                    }
                } else {
                    return false
                }
            }
            if (type == "KMS") {
                if (this.type.indexOf("40") != -1) {
                    if (this.disabledList.isDisabled4 != true) {
                        window.sessionStorage.setItem("routeType", "40")
                        // this.$router.push("/GetStatistics");
                        // this.getMessage();
                        this.getInitStatus()
                    }
                } else {
                    return false
                }
            }
            // window.sessionStorage.setItem("activePath", "GetStatistics");
        },
        getInitStatus() {
            // this.$commonJs.getInitStatus().then((res) => {
            // if (
            //     res.data.data == true ||
            //     (res.data.data == false &&
            //         this.$commonJs.getStorage().routeType != "10"
            // ) {
            this.$router.push("/GetStatistics")
            window.sessionStorage.setItem("activePath", "GetStatistics")
            window.sessionStorage.setItem("isHomepPage", true)
            // } else if (
            //     res.data.data == false &&
            //     this.$commonJs.getStorage().routeType == "10"
            // ) {
            //     this.$router.push("/initInstallList");
            //     window.sessionStorage.setItem(
            //         "activePath",
            //         "/initInstallList"
            //     );
            // }
            // console.log(res.data.data, "res");
            // this.getMessage();
            // });
        },
        divBoxmouseOver(type) {
            if (type == 1) {
                if (this.disabledList.isDisabled3 == false) {
                    this.getDivBoxHover(".CAStyle, .icon-CAS", ".divBox3")
                }
            }
            if (type == 2) {
                if (this.disabledList.isDisabled3 == false) {
                    this.getDivBoxHover(
                        ".KMSStyle, .icon-KMSguanli",
                        ".divBox4"
                    )
                }
            }
            if (type == 3) {
                if (this.disabledList.isDisabled2 == false) {
                    this.getDivBoxHover(
                        ".QMStyle, .icon-qianmingyanqianshebei",
                        ".divBox2"
                    )
                }
            }
            if (type == 4) {
                if (this.disabledList.isDisabled1 == false) {
                    // $(".HMSStyle, .el-icon-lock")
                    //     .removeClass("blackColor")
                    //     .addClass("whiteColor");
                    // $(".divBox1").removeClass("divBox").addClass("divBoxHover");
                    this.getDivBoxHover(".HMSStyle, .el-icon-lock", ".divBox1")
                }
            }
        },
        divBoxmouseLeave(type) {
            if (type == 1) {
                if (this.disabledList.isDisabled3 == false) {
                    this.getDivBox(".CAStyle, .icon-CAS", ".divBox3")
                }
            }
            if (type == 2) {
                if (this.disabledList.isDisabled3 == false) {
                    this.getDivBox(".KMSStyle, .icon-KMSguanli", ".divBox3")
                }
            }
            if (type == 3) {
                if (this.disabledList.isDisabled2 == false) {
                    this.getDivBox(
                        ".QMStyle, .icon-qianmingyanqianshebei",
                        ".divBox2"
                    )
                }
            }
            if (type == 4) {
                if (this.disabledList.isDisabled1 == false) {
                    // $(".HMSStyle, .el-icon-lock")
                    //     .removeClass("whiteColor")
                    //     .addClass("blackColor");
                    // $(".divBox1").removeClass("divBoxHover").addClass("divBox");
                    this.getDivBox(".HMSStyle, .el-icon-lock", ".divBox1")
                }
            }
        },
        getDivBoxHover(name1, name2) {
            $(name1).removeClass("blackColor").addClass("whiteColor")
            $(name2).removeClass("divBox").addClass("divBoxHover")
        },
        getDivBox(name1, name2) {
            $(name1).removeClass("whiteColor").addClass("blackColor")
            $(name2).removeClass("divBoxHover").addClass("divBox")
        }
    }
}
</script>
<style lang="less" scoped>
.typeBgStyle {
    background: #f2f6fc;
    background: url("../../../public/img/typeBg.png") no-repeat;
    height: 100%;
    width: 100%;
}
.disabledStyle {
    background: #a4a6a9;
}
.divBox {
    // width: 287px;
    // height: 294px;
    background: #f5f5f5;
    // background: #a4a6a9;

    border: 1px solid #d7d7d7;
    float: left;
    margin-left: 60px !important;
    margin: 6% auto;
    cursor: not-allowed;
    border-radius: 60px;
}
.divBoxHover {
    width: 300px;
    height: 307px;
    border: 1px solid #008dff;
    float: left;
    background-image: linear-gradient(45deg, #2570ff, #008dff);
    margin-left: 60px !important;
    margin: 6% auto;
    border-radius: 60px;
}

.fontStyle {
    font-size: 50px;
    /* padding: 100px; */
    padding-left: 40%;
    color: #4f4f4f;
    font-family: "宋体";
    font-weight: 600;
}
.fontTypeStyle {
    font-weight: 100;
    margin-left: 40%;
    color: #000;
}
.divBox4 {
    margin-left: 14% !important;
}
@media screen and (min-width: 1400px) {
    .divBox {
        width: 287px;
        height: 294px;
    }
    .divBoxHover {
        width: 300px;
        height: 307px;
    }
    .fontStyle {
        padding-top: 150px;
        font-size: 50px;
    }
    .fontSize {
        font-size: 100px;
        color: #000;
    }
    .iconStyle {
        margin-left: 33%;
    }
    .fontTypeStyle {
        font-size: 35px;
        margin-top: 15px;
    }
    .iconStyle {
        font-size: 100px;
        margin-top: 16%;
    }
    // .fontTypeStyle {
    // }
}
@media screen and (max-width: 1400px) {
    .divBox {
        width: 207px;
        height: 214px;
    }
    .divBoxHover {
        width: 220px;
        height: 227px;
    }
    .fontStyle {
        padding-top: 8%;
        font-size: 40px;
    }
    .fontSize {
        font-size: 75px;
        color: #000;
    }
    .iconStyle {
        margin-left: 32%;
    }
    .fontTypeStyle {
        font-size: 25px;
    }
    .iconStyle {
        font-size: 80px;
        margin-top: 16%;
    }
    .fontTypeStyle {
        margin-top: 5px;
    }
}
/deep/.whiteColor {
    color: #fff !important;
}
/deep/.blackColor {
    color: #000 !important;
}

// .fontSize:hover {
//     color: #fff;
// }
</style>