<template>
    <div class="navItem" v-loading="loading">
        <el-card>
            <div class="boxStyle" style=" margin-top:10px;height:auto">
                <span>(1)请登录半数以上管理员,以满足恢复所需权限</span><br>
                <span>(2)密钥恢复过程会破坏密码设备内当前的密钥数据。请谨慎操作.</span>
            </div>
            <keyLogo @keyNum="keyNum"></keyLogo>

            <div class="fontStyle" style="margin-bottom:20px;margin-top:20px;"> </div>
            <div class="fontStyle" style="padding-bottom:0px;border:0" v-if="isLogin== true && isNext == 1">
                <el-upload class="upload-demo" :action="$url.FilesImport" :show-file-list="showFile" :headers="MyHeader" :on-exceed="handleExceed" multiple :limit="1" :on-success="handleSuccess" :file-list="fileList">

                    <el-button style="" type="primary" size="mini" icon="el-icon-upload" plain>上传备份文件</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
                <!-- <el-button style="" type="primary" @click="addCopyFiles()" size="mini" icon="el-icon-upload">上传备份文件</el-button> -->
            </div>
            <div style="margin-top:20px;padding-left: 42px;margin-bottom:20px;">
                <div v-if="isLogin== false" class="fontStyle" style="border:0">
                    {{meetPermissions}}
                    <el-button style="margin-left:10px;font-size:20px" type="text" @click="getRecoveryLogin()" icon="el-icon-right" size="mini">去登录</el-button>
                    <!-- <span class="titleLabel" style="width:75px">UKey索引:</span>
                    <el-input style="width:40%;margin-left:10px" v-model="uKeyIndex" type="text" placeholder="请输入UKey索引" class="searchInputClass">
                    </el-input>
                    <br> -->
                    <!-- <span class="titleLabel" style="width:75px">登录UKey:</span>
                    <el-input style="width:40%;margin-left:10px" v-model="pinContent1" :type="flag1 ? 'password' : 'text'" placeholder="请输入PIN口令" class="searchInputClass"> -->
                    <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1"></i> -->
                    <!-- </el-input>
                    <el-button style="margin-left:10px" type="primary" @click="getLogin()" icon="el-icon-check" size="mini" plain>登录</el-button> -->
                </div>
                <div v-if="isNext == 2">
                    <span class="titleLabel" style="width:75px">{{adminNum}}号管理员:</span>
                    <el-input style="width:20%;margin-left:10px" v-model="pinContent" :type="flag1 ? 'password' : 'text'" placeholder="请输入PIN口令" class="searchInputClass">
                    </el-input>
                    <el-button style="margin-left:10px" type="primary" @click="getLogin()" icon="el-icon-check" size="mini" plain>登录</el-button>
                </div>
                <div v-if="isNext == 3">
                    <el-button style="margin-left:10px" type="primary" @click="addCopyKey()" icon="el-icon-check" size="mini" plain>恢复密钥文件</el-button>
                </div>
            </div>

        </el-card>
    </div>
</template>
<script>
import keyLogo from "../Keys/keyLogo.vue";
export default {
    inject: ["reload"],
    components: {
        keyLogo
    },

    data() {
        return {
            loading: false,
            showFile: false,
            isUpload: true,
            MyHeader: { Authorization: "" },
            uKeyIndex: "1",
            isLogin: true,
            pinContent1: "",
            pinContent: "",
            flag1: true,
            fileList: [],
            meetPermissions: "",
            addminKeyNum: 0,
            isNext: 1,
            adminNum: 1
        };
    },
    created() {
        this.MyHeader.Authorization =
            window.sessionStorage.getItem("Authorization");
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 1000);
    },
    mounted() {
        // this.getStatus();
    },
    methods: {
        getLogin() {
            if (this.pinContent == "") {
                this.$message.error("请输入PIN口令");
                return false;
            }
            this.$commonJs
                .getMethodData(this.$url.GetShare, "POST", {
                    // pucPasswordStr - 用户口令, 固定 16 字节
                    pwd: this.pinContent,
                    // uiUserIndex - 用户索引
                    indexNum: this.adminNum
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.adminNum = res.data.data + 1;
                        this.$message.success(res.data.msg);
                        this.pinContent = "";

                        if (res.data.data == 2) {
                            this.isNext = 3;
                        }
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    } else {
                    }
                });
        },
        addCopyKey() {
            // if (this.pinContent == "") {
            //     this.$message.error("请输入PIN口令");
            //     return false;
            // }
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.RestoryKey, "POST", {
                    // keyImageStr - 密钥空间
                    // keyImageStr: "",
                    // pinStr *备份密钥口令
                    // pinStr: this.pinContent
                    indexNum: 2
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$alert("恢复密钥成功.", "提示", {
                            confirmButtonText: "确定",
                            type: "success"
                        }).then(() => {
                            this.reload();
                        });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    // this.showFile = false;
                    this.loading = false;
                });
        },
        handleSuccess(file) {
            console.log(file, "file");
            if (file.code == 100000) {
                this.showFile = true;
                // this.isUpload = false;
                // this.addCopyKey();
                this.isNext = 2;
                this.$message.success("上传成功!");
            } else {
                this.$nextTick(() => {
                    // this.showFile = false;
                    // this.isUpload = true;
                });
                this.fileList = [];
                this.$message.error(file.msg);
            }
        },
        getRecoveryLogin() {
            this.$router.push({
                name: "userLoginList",
                query: {
                    type: 2
                }
            });
        },
        keyNum(data) {
            console.log(data, "keyNum");
            this.addminKeyNum = data;
            // this.getStatus();
        },
        async getStatus() {
            let that = this;
            await this.$commonJs
                .getMethodData(this.$url.HsmGetUserinfo, "POST", {
                    num: this.addminKeyNum
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        that.isLogin = res.data.data;
                        this.loading = false;
                    } else if (res.data.code != 800000) {
                        if (res.data.data == false) {
                            that.meetPermissions =
                                "未满足恢复密钥权限，请先登录";
                            console.log(
                                that.meetPermissions,
                                "this.meetPermissions"
                            );
                        }
                        that.$message.error(res.data.msg);
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                });
        },
        addCopyFiles() {
            // this.$alert("上传备份文件成功.", "提示", {
            //     confirmButtonText: "确定",
            //     type: "success"
            // }).then((res) => {
            //     this.$alert("导入密钥分量[1]成功.请继续导入分量[2].", "提示", {
            //         confirmButtonText: "确定",
            //         type: "warning"
            //     });
            // });
        },
        handleExceed() {
            this.$message.error("只能上传一个文件!");
        }
    }
};
</script>
<style lang="less" scoped>
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    // background: #f4f5f7;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #e6a23c;
    font-weight: 500;
}
.fontStyle {
    padding-left: 42px;
    font-size: 20px;
    font-weight: 600;
    margin-top: 20px;
    // font-size: 14px;
    width: 100%;
    line-height: 30px;
    // height: 32px;
    // padding-bottom: 10px;
    border-bottom: 1px solid #e5e5f5;
    margin-bottom: 10px;
}
</style>