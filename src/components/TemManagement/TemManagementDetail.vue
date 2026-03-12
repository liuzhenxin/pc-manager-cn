<template>
    <div class="navDetailItem" v-loading="loading">
        <el-card class="navDetailItem">
            <span class="h1">{{name}}</span>
            <el-button size="mini" class="el-button1" type="warning" @click="cancel()" style="float: right;margin-bottom:15px">返回</el-button>
        </el-card>
        <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:0px;" class="CardClass">
            <el-tab-pane label="基础信息">
                <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">

                    <el-card class="box-card cardHeader">
                        <div slot="header">
                            <span>模板基本信息</span>
                        </div>
                        <div class="text item contextBody">
                            <el-row :gutter="20" style="margin-top:20px">
                                <el-col :span="12" :offset="6">
                                    <!-- <el-form-item label="" label-width="21%" prop="organization_id" class="ORG" v-if="mode==1">
                                        <addOrg style="margin-left:-70px;width:1655px" :isDisable="isDisable" @organization_id="organization_id" :organizationId="organizationId" :detail="1"></addOrg>
                                    </el-form-item> -->
                                    <span class="redStar" style="margin-left: 76px;">*</span>
                                    <el-form-item :style=" {'margin-top': redStarMarTop}" label="模板名称:" label-width="21%" prop="nameVal">
                                        <!-- {{form.nameVal}} -->
                                        <!-- <el-input v-model="form.nameVal" placeholder="请输入模板名称" class="inputwid" :disabled="isDisable"></el-input> -->
                                        <el-input v-model="nameVal" placeholder="请输入模板名称" class="inputwid" :disabled="isDisable"></el-input>

                                    </el-form-item>
                                    <!-- <el-form-item label="type:" label-width="21%" prop="type">
                                        <el-input v-model="form.type" placeholder="请输入type" class="inputwid" :disabled="isDisable"></el-input>
                                    </el-form-item> -->
                                    <el-form-item label="模板描述:" label-width="21%" prop="metadata_details">
                                        <el-input v-model="form.metadata_details" placeholder="请输入模板描述" class="inputwid" :disabled="isDisable"></el-input>
                                    </el-form-item>
                                    <el-form-item label="证书类型:" label-width="21%" prop="cert_level">
                                        <el-select v-model="form.cert_level" placeholder="请选择证书类型" style="width: 60%" :disabled="isDisable">
                                            <el-option v-for="itemSelect in certTypeList" :key="itemSelect.value" :label="itemSelect.label" :value="itemSelect.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="有效期:" label-width="21%" prop="validity">
                                        <el-input v-model="form.validity" oninput="value=value.replace(/[^\d]/g,'')" style="width: 29%" placeholder="请输入有效期" class="inputwid" :disabled="isDisable"></el-input>
                                        <el-select v-model="dateNum" placeholder="请选择单位" style="width: 29%;margin-left:2%" :disabled="isDisable">
                                            <el-option v-for="itemSelect in dateList" :key="itemSelect.label" :label="itemSelect.label" :value="itemSelect.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="证书是否使用当前时间:" label-width="22%" style="margin-left:-1.5%" prop="keypair_gen_inherit_ca">
                                        <el-radio-group v-model="isCurrent">
                                            <el-radio label="current" :disabled="isDisable">是</el-radio>
                                            <el-radio class="radioStyle" label="0" :disabled="isDisable">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item v-if="isCurrent=='0'" label="证书开始时间:" label-width="21%" prop="not_before_type">
                                        <el-date-picker v-model="form.not_before_type" type="datetime" :disabled="isDisable" style="width: 60%" placeholder="选择证书开始时间">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="密钥对产生位置:" label-width="21%" prop="keypair_gen_keypair_name">
                                        <el-select v-model="form.keypair_gen_keypair_name" placeholder="请选择密钥对产生位置" style="width: 60%" :disabled="isDisable">
                                            <el-option v-for="itemSelect in keyList" :key="itemSelect.value" :label="itemSelect.label" :value="itemSelect.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- <el-form-item label="签名算法:" label-width="21%" prop="signature_algorithms">
                                        <el-checkbox-group v-model="form.signature_algorithms" @change="autographChange" class="subjectStyle">
                                            <div v-for="item in keyAlgorithmList" :key="item.value">
                                                <el-checkbox :label="item.value" :disabled="isDisable">{{item.label}}</el-checkbox>
                                                <span v-for="(itemVal,indexVal) in form.signature_algorithms" :key="indexVal" v-show="'SHA256withRSA'== itemVal && item.value == itemVal">
                                                    <span style="margin-left:50px">密钥模长:</span>
                                                    <el-checkbox-group v-model="form.key_algorithms" @change="keyLenChange" style="display: inline-block;">
                                                        <el-checkbox class="checkLen" v-for="item in keyNumList" :key="item.value" :label="item.value" :disabled="isDisable">{{item.label}}</el-checkbox>
                                                    </el-checkbox-group>
                                                </span>
                                            </div>
                                        </el-checkbox-group>
                                    </el-form-item> -->

                                    <el-form-item label="是否产生密钥对:" label-width="21%" prop="keypair_gen_inherit_ca">
                                        <el-radio-group v-model="form.keypair_gen_inherit_ca">
                                            <el-radio label="1" :disabled="isDisable">是</el-radio>
                                            <el-radio class="radioStyle" label="0" :disabled="isDisable">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否使用请求中的顺序:" label-width="21.8%" style="margin-left:-8px" prop="required">
                                        <el-radio-group v-model="form.subject_rdn_order" @change="extendChange">
                                            <el-radio label="1" :disabled="isDisable">保持csr顺序</el-radio>
                                            <el-radio class="radioStyle" label="2" :disabled="isDisable">保持配置文件顺序</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="主题设置:" label-width="21%" prop="subject_rdns">
                                        <el-checkbox-group v-model="form.subject_rdns" @change="themeChange($event)" class="subjectStyle">
                                            <div v-for="(item,index) in themeList" :key="index">
                                                <el-checkbox style="width:0px" :label="item.value" :disabled="isDisable">{{item.label}}
                                                </el-checkbox>
                                                <span v-for="(itemVal,indexVal) in form.subject_rdns" :key="indexVal" v-show="item.value == itemVal">
                                                    <span style="margin-left:150px">出现次数:</span>
                                                    <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="subject[item.value].minOccurs" @blur="CheckNumVal(subject[item.value].minOccurs,subject[item.value].maxOccurs,'min',itemVal)" placeholder="最小值" class="inputwid" style="width:11%;margin-left:5px;margin-bottom:5px" :disabled="isDisable"></el-input>
                                                    <span style="margin-left:5px">-</span>
                                                    <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="subject[item.value].maxOccurs" @blur="CheckNumVal(subject[item.value].minOccurs,subject[item.value].maxOccurs,'max',itemVal)" placeholder="最大值" class="inputwid" style="width:11%;margin-left:10px" :disabled="isDisable"></el-input>
                                                </span>
                                            </div>
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <!-- <el-form-item label="是否保持主题顺序:" label-width="21%" prop="required">
                                        <el-radio-group v-model="form.subject_keepRdnOrder" @change="extendChange">
                                            <el-radio label="true" :disabled="isDisable">是</el-radio>
                                            <el-radio class="radioStyle" label="false" :disabled="isDisable">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="是否使用请求中的顺序:" label-width="21.8%" style="margin-left:-8px" prop="required">
                                        <el-radio-group v-model="form.subject_csrRdnOrder" @change="extendChange">
                                            <el-radio label="true" :disabled="isDisable">是</el-radio>
                                            <el-radio class="radioStyle" label="false" :disabled="isDisable">否</el-radio>
                                        </el-radio-group>
                                    </el-form-item> -->


                                </el-col>
                                <div v-show="false">
                                    <el-col :span="12" :offset="3">
                                        <!-- text:文本 textarea:文本域 password:密码 select:下拉框 radio:单选 checkbox:复选 -->
                                        <el-form-item label="itemVal.item_name" label-width="21%" prop="system_type">
                                            <!-- select:下拉框 -->
                                            <!-- <div>
                                                <el-select v-model="form.system_type" placeholder="itemVal.example" style="width: 60%" :disabled="isDisable">
                                                    <el-option v-for="itemSelect in itemVal.item_vals" :key="itemSelect.value" :label="itemSelect.label" :value="itemSelect.value">
                                                    </el-option>
                                                </el-select>
                                            </div> -->
                                            <!-- password:密码 -->
                                            <!-- <div>
                                                <el-input type="password" v-model="itemVal.default_vals" placeholder="itemVal.example" class="inputwid" :disabled="isDisable"></el-input>
                                            </div> -->
                                            <!-- textarea:文本域 -->
                                            <!-- <div>
                                                <el-input type="textarea" v-model="itemVal.default_vals" placeholder="itemVal.example" class="inputwid" :disabled="isDisable"></el-input>
                                            </div> -->
                                            <!-- text:文本 -->
                                            <!-- <div>
                                                <el-date-picker v-model="itemVal.default_vals" type="date" placeholder="选择日期">
                                                </el-date-picker>
                                                <el-date-picker v-model="itemVal.default_vals" type="datetime" placeholder="选择日期时间">
                                                </el-date-picker>
                                                <el-input v-model="form.system_type" placeholder="itemVal.example" class="inputwid" :disabled="isDisable"></el-input>
                                            </div> -->
                                            <!-- radio:单选 -->
                                            <!-- <div>
                                                <el-radio-group v-model="extend" @change="extendChange">
                                                    <el-radio v-for="(itemRadio,index) in itemVal.item_vals" :key="index" :label="itemRadio.label" :value="itemRadio.value" :disabled="isDisable"></el-radio>
                                                </el-radio-group>
                                            </div> -->
                                            <!-- checkbox:复选 -->
                                            <!-- <div>
                                                <el-checkbox-group v-model="itemVal.default_vals">
                                                    <el-checkbox class="chexkStyle" v-for="(itemRadio,index) in itemVal.item_vals" :key="index" :label="itemRadio.label" :value="itemRadio.value" :disabled="isDisable"></el-checkbox>
                                                </el-checkbox-group>
                                            </div> -->


                                        </el-form-item>
                                    </el-col>
                                </div>
                            </el-row>
                        </div>
                    </el-card>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="扩展信息">
                <el-form ref="Extendform" :model="Extendform" :rules="ExtendRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                    <div v-for="(item,index) in ProfList" :key="index">
                        <el-card class="box-card cardHeader">
                            <div slot="header">
                                <el-checkbox v-model="selectOid" :disabled="isDisable" :label="item.oid"><span>{{item.title}}</span></el-checkbox>
                            </div>
                            <div class="text item contextBody">
                                <el-row :gutter="20" style="margin-top:20px" v-if="extensions.length!=0">
                                    <el-col :span="12" :offset="3">
                                        <el-form-item label="是否关键:" label-width="21%" prop="critical">
                                            <el-radio v-model="extensions[index].critical" label="1" :disabled="isDisable">是</el-radio>
                                            <el-radio v-model="extensions[index].critical" label="0" :disabled="isDisable">否</el-radio>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" :offset="3">
                                        <el-form-item label="是否必选:" label-width="21%" prop="required">
                                            <el-radio v-model="extensions[index].required" label="1" :disabled="isDisable">是</el-radio>
                                            <el-radio v-model="extensions[index].required" label="0" :disabled="isDisable">否</el-radio>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" :offset="3">
                                        <el-form-item label="请求中允许:" label-width="21%" prop="permittedInRequest">
                                            <el-radio v-model="extensions[index].permittedInRequest" label="1" :disabled="isDisable">是</el-radio>
                                            <el-radio v-model="extensions[index].permittedInRequest" label="0" :disabled="isDisable">否</el-radio>
                                        </el-form-item>
                                    </el-col>
                                    <div v-for="(itemVal,indexVal) in item.caProfileExtensionItemList" :key="indexVal">
                                        <el-col :span="12" :offset="3">
                                            <!-- text:文本 textarea:文本域 password:密码 select:下拉框 radio:单选 checkbox:复选 -->
                                            <el-form-item :label="itemVal.item_name + ':'" label-width="21%" prop="system_type">
                                                <!-- select:下拉框 -->
                                                <!-- {{itemVal.item_vals}} -->
                                                <div v-if="itemVal.type_lv1 == 'select'">
                                                    <el-select v-if="extensions[index].items!=null" v-model="extensions[index].items[indexVal].values[0]" :placeholder="itemVal.example" style="width: 60%" :disabled="isDisable">
                                                        <el-option v-for="itemSelect in itemVal.item_vals" :key="itemSelect.value" :label="itemSelect.label" :value="itemSelect.value">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                                <!-- password:密码 -->
                                                <div v-if="itemVal.type_lv1 == 'password'">
                                                    <el-input v-if="extensions[index].items!=null" type="password" v-model="extensions[index].items[indexVal].values[0]" :placeholder="itemVal.example" class="inputwid" :disabled="isDisable"></el-input>
                                                </div>
                                                <!-- textarea:文本域 -->
                                                <div v-if="itemVal.type_lv1 == 'textarea'">
                                                    <el-input v-if="extensions[index].items!=null" type="textarea" v-model="extensions[index].items[indexVal].values[0]" :placeholder="itemVal.example" class="inputwid" :disabled="isDisable"></el-input>
                                                </div>
                                                <!-- text:文本 -->
                                                <div v-if="itemVal.type_lv1 == 'text'">
                                                    <el-date-picker v-if="itemVal.type_lv2 == 'date'&& extensions[index].items!=null " v-model="extensions[index].items[indexVal].values[0]" type="date" placeholder="选择日期">
                                                    </el-date-picker>
                                                    <el-date-picker v-else-if="itemVal.type_lv2 == 'datetime' && extensions[index].items!=null " v-model="extensions[index].items[indexVal].values[0]" type="datetime" placeholder="选择日期时间">
                                                    </el-date-picker>

                                                    <el-input v-if="itemVal.type_lv2 =='' && extensions[index].items!=null" v-model="extensions[index].items[indexVal].values[0]" :placeholder="itemVal.example" class="inputwid" :disabled="isDisable"></el-input>
                                                </div>
                                                <!-- radio:单选 -->
                                                <div v-if="itemVal.type_lv1 == 'radio'">
                                                    <el-radio-group v-if="extensions[index].items!=null" v-model="extensions[index].items[indexVal].values[0]" @change="extendChange">
                                                        <el-radio v-for="(itemRadio,index) in itemVal.item_vals" :key="index" :label="itemRadio.value" :value="itemRadio.value" :disabled="isDisable">{{itemRadio.label}}</el-radio>
                                                    </el-radio-group>
                                                </div>
                                                <!-- checkbox:复选 -->
                                                <div v-if="itemVal.type_lv1 == 'checkbox'">
                                                    <!-- {{extensions[index].items}} -->
                                                    <!-- {{itemVal.item_vals}} -->
                                                    <el-checkbox-group v-if="extensions[index].items!=null" v-model="extensions[index].items[indexVal].values" class="subjectStyle">
                                                        <div v-for="(itemRadio,index) in itemVal.item_vals" :key="index">
                                                            <el-checkbox style="width:0px" class="chexkStyle" :label="itemRadio.value" :disabled="isDisable">{{itemRadio.label}}</el-checkbox>

                                                        </div>
                                                    </el-checkbox-group>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                    </div>
                                </el-row>
                            </div>
                        </el-card>

                    </div>
                </el-form>
            </el-tab-pane>
            <!-- <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;"> -->
            <el-row>
                <el-col style="text-align:right">
                    <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1">取 消</el-button>
                    <el-button size="mini" @click="AddAll('form')" type="primary" v-if="mode != 2">保 存</el-button>
                </el-col>
            </el-row>
            <!-- </el-form-item> -->
        </el-tabs>
    </div>
