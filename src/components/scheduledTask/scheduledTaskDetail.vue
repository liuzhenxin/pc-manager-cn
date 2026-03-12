<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/scheduledTaskList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">

                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="名称:" label-width="21%" prop="job_name">
                            <el-input class="inputwid" v-model="form.job_name" placeholder="请输入名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="编码:" label-width="21%" prop="code">
                            <el-input class="inputwid" v-model="form.code" placeholder="请输入编码" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="调用目标字符串:" label-width="21%" prop="invoke_target">
                            <el-input type="textarea" class="inputwid" v-model="form.invoke_target" placeholder="请输入调用目标字符串" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="任务组名:" label-width="21%" prop="job_group">
                            <el-input class="inputwid" v-model="form.job_group" placeholder="请输入调用目标字符串" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="请求类型:" label-width="21%" prop="invoke_type">
                            <el-radio-group v-model="form.invoke_type" style="width: 50%">
                                <el-radio label="10">bean方法</el-radio>
                                <el-radio label="20">http</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="cron执行表达式:" label-width="21%" prop="cron_expression">
                            <el-input class="inputwid" v-model="form.cron_expression" placeholder="请输入cron执行表达式" :disabled="isDisable"></el-input>

                            <!-- <el-select v-model="form.cron_expression" placeholder="请选择同步周期" style="width:40%">
                                <el-option v-for="item in TimeList" :key="item.value" :label="item.name" :value="item.val">
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="并发执行:" label-width="21%" prop="concurrent">
                            <el-radio label="1" v-model="form.concurrent">允许</el-radio>
                            <el-radio label="0" v-model="form.concurrent">禁止</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="任务状态:" label-width="21%" prop="status">
                            <el-radio label="1" v-model="form.status">正常</el-radio>
                            <el-radio label="2" v-model="form.status">暂停</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="计划策略:" label-width="21%" prop="misfire_policy">
                            <el-select v-model="form.misfire_policy" placeholder="请选择计划策略" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in misfireList" :key="item.value" :label="item.label" :value="item.value">
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
                        <el-button size="mini" @click="cancel" type="warning" style="margin-bottom:10px" v-if="mode != 1">取消</el-button>
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
            name: "角色信息",
            mode: this.$route.query.mode,
            jobId: this.$route.query.id,
            isDisable: false,
            radio: "",

            dialogVisible: false,
            form: {
                code: "", // 编码
                // 并发执行 0:禁止 1:允许
                concurrent: "0",
                // cron_expression - cron执行表达式
                cron_expression: "",
                // invoke_target - 调用目标字符串
                invoke_target: "",
                // invoke_type - 请求类型 10:bean方法 20:http
                invoke_type: "10",
                // job_group * 任务组名
                job_group: "",
                // job_name *名称
                job_name: "",
                status: "1", // 任务状态  1:正常 2:暂停
                remark: "",
                misfire_policy: "0" //  计划策略 0:默认 1:立即触发执行 2:触发一次执行 3:不触发立即执行
            },
            rules: {
                code: [
                    {
                        required: true,
                        message: "请输入编码",
                        trigger: "blur"
                    }
                ],
                concurrent: [
                    {
                        required: true,
                        message: "请选择允许并发执行",
                        trigger: "blur"
                    }
                ],
                cron_expression: [
                    {
                        required: true,
                        message: "请输入cron执行表达式",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择任务状态",
                        trigger: "change"
                    }
                ],

                invoke_target: [
                    {
                        required: true,
                        message: "请输入调用目标字符串",
                        trigger: "blur"
                    }
                ],
                invoke_type: [
                    {
                        required: true,
                        message: "请输入请求类型",
                        trigger: "blur"
                    }
                ],
                job_group: [
                    {
                        required: true,
                        message: "请输入任务组名",
                        trigger: "blur"
                    }
                ],
                job_name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur"
                    }
                ],

                misfire_policy: [
                    {
                        required: true,
                        message: "请选择计划策略",
                        trigger: "blur"
                    }
                ]
            },

            misfireList: [
                {
                    value: "",
                    label: ""
                },
                {
                    value: "0",
                    label: "默认"
                },
                {
                    value: "1",
                    label: "立即触发执行"
                },
                {
                    value: "2",
                    label: "触发一次执行"
                },
                {
                    value: "3",
                    label: "不触发立即执行"
                }
            ],
            TimeList: []
        };
    },
    watch: {
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
        this.getTimeList();
        if (this.mode != 1) {
            this.getJobById();

            if (this.mode == 3) {
                this.name = "修改定时任务信息";
            } else {
                this.isDisable = true;
                this.name = "定时任务详情";
            }
        } else {
            this.name = "新增定时任务";
        }

        this.$nextTick(() => {
            this.$refs.form.resetFields();
        });
    },
    methods: {
        // 获取详情
        getJobById() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.GetJobById, "POST", {
                    id: this.jobId
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
            this.$router.push("/scheduledTaskList");
        },
        getTimeList() {
            this.$commonJs
                .getMethodData(this.$url.DataAll, "POST", {
                    dictionary_code: "cron_expression"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.TimeList = res.data.data;
                        console.log(res.data.data, "formPing");
                    }
                });
        },
        onUpdate(formName) {
            let url;
            console.log(
                this.$commonJs.getScreenValue(this.form),
                "this.$commonJs.getScreenValue(this.form);"
            );
            this.$refs[formName].validate((valid) => {
                if (!valid) return;

                let data = this.$commonJs.getScreenValue(this.form);
                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.GetJobAdd;
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
                    url = this.$url.GetJobUpd;
                    this.$confirm("是否修改此条定时任务?", "提示", {
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
