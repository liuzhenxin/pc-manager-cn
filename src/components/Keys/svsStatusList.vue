<template>
    <!-- <div class="navItem" v-loading="loading">
        <el-card>
            <div style="margin-top:20px;" class="boxStyle">本页用于查看/修改签名验签服务器配置,重启服务后配署才能生效。</div>
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px;margin-top:50px">
                <el-row :gutter="20">
                    <el-col :offset="2">
                        <el-form-item label="密码模块:" label-width="21%">
                            <span style="margin-left:20px;" v-if="isRunningCard==true"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px;margin-top:5px"></i></span>
                            <span style="margin-left:20px;" v-if="isRunningCard==false"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px;margin-top:5px"></i></span>
                        </el-form-item>
                        <el-form-item label="服务状态:" label-width="21%">
                            <span style="margin-left:20px;" v-if="isRunning==true"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px;margin-top:5px"></i></span>
                            <span style="margin-left:20px;" v-if="isRunning==false"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px;margin-top:5px"></i></span>
                        </el-form-item>
                        <el-form-item label="序列号:" label-width="21%" prop="DeviceSerial">
                            <el-input class="inputwid" style="width:40%" v-model="form.DeviceSerial" disabled placeholder="请输入序列号"></el-input>
                        </el-form-item>
                        <el-form-item label="服务端口:" label-width="21%" prop="port">
                            <el-input class="inputwid" style="width:40%" v-model="form.port" placeholder="请输入服务端口(8000~9000)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="5">
                        <div style="margin-bottom:30px;margin-top:30px;margin-left:60px">
                            <el-button type="primary" size="mini" icon="el-icon-refresh" @click="uploadUpgrade">重启服务</el-button>
                            <el-button type="primary" size="mini" icon="el-icon-top" :disabled="isRunning" @click="Upgrade">启动服务</el-button>
                            <el-button type="primary" size="mini" icon="el-icon-video-pause" :disabled="!isRunning" @click="rollBACK">停止服务</el-button>

                        </div>


                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div> -->
    <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:30px" v-model="activeName">
        <el-tab-pane label="配置与状态" name="1">
            <el-row :gutter="20">
                <el-col :span="16" style="width:100%">
                    <div style="margin-top:-5px">
                        <el-backtop></el-backtop>
                        <el-row>
                            <el-col>
                                <el-card style="border-radius:15px">
                                    <!-- <span class="allView">首页</span> -->
                                    <el-row class="cardRow" style="">
                                        <!-- <el-col :span="7"> -->
                                        <el-col>
                                            <el-card class="cardStyle1">
                                                <!-- <span style="font-size:18px;font-weight:bold;margin-bottom:17px;margin-top:20px;display:inline-block">服务器</span>
                                <br> -->
                                                <span style="font-size:12px;"></span>
                                                <el-row style="margin-left:5.5%">
                                                    <el-col :span="4" class="leftTitle">密码模块</el-col>
                                                    <el-col :span="7">
                                                        <i class="el-icon-circle-check" v-if="isRunningCard==true" style="color:#67C23A;font-size:20px;margin-right:10px"></i>
                                                        <i class="el-icon-circle-close" v-if="isRunningCard==false" style="color:#F56C6C;font-size:20px;margin-right:10px"></i>
                                                    </el-col>
                                                    <el-col :span="4" class="leftTitle">服务状态</el-col>
                                                    <el-col :span="7">
                                                        <i class="el-icon-circle-check" v-if="isRunning==true" style="color:#67C23A;font-size:20px;margin-right:10px"></i>
                                                        <i class="el-icon-circle-close" v-if="isRunning==false" style="color:#F56C6C;font-size:20px;margin-right:10px"></i>
                                                    </el-col>
                                                    <el-col :span="4" class="leftTitle">序列号</el-col>
                                                    <!-- <el-col :span="7">
                                        <el-input class="inputwid" style="width:20%" v-model="form.DeviceSerial" disabled placeholder="请输入序列号"></el-input>
                                    </el-col> -->
                                                    <el-col :span="7">{{form.DeviceSerial}}</el-col>

                                                    <el-col :span="4" class="leftTitle">版本号</el-col>
                                                    <el-col :span="7">
                                                        <el-col :span="7">{{form.version}}</el-col>
                                                    </el-col>
                                                    <el-col :span="4" class="leftTitle">TCP端口号</el-col>
                                                    <el-col :span="7">
                                                        <el-input class="inputwid" style="width:50%;margin-right:10px" v-model="form.tcpPort" placeholder="请输入服务端口(8000~9000)"></el-input>
                                                        <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="!isRunning" @click="editPort('1')">修改</el-button>
                                                    </el-col>

                                                    <el-col :span="4" class="leftTitle">HTTP端口号</el-col>
                                                    <el-col :span="7">
                                                        <el-input class="inputwid" style="width:50%;margin-right:10px" v-model="form.httpPort" placeholder="请输入服务端口(8000~9000)"></el-input>
                                                        <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="!isRunning" @click="editPort('2')">修改</el-button>
                                                    </el-col>


                                                    <!-- <el-col :span="2" class="leftTitle"></el-col> -->
                                                    <el-col :span="12">
                                                        <div style="margin-bottom:30px;margin-top:30px;margin-left:20%">
                                                            <el-button type="primary" size="mini" icon="el-icon-refresh" @click="uploadUpgrade('1')">重启服务</el-button>
                                                            <!-- <el-button type="primary" size="mini" icon="el-icon-top" :disabled="isRunning" @click="Upgrade">启动服务</el-button> -->
                                                            <el-button type="primary" size="mini" icon="el-icon-video-pause" :disabled="!isRunning" @click="rollBACK(1)">停止服务</el-button>
                                                        </div>
                                                    </el-col>

                                                    <!-- <el-col :span="2" class="leftTitle"></el-col> -->
                                                    <el-col :span="12">
                                                        <div style="margin-bottom:30px;margin-top:30px;margin-left:20%">
                                                            <el-button type="primary" size="mini" icon="el-icon-refresh" @click="uploadUpgrade('2')">重启服务</el-button>
                                                            <!-- <el-button type="primary" size="mini" icon="el-icon-top" :disabled="isRunning" @click="UpgradeHttp">启动服务</el-button> -->
                                                            <el-button type="primary" size="mini" icon="el-icon-video-pause" :disabled="!isRunning" @click="rollBACK(2)">停止服务</el-button>
                                                        </div>
                                                    </el-col>
                                                </el-row>
                                            </el-card>
                                        </el-col>
                                    </el-row>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="负载同步" name="2">
            <el-row :gutter="20">
                <el-col :span="16" style="width:100%">
                    <div style="margin-top:-5px">
                        <el-row>
                            <el-col>
                                <el-card style="border-radius:15px">
                                    <el-row class="cardRow" style="">
                                        <el-col>
                                            <el-card class="cardStyle1">
                                                <el-row style="margin-left:5.5%">
                                                    <el-col :span="4" class="leftTitle">源组织机构编码：</el-col>
                                                    <el-col :span="7">
                                                        <el-input class="inputwid" style="width:80%;margin-right:10px" v-model="form.source_organization_code" placeholder="请输入源组织机构编码"></el-input>
                                                    </el-col>
                                                    <el-col :span="4" class="leftTitle">服务器IP地址：</el-col>
                                                    <el-col :span="7">
                                                        <el-input class="inputwid" style="width:80%;margin-right:10px" v-model="form.ipStr" placeholder="请输入服务IP"></el-input>
                                                    </el-col>
                                                </el-row>
                                                <div style="text-align:center">
                                                    <el-button type="primary" style="width:10%" @click="synchronization()">同步</el-button>
                                                </div>
                                            </el-card>
                                        </el-col>
                                    </el-row>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