</template>
<script>
import addOrg from "../organization/addOrg.vue"

export default {
    inject: ["reload"],
    components: { addOrg },
    data() {
        return {
            size: "small",
            isCurrent: "current",
            mode: this.$route.query.mode,
            selectOid: [],
            selectData: [],
            redStar: true,
            redStarMarTop: "-4.4%",
            name: "",
            nameVal: "",
            dateNum: "h",
            form: {
                nameVal: "", // 模板名称
                organization_id: "", // 组织机构id
                type: "",
                signature_algorithms: [], // 签名算法
                metadata_details: "", //模板描述
                metadata_category: "A",
                version: "v3",
                max_size: 4500,
                serial_number_in_req: "0", // false "0", true "1"
                cert_domain: "RFC5280",
                keypair_gen_inherit_ca: "1", // 是否产生密钥对
                keypair_gen_keypair_name: "", // 密钥对产生位置
                keypair_gen_forbidden: "0", // false "0", true "1"
                subject_rdns: [], // 主题设置
                subject_keepRdnOrder: "true", // 是否保持主题顺序
                subject_csrRdnOrder: "true", // 是否使用请求中的顺序
                subject_rdn_order: "1", // 主题rdn排序规则 1:保持csr顺序 2:保持配置文件顺序
                cert_level: "", // 证书类型
                validity: "", // 有效期
                not_before_type: "", // 证书开始时间
                key_algorithms: [] // 密钥模长

                // email: {
                //     minOccurs: "",
                //     maxOccurs: "",
                //     oid: "",
                //     description: ""
                // }
            },
            dateList: [
                {
                    label: "时",
                    value: "h"
                },
                {
                    label: "天",
                    value: "d"
                },
                {
                    label: "月",
                    value: "m"
                },
                {
                    label: "年",
                    value: "y"
                }
            ],

            extensions: [],
            // extensions: [
            //     {
            //         critical: "0",
            //         description: "5",
            //         id: "",
            //         items: null,
            //         oid: "5",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "1",
            //         description: "basicConstraints",
            //         id: "2.5.29.19",
            //         items: null,
            //         oid: "2.5.29.19",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "1",
            //         description: "keyUsage",
            //         id: "2.5.29.15",
            //         items: [
            //             {
            //                 item_field: "usages",
            //                 item_id: "26",
            //                 type_lv1: "checkbox",
            //                 values: [
            //                     "keyEncipherment",
            //                     "dataEncipherment",
            //                     "digitalSignature"
            //                 ]
            //             }
            //         ],

            //         oid: "2.5.29.15",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "0",
            //         description: "subjectKeyIdentifier",
            //         id: "2.5.29.14",
            //         items: null,
            //         oid: "2.5.29.14",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "0",
            //         description: "authorityKeyIdentifier",
            //         id: "2.5.29.35",
            //         items: null,
            //         oid: "2.5.29.35",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "0",
            //         description: "freshestCRL",
            //         id: "",
            //         items: null,
            //         oid: "2.5.29.46",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "0",
            //         description: "authorityInfoAccess",
            //         id: "",
            //         items: [
            //             {
            //                 item_field: "includeCaIssuers",
            //                 item_id: "28",
            //                 type_lv1: "radio",
            //                 values: []
            //             },
            //             {
            //                 item_field: "includeOcsp",
            //                 item_id: "29",
            //                 type_lv1: "radio",
            //                 values: []
            //             },
            //             {
            //                 item_field: "caIssuersProtocols",
            //                 item_id: "30",
            //                 type_lv1: "text",
            //                 values: []
            //             },
            //             {
            //                 item_field: "ocspProtocols",
            //                 item_id: "31",
            //                 type_lv1: "text",
            //                 values: []
            //             }
            //         ],
            //         oid: "1.3.6.1.5.5.7.1.1",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "0",
            //         description: "cRLDistributionPoints",
            //         id: "",
            //         items: null,
            //         oid: "2.5.29.31",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "0",
            //         description: "extendedKeyUsage",
            //         id: "",
            //         items: [
            //             {
            //                 item_field: "usages",
            //                 item_id: "32",
            //                 type_lv1: "checkbox",
            //                 values: []
            //             }
            //         ],
            //         oid: "2.5.29.37",
            //         permittedInRequest: "0",
            //         required: "0"
            //     },
            //     {
            //         critical: "0",
            //         description: "subjectAlternativeName",
            //         id: "",
            //         items: [
            //             {
            //                 item_field: "modes",
            //                 item_id: "33",
            //                 type_lv1: "checkbox",
            //                 values: []
            //             }
            //         ],
            //         oid: "2.5.29.17",
            //         permittedInRequest: "0",
            //         required: "0"
            //     }
            // ],
            items: [],

            // 出现次数
            subject: {
                CN: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.3",
                    description: "CN"
                },
                OU: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.11",
                    description: "OU"
                },
                ST: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.8",
                    description: "ST"
                },
                O: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.10",
                    description: "O"
                },
                L: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.7",
                    description: "L"
                },
                C: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.6",
                    description: "C"
                },
                T: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.12",
                    description: "T"
                },
                STREET: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.9",
                    description: "STREET"
                },
                SERIALNUMBER: {
                    minOccurs: "0",
                    maxOccurs: "1",
                    oid: "2.5.4.5",
                    description: "SERIALNUMBER"
                }
            },
            Extendform: {},
            ExtendRules: {},
            system_type: "",

            certTypeList: [
                {
                    value: "RootCA",
                    label: "根CA证书"
                },

                {
                    value: "SubCA",
                    label: "子CA证书"
                },
                {
                    value: "EndEntity",
                    label: "用户证书"
                },
                {
                    value: "UKey",
                    label: "UKey证书"
                }
            ],
            keyList: [
                {
                    label: "软件",
                    value: "soft"
                },
                {
                    label: "KMC",
                    value: "kmc"
                }
            ],

            themeList: [
                {
                    label: "通用名(CN)",
                    value: "CN"
                },
                {
                    label: "国家/地区(C)",
                    value: "C"
                },
                {
                    label: "省份(ST)",
                    value: "ST"
                },

                {
                    label: "城市(L)",
                    value: "L"
                },
                {
                    label: "街道(STREET)",
                    value: "STREET"
                },
                {
                    label: "组织(O)",
                    value: "O"
                },
                {
                    label: "部门(OU)",
                    value: "OU"
                },
                {
                    label: "标题(T)",
                    value: "T"
                },
                {
                    label: "序列号(SN)",
                    value: "SERIALNUMBER"
                }
            ],
            keyNumList: [
                {
                    label: "2048",
                    value: "2048"
                },
                {
                    label: "4096",
                    value: "4096"
                }
            ],
            keyAlgorithmList: [
                {
                    label: "RSA",
                    value: "SHA256withRSA"
                },
                {
                    label: "EC",
                    value: "SM3WithSM2",
                    oid: "1.2.156.10197.1.301",
                    pointEncodings: "4",
                    description: "sm2p256v1"
                }
            ],

            isDisable: false,

            rules: {
                organization_id: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ],
                cert_level: [
                    {
                        required: true,
                        message: "请选择证书类型",
                        trigger: "blur"
                    }
                ],
                validity: [
                    {
                        required: true,
                        message: "请输入有效期",
                        trigger: "blur"
                    }
                ],
                nameVal: [
                    {
                        required: true,
                        message: "请输入模板名称",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请输入type",
                        trigger: "blur"
                    }
                ]
            },
            NicList: [],
            loading: false,
            checked: "",
            ProfList: [],
            extend: "",
            dieLen: false,
            organizationId: 0,
            profileId: this.$route.query.id,
            num: 0,
            extenList: null
        }
    },
    created() {
        if (this.mode != 1) {
            this.getDetail()
            if (this.mode == 3) {
                this.name = "修改模板"
            } else {
                this.isDisable = true
                this.name = "模板详情"
            }
        } else {
            this.name = "新增模板"
            this.getList()
        }

        if (this.$commonJs.getStorage().organization_id != 1) {
            this.form.organization_id =
                this.$commonJs.getStorage().organization_id
        }
    },
    mounted() {},
    watch: {
        nameVal(val) {
            // debugger;
            this.form.nameVal = val
            if (val != "") {
                this.$refs.form.rules.nameVal = []
                this.$refs.form.clearValidate("nameVal")
                // this.redStar = true;
            } else {
                this.$refs.form.rules.nameVal = [
                    {
                        message: "请输入模板名称",
                        required: true,
                        trigger: "blur"
                    }
                ]

                // this.redStar = false;
            }
            console.log(this.$refs.form.rules.nameVal)
            console.log(val, this.form.nameVal, "this.nameVal")
        }
    },
    methods: {
        getList() {
            this.loading = true
            this.extensions = []
            this.ProfList = []
            this.$commonJs
                .getMethodData(this.$url.ProfAll, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.ProfList = res.data.data

                        this.ProfList.forEach((item, index) => {
                            this.extensions.push({
                                oid: item.oid,
                                description: item.description,
                                critical: item.critical,
                                required: "0",
                                permittedInRequest: "0",
                                items: [],
                                id: ""
                            })

                            if (item.caProfileExtensionItemList.length != 0) {
                                let dataType = [""]
                                item.caProfileExtensionItemList.forEach(
                                    (item1, index1) => {
                                        item1.item_vals = JSON.parse(
                                            item1.item_vals
                                        )
                                        // debugger;
                                        // this.extensions[index].items.push({
                                        //     item_id: item1.id,
                                        //     item_field: item1.item_field,
                                        //     type_lv1: item1.type_lv1,
                                        //     values: []
                                        // });
                                        if (item1.default_vals != "") {
                                            // 新增时，有默认值的给v-model
                                            this.extensions[index].items.push({
                                                item_id: item1.id,
                                                item_field: item1.item_field,
                                                type_lv1: item1.type_lv1,
                                                values: [item1.default_vals]
                                            })
                                        } else {
                                            this.extensions[index].items.push({
                                                item_id: item1.id,
                                                item_field: item1.item_field,
                                                type_lv1: item1.type_lv1,
                                                values: []
                                            })
                                        }
                                        console.log(
                                            this.extensions,
                                            "dddddddddd"
                                        )
                                    }
                                )
                            } else {
                                this.extensions[index].items = null
                            }
                        })
                        this.loading = false
                    }
                })
        },
        getDetail() {
            this.loading = true
            this.extensions = []
            this.ProfList = []
            let dataList = {}
            this.$commonJs
                .getMethodData(this.$url.ProfAll, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.loading = false
                        this.ProfList = res.data.data
                        this.$commonJs
                            .getMethodData(this.$url.ProfileByIdNew, "POST", {
                                id: this.profileId
                            })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    sessionStorage.setItem(
                                        "extensions",
                                        JSON.stringify(
                                            res.data.attrs.extensions
                                        )
                                    )
                                }
                                let extenList = [],
                                    extensionsList = JSON.parse(
                                        sessionStorage.getItem("extensions")
                                    ),
                                    extensionsList1 = JSON.parse(
                                        sessionStorage.getItem("extensions")
                                    )

                                this.ProfList.forEach((item, index) => {
                                    item.caProfileExtensionItemList.forEach(
                                        (item1, index1) => {
                                            if (
                                                typeof item1.item_vals ==
                                                "string"
                                            ) {
                                                item1.item_vals = JSON.parse(
                                                    item1.item_vals
                                                )
                                            }
                                        }
                                    )

                                    let data = extensionsList.filter(
                                        (item1) => item1.oid == item.oid
                                    )
                                    if (data.length == 0) {
                                        // console.log(
                                        //     "没有",
                                        //     index,
                                        //     // this.extensions[index].oid,
                                        //     item.oid
                                        // );

                                        extensionsList1[index] = {
                                            oid: item.oid,
                                            description: item.description,
                                            critical: item.critical,
                                            required: "0",
                                            permittedInRequest: "0",
                                            items: [],
                                            id: ""
                                        }
                                        extenList.push(extensionsList1[index])
                                        if (
                                            item.caProfileExtensionItemList
                                                .length != 0
                                        ) {
                                            item.caProfileExtensionItemList.forEach(
                                                (item1, index1) => {
                                                    if (
                                                        item1.default_vals != ""
                                                    ) {
                                                        extenList[
                                                            index
                                                        ].items.push({
                                                            item_id: item1.id,
                                                            item_field:
                                                                item1.item_field,
                                                            type_lv1:
                                                                item1.type_lv1,
                                                            values: [
                                                                item1.default_vals
                                                            ]
                                                        })
                                                    } else {
                                                        extenList[
                                                            index
                                                        ].items.push({
                                                            item_id: item1.id,
                                                            item_field:
                                                                item1.item_field,
                                                            type_lv1:
                                                                item1.type_lv1,
                                                            values: []
                                                        })
                                                    }
                                                }
                                            )
                                        } else {
                                            extenList[index].items = null
                                        }
                                    } else {
                                        let data = extensionsList.filter(
                                            (item1) => item1.oid == item.oid
                                        )
                                        if (
                                            item.caProfileExtensionItemList
                                                .length != 0
                                        ) {
                                            item.caProfileExtensionItemList.forEach(
                                                (item2, index1) => {
                                                    data[0].items[
                                                        index1
                                                    ].type_lv1 = item2.type_lv1
                                                    if (
                                                        item2.type_lv1 ==
                                                            "text" &&
                                                        item2.type_lv2 == ""
                                                    ) {
                                                        data[0].items[
                                                            index1
                                                        ].values = [
                                                            data[0].items[
                                                                index1
                                                            ].values[0]
                                                        ]
                                                    }
                                                    if (
                                                        item2.type_lv1 ==
                                                            "text" &&
                                                        item2.type_lv2 != ""
                                                    ) {
                                                        if (
                                                            data[0].items[
                                                                index1
                                                            ].values[0].indexOf(
                                                                "-"
                                                            ) != -1 &&
                                                            data[0].items[
                                                                index1
                                                            ].values[0].indexOf(
                                                                "T"
                                                            ) != -1 &&
                                                            data[0].items[
                                                                index1
                                                            ].values[0].indexOf(
                                                                "Z"
                                                            ) != -1 &&
                                                            data[0].items[
                                                                index1
                                                            ].values[0].indexOf(
                                                                ":"
                                                            ) != -1
                                                        ) {
                                                            data[0].items[
                                                                index1
                                                            ].values = [
                                                                data[0].items[
                                                                    index1
                                                                ].values[0]
                                                            ]
                                                        } else {
                                                            data[0].items[
                                                                index1
                                                            ].values = []
                                                        }
                                                    }
                                                }
                                            )
                                        } else {
                                            data[0].items = null
                                        }
                                        extenList[index] = data[0]
                                    }
                                })
                                this.extensions = extenList
                                console.log(
                                    "有this.extensions",
                                    extenList,
                                    this.extensions,
                                    this.ProfList
                                )
                                dataList = res.data.data
                                let dataListArr = res.data.data
                                this.form = dataList
                                if (
                                    dataListArr.validity.split("m") != undefined
                                ) {
                                }
                                sessionStorage.setItem(
                                    "validity",
                                    dataListArr.validity
                                )
                                let splitData =
                                    sessionStorage.getItem("validity")
                                this.getSplitData(splitData, "m")
                                this.getSplitData(splitData, "d")
                                this.getSplitData(splitData, "y")
                                this.getSplitData(splitData, "h")

                                this.nameVal = dataListArr.name
                                dataList.signature_algorithms =
                                    dataList.signature_algorithms.split(",")

                                let subjectRdns = JSON.parse(
                                    dataList.subject_rdns
                                )
                                let subjectRdnsArr = [] //主题设置
                                if (subjectRdns[0] != "") {
                                    subjectRdns.forEach((item) => {
                                        subjectRdnsArr.push(item.description)
                                        this.subject[
                                            item.description
                                        ].minOccurs = item.minOccurs

                                        this.subject[
                                            item.description
                                        ].maxOccurs = item.maxOccurs
                                    })
                                }
                                dataList.subject_rdns = subjectRdnsArr
                                let key_algorithms = [],
                                    keyAlgorithmsArr = [], // 密钥算法
                                    keyAlgorithmsLenArr = [], // 密钥模长
                                    keyAlgorithmsLen = []
                                if (
                                    dataList.key_algorithms.split(",") !=
                                    undefined
                                ) {
                                    key_algorithms =
                                        dataList.key_algorithms.split(",")
                                    key_algorithms.forEach((item) => {
                                        keyAlgorithmsArr.push(
                                            item.split("-")[0]
                                        )
                                    })
                                    if (
                                        key_algorithms[0].split("-") !=
                                        undefined
                                    ) {
                                        keyAlgorithmsLen =
                                            key_algorithms[0].split("-")
                                        keyAlgorithmsLen.shift()
                                    }
                                    keyAlgorithmsLen.forEach((item) => {
                                        keyAlgorithmsLenArr.push(
                                            item.split("+")[0]
                                        )
                                    })
                                }
                                dataList.key_algorithms = keyAlgorithmsLenArr
                                if (keyAlgorithmsArr.indexOf("rsa") != -1) {
                                    keyAlgorithmsArr[
                                        keyAlgorithmsArr.indexOf("rsa")
                                    ] = "SHA256withRSA"
                                }
                                if (keyAlgorithmsArr.indexOf("ec") != -1) {
                                    keyAlgorithmsArr[
                                        keyAlgorithmsArr.indexOf("ec")
                                    ] = "SM3WithSM2"
                                }
                                dataList.signature_algorithms = keyAlgorithmsArr
                                if (dataList.not_before_type == "current") {
                                    this.isCurrent == "current"
                                } else {
                                    this.isCurrent = "0"
                                    dataList.not_before_type =
                                        this.$commonJs.dateTimeFormatterTwo(
                                            dataList.not_before_type
                                        )
                                }

                                res.data.attrs.extensions.forEach(
                                    (item, index) => {
                                        if (item.id != "") {
                                            this.selectOid.push(item.id)
                                        }
                                    }
                                )
                            })
                    }
                })
        },
        getSplitData(data, value) {
            // debugger;
            if (data.indexOf(value) != -1) {
                this.form.validity = data.split(value)[0]
                this.dateNum = value
                console.log(data.split(value), this.dateNum, "sss")
            }
        },
        getExtentsData(data) {
            // 利用reduce方法遍历数组,reduce第一个参数是遍历需要执行的函数，第二个参数是item的初始值(ie9以下不支持此方法)
            var obj = {}
            this.extensions = data.reduce(function (item, next) {
                obj[next.oid] ? "" : (obj[next.oid] = true && item.push(next))
                return item
            }, [])

            console.log(this.extensions, "eeee")
        },

        organization_id(val) {
            this.form.organization_id = val
        },

        handleClick(tab, event) {
            console.log(tab.label, event, "999")
            if (tab.label == "扩展信息") {
            }
        },

        themeChange(data, event) {
            let dataList = []
            for (let key in this.subject) {
                if (data.indexOf(key) == -1) {
                    dataList.push(this.subject[key])
                }
            }
            dataList.forEach((item) => {
                item.minOccurs = "0"
                item.maxOccurs = "1"
            })
            console.log(dataList, data, this.subject, event, "themeChange")
        },
        keyLenChange(data) {
            console.log(data, "keyLenChange")
        },
        extendChange(data) {
            console.log(data, "extendChange")
            console.log(this.extensions, "this.extensions")
        },
        autographChange(data) {
            if (data.indexOf("SHA256withRSA") != -1) {
                this.dieLen = true
            } else {
                this.dieLen = false
                this.form.key_algorithms = []
            }
            console.log(data, "autographChange")
        },
        CheckNumVal(data1, data2, type, val) {
            let subjectObj = this.subject[val]
            if (parseInt(data1) > parseInt(data2)) {
                this.$message.error("最小值不能大于最大值!")
                let temp = ""
                temp = subjectObj.minOccurs
                subjectObj.minOccurs = subjectObj.maxOccurs
                subjectObj.maxOccurs = temp
            }
        },
        cancel() {
            this.$router.push("/TemManagementList")
        },
        uploadData() {
            let obj = this.extensions
            this.ProfList.forEach((item, index) => {
                if (obj[index].id != "") {
                    obj[index][item.field_name] = {}

                    item.caProfileExtensionItemList.forEach((item1, index1) => {
                        if (obj[index].id != "") {
                            obj[index][item.field_name][item1.item_field] =
                                this.extensions[index].items[index1].values
                        } else {
                            let dataType = ""
                            if (
                                this.extensions[index].items[index1].type_lv1 ==
                                "checkbox"
                            ) {
                                dataType = []
                            }
                            obj[index][item.field_name][item1.item_field] =
                                dataType
                        }
                    })
                }
            })
            console.log(this.extensions, this.ProfList, obj, "数据提交")
        },

        // 保存
        AddAll(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return

                let obj = {},
                    arr = [],
                    subjectRdns = [],
                    keyECAndStr = "",
                    keyStr = "rsa",
                    keyEC = "ec"

                this.form.subject_rdns.forEach((item) => {
                    let itemVal = this.subject[item]
                    obj[item] = itemVal
                    arr.push(itemVal)
                    // oid - description - minOccurs - maxOccurs 原来的
                    // subjectRdns.push(
                    //     itemVal.oid +
                    //         "-" +
                    //         itemVal.description +
                    //         "-" +
                    //         itemVal.minOccurs +
                    //         "-" +
                    //         itemVal.maxOccurs
                    // );
                    // 后改为
                    subjectRdns.push({
                        oid: itemVal.oid,
                        description: itemVal.description,
                        minOccurs: itemVal.minOccurs,
                        maxOccurs: itemVal.maxOccurs
                    })
                })
                let data = arr.filter((item) => {
                    return item.minOccurs == "" || item.maxOccurs == ""
                })
                if (data.length > 0) {
                    this.$message.error("出现次数不能为空")
                    return
                }
                if (
                    this.form.signature_algorithms.indexOf("SHA256withRSA") !=
                    -1
                ) {
                    // RSA模长传参格式 rsa - max + min - max + min;
                    if (this.form.key_algorithms.length != 0) {
                        this.form.key_algorithms.forEach((item) => {
                            keyStr += "-" + item + "+" + item
                        })
                    }
                }
                if (
                    this.form.signature_algorithms.indexOf("SM3WithSM2") != -1
                ) {
                    // ec-oid-description-pointEncodings
                    this.keyAlgorithmList.forEach((item) => {
                        if (item.value == "SM3WithSM2") {
                            keyEC +=
                                "-" +
                                item.oid +
                                "-" +
                                item.description +
                                "-" +
                                item.pointEncodings
                        }
                    })
                }
                if (this.form.signature_algorithms.length == 2) {
                    keyECAndStr = keyStr + "," + keyEC
                } else if (this.form.signature_algorithms.length == 1) {
                    if (this.form.signature_algorithms[0] == "SHA256withRSA") {
                        keyECAndStr = keyStr
                    } else {
                        keyECAndStr = keyEC
                    }
                }
                let not_before_type = ""
                if (this.mode == 1) {
                    if (this.isCurrent == "0") {
                        not_before_type = this.$commonJs.dateTimeFormatter(
                            this.form.not_before_type
                        )
                    } else {
                        not_before_type = "current"
                    }
                }
                if (this.mode == 3) {
                    if (this.isCurrent == "0") {
                        not_before_type = this.form.not_before_type
                    } else {
                        not_before_type = "current"
                    }
                }
                // 扩展项
                let selectArr = []
                //  selectArr =
                // debugger;
                console.log(this.extensions, this.selectOid, "selectArr222")

                // this.selectData.forEach((item1, index) => {
                // debugger;

                // if (item1.items.length != 0 && item1.id != "") {
                // console.log(item1.items, "ppppp");
                // item1.items.forEach((item2, index) => {
                //     if (item2.type_lv1 != "checkbox") {
                //         if (item2.values != "") {
                //             let aaa = [];
                //             aaa.push(item2.values);
                //             item2.values = aaa;
                //         }
                //         // else {
                //         //     item2.values = [];
                //         // }
                //     }
                // });
                // }
                // });

                // for (var j = 0; j < this.extensions.length; j++) {
                //     for (var i = 0; i < this.selectOid.length; i++) {
                //         if (this.selectOid[i] == this.extensions[j].oid) {
                //             debugger;
                //             console.log(
                //                 this.selectOid[i],
                //                 this.extensions[j].oid,
                //                 "selectArr"
                //             );
                //             this.extensions[j].id = this.selectOid[i];
                //             // this.$set(this.extensions[j], "id", this.selectOid[i]);
                //         } else {
                //             console.log(
                //                 this.selectOid[i],
                //                 this.extensions[j].oid,
                //                 "selectArrelse"
                //             );
                //             if (
                //                 this.selectOid.indexOf(
                //                     this.extensions[j].oid
                //                 ) == -1
                //             ) {
                //                 this.extensions[j].id = "";
                //             }
                //         }
                //     }
                // }

                console.log(
                    selectArr,
                    subjectRdns,
                    this.extensions,
                    "selectArr666"
                )

                // this.uploadData();

                // 有效期
                // let dateNum;
                // if (this.dateNum == "0") {
                //     // 小时
                //     dateNum = this.form.validity * 60 * 60;
                // } else if (this.dateNum == "1") {
                //     // 天
                //     dateNum = this.form.validity * 60 * 60 * 24;
                // } else if (this.dateNum == "2") {
                //     // 月
                //     dateNum = this.form.validity * 60 * 60 * 24 * 30;
                // } else if (this.dateNum == "3") {
                //     // 年
                //     dateNum = this.form.validity * 60 * 60 * 24 * 365;
                // }

                console.log(this.extensions, selectArr, "selectArr")
                // 模板数据
                let dataList = {
                    id: this.profileId,
                    signature_algorithms:
                        this.form.signature_algorithms.join(","), // 签名算法
                    metadata_details: this.form.metadata_details, //模板描述
                    metadata_category: "A",
                    version: "v3",
                    cert_domain: this.form.cert_domain,
                    keypair_gen_keypair_name:
                        this.form.keypair_gen_keypair_name, // 密钥对产生位置
                    subject_rdns: JSON.stringify(subjectRdns), // 主题设置
                    // subject_keepRdnOrder: "true", // 是否保持主题顺序
                    // subject_csrRdnOrder: "true", // 是否使用请求中的顺序
                    subject_rdn_order: this.form.subject_rdn_order, // 主题rdn排序规则 1:保持csr顺序 2:保持配置文件顺序
                    cert_level: this.form.cert_level, // 证书类型
                    validity: this.form.validity + this.dateNum, // 有效期
                    not_before_type: not_before_type, // 证书开始时间
                    key_algorithms: keyECAndStr, // 密钥模长
                    // organization_id: this.form.organization_id,
                    // name: this.form.nameVal,
                    name: this.nameVal,
                    // type: this.form.type,
                    max_size: this.form.max_size,
                    serial_number_in_req: this.form.serial_number_in_req,
                    keypair_gen_inherit_ca: this.form.keypair_gen_inherit_ca, // 是否产生密钥对
                    keypair_gen_forbidden: this.form.keypair_gen_forbidden
                    // extensions: JSON.stringify(this.extensions)
                }
                // sessionStorage.setItem("dataList", JSON.stringify(dataList));

                console.log(
                    "this.extensions",
                    this.items,
                    this.extensions,
                    this.selectOid
                )

                if (this.mode == 1) {
                    this.getData(this.$url.ProfileAddNew, dataList)
                }
                if (this.mode == 3) {
                    this.$confirm("是否修改模板?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.getData(this.$url.ProfileUpdNew, dataList)
                            console.log(dataList, "保存")
                        })
                        .catch((err) => err)
                }
                console.log(dataList, "保存")
            })
        },
        getData(url, dataList) {
            let dataList1 = []
            this.extensions.forEach((item1, index) => {
                this.selectOid.forEach((item) => {
                    if (item == item1.oid) {
                        this.extensions[index].id = item1.oid
                        dataList1.push(item1)
                    }
                    // else {
                    //     if (this.selectOid.indexOf(item1.oid) == -1) {
                    //         this.extensions[index].id = "";
                    //         this.extensions[index].critical = "0";
                    //         this.extensions[index].required = "0";
                    //         this.extensions[index].permittedInRequest = "0";
                    //         if (this.extensions[index].items != null)
                    //             this.extensions[index].items.forEach(
                    //                 (item1, index1) => {
                    //                     this.extensions[index].items[
                    //                         index1
                    //                     ].values = [];
                    //                 }
                    //             );
                    //     }
                    // }
                })
            })
            dataList.extensions = JSON.stringify(dataList1)
            this.$commonJs
                .getMethodFormData(url, "POST", dataList)
                .then((res) => {
                    console.log(res, dataList, dataList1, "保存")
                    if (res.data.code == 100000) {
                        this.cancel()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        }
    }
}
</script>

<style lang="less" scoped>
// .box-card {
//     height: 50px;
//     line-height: 50px;
// }
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}

/deep/ .cardHeader {
    border: 1px solid #ccc;
    margin-bottom: 20px;
    padding-bottom: 20px;
    .el-card__header {
        height: 40px;
        background: #ecf2ff !important;
        border-bottom: 1px solid #ccc;
        padding: 0 20px;
    }
    .contextBody {
        margin-left: 11px;
    }
}
.chexkStyle:nth-child(2) {
    margin-left: 6px;
}
.radioStyle {
    margin-left: 28px;
}
// .checkLen:nth-child(2) {
//     margin-left: 10px;
// }
.checkLen {
    margin-left: 10px;
}
.autographStyle:nth-child(2) {
    margin-left: 16px;
}
.autographStyle .el-checkbox {
    display: block;
}
.subjectStyle {
    font-size: 14px;
}
</style>
