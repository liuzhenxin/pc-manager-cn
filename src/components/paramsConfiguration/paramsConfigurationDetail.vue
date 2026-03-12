<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/paramsConfigurationList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">

                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="名称:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="编码:" label-width="21%" prop="code">
                            <el-input class="inputwid" v-model="form.code" placeholder="请输入编码" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="参数键值:" label-width="21%" prop="val">
                            <el-input class="inputwid" v-model="form.val" placeholder="请输入参数键值" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="说明:" label-width="21%" prop="illustrate">
                            <el-input type="textarea" class="inputwid" v-model="form.illustrate" placeholder="请输入说明" :disabled="isDisable"></el-input>

                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="备注:" label-width="21%" prop="remark">
                            <el-input type="textarea" class="inputwid" v-model="form.remark" placeholder="请输入备注" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: "参数配置信息",
            mode: this.$route.query.mode,
            paramsId: this.$route.query.id,
            isDisable: false,
            isSystemYype: true,
            form: {
                illustrate: "",
                val: "",
                remark: "",
                name: "",
                code: "" // 排序
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur"
                    }
                ],
                code: [
                    {
                        required: true,
                        message: "请输入编码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },

    created() {
        if (this.mode != 1) {
            this.getRolesDetail();
            if (this.mode == 3) {
                this.name = "修改参数配置信息";
            } else {
                this.isDisable = true;
                this.name = "参数配置详情";
            }
        } else {
            this.name = "新增参数配置";
        }

        // this.form.organization_id = JSON.parse(
        //     window.sessionStorage.getItem("roles")
        // )[0].organization_id;
    },
    methods: {
        // 获取详情
        getRolesDetail() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.GetParamsDetail, "POST", {
                    id: this.paramsId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.$commonJs.getCloseLoading();
                });
        },

        cancel() {
            this.$router.push("/paramsConfigurationList");
        },
        onUpdate(formName) {
            let url;
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                // this.form.organization_id = this.organizationId;
                let data = this.$commonJs.getScreenValue(this.form);
                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.GetAddParamsList;
                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.cancel();
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                            console.log(res, "res");
                        });
                }
                if (this.mode == 3) {
                    url = this.$url.GetParamsModify;
                    this.$confirm("是否修改此参数配置?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(url, "POST", data)
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.cancel();
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg);
                                    }
                                    console.log(res, "res");
                                });
                        })
                        .catch((err) => err);
                }
            });
        }
    }
};
</script>
