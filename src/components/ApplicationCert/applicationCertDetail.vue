<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/applicationCertList' }">
                <el-button size="mini" class="el-button1" type="warning"
                    style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle" v-if="mode == 1">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <!-- <el-form-item label="所属根证书:" label-width="21%" prop="cert_serial_name">
                            <el-input class="inputwid" v-model="form.cert_serial_name" placeholder="点击右边选择按钮选择所属证书颁发机构" disabled></el-input>
                            <el-button size="mini" @click="getOrganizationTree('fenpei')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button>
                        </el-form-item> -->

                        <el-form-item label="组织机构:" label-width="21%" prop="organizationArr"
                            v-if="$commonJs.getStorage().isAdmin == true">
                            <el-cascader :disabled="isDisable" ref="cascaderHandle" :show-all-levels="false"
                                :props="{ checkStrictly: true }" v-model="form.organizationArr" :options="organizationList"
                                @change="handleChange" placeholder="请选择组织机构" style="width:60%"></el-cascader>
                        </el-form-item>
                        <!-- <el-col :span="16" :offset="2" class="offsetApp">
                            <el-form-item label="所属应用:" label-width="28%" prop="appid">
                                <el-select v-model="form.appid" placeholder="请选择所属应用" style="width: 102.5%" :disabled="isDisable">
                                    <el-option v-for="item in AppList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                    </el-col>
                    <el-col :span="12" :offset="6" style=" ">
                        <el-form-item label="通用名:" label-width="21%" prop="common_name">
                            <el-input class="inputwid" v-model="form.common_name" placeholder="请输入组织/公司全称(Common Name)"
                                :disabled="isDisable" style="width:60%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="组织单位:" label-width="21%">
                            <el-input class="inputwid" v-model="form.org_unit" placeholder="请输入组织单位(org unit)"
                                :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="组织:" label-width="21%">
                            <el-input class="inputwid" v-model="form.org" placeholder="请输入所在单位名称(org)"
                                :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="城市:" label-width="21%">
                            <el-input class="inputwid" v-model="form.location" placeholder="请输入所在城市名称(Location)"
                                :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="省份:" label-width="21%">
                            <el-input class="inputwid" v-model="form.state" placeholder="请输入所在省份名称(State)"
                                :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="国家/地区:" label-width="21%">
                            <!-- <el-select v-model="form.country" placeholder="请选择国家/地区" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in systemTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                            <el-select class="inputwid" v-model="form.country" placeholder="请选择国家/地区(Country)"
                                :disabled="isDisable">
                                <el-option v-for="item in $commonJs.getCnData()" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <!-- <el-input class="inputwid" v-model="form.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable"></el-input> -->

                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <!-- <el-form-item label="证书类型:" label-width="21%" prop="cert_type">
                            <el-select v-model="form.cert_type" placeholder="请输入证书类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in certTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item label="是否双证:" label-width="21%" prop="is_double" v-if="mode==1">
                            <el-radio-group v-model="form.is_double" @change="doubleChange">
                                <el-radio label="1" :disabled="isDisable">是</el-radio>
                                <el-radio class="radioStyle" label="0" :disabled="isDisable">否</el-radio>
                            </el-radio-group>
                        </el-form-item> -->
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="密钥类型:" label-width="21%" prop="key_algorithm">
                            <el-select v-model="form.key_algorithm" placeholder="请选择密钥类型" style="width: 60%"
                                :disabled="isDisable">
                                <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <!-- <el-input class="inputwid" v-model="form.key_algorithm" placeholder="请输入密钥类型" :disabled="isDisable"></el-input> -->
                        </el-form-item>
                        <el-form-item label="密钥索引:" label-width="21%" prop="key_index">
                            <el-input class="inputwid" :disabled="isDisable" v-model="form.key_index" placeholder="请输入密钥索引"
                                oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                            <!-- <el-button size="mini" @click="getKeyIndex()" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button> -->
                        </el-form-item>

                        <el-form-item label="私钥访问控制码:" label-width="21%" prop="pucPassword">
                            <el-input class="inputwid" v-model="form.pucPassword" type="password" :disabled="isDisable"
                                placeholder="请输入私钥访问控制码"></el-input>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" style="margin-bottom:10px">取消</el-button>
                        <el-button size="mini" type="primary" @click="onUpdate('form')" v-if="mode != 2"
                            style="margin-bottom:20px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>
        <el-card class="intanle" v-if="mode == 10">
            <el-form ref="form" :model="formKey" :rules="rulesKey" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20" v-if="isDoubleOrNot">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="所属根证书:" label-width="21%" prop="cert_serial_name">
                            <el-input class="inputwid" v-model="formKey.cert_serial_name" placeholder="点击右边选择按钮选择所属证书颁发机构"
                                disabled></el-input>
                            <el-button size="mini" @click="getOrganizationTree('fenpei')" style="margin-left:10px"
                                type="primary" icon="el-icon-plus">选择</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="所属应用:" label-width="21%" prop="appid">
                            <el-select v-model="formKey.appid" placeholder="请选择所属应用" style="width: 35%"
                                :disabled="isDisable">
                                <el-option v-for="item in AppList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="应用环境标识:" label-width="21%">
                            <el-input class="inputwid" v-model="formKey.app_env" placeholder="请输入应用环境标识"
                                :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="证书名称:" label-width="21%">
                            <el-input class="inputwid" v-model="formKey.name" placeholder="证书名称"
                                :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="是否双证:" label-width="21%" prop="doubleRadio">
                            <el-radio-group v-model="doubleRadio">
                                <el-radio label="1" :disabled="isDisable">是</el-radio>
                                <el-radio class="radioStyle" label="0" :disabled="isDisable">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:10px;">
                        <el-form-item label="签名证书:" label-width="21%" prop="signature_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl"
                                :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed"
                                :on-change="changeFile" :file-list="fileList" :headers="MyHeader" :limit="1"
                                :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择签名证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="isEncryption == true" style="margin-top:20px;">
                        <el-form-item label="加密证书:" label-width="21%" prop="encrypt_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl"
                                :on-preview="handlePreview" :on-remove="handleRemove1" :on-exceed="handleExceed"
                                :on-change="changeFile1" :file-list="fileList1" :headers="MyHeader" :limit="1"
                                :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择加密证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="加密私钥格式:" v-if="isEncryption == true" label-width="21%" prop="encKeyTypeValue">
                            <el-radio-group v-model="encKeyTypeValue">
                                <el-radio label="1" :disabled="isDisable">0016加密格式</el-radio>
                                <el-radio class="radioStyle" label="0" :disabled="isDisable">SM2加密格式</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="isEncryption == true" style="margin-top:20px;">
                        <el-form-item label="加密证书私钥:" label-width="21%" prop="encryptKey_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl"
                                :on-preview="handlePreview" :on-remove="handleRemove2" :on-exceed="handleExceed"
                                :on-change="changeFile2" :file-list="fileList2" :headers="MyHeader" :limit="1"
                                :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择加密证书私钥</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isEncryption == true" :offset="6" style="margin-top:20px">
                        <el-form-item label="私钥访问控制码:" label-width="21%">
                            <el-input class="inputwid" v-model="pucPassword" type="password" style="width:25%"
                                placeholder="请填写"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:35px;margin-left:12%;">
                            <el-button size="mini" @click="cancel" type="warning" style="margin-bottom:10px">取消</el-button>
                            <el-button size="mini" type="primary" @click="openPin()"
                                style="margin-bottom:20px">确定</el-button>
                        </el-form-item>
                    </el-col>
                    <!-- </el-form-item> -->
                    <!-- <el-col :span="12" :offset="6" style="margin-left:77px">
                            <el-form-item label="所属应用:" label-width="21%" prop="appid">
                                <el-select v-model="formKey.appid" placeholder="请选择所属应用" style="width: 60%" :disabled="isDisable">
                                    <el-option v-for="item in AppList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                    <!-- </el-col> -->
                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="私钥数据:" label-width="21%" prop="encrypt_key_prv">
                            <el-input class="inputwid" type="textarea" v-model="formKey.encrypt_key_prv" placeholder="请输入私钥数据" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="证书数据:" label-width="21%" prop="sort1">
                            <el-input class="inputwid" type="textarea" v-model="formKey.sort1" placeholder="请输入证书数据"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                            <el-button size="mini" @click="cancel" type="warning" v-if="mode != 1" style="margin-bottom:10px">取消</el-button>
                            <el-button size="mini" type="primary" @click="getUploadFile" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                        </el-form-item>
                    </el-col> -->

                </el-row>
            </el-form>
        </el-card>
        <el-card class="intanle" v-if="mode == 2">
            <el-form id="selectForm" ref="form" :model="form" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20">
                    <div style="display: flex;flex-direction: column;width: 50%;margin: auto;">
                        <borderTitle title="证书信息" style="display:inline-block">
                            <el-col :span="12" :offset="6" style="">
                                <el-form-item label="证书序列号:" label-width="42%" prop="serial_number">
                                    <!-- <el-input class="inputwid" v-model="form.serial_number" readonly="true" style="width:60%"></el-input> -->
                                    {{ form.serial_number }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="证书名称:" label-width="42%" prop="name">
                                    <!-- <el-input class="inputwid" v-model="form.name" :disabled="isDisable" style="width:60%"></el-input> -->
                                    {{ form.name }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="应用环境标识:" label-width="42%" prop="app_env">
                                    {{ form.app_env }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="应用ID:" label-width="42%" prop="appid">
                                    {{ form.appid }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="根证书序列号:" label-width="42%" prop="appid">
                                    {{ form.cert_serial_number }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="颁发者:" label-width="42%" prop="appid">
                                    {{ form.issuer }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="组织机构:" label-width="42%" prop="">
                                    {{ form.organizationName }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="证书开始时间:" label-width="42%" prop="not_before">
                                    {{ form.not_before }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="证书结束时间:" label-width="42%" prop="not_after">
                                    {{ form.not_after }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                        <borderTitle title="证书主题" style="display:inline-block">
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="通用名:" label-width="42%" prop="common_name">
                                    {{ form.common_name }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="组织单位:" label-width="42%">
                                    {{ form.org_unit }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="组织:" label-width="42%">
                                    {{ form.org }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="城市:" label-width="42%">
                                    {{ form.location }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="省份:" label-width="42%">
                                    {{ form.state }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="国家/地区:" label-width="42%">
                                    {{ form.country }}
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="12" :offset="6">
                        <el-form-item label="证书类型:" label-width="21%" prop="cert_type">
                            <el-select v-model="form.cert_type" placeholder="请输入证书类型" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in certTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                        </borderTitle>
                        <borderTitle title="证书密钥" style="display:inline-block">
                            <el-col :span="12" :offset="6">
                                <el-form-item label="密钥标识码:" label-width="42%" prop="key_value">
                                    {{ form.key_value }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <!-- <el-form-item label="密钥类型:" label-width="21%" prop="key_algorithm">
                                    <el-select v-model="form.key_algorithm" placeholder="请选择密钥类型" style="width: 60%"
                                        :disabled="isDisable">
                                        <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item> -->
                                <el-form-item label="密钥类型:" label-width="42%" prop="key_algorithm">
                                    {{ form.key_algorithm }}
                                </el-form-item>
                                <el-form-item label="密钥索引:" label-width="42%" prop="key_index">
                                    {{ form.key_index }}
                                </el-form-item>
                                <el-form-item label="密钥长度:" label-width="42%" prop="key_length">
                                    {{ form.key_length }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                    </div>
                </el-row>
            </el-form>
        </el-card>
        <el-dialog title="选择所属根证书" :visible.sync="certDialogVisible" width="35%">
            <el-row style="margin-top:-30px">
                <el-col>
                    <div class="downTree">
                        <el-tree :data="certList" check-strictly :expand-on-click-node="false" default-expand-all
                            node-key="id" ref="tree" highlight-current :props="certDefaultProps"
                            @check="(click, checked) => { handleCheckChange(click, checked) }">
                            <span class=" custom-tree-node" :class="data.class" slot-scope="{node ,data}">
                                <el-radio v-model="radio" :label="data.id" @change="organizationChange(data)">
                                    <span><i :class="data.icon" style="margin-right:5px"></i>{{ node.label }}
                                    </span>
                                </el-radio>
                            </span>
                        </el-tree>

                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoorganization()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addorganization()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="选择密钥索引" :visible.sync="keyDialogVisible" width="60%">
            <el-row style="margin-top:-30px" class="keyStyle">
                <el-col>
                    <div class="downTree">
                        <el-card>
                            <el-table ref="symmetricTable" v-loading="loading" :data="keyList" tooltip-effect="dark"
                                :header-cell-style="{
                                    'text-align': 'center',
                                    'color': '#333',
                                    'font-size': '14px',
                                }" :cell-style="{ 'text-align': 'center' }" border stripe
                                @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="50">
                                    <template slot-scope="scope">
                                        <div v-if="isRSA == false">
                                            <el-radio v-if="isQianMing == false"
                                                :disabled="scope.row.SDFE_UEK_SM2.uiKeyLen == '0'" style="margin-left:8px"
                                                v-model="keyRadio" :label="scope.row.KeyIndex"
                                                @change="getRadio(scope.row)">
                                                {{ }}
                                            </el-radio>
                                            <el-radio v-if="isQianMing == true"
                                                :disabled="scope.row.SDFE_USK_SM2.uiKeyLen == '0'" style="margin-left:8px"
                                                v-model="keyRadio" :label="scope.row.KeyIndex"
                                                @change="getRadio(scope.row)">
                                                {{ }}
                                            </el-radio>
                                        </div>
                                        <div v-if="isRSA == true">
                                            <el-radio v-if="isQianMing == false"
                                                :disabled="scope.row.SDFE_UEK_RSA.uiKeyLen == '0'" style="margin-left:8px"
                                                v-model="keyRadio" :label="scope.row.KeyIndex"
                                                @change="getRadio(scope.row)">
                                                {{ }}
                                            </el-radio>
                                            <el-radio v-if="isQianMing == true"
                                                :disabled="scope.row.SDFE_USK_RSA.uiKeyLen == '0'" style="margin-left:8px"
                                                v-model="keyRadio" :label="scope.row.KeyIndex"
                                                @change="getRadio(scope.row)">
                                                {{ }}
                                            </el-radio>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                                <el-table-column label="用途">
                                    <template>
                                        <span v-if="isQianMing == false">加密</span>
                                        <span v-if="isQianMing == true">签名</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="模长">
                                    <template slot-scope="scope">
                                        <div v-if="isRSA == false">
                                            <span v-if="isQianMing == false">
                                                <span v-if="scope.row.SDFE_UEK_SM2.uiKeyLen == '0'">-</span>
                                                <span v-else>{{ scope.row.SDFE_UEK_SM2.uiKeyLen }}</span>
                                            </span>
                                            <span v-if="isQianMing == true">
                                                <span v-if="scope.row.SDFE_USK_SM2.uiKeyLen == '0'">-</span>
                                                <span v-else>{{ scope.row.SDFE_USK_SM2.uiKeyLen }}</span>
                                            </span>
                                        </div>
                                        <div v-if="isRSA == true">
                                            <span v-if="isQianMing == false">
                                                <span v-if="scope.row.SDFE_UEK_RSA.uiKeyLen == '0'">-</span>
                                                <span v-else>{{ scope.row.SDFE_UEK_RSA.uiKeyLen }}</span>
                                            </span>
                                            <span v-if="isQianMing == true">
                                                <span v-if="scope.row.SDFE_USK_RSA.uiKeyLen == '0'">-</span>
                                                <span v-else>{{ scope.row.SDFE_USK_RSA.uiKeyLen }}</span>
                                            </span>
                                        </div>
                                    </template>

                                </el-table-column>

                                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                                </div>
                            </el-table>
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </el-card>

                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoorganization()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addKeyIndex()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择密钥索引" :visible.sync="doubleKeyDialogVisible" width="60%">
            <el-row style="margin-top:-30px" class="keyStyle">
                <el-col>
                    <div class="downTree">
                        <el-card>
                            <el-table ref="symmetricTable" v-loading="loading" :data="keyList"
                                :span-method="objectSpanMethod" tooltip-effect="dark" :header-cell-style="{
                                    'text-align': 'center',
                                    'color': '#333',
                                    'font-size': '14px',
                                }" :cell-style="{ 'text-align': 'center' }" border stripe>
                                <el-table-column type="selection" width="100">
                                    <template slot-scope="scope">
                                        <div v-if="isRSA == false">
                                            <el-radio :disabled="scope.row.disabled" style="margin-left:8px"
                                                v-model="keyRadio" :label="scope.row.KeyIndex"
                                                @change="getRadio(scope.row)">
                                                {{ }}
                                            </el-radio>

                                        </div>
                                        <div v-if="isRSA == true">
                                            <el-radio :disabled="scope.row.disabled" style="margin-left:8px"
                                                v-model="keyRadio" :label="scope.row.KeyIndex"
                                                @change="getRadio(scope.row)">
                                                {{ }}
                                            </el-radio>

                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="索引" prop="KeyIndex"></el-table-column>
                                <el-table-column label="用途">
                                    <template slot-scope="scope">
                                        <span v-if="isRSA == false">
                                            <span v-if="scope.row.SDFE_USK_SM2 == undefined">加密</span>
                                            <span v-if="scope.row.SDFE_UEK_SM2 == undefined">签名</span>
                                        </span>
                                        <span v-if="isRSA == true">
                                            <span v-if="scope.row.SDFE_USK_RSA == undefined">加密</span>
                                            <span v-if="scope.row.SDFE_UEK_RSA == undefined">签名</span>
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="密钥长度">
                                    <template slot-scope="scope">
                                        <span v-if="isRSA == false">
                                            <span v-if="scope.row.SDFE_USK_SM2 == undefined">
                                                <span v-if="scope.row.SDFE_UEK_SM2.uiKeyLen == '0'">-</span>
                                                <span v-else>{{ scope.row.SDFE_UEK_SM2.uiKeyLen }}</span>
                                            </span>
                                            <span v-if="scope.row.SDFE_UEK_SM2 == undefined">
                                                <span v-if="scope.row.SDFE_USK_SM2.uiKeyLen == '0'">-</span>
                                                <span v-else>{{ scope.row.SDFE_USK_SM2.uiKeyLen }}</span>
                                            </span>
                                        </span>
                                        <span v-if="isRSA == true">
                                            <span v-if="scope.row.SDFE_USK_RSA == undefined">
                                                <span v-if="scope.row.SDFE_UEK_RSA.uiKeyLen == '0'">-</span>
                                                <span v-else>{{ scope.row.SDFE_UEK_RSA.uiKeyLen }}</span>
                                            </span>
                                            <span v-if="scope.row.SDFE_UEK_RSA == undefined">
                                                <span v-if="scope.row.SDFE_USK_RSA.uiKeyLen == '0'">-</span>
                                                <span v-else>{{ scope.row.SDFE_USK_RSA.uiKeyLen }}</span>
                                            </span>
                                        </span>
                                    </template>
                                </el-table-column>

                                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                                </div>
                            </el-table>
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </el-card>

                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="infoorganization()" size="mini" type="warning">取 消</el-button>
                <el-button size="mini" type="primary" @click="addKeyIndex()">确 定</el-button>
            </span>
        </el-dialog>
        <PinList ref="PinDialog" @PIN="PIN"></PinList>
    </div>
</template>
<script>
import PinList from "../CaCert/PinList.vue"
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    components: {
        PinList,
        borderTitle
    },
    data() {
        return {
            keyRadio: "",
            doubleRadio: "0",
            isEncryption: false,
            keyList: [],
            keyDialogVisible: false,
            certDialogVisible: false,
            doubleKeyDialogVisible: false,
            name: "",
            mode: this.$route.query.mode,
            appcertId: this.$route.query.id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",

            organizationList: [],
            certList: [],
            isCertList: "",
            isAdmin: true,
            pageNow: 1,
            pageSize: 10,
            fileLoading: false,
            total: 10,
            loading: false,
            fileList: [],
            fileList1: [],
            fileList2: [],
            fileName: [],
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            MyHeader: { Authorization: "" },
            showFile: false,
            fileUploadList: [],
            form: {
                organizationName: "",
                organizationArr: [],
                cert_serial_name: "",
                appid: "",
                is_double: "0",
                cert_serial_number: "", // 根证书颁发机构id【根证书序列号】
                cert_type: "", // 证书型：signature 签名 encrypt 加密
                common_name: "", // 颁发机构名称【证书中的cn】
                country: "", // 国家/地区
                key_index: "", // 密钥索引
                key_algorithm: "", // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                location: "", // 城市
                org: "", // 组织
                pucPassword: "",
                org_unit: "", // 组织单位
                organization_id: "1", // 组织机构id
                state: "", // 省份
                app_env: "",//应用环境标识(机构标识)
                name: "", //证书名称
                key_value: "",
            },

            pucPassword: "",
            rules: {
                organizationArr: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ],
                pucPassword: [
                    {
                        required: true,
                        message: "请输入私钥访问控制码",
                        trigger: "blur"
                    }
                ],
                key_index: [
                    {
                        required: true,
                        message: "请选择密钥索引",
                        trigger: "blur"
                    }
                ],
                is_double: [
                    {
                        required: true,
                        message: "请选择是否双证",
                        trigger: "blur"
                    }
                ],
                cert_type: [
                    {
                        required: true,
                        message: "请选择证书类型",
                        trigger: "blur"
                    }
                ],
                common_name: [
                    {
                        required: true,
                        message: "请输入组织/公司全称",
                        trigger: "blur"
                    }
                ],
                key_algorithm: [
                    {
                        required: true,
                        message: "请输入密钥类型",
                        trigger: "blur"
                    }
                ],
                appid: [
                    {
                        required: true,
                        message: "请选择所属应用",
                        trigger: "blur"
                    }
                ]
            },
            certTypeList: [
                {
                    label: "签名",
                    value: "signature"
                },
                {
                    label: "加密",
                    value: "encrypt"
                }
            ],
            keyTypeList: [
                // {
                //     label: "SHA1_RSA",
                //     value: "SHA1WithRSA"
                // },
                // {
                //     label: "SHA256_RSA",
                //     value: "SHA256WithRSA"
                // },
                // {
                //     label: "SM3_SM2",
                //     value: "SM3WithSM2"
                // }
            ],
            typeObj1: { label: "", value: "" },
            typeObj2: { label: "", value: "" },
            typeObj3: { label: "", value: "" },
            typeObj4: { label: "", value: "" },
            formKey: {
                signature_name: "", // 签名证书名字
                encrypt_name: "", // 加密证书名字
                encryptKey_name: "", // 加密证书私钥
                signature_cert: "", // 签名证书
                encrypt_cert: "", // 加密证书
                encrypt_key_prv: "", // 加密证书私钥
                cert_serial_name: "",
                cert_serial_number: "",
                appid: "",
                sort1: "",
                app_env: "",//应用环境标识(机构标识)
                name: ""    //证书名称
            },
            rulesKey: {},
            certDefaultProps: {
                children: "children",
                label: "subject"
                // icon-class:"icon"
            },

            AppList: [],
            systemTypeList: [],
            ischeckList: [],
            isQianMing: false,
            keyUrl: "",
            isRSA: "",
            keyType1: "",
            keyType2: "",
            dataType: [],
            organizationList: [],
            isDoubleOrNot: true,
            encKeyTypeValue: "1",
            encrypt_key_type: "0016" //0016  sm2
        }
    },

    created() {
        this.getOrganizationTree()
        if (this.mode != 1) {
            if (this.mode == 3) {
                this.name = "修改应用证书管理"
                this.getAppcertDetail()
            } else if (this.mode == 2) {
                this.isDisable = true
                this.name = "应用证书管理详情"
                this.getAppcertDetail()
            } else if (this.mode == 10) {
                // this.isDisable = true;
                this.name = "导入应用密钥和证书"
            }
        } else {
            this.name = "申请应用证书"
        }
        this.actionUrl = this.$url.ImportCert
        // this.$nextTick(() => {
        //     this.$refs.form.resetFields();
        // });
        // this.actionUrl = this.$url.ImportCert;
        this.getAppList()
        this.MyHeader = {
            Authorization: window.sessionStorage.getItem("Authorization"),
            "Content-Type": "multipart/form-data"
        }
        // setInterval(() => {
        //     this.getAppList();
        // }, 30000);
        this.getResourceDetail("1")
        this.getResourceDetail("2")
    },
    watch: {
        doubleRadio(val) {
            if (val == "1") {
                this.isEncryption = true
            } else {
                this.isEncryption = false
            }
        },
        encKeyTypeValue(val) {
            if (val == "1") {
                this.encrypt_key_type = "0016"
            } else {
                this.encrypt_key_type = "sm2"
            }
        }
    },
    methods: {
        // 获取详情
        getResourceDetail(code) {
            this.loading = true
            let url = this.$url.ResourceGetByCode
            this.$commonJs
                .getMethodData(url, "POST", {
                    page: "applicationCertDetail",
                    code: code
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (code == "1") {
                            let string = res.data.data.content
                            let number = string.split("")
                            if (number[0] == 1) {
                                //this.keyTypeList.splice(1,1)
                                this.typeObj1.label = "SHA1_RSA"
                                this.typeObj1.value = "SHA1WithRSA"
                                this.keyTypeList.push(this.typeObj1)
                            }
                            if (number[1] == 1) {
                                this.typeObj2.label = "SHA256_RSA"
                                this.typeObj2.value = "SHA256WithRSA"
                                this.keyTypeList.push(this.typeObj2)
                            }
                            if (number[2] == 1) {
                                this.typeObj3.label = "SM3_SM2"
                                this.typeObj3.value = "SM3WithSM2"
                                this.keyTypeList.push(this.typeObj3)
                            }
                            if (number[3] == 1) {
                                this.typeObj4.label = "SM9"
                                this.typeObj4.value = "SM9"
                                this.keyTypeList.push(this.typeObj4)
                            }
                        } else {
                            if (res.data.data.content == 0) {
                                this.isDoubleOrNot = false
                            } else {
                                this.isDoubleOrNot = true
                            }
                        }
                    }
                    this.loading = false
                })
        },
        // 获取详情
        getAppcertDetail() {
            this.$commonJs.getLoading()
            let url
            // if (this.type == "isProject") {
            //     url = this.$url.GetDictionaryItemById;
            // } else {
            url = this.$url.GetAppcertById
            // }
            this.$commonJs
                .getMethodData(url, "POST", {
                    id: this.appcertId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        // org 组织

                        this.form = res.data.data
                        this.form.organizationArr =
                            this.$commonJs.getFatherData(
                                this.organizationList,
                                (data) =>
                                    data.value == res.data.data.organization_id
                            )
                        // this.form.cert_serial_name =
                        //     res.data.attrs.cacert_subject;
                        this.getUndefined(
                            res.data.attrs.cacert_subject,
                            "cert_serial_name"
                        )
                        this.getUndefined(
                            res.data.attrs.organization_name,
                            "organizationName"
                        )
                        // this.form.org = res.data.attrs.O;
                        this.getUndefined(res.data.attrs.subject.o, "org")

                        // this.form.location = res.data.attrs.L;
                        this.getUndefined(res.data.attrs.subject.l, "location")

                        // this.form.country = res.data.attrs.C;
                        this.getUndefined(res.data.attrs.subject.c, "country")

                        // org_unit 组织单位
                        // this.form.org_unit = res.data.attrs.OU;
                        this.getUndefined(res.data.attrs.subject.ou, "org_unit")

                        // state 省份
                        // if (res.data.attrs.ST != undefined) {
                        //     this.form.state = res.data.attrs.ST;
                        // } else {
                        //     this.form.state = "";
                        // }
                        this.getUndefined(res.data.attrs.subject.st, "state")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.$commonJs.getCloseLoading()
                })
        },
        getUndefined(data, type) {
            // debugger;
            if (data != undefined) {
                if (data != "null") {
                    this.form[type] = data
                }
            } else {
                this.form[type] = ""
            }
        },

        handleChange(data) {
            this.$refs.cascaderHandle.dropDownVisible = false
            this.form.organization_id = data[data.length - 1]
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            //   columnIndex 当前列索引
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
            if (columnIndex === 1) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        },
        getAppList() {
            this.AppList = []
            let organization_id = ""
            if (this.$commonJs.getStorage().organization_id != "1") {
                organization_id = this.$commonJs.getStorage().organization_id
            }
            this.$commonJs
                .getMethodData(this.$url.GetList, "POST", {
                    organization_id: organization_id,
                    status: "20"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        let dataList = res.data.data
                        dataList.forEach((item) => {
                            this.AppList.push({
                                label: item.name,
                                value: item.appid
                            })
                        })
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getKeyList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.pageNow = newPage
            this.getKeyList()
        },
        organizationChange(data) {
            console.log(data, "data")
            this.ischeckList = [data]
        },
        handleSelectionChange(val) {
            console.log(val, "val")
        },
        getRadio(row) {
            this.keyRadio = row.KeyIndex
        },
        infoorganization() {
            this.radio = ""
            this.certDialogVisible = false
            this.keyDialogVisible = false
            this.doubleKeyDialogVisible = false
        },
        addorganization() {
            if (this.ischeckList.length < 1) {
                this.$message.error("请选择所属根证书!")
                return false
            } else {
                if (this.isCertList == "fenpei") {
                    this.formKey.cert_serial_name = this.ischeckList[0].subject
                    this.formKey.cert_serial_number =
                        this.ischeckList[0].serial_number
                    this.certDialogVisible = false
                }
            }
        },
        addKeyIndex() {
            this.keyDialogVisible = false
            this.doubleKeyDialogVisible = false
            this.form.key_index = this.keyRadio
        },
        handleSuccess(file) {
            console.log(file, "file")

            if (file.code == 100000) {
                this.$message.success("上传成功!")
                this.showFile = true
                this.$router.push("/applicationCertList")
            }
            // else {
            //     this.fileList = [];
            //     this.$message.error(file.msg);
            //     this.showFile = false;
            // }
            this.loading = false
            return
        },

        changeFile(file, fileList) {
            // console.log(fileList, "fileList");
            this.fileList = fileList
            this.formKey.signature_name = file.name
            // this.fileLoading = true;
            // this.$commonJs.getLoading();
        },
        changeFile1(file, fileList) {
            // console.log(fileList, "fileList");
            this.fileList1 = fileList
            this.formKey.encrypt_name = file.name
        },
        changeFile2(file, fileList) {
            this.fileList2 = fileList
            this.formKey.encryptKey_name = file.name
        },
        openPin() {
            // if (this.doubleRadio == "1") {
            //     this.$refs.PinDialog.modifyFormdialog = true
            //     this.$refs.PinDialog.modifyForm.PINStr = ""
            //     this.$refs.PinDialog.title = "私钥访问控制码"
            //     this.$refs.PinDialog.PIN = "私钥访问控制码"
            // } else {
            //     this.submitUpload()
            // }
            this.submitUpload()
        },
        PIN(val) {
            this.pucPassword = val
            this.submitUpload()
        },
        submitUpload() {
            let formData = new FormData()
            //   <!-- 将上传的文件放到数据对象中 -->
            if (this.formKey.cert_serial_number != "") {
                formData.append(
                    "cert_serial_number ",
                    this.formKey.cert_serial_number
                )
            } else {
                return this.$message.error("请选择根证书!")
            }
            if (this.formKey.appid != "") {
                formData.append("appid", this.formKey.appid)
            } else {
                return this.$message.error("请选择应用!")
            }
            formData.append(
                "app_env ",
                this.formKey.app_env
            )
            formData.append(
                "name ",
                this.formKey.name
            )
            if (this.fileList.length != 0) {
                formData.append("signature_cert", this.fileList[0].raw)
            } else {
                return this.$message.error("请选择签名证书!")
            }
            if (this.doubleRadio == "1") {
                if (this.fileList1.length != 0) {
                    formData.append("encrypt_cert", this.fileList1[0].raw)
                } else {
                    return this.$message.error("请选择加密证书!")
                }
                if (this.fileList2.length != 0) {
                    formData.append("encrypt_key_prv", this.fileList2[0].raw)
                } else {
                    return this.$message.error("请选择加密证书私钥!")
                }
                formData.append("encrypt_key_type", this.encrypt_key_type)
                if (this.pucPassword.length != 0) {
                    formData.append("encPucPassword", this.pucPassword)
                } else {
                    return this.$message.error("请填写私钥访问控制码!")
                }
            }
            this.$http
                .post(this.actionUrl, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("上传成功!")
                        this.cancel()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        handleRemove(file, fileList) {
            this.fileList = []
        },
        handleRemove1(file, fileList) {
            this.fileList1 = []
        },
        handleRemove2(file, fileList) {
            this.fileList2 = []
        },
        handlePreview(file) {
            console.log(file)
        },
        getUploadFile(file) { },
        getKeyIndex() {
            // if (this.form.cert_type == "")
            //     return this.$message.error("请选择证书类型!");

            if (this.form.key_algorithm == "")
                return this.$message.error("请选择密钥类型!")
            // 双证
            if (this.form.is_double == "1") {
                this.doubleKeyDialogVisible = true
            } else {
                this.isQianMing = true
                this.keyDialogVisible = true
            }
            // if (this.form.cert_type == "signature") {
            //     // 签名
            //     this.isQianMing = true;
            // } else {
            //     // encrypt 加密
            //     this.isQianMing = false;
            // }
            if (this.form.key_algorithm == "sm3_sm2") {
                // SM2
                this.keyUrl = this.$url.GetSM2KeyState
                this.$commonJs.deviceConfGet().then((res) => {
                    this.total = res.data.data.sm2_key_count
                })
                this.isRSA = false
                this.pageSize = 10
            } else {
                // RSA
                this.keyUrl = this.$url.GetRSAKeyState
                this.isRSA = true
                this.$commonJs.deviceConfGet().then((res) => {
                    this.total = res.data.data.rsa_key_count
                })
                this.pageSize = 5
            }

            console.log(
                this.form.cert_type,
                this.form.key_algorithm,
                "cert_type"
            )

            if (this.form.key_index == "") {
                this.keyRadio = ""
            }
            this.getKeyList()
        },
        getKeyList() {
            this.loading = true
            this.keyList = []

            this.$commonJs
                .getMethodData(this.keyUrl, "POST", {
                    // keynum *密钥个数
                    keyNum: this.pageSize,
                    pageNum: this.pageNow
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (this.form.is_double == "1") {
                            let dataList = res.data.data
                            if (this.isRSA == false) {
                                dataList.forEach((element) => {
                                    if (element.SDFE_UEK_SM2 != undefined) {
                                        let disabled = false
                                        if (
                                            element.SDFE_USK_SM2.uiKeyLen ==
                                            "0" ||
                                            element.SDFE_UEK_SM2.uiKeyLen == "0"
                                        ) {
                                            disabled = true
                                        }
                                        this.keyList.push(
                                            {
                                                KeyIndex: element.KeyIndex,
                                                SDFE_USK_SM2:
                                                    element.SDFE_USK_SM2,
                                                disabled: disabled
                                            },
                                            {
                                                KeyIndex: element.KeyIndex,
                                                SDFE_UEK_SM2:
                                                    element.SDFE_UEK_SM2,
                                                disabled: disabled
                                            }
                                        )
                                    }
                                })
                            } else {
                                dataList.forEach((element) => {
                                    console.log(element, "element")
                                    if (element.SDFE_UEK_RSA != undefined) {
                                        let disabled = false
                                        if (
                                            element.SDFE_USK_RSA.uiKeyLen ==
                                            "0" ||
                                            element.SDFE_UEK_RSA.uiKeyLen == "0"
                                        ) {
                                            disabled = true
                                        }
                                        this.keyList.push(
                                            {
                                                KeyIndex: element.KeyIndex,
                                                SDFE_USK_RSA:
                                                    element.SDFE_USK_RSA,
                                                disabled: disabled
                                            },
                                            {
                                                KeyIndex: element.KeyIndex,
                                                SDFE_UEK_RSA:
                                                    element.SDFE_UEK_RSA,
                                                disabled: disabled
                                            }
                                        )
                                    }
                                })
                            }
                        } else {
                            this.keyList = res.data.data
                        }

                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
                })
        },
        doubleChange() {
            this.keyRadio = ""
            this.form.key_algorithm = ""
            this.form.key_index = ""
        },
        getOrganizationTree(type) {
            this.isCertList = type
            if (type == "fenpei" || type == "cert") {
                this.certDialogVisible = true
                let Id = ""
                if (this.$commonJs.getStorage().organization_id != "1") {
                    Id = this.$commonJs.getStorage().organization_id
                }
                this.$commonJs.getLoading()
                this.$commonJs
                    .getMethodData(this.$url.GetrCertList, "POST", {
                        organization_id: Id,
                        status: "20"
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.certList = res.data.data
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                        this.$commonJs.getCloseLoading()
                    })
            } else {
                this.$commonJs.GetOrgList().then((res) => {
                    console.log(res, "组织机构")
                    this.organizationList = res
                })
            }
        },
        cancel() {
            this.$router.push("/applicationCertList")
        },

        onUpdate(formName) {
            let url
            // this.$url.GenCsr, "GET", {};
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.$commonJs.getLoading()
                if (this.$commonJs.getStorage().isAdmin != true) {
                    this.form.organization_id =
                        this.$commonJs.getStorage().organization_id
                }
                let data = this.$commonJs.getScreenValue(this.form)
                this.$delete(data, "organizationArr")
                if (this.mode == 1) {
                    url = this.$url.AddForCsr
                    this.$commonJs
                        .getMethodData(url, "POST", data)
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.cancel()
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            console.log(res, "res")
                            this.$commonJs.getCloseLoading()
                        })
                }
                if (this.mode == 3) {
                    let name = "数据应用证书管理"
                    url = this.$url.GetDictionaryUpd
                    if (this.type == "isProject") {
                        url = this.$url.GetDictionaryItemUpd
                        name = "应用证书管理项目"
                        // debugger;
                    }
                    this.$commonJs
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
                                        this.cancel()
                                    } else if (res.data.code != 800000) {
                                        this.$message.error(res.data.msg)
                                    }
                                })
                            this.$commonJs.getCloseLoading()
                        })
                        .catch((err) => {
                            this.$commonJs.getCloseLoading()
                        })
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}

/deep/ .el-tree-node__content {
    height: 50px !important;
}

/deep/.el-table__row .cell {
    line-height: 40px;
}

/deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
}

.keyStyle {
    height: 490px;
    overflow: hidden;
    overflow-y: auto;

    .el-dialog__footer {
        padding: 0px 20px 25px !important;
    }
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 6px;
    height: 10px;
    background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #ccc;
}

@media screen and (min-width: 1400px) {
    .offsetApp {
        margin-left: 15px;
    }
}

@media screen and (max-width: 1400px) {
    .offsetApp {
        margin-left: 8px;
    }
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
