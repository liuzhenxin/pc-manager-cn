<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/dataDictionaryList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle" v-loading="loading">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="系统类型:" label-width="21%" prop="system_type">
                            <el-select v-model="form.system_type" placeholder="请选择系统类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
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
                    <el-col :span="12" :offset="6" v-if="type=='isProject'">
                        <el-form-item label="字典键值:" label-width="21%" prop="val">
                            <el-input type="textarea" class="inputwid" v-model="form.val" placeholder="请输入参数键值" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="排序:" label-width="21%" prop="sort">
                            <el-input class="inputwid" v-model="form.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="是否多选:" label-width="21%" prop="is_checkbox" v-if="type!='isProject'">
                            <el-radio v-model="form.is_checkbox" label="1" :disabled="isDisable">是</el-radio>
                            <el-radio v-model="form.is_checkbox" label="0" :disabled="isDisable">否</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="type=='isProject'">
                        <el-form-item label="是否默认:" label-width="21%" prop="is_default">
                            <el-radio v-model="form.is_default" label="1" :disabled="isDisable">是</el-radio>
                            <el-radio v-model="form.is_default" label="0" :disabled="isDisable">否</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-radio v-model="form.status" label="1" :disabled="isDisable">正常</el-radio>
                            <el-radio v-model="form.status" label="0" :disabled="isDisable">停用</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="说明:" label-width="21%" prop="illustrate">
                            <el-input type="textarea" class="inputwid" v-model="form.illustrate" placeholder="请输入说明" :disabled="isDisable"></el-input>
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
            name: "",
            mode: this.$route.query.mode,
            dictionaryId: this.$route.query.id,
            dictionary_id: this.$route.query.dictionary_id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",
            loading: false,
            dialogVisible: false,
            form: {
                id: "",
                code: "", // 编码
                illustrate: "", //  说明
                is_checkbox: "1", // 是否多选
                status: "1", // 状态  1:正常 0:停用
                remark: "",
                dictionary_id: "", // 字典id
                name: "", // 名称
                sort: "", // 排序
                is_default: "1", // 是否默认 1:是 0:否
                val: "" // 字典键值
            },
            rules: {
                code: [
                    {
                        required: true,
                        message: "请输入编码",
                        trigger: "blur"
                    }
                ],
                is_checkbox: [
                    {
                        required: true,
                        message: "请选择是否多选",
                        trigger: "blur"
                    }
                ],
                is_default: [
                    {
                        required: true,
                        message: "请选择是否默认",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择状态",
                        trigger: "change"
                    }
                ],

                name: [
                    {
                        required: true,
                        message: "请输入姓名",
                        trigger: "blur"
                    }
                ],
                sort: [
                    {
                        required: true,
                        message: "请输入排序",
                        trigger: "blur"
                    }
                ]
            }
        };
    },

    created() {
        if (this.mode != 1) {
            console.log(this.dictionary_id, "dictionary_id");
            if (this.dictionary_id != undefined) {
                this.type = "isProject";
            }
            this.getRolesDetail();

            if (this.mode == 3) {
                this.name = "修改字典";
            } else {
                this.isDisable = true;
                this.name = "字典详情";
            }
        } else {
            this.name = "新增字典";
        }

        this.$nextTick(() => {
            this.$refs.form.resetFields();
        });
    },
    methods: {
        // 获取详情
        getRolesDetail() {
            this.loading = true;
            let url;
            if (this.type == "isProject") {
                url = this.$url.GetDictionaryItemById;
            } else {
                url = this.$url.GetDictionaryById;
            }
            this.$commonJs
                .getMethodData(url, "POST", {
                    id: this.dictionaryId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                        this.loading = false;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                        this.loading = false;
                    }
                });
        },

        cancel() {
            this.$router.push("/dataDictionaryList");
        },

        onUpdate(formName) {
            let url;

            this.$refs[formName].validate((valid) => {
                if (!valid) return;

                let data = this.$commonJs.getScreenValue(this.form);
                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.GetDictionaryAdd;
                    if (this.type == "isProject") {
                        url = this.$url.GetDictionaryItemAdd;
                        data.dictionary_id = this.dictionaryId;
                    }
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
                    let name = "数据字典";
                    url = this.$url.GetDictionaryUpd;
                    if (this.type == "isProject") {
                        url = this.$url.GetDictionaryItemUpd;
                        name = "字典项目";
                        // debugger;
                    }

                    this.$confirm("是否修改此" + name + "?", "提示", {
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
