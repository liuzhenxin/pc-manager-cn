<template>
    <div>
        <!-- 面包屑导航区域 -->
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/0' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>修改个人密码</el-breadcrumb-item>
    </el-breadcrumb> -->
        <el-card>
            <span class="h1">修改个人密码</span>
            <el-button size="mini" type="primary" style="float: right; margin-bottom: 20px" @click="goback">返回</el-button>
        </el-card>
        <el-card>
            <el-form label-position="right" :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item label="请输入旧密码" label-width="10%" prop="oldPassword">
                    <el-input :type="flag1 ? 'password' : 'text'" v-model="ruleForm.oldPassword" size="medium" style="width: 300px">
                        <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1"></i> -->
                    </el-input>
                </el-form-item>
                <el-form-item label="请输入新密码" label-width="10%" prop="newPassword">
                    <el-input :type="flag2 ? 'password' : 'text'" v-model="ruleForm.newPassword" size="medium" style="width: 300px">
                        <!-- <i slot="suffix" :class="[flag2 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag2 = !flag2"></i> -->
                    </el-input>
                </el-form-item>
                <el-form-item label="请确认新密码" label-width="10%" prop="newPasswords">
                    <el-input :type="flag3 ? 'password' : 'text'" v-model="ruleForm.newPasswords" size="medium" style="width: 300px">
                        <!-- <i slot="suffix" :class="[flag3 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag3 = !flag3"></i> -->
                    </el-input>
                </el-form-item>
                <el-form-item label-width="8%">
                    <el-button size="mini" type="primary" @click="editPsd('ruleForm')" :disabled="disabled">确认</el-button>
                    <el-button size="mini" @click="canelPsd">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import md5 from "js-md5";
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
        return {
            MyHeader: { Authorization: "", fp: "" },
            flag1: true, //旧密码
            flag2: true, //新密码
            flag3: true, //确认密码
            disabled: false,
            password: "",
            // 修改密码表单的数据绑定对象
            ruleForm: {
                oldPassword: "",
                newPassword: "",
                newPasswords: ""
            },
            // 修改密码表单的验证规则对象
            rules: {
                oldPassword: [
                    {
                        required: true,
                        message: "请输入旧密码",
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 15,
                        message: "长度在 6 到 15 个字符",
                        trigger: "blur"
                    }
                ],
                newPassword: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 15,
                        message: "长度在 6 到 15 个字符",
                        trigger: "blur"
                    }
                ],
                newPasswords: [
                    {
                        required: true,
                        validator: validatePass,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.MyHeader.Authorization = localStorage.getItem("Authorization"); //获取Authorization
        this.MyHeader.fp = localStorage.getItem("fp"); //浏览器指纹fp
    },
    methods: {
        // 修改密码
        editPsd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const data = {
                        oldPassword: md5(this.ruleForm.oldPassword),
                        newPassword: md5(this.ruleForm.newPassword),
                        newPasswords: md5(this.ruleForm.newPasswords)
                    };
                    this.$http
                        .put(
                            this.$url.updatePassword(
                                data.oldPassword,
                                data.newPassword
                            )
                        )
                        .then((res) => {
                            if (res.data.success === "true") {
                                this.$message.success("密码修改成功!");
                                window.sessionStorage.clear();
                                this.$router.push("/GetLogin");
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
        // 取消修改密码
        canelPsd() {
            this.$message.info("已取消修改密码!");
            this.$commonJs.addTab("首页", "GetStatistics");
            this.reload();
        },
        //返回上一页
        goback() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="less" scoped>
.h1 {
    font-size: 20px;
    font-weight: bold;
}
</style>
