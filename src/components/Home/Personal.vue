<template>
    <div>


        <el-card style="margin-top: -15px !important; ">
            <el-form v-loading="loading" label-position="right" :model="personalForm" :rules="personalFormRoles" ref="personalFormRef">
                <!-- <el-form-item label="用户类型:" label-width="25%" prop="userType">
          <el-select
            v-model="personalForm.userType"
            placeholder="请选择用户类型"
            style="width: 80%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
                <el-form-item label="用户类型:" label-width="25%">
                    <span style="margin-left: 3px;">{{personalForm.userType1}}</span>

                    <!-- <el-checkbox-group v-model="checkedUserType">
                        <el-checkbox v-for="userType in userTypeList" :label="userType.value" :key="userType.value" :disabled="flag">{{ userType.label }}</el-checkbox>
                    </el-checkbox-group> -->
                    <!-- <el-input
                        :disabled="flag"
                        style="width: 45%"
                        v-model="form.articleTitle"></el-input> -->
                </el-form-item>
                <el-form-item label="用户名:" label-width="25%" prop="userName">
                    <el-input placeholder="请输入用户名" style="width: 80%" v-model="personalForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="性别:" prop="gender" label-width="25%">
                    <el-radio-group v-model="personalForm.gender" style="width: 50%">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="获赞总数:" label-width="25%" prop="">
                    <img src="../../../public/img/logo.jpg" alt="" class="zhanCss" />
                    <span class="getPraiseNum">{{personalForm.thumbUpCount}}</span>
                </el-form-item>
                <el-form-item label="联系方式:" label-width="25%" prop="mobile1">
                    <el-input placeholder="请输入手机号" style="width: 80%" v-model="personalForm.mobile1" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="备用手机号:" label-width="25%" prop="mobile2">
                    <el-input placeholder="请输入手机号" style="width: 80%" v-model="personalForm.mobile2" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="邮箱:" label-width="25%" prop="text">
                    <el-input placeholder="请输入邮箱" style="width: 80%" v-model="personalForm.email"></el-input>
                </el-form-item>
                <!-- <el-form-item label="微信号:" label-width="25%" prop="text">
          <el-input
            placeholder="请输入微信号"
            style="width: 80%"
            v-model="personalForm.wechatNo"
          ></el-input>
        </el-form-item> -->
                <el-form-item label="地址:" label-width="25%" prop="text">
                    <el-input placeholder="请输入地址" style="width: 80%" v-model="personalForm.address"></el-input>
                </el-form-item>
                <el-form-item label="头像:" label-width="25%" prop="pictureId">
                    <!-- <el-input v-model="taskPic" style="width: 45%"></el-input> -->
                    <!-- 上传图片 -->
                    <!-- class="{ disabled: isMax }" -->
                    <!-- <el-upload :class="{hide:hideUpload}" :action="UploadPics" list-type="picture-card" :file-list="picture" :on-success="success" :headers="MyHeader" :on-preview="handlePictureCardPreview" :limit="1" :on-exceed="handleExceed" :on-remove="handlePicRemove" :on-error="error" :before-remove="handleBeforeRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload> -->
                    <!-- <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" v-if="logo" alt />
                    </el-dialog> -->
                </el-form-item>
                <el-form-item label-width="8%" style="text-align: center">
                    <el-button size="mini" type="primary" @click="editPsd('personalForm')" :disabled="disabled">确认</el-button>
                    <el-button size="mini" @click="canelPsd">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import md5 from "js-md5";
