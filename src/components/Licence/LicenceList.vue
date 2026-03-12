<template>
    <div class="typeBgStyle">
        <div class="initBox">
            <el-card style="background:#f3f3f3;padding:10% 5%">
                <!-- <div class="boxStyle">新用户首次登录请先修改密码。</div> -->
                <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :offset="10">
                            <div class="boxStyle" style="margin-left:0%;font-size:25px;">系统授权</div>

                        </el-col>
                        <el-col :offset="5">
                            <el-form-item label="设备标识:" label-width="110px">
                                <!-- <el-select v-model="modifyForm.mac" placeholder="请选择设备标识" style="width: 25%">
                                    <el-option v-for="item in macList" :key="item.value" :label="item.label" :value="item.label">
                                    </el-option>
                                </el-select> -->
                                <el-input style="width: 37.5%" v-model="sn" placeholder="请选择设备标识" disabled>
                                </el-input>
                                <el-button size="mini" type="primary" style="padding:3px 15px;margin-left:17px" @click="copyData">申请请求文件</el-button>

                            </el-form-item>
                            <el-form-item label="授权信息:" label-width="110px">
                                <el-input style="width:37.5%;" type="textarea" :rows="5" id="myInput" v-model="Information" placeholder="请输入授权信息">
                                </el-input>
                            </el-form-item>

                        </el-col>
                        <el-col :offset="10" style="padding-top:60px">
                            <el-button size="mini" type="primary" style="padding:5px 30px;margin-left:1.5%" @click="addPINStr('modifyForm')">确定</el-button>
                        </el-col>

                    </el-row>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    inject: ["reload"],
    data() {
        return {
            userId: "",
            fileList: [],
            flag1: true,
            flag2: true,
            flag3: true,
            modifyForm: {
                mac: ""
            },
            MyHeader: {},
            Information: "",
            macList: [],
            sn: "",
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
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
            }
        }
    },
    created() {
        // this.getMacList()
        this.getSN()
        // this.MyHeader = {
        //     Authorization: window.sessionStorage.getItem("Authorization")
        // };
        // this.userId = this.$commonJs.getStorage().RoleList[0].user_id;
        // this.actionUrl =
        //     this.$url.Importlic +
        //     "?" +
        //     "organization_id=" +
        //     this.$commonJs.getStorage().organization_id;
    },

    methods: {
        getMacList() {
            this.$commonJs
                .getMethodData(this.$url.GwDeviceGet, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        let data = res.data.data
                        data.forEach((item) => {
                            if (item.mac != null) {
                                this.macList.push({
                                    label: item.name + " : " + item.mac,
                                    value: item.name
                                })
                            }
                        })
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch((err) => {})
        },
        getSN() {
            this.$commonJs
                .getMethodData(this.$url.GwSNGet, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        let data = res.data.data
                        this.sn = data
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch((err) => {})
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
            this.fileList = []
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!")
            return
        },
        handleSuccess(file) {
            console.log(file, "file")

            if (file.code == 100000) {
                this.$message.success("上传成功!")
                this.showFile = true
                this.$router.push("/GetStatistics")
                window.sessionStorage.setItem("activePath", "GetStatistics")
            } else {
                this.fileList = []
                this.$message.error(file.msg)
                this.showFile = false
                if (file.code == "990001") {
                    this.$router.push("/GetLogin").catch((err) => {
                        console.log("输出报错", err)
                    })
                    sessionStorage.clear()
                }
            }
            return
        },
        addPINStr(formName) {
            // this.$refs[formName].validate((valid) => {
            //     if (!valid) return;
            if (this.Information == "")
                return this.$message.error("请输入授权信息!")
            this.$commonJs
                .getMethodData(this.$url.GwLicenceImport, "POST", {
                    licence: this.Information
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("获取授权信息成功!")
                        //this.reload()
                        window.location.reload()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch((err) => {})
            //         })
            //         .catch((err) => err);
            // }, 300);
            // });
        },
        copyData() {
            // let str = "Vue字符串保存到txt文件下载到电脑案例";
            // let blob = new blob([str]); //如果后台返回的直接是blob对象类型，直接获取数据
            // let _fileName = dlText.txt;

            // link.style.display = "none";
            // const url = window.URL || window.webkitURL || window.moxURL;
            // link.href = window.URL.createObjectURL(blob);
            // link.download = _fileName; //下载的文件名称
            // link.click();
            // window.URL.revokeObjectURL(url); // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E

            //     let strData = new Blob([str], { type: 'text/plain;charset=utf-8' });
            //     saveAs(strData, "测试文件下载.txt");
            // let a = document.createElement("a");
            // a.href = "text/plain";
            // a.innerHTML("heloa");
            // a.setAttribute("download", "dlText.txt", "text/plain");
            // a.click();

            // let a = document.createElement("a");
            // a.href = this.commonUrl;
            // a.setAttribute("download", this.commonUrl);
            // a.click();
            // download("hello world", "dlText.txt", "text/plain");
            // /* 获取文本内容 */
            // var copyText = document.getElementById("myInput");

            // /* 选择复制内容 */
            // copyText.select();
            // copyText.setSelectionRange(0, 99999); /* 为移动设备设置 */

            // /* 复制内容到文本域 */
            // navigator.clipboard.writeText(copyText.value);

            // /* 弹出已复制的内容 */
            // // alert("复制的文本为: " + copyText.value);

            // this.$message.success("复制的文本为: " + copyText.value);

            // this.exportRaw("text.txt", this.macList[0].label)
            // this.exportRaw("licenseRequest.txt", this.modifyForm.mac)
            this.exportRaw("licenseRequest.txt", this.sn)
        },

        fakeClick(obj) {
            var ev = document.createEvent("MouseEvents")
            ev.initMouseEvent(
                "click",
                true,
                false,
                window,
                0,
                0,
                0,
                0,
                0,
                false,
                false,
                false,
                false,
                0,
                null
            )
            obj.dispatchEvent(ev)
        },
        exportRaw(name, data) {
            var urlObject = window.URL || window.webkitURL || window
            var export_blob = new Blob([data])
            var save_link = document.createElementNS(
                "http://www.w3.org/1999/xhtml",
                "a"
            )
            save_link.href = urlObject.createObjectURL(export_blob)
            save_link.download = name
            this.fakeClick(save_link)
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-input.is-disabled .el-input__inner {
    cursor: pointer !important;
}
/deep/.el-upload-list__item {
    width: 70% !important;
}
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    font-size: 22px;
    font-weight: 600;
    margin-left: 12%;
    margin-bottom: 40px;
}
.typeBgStyle {
    background: #f2f6fc;
    background: url("../../../public/img/typeBg.png") no-repeat;
    height: 100%;
    width: 100%;
    // padding-top: 5%;
}
.initBox {
    width: 70%;
    padding-top: 8%;
    margin-left: 15%;
    height: 60%;
}
</style>
