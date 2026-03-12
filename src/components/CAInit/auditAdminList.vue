<template>
    <div class="navItem">
        <el-card v-if="isSuccess == true">
            <el-row :gutter="20" style="margin-bottom:10%">
                <el-col :span="12" :offset="6">
                    <div class="fontHeader">审计管理员证书初始化</div>
                </el-col>
                <el-col :span="18" :offset="4">
                    <el-form ref="form" :model="form" label-width="300px">
                        <el-form-item label="证书主题:">
                            <el-input v-model="form.newInet" placeholder="请输入证书主题" style="width:50%"></el-input>
                        </el-form-item>
                        <el-form-item label="密钥算法:">
                            <el-select v-model="form.system_type" placeholder="请选择密钥算法" style="width: 50%" :disabled="isDisable">
                                <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="密钥长度:">
                            <el-select v-model="form.system_type" placeholder="请选择密钥长度" style="width: 50%" :disabled="isDisable">
                                <el-option v-for="item in keyTypeList" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="10%" style="margin-top:20px;margin-left:16.2%;">
                            <el-button style="" type="primary" size="mini" icon="l-icon-plus" @click="onUpdate">初始化审计管理员</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-card v-if="isSuccess == false">
            <el-row :gutter="20" style="margin-bottom:1%;margin-top:1%">
                <el-col style="margin-left: 12px">
                    <el-button style="" type="primary" size="mini" icon="l-icon-plus" @click="onUpdate">上传根证书文件(.cer)</el-button>
                    <!-- <el-upload class="upload-demo" style="display:inline-block" :show-file-list="showFile" :headers="MyHeader" :action="actionUrl" :on-success="handleSuccess" multiple :limit="3" :file-list="fileList">
                        <el-button style="" type="primary" size="mini" icon="l-icon-plus">上传根证书文件(.cer)</el-button>
                    </el-upload> -->
                </el-col>
            </el-row>
        </el-card>
    </div>

</template>
                    
<script>
export default {
    data() {
        return {
            isDisable: false,
            showFile: false,
            isSuccess: false,
            form: {},
            fileList: [],
            actionUrl: "https://jsonplaceholder.typicode.com/posts/",
            MyHeader: { Authorization: "" },
            keyTypeList: [
                {
                    value: "1",
                    label: "SM2"
                },
                {
                    value: "0",
                    label: "RSA"
                },
                {
                    value: "2",
                    label: "对称密钥"
                }
            ]
        };
    },
    created() {
        this.MyHeader.Authorization =
            window.sessionStorage.getItem("Authorization");
    },
    methods: {
        onUpdate() {
            this.isSuccess = !this.isSuccess;
            //  this.$commonJs.getLoading();
        },
        handleSuccess(file) {
            if (file.code == 100000) {
                this.$message.success("上传成功!");
                this.isSuccess = true;
            } else {
                this.$message.error(file.msg);
                this.isSuccess = false;
            }
            //  this.$commonJs.getCloseLoading();
        }
    }
};
</script>
                    
<style lang="less" scoped>
.fontHeader {
    font-size: 30px;
    border-bottom: 1px solid #ccc;
    margin: 20px 0;
    padding-bottom: 20px;
}
</style>