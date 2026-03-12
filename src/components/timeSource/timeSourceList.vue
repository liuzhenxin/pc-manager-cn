<template>
    <div class="navDetailItem" v-loading="loading">
        <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:30px">
            <el-tab-pane label="系统时间设置">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form ref="form" :model="formTime" label-width="180px">
                            <el-form-item label="刷新系统时间">
                                <el-input v-model="formTime.systemTime" placeholder="请输入刷新系统时间" disabled style="width:40%"></el-input>
                                <el-button style="margin-left:20px" type="primary" size="mini" @click="getSystemTime">刷新系统时间</el-button>
                            </el-form-item>
                            <el-form-item label="修改系统时间">
                                <!-- <el-input v-model="modifysystemTime" placeholder="请输入修改系统时间" style="width:40%"></el-input> -->
                                <el-date-picker v-model="formTime.modifysystemTime" type="datetime" style="width:40%" placeholder="选择日期时间" default-time="12:00:00">
                                </el-date-picker>
                                <el-button style="margin-left:20px" @click="setSysTime" size="mini">修改系统时间</el-button>
                                <el-button style="margin-left:20px" type="primary" size="mini" @click="startNTP">开启系统NTP</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="系统时区设置">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form ref="form" :model="formZone" label-width="180px">
                            <el-form-item label="刷新系统时区">
                                <el-input v-model="formZone.sysTimeZone" placeholder="请输入刷新系统时区" disabled style="width:40%"></el-input>
                                <el-button style="margin-left:20px" type="primary" size="mini" @click="getSysTimeZone">刷新设备时区</el-button>
                            </el-form-item>
                            <el-form-item label="修改系统时区">

                                <el-select style="width:40%;" v-model="formZone.modifysysTimeZone" placeholder="请选择系统时区">
                                    <el-option v-for="item in TimeZoneList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <!-- <el-input v-model="formZone.modifysysTimeZone" placeholder="请输入修改系统时区" style="width:40%"></el-input> -->
                                <el-button style="margin-left:20px" @click="setSysTimeZone()" size="mini">修改设备时区</el-button>

                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="时间源设置">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form ref="form" :model="formTraceRoute" label-width="180px">
                            <el-form-item label="启用NTP">
                                <el-radio v-model="formTraceRoute.ntp_server_flag" label="true">是</el-radio>
                                <el-radio v-model="formTraceRoute.ntp_server_flag" label="false">否</el-radio>
                            </el-form-item>
                            <el-form-item label="主NTP服务器">
                                <el-input v-model="formTraceRoute.ntp_server_master" placeholder="请输入主NTP服务器" style="width:40%"></el-input>
                            </el-form-item>
                            <el-form-item label="备份NTP服务器">
                                <el-input v-model="formTraceRoute.ntp_server_slave" placeholder="请输入备份NTP服务器" style="width:40%"></el-input>
                            </el-form-item>
                            <el-form-item label="同步周期">
                                <el-select v-model="formTraceRoute.sync_ntp_time_cron" placeholder="请选择同步周期" style="width:40%">
                                    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="NTP服务时间">
                                <el-input v-model="timeNtp" placeholder="请输入NTP服务时间" style="width:40%" disabled></el-input>
                                <el-button style="margin-left:20px" @click="timeCommon" size="mini">同步</el-button>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" size="mini" @click="getTimeSource">刷新</el-button>
                                <el-button size="mini" @click="UpdTimeSource">保存</el-button>
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
            loading: false,
            radio: "1",
            formTime: {
                systemTime: "",
                modifysystemTime: ""
            },
            formPingRes: "",
            formZone: {
                sysTimeZone: "",
                modifysysTimeZone: ""
            },
            TimeZoneList: [
                {
                    value: "Africa/Abidjan",
                    label: "Africa/Abidjan"
                },
                {
                    value: "Africa/Bamako",
                    label: "Africa/Bamako"
                },
                {
                    value: "Africa/Casablanca",
                    label: "Africa/Casablanca"
                },
                {
                    value: "America/Chicago",
                    label: "America/Chicago"
                },
                {
                    value: "America/Denver",
                    label: "America/Denver"
                },
                {
                    value: "America/Detroit",
                    label: "America/Detroit"
                },
                {
                    value: "America/Havana",
                    label: "America/Havana"
                },
                {
                    value: "America/Los_Angeles",
                    label: "America/Los_Angeles"
                },
                {
                    value: "America/Mexico_City",
                    label: "America/Mexico_City"
                },
                {
                    value: "America/New_York",
                    label: "America/New_York"
                },
                {
                    value: "Asia/Hong_Kong",
                    label: "Asia/Hong_Kong"
                },
                {
                    value: "Asia/Macau",
                    label: "Asia/Macau"
                },
                {
                    value: "Asia/Shanghai",
                    label: "Asia/Shanghai"
                },
                {
                    value: "Asia/Singapore",
                    label: "Asia/Singapore"
                },
                {
                    value: "Asia/Taipei",
                    label: "Asia/Taipei"
                },
                {
                    value: "Asia/Tokyo",
                    label: "Asia/Tokyo"
                },
                {
                    value: "Europe/Berlin",
                    label: "Europe/Berlin"
                },
                {
                    value: "Europe/Budapest",
                    label: "Europe/Budapest"
                },
                {
                    value: "Europe/Dublin",
                    label: "Europe/Dublin"
                },
                {
                    value: "Europe/Istanbul",
                    label: "Europe/Istanbul"
                },
                {
                    value: "Europe/Lisbon",
                    label: "Europe/Lisbon"
                },
                {
                    value: "Europe/London",
                    label: "Europe/London"
                },
                {
                    value: "Europe/Moscow",
                    label: "Europe/Moscow"
                },
                {
                    value: "Europe/Paris",
                    label: "Europe/Paris"
                },
                {
                    value: "Europe/Podgorica",
                    label: "Europe/Podgorica"
                },
                {
                    value: "Europe/Prague",
                    label: "Europe/Prague"
                },
                {
                    value: "Europe/Riga",
                    label: "Europe/Riga"
                },
                {
                    value: "Europe/Rome",
                    label: "Europe/Rome"
                },
                {
                    value: "Europe/Vienna",
                    label: "Europe/Vienna"
                },
                {
                    value: "Europe/Zurich",
                    label: "Europe/Zurich"
                }
            ],
            TimeList: [],
            formTelnetRes: "",

            formTraceRoute: {
                ntp_server_flag: "true",
                ntp_server_master: "",
                ntp_server_slave: "",
                ntp_server_port: "",
                sync_ntp_time_cron: ""
            },
            timeNtp: "",
            formTraceRouteRes: ""
        }
    },
    created() {
        this.getSystemTime()
    },
    methods: {
        // 获取系统时间
        getSystemTime() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.GetSystemTime, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.formTime.systemTime = res.data.data
                        console.log(res, "formPing")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }

                    this.loading = false
                })
        },
        // 修改系统时间
        setSysTime() {
            let date = this.$commonJs.dateTimeFormatter(
                this.formTime.modifysystemTime
            )
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.SetSysTime, "POST", {
                    datetime: date
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "formPing")
                        this.$message.success("修改系统时间成功!")
                        this.formTime.modifysystemTime = ""
                        this.getSystemTime()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        startNTP() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.StartSysNtp, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "formPing")
                        this.$message.success("开启成功!")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        // 获取系统时区
        getSysTimeZone() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.GetSysTimeZone, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.formZone.sysTimeZone = res.data.data
                        console.log(res, "formPing")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        // 修改系统时区
        async setSysTimeZone() {
            this.loading = true
            await this.$commonJs
                .getMethodData(this.$url.SetSysTimeZone, "POST", {
                    zone: this.formZone.modifysysTimeZone
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "formPing")
                        this.$message.success("修改系统时区成功!")
                        this.formZone.modifysysTimeZone = ""
                        setTimeout(() => {
                            this.getSysTimeZone()
                        }, 200)
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        // 获取时间源配置
        getTimeSource() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.GetTimeSource, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.formTraceRoute = res.data.attrs
                        console.log(res.data.attrs, "formPing")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
            this.$commonJs
                .getMethodData(this.$url.GetNtpTime, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.timeNtp = res.data.data
                        console.log(res.data.data, "formPing")
                    } else if (res.data.code != 800000) {
                        // this.$message.error(res.data.msg);
                    }
                    this.loading = false
                })

            this.$commonJs.GetDicData("cron_expression").then((res) => {
                this.TimeList = res
            })
        },
        // 同步服务器时间
        timeCommon() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.SyncNtpTime, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "formPing")
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                })
        },
        // 修改时间源配置
        UpdTimeSource() {
            this.loading = true
            this.$commonJs
                .getMethodData(
                    this.$url.UpdTimeSource,
                    "POST",
                    this.formTraceRoute
                )
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "formPing")
                        this.$message.success("修改时间源配置成功!")
                        this.getTimeSource()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
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
                this.formTraceRoute
                this.formTraceRouteRes = ""
            }
        },
        handleClick(tab, event) {
            console.log(tab, event)
            if (tab.label == "系统时间设置") {
                // this.formTime = {};
                this.getSystemTime()
            }
            if (tab.label == "系统时区设置") {
                // this.formZone = {};
                this.getSysTimeZone()
            }
            if (tab.label == "时间源设置") {
                this.getTimeSource()
                // this.formReset("TraceRoute");
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
</style>