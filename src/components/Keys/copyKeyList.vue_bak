<template>
    <div class="navItem" v-loading="loading">
        <el-card class="CardClass">
            <div class="boxStyle" style=" margin-top:10px;height:auto">
                <span>(1)请准备好所有管理员USBkey，用来保存备份分量</span><br>
                <span>(2)请登录所有管理员,以满足备份所需权限</span><br>
                <span>(3)将密钥等重要信息加密后备份到文件中，请妥善保管管理员Usbkey和备份文件</span>
            </div>
            <!-- <keyLogo @keyNum="keyNum"></keyLogo> -->
            <el-row style="margin-top:20px;">
                <el-col :span="12">
                    <div style="margin-top:0px;color:#409EFF;border-left: 3px solid #4f7be2" class="boxStyle">分散管理员数: {{writeCount}}</div>
                </el-col>
            </el-row>
            <div class="fontStyle" style="margin-bottom:20px">
                <!-- 请根据提示将{{adminStatesRegisterNum}}个管理员USBKey依次插入密码设备或管理终端USB插槽中。 -->
            </div>
            <span style="margin-left:3%;font-size:16px;font-weight:600">上次备份时间:<span style="margin-left:10px"> {{copyTime}}</span></span><br>
            <div class="fontStyle" style="padding-bottom:0px;border:0" v-if="isLogin== true && isNext == 1">
                <el-button style="margin-left:0px;border:0" type="" size="mini">管理员数：</el-button>
                <el-select v-model="adminCount" placeholder="管理员数目" style="width:5%">
                    <el-option :label="adminCount" :value="adminCount"></el-option>
                </el-select>
                <el-button style="margin-left:10px" type="primary" @click="addCopyKey()" size="mini" icon="el-icon-upload" plain>开始备份</el-button>
                <el-button :disabled=!backUpOrNot style="margin-left:10px" type="primary" @click="writeSharePush()" size="mini" icon="el-icon-key" plain>分散密钥</el-button>
            </div>

            <el-dialog title="分散密钥" :visible.sync="writeSharePushDialog" width="30%">
                <div style="margin-top:20px;padding-left:20%">
                    <span class="titleLabel" style="width:75px">PIN口令:</span>
                    <el-input style="width:60%;margin-left:10px" type="password" v-model="pinContent" placeholder="请输入PIN口令" class="searchInputClass">
                        <!-- <i slot="suffix" :class="[flag1 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag1 = !flag1" ></i> -->
                    </el-input>
                    <!-- <el-button style="margin-left:10px" type="primary" @click="addAdmin()" size="mini"><i class="el-icon-plus iconRight"></i>添加管理员</el-button> -->
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="writeSharePushDialog = false" size="mini">取消</el-button>
                    <!-- <el-button type="success" @click="initFactory('否')" size="medium">否</el-button> -->
                    <el-button type="primary" @click="writeShare()" size="mini">确定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import axios from "axios";
