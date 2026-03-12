<template>
    <div class="navDetailItem" v-loading="loading">
        <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:30px">
            <el-tab-pane label="Ping">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form ref="form" :model="formPing" label-width="180px">
                            <el-form-item label="目标IP地址">
                                <el-input v-model="formPing.host" placeholder="输入目标IP地址" style="width:60%"></el-input>
                            </el-form-item>
                            <el-form-item label="测试网卡">
                                <el-select v-model="formPing.nicName" placeholder="请选择网卡">
                                    <el-option :label="item.name" :value="item.name" v-for="(item,index) in nicList" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="onSubmit('Ping')">执行Ping测试</el-button>
                                <el-button @click="formReset('Ping')" size="mini">重置</el-button>
                            </el-form-item>
                            <el-form-item label="Ping执行结果">
                                <el-input class="LoadingBorder" rows="20" placeholder="执行结果展示" type="textarea" v-model="formPingRes" v-loading="PingLoading"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="Telnet">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form ref="form" :model="formTelnet" label-width="180px">
                            <el-form-item label="目标IP地址">
                                <el-input v-model="formTelnet.host" placeholder="输入目标IP地址" style="width:60%"></el-input>
                            </el-form-item>
                            <el-form-item label="目标端口号">
                                <el-input v-model="formTelnet.port" placeholder="输入目标服务端口号" style="width:200px"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="onSubmit('Telnet')">执行Telnet测试</el-button>
                                <el-button @click="formReset('Telnet')" size="mini">重置</el-button>
                            </el-form-item>
                            <el-form-item label="Telnet执行结果">
                                <el-input class="LoadingBorder" rows="20" placeholder="执行结果展示" type="textarea" v-model="formTelnetRes" v-loading="TelnetLoading"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="SSH" v-loading="sshLoading">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form ref="form" label-width="180px">
                            <el-form-item label="SSH服务状态">
                                <el-button type="success" icon="el-icon-check" circle v-if="sshStatus"></el-button>
                                <el-button type="danger" icon="el-icon-close" circle v-else></el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="startSsh" :disabled="sshStatus">启动SSH服务</el-button>
                                <el-button size="mini" @click="stopSsh" :disabled="!sshStatus">停止SSH服务</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-tab-pane>


        </el-tabs>
    </div>
</template>
<script>
export default {
    data() {
        return {
            formPing: {
                host: "",
                nicName: ""
            },
            nicList: ["eth0"],
            formPingRes: "",
            formTelnet: {
                host: "",
                port: ""
            },
            TelnetLoading: false,
            TraceRouteLoading: false,
            PingLoading: false,
            formTelnetRes: "",

            formTraceRoute: {
                host: "",
                nic: ""
            },
            formTraceRouteRes: "",
            loading: false,
            sshStatus: false,
            sshLoading: false
        }
    },
    created() {
        this.getNicList()
    },
    methods: {
        getSshStatus() {
            this.sshLoading = true
            this.$commonJs
                .getMethodData(this.$url.SysGetSshStatus, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.sshStatus = res.data.data
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.sshLoading = false
                })
        },
        startSsh() {
            this.sshLoading = true
            this.$commonJs
                .getMethodData(this.$url.SysStartSsh, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("SSH服务启动成功")
                        this.getSshStatus()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.sshLoading = false
                })
        },
        stopSsh() {
            this.sshLoading = true
            this.$commonJs
                .getMethodData(this.$url.SysStopSsh, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("SSH服务停止成功")
                        this.getSshStatus()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.sshLoading = false
                })
        },
        getNicList() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.ShowNic, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.nicList = res.data.data
                        if (res.data.data.length != 0) {
                            this.nicList.unshift("")
                        }
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
        },
        onSubmit(type) {
            if (type == "Ping") {
                this.PingLoading = true
                this.$commonJs
                    .getMethodData(
                        this.$url.DiagnoseByPing,
                        "POST",
                        this.formPing
                    )
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.formPingRes = res.data.data
                            if (res.data.data == "") {
                                this.formPingRes = "\xa0"
                            }
                            console.log(res, "formPing")
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                        this.PingLoading = false
                    })
            }
            if (type == "Telnet") {
                this.TelnetLoading = true
                this.$commonJs
                    .getMethodData(
                        this.$url.DiagnoseByTelnet,
                        "POST",
                        this.formTelnet
                    )
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.formTelnetRes = res.data.data
                            console.log(res.data.data, "formTelnet")
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                        this.TelnetLoading = false
                    })
            }
            if (type == "TraceRoute") {
                this.TraceRouteLoading = true
                this.$commonJs
                    .getMethodData(
                        this.$url.DiagnoseByTraceroute,
                        "POST",
                        this.formTraceRoute
                    )
                    .then((res) => {
                        if (res.data.code == 100000) {
                            this.formTraceRouteRes = res.data.data
                            if (res.data.data == "") {
                                this.formTraceRouteRes = "\xa0"
                            }
                            console.log(res, "formTraceRoute")
                        } else if (res.data.code != 800000) {
                            this.$message.error(res.data.msg)
                        }
                        this.TraceRouteLoading = false
                    })
            }

            // this.$commonJs.getCloseLoading();
            // console.log("submit!");
        },
        formReset(type) {
            if (type == "Ping") {
                this.formPing = {}
                this.formPingRes = ""
            }
            if (type == "Telnet") {
                this.formTelnet = {}
                this.formTelnetRes = ""
            }
            if (type == "TraceRoute") {
                this.formTraceRoute = {}
                this.formTraceRouteRes = ""
            }
        },
        handleClick(tab, event) {
            console.log(tab, event)
            if (tab.label == "Ping") {
                this.formReset("Ping")
            }
            if (tab.label == "Telnet") {
                this.formReset("Telnet")
            }
            if (tab.label == "TraceRoute") {
                this.formReset("TraceRoute")
            }
            if (tab.label == "SSH") {
                this.getSshStatus()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.box-card {
    height: 50px;
    line-height: 50px;
}
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}
/deep/ .LoadingBorder .el-loading-mask {
    border: 1px solid #dcdfe6;
}
</style>