export default {
    data() {
        return {
            isRunning: true,
            isRunningCard: true,
            form: {
                tcpPort: "",
                httpPort: "",
                DeviceSerial: "",
                version: "",
                ipStr: "",
                source_organization_code: ""
            },
            rules: {},
            loading: false,
            activeName: "1" //1 配置与状态 2 负载同步
        }
    },
    created() {
        this.getResourceDetail("7")
        this.getStatus()
        this.addAdminList()
    },
    methods: {
        // 获取详情
        getResourceDetail(code) {
            this.loading = true
            let url = this.$url.ResourceGetByCode
            this.$commonJs
                .getMethodData(url, "POST", {
                    page: "GetStatistics",
                    code: code
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.form.version = res.data.data.content
                    }
                    this.loading = false
                })
        },
        addAdminList() {
            this.loading = true
            let url = this.$url.GetEnumUser
            this.$commonJs.getMethodData(url, "POST", {}).then((res) => {
                if (res.data.code == 100000) {
                    if (
                        res.data.data.managerLogin == 0 &&
                        res.data.data.operatorLogin == 0
                    ) {
                        this.isRunningCard = false
                    } else {
                        this.isRunningCard = true
                    }

                    this.loading = false
                } else if (res.data.code != 800000) {
                    this.$message.error(res.data.msg)
                    this.loading = false
                }
            })
        },
        getStatus() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.IsOpen, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.isRunning = res.data.data
                    } else if (res.data.code != 800000) {
                        this.isRunning = false
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })

            this.getData()
        },
        getData() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.GetByCode, "POST", {
                    code: "svs.server.port"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.form.tcpPort = res.data.data.val
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    // this.loading = false;
                })
            this.$commonJs
                .getMethodData(this.$url.GetByCode, "POST", {
                    code: "svs.server.http.port"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.form.httpPort = res.data.data.val
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    // this.loading = false;
                })
            this.$commonJs
                .getMethodData(this.$url.GetDeviceInfo, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (res.data.data == "") {
                            this.form.DeviceSerial = "暂未查到"
                        } else {
                            this.form.DeviceSerial = res.data.data
                        }
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                    this.loading = false
                })
        },
        uploadUpgrade(type) {
            this.$confirm("是否确认重启?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.loading = true
                    let url
                    let servername
                    let port
                    if (type == "1") {
                        url = this.$url.GetRestart
                        servername = ""
                        port = this.form.tcpPort
                    } else {
                        url = this.$url.GetRestartHttp
                        servername = "dysx-aio-modules-svs-22.12.12.jar"
                        port = this.form.httpPort
                    }
                    this.$commonJs
                        .getMethodData(url, "POST", {
                            servername: servername
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res")
                                this.$alert("重启服务成功.", "信息", {
                                    confirmButtonText: "确定",
                                    type: "success"
                                }).then(() => {
                                    this.openPort(port)
                                    this.getStatus()
                                })
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            this.loading = false
                        })
                })
                .catch((err) => err)
        },

        // Upgrade() {
        //     this.loading = true
        //     this.$commonJs
        //         .getMethodData(this.$url.SvsStart, "POST", this.form)
        //         .then((res) => {
        //             if (res.data.code == 100000) {
        //                 console.log(res, "res")
        //                 this.$alert("启动服务成功.", "信息", {
        //                     confirmButtonText: "确定",
        //                     type: "success"
        //                 }).then(() => {
        //                     this.getStatus()
        //                 })
        //                 // this.getStatus();
        //             } else if (res.data.code != 800000) {
        //                 this.$message.error(res.data.msg)
        //             }
        //             this.loading = false
        //         })
        // },
        rollBACK(type) {
            this.$confirm("是否停止服务?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.loading = true
                    let url
                    let port
                    if (type == "1") {
                        url = this.$url.SvsStop
                        port = this.form.tcpPort
                    } else {
                        url = this.$url.ClosePort
                        port = this.form.httpPort
                    }
                    this.$commonJs
                        .getMethodData(url, "POST", { port: port })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                console.log(res, "res")

                                this.$alert("停止服务成功.", "信息", {
                                    confirmButtonText: "确定",
                                    type: "success"
                                }).then(() => {
                                    this.getStatus()
                                })
                                // this.getStatus();
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                            this.loading = false
                        })
                })
                .catch((err) => err)
        },
        editPort(type) {
            this.$confirm("是否确认修改?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.editPortAction(type, (result) => {
                        if (result == "1") {
                            this.$message.success("修改成功")
                        } else {
                            this.$message.error("修改失败")
                        }
                    })
                })
                .catch((err) => err)
        },
        editPortAction(type, callback) {
            let url
            let port
            if (type == "1") {
                url = this.$url.UpdPortTCP
                port = this.form.tcpPort
            } else {
                url = this.$url.UpdPortHTTP
                port = this.form.httpPort
            }
            if (port > 65535 || port <= 0) {
                this.$message.error("端口号不合法")
                return
            }
            this.$commonJs
                .getMethodData(this.$url.CheckPortHTTP, "POST", { port: port })
                .then((res) => {
                    if (res.data.data) {
                        this.$message.error("端口已被占用")
                    } else {
                        this.$commonJs
                            .getMethodData(url, "POST", { port: port })
                            .then((res) => {
                                if (res.data.code == 100000) {
                                    callback("1")
                                } else if (res.data.code != 800000) {
                                    this.$message.error(res.data.msg)
                                    callback("2")
                                }
                            })
                    }
                })
        },
        openPort(port) {
            this.$commonJs
                .getMethodData(this.$url.OpenPort, "POST", { port: port })
                .then((res) => {})
        },
        synchronization() {
            this.$confirm("是否确认同步?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let url = this.$url.SyncDataBase
                    this.$commonJs
                        .getMethodData(url, "POST", {
                            source_ip: this.form.ipStr,
                            organization_id:
                                this.$commonJs.getStorage().organization_id,
                            source_organization_code:
                                this.form.source_organization_code
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("同步成功")
                            }
                            this.loading = false
                        })
                })
                .catch((err) => err)
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
.cardRow {
    margin-top: 10px;
    margin-left: 10px;
}
@media screen and (min-width: 1600px) {
    .cardStyle1 {
        font-size: 18px;
        line-height: 50px !important;
    }
    .pddingLeft {
        padding-left: 4%;
    }
    .leftTitle {
        font-weight: 600;
        margin-left: 2%;
    }
}
@media screen and (max-width: 1600px) {
    .cardStyle1 {
        font-size: 14px;
        line-height: 30px !important;
        padding-right: 29px;
    }
    .pddingLeft {
        padding-left: 3%;
    }
    .leftTitle {
        font-weight: 600;
        margin-left: 2%;
    }
}
.el-card {
    color: #686e75;
    background: #fff;
}
.cardStyle1 {
    padding-bottom: 20px;
    margin-bottom: 20px;
    padding-top: 20px;
    // font-size: 22px;
    margin-right: 10px;
    // line-height: 50px !important;
    border: 1px solid #d3dae2;
}
</style>