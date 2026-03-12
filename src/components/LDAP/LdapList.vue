<template>
    <div v-loading="loading">
        <!-- 配置OCSP验证 -->
        <div>
            <el-card class="navDetailItem">
                <el-form ref="form" :model="formOCSP" :rules="rulesOCSP" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row :gutter="20">
                        <!-- <el-col :span="12" :offset="6">
                            <el-form-item label="颁发机构:" label-width="21%" prop="appcert_serial_number">
                                <el-input class="inputwid" v-model="formOCSP.appcert_serial_number" disabled placeholder="请输入颁发机构"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12" :offset="6">
                            <el-form-item label="主OCSP服务器地址:" label-width="21%" prop="master_ocsp">
                                <el-input class="inputwid" v-model="formOCSP.master_ocsp" placeholder="请输入主OCSP服务器地址"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="是否启用:" label-width="21%" prop="master_status">
                                <el-switch active-value="20" inactive-value="10" v-model="formOCSP.master_status" active-color="#13ce66"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="从OCSP服务器地址:" label-width="21%" prop="slave_ocsp">
                                <el-input class="inputwid" v-model="formOCSP.slave_ocsp" placeholder="请输入从OCSP服务器地址"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="是否启用:" label-width="21%" prop="slave_status">
                                <el-switch active-value="20" inactive-value="10" v-model="formOCSP.slave_status" active-color="#13ce66"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <!-- <el-button size="mini" @click="cancel" type="warning">取消</el-button> -->
                                <el-button size="mini" type="primary" @click="onUpdate('form','OCSP')" style="margin-bottom:10px">提交</el-button>
                            </el-form-item>
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
            name: "",
            CertId: this.$route.query.id,
            appcertNum: "LDAP",
            organizationId: "",
            isDisable: false,
            loading: false,
            formOCSP: {
                appcert_serial_number: "", // 根证书颁发机构【根证书序列号】
                organization_id: "", // 组织机构id
                master_ocsp: "", // 主地址
                master_status: "10", // 主状态 20:启用【enabled】 10:停用【disable】
                slave_ocsp: "", // 从地址
                slave_status: "10" // 从状态
            },
            rulesOCSP: {
                master_ocsp: [
                    {
                        required: true,
                        message: "请输入主OCSP服务器地址",
                        trigger: "blur"
                    }
                ]
                // master_status: [
                //     {
                //         required: true,
                //         message: "请选择主状态",
                //         trigger: "blur"
                //     }
                // ]
            }
        };
    },
    watch: {
        "formOCSP.master_status"(val) {
            if (val == "20") {
            }
        }
    },
    created() {
        this.name = "配置OCSP验证";
        this.formOCSP.organization_id =
            this.$commonJs.getStorage().organization_id;
        this.getOcspById();
    },
    methods: {
        // 获取Ocsp详情
        getOcspById() {
            this.loading = false;
            this.$commonJs
                .getMethodData(this.$url.CAGetOcspUrlById, "POST", {
                    appcert_serial_number: this.appcertNum
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        // this.formOCSP.appcert_serial_number = res.data.data;
                        if (res.data.data != null) {
                            this.formOCSP = res.data.data;
                        }
                        this.formOCSP.organization_id =
                            this.$commonJs.getStorage().organization_id;
                        this.loading = false;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                        this.loading = false;
                    }
                });
        },

        onUpdate(formName, type) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                this.formOCSP.appcert_serial_number = this.appcertNum;
                let data = this.$commonJs.getScreenValue(this.formOCSP);
                this.$confirm("是否配置OCSP验证?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.loading = true;
                        this.$commonJs
                            .getMethodData(this.$url.CAAddOcsp, "POST", data)
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.loading = false;
                                    // this.cancel();
                                    this.getOcspById();
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg);
                                    this.loading = false;
                                }
                                console.log(res, "res");
                            });
                    })
                    .catch((err) => err);
            });
        }
    }
};
</script>