import commonJs from "../../assets/js/common.js"; //共通js方法
export default {
    inject: ["reload"],
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.newPassword) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        var inputPhone = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入手机号"));
                this.loading = false;
            } else if (!commonJs.numberPhone(value)) {
                callback(new Error("格式不符，请填写正确的手机号!"));
                this.loading = false;
            } else {
                callback();
            }
        };
        return {
            loading: false,
            radio: 3,
            MyHeader: { currentRole: "", Authorization: "", fp: "" },
            userId: "",
            flag1: true, //旧密码
            flag2: true, //新密码
            flag3: true, //确认密码
            disabled: false,
            isMax: false,
            logo: true,
            flag: true,
            picture: [],
            hideUpload: false,
            dialogVisible: false,
            dialogImageUrl: "",
            password: "",
            UploadPics: this.$url.UploadAvatars,
            // 修改密码表单的数据绑定对象
            personalForm: {
                // userType:"",
                userName: "",
                gender: "1",
                mobile1: "",
                mobile2: "",
                email: "",
                // wechatNo: "",
                address: "",
                pictureId: ""
            },
            checkedUserType: [], //用户类型选中
            enabled: "1", //是否可用
            //用户类型多选值
            userTypeList: [
                {
                    value: "1",
                    label: "经纪人"
                },
                {
                    value: "2",
                    label: "商圈经理"
                },
                {
                    value: "3",
                    label: "商户财务"
                },
                {
                    value: "4",
                    label: "人事行政总经理"
                },
                {
                    value: "5",
                    label: "店东"
                },
                {
                    value: "6",
                    label: "平台管理员"
                },
                {
                    value: "7",
                    label: "交易中心"
                }
            ],
            // 修改密码表单的验证规则对象
            personalFormRoles: {
                userName: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }
                ],
                mobile1: [
                    { required: true, validator: inputPhone, trigger: "blur" }
                ]
            },
            pictureId: ""
        };
    },
    created() {
        // this.pictureId = window.localStorage.getItem("pictureId")
        // if (this.pictureId != "null" || this.pictureId != "") {
        //     this.hideUpload = true
        // }
        // if (this.pictureId == "null" || this.pictureId == "") {
        //     this.hideUpload = false
        // }
        // this.userId = localStorage.getItem("userId") //获取userId
        // this.MyHeader.Authorization = localStorage.getItem("Authorization") //获取Authorization
        // this.MyHeader.fp = localStorage.getItem("fp") //浏览器指纹fp
        // this.roleType = window.localStorage.getItem("roleType")
        // if (this.roleType == undefined) {
        //     this.MyHeader.currentRole = localStorage
        //         .getItem("userType")
        //         .charAt(0)
        // } else {
        //     this.MyHeader.currentRole = localStorage.getItem("roleType")
        // }
        // this.GetUserDetail();
        this.$commonJs.getCloseLoading();
    },
    watch: {
        pictureId(val) {
            // if (val == null) {
            //     this.hideUpload = !this.hideUpload
            // } else {
            //     // this.hideUpload = true
            // }
            console.log(val);
        }
    },
    methods: {
        // 详情
        async GetUserDetail() {
            this.$commonJs.getLoading();
            await this.$http
                .get(this.$url.GetUserDetail, {
                    params: {
                        userId: encodeURIComponent(this.userId)
                    }
                })
                .then((res) => {
                    var that = this;
                    if (res.data.msgCode == 1) {
                        that.personalForm = res.data.dtList[0];
                        that.enabled = res.data.dtList[0].enabled;
                        that.dialogImageUrl = res.data.dtList[0].url;
                        that.personalForm.userType1 = "";
                        var userType = that.personalForm.userType;
                        if (userType.indexOf("1") != -1) {
                            that.personalForm.userType1 = "经纪人,\xa0\xa0";
                        }
                        if (userType.indexOf("2") != -1) {
                            that.personalForm.userType1 += "商圈经理,\xa0\xa0";
                        }
                        if (userType.indexOf("3") != -1) {
                            that.personalForm.userType1 += "商户财务,\xa0\xa0";
                        }
                        if (userType.indexOf("4") != -1) {
                            that.personalForm.userType1 +=
                                "人事行政总经理,\xa0\xa0";
                        }
                        if (userType.indexOf("5") != -1) {
                            that.personalForm.userType1 += "店东,\xa0\xa0";
                        }
                        if (userType.indexOf("6") != -1) {
                            that.personalForm.userType1 +=
                                "平台管理员,\xa0\xa0";
                        }
                        if (userType.indexOf("7") != -1) {
                            that.personalForm.userType1 += "交易中心,";
                        }
                        // 去除最后面的逗号
                        if (that.personalForm.userType1.length > 0) {
                            that.personalForm.userType1 =
                                that.personalForm.userType1.substr(
                                    0,
                                    that.personalForm.userType1.lastIndexOf(",")
                                );
                        }
                        var uuu = {
                            name: that.personalForm.pictureId,
                            url:
                                that.$url.avatarsPicSrc +
                                that.personalForm.pictureId
                        };
                        // this.picture.push(uuu);
                        if (
                            that.personalForm.pictureId == "" ||
                            that.personalForm.pictureId == null
                        ) {
                            that.picture = [];
                            that.isMax = false;
                        } else if (
                            that.personalForm.pictureId != "" ||
                            that.personalForm.pictureId != null
                        ) {
                            that.picture.push(uuu);
                            that.isMax = true;
                        }
                        if (that.num == 1) {
                            if (
                                that.personalForm.pictureId == "" ||
                                that.personalForm.pictureId == null
                            ) {
                                that.isMax = true;
                            }
                        }
                        this.loading = false;
                    } else {
                        this.loading = false;
                        that.$message.success(res.message);
                    }
                });
        },
        // 修改个人信息
        editPsd() {
            this.$refs.personalFormRef.validate(async (valid) => {
                if (valid) {
                    const data = {
                        userName: this.personalForm.userName,
                        // userType: this.personalForm.userType,
                        gender: this.personalForm.gender,
                        mobile1: this.personalForm.mobile1,
                        mobile2: this.personalForm.mobile2,
                        email: this.personalForm.email,
                        // wechatNo: this.personalForm.wechatNo,
                        address: this.personalForm.address,
                        pictureId: this.personalForm.pictureId
                    };
                    this.$http
                        .put(this.$url.UpdateUserInfo, data)
                        .then((res) => {
                            if (res.data.msgCode == "1") {
                                window.localStorage.setItem(
                                    "staffName",
                                    this.personalForm.userName
                                );
                                if (this.personalForm.pictureId != "") {
                                    window.localStorage.setItem(
                                        "pictureId",
                                        this.personalForm.pictureId
                                    );
                                } else {
                                    window.localStorage.setItem(
                                        "pictureId",
                                        null
                                    );
                                }

                                this.reload();
                                this.loading = false;
                                this.$message.success("个人信息修改成功!");
                            } else {
                                this.loading = false;
                                this.$message.error(res.data.message);
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        // 取消修改个人信息
        canelPsd() {
            this.$commonJs.addTab("首页", "GetStatistics");
            this.reload();
        },
        //返回上一页
        goback() {
            this.$router.go(-1);
        },
        success(response, file) {
            console.log(file);
            this.personalForm.pictureId = response.id;
            if (this.personalForm.pictureId.length > 0) {
                this.hideUpload = true;
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handlePicRemove(file, fileList) {
            console.log(file);

            // this.$confirm(`确认移除 ？`).then(() => {
            this.$commonJs.deleteImg(file, "avatars");
            // })
            this.personalForm.pictureId = "";
            // 把内存图片清空
            window.localStorage.setItem("pictureId", null);
            console.log(this.personalForm.pictureId);
            if (this.personalForm.pictureId.length == 0) {
                this.hideUpload = false;
            }
        },
        handleExceed() {
            this.$message.success("最多只能上传一张图片!");
        },
        // change: function (file, fileList) {
        //     if (fileList.length >= 1) {
        //         this.isMax = true
        //     } else if (fileList.length == 0) {
        //         this.isMax = false
        //     }
        // },
        error: function (err, file, fileList) {
            this.$message.error("上传失败");
            // if (fileList.length >= 1) {
            //     this.isMax = true
            // } else {
            //     this.isMax = false
            // }
        },
        async handleBeforeRemove(file, fileList) {
            // console.log(fileList)
            // console.log(file)
            this.personalForm.pictureId = "";
            if (this.num == 2) {
                // this.mm = file.response.id
                var mm = file.url.slice(42);
                this.mm = mm;
                var data = {
                    pictureId: this.mm,
                    moduleName: "PetBreed"
                };
                const { data: res } = await this.$http.delete(
                    this.$url.deleteOneFile(this.mm, data.moduleName),
                    {
                        data
                    }
                );
                if (res.msgCode == 1) {
                    this.$message.success("删除成功!");
                    this.isMax = false;
                    this.personalForm.pictureId = "";
                } else if (res.msgCode != 1) {
                    this.$message.error(res.message);
                    this.personalForm.pictureId = "";
                    this.isMax = false;
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
.h1 {
    font-size: 20px;
    font-weight: bold;
}
.hide /deep/ .el-upload--picture-card {
    display: none !important;
}
.getPraiseNum {
    width: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: super;
    height: 30px;
    display: inline-block;
    // margin-left: 6px;
    font-size: 18px;
}
</style>