import keyLogo from "./keyLogo.vue"
// import $ from "jquery";
export default {
    inject: ["reload"],
    components: {
        keyLogo
    },
    props: {
        initNum: {
            type: Number
        }
    },
    data() {
        return {
            EnumUserList:{},
            isLogin: true,
            pinContent: "",
            meetPermissions: "",
            loading: false,
            addminKeyNum: 0,
            isNext: 1,
            adminNum: 1,
            adminCount: "",
            adminLogin: "",
            backUpOrNot: false,
            writeCount: 0,
            copyTime: "2022.03.27 12:23",
            writeSharePushDialog: false
        }
    },
    created() {
        this.getTime()
        this.getEnumUser()
    },
    mounted() {
        if (this.initNum == 1) {
            this.$(".CardClass").addClass("boxShadowNone")
        }
    },
    methods: {
        //获取已登录的管理员数
        getEnumUser() {
            this.$commonJs.
                getMethodData(this.$url.GetEnumUser,"Post",{})
                .then((res)=>{
                    if (res.data.code == 100000) {
                        this.adminCount = res.data.data.managerRegister;
                        this.adminLogin = res.data.data.managerLogin;
                        console.log("管理员总数"+this.adminCount+"\n登录管理员数"+this.adminLogin)
                    } 
                })
        },
        getTime() {
            this.$commonJs
                .getMethodData(this.$url.HsmGetLastBackupTime, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.copyTime = res.data.data
                    } else if (res.data.code != 800000) {
                        // this.copyTime = " ";
                        // this.$message.error(res.data.msg);
                    }
                })
        },
        keyNum(data) {
            console.log(data, "keyNum")
            this.addminKeyNum = data
            // this.getStatus();
        },
        async getStatus() {
            let that = this
            await this.$commonJs
                .getMethodData(this.$url.HsmGetUserinfo, "POST", {
                    num: -1
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        that.isLogin = res.data.data
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        if (res.data.data == false) {
                            that.meetPermissions =
                                "未满足恢复密钥权限，请先登录"
                            this.loading = false
                        }
                        that.$message.error(res.data.msg)
                    }
                })
        },
        addCopyKey() {
            if (this.adminLogin !== this.adminCount) {
                this.$message.error('管理员未全部登录，无法备份');
                return;
            }
            this.loading = true;
    
            // 创建请求参数
            const params = new URLSearchParams();
            params.append('num', this.adminCount);

            // 发送请求
            axios.post(this.$url.SvsBackKey, params, {
            responseType: 'blob',  // 确保设置为 blob 类型
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                this.loading = false;
        
                // 获取文件名
                const contentDisposition = res.headers['content-disposition'];
                const filename = contentDisposition.split('filename=')[1];
        
                // 创建 Blob 对象
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
        
                // 创建下载链接
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(link.href);
                this.$message.success('备份成功');
                this.backUpOrNot=true;
            })
            .catch((error) => {
                this.loading = false;
                this.$message.error(`请求失败: ${error.message}`);
            })
            .finally(() => {
                this.loading = false;
            });
            // this.$commonJs
            //     .getMethodData(this.$url.SvsBackKey, "POST", {
            //         num: this.adminCount
            //     },{
            //     })
            //     .then((res) => {
            //         this.loading = false
            //       //console.log(res);
            //       console.log(res.data.code);
            //       console.log(res.data.code != 900000);
            //
            //
            //         if (res.data.code != 900000) {
            //             const link = document.createElement("a")
            //             try {
            //                  let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
            //                 //let blob = new Blob([res.data])
            //
            //                 let _fileName = "keyImage.dyd"
            //                 link.style.display = "none"
            //                 const url =
            //                     window.URL || window.webkitURL || window.moxURL
            //                 link.href = window.URL.createObjectURL(blob)
            //                 link.download = _fileName //下载的文件名称
            //                 link.click()
            //                 window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
            //                 this.isXiaZai = true
            //                 this.backUpOrNot = true
            //                 this.writeCount = 0
            //             } catch (e) {
            //               console.log(e);
            //                 this.$message.error("下载失败!")
            //             }
            //
            //
            //         } else {
            //             this.$message.error(res.data.msg)
            //         }
            //     })
            //     .catch((err) => {})
        },
        writeSharePush() {
            if (this.writeCount == this.adminCount) {
                this.$message.success("已完成分散密钥，无需再次添加！")
            } else {
                this.writeSharePushDialog = true
            }
        },
        //往ukey写入拉格朗日数据
        writeShare() {
            if (this.pinContent == "") {
                this.$message.error("请输入PIN口令")
                return false
            } else {
                this.writeSharePushDialog = false
                this.loading = true
                this.$commonJs
                    .getMethodData(this.$url.WriteShare, "POST", {
                        passwd: this.pinContent
                    })
                    .then((res) => {
                        this.loading = false
                        if (res.data.code == 100000) {
                            this.$message.success("写入成功.")
                            this.loading = false
                            this.writeCount++
                            this.writeSharePushDialog = false
                            this.pinContent = ""
                        } else if (res.data.code != 800000) {
                            that.$message.error(res.data.msg)
                        }
                    })
                    .catch((err) => {
                        this.$message.error("写入失败.")
                    })
            }
        }
    }
}
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
    margin-top: 10px;
    // font-size: 14px;
    width: 100%;
    line-height: 30px;
    // height: 32px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5f5;
    margin-bottom: 10px;
}
</style>
