<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/managementList' }">
                <el-button size="mini" class="el-button1" type="warning"
                    style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle" v-if="mode != 2">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%"
                style="margin-bottom:20px">

                <el-row :gutter="20">

                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="系统类型:" label-width="21%" prop="system_type">
                            <el-select v-model="form.system_type" placeholder="请选择系统类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="20" :offset="3" v-if="$commonJs.getStorage().isAdmin == true">
                        <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                            <addOrg style="margin-left:20px;width:1680px" @organization_id="organization_id"
                                :organizationId="organizationId" :detail="1"></addOrg>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="应用名称:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入应用名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="mode != 2">
                        <el-form-item label="IP地址:" label-width="21%" prop="ip">
                            <el-input class="inputwid" v-model="form.ip" placeholder="请输入IP地址(多个IP用逗号分隔)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="mode == 2">
                        <el-form-item label="访问地址:" label-width="21%" prop="ip">
                            <el-input class="inputwid" v-model="form.ip" placeholder="请输入IP地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="应用说明:" label-width="21%" prop="profile">
                            <el-input type="textarea" class="inputwid" v-model="form.profile"
                                placeholder="请输入应用说明"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1"
                            style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2"
                            style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>
        <el-card class="intanle" v-if="mode == 2">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20">
                    <div style="display: flex;flex-direction: column;width: 50%;margin: auto;">
                        <borderTitle title="应用信息" style="display:inline-block">
                            <el-col :span="12" :offset="6">
                                <el-form-item label="应用名称:" label-width="42%" prop="">
                                    {{ form.name }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="应用标识:" label-width="42%" prop="">
                                    {{ form.appid }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="访问地址:" label-width="42%" prop="">
                                    {{ form.ip }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="应用说明:" label-width="42%" prop="">
                                    {{ form.profile }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="创建时间:" label-width="42%" prop="">
                                    {{ form.create_time }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                    </div>
                </el-row>
            </el-form>
        </el-card>

    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue"
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    inject: ["reload"],
    components: { addOrg, borderTitle },
    data() {
        return {
            name: "",
            mode: this.$route.query.mode,
            appId: this.$route.query.id,
            type: this.$route.query.type,
            radio: "",
            form: {
                id: "",
                ip: "",
                name: "", // 名称
                organization_id: "",
                organizationArr: [],
                profile: ""
            },
            organizationList: [],
            rules: {
                ip: [
                    {
                        required: true,
                        message: "请输入IP地址(多个IP用逗号分隔)",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请输入应用名称",
                        trigger: "blur"
                    }
                ],
                profile: [
                    {
                        required: true,
                        message: "请输入应用说明",
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
            organizationId: 0
        }
    },
    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        }

        if (this.mode != 1) {
            this.getAppDetail()
            if (this.mode == 3) {
                this.name = "修改应用"
            } else {
                this.name = "应用详情"
            }
        } else {
            this.name = "新增应用"
        }
    },
    methods: {
        // 获取详情
        getAppDetail() {
            this.$commonJs.getLoading()
            this.$commonJs
                .getMethodData(this.$url.GetAppById, "POST", {
                    id: this.appId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.form = res.data.data
                        this.organizationId = this.form.organization_id
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
                })
        },

        organization_id(val) {
            this.form.organization_id = val
        },
        cancel() {
            this.$router.push("/managementList")
        },
        onUpdate(formName) {
            let url
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                let regexp =
                    /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
                let valdata = this.form.ip.split(",")
                let isCorrect = true
                if (valdata.length) {
                    for (let i = 0; i < valdata.length; i++) {
                        if (regexp.test(valdata[i]) == false) {
                            isCorrect = false
                        }
                    }
                }
                if (!isCorrect) {
                    this.$message.error("IP地址不正确")
                    return
                }
                let data = this.$commonJs.getScreenValue(this.form)

                if (this.mode == 1) {
                    url = this.$url.GetAddApp
                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.cancel()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                }
                if (this.mode == 3) {
                    url = this.$url.GetUpdApp
                    this.$commonJs
                    this.$confirm("是否修改此条应用管理?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.$commonJs
                                .getMethodData(url, "POST", data)
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.cancel()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                    }
                                })
                        })
                        .catch((err) => err)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .ORG .el-form-item__error {
    left: 90px !important;
}

.el-form {
    .el-form-item {
        /deep/ .el-form-item__label {
            font-weight: 600;
            font-size: 15px;
        }
    }
}
</style>
