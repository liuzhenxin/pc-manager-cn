<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/CustomTemList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <!-- <el-row :gutter="20"> -->
                <!-- <el-col :span="20" :offset="3" v-if="$commonJs.getStorage().isAdmin == true">
                        <el-form-item label="" label-width="21%" prop="organization_id" class="ORG">
                            <addOrg style="margin-left:20px;width:1680px" @organization_id="organization_id" :detail="1"></addOrg>
                        </el-form-item>
                    </el-col> -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="标题:" label-width="21%" prop="title">
                            <el-input class="inputwid" v-model="form.title" placeholder="请输入标题" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="OID:" label-width="21%" prop="oid">
                            <el-input class="inputwid" v-model="form.oid" placeholder="请输入OID" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="描述:" label-width="21%" prop="description">
                            <el-input class="inputwid" v-model="form.description" placeholder="请输入描述" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序:" label-width="21%" prop="sort">
                            <el-input class="inputwid" v-model="form.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否关键:" label-width="21%" prop="critical">
                            <el-radio v-model="form.critical" label="1" :disabled="isDisable">是</el-radio>
                            <el-radio class="radioStyle" v-model="form.critical" label="0" :disabled="isDisable">否</el-radio>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="是否必选:" label-width="21%" prop="required">
                            <el-radio v-model="form.required" label="1" :disabled="isDisable">是</el-radio>
                            <el-radio class="radioStyle" v-model="form.required" label="0" :disabled="isDisable">否</el-radio>
                        </el-form-item>
                    </el-col> -->

                    <!-- <el-col :span="12">
                        <el-form-item label="请求中允许:" label-width="21%" prop="permitted_in_request">
                            <el-radio v-model="form.permitted_in_request" label="1" :disabled="isDisable">是</el-radio>
                            <el-radio class="radioStyle" v-model="form.permitted_in_request" label="0" :disabled="isDisable">否</el-radio>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="状态:" label-width="21%" prop="status">
                            <el-radio v-model="form.status" label="20" :disabled="isDisable">启用</el-radio>
                            <el-radio v-model="form.status" label="10" :disabled="isDisable">禁用</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否自定义扩展项:" label-width="21%" prop="extend">
                            <el-radio-group v-model="extend" @change="extendChange">
                                <el-radio label="1" :disabled="isDisable">是</el-radio>
                                <el-radio class="radioStyle" label="0" :disabled="isDisable">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" v-if="isExtend == true">
                        <el-form-item label="字段名:" label-width="21%" prop="field_name">
                            <el-input class="inputwid" v-model="form.field_name" placeholder="请输入字段名" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-col :span="12" :offset="8" v-if="extend == '0'">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>
        <el-card v-if="isExtend == true">
            <el-row>
                <el-col :span="12">
                    <span class="h1">子配置项</span>
                </el-col>
                <el-col :span="12" style="text-align:right">
                    <!-- <span style="cursor: pointer">新增子配置项</span> -->
                    <el-button size="mini" class="el-button1" @click="addExtend" type="primary" style="" icon="el-icon-plus" plain>新增子配置项</el-button>
                </el-col>
            </el-row>
        </el-card>

        <el-card v-show="isExtend == true" style="padding:20px 0" v-for="(item,index) in ExtendList" :key="index">
            <div>
                <el-form :ref="'ExtendListForm'+index" :model="ExtendList[index]" :rules="ExtendRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目字段名:" label-width="21%" prop="item_field">
                                <el-input class="inputwid" v-model="ExtendList[index].item_field" placeholder="请输入字段名" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目名称:" label-width="21%" prop="item_name">
                                <el-input class="inputwid" v-model="ExtendList[index].item_name" placeholder="请输入字段名" :disabled="isDisable"></el-input>
                                <i class="el-icon-close" style="margin-right: 40px;font-size:25px;color:#F56C6C;cursor:pointer" @click="delExtend(index)
                                "></i>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型:" label-width="21%" prop="type_lv1">
                                <el-select v-model="ExtendList[index].type_lv1" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                    <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="ExtendList[index].type_lv1=='text'">
                            <el-form-item label="二级类型:" label-width="21%" prop="type_lv2">
                                <el-select v-model="ExtendList[index].type_lv2" placeholder="请选择类型" style="width: 60%" :disabled="isDisable">
                                    <el-option v-for="item in systemTypeListTwo" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12" v-else>
                            <el-form-item label="状态:" label-width="21%" prop="status">
                                <el-radio v-model="ExtendList[index].status" label="20" :disabled="isDisable">启用</el-radio>
                                <el-radio v-model="ExtendList[index].status" label="10" :disabled="isDisable">禁用</el-radio>
                            </el-form-item>
                        </el-col> -->

                        <el-col :span="12" v-else>
                            <el-form-item label="例子:" label-width="21%" prop="example">
                                <el-input class="inputwid" v-model="ExtendList[index].example" placeholder="请输入例子" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item label="是否必选:" label-width="21%" prop="required">
                                <el-radio v-model="ExtendList[index].required" label="1" :disabled="isDisable">是</el-radio>
                                <el-radio class="radioStyle" v-model="ExtendList[index].required" label="0" :disabled="isDisable">否</el-radio>
                            </el-form-item>
                        </el-col> -->

                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="默认值:" label-width="21%" prop="default_vals">
                                <el-input class="inputwid" v-model="ExtendList[index].default_vals" placeholder="请输入默认值" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序:" label-width="21%" prop="sort">
                                <el-input class="inputwid" v-model="ExtendList[index].sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12" v-if="ExtendList[index].type_lv1=='text'">
                            <el-form-item label="例子:" label-width="21%" prop="example">
                                <el-input class="inputwid" v-model="ExtendList[index].example" placeholder="请输入例子" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12" >
                            <el-form-item label="状态:" label-width="21%" prop="status">
                                <el-radio v-model="ExtendList[index].status" label="20" :disabled="isDisable">启用</el-radio>
                                <el-radio v-model="ExtendList[index].status" label="10" :disabled="isDisable">禁用</el-radio>
                            </el-form-item>
                        </el-col> -->
                        <!-- <el-col :span="12" v-for="(itemVal,indexVal) in ExtendList[index].item_vals" :key="indexVal" v-show="ExtendList[index].type_lv1=='select' || ExtendList[index].type_lv1=='radio' || ExtendList[index].type_lv1=='checkbox'">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item :label="'项目值集合'+(indexVal+1) +':'" label-width="42%" prop="item_vals">
                                        <el-input class="inputwid" style="width:60%" v-model="itemVal.label" placeholder="请输入label" :disabled="isDisable"></el-input>
                                        <span style="margin-left:5px">-</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" class="vals1Style">
                                    <el-form-item prop="item_vals1" style="">
                                        <el-input class="inputwid" style="width:37%;margin-left:-19%" v-model="itemVal.value" placeholder="请输入value" :disabled="isDisable"></el-input>
                                        <el-button size="mini" @click="AddVal(index)" type="primary" plain icon="el-icon-plus" style="margin-left:10px">添加</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col> -->
                    </el-row>
                </el-form>
            </div>
            <el-card style="padding:20px 0;margin-bottom:20px" v-if="ExtendList[index].type_lv1=='select' || ExtendList[index].type_lv1=='radio' || ExtendList[index].type_lv1=='checkbox'">
                <el-row style="">
                    <el-col>
                        <el-button size="mini" @click="openExtVal(ExtendList[index].item_vals)" type="primary" icon="el-icon-plus">添加项目值</el-button>
                    </el-col>
                </el-row>
                <el-table :ref="'itemValForm'+index" :key="num" v-loading="loading" :data="ExtendList[index].item_vals" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">

                    <el-table-column label="label" prop="label"></el-table-column>
                    <el-table-column label="value" prop="value"></el-table-column>
                    <el-table-column label="操作" width="230">
                        <template slot-scope="scope">
                            <el-button @click.native.stop="removeExtVal(scope.row,scope.$index,index,ExtendList[index].item_vals)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                            <el-button @click.native.stop="handleDelete(scope.row,index,ExtendList[index].item_vals,scope.$index)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                        </template>
                    </el-table-column>
                    <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                        <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                        <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                    </div>
                </el-table>
                <!-- 分页区域 -->
                <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNow" :page-sizes="[10, 20, 50]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination> -->
            </el-card>
        </el-card>

        <el-card v-if="(isExtend == true && ExtendList.length != 0 ) || (isDelExt == true  && isExtend == true )  " style="">
            <el-row :gutter="20">
                <el-col :span="12" :offset="5" style="text-align:center">
                    <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="">取消</el-button>
                    <el-button size="mini" @click="AddAll()" type="primary">保 存</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog title="新增项目值" :visible.sync="ExtValDialog" width="30%" :before-close="resetExtVal">
            <el-form ref="ExtValForm" :model="ExtValForm" :rules="ExtValRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="3" style="">
                        <el-form-item label="label:" label-width="21%" prop="label">
                            <el-input class="inputwid" v-model="ExtValForm.label" placeholder="请输入label" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="3" style="">
                        <el-form-item label="value:" label-width="21%" prop="value">
                            <el-input class="inputwid" v-model="ExtValForm.value" placeholder="请输入value" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- <span>登录方式:</span>
            <el-radio style="margin-left:10px" v-model="radio" label="1">用户名登录</el-radio>
            <el-radio v-model="radio" label="2">证书登录</el-radio> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetExtVal" size="mini">取 消</el-button>
                <el-button type="primary" @click="AddExtVal()" size="mini">确 定</el-button>
            </span>
        </el-dialog>
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
            ProfId: this.$route.query.id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",
            loading: false,
            isExtend: false,
            ExtValDialog: false,
            isDelExt: false,
            ExtValForm: {
                label: "",
                value: ""
            },
            ExtValRules: {
                label: [
                    {
                        required: true,
                        message: "请输入label",
                        trigger: "blur"
                    }
                ],
                value: [
                    {
                        required: true,
                        message: "请输入value",
                        trigger: "blur"
                    }
                ]
            },
            extend: "0",

            form: {
                title: "",
                id: "",
                oid: "",
                sort: "",
                critical: "0",
                // required: "0",
                // field_name: "",
                // permitted_in_request: "0",
                name: "", // 名称
                organization_id: "",
                description: "",
                type: "",
                status: "20"
                // childrenForm: {
                //     // 二级
                //     item_field: "",
                //     item_name: "",
                //     type_lv1: "",
                //     type_lv2: "",
                //     example: "",
                //     item_vals: "",
                //     default_vals: ""
                // }
            },
            addExtendForm: {},
            ExtendList: [],
            ExtValList: [],
            rules: {
                oid: [
                    {
                        required: true,
                        message: "请输入OID",
                        trigger: "blur"
                    }
                ],
                title: [
                    {
                        required: true,
                        message: "请输入标题",
                        trigger: "blur"
                    }
                ],
                organization_id: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ],
                description: [
                    {
                        required: true,
                        message: "请输入描述",
                        trigger: "blur"
                    }
                ],
                field_name: [
                    {
                        required: true,
                        message: "请输入字段名",
                        trigger: "blur"
                    }
                ]
            },
            ExtendRules: {
                item_field: [
                    {
                        required: true,
                        message: "请输入项目字段名",
                        trigger: "blur"
                    }
                ],
                item_name: [
                    {
                        required: true,
                        message: "请输入项目名称",
                        trigger: "blur"
                    }
                ],
                type_lv1: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "blur"
                    }
                ],
                required: [
                    {
                        required: true,
                        message: "请选择是否必填",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择状态",
                        trigger: "blur"
                    }
                ],
                item_vals: [
                    {
                        required: true,
                        message: "请输入项目值集合",
                        trigger: "blur"
                    }
                ]
            },
            systemTypeList: [
                // 一级类型(text:文本 textarea:文本域 password:密码 select:下拉框 radio:单选 checkbox:复选 file:文件)
                {
                    label: "文本",
                    value: "text"
                },
                {
                    label: "文本域",
                    value: "textarea"
                },
                {
                    label: "密码",
                    value: "password"
                },
                {
                    label: "下拉框",
                    value: "select"
                },
                {
                    label: "单选",
                    value: "radio"
                },
                {
                    label: "复选",
                    value: "checkbox"
                }
                // {
                //     label: "文件",
                //     value: "file"
                // }
            ],
            systemTypeListTwo: [
                //  二级类型(date:日历 datetime:日历带时分秒 email:邮箱 url:url地址 tel:电话 number:整型 float:浮点)
                {
                    label: "日历",
                    value: "date"
                },
                {
                    label: "日历带时分秒",
                    value: "datetime"
                }
                // {
                //     label: "邮箱",
                //     value: "email"
                // },
                // {
                //     label: "地址",
                //     value: "url"
                // },
                // {
                //     label: "电话",
                //     value: "tel"
                // },
                // {
                //     label: "整型",
                //     value: "number"
                // },
                // {
                //     label: "浮点",
                //     value: "float"
                // }
            ],
            type: "",
            ExtIndex: "",
            copyList: [],
            faterIndex: "",
            uploadList: [],
            num: 0
        };
    },

    created() {
        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id;
        }

        if (this.mode != 1) {
            this.getProfDetail();
            if (this.mode == 3) {
                this.name = "修改自定义模板";
            } else {
                this.isDisable = true;
                this.name = "自定义模板详情";
            }
        } else {
            this.name = "新增自定义模板";
        }

        this.$nextTick(() => {
            this.$refs.form.resetFields();
        });
    },
    methods: {
        // 获取详情
        getProfDetail() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.ProfById, "POST", {
                    id: this.ProfId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.form = res.data.data;
                        this.ExtendList =
                            res.data.data.caProfileExtensionItemList;

                        this.ExtendList.forEach((item, index) => {
                            this.ExtendList[index].item_vals = JSON.parse(
                                item.item_vals
                            );
                        });
                        this.$delete(this.form, "caProfileExtensionItemList");
                        if (this.ExtendList.length != 0) {
                            this.extend = "1";
                            this.isExtend = true;
                        } else {
                            this.extend = "0";
                            this.isExtend = false;
                        }
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
            this.$router.push("/CustomTemList");
        },
        onUpdate(formName) {
            let url;
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                let data = this.$commonJs.getScreenValue(this.form);
                console.log(data, "data");
                if (this.mode == 1) {
                    url = this.$url.ProfAdd;
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
                    url = this.$url.ProfUpd;

                    this.$confirm("是否修改此条自定义模板?", "提示", {
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
        },
        // 新增子配置项
        addExtend() {
            // this.isExtend = true;
            // this.$message.success("新增成功");
            this.addExtendForm = {
                // 二级
                item_field: "",
                item_name: "",
                type_lv1: "",
                type_lv2: "",
                example: "",
                item_vals: [
                    // {
                    //     label: "1",
                    //     value: "5"
                    // }
                ],
                // item_vals1: "",
                default_vals: ""
                // status: "20"
                // required: "0"
            };
            this.ExtendList.push(this.addExtendForm);
            console.log(this.ExtendList, "ExtendList");
        },
        // 新增、修改项目值集合
        AddExtVal() {
            this.$refs.ExtValForm.validate((valid) => {
                if (!valid) return;

                if (this.type != "remove") {
                    this.ExtValList = this.ExtValList.push({
                        label: this.ExtValForm.label,
                        value: this.ExtValForm.value
                    });
                } else {
                    console.log(
                        this.ExtValList,
                        this.ExtValForm,
                        this.ExtIndex,
                        this.faterIndex,
                        "this.ExtValForm"
                    );

                    this.$set(this.ExtValList, this.ExtIndex, {
                        label: this.ExtValForm.label,
                        value: this.ExtValForm.value
                    });
                    this.ExtendList[this.faterIndex].item_vals =
                        this.ExtValList;
                }

                console.log(
                    "00000成功",
                    this.ExtValList,
                    this.ExtendList,
                    this.ExtValForm
                );
                this.ExtValDialog = false;
            });
        },
        // 打开弹窗
        openExtVal(formName) {
            this.type = "";
            this.ExtValList = formName;
            this.ExtValDialog = true;
            this.ExtValForm = {
                label: "",
                value: ""
            };
            console.log(this.ExtValList, this.ExtValForm, "this.ExtValList");
        },
        // 重置表单
        resetExtVal() {
            this.$refs.ExtValForm.clearValidate("label");
            this.$refs.ExtValForm.clearValidate("value");
            console.log(this.ExtValList[this.ExtIndex], this.ExtValList);
            this.ExtValDialog = false;
        },
        // 修改项目值集合
        removeExtVal(row, index, index1, data) {
            console.log(row, index, "修改");
            this.ExtValList = data;
            this.ExtValDialog = true;
            this.faterIndex = index1;
            sessionStorage.setItem("copyList", JSON.stringify(row));
            this.ExtValForm = JSON.parse(sessionStorage.getItem("copyList"));
            this.type = "remove";
            this.ExtIndex = index;
        },
        // 添加项目值
        AddVal(index) {
            this.ExtendList[index].item_vals.push({
                label: "",
                value: ""
            });
        },
        // 扩展项改变
        extendChange(data) {
            if (data == "1") {
                this.isExtend = true;
                this.form.field_name = "";
            } else {
                this.isExtend = false;
                this.ExtendList = [];
            }
        },
        // 删除
        handleDelete(row, index, data, $index) {
            // debugger;
            this.$confirm("是否删除此项目值?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.ExtValList = data;
                this.ExtValList.splice($index, 1);
                this.ExtendList[index].item_vals = this.ExtValList;
                // this.num++;
                console.log(
                    this.ExtendList[index].item_vals,
                    this.ExtValList,
                    this.ExtendList,
                    "删除"
                );
            });
        },
        // 保存全部
        AddAll() {
            console.log(this.form, this.ExtendList, "保存");
            let emptyData = this.ExtendList.filter((item) => {
                if (
                    item.type_lv1 == "select" ||
                    item.type_lv1 == "radio" ||
                    item.type_lv1 == "checkbox"
                )
                    return item.item_vals.length == 0;
            });
            if (emptyData.length != 0) {
                this.$message.error("请添加项目值!");
                return;
            }
            let list = [];
            list.push(this.getCheck("form"));

            this.ExtendList.forEach((item, index) => {
                list.push(this.getCheck("ExtendListForm" + index));
            });
            sessionStorage.setItem("obj", JSON.stringify(this.ExtendList));

            Promise.all(list)
                .then((res) => {
                    // debugger;
                    console.log("通过", this.ExtValList, this.ExtendList);
                    this.uploadList = JSON.parse(sessionStorage.getItem("obj"));

                    for (var i = 0; i < this.uploadList.length; i++) {
                        this.uploadList[i].item_vals = JSON.stringify(
                            this.uploadList[i].item_vals
                        );
                    }
                    this.form["profileExtensionItemJson"] = JSON.stringify(
                        this.uploadList
                    );
                    let data = this.$commonJs.getScreenValueCaProf(this.form);

                    console.log(data, "data");

                    if (this.mode == 1) {
                        this.$commonJs
                            .getMethodFormData(this.$url.ProfAdd, "POST", data)
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    this.$message.success("成功!");
                                    sessionStorage.removeItem("obj");
                                    this.cancel();
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg);
                                }
                                console.log(res.data.data, "res,data.data");
                            });
                        console.log(this.uploadList, this.form, "dataList");
                    } else if (this.mode == 3) {
                        this.$confirm("是否修改此条自定义模板?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                            .then(() => {
                                this.$commonJs
                                    .getMethodFormData(
                                        this.$url.ProfUpd,
                                        "POST",
                                        data
                                    )
                                    .then((res) => {
                                        if (res.data.code == 100000) {
                                            this.$message.success("成功!");
                                            sessionStorage.removeItem("obj");

                                            this.cancel();
                                        } else if (res.data.code != 800000) {
                                            this.$message.error(res.data.msg);
                                        }
                                        console.log(
                                            res.data.data,
                                            "res,data.data"
                                        );
                                    });
                                console.log(
                                    this.uploadList,
                                    this.form,
                                    "dataList"
                                );
                            })
                            .catch((err) => {});
                    }
                })

                .catch((err) => {
                    console.log("不通过");
                });
        },
        getCheck(formName) {
            return new Promise((resolve, reject) => {
                if (this.$refs[formName].length != undefined) {
                    this.$refs[formName][0].validate((valid) => {
                        if (!valid) {
                            reject();
                        } else {
                            resolve();
                        }
                    });
                } else {
                    this.$refs[formName].validate((valid) => {
                        if (!valid) {
                            reject();
                        } else {
                            resolve();
                        }
                    });
                }
            });
        },
        delExtend(index) {
            console.log("sss");
            this.$confirm("是否删除子配置项?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$delete(this.ExtendList, index);
                    this.isDelExt = true;
                })
                .catch((err) => err);
        }
    }
};
</script>
<style lang="less" scoped>
/deep/ .ORG .el-form-item__error {
    left: 90px !important;
}
.radioStyle {
    margin-left: 13px;
}
/deep/ .vals1Style .el-form-item__content {
    margin-left: 0% !important;
}
</style>
