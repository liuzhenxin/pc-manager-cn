<template>
    <div v-loading="DivLoading">

        <div class="intanle" id="ADD" ref="ADD" :key="num" style="padding:0px 20px 20px;margin-bottom:20px" v-show="aio_step =='2'   ||isShowAdd == 1 ">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" style="padding-bottom:0px;margin-bottom:20px" class="CardClass">
                <el-tab-pane label="非自签根证书" name="add">
                    <el-form ref="formAdd" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                        <el-row :gutter="20">
                            <el-col :span="12" :offset="6">

                                <!-- <el-form-item label="组织机构:" label-width="21%" prop="organizationName" v-if="$commonJs.getStorage().isAdmin==true">
                                    <el-input class="inputwid" v-model="form.organizationName" placeholder="点击右边选择按钮选择所属组织机构" disabled></el-input>
                                    <el-button size="mini" @click="getOrganizationTree('ZuZhi','add')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button>
                                </el-form-item> -->

                            </el-col>
                            <el-col :span="12" :offset="6" style="">
                                <el-form-item label="证书名称:" label-width="21%" prop="name">
                                    <el-input class="inputwid" v-model="form.name" placeholder="请输入证书名称" :disabled="isDisable" style="width:60%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style=" ">
                                <el-form-item label="通用名:" label-width="21%" prop="common_name">
                                    <el-input class="inputwid" v-model="form.common_name" placeholder="请输入组织/公司全称(Common Name)" :disabled="isDisable" style="width:60%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="使用者名称:" label-width="21%" prop="org_unit">
                                    <el-input class="inputwid" v-model="form.org_unit" placeholder="请输入使用者名称" :disabled="isDisable"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="组织:" label-width="21%" prop="org">
                                    <el-input class="inputwid" v-model="form.org" placeholder="请输入所在单位名称(org)" :disabled="isDisable"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="城市:" label-width="21%" prop="location">
                                    <el-input class="inputwid" v-model="form.location" placeholder="请输入所在城市名称(Location)" :disabled="isDisable"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="省份:" label-width="21%" prop="state">
                                    <el-input class="inputwid" v-model="form.state" placeholder="请输入所在省份名称(State)" :disabled="isDisable"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="国家/地区:" label-width="21%" prop="country">
                                    <!-- <el-input class="inputwid" v-model="form.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable"></el-input> -->
                                    <el-select class="inputwid" v-model="form.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable">
                                        <el-option v-for="item in $commonJs.getCnData()" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12" :offset="6">
                                <el-form-item label="签名算法:" label-width="21%" prop="key_type">
                                    <el-select v-model="form.key_type" placeholder="请选择签名算法" style="width: 60%" :disabled="isDisable">
                                        <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="密钥索引:" label-width="21%" prop="key_index">
                                    <el-select v-model="form.key_index" placeholder="请选择密钥索引" style="width: 60%" :disabled="isDisable">
                                        <el-option v-for="item in keyIndexList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <!-- <el-input class="inputwid" v-model="form.key_index" placeholder="点击右边选择按钮选择密钥索引" disabled></el-input>
                                    <el-button size="mini" @click="getKeyIndex('add')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button> -->
                                </el-form-item>
                                <el-form-item label="私钥访问控制码:" label-width="22%" style="margin-left: -8px;" prop="pucPassword">
                                    <el-input class="inputwid" v-model="form.pucPassword" type="password" :disabled="isDisable" placeholder="请输入私钥访问控制码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" type="primary" @click="onUpdate('formAdd','add')" style="margin-bottom:20px">生成证书请求文件</el-button>

                            </el-form-item>
                        </el-col>
                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="自签根证书" name="make">
                    <el-form ref="formMake" :model="formMake" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                        <el-row :gutter="20">
                            <el-col :span="12" :offset="6">

                                <!-- <el-form-item label="组织机构:" label-width="21%" prop="organizationName" v-if="$commonJs.getStorage().isAdmin==true">
                                    <el-input class="inputwid" v-model="formMake.organizationName" placeholder="点击右边选择按钮选择所属组织机构" disabled></el-input>
                                    <el-button size="mini" @click="getOrganizationTree('ZuZhi','make')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button>
                                </el-form-item> -->

                            </el-col>
                            <!-- <el-col :span="12" :offset="6">
                                <el-form-item label="签名者:" label-width="21%" prop="signer_id">
                                    <el-select style="width:60%" :disabled="CADisable" v-model="formMake.signer_id" placeholder="请选择签名者">
                                        <el-option v-for="item in signerList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="证书模板:" prop="profile_id">
                                    <el-select class="inputwid" v-model="formMake.profile_id" placeholder="请选择证书模板" :disabled="isDisable">
                                        <el-option v-for="item in profileList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="12" :offset="6" style="">
                                <el-form-item label="证书名称:" label-width="21%" prop="name">
                                    <el-input class="inputwid" v-model="formMake.name" placeholder="请输入证书名称" :disabled="isDisable" style="width:60%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6" style="">
                                <el-form-item label="通用名:" label-width="21%" prop="common_name">
                                    <el-input class="inputwid" v-model="formMake.common_name" placeholder="请输入组织/公司全称(Common Name)" :disabled="isDisable" style="width:60%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="使用者名称:" label-width="21%" prop="org_unit">
                                    <el-input class="inputwid" v-model="formMake.org_unit" placeholder="请输入使用者名称" :disabled="isDisable"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="组织:" label-width="21%" prop="org">
                                    <el-input class="inputwid" v-model="formMake.org" placeholder="请输入所在单位名称(org)" :disabled="isDisable"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="城市:" label-width="21%" prop="location">
                                    <el-input class="inputwid" v-model="formMake.location" placeholder="请输入所在城市名称(Location)" :disabled="isDisable"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="省份:" label-width="21%" prop="state">
                                    <el-input class="inputwid" v-model="formMake.state" placeholder="请输入所在省份名称(State)" :disabled="isDisable"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="6">
                                <el-form-item label="国家/地区:" label-width="21%" prop="country">
                                    <!-- <el-input class="inputwid" v-model="formMake.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable"></el-input> -->
                                    <el-select class="inputwid" v-model="formMake.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable">
                                        <el-option v-for="item in $commonJs.getCnData()" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12" :offset="6">
                                <el-form-item label="签名算法:" label-width="21%" prop="key_type">
                                    <el-select v-model="formMake.key_type" placeholder="请选择签名算法" style="width: 60%" :disabled="isDisable">
                                        <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                                <el-form-item label="密钥索引:" label-width="21%" prop="key_index">
                                    <el-select v-model="formMake.key_index" placeholder="请选择密钥索引" style="width: 60%" :disabled="isDisable">
                                        <el-option v-for="item in keyIndexList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <!-- <el-input class="inputwid" v-model="formMake.key_index" placeholder="点击右边选择按钮选择密钥索引" disabled></el-input>
                                    <el-button size="mini" @click="getKeyIndex('make')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button> -->
                                </el-form-item>
                                <el-form-item label="私钥访问控制码:" label-width="22%" style="margin-left: -8px;" prop="pucPassword">
                                    <el-input class="inputwid" v-model="formMake.pucPassword" type="password" :disabled="isDisable" placeholder="请输入私钥访问控制码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-col :span="12" :offset="6">
                            <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                                <el-button size="mini" type="primary" @click="onUpdate('formMake','make')" style="margin-bottom:20px">自签根证书</el-button>

                            </el-form-item>
                        </el-col>
                    </el-form>

                </el-tab-pane>
            </el-tabs>
        </div>

        <el-card class="intanle" id="Import" ref="Import" v-show="aio_step == '3' ||isShowAdd == 2" style="margin:0px 20px 20px">
            <el-form ref="form" :model="formDetail" :rules="rules" label-position="right" label-width="21%" style="">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="">
                        <el-form-item label="通用名:" label-width="21%">
                            <el-input class="inputwid" v-model="formDetail.common_name" placeholder="请输入组织/公司全称(Common Name)" disabled style="width:60%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="使用者名称:" label-width="21%">
                            <el-input class="inputwid" v-model="formDetail.org_unit" placeholder="请输入使用者名称" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="组织:" label-width="21%">
                            <el-input class="inputwid" v-model="formDetail.org" placeholder="请输入所在单位名称(org)" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="城市:" label-width="21%">
                            <el-input class="inputwid" v-model="formDetail.location" placeholder="请输入所在城市名称(Location)" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="省份:" label-width="21%">
                            <el-input class="inputwid" v-model="formDetail.state" placeholder="请输入所在省份名称(State)" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="国家/地区:" label-width="21%">
                            <!-- <el-select class="inputwid" v-model="formDetail.country" placeholder="请选择国家/地区(Country)">
                                <el-option v-for="item in $commonJs.getCnData()" :key="item.value" :label="item.label" disable :value="item.value">
                                </el-option>
                            </el-select> -->
                            <el-input class="inputwid" v-model="formDetail.country" placeholder="请选择国家/地区(Country)" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="签名算法:" label-width="21%">
                            <el-select v-model="formDetail.key_type" placeholder="请选择签名算法" style="width: 60%" disabled>
                                <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="密钥索引:" label-width="21%">
                            <el-input class="inputwid" v-model="formDetail.key_index" placeholder="请选择密钥索引" disabled></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="私钥访问控制码:" label-width="22%" style="margin-left: -8px;" prop="pucPassword">
                            <el-input class="inputwid" v-model="formDetail.pucPassword" type="password" :disabled="isDisable" placeholder="请输入私钥访问控制码"></el-input>
                        </el-form-item> -->
                        <el-form-item label="下载证书:" label-width="21%" style="margin-top:20px">
                            <el-button icon="el-icon-upload" plain size="mini" @click="uploadCert('')" type="primary">下载CSR</el-button>
                        </el-form-item>

                    </el-col>
                </el-row>
            </el-form>
            <el-form ref="form" :model="formKey" :rules="rulesKey" label-position="right" label-width="21%" style="margin-bottom:20px;margin-top:0px !important">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6" style="margin-top:10px;">
                        <el-form-item label="导入根证书:" label-width="21%" prop="signature_name">
                            <el-upload style="" accept=".cer" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed" :on-change="changeFile" :file-list="fileList" :headers="MyHeader" :limit="1" :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini" type="primary">选择签名证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="isEncryption==true" style="margin-top:20px;">
                        <el-form-item label="加密证书:" label-width="21%" prop="encrypt_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove1" :on-exceed="handleExceed" :on-change="changeFile1" :file-list="fileList1" :headers="MyHeader" :limit="1" :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini" type="primary">选择加密证书</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="isEncryption==true" style="margin-top:20px;">
                        <el-form-item label="加密证书私钥:" label-width="21%" prop="encryptKey_name">
                            <el-upload style="" class="upload-demo" ref="upload" :show-file-list="true" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove2" :on-exceed="handleExceed" :on-change="changeFile2" :file-list="fileList2" :headers="MyHeader" :limit="1" :auto-upload="false" :on-success="handleSuccess">
                                <el-button slot="trigger" icon="el-icon-plus" plain size="mini" type="primary">选择加密证书私钥</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label-width="10%" style="margin-top:35px;margin-left:12%;">
                            <el-button size="mini" type="primary" @click="submitUpload" style="margin-bottom:20px">确定</el-button>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
        </el-card>
        <el-card class="intanle" id="deviceCA" v-if="aio_step == '4'" style="margin:0px 20px 20px">
            <el-form ref="formCA" :model="formCA" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">

                        <!-- <el-form-item label="组织机构:" label-width="21%" prop="organizationName" v-if="$commonJs.getStorage().isAdmin==true">
                                    <el-input class="inputwid" v-model="form.organizationName" placeholder="点击右边选择按钮选择所属组织机构" disabled></el-input>
                                    <el-button size="mini" @click="getOrganizationTree('ZuZhi','add')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button>
                                </el-form-item> -->

                    </el-col>
                    <el-col :span="12" :offset="6" style="">
                        <el-form-item label="证书名称:" label-width="21%" prop="name">
                            <el-input class="inputwid" v-model="formCA.name" placeholder="请输入证书名称" :disabled="isDisable" style="width:60%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" style=" ">
                        <el-form-item label="通用名:" label-width="21%" prop="common_name">
                            <el-input class="inputwid" v-model="formCA.common_name" placeholder="请输入组织/公司全称(Common Name)" :disabled="isDisable" style="width:60%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="使用者名称:" label-width="21%" prop="org_unit">
                            <el-input class="inputwid" v-model="formCA.org_unit" placeholder="请输入使用者名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="组织:" label-width="21%" prop="org">
                            <el-input class="inputwid" v-model="formCA.org" placeholder="请输入所在单位名称(org)" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="城市:" label-width="21%" prop="location">
                            <el-input class="inputwid" v-model="formCA.location" placeholder="请输入所在城市名称(Location)" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="省份:" label-width="21%" prop="state">
                            <el-input class="inputwid" v-model="formCA.state" placeholder="请输入所在省份名称(State)" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="国家/地区:" label-width="21%" prop="country">
                            <el-select class="inputwid" v-model="formCA.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable">
                                <el-option v-for="item in $commonJs.getCnData()" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <!-- <el-input class="inputwid" v-model="formCA.country" placeholder="请选择国家/地区(Country)" :disabled="isDisable"></el-input> -->
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" :offset="6">
                        <el-form-item label="签名算法:" label-width="21%" prop="key_type">
                            <el-select v-model="formCA.key_type" placeholder="请选择签名算法" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="密钥索引:" label-width="21%" prop="key_index">
                            <el-select v-model="formCA.key_index" placeholder="请选择密钥索引" style="width: 60%" :disabled="isDisable">
                                <el-option v-for="item in keyIndexList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <!-- <el-input class="inputwid" v-model="formCA.key_index" placeholder="点击右边选择按钮选择密钥索引" disabled></el-input> -->
                            <!-- <el-button size="mini" @click="getKeyIndex('CAadd')" v-if="mode!=2" style="margin-left:10px" type="primary" icon="el-icon-plus">选择</el-button> -->
                        </el-form-item>
                        <el-form-item label="私钥访问控制码:" label-width="22%" style="margin-left: -8px;" prop="pucPassword">
                            <el-input class="inputwid" v-model="formCA.pucPassword" type="password" :disabled="isDisable" placeholder="请输入私钥访问控制码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" type="primary" @click="onUpdate('formCA','CAadd')" style="margin-bottom:20px">生成CA设备证书</el-button>

                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>
        <el-dialog title="选择所属根证书" :visible.sync="certDialogVisible" width="35%">
            <el-row style="margin-top:-30px">
                <el-col>
                    <div class="downTree">
                        <el-tree :data="certList" check-strictly :expand-on-click-node="false" default-expand-all node-key="id" ref="tree" highlight-current :props="certDefaultProps" @check=" (click, checked)=>{handleCheckChange(click, checked)}">
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
                        <el-tree :data="organizationList" check-strictly :expand-on-click-node="false" default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" @check=" (click, checked)=>{handleCheckChange(click, checked)}">
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
                            <el-table ref="symmetricTable" v-loading="loading" :data="keyList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="50">
                                    <template slot-scope="scope">
                                        <div v-if="isRSA == false">
                                            <el-radio v-if="isQianMing == false" :disabled="scope.row.SDFE_UEK_SM2.uiKeyLen=='0'" style="margin-left:8px" v-model="keyRadio" :label="scope.row.KeyIndex" @change="getRadio(scope.row)">
                                                {{  }}
                                            </el-radio>
                                            <el-radio v-if="isQianMing == true" :disabled="scope.row.SDFE_USK_SM2.uiKeyLen=='0'" style="margin-left:8px" v-model="keyRadio" :label="scope.row.KeyIndex" @change="getRadio(scope.row)">
                                                {{  }}
                                            </el-radio>
                                        </div>
                                        <div v-if="isRSA == true">
                                            <el-radio v-if="isQianMing == false" :disabled="scope.row.SDFE_UEK_RSA.uiKeyLen=='0'" style="margin-left:8px" v-model="keyRadio" :label="scope.row.KeyIndex" @change="getRadio(scope.row)">
                                                {{  }}
                                            </el-radio>
                                            <el-radio v-if="isQianMing == true" :disabled="scope.row.SDFE_USK_RSA.uiKeyLen=='0'" style="margin-left:8px" v-model="keyRadio" :label="scope.row.KeyIndex" @change="getRadio(scope.row)">
                                                {{  }}
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
                                                <span v-if="scope.row.SDFE_UEK_SM2.uiKeyLen=='0'">-</span>
                                                <span v-else>{{scope.row.SDFE_UEK_SM2.uiKeyLen}}</span>
                                            </span>
                                            <span v-if="isQianMing == true">
                                                <span v-if="scope.row.SDFE_USK_SM2.uiKeyLen == '0'">-</span>
                                                <span v-else>{{scope.row.SDFE_USK_SM2.uiKeyLen}}</span>
                                            </span>
                                        </div>
                                        <div v-if="isRSA == true">
                                            <span v-if="isQianMing == false">
                                                <span v-if="scope.row.SDFE_UEK_RSA.uiKeyLen=='0'">-</span>
                                                <span v-else>{{scope.row.SDFE_UEK_RSA.uiKeyLen}}</span>
                                            </span>
                                            <span v-if="isQianMing == true">
                                                <span v-if="scope.row.SDFE_USK_RSA.uiKeyLen == '0'">-</span>
                                                <span v-else>{{scope.row.SDFE_USK_RSA.uiKeyLen}}</span>
                                            </span>
                                        </div>
                                    </template>

                                </el-table-column>

                                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                                </div>
                            </el-table>
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
                            <el-table ref="symmetricTable" v-loading="loading" :data="keyList" :span-method="objectSpanMethod" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                                <el-table-column type="selection" width="100">
                                    <template slot-scope="scope">
                                        <div v-if="isRSA == false">
                                            <el-radio :disabled="scope.row.disabled" style="margin-left:8px" v-model="keyRadio" :label="scope.row.KeyIndex" @change="getRadio(scope.row)">
                                                {{  }}
                                            </el-radio>

                                        </div>
                                        <div v-if="isRSA == true">
                                            <el-radio :disabled="scope.row.disabled" style="margin-left:8px" v-model="keyRadio" :label="scope.row.KeyIndex" @change="getRadio(scope.row)">
                                                {{  }}
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
                                                <span v-if="scope.row.SDFE_UEK_SM2.uiKeyLen=='0'">-</span>
                                                <span v-else>{{scope.row.SDFE_UEK_SM2.uiKeyLen}}</span>
                                            </span>
                                            <span v-if="scope.row.SDFE_UEK_SM2 == undefined">
                                                <span v-if="scope.row.SDFE_USK_SM2.uiKeyLen == '0'">-</span>
                                                <span v-else>{{scope.row.SDFE_USK_SM2.uiKeyLen}}</span>
                                            </span>
                                        </span>
                                        <span v-if="isRSA == true">
                                            <span v-if="scope.row.SDFE_USK_RSA == undefined">
                                                <span v-if="scope.row.SDFE_UEK_RSA.uiKeyLen =='0'">-</span>
                                                <span v-else>{{scope.row.SDFE_UEK_RSA.uiKeyLen}}</span>
                                            </span>
                                            <span v-if="scope.row.SDFE_UEK_RSA == undefined">
                                                <span v-if="scope.row.SDFE_USK_RSA.uiKeyLen =='0'">-</span>
                                                <span v-else>{{scope.row.SDFE_USK_RSA.uiKeyLen}}</span>
                                            </span>
                                        </span>
                                    </template>
                                </el-table-column>

                                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                                </div>
                            </el-table>
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
import $ from "jquery"
import PinList from "../CaCert/PinList.vue"
export default {
    inject: ["reload"],
    props: {
        isInit: {
            type: Boolean
        }
        // aio_step: {
        //     type: String
        // },
    },
    components: {
        PinList
    },
    data() {
        return {
            DivLoading: false,
            abc: "",
            num: 0,
            activeName: "add",
            keyRadio: "",
            isEncryption: false,
            keyList: [],
            keyDialogVisible: false,
            certDialogVisible: false,
            doubleKeyDialogVisible: false,
            name: "",
            mode: this.$route.query.mode,
            certId: this.$route.query.id,
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
                sort1: ""
            },

            keyIndexList: [],
            rulesKey: {},
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            MyHeader: { Authorization: "" },
            showFile: false,
            CADisable: false,
            fileUploadList: [],
            form: {
                pucPassword: "",
                organizationName: "",
                cert_serial_name: "",
                appid: "",
                is_double: "0",
                name: "",
                cert_serial_number: "", // 根证书颁发机构id【根证书序列号】
                cert_type: "", // 证书型：signature 签名 encrypt 加密
                common_name: "", // 颁发机构名称【证书中的cn】
                country: "", // 国家/地区
                key_index: "", // 密钥索引
                key_type: "", // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                location: "", // 城市
                org: "", // 组织
                org_unit: "", // 使用者名称
                organization_id: "1", // 组织机构id
                state: "" // 省份
            },
            formCA: {
                organizationName: "",
                cert_serial_name: "",
                appid: "",
                is_double: "0",
                name: "",
                cert_serial_number: "", // 根证书颁发机构id【根证书序列号】
                cert_type: "", // 证书型：signature 签名 encrypt 加密
                common_name: "", // 颁发机构名称【证书中的cn】
                country: "", // 国家/地区
                pucPassword: "",
                key_index: "", // 密钥索引
                key_type: "", // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                location: "", // 城市
                org: "", // 组织
                org_unit: "", // 使用者名称
                organization_id: "1", // 组织机构id
                state: "" // 省份
            },
            formMake: {
                name: "",
                pucPassword: "",
                organizationName: "",
                signer_id: "",
                profile_id: "",
                // cert_type: "", // 证书型：signature 签名 encrypt 加密
                common_name: "", // 颁发机构名称【证书中的cn】
                country: "", // 国家/地区
                key_index: "", // 密钥索引
                key_type: "", // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                location: "", // 城市
                org: "", // 组织
                org_unit: "", // 使用者名称
                organization_id: "1", // 组织机构id
                state: "" // 省份
            },
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
                name: [
                    {
                        required: true,
                        message: "请输入证书名称",
                        trigger: "blur"
                    }
                ],
                signer_id: [
                    {
                        required: true,
                        message: "请选择签名者",
                        trigger: "blur"
                    }
                ],
                profile_id: [
                    {
                        required: true,
                        message: "请选择模板",
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
                key_type: [
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
                appid: [
                    {
                        required: true,
                        message: "请选择所属CA",
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
                //     label: "SHA1WithRSA",
                //     value: "SHA1WithRSA"
                // },
                // {
                //     label: "SHA256WithRSA",
                //     value: "SHA256WithRSA"
                // },
                {
                    label: "SM3WithSM2",
                    value: "SM3WithSM2"
                }
            ],
            signerList: [],
            profileList: [],

            certDefaultProps: {
                children: "children",
                label: "subject"
                // icon-class:"icon"
            },
            defaultProps: {
                children: "children",
                label: "name"
            },
            formDetail: {
                common_name: "",
                location: "",
                country: "",
                org_unit: "",
                state: "",
                org: "",
                id: "",
                pucPassword: ""
            },
            AppList: [],
            systemTypeList: [],
            ischeckList: [],
            isQianMing: false,
            keyUrl: "",
            keyType: "",
            isRSA: "",
            keyType1: "",
            keyType2: "",
            dataType: [],
            initStatus: {},
            aio_step: "",
            isShowAdd: 0
        }
    },
    watch: {
        // aio_step(val) {
        //     console.log("ppp", val);
        //     if (this.aio_step1 == 4) {
        //         this.isShowAdd = 2;
        //     }
        // }
    },
    created() {
        this.keyIndexList = []
        for (var i = 0; i < 20; i++) {
            this.keyIndexList.push({
                label: i + 1,
                value: i + 1
            })
        }
        if (this.aio_step == 3) {
            this.isShowAdd = 2
        }
        this.formMake.organization_id = sessionStorage.getItem("orgId")
        this.form.organization_id = sessionStorage.getItem("orgId")
        this.actionUrl = this.$url.InitImportCert
        this.getInitStatus()
        this.getInitCertList()
        console.log("abs", this.aio_step1, this.aio_step, this.aio_step2)

        // this.getSignerListAll();
        // this.getProfileListAll();
    },
    watch: {
        doubleRadio(val) {
            if (val == "1") {
                this.isEncryption = true
            } else {
                this.isEncryption = false
            }
        },
        aio_step(val) {
            this.getInitCertList()
            if (val == 8) {
                // this.getSignerListAll();
                // this.getProfileListAll();
            }
        }
    },
    methods: {
        // 获取详情

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
        getInitStatus() {
            this.$commonJs
                .getMethodData(this.$url.GetAioStep, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.aio_step = res.data.data

                        if (this.aio_step == 3) {
                            this.isShowAdd == 2

                            $("Import").css({
                                display: "block"
                            })
                            $("ADD").css({
                                display: "none"
                            })
                        }
                        if (this.aio_step == 2) {
                            this.isShowAdd == 1
                            $("ADD").css({
                                display: "block"
                            })
                        }
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        getOrgList() {
            // debugger;
            this.$commonJs
                .getMethodFormData(this.$url.GetOrg, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "res,data.data")
                        this.form.organization_id = res.data.data.id
                        this.getUserList(res.data.data.id)
                        window.sessionStorage.setItem("orgId", res.data.data.id)
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                })
        },
        openPin() {
            this.$refs.PinDialog.modifyFormdialog = true
            this.$refs.PinDialog.modifyForm.PINStr = ""
            this.$refs.PinDialog.title = "根证书私钥访问控制码"
            this.$refs.PinDialog.PIN = "私钥访问控制码"
        },
        PIN(val) {
            if (val != "") {
                let pin = val
                if (val != "false") {
                    this.uploadCert(pin)
                } else {
                    return
                }
            }
        },
        uploadCert(val) {
            // this.loading = true;
            // if (this.formDetail.pucPassword == "") {
            //     this.$message.error("请输入私钥访问控制码!");
            //     return;
            // }
            this.$commonJs
                .downLoadMethodData(this.$url.InitGenCsr, "POST", {
                    id: this.formDetail.id,
                    pucPassword: val
                })
                .then((res) => {
                    // debugger;
                    console.log(res, "res")
                    const link = document.createElement("a")
                    try {
                        if (res.data.size == 0) {
                            this.$message.error("下载失败!")
                            // this.loading = false;
                            return
                        }
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "appcert.csr"
                        link.style.display = "none"
                        const url =
                            window.URL || window.webkitURL || window.moxURL
                        link.href = window.URL.createObjectURL(blob)
                        link.download = _fileName //下载的文件名称
                        link.click()
                        window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                        this.isXiaZai = true
                    } catch (error) {
                        this.$message.error("下载失败!")
                    }
                    this.loading = false
                    // console.log(res, "res");
                })
        },
        getInitCertList() {
            this.$commonJs
                .getMethodData(this.$url.InitCertList, "POST", {
                    organization_id: sessionStorage.getItem("orgId")
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        // org 组织
                        if (res.data.data.length != 0) {
                            // this.getUndefined(
                            //     res.data.attrs.subject.organization_name,
                            //     "organizationName"
                            // );
                            this.formDetail.id = res.data.data.id
                            this.formDetail.key_index = res.data.data.key_index
                            this.formDetail.key_type = res.data.data.key_type
                            this.getUndefined(
                                res.data.attrs.subject.cn,
                                "common_name"
                            )

                            this.getUndefined(res.data.attrs.subject.o, "org")
                            this.getUndefined(
                                res.data.attrs.subject.l,
                                "location"
                            )
                            this.getUndefined(
                                res.data.attrs.subject.c,
                                "country"
                            )
                            // org_unit 使用者名称
                            this.getUndefined(
                                res.data.attrs.subject.ou,
                                "org_unit"
                            )
                            this.getUndefined(
                                res.data.attrs.subject.st,
                                "state"
                            )
                        }
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                })
        },
        getUndefined(data, type) {
            if (data != undefined) {
                if (data != "null") {
                    this.formDetail[type] = data
                }
            } else {
                this.formDetail[type] = ""
            }
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
        handleExceed() {
            this.$message.error("只能上传一个文件!")
        },
        infoorganization() {
            this.radio = ""
            this.dialogVisible = false
            this.certDialogVisible = false
            this.keyDialogVisible = false
            this.doubleKeyDialogVisible = false
        },
        addorganization() {
            if (this.activeName == "add") {
                this.form.organizationName = this.ischeckList[0].name
                this.form.organization_id = this.ischeckList[0].id
            } else {
                this.formMake.organizationName = this.ischeckList[0].name
                this.formMake.organization_id = this.ischeckList[0].id
                this.getSignerListAll()
                this.getProfileListAll()
            }

            this.dialogVisible = false

            console.log(this.ischeckList[0], "this.ischeckList[0]")
            // }
        },
        addKeyIndex() {
            this.keyDialogVisible = false
            this.doubleKeyDialogVisible = false
            if (this.activeName == "add") {
                this.form.key_index = this.keyRadio
            }
            if (this.activeName == "make") {
                this.formMake.key_index = this.keyRadio
            }
            if (this.aio_step == "80") {
                this.formCA.key_index = this.keyRadio
            }
        },
        getDeviceConfGet(type) {
            this.$commonJs
                .getMethodData(this.$url.HSMInitDeviceConfGet, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (type == "sm2") {
                            this.total = res.data.data.sm2_key_count
                        } else {
                            this.total = res.data.data.rsa_key_count
                        }
                        console.log(this.countList, "this.countList")
                    }
                })
        },
        getKeyIndex(type) {
            if (
                this.activeName == "add" &&
                this.form.key_type == "" &&
                type == "add"
            ) {
                return this.$message.error("请选择签名算法!")
            }
            if (
                this.activeName == "make" &&
                this.formMake.key_type == "" &&
                type == "make"
            ) {
                return this.$message.error("请选择签名算法!")
            }
            if (
                this.activeName == "CAadd" &&
                this.formCA.key_type == "" &&
                type == "CAadd"
            ) {
                return this.$message.error("请选择签名算法!")
            }
            // 双证
            if (this.form.is_double == "1") {
                this.doubleKeyDialogVisible = true
            } else {
                this.isQianMing = true
                this.keyDialogVisible = true
                this.keyRadio = ""
                if (this.activeName == "add" && this.form.key_index != "") {
                    this.keyRadio = this.form.key_index
                }
                if (
                    this.activeName == "make" &&
                    this.formMake.key_index != ""
                ) {
                    this.keyRadio = this.formMake.key_index
                }
            }

            if (
                this.form.key_type == "SM3WithSM2" ||
                this.formMake.key_type == "SM3WithSM2" ||
                this.formCA.key_type == "SM3WithSM2"
            ) {
                // SM2
                this.getDeviceConfGet("sm2")
                this.keyUrl = this.$url.HSMInitGetKeyStateByType
                this.keyType = "sm2"
                this.pageSize = 10
            } else {
                // RSA
                this.getDeviceConfGet("rsa")
                this.keyUrl = this.$url.HSMInitGetKeyStateByType
                this.keyType = "rsa"
                this.isRSA = true
                this.pageSize = 5
            }

            console.log(this.form.cert_type, this.form.key_type, "cert_type")

            if (this.form.key_index == "") {
                this.keyRadio = ""
            }
            if (this.formMake.key_index == "") {
                this.keyRadio = ""
            }
            if (this.formCA.key_index == "") {
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
                    pageNum: this.pageNow,
                    type: this.keyType
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
        handleSuccess(file) {
            console.log(file, "file")
            // this.$nextTick(() => {
            //     this.$commonJs.getCloseLoading();
            // });
            if (file.code == 100000) {
                this.$message.success("上传成功!")
                this.showFile = true
                // this.$router.push("/CARootCertList");
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

        submitUpload() {
            console.log(this.fileList, "upload")
            let formData = new FormData()
            //   <!-- 将上传的文件放到数据对象中 -->

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
                        this.$emit("AddUser1", "true")
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
        getOrganizationTree(type) {
            if (this.mode == 2) {
                return false
            }
            console.log(type)
            this.isCertList = type

            this.dialogVisible = true
            this.radio = ""
            if (this.activeName == "add" && this.form.organizationName != "") {
                this.radio = this.form.organization_id
            }
            if (
                this.activeName == "make" &&
                this.formMake.organizationName != ""
            ) {
                this.radio = this.formMake.organization_id
            }
            if (
                this.activeName == "CAadd" &&
                this.formCA.organizationName != ""
            ) {
                this.radio = this.formCA.organization_id
            }
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
        },

        handleClick() {},
        onUpdatess() {
            this.isShowAdd = 2
            this.aio_step == "4"
            this.num++
            // this.$forceupdate();
        },
        onUpdate(formName, type) {
            console.log(this.form, this.formMake, "提交")
            let url
            this.$refs[formName].validate((valid) => {
                console.log("this.,", this.$refs.form.validate)
                if (!valid) return
                // this.$commonJs.getLoading();
                this.DivLoading = true
                let data = {}
                console.log(data, "data")
                // if (this.mode == 1) {
                if (type == "add") {
                    let subject = [
                        "CN=" + this.form.common_name,
                        "C=" + this.form.country,
                        "L=" + this.form.location,
                        "O=" + this.form.org,
                        "OU=" + this.form.org_unit,
                        "ST=" + this.form.state
                    ]

                    data = {
                        name: this.form.name,
                        pucPassword: this.form.pucPassword,
                        organization_id: sessionStorage.getItem("orgId"),
                        key_index: this.form.key_index, // 密钥索引
                        key_type: this.form.key_type, // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                        subject: subject.join(",")
                    }

                    // data = this.$commonJs.getScreenValue(this.form);
                    url = this.$url.InitAddForCsr
                    console.log(subject, subject.join(","), "subject")
                } else if (type == "make") {
                    let subject1 = [
                        "CN=" + this.formMake.common_name,
                        "C=" + this.formMake.country,
                        "L=" + this.formMake.location,
                        "O=" + this.formMake.org,
                        "OU=" + this.formMake.org_unit,
                        "ST=" + this.formMake.state
                    ]

                    data = {
                        pucPassword: this.formMake.pucPassword,
                        name: this.formMake.name,
                        organization_id: sessionStorage.getItem("orgId"),
                        key_index: this.formMake.key_index, // 密钥索引
                        key_type: this.formMake.key_type, // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                        subject: subject1.join(",")
                    }
                    // data = this.$commonJs.getScreenValue(this.formMake);
                    url = this.$url.InitAddCertBySelf
                    console.log(subject1, subject1.join(","), "subject")
                } else if (type == "CAadd") {
                    let subject = [
                        "CN=" + this.formCA.common_name,
                        "C=" + this.formCA.country,
                        "L=" + this.formCA.location,
                        "O=" + this.formCA.org,
                        "OU=" + this.formCA.org_unit,
                        "ST=" + this.formCA.state
                    ]

                    data = {
                        pucPassword: this.formCA.pucPassword,
                        name: this.formCA.name,
                        organization_id: sessionStorage.getItem("orgId"),
                        key_index: this.formCA.key_index, // 密钥索引
                        key_type: this.formCA.key_type, // 密钥类型：sha1_rsa sha256_rsa sm3_sm2
                        subject: subject.join(",")
                    }

                    // data = this.$commonJs.getScreenValue(this.form);
                    url = this.$url.AddCertDevice
                    console.log(subject, subject.join(","), "subject")
                }
                this.$commonJs.getMethodData(url, "POST", data).then((res) => {
                    if (res.data.code == 100000) {
                        if (type == "make" || type == "add") {
                            this.$emit("AddUser1", "true")
                        } else if (type == "CAadd") {
                            this.$emit("AddUser2", "true")
                        }
                        this.getInitStatus()
                        this.DivLoading = false
                        // this.$commonJs.getCloseLoading();
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        // this.$commonJs.getCloseLoading();
                        this.getInitStatus()
                        this.DivLoading = false
                    }
                    console.log(res, "res")
                })
                // }
            })
        },
        // 获取签名者
        getSignerListAll(data) {
            this.getListAll(
                this.$url.InitSignerList,
                {
                    organization_id: this.formMake.organization_id
                },
                "name",
                "id",
                "signerList"
            )
        },
        // getSignerListAll(data) {
        //     this.signerList = [];
        //     this.$commonJs
        //         .getMethodData(this.$url.InitSignerList, "POST", {
        //             organization_id: this.formMake.organization_id
        //         })
        //         .then((res) => {
        //             if (res.data.code == 100000) {
        //                 res.data.data.forEach((element) => {
        //                     this.signerList.push({
        //                         label: element.name,
        //                         value: element.id
        //                     });
        //                 });
        //                 if (this.signerList.length != 0) {
        //                     this.form.signer_id = this.signerList[0].value;
        //                 }
        //                 console.log(this.certList, "this.certList");
        //             } else if (res.data.code != 800000) {
        //                 // this.$message.error(res.data.msg);
        //             }
        //             // this.loading = false;
        //         });
        // },
        // 获取模板
        getProfileListAll(data) {
            this.getListAll(
                this.$url.InitProfileList,
                {
                    // organization_id: this.formMake.organization_id
                },
                "name",
                "id",
                "profileList"
            )
        },
        getListAll(url, data, label, value, type) {
            let list = []
            this.$commonJs.getMethodData(url, "POST", data).then((res) => {
                if (res.data.code == 100000) {
                    res.data.data.forEach((element) => {
                        list.push({
                            label: element[label],
                            value: element[value]
                        })
                    })
                    if (type == "signerList") {
                        this.signerList = list
                        this.formMake.signer_id = ""
                    }

                    if (type == "profileList") {
                        this.profileList = list
                        this.formMake.profile_id = ""
                    }

                    console.log(list, this.signerList, "this.certList")
                } else if (res.data.code != 800000) {
                    // this.$message.error(res.data.msg);
                }
                // this.loading = false;
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
</style>
