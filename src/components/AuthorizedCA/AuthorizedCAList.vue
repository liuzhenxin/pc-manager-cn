<template>
    <div class="typeBgStyle">
        <div class="initBox">
            <el-card style="background:#f3f3f3;padding:10% 5%">
                <!-- <div class="boxStyle">新用户首次登录请先修改密码。</div> -->
                <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :offset="2">
                            <el-form-item label="CA操作系统:" label-width="110px">
                                <el-select v-model="modifyForm.temp" placeholder="请选择操作系统" style="width: 75%">
                                    <el-option v-for="item in tempList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="CA授权信息:" label-width="110px">
                                <el-input style="width:65%" id="myInput" disabled v-model="Information" placeholder="请点击按钮获取授权信息获取" type="text">
                                </el-input>
                                <el-button size="mini" type="primary" style="padding:3px 30px;margin-left:17px" @click="copyData">复制</el-button>

                            </el-form-item>
                            <el-form-item label="导入CA授权文件:" label-width="140px" style="margin-left:-30px">
                                <el-upload class="upload-demo" :show-file-list="true" :action="actionUrl" :on-remove="handleRemove" :on-exceed="handleExceed" :file-list="fileList" :headers="MyHeader" :limit="1" :on-success="handleSuccess">
                                    <el-button icon="el-icon-plus" plain size="mini" type="primary">选择CA授权文件</el-button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                        <el-col :offset="10" style="padding-top:30px">
                            <el-button size="mini" type="primary" style="padding:5px 30px" @click="addPINStr('modifyForm')">获取授权信息</el-button>
                        </el-col>

                    </el-row>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userId: "",
            fileList: [],
            flag1: true,
            flag2: true,
            flag3: true,
            modifyForm: {
                temp: ""
            },
            MyHeader: {},
            Information: "",
            tempList: [
                {
                    label: "Windows",
                    value: "0"
                },
                {
                    label: "Linux",
                    value: "1"
                }
            ],
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
        };
    },
    created() {
        this.MyHeader = {
            Authorization: window.sessionStorage.getItem("Authorization")
        };
        this.userId = this.$commonJs.getStorage().RoleList[0].user_id;
        this.actionUrl =
            this.$url.Importlic +
            "?" +
            "organization_id=" +
            this.$commonJs.getStorage().organization_id;
    },

    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.fileList = [];
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!");
            return;
        },
        handleSuccess(file) {
            console.log(file, "file");

            if (file.code == 100000) {
                this.$message.success("上传成功!");
                this.showFile = true;
                this.$router.push("/GetStatistics");
                window.sessionStorage.setItem("activePath", "GetStatistics");
            } else {
                this.fileList = [];
                this.$message.error(file.msg);
                this.showFile = false;
                if (file.code == "990001") {
                    this.$router.push("/GetLogin").catch((err) => {
                        console.log("输出报错", err);
                    });
                    sessionStorage.clear();
                }
            }
            return;
        },
        addPINStr(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;

                if (this.modifyForm.temp == "") {
                    this.$message.error("请选择操作系统!");
                    return false;
                }
                this.$commonJs
                    .getMethodData(
                        this.$url.GetlicenseStr,
                        "POST",
                        this.modifyForm
                    )
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.Information = res.data.data;
                            this.$message.success("获取授权信息成功!");
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg);
                        }
                    })
                    .catch((err) => {});
                //         })
                //         .catch((err) => err);
                // }, 300);
            });
        },
        copyData() {
            /* 获取文本内容 */
            var copyText = document.getElementById("myInput");

            /* 选择复制内容 */
            copyText.select();
            copyText.setSelectionRange(0, 99999); /* 为移动设备设置 */

            /* 复制内容到文本域 */
            navigator.clipboard.writeText(copyText.value);

            /* 弹出已复制的内容 */
            // alert("复制的文本为: " + copyText.value);

            this.$message.success("复制的文本为: " + copyText.value);
        }
    }
};
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
    background: #f4f5f7;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #67c23a;
    font-weight: 500;
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
