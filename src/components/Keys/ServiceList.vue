<template>
    <div class="navItem" v-loading="loading">
        <el-card>
            <div style="margin-top:20px;" class="boxStyle">本页用于查看/修改服务器密码机配置,重启服务后配署才能生效。</div>
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px;margin-top:50px">
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="服务状态:" label-width="21%">
                            <span style="margin-left:20px;" v-if="isRunning==true"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px;margin-top:5px"></i></span>
                            <span style="margin-left:20px;" v-if="isRunning==false"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px;margin-top:5px"></i></span>
                        </el-form-item>
                        <el-form-item label="序列号:" label-width="21%" prop="DeviceSerial">
                            <el-input class="inputwid" style="width:40%" v-model="form.DeviceSerial" disabled placeholder="请输入序列号"></el-input>
                        </el-form-item>

                        <el-form-item label="服务端口:" label-width="21%" prop="PORT">
                            <el-input class="inputwid" style="width:40%" v-model="form.PORT" placeholder="请输入服务端口(8000~9000)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="会话超时时间:" label-width="21%" prop="TIMEOUT">
                            <el-input class="inputwid" style="width:40%" v-model="form.TIMEOUT" placeholder="请输入会话超时时间(0~65535分钟(0为不限制)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="开机自启:" label-width="21%" prop="name">
                            <el-radio v-model="form.name2" label="1">是</el-radio>
                            <el-radio v-model="form.name2" label="0">否</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="启动口令:" label-width="21%" prop="PASSWORD">
                            <el-input class="inputwid" style="width:40%" type="password" v-model="form.PASSWORD" placeholder="请输入操作员口令"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="最大并发数:" label-width="21%" prop="CONCURRENT">
                            <el-input class="inputwid" style="width:40%" v-model="form.CONCURRENT" placeholder="请输入最大并发数"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-col :offset="2" style="margin-bottom:20px">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="uploadUpgrade">重启服务</el-button>
                        <el-button type="primary" size="mini" icon="el-icon-top" @click="Upgrade" :disabled="isRunning">启动服务</el-button>
                        <el-button type="primary" size="mini" icon="el-icon-video-pause" @click="rollBACK" :disabled="!isRunning">停止服务</el-button>
                        <!-- <el-button size="mini" @click="reload()" type="warning" icon="el-icon-refresh-left">刷新</el-button>
                        <el-button size="mini" type="primary" @click="restart('form')" icon="el-icon-document-add" style="margin-bottom:10px">保存</el-button> -->
                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
    inject: ["reload"],
    data() {
        return {
            form: {
                CONCURRENT: "",
                PASSWORD: "",
                PORT: "",
                TIMEOUT: "",
                DeviceSerial: ""
            },
            oldPort: "",
            rules: {},
            isRunning: "",
            loading: false
        }
    },
    created() {
        this.getInforMation()
    },
    methods: {
        // 刷新
        // reload() {
        //     this.form = {
        //         PORT: "",
        //         TIMEOUT: "",
        //         PASSWORD: "",
        //         CONCURRENT: ""
        //     };
        // },
        // 保存
        getData() {
            let data = {
                maxnum: this.form.CONCURRENT,
                outtime: this.form.TIMEOUT,
                port: this.form.PORT,
                pwd: this.form.PASSWORD,
                oldport: this.oldPort
            }
            return data
        },
        uploadUpgrade() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.ServerRestart, "POST", this.getData())
                .then((res) => {
                    // if (res.data.code == 100000) {
                    //     console.log(res, "res")
                    //     setTimeout(() => {
                    //         this.getInforMation("restart")
                    //     }, 5000)
                    // } else if (res.data.code != 800000) {
                    //     this.$message.error(res.data.msg)
                    //     this.loading = false
                    // }
                })
            setTimeout(() => {
                this.getInforMation("restart")
            }, 10000)
        },
        getStatus(type) {
            this.$commonJs
                .getMethodData(this.$url.IsServerOpen, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.isRunning = res.data.data
                        if (type == "qidong") {
                            this.$message.success("启动服务成功.")
                        }
                        if (type == "restart") {
                            this.$message.success("重启服务成功.")
                        }
                    } else if (res.data.code != 800000) {
                        this.isRunning = false
                        // this.$message.error(res.data.msg);
                    }
                    this.loading = false
                })
            this.$commonJs
                .getMethodData(this.$url.GetDeviceInfo, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.form.DeviceSerial = res.data.data
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                })
        },
        getInforMation(type) {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.ServerGetinfo, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.oldPort = res.data.data.PORT
                        this.form = res.data.data
                        this.getStatus(type)
                    } else if (res.data.code != 800000) {
                        // this.isRunning = false;
                        // this.$message.error(res.data.msg);
                        this.loading = false
                    }
                })
        },
        Upgrade() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.ServerStart, "POST", this.getData())
                .then((res) => {
                    // if (res.data.code == 100000) {
                    //     setTimeout(() => {
                    //         this.getInforMation("qidong")
                    //     }, 5000)
                    // } else if (res.data.code != 800000) {
                    //     this.$message.error(res.data.msg)
                    //     this.loading = false
                    // }
                })
            setTimeout(() => {
                this.getInforMation("qidong")
            }, 6000)
        },
        rollBACK() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.ServerStop, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.getInforMation()
                        this.$message.success("停止服务成功.")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
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
</style>