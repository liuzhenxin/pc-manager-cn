<template>
    <div class="navItem" v-loading="loading">
        <el-card class="CardClass">
            <div class="boxStyle" style=" margin-top:10px;height:auto">
                <span>(1)请准备好所有管理员USBkey，用来保存备份分量</span><br>
                <span>(2)请登录所有管理员,以满足备份所需权限</span><br>
                <span>(3)将密钥等重要信息加密后备份到文件中，请妥善保管管理员Usbkey和备份文件</span>
            </div>

            <el-row style="margin-top:20px;">
                <el-col :span="12">
                    <div style="margin-top:0px;color:#409EFF;border-left: 3px solid #4f7be2" class="boxStyle">
                        分散管理员数: {{ adminCount }}
                    </div>
                </el-col>
                 <el-col :span="12">
                    <div style="margin-top:0px;color:#409EFF;border-left: 3px solid #4f7be2" class="boxStyle">
                        上次备份时间: {{ copyTime }}
                    </div>
                </el-col>
            </el-row>

            <div v-if="step === 1" style="margin-top: 20px;">
                <el-button type="primary" @click="startBackup" icon="el-icon-upload" plain>
                    开始备份
                </el-button>
            </div>

            <div v-if="step === 2" style="margin-top: 20px;">
                <h3>备份文件已生成并下载。请依次插入管理员USBKey写入备份分量。</h3>
                <p>请插入第 {{ writeCount + 1 }} 个管理员USBKey</p>

                <el-form>
                    <el-form-item label="PIN口令">
                        <el-input type="password" v-model="pinContent" placeholder="请输入PIN口令" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="writeShare" icon="el-icon-key" plain>
                            写入第 {{ writeCount + 1 }} 个备份分量
                        </el-button>
                    </el-form-item>
                </el-form>
                <p>已写入 {{ writeCount }} / {{ adminCount }}</p>
            </div>

            <div v-if="step === 3" style="margin-top: 20px;">
                <h3>所有备份分量已成功写入管理员USBKey。</h3>
                <p>备份完成。</p>
                 <el-button type="primary" @click="reset" plain>
                    再备份一次
                </el-button>
            </div>

        </el-card>
    </div>
</template>

<script>
import axios from "axios";

export default {
    inject: ["reload"],
    data() {
        return {
            loading: false,
            adminCount: 0,
            adminLogin: 0,
            copyTime: "N/A",
            step: 1, // 1: initial, 2: writing shares, 3: done
            pinContent: "",
            writeCount: 0,
        }
    },
    created() {
        this.getLastBackupTime();
        this.getEnumUser();
    },
    methods: {
        reset() {
            this.step = 1;
            this.writeCount = 0;
            this.pinContent = "";
            this.getLastBackupTime();
            this.getEnumUser();
        },
        getEnumUser() {
            this.$commonJs.getMethodData(this.$url.GetEnumUser, "Post", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.adminCount = res.data.data.managerRegister;
                        this.adminLogin = res.data.data.managerLogin;
                    }
                });
        },
        getLastBackupTime() {
            this.$commonJs.getMethodData(this.$url.HsmGetLastBackupTime, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.copyTime = res.data.data;
                    }
                });
        },
        startBackup() {
            if (this.adminLogin !== this.adminCount) {
                this.$message.error('管理员未全部登录，无法备份');
                return;
            }
            if (this.adminCount === 0) {
                this.$message.error('没有管理员，无法备份');
                return;
            }

            this.loading = true;

            const params = new URLSearchParams();
            params.append('num', this.adminCount);

            axios.post(this.$url.SvsBackKey, params, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                const contentDisposition = res.headers['content-disposition'];
                const filename = contentDisposition ? contentDisposition.split('filename=')[1] : 'backup.key';
                const blob = new Blob([res.data], { type: 'application/octet-stream' });

                if (blob.size === 0) {
                    this.$message.error('下载文件为空，备份失败');
                    return;
                }

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(link.href);

                this.$message.success('备份文件下载成功，请开始写入备份分量');
                this.step = 2;
                this.getLastBackupTime();
            })
            .catch((error) => {
                this.$message.error(`备份失败: ${error.message}`);
            })
            .finally(() => {
                this.loading = false;
            });
        },
        writeShare() {
            if (!this.pinContent) {
                this.$message.error("请输入PIN口令");
                return;
            }

            this.loading = true;
            this.$commonJs.getMethodData(this.$url.WriteShare, "POST", { passwd: this.pinContent })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success(`第 ${this.writeCount + 1} 个备份分量写入成功`);
                        this.writeCount++;
                        this.pinContent = "";
                        if (this.writeCount >= this.adminCount) {
                            this.step = 3;
                        }
                    } else {
                        this.$message.error(res.data.msg || "写入失败");
                    }
                })
                .catch((err) => {
                    this.$message.error("写入失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    }
}
</script>

<style lang="less" scoped>
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #e6a23c;
    font-weight: 500;
}
</style>
