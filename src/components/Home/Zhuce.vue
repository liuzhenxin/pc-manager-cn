<template>
    <div>
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/GetLogin' }">登录</el-breadcrumb-item>
      <el-breadcrumb-item>用户注册</el-breadcrumb-item>
    </el-breadcrumb> -->
        <el-card class="intanle">
            <span class="h1">用户注册</span>
            <el-button size="mini" @click="goBack" class="el-button1" type="primary" style="float: right">返回</el-button>
        </el-card>
        <el-card>
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="20%">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="注册名:" label-width="25%" prop="name">
                            <el-input placeholder="请输入注册名" style="width: 50%" v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设置密码:" label-width="25%" prop="password">
                            <el-input :type="flag?'password':'text'" placeholder="请输入密码" style="width: 50%" v-model="form.password">
                                <i slot="suffix" :class="[flag?'el-icon-minus':'el-icon-view']" style="margin-top:8px;font-size:18px;" autocomplete="auto" @click="flag=!flag" />
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="确认密码:" label-width="25%" prop="password1">
                            <el-input :type="flag1?'password':'text'" placeholder="请确认密码" style="width: 50%" v-model="form.password1">
                                <!-- <i slot="suffix" :class="[flag1?'el-icon-minus':'el-icon-view']" style="margin-top:8px;font-size:18px;" autocomplete="auto" @click="flag1=!flag1" ></i> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="性别:" prop="gender" label-width="25%">
                            <el-radio-group v-model="form.gender" style="width: 50%">
                                <el-radio label="1">男</el-radio>
                                <el-radio label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
          <el-col :span="12">
            <el-form-item
                          label="联系方式:"
                          label-width="25%"
                          prop="mobile">
              <el-input placeholder="请输入联系方式"
                        style="width: 50%"
                        v-model="form.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
                <el-row>
                    <el-col>
                        <el-form-item label-width="12.5%">
                            <el-button size="mini" type="primary" @click="onUpdate('form')">注册</el-button>
                            <el-button size="mini" @click="goBack">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            flag: true,
            flag1: true,
            form: {
                name: "",
                password: "",
                password1: "",
                // mobile: '',
                gender: ""
            },
            rules: {
                name: [
                    { required: true, message: "请输入注册名", trigger: "blur" }
                ],
                // mobile: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ],
                password1: [
                    { required: true, message: "请确认密码", trigger: "blur" }
                ],
                gender: [
                    { required: true, message: "请选择性别", trigger: "blur" }
                ]
            }
        };
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        onUpdate(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    const data = {
                        name: this.form.name,
                        password: this.form.password,
                        password1: this.form.password1,
                        mobile: this.form.mobile,
                        gender: this.form.gender
                    };
                    if (this.form.password != this.form.password1) {
                        this.$message.error(
                            "两次输入密码不同，请重新确认密码!"
                        );
                    } else {
                    }
                }
            });
        }
    }
};
</script>