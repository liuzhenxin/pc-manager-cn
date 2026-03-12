<template>
    <div class="typeBgStyle">
        <div class="initBox">
            <el-card style="background:#f3f3f3;padding:10% 5%">
                <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <el-col :offset="7">
                            <div class="boxStyle">新用户首次登录请先修改密码。</div>

                            <el-form-item label="原密码:" label-width="110px" prop="oldPass">
                                <el-input class="searchInputClass" style="width:25%" v-model="modifyForm.oldPass" prefix-icon="el-icon-lock" :type="flag1 ? 'password' : 'text'" placeholder="请输入原密码">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="新密码:" label-width="110px" prop="newPass">
                                <el-input class="searchInputClass" style="width:25%" v-model="modifyForm.newPass" placeholder="请输入新密码" prefix-icon="el-icon-lock" :type="flag2 ? 'password' : 'text'">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="确认密码:" label-width="120px" prop="newPass1" style="margin-left:-10px">
                                <el-input class="searchInputClass" style="width:25%" v-model="modifyForm.newPass1" placeholder="请确认新密码" prefix-icon="el-icon-lock" :type="flag3 ? 'password' : 'text'">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :offset="10" style="padding-top:30px">
                            <el-button size="mini" type="primary" style="padding:5px 30px;margin-left:20px" @click="addPINStr('modifyForm')">确 <span style="margin-left:10px"> 定 </span></el-button>
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
            flag1: true,
            flag2: true,
            flag3: true,
            modifyForm: {
                oldPass: "",
                newPass: "",
                newPass1: ""
            },
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
        this.userId = this.$commonJs.getStorage().RoleList[0].user_id;
    },

    methods: {
        addPINStr(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                if (this.modifyForm.newPass === this.modifyForm.oldPass) {
                    this.$message.error("新密码不能与原密码重复!");
                    return false;
                }
                if (this.modifyForm.newPass !== this.modifyForm.newPass1) {
                    this.$message.error("新密码和确认密码不一致!");
                    return false;
                }

                setTimeout(() => {
                    this.$confirm("是否修改密码?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then((res) => {
                            this.$commonJs
                                .getMethodData(
                                    this.$url.UpdatePassword,
                                    "POST",
                                    {
                                        id: this.userId,
                                        new_password: this.modifyForm.newPass,
                                        old_password: this.modifyForm.oldPass,
                                        status: "20"
                                    }
                                )
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.$message.success(
                                            "修改密码成功,请重新登录!"
                                        );
                                        setTimeout(() => {
                                            this.$router.push("/GetLogin");
                                        }, 1000);
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg);
                                    }
                                })
                                .catch((err) => {});
                        })
                        .catch((err) => err);
                }, 300);
            });
        }
    }
};
</script>
<style lang="less" scoped>
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    background: #f4f5f7;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #67c23a;
    font-weight: 500;
    margin-left: 2%;
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
