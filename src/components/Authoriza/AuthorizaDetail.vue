<template>
    <div v-loading="loading">
        <div>
            <el-card class="navDetailItem">
                <span class="h1">新增证书颁发机构</span>
                <el-button size="mini" class="el-button1" type="warning" @click="cancel()" style="float: right;margin-bottom:15px">返回</el-button>
            </el-card>
            <el-card class="navDetailItem" style="margin-top:10px !important">
                <div style="margin-bottom:15px;margin-top:15px">
                    <el-row>
                        <el-col :span="3">
                            <el-upload class="upload-demo" style="display:inline-block" :show-file-list="showFile" :headers="MyHeader" :action="actionUrl" :on-success="handleSuccess" :on-exceed="handleExceed" multiple :limit="1" :file-list="fileList">
                                <el-button style="" type="primary" size="mini" icon="l-icon-plus">上传根证书文件(.cer)</el-button>
                            </el-upload>
                        </el-col>
                        <!-- <el-col :span="15">
                            <el-form ref="form" :model="form" :rules="rules" label-position="right" style="margin-bottom:10px;margin-top:7px">
                                <el-form-item label="用户名:" label-width="10%" style="" prop="name">
                                    <el-input class="inputwid" v-model="form.name" style="width:30%" placeholder="请输入用户名"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col> -->
                    </el-row>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showFile: false,
            name: "角色信息",
            mode: this.$route.query.mode,
            organizationId: "",
            isDisable: false,
            loading: false,
            fileList: [],
            MyHeader: { Authorization: "" },
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            form: {
                name: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }
                ]
            },
            isAdmin: false
        };
    },
    watch: {
        "formOCSP.master_status"(val) {
            if (val == "20") {
            }
        },
        "form.organization_name"(val) {
            console.log(val, val);
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("organization_name");
                });
            }
        },
        "form.status"(val) {
            console.log(val, val);
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("status");
                });
            }
        },
        "form.cron_expression"(val) {
            console.log(val, val);
            if (val != "") {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate("cron_expression");
                });
            }
        }
    },
    created() {
        this.MyHeader.Authorization =
            window.sessionStorage.getItem("Authorization");
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.actionUrl =
                this.$url.UploadCert +
                "?" +
                "organization_id=" +
                this.$commonJs.getStorage().organization_id;
        } else {
            this.isAdmin = true;
        }
        this.name = "新增证书颁发机构";
    },
    methods: {
        organization_id(data) {
            console.log(data, "pppppppppppp");
            this.organizationId = data;
            this.actionUrl =
                this.$url.UploadCert + "?" + "organization_id=" + data;
        },

        cancel() {
            this.$router.push("/AuthorizaList");
        },

        handleExceed() {
            this.$message.error("只能上传一个文件!");
        },

        handleSuccess(file) {
            if (file.code == 100000) {
                this.showFile = true;
                this.$message.success(file.attrs.CheckCaCertMsg);
                this.cancel();
            } else {
                this.fileList = [];
                this.$nextTick(() => {
                    this.showFile = false;
                });

                if (JSON.stringify(file.attrs) != "{}") {
                    this.$message.error(file.attrs.CheckCaCertMsg);
                    console.log(this.fileList, " this.fileList");

                    setTimeout(() => {
                        this.$message.error(file.msg);
                    }, 1000);
                } else {
                    this.$message.error(file.msg);
                }
            }
        }
    }
};
</script>
