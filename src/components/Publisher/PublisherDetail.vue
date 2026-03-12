<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/PublisherList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="20" :offset="3" v-if="$commonJs.getStorage().isAdmin == true">
                        <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                            <addOrg style="margin-left:20px;width:1680px" @organization_id="organization_id" :organizationId="organizationId" :detail="1"></addOrg>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="姓名:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入姓名" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="conf:" label-width="21%" prop="conf">
                            <el-input class="inputwid" type="textarea" v-model="form.conf" placeholder="请输入conf" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="类型:" label-width="21%" prop="type">
                            <el-select v-model="form.type" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
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
import addOrg from "../organization/addOrg.vue";
export default {
    inject: ["reload"],
    components: { addOrg },
    data() {
        return {
            name: "kk",
            mode: this.$route.query.mode,
            publisherId: this.$route.query.id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",
            form: {
                id: "",
                conf: "",
                name: "", // 名称
                organization_id: "",
                remark: "",
                type: ""
            },
            rules: {
                conf: [
                    {
                        required: true,
                        message: "请输入conf",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ],
                organization_id: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ]
            },
            systemTypeList: [
                {
                    label: "1",
                    value: "1"
                }
            ],
            organizationId: 0
        };
    },

    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
        }

        if (this.mode != 1) {
            this.getAppDetail();
            if (this.mode == 3) {
                this.name = "修改发布者";
            } else {
                this.isDisable = true;
                this.name = "发布者详情";
            }
        } else {
            this.name = "新增发布者";
        }

        this.$nextTick(() => {
            this.$refs.form.resetFields();
        });
    },
    methods: {
        // 获取详情
        getAppDetail() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.PublisherById, "POST", {
                    id: this.publisherId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                        this.organizationId = this.form.organization_id;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.$commonJs.getCloseLoading();
                });
        },
        organization_id(val) {
            this.form.organization_id = val;
        },
        cancel() {
            this.$router.push("/PublisherList");
        },

        onUpdate(formName) {
            let url;
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let data = this.$commonJs.getScreenValue(this.form);
                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.PublisherAdd;
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
                    url = this.$url.PublisherUpd;
                    this.$commonJs;
                    this.$confirm("是否修改此条发布者?", "提示", {
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
<style lang="less" scoped>
/deep/ .ORG .el-form-item__error {
    left: 90px !important;
}
</style>
