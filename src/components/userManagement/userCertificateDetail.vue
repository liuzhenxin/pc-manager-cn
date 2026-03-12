<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/userCertificateList' }">
                <el-button size="mini" class="el-button1" type="warning"
                    style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle" v-if="mode != 10">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20">
                    <div style="display: flex;flex-direction: column;width: 50%;margin: auto;">
                        <borderTitle title="证书信息" style="display:inline-block">
                            <el-col :span="12" :offset="6">
                                <el-form-item label="证书序列号:" label-width="42%" prop="">
                                    {{form.serial_number}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="用户ID:" label-width="42%" prop="">
                                    {{ form.userid }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="所属根证书:" label-width="42%" prop="">
                                    <!-- <el-input class="inputwid" v-model="form.cert_serial_name" placeholder="点击右边选择按钮选择所属证书颁发机构" disabled></el-input> -->
                                    <!-- <el-button size="mini" @click="getOrganizationTree('fenpei')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button> -->
                                    {{form.cert_serial_name}}
                                </el-form-item>
                                <el-form-item label="组织机构:" label-width="42%" prop="">
                                    <!-- <el-input class="inputwid" v-model="form.organizationName" placeholder="点击右边选择按钮选择所属组织机构" disabled></el-input>
                            <el-button size="mini" @click="getOrganizationTree('ZuZhi')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button> -->
                                    {{ form.organizationName}}
                                </el-form-item>

                                <!-- <el-col :span="16" :offset="2" class="offsetApp">
                            <el-form-item label="所属用户:" label-width="28%" prop="">
                                <el-select v-model="form.userid" placeholder="请选择所属用户" style="width: 70%" :disabled="isDisable">
                                    <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="根证书序列号:" label-width="42%" prop="">
                                    {{ form.cert_serial_number}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="证书开始时间:" label-width="42%" prop="not_before">
                                    <!-- <el-input class="inputwid" v-model="form.appid" :disabled="isDisable" style="width:60%"></el-input> -->
                                    {{ form.not_before }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="证书结束时间:" label-width="42%" prop="not_after">
                                    <!-- <el-input class="inputwid" v-model="form.appid" :disabled="isDisable" style="width:60%"></el-input> -->
                                    {{ form.not_after }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                        <borderTitle title="证书主题" style="display:inline-block">
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="通用名:" label-width="42%" prop="">
                                    {{ form.common_name }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="使用者名称:" label-width="42%" prop="">
                                    {{ form.org_unit }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="组织:" label-width="42%" prop="">
                                    {{ form.org }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="城市:" label-width="42%" prop="">
                                    {{ form.location }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="省份:" label-width="42%" prop="">
                                    {{ form.state }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="国家/地区:" label-width="42%" prop="">
                                    <!-- <el-select class="inputwid" v-model="form.country" placeholder="" :disabled="isDisable">
                                <el-option v-for="item in $commonJs.getCnData()" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select> -->
                                    {{ form.country }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                        <borderTitle title="密钥管理" style="display:inline-block">
                            <el-col :span="12" :offset="6">
                                <el-form-item label="密钥来源:" label-width="42%" prop="">
                                    <!-- <el-input class="inputwid" v-model="form.key_source" placeholder=""
                                :disabled="isDisable"></el-input> -->
                                    {{ form.key_source }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <!-- <el-form-item label="证书类型:" label-width="21%" prop="" v-if="mode == 2">
                            <el-select v-model="form.cert_type" placeholder="请输入证书类型" style="width: 60%"
                                :disabled="isDisable">
                                <el-option v-for="item in certTypeList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="密钥类型:" label-width="42%" prop="">
                                    <!-- <el-select v-model="form.key_algorithm" placeholder="请输入密钥类型" style="width: 60%"
                                :disabled="isDisable">
                                <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select> -->
                                    {{ form.key_algorithm }}
                                </el-form-item>
                            </el-col>
                        </borderTitle>
                    </div>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="intanle" v-if="mode == 10">

            <el-form ref="form" :model="formKey" :rules="rulesKey" label-position="right" label-width="21%"
                style="margin-bottom:20px">
                <el-row :gutter="20" v-if="isDoubleOrNot">
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
                    <!-- <el-col :span="12" :offset="1"> -->
                    <!-- <el-form-item label="所属根证书:" label-width="21%" prop="cert_serial_name">
                            <el-input class="inputwid" v-model="formKey.cert_serial_name" placeholder="点击右边选择按钮选择所属证书颁发机构" disabled></el-input>
                            <el-button size="mini" @click="getOrganizationTree('cert')" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button>
                        </el-form-item> -->

                    <!-- <el-form-item label="签名证书:" label-width="21%" prop="signature_name"> -->
                    <!-- <el-input class="inputwid" v-model="formKey.signature_name" placeholder="点击右边选择按钮选择签名证书" disabled></el-input> -->
                    <!-- :http-request="httpRequest" :auto-upload="false" :before-upload="beforeUpload" -->
                    <!-- 上传 -->
                    <!-- <el-upload ref="upload" :auto-upload="false" class="upload-demo" style="display:inline-block" :on-change="changeFile" name="signature_cert" :show-file-list="showFile" :headers="MyHeader" :action="actionUrl" :on-exceed="handleExceed" :on-success="handleSuccess" multiple :limit="2" :file-list="fileList">
                        <el-button size="mini" style="margin-left:10px" type="primary" icon="el-icon-plus">上传签名证书</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    </el-upload> -->
                    <!-- 结束 -->
                    <el-col :span="12" :offset="6" style="margin-top:10px;">
                        <el-form-item label="所属根证书:" label-width="21%" prop="cert_serial_name">
                            <el-input class="inputwid" v-model="form.cert_serial_name" placeholder="点击右边选择按钮选择所属证书颁发机构"
                                disabled></el-input>
                            <el-button size="mini" @click="getOrganizationTree('fenpei')" v-if="mode != 2"
                                style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:10px;">
                        <el-form-item label="所属用户:" label-width="21%" prop="userid">
                            <el-select v-model="form.userid" placeholder="请选择所属用户" style="width: 70%" :disabled="isDisable">
                                <el-option v-for="item in userList" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style="margin-top:10px;">
                        <el-form-item label="签名证书:" label-width="21%" prop="signature_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl"
                                :on-preview="handlePreview" :on-remove="handleRemove" :on-change="changeFile"
                                :file-list="fileList" :headers="MyHeader" :limit="2" :auto-upload="false"
                                :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择签名证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="isEncryption == true" style="margin-top:20px;">
                        <el-form-item label="加密证书:" label-width="21%" prop="encrypt_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl"
                                :on-preview="handlePreview" :on-remove="handleRemove1" :on-change="changeFile1"
                                :file-list="fileList1" :headers="MyHeader" :limit="2" :auto-upload="false"
                                :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini"
                                    type="primary">选择加密证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" :offset="6" v-if="isEncryption==true" style="margin-top:20px;">
                        <el-form-item label="加密证书私钥:" label-width="21%" prop="encryptKey_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove2" :on-exceed="handleExceed" :on-change="changeFile2" :file-list="fileList2" :headers="MyHeader" :limit="1" :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini" type="primary">选择加密证书私钥</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isEncryption==true" :offset="6" style="margin-top:20px">
                        <el-form-item label="私钥访问控制码:" label-width="21%">
                            <el-input class="inputwid" v-model="pucPassword" type="password" style="width:25%" placeholder="请填写"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:35px;margin-left:12%;">
                            <el-button size="mini" @click="cancel" type="warning" style="margin-bottom:10px">取消</el-button>
                            <el-button size="mini" type="primary" @click="submitUpload"
                                style="margin-bottom:20px">确定</el-button>
                        </el-form-item>
                    </el-col>
                    <!-- </el-form-item> -->
                    <!-- <el-col :span="12" :offset="6" style="margin-left:77px">
                            <el-form-item label="所属用户:" label-width="21%" prop="userid">
                                <el-select v-model="formKey.userid" placeholder="请选择所属用户" style="width: 60%" :disabled="isDisable">
                                    <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value">
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
        <el-dialog title="选择组织机构" :visible.sync="dialogVisible" width="30%">
            <el-row style="margin-top:-30px">
                <el-col>
                    <div class="downTree">
                        <el-tree :data="organizationList" check-strictly :expand-on-click-node="false" default-expand-all
                            node-key="id" ref="tree" highlight-current :props="defaultProps"
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
    </div>
</template>
<script>
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    components: {
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
            certSvsId: this.$route.query.id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",
            // offsetApp: 2,
            organizationList: [],
            certList: [],
            isCertList: "",
            isAdmin: true,
            pageNow: 1,
            pageSize: 10,
            fileLoading: false,
            total: 10,
            loading: false,
            dialogVisible: false,
            fileList: [],
            fileList1: [],
            fileList2: [],
            fileName: [],
            // actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            actionUrl: "",
            MyHeader: { Authorization: "" },
            showFile: false,
            fileUploadList: [],
            form: {
                organizationName: "",
                cert_serial_name: "",
                pucPassword: "",
                userid: "",
                is_double: "0",
                cert_serial_number: "", // 根证书颁发机构id【根证书序列号】
                cert_type: "", // 证书型：signature 签名 encrypt 加密
                common_name: "", // 颁发机构名称【证书中的cn】
                country: "", // 国家/地区
                key_index: "", // 密钥索引
                key_algorithm: "", // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                location: "", // 城市
                org: "", // 组织
                org_unit: "", // 使用者名称
                organization_id: "1", // 组织机构id
                state: "", // 省份
                key_source: "" // 来源
            },
            pucPassword: "",
            rules: {
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
                organizationName: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ],
                cert_serial_name: [
                    {
                        required: true,
                        message: "请选择所属证书颁发机构",
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
                org_unit: [
                    {
                        required: true,
                        message: "请输入使用者名称",
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

                location: [
                    {
                        required: true,
                        message: "请输入所在城市名称",
                        trigger: "blur"
                    }
                ],
                userid: [
                    {
                        required: true,
                        message: "请选择所属用户",
                        trigger: "blur"
                    }
                ],
                state: [
                    {
                        required: true,
                        message: "请输入所在省份名称",
                        trigger: "change"
                    }
                ],

                country: [
                    {
                        required: true,
                        message: "请选择国家/地区",
                        trigger: "blur"
                    }
                ],
                org: [
                    {
                        required: true,
                        message: "请输入所在单位名称",
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
                encryptKey_name: "", // 加密证书私钥
                encrypt_name: "", // 加密证书名字
                signature_cert: "", // 签名证书
                encrypt_cert: "", // 加密证书
                encrypt_key_prv: "", // 加密证书私钥
                cert_serial_name: "",
                cert_serial_number: "",
                userid: "",
                sort1: ""
            },
            rulesKey: {},
            certDefaultProps: {
                children: "children",
                label: "subject"
                // icon-class:"icon"
            },
            defaultProps: {
                children: "children",
                label: "name"
            },
            userList: [],
            systemTypeList: [],
            ischeckList: [],
            isQianMing: false,
            keyUrl: "",
            isRSA: "",
            keyType1: "",
            keyType2: "",
            dataType: [],
            isDoubleOrNot: true
        }
    },

    created() {
        if (this.mode != 1) {
            if (this.mode == 3) {
                this.name = "修改用户证书管理"
                this.getcertSvsDetail()
            } else if (this.mode == 2) {
                this.isDisable = true
                this.name = "用户证书管理详情"
                this.getcertSvsDetail()
            } else if (this.mode == 10) {
                // this.isDisable = true;
                this.name = "导入用户密钥和证书"
            }
        } else {
            this.name = "申请用户证书"
        }
        this.actionUrl = this.$url.UserCertImportCert
        this.$nextTick(() => {
            this.$refs.form.resetFields()
        })
        this.getUserList()
        this.MyHeader = {
            Authorization: window.sessionStorage.getItem("Authorization"),
            "Content-Type": "multipart/form-data"
        }
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
        }
    },
    methods: {
        // 获取详情
        getResourceDetail(code) {
            this.loading = true
            let url = this.$url.ResourceGetByCode
            this.$commonJs
                .getMethodData(url, "POST", {
                    page: "userCertificateDetail",
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
        getcertSvsDetail() {
            this.$commonJs.getLoading()
            let url
            // if (this.type == "isProject") {
            //     url = this.$url.GetDictionaryItemById;
            // } else {
            url = this.$url.UserCertGetById
            // }
            this.$commonJs
                .getMethodData(url, "POST", {
                    id: this.certSvsId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")

                        // org 组织

                        this.form = res.data.data
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

                        // org_unit 使用者名称
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
            if (data != undefined) {
                if (data != "null") {
                    this.form[type] = data
                }
            } else {
                this.form[type] = ""
            }
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
        getUserList() {
            this.userList = []
            let organization_id = ""
            if (this.$commonJs.getStorage().organization_id != "1") {
                organization_id = this.$commonJs.getStorage().organization_id
            }
            this.$commonJs
                .getMethodData(this.$url.GetSvsUserList, "POST", {
                    organization_id: organization_id,
                    status: "20"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        let dataList = res.data.data
                        dataList.forEach((item) => {
                            this.userList.push({
                                label: item.fullname,
                                value: item.userid
                            })
                        })
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    console.log(res, "res")
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
            this.dialogVisible = false
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
                    this.form.cert_serial_name = this.ischeckList[0].subject
                    this.form.cert_serial_number =
                        this.ischeckList[0].serial_number
                    this.certDialogVisible = false
                } else if (this.isCertList == "cert") {
                    this.formKey.cert_serial_name = this.ischeckList[0].subject
                    this.formKey.cert_serial_number =
                        this.ischeckList[0].serial_number
                    this.certDialogVisible = false
                } else {
                    this.form.organizationName = this.ischeckList[0].name
                    this.form.organization_id = this.ischeckList[0].id
                    this.dialogVisible = false
                }
                console.log(this.ischeckList[0], "this.ischeckList[0]")
            }
        },
        addKeyIndex() {
            this.keyDialogVisible = false
            this.doubleKeyDialogVisible = false
            this.form.key_index = this.keyRadio
        },
        handleSuccess(file) {
            console.log(file, "file")
            // this.$nextTick(() => {
            //     this.$commonJs.getCloseLoading();
            // });
            if (file.code == 100000) {
                this.$message.success("上传成功!")
                this.showFile = true
                this.$router.push("/userCertificateList")
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
            // this.fileList = fileList
            // this.formKey.signature_name = file.name
            if (fileList.length > 1) {
                fileList.splice(0, 1) // 当上传文件大于1的时候替换，移除之前的文件（0是要删除数组的下标，1是要删除的数量）
                this.fileList = fileList
                this.formKey.signature_name = file.name
            } else {
                this.fileList = fileList
            }
            // this.fileLoading = true;
            // this.$commonJs.getLoading();
        },
        changeFile1(file, fileList) {
            // console.log(fileList, "fileList");
            // this.fileList1 = fileList
            // this.formKey.encrypt_name = file.name
            if (fileList.length > 1) {
                fileList.splice(0, 1) // 当上传文件大于1的时候替换，移除之前的文件（0是要删除数组的下标，1是要删除的数量）
                this.fileList1 = fileList
                this.formKey.encrypt_name = file.name
            } else {
                this.fileList1 = fileList
            }
        },
        changeFile2(file, fileList) {
            this.fileList2 = fileList
            this.formKey.encryptKey_name = file.name
        },
        submitUpload() {
            console.log(this.fileList, "upload")
            let formData = new FormData()
            //   <!-- 将上传的文件放到数据对象中 -->
            formData.append(
                "organization_id",
                this.$commonJs.getStorage().organization_id
            )
            formData.append("cert_serial_number", this.form.cert_serial_number)
            formData.append("userid", this.form.userid)
            console.log(this.fileList)
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
                // if (this.fileList2.length != 0) {
                //     formData.append("encrypt_key_prv", this.fileList2[0].raw)
                // } else {
                //     return this.$message.error("请选择加密证书私钥!")
                // }
                // if (this.pucPassword.length != 0) {
                //     formData.append("encPucPassword", this.pucPassword)
                // } else {
                //     return this.$message.error("请填写私钥访问控制码!")
                // }
            }
            this.$http
                .post(this.actionUrl, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((res) => {
                    console.log("222", res)
                    if (res.data.code == 100000) {
                        this.$message.success("上传成功!")
                        this.cancel()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
            this.fileList = []
        },
        handleRemove1(file, fileList) {
            console.log(file, fileList)
            this.fileList1 = []
        },
        handleRemove2(file, fileList) {
            console.log(file, fileList)
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
                                    console.log(element, "element")
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
                        console.log(this.keyList, "keyList")
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
            if (this.mode == 2) {
                return false
            }
            console.log(type)
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
                            console.log(res.data.data)
                            this.certList = res.data.data
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                        this.$commonJs.getCloseLoading()
                    })
            } else {
                this.dialogVisible = true
                this.$commonJs.getLoading()

                this.$commonJs
                    .getMethodData(this.$url.GetOrganizationList, "POST", {
                        status: ""
                    })
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.organizationList = JSON.parse(res.data.data)
                            console.log(this.organizationList, "res")
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                        this.$commonJs.getCloseLoading()
                        console.log(res, "res")
                    })
            }
        },
        cancel() {
            this.$router.push("/userCertificateList")
        },

        onUpdate(formName) {
            let url
            this.$refs[formName].validate((valid) => {
                if (!valid) return
                this.$commonJs.getLoading()
                if (this.$commonJs.getStorage().isAdmin != true) {
                    this.form.organization_id =
                        this.$commonJs.getStorage().organization_id
                }
                let data = this.$commonJs.getScreenValue(this.form)
                console.log(data, "data")
                if (this.mode == 1) {
                    url = this.$url.AddSvsForCsr
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
