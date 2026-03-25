<template>
    <div style="margin-top:-5px">
        <el-backtop></el-backtop>
        <el-row>
            <el-col>
                <el-card style="border-radius:15px">
                    <el-row class="cardRow" style="">
                        <el-card class="cardStyle1" style="">
                            <el-row style="display: flex;align-items: center;justify-content: ceter;">
                                <div style="display: flex;flex-direction: column;width: 33.3%; margin: auto;">
                                    <borderTitle title="设备信息" type="1" style="height: 280px">
                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">设备类型</el-col>
                                        <el-col :span="10" class="pddingLeft">
                                            <el-tooltip class="item" effect="light" :content="equipmentType"
                                                    placement="top-start" style="margin-right:50px;">
                                                    <span
                                                        style="display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor:pointer;width:100%">{{
                                                            equipmentType}}</span>
                                                </el-tooltip>
                                        </el-col>

                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">设备型号</el-col>
                                        <el-col :span="10" class="pddingLeft">
                                            <el-tooltip class="item" effect="light" :content="deviceInfo.DeviceModel"
                                                    placement="top-start" style="margin-right:50px;">
                                                    <span
                                                        style="display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor:pointer;width:100%">{{
                                                            deviceInfo.DeviceModel}}</span>
                                                </el-tooltip>
                                        </el-col>

                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">序列号</el-col>
                                        <el-col :span="10" class="pddingLeft">
                                            <el-tooltip class="item" effect="light" :content="deviceInfo.DeviceSN"
                                                    placement="top-start" style="margin-right:50px;">
                                                    <span
                                                        style="display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor:pointer;width:100%">{{
                                                            deviceInfo.DeviceSN}}</span>
                                                </el-tooltip>
                                        </el-col>

                                        <div v-if="$commonJs.getStorage().routeType != '30'">
                                            <el-col :span="13" class="pddingLeft leftTitle textEnd">硬件版本号</el-col>
                                            <el-col :span="10" class="pddingLeft">{{ hardware }}</el-col>

                                            <el-col :span="13" class="pddingLeft leftTitle textEnd">设备自检信息</el-col>
                                            <el-col :span="10" class="pddingLeft">
                                                <i class="el-icon-circle-check"
                                                    style="color:#67C23A;font-size:20px;margin-right:10px"
                                                    v-if="selfVal != 0"></i>
                                                <i class="el-icon-circle-close"
                                                    style="color:#F56C6C;font-size:20px;margin-right:10px" v-else></i>
                                                <!-- {{ selfinspection }} -->
                                            </el-col>
                                        </div>

                                        <div v-if="$commonJs.getStorage().routeType == '30'">
                                            <el-col :span="13" class="pddingLeft leftTitle textEnd">支持CA个数</el-col>
                                            <el-col :span="10" class="pddingLeft">10</el-col>

                                            <el-col :span="13" class="pddingLeft leftTitle textEnd">签发证书个数</el-col>
                                            <el-col :span="10" class="pddingLeft">100</el-col>
                                        </div>

                                        <div style="text-align: right;">
                                            <el-button type="primary" @click="jumpToDevice" size="mini">更多</el-button>
                                        </div>
                                    </borderTitle>
                                </div>
                                <div style="display: flex;flex-direction: column;width: 33.3%;margin: auto;">
                                    <borderTitle title="硬件信息" type="1" style="height: 280px">
                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">对称算法</el-col>
                                        <el-col :span="10" class="pddingLeft">
                                            <el-tooltip class="item" effect="light" :content="systemInfo.Duichen"
                                                    placement="top-start" style="margin-right:50px;">
                                                    <span
                                                        style="display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor:pointer;width:100%">{{
                                                            systemInfo.Duichen}}</span>
                                                </el-tooltip>
                                        </el-col>

                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">非对称算法</el-col>
                                        <el-col :span="10" class="pddingLeft">
                                            <el-tooltip class="item" effect="light" :content="systemInfo.FeiDuiChen"
                                                    placement="top-start" style="margin-right:50px;">
                                                    <span
                                                        style="display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor:pointer;width:100%">{{
                                                            systemInfo.FeiDuiChen}}</span>
                                                </el-tooltip>
                                        </el-col>

                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">杂凑算法</el-col>
                                        <el-col :span="10" class="pddingLeft">
                                            <el-tooltip class="item" effect="light" :content="systemInfo.ZaCou"
                                                    placement="top-start" style="margin-right:50px;">
                                                    <span
                                                        style="display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor:pointer;width:100%">{{
                                                            systemInfo.ZaCou}}</span>
                                                </el-tooltip>
                                        </el-col>

                                        <div v-if="$commonJs.getStorage().routeType != '30'">
                                            <el-col :span="13" class="pddingLeft leftTitle textEnd">当前在用网卡名</el-col>
                                            <el-col :span="10" class="pddingLeft">
                                                <el-tooltip class="item" effect="light" :content="currentIP"
                                                    placement="top-start" style="margin-right:50px;">
                                                    <span
                                                        style="display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor:pointer;width:100%">{{
                                                            currentIP }}</span>
                                                </el-tooltip>
                                            </el-col>

                                            <div v-if="routeType == 10">
                                                <el-col :span="13" class="pddingLeft leftTitle textEnd">密钥存储能力</el-col>
                                                <el-col :span="10" class="pddingLeft">
                                                    SM2:{{ countList.sm2_key_count }},
                                                    KEK:{{ countList.kek_count }}
                                                </el-col>
                                            </div>
                                        </div>

                                        <div v-if="$commonJs.getStorage().routeType == '20'">
                                            <el-col :span="13" class="pddingLeft leftTitle textEnd">安全状态</el-col>
                                            <el-col :span="10" class="pddingLeft ">
                                                {{ safetyStatus }}
                                            </el-col>
                                        </div>

                                        <div style="text-align: right;">
                                            <el-button type="primary" @click="jumpToDevice" size="mini">更多</el-button>
                                        </div>
                                    </borderTitle>
                                </div>
                                <div style="display: flex;flex-direction: column;width: 33.3%;margin: auto;">
                                    <borderTitle title="服务信息" type="1" style="height: 280px">
                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">组织机构名称</el-col>
                                        <el-col :span="10" class="pddingLeft">
                                            <el-tooltip class="item" effect="light" :content="orgName"
                                                    placement="top-start" style="margin-right:50px;">
                                                    <span
                                                        style="display:block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;cursor:pointer;width:100%">{{
                                                            orgName}}</span>
                                                </el-tooltip>
                                        </el-col>

                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">组织机构编号</el-col>
                                        <el-col :span="10" class="pddingLeft">{{ orgCode }}</el-col>

                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">运行时间</el-col>
                                        <el-col :span="10" class="pddingLeft">{{ runTime }}</el-col>

                                        <el-col :span="13" class="pddingLeft leftTitle textEnd">软件版本号</el-col>
                                        <el-col :span="10" class="pddingLeft">{{ manageInfo.SoftwareVersion }}</el-col>

                                        <div v-if="$commonJs.getStorage().routeType != '30'">
                                            <el-col :span="13" class="pddingLeft leftTitle textEnd">服务状态</el-col>
                                            <el-col :span="10" class="pddingLeft">
                                                <i class="el-icon-circle-check" v-if="isRunning == true"
                                                    style="color:#67C23A;font-size:20px;margin-right:10px"></i>
                                                <i class="el-icon-circle-close" v-if="isRunning == false"
                                                    style="color:#F56C6C;font-size:20px;margin-right:10px"></i>
                                            </el-col>
                                        </div>

                                        <div v-if="$commonJs.getStorage().routeType == '30'">
                                            <el-col :span="13" class="pddingLeft leftTitle textEnd">服务状态</el-col>
                                            <el-col :span="10" class="pddingLeft">
                                                <i class="el-icon-circle-check"
                                                    style="color:#67C23A;font-size:20px;margin-right:10px"></i>
                                            </el-col>

                                        </div>

                                        <div style="text-align: right;">
                                            <el-button type="primary" @click="jumpToDevice" size="mini">更多</el-button>
                                        </div>
                                    </borderTitle>
                                </div>
                            </el-row>
                        </el-card>
                        <el-col>
                            <el-card class="cardStyle" style="padding-top: 30px; padding-bottom:20px;margin-bottom: 15px;">
                                <el-col :span="6" style="margin-left:0%">
                                    <span style="font-size:18px;font-weight:bold">服务器CPU</span><br>
                                    <span style="font-size:12px">颜色: <span class="lineColor"
                                            style="background:#889cd8"></span></span>
                                    <el-row>
                                        <div id="myChart1" :style="{ 'width': widthVal, 'height': heightVal }"
                                            style="margin-left:50px"></div>
                                    </el-row>
                                </el-col>
                                <el-col :span="6" style="margin-left:0%">
                                    <span style="font-size:18px;font-weight:bold">内存</span><br>
                                    <span style="font-size:12px">颜色: <span class="lineColor"
                                            style="background:#48db61"></span></span>
                                    <el-row>
                                        <div id="myChart2" :style="{ 'width': widthVal, 'height': heightVal }"
                                            style="margin-left:50px"></div>
                                    </el-row>
                                </el-col>
                                <el-col :span="6" style="margin-left:0%">
                                    <span style="font-size:18px;font-weight:bold">硬盘</span><br>
                                    <span style="font-size:12px">颜色: <span class="lineColor"
                                            style="background:#dcdf3b"></span></span>
                                    <el-row>
                                        <div id="myChart3" :style="{ 'width': widthVal, 'height': heightVal }"
                                            style="margin-left:50px"></div>
                                    </el-row>
                                </el-col>
                                <el-col :span="6" style="margin-left:0%">
                                    <span style="font-size:18px;font-weight:bold">网络</span><br>
                                    <span style="font-size:12px">颜色: <span class="lineColor"
                                            style="background:#889cd8"></span></span>
                                    <el-row>
                                        <div id="myChart4" :style="{ 'width': widthVal, 'height': heightVal }"
                                            style="margin-left:50px"></div>
                                    </el-row>
                                </el-col>
                            </el-card>
                        </el-col>
                        <el-col>
                            <el-card class="cardStyle" style="padding-bottom:20px;margin-bottom: 15px;">
                                <el-row style="margin-top: 40px;margin-bottom: 30px;">
                                    <el-col :span="11">
                                        <div id="lineChart1" :style="{ 'width': lineWidthVal, 'height': lineHeightVal }"
                                            style="margin-left:50px"></div>
                                    </el-col>
                                    <el-col :span="11" style="margin-left:5%">
                                        <div id="lineChart2" :style="{ 'width': lineWidthVal, 'height': lineHeightVal }"
                                            style="margin-left:50px"></div>
                                    </el-col>

                                </el-row>
                            </el-card>
                        </el-col>

                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
let Echarts = require("echarts") //基础实例 注意不要使用import
// require("echarts/lib/chart/bar") //按需引入 bar = 柱状图
import borderTitle from "../ApplicationCert/borderTitle.vue"
export default {
    inject: ["reload"],
    components: { borderTitle },
    data() {
        return {
            isRunning: true,
            equipmentName: "密码",
            widthVal: "350px",
            heightVal: "225px",
            lineWidthVal: "50%",
            lineHeightVal: "350px",
            equipmentType: "服务器密码机", // 设备类型
            selfinspection: "2022-03-17 12:24:33", //自检
            selfVal: "1",
            software: "\xa0", // 软件
            hardware: "V2.0", //硬件 23.01.08
            runTime: "\xa0", // 运行时间
            secretKey: "SM2,RSA,KEK", // 密钥存储能力
            algorithm: "\xa0", //密码算法
            safetyStatus: "初始状态", // 安全状态
            displayModel: "DYSX-CS02", // 显示型号
            currentIP: "\xa0", // 当前IP
            myChart1Val: 7,
            myChart2Val: 2,
            myChart3Val: 2,
            myChart4Val: 2,
            myChart1: {},
            myChart2: {},
            myChart3: {},
            myChart4: {},
            routeType: 10,
            lineChart1: {},
            lineChart2: {},
            countList: {},
            CPUdata: [],
            NeiCunData: [],
            YingPanData: [],
            // WangLuoData: [[+new Date(1988, 9, 3), Math.random() * 300]],
            WangLuoData: [],
            timer1: null,
            timer2: null,
            screenWidth: 0,
            deviceNumber: "",
            orgName: this.$commonJs.getStorage().organization_name,
            orgCode: this.$commonJs.getStorage().organization_code,
            deviceInfo: {
                DeviceModel: "暂无",//设备型号
                DeviceSN: "暂无",//设备序列号
            },
            systemInfo: {
                Duichen: "暂无",
                FeiDuiChen: "暂无",
                ZaCou: "暂无"
            },
            manageInfo: {
                SoftwareVersion: "暂无"
            },
            netLastValue: 0,
            netPerCentage: 0.0,
            xunhuanCount: 100
        }
    },
    mounted() {
        window.addEventListener("resize", () => {
            // this.myChart1Val.resize();
            // this.chart1.resize()
            // this.chart2.resize()
            // this.chart3.resize()
            // this.getSysinit();
        })
        if (window.sessionStorage.getItem("activePath") == "GetStatistics") {
            this.init()
            // this.getSysinit()
            this.timer1 = setInterval(() => {
                this.getSysinit1()
            }, 2000)
            this.timer2 = setInterval(() => {
                this.getSysinit2()
            }, 1000)
        }
        this.screenWidth = document.body.clientWidth
        if (this.screenWidth <= 1600) {
            this.widthVal = "330px"
            this.heightVal = "130px"
        }
    },
    // 销毁定时器
    beforeDestroy() {
        if (window.sessionStorage.getItem("activePath") != "GetStatistics") {
            clearInterval(this.timer1)
            clearInterval(this.timer2)
            this.timer1 = null
            this.timer2 = null
        }
    },
    destroyed() {
        if (window.sessionStorage.getItem("activePath") != "GetStatistics") {
            clearInterval(this.timer1)
            clearInterval(this.timer2)
            this.timer1 = null
            this.timer2 = null
        }
    },
    watch: {},
    created() {
        localStorage.setItem("countList", "666")
        this.getResourceDetail("4")
        this.getResourceDetail("7")
        this.getDeviceInfoByType("DeviceModel");
        this.getDeviceInfoByType("DeviceSN");
        this.getDeviceInfoByType("SystemSupportAsymmetryAlgorithm");//非对称
        this.getDeviceInfoByType("SystemSupportSymmetryAlgorithm");//对称
        this.getDeviceInfoByType("SystemSupportHashAlgorithm");//杂凑
        this.getDeviceInfoByType("SoftwareVersion");
        this.getByCode()
        if (this.$commonJs.getStorage().routeType == "10") {
            this.getHSMServerStatus()
        }
        this.$commonJs.GetAioStep().then((res) => {
            // if (res.data.data.hsm_auth == 1 || res.data.data.svs_auth == 1) {
            //     this.$commonJs.deviceConfGet().then((res) => {
            //         this.countList = res.data.data
            //     })
            // }
            if (this.$commonJs.getStorage().routeType == "10") {
                this.$commonJs.deviceConfGet().then((res) => {
                    this.countList = res.data.data
                })
            }
        })
    },

    methods: {
        jumpToDevice() {
            this.$router.push({
                path: "/DeviceInfoList"
            })
        },
        getDeviceInfoByType(code) {
            let url = this.$url.GetDeviceInfoByCode
            this.$commonJs
                .getMethodData(url, "POST", {
                    code: code
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (code == "DeviceModel") {
                            // let arrDevice = res.data.data
                            // this.deviceInfo.DeviceModel = arrDevice.filter(item => item.code.includes("DeviceModel"))[0].val
                            this.deviceInfo.DeviceModel = res.data.data.val
                        } else if (code == "DeviceSN") {
                            this.deviceInfo.DeviceSN = res.data.data.val
                        } else if (code == "SystemSupportAsymmetryAlgorithm") {
                            this.systemInfo.FeiDuiChen = res.data.data.val
                        }
                        else if (code == "SystemSupportSymmetryAlgorithm") {
                            this.systemInfo.Duichen = res.data.data.val
                        }
                        else if (code == "SystemSupportHashAlgorithm") {
                            this.systemInfo.ZaCou = res.data.data.val
                        }
                        else if (code == "SoftwareVersion") {
                            this.manageInfo.SoftwareVersion = res.data.data.val
                        }

                    }
                    this.loading = false
                })
        },
        // 获取hsm服务状态
        getHSMServerStatus() {
            this.loading = true
            let url = this.$url.HSMServerFailure
            this.$commonJs.getMethodData(url, "POST", {}).then((res) => {
                if (res.data.data == false) {
                    this.open()
                }
                this.loading = false
            })
        },
        open() {
            this.$alert("密码机服务发生故障", "提示", {
                confirmButtonText: "确定",
                type: "error"
            })
        },
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
                        console.log(res, "res")
                        if (code == "7") {
                            this.hardware = res.data.data.content
                        }else if(code == "4" || code == "5"){
                          this.displayModel = res.data.data.content
                          this.equipmentType = res.data.data.position
                        } else {
                            this.displayModel = res.data.data.content
                        }
                    }
                    this.loading = false
                })
        },
        getSysinit1() {
            let dataNum = []
            this.$commonJs
                .getMethodData(this.$url.GetSystemCpuLoad, "POST", {})
                .then((res) => {
                    let num
                    if (res.data.code == 100000) {
                        num = Number(res.data.data)

                        if (num > 0) {
                            this.myChart1Val = (num.toFixed(3) * 100).toFixed(1)
                        } else {
                            this.myChart1Val = 0
                        }
                        if (this.myChart1Val > 100) {
                            this.myChart1Val = 99
                        }
                        // console.log(this.myChart1Val);
                    }
                    if (this.CPUdata.length == 0) {
                        for (let i = 0; i < this.xunhuanCount; i++) {
                            this.CPUdata.push(
                                this.myChart1Val
                            )
                        }
                    } else {
                        this.CPUdata.push(this.myChart1Val)
                    }
                    if (this.CPUdata.length > 6) {
                        this.CPUdata.shift()
                    }
                    this.myChart1.setOption({
                        series: [
                            {
                                data: [
                                    {
                                        value: this.myChart1Val
                                    }
                                ]
                            },
                            {
                                data: [
                                    {
                                        value: this.myChart1Val
                                    }
                                ]
                            }
                        ]
                    })
                })

            this.$commonJs
                .getMethodData(this.$url.GetPhysicalMemoryData, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        var datainVal
                        if (res.data.data > 0) {
                            this.myChart2Val =
                                // =  res.data.data.toFixed(2) * 100;
                                (res.data.data.toFixed(3) * 100).toFixed(1)
                        } else {
                            this.myChart2Val = res.data.data
                        }
                        if (this.NeiCunData.length == 0) {
                            for (let i = 0; i < this.xunhuanCount; i++) {
                                this.NeiCunData.push(
                                    this.myChart2Val
                                )
                            }
                        } else {
                            this.NeiCunData.push(this.myChart2Val)
                        }

                        if (this.NeiCunData.length > 6) {
                            this.NeiCunData.shift()

                        }
                        this.myChart2.setOption({
                            series: [
                                {
                                    data: [
                                        {
                                            value: this.myChart2Val
                                        }
                                    ]
                                },
                                {
                                    data: [
                                        {
                                            value: this.myChart2Val
                                        }
                                    ]
                                }
                            ]
                        })
                    }
                })

            this.$commonJs
                .getMethodData(this.$url.GetDiskData, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        var datainVal
                        // if (res.data.data > 0) {
                        //     this.myChart3Val =
                        //         (res.data.data.toFixed(3) * 100).toFixed(1)
                        // } else {
                        //     this.myChart3Val = res.data.data
                        // }
                        let arr = res.data.data
                        var total = 0
                        var used = 0
                        var percentage = 0.0
                        let resulData = {}
                        for (let i = 0; i < arr.length; i++) {
                            resulData = arr[i]
                            total += resulData.total
                            used += resulData.used
                        }
                        percentage = used / total
                        this.myChart3Val = (percentage.toFixed(3) * 100).toFixed(1)
                        if (this.YingPanData.length == 0) {
                            for (let i = 0; i < this.xunhuanCount; i++) {
                                this.YingPanData.push(
                                    this.myChart3Val
                                )
                            }
                        } else {
                            this.YingPanData.push(this.myChart3Val)
                        }

                        if (this.YingPanData.length > 6) {
                            this.YingPanData.shift()
                        }
                        this.myChart3.setOption({
                            series: [
                                {
                                    data: [
                                        {
                                            value: this.myChart3Val
                                        }
                                    ]
                                },
                                {
                                    data: [
                                        {
                                            value: this.myChart3Val
                                        }
                                    ]
                                }
                            ]
                        })
                    }
                })

            this.lineChart1.setOption({
                series: [
                    {
                        name: "服务器CPU",
                        type: "line",
                        data: this.CPUdata
                    },
                    {
                        name: "内存",
                        type: "line",
                        data: this.NeiCunData
                    },
                    {
                        name: "硬盘",
                        type: "line",
                        data: this.YingPanData
                    }
                ]
            })
        },
        getSysinit2() {
            this.$commonJs
                .getMethodData(this.$url.GetTraffic, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        var datainVal
                        if (this.netLastValue != 0) {
                            this.netPerCentage = (res.data.data - this.netLastValue) / 1024 / 1024
                            console.log(res.data.data, this.netLastValue, this.netPerCentage)
                            this.netPerCentage = this.netPerCentage.toFixed(2)
                        }
                        this.myChart4Val = this.netPerCentage
                        this.netLastValue = res.data.data

                        if (this.WangLuoData.length == 0) {
                            for (let i = 0; i < this.xunhuanCount; i++) {
                                this.WangLuoData.push(
                                    this.myChart4Val
                                )
                            }
                        } else {
                            this.WangLuoData.push(this.myChart4Val)
                        }


                        if (this.WangLuoData.length > 6) {
                            this.WangLuoData.shift()
                        }
                        this.myChart4.setOption({
                            series: [
                                {
                                    data: [
                                        {
                                            value: this.myChart4Val
                                        }
                                    ]
                                },
                                {
                                    data: [
                                        {
                                            value: this.myChart4Val
                                        }
                                    ]
                                }
                            ]
                        })
                    }
                })

            this.lineChart2.setOption({
                series: [
                    {
                        name: "网络",
                        type: "line",
                        smooth: true,
                        symbol: 'none',
                        data: this.WangLuoData
                    }
                ]
            })
        },
        init() {
            // debugger;
            this.myChart1 = Echarts.init(document.getElementById("myChart1"))
            this.myChart2 = Echarts.init(document.getElementById("myChart2"))
            this.myChart3 = Echarts.init(document.getElementById("myChart3"))
            this.myChart4 = Echarts.init(document.getElementById("myChart4"))
            this.lineChart1 = Echarts.init(document.getElementById("lineChart1"), null, { devicePixelRatio: 2 })
            this.lineChart2 = Echarts.init(document.getElementById("lineChart2"), null, { devicePixelRatio: 2 })

            let myChart1Option = {
                series: [
                    {
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 100,
                        splitNumber: 10,
                        itemStyle: {
                            color: '#FFAB91'
                        },
                        progress: {
                            show: true,
                            width: 25
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                width: 25
                            }
                        },
                        axisTick: {
                            distance: -45,
                            splitNumber: 5,
                            lineStyle: {
                                width: 2,
                                color: '#999'
                            }
                        },
                        splitLine: {
                            distance: -52,
                            length: 14,
                            lineStyle: {
                                width: 3,
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            distance: -10,
                            color: '#999',
                            fontSize: 20
                        },
                        anchor: {
                            show: false
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            width: '60%',
                            lineHeight: 40,
                            borderRadius: 8,
                            offsetCenter: [0, '-15%'],
                            fontSize: 30,
                            fontWeight: 'bolder',
                            formatter: '{value}%',
                            color: 'inherit'
                        },
                        data: [
                            {
                                value: 20
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 100,
                        itemStyle: {
                            color: '#FD7347'
                        },
                        progress: {
                            show: true,
                            width: 8
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        detail: {
                            show: false
                        },
                        data: [
                            {
                                value: 20
                            }
                        ]
                    }
                ]

            }
            let myChart2Option = {
                series: [
                    {
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 100,
                        splitNumber: 10,
                        itemStyle: {
                            color: '#FFAB91'
                        },
                        progress: {
                            show: true,
                            width: 25
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                width: 25
                            }
                        },
                        axisTick: {
                            distance: -45,
                            splitNumber: 5,
                            lineStyle: {
                                width: 2,
                                color: '#999'
                            }
                        },
                        splitLine: {
                            distance: -52,
                            length: 14,
                            lineStyle: {
                                width: 3,
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            distance: -10,
                            color: '#999',
                            fontSize: 20
                        },
                        anchor: {
                            show: false
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            width: '60%',
                            lineHeight: 40,
                            borderRadius: 8,
                            offsetCenter: [0, '-15%'],
                            fontSize: 30,
                            fontWeight: 'bolder',
                            formatter: '{value}%',
                            color: 'inherit'
                        },
                        data: [
                            {
                                value: 20
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 100,
                        itemStyle: {
                            color: '#FD7347'
                        },
                        progress: {
                            show: true,
                            width: 8
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        detail: {
                            show: false
                        },
                        data: [
                            {
                                value: 20
                            }
                        ]
                    }
                ]
            }
            let myChart3Option = {
                series: [
                    {
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 100,
                        splitNumber: 10,
                        itemStyle: {
                            color: '#FFAB91'
                        },
                        progress: {
                            show: true,
                            width: 25
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                width: 25
                            }
                        },
                        axisTick: {
                            distance: -45,
                            splitNumber: 5,
                            lineStyle: {
                                width: 2,
                                color: '#999'
                            }
                        },
                        splitLine: {
                            distance: -52,
                            length: 14,
                            lineStyle: {
                                width: 3,
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            distance: -10,
                            color: '#999',
                            fontSize: 20
                        },
                        anchor: {
                            show: false
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            width: '60%',
                            lineHeight: 40,
                            borderRadius: 8,
                            offsetCenter: [0, '-15%'],
                            fontSize: 30,
                            fontWeight: 'bolder',
                            formatter: '{value}%',
                            color: 'inherit'
                        },
                        data: [
                            {
                                value: 20
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 100,
                        itemStyle: {
                            color: '#FD7347'
                        },
                        progress: {
                            show: true,
                            width: 8
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        detail: {
                            show: false
                        },
                        data: [
                            {
                                value: 20
                            }
                        ]
                    }
                ]
            }
            let myChart4Option = {
                series: [
                    {
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 100,
                        splitNumber: 10,
                        itemStyle: {
                            color: '#FFAB91'
                        },
                        progress: {
                            show: true,
                            width: 25
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                width: 25
                            }
                        },
                        axisTick: {
                            distance: -45,
                            splitNumber: 5,
                            lineStyle: {
                                width: 2,
                                color: '#999'
                            }
                        },
                        splitLine: {
                            distance: -52,
                            length: 14,
                            lineStyle: {
                                width: 3,
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            distance: -10,
                            color: '#999',
                            fontSize: 20
                        },
                        anchor: {
                            show: false
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            width: '60%',
                            lineHeight: 40,
                            borderRadius: 8,
                            offsetCenter: [0, '-15%'],
                            fontSize: 30,
                            fontWeight: 'bolder',
                            formatter: '{value}M',
                            color: 'inherit'
                        },
                        data: [
                            {
                                value: 20
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 100,
                        itemStyle: {
                            color: '#FD7347'
                        },
                        progress: {
                            show: true,
                            width: 8
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        detail: {
                            show: false
                        },
                        data: [
                            {
                                value: 20
                            }
                        ]
                    }
                ]
            }

            let option1 = {
                title: {
                    show: true,
                    text: "硬件信息",
                    textStyle: { //设置字体样式
                        color: '#686e75',
                        fontSize: 13,
                        fontWeight: 800
                    }
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                },
                grid: {
                    left: "2%",
                    right: "1%",
                    bottom: "30%",
                    containLabel: true
                },
                toolbox: {},
                xAxis: {
                    show: false,
                    type: "category",
                    boundaryGap: false
                },
                yAxis: {
                    type: "value",
                    min: 0,
                    max: 100,
                    axisLabel: {
                        formatter: "{value} %"
                    },
                    scale: true, //自适应
                    minInterval: 0.1 //分割刻度
                },
                series: [
                    {
                        name: "服务器CPU",
                        type: "line",
                        data: this.CPUdata,
                        symbol: 'circle',
                        symbolSize: 2,   // 控制点大小
                        lineStyle: {
                            normal: {
                                width: 1,
                            }
                        }
                    },
                    {
                        name: "内存",
                        type: "line",
                        data: this.NeiCunData,
                        symbol: 'circle',
                        symbolSize: 2,   // 控制点大小
                        lineStyle: {
                            normal: {
                                width: 1,
                            }
                        }
                    },
                    {
                        name: "硬盘",
                        type: "line",
                        data: this.YingPanData,
                        symbol: 'circle',
                        symbolSize: 2,   // 控制点大小
                        lineStyle: {
                            normal: {
                                width: 1,
                            }
                        }
                    }
                ]
            }

            var tempArr = []
            for (let i = 0; i < this.xunhuanCount; i++) {
                tempArr.push("")
            }
            let option2 = {
                title: {
                    show: true,
                    text: '流量波形图',
                    textStyle: { //设置字体样式
                        color: '#686e75',
                        fontSize: 13,
                        fontWeight: 800
                    }
                },
                legend: {
                    data: ['网络']
                },
                grid: {
                    left: '0%',
                    right: '1%',
                    bottom: '30%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: tempArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '网络',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,  //右
                                y: 0,  //下
                                x2: 0,  //左
                                y2: 1,  //上
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#66ffff' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#cc66ff' // 100% 处的颜色
                                    }
                                ]
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 1,
                            }
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: this.WangLuoData
                    }
                ]
            }

            myChart1Option && this.myChart1.setOption(myChart1Option)
            myChart2Option && this.myChart2.setOption(myChart2Option)
            myChart3Option && this.myChart3.setOption(myChart3Option)
            myChart4Option && this.myChart4.setOption(myChart4Option)
            option1 && this.lineChart1.setOption(option1)
            option2 && this.lineChart2.setOption(option2)
        },
        getByCode() {
            this.$commonJs.getLoading()
            let arrList = [
                "cryptographic.algorithm", //密码算法
                "soft.version", // 软件
                "system.runtime" // 运行时间
            ]
            for (var i = 0; i < arrList.length; i++) {
                let ArrVal = arrList[i]
                this.$commonJs
                    .getMethodData(this.$url.GetByCode, "POST", {
                        code: arrList[i]
                    })
                    .then((res) => {
                        let dataVal
                        let codeList
                        if (res.data.data == null) {
                            dataVal = "\xa0"
                        } else {
                            dataVal = res.data.data.val
                            codeList = res.data.data.code
                        }
                        if (codeList == "soft.version") {
                            this.software = dataVal
                        }
                        if (codeList == "system.runtime") {
                            // let dataTime = this.$commonJs.dateTimeFormatter(
                            //     new Date()
                            // );
                            // this.runTime = dataVal - dataTime;
                            this.runTime = this.getTime(dataVal, 0)
                            window.sessionStorage.setItem("runTime", dataVal)
                        }
                        if (codeList == "cryptographic.algorithm") {
                            this.algorithm = dataVal
                            if (this.$commonJs.getStorage().routeType == "20") {
                                this.algorithm =
                                    // "SM3_SM2, SHA1_RSA, SHA256_RSA";
                                    "SM1; SM2; SM3; SM4;"
                            }
                        }
                    })
            }
            this.$commonJs
                .getMethodData(this.$url.ShowNic, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        let dataList = res.data.data
                        if (dataList.length != 0) {
                            // this.currentIP = dataList.join(",")
                            dataList.forEach((element) => {
                                this.currentIP += element.name + ","
                            })
                        }
                        // this.formTraceRouteRes = res.data.data;
                    }
                })
            this.$commonJs
                .getMethodData(this.$url.GetMyself, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.selfinspection = res.data.data.update_time
                        this.selfVal = res.data.data.val
                    }
                })
            // this.$commonJs.GetAioStep().then((res) => {
            //     if (
            //         res.data.data.hsm_auth == 1 ||
            //         res.data.data.svs_auth == 1
            //     ) {
            let url = this.$url.IsServerOpen
            if (this.$commonJs.getStorage().routeType == "20") {
                url = this.$url.IsOpen
            }
            this.$commonJs.getMethodData(url, "POST", {}).then((res) => {
                if (res.data.code == 100000) {
                    this.$nextTick(() => {
                        this.isRunning = res.data.data
                        if (res.data.data == true) {
                            this.safetyStatus = "已就绪"
                        }
                    })
                } else if (res.data.code != 800000) {
                    this.isRunning = false
                    this.$message.error(res.data.msg)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            //     }
            // })
            if (
                this.$commonJs.getStorage().RoleList.length == 3 ||
                this.$commonJs.getStorage().RoleList[0].role_system_type == "00"
            ) {
                this.displayModel = "DYSX-AIO"
                this.equipmentType = "密码服务一体机"
                this.equipmentName = ""
                this.algorithm = "SM1; SM2; SM3; SM4;"
                this.getResourceDetail("3")

            } else {
                if (this.$commonJs.getStorage().routeType == "20") {
                    this.routeType = this.$commonJs.getStorage().routeType
                    this.equipmentType = "签名验签服务器"
                    this.displayModel = "DYSX-SVS02"
                    this.equipmentName = ""
                    // this.algorithm = "SM3_SM2,SHA1_RSA,SHA256_RSA";
                    this.algorithm = "SM1; SM2; SM3; SM4;"
                    this.getResourceDetail("5")
                }
                if (this.$commonJs.getStorage().routeType == "30") {
                    this.routeType = this.$commonJs.getStorage().routeType
                    this.equipmentType = "数字证书认证系统"
                    this.displayModel = "DYSX-CA02"
                    this.equipmentName = ""
                    // this.algorithm = "SM3_SM2,SHA1_RSA,SHA256_RSA";
                    this.algorithm = "SM1; SM2; SM3; SM4;"
                    this.getResourceDetail("6")
                }
            }

            // if (this.$commonJs.getStorage().RoleList.length == 1) {
            //     if (
            //         this.$commonJs.getStorage().RoleList[0].system_type == "20"
            //     ) {
            //         this.equipmentType = "签名验签服务器";
            //         this.displayModel = "DYSX-SVS02";
            //         this.equipmentName = "";
            //         // this.algorithm = "SM3_SM2,SHA1_RSA,SHA256_RSA";
            //         this.algorithm = "SM1;SM2;SM3;SM4";
            //     }
            //     console.log(
            //         this.$commonJs.getStorage().RoleList,
            //         "this.$commonJs.getStorage().RoleList"
            //     );
            // }
            this.$commonJs.getCloseLoading()
        },
        getTime(start, end) {
            let staytimeGap = new Date().getTime() - new Date(start).getTime()
            let stayDay = Math.floor(staytimeGap / (3600 * 1000 * 24)) //  日
            let leave0 = staytimeGap % (3600 * 1000 * 24)
            let stayHour = Math.floor(leave0 / (3600 * 1000)) //  小时
            let leave1 = staytimeGap % (3600 * 1000)
            let stayMin = Math.floor(leave1 / (60 * 1000)) //分钟
            let leave2 = leave1 % (60 * 1000)
            let staySec = Math.floor(leave2 / 1000) //秒

            console.log(
                // dataTime,
                "相差" +
                stayDay +
                "天" +
                stayHour +
                "小时" +
                stayMin +
                "分钟" +
                staySec +
                "秒"
            )
            if (stayDay + stayHour + stayMin + staySec > 0) {
                return (
                    stayDay +
                    "天" +
                    stayHour +
                    "时" +
                    stayMin +
                    "分" +
                    staySec +
                    "秒"
                )
            } else {
                return 0
            }
        }
    }
}
</script>

<style lang="less" scoped>
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

    .textEnd {
        text-align: left;
    }

    /deep/ #lineChart1 canvas {
        margin-left: 50px;
        width: 600px !important;
        height: 500px !important;
    }

    /deep/ #lineChart2 canvas {
        width: 600px !important;
        height: 500px !important;
    }

    /deep/ #myChart1 canvas {
        width: 300px !important;
        height: 200px !important;
        // top: 8px !important;
    }

    /deep/ #myChart2 canvas {
        width: 300px !important;
        height: 200px !important;

        // top: 8px !important;
    }

    /deep/ #myChart3 canvas {
        width: 300px !important;
        height: 200px !important;

        // top: 8px !important;
    }

    /deep/ #myChart4 canvas {
        width: 300px !important;
        height: 200px !important;

        // top: 8px !important;
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

    /deep/ #lineChart1 canvas {
        width: 400px !important;
        height: 213px !important;
    }

    /deep/ #lineChart2 canvas {
        width: 400px !important;
        height: 213px !important;
    }

    /deep/ #myChart1 canvas {
        width: 300px !important;
        height: 190px !important;
        top: -20px !important;
    }

    /deep/ #myChart2 canvas {
        width: 300px !important;
        height: 190px !important;
        top: -20px !important;
    }

    /deep/ #myChart3 canvas {
        width: 300px !important;
        height: 190px !important;
        top: -20px !important;
    }

    /deep/ #myChart4 canvas {
        width: 300px !important;
        height: 190px !important;
        top: -20px !important;
    }
}

.lineColor {
    display: inline-block;
    margin-left: 5px;
    margin-bottom: 2px;
    width: 30px;
    height: 5px;
}

.cardStyle {
    margin-right: 10px;

    line-height: 24px !important;
    border: 1px solid #d3dae2;
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

.commonHover:hover {
    color: LightSkyBlue;
    float: left;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
    // font-weight: bold;
}

.el-tabs__nav-scroll {
    padding-left: 12px;
    background: #409eff;
}

.el-tabs__item {
    color: #fff;
    padding: 0px;
    height: 0px;
    line-height: 0px;
    opacity: 0.7;
}

.el-tabs__item.is-active {
    color: #fff;
    opacity: 1;
}

.el-icon-arrow-left {
    color: #fff;
    font-size: 14px;
}

.el-icon-arrow-right {
    color: #fff;
    font-size: 14px;
}

.el-tabs__nav-wrap.is-scrollable {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.el-tabs__nav-wrap {
    overflow: hidden;
    margin-bottom: -1px;
    position: relative;
}

.el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0;
    background-color: #e4e7ed;
    z-index: 1;
}

.el-tabs__active-bar {
    transition: all 0.3s;
    // border-right: 5px solid transparent;
    // border-left: 5px solid transparent;
    // border-bottom: 5px solid #fff;
}

.allView {
    height: 20px;
    // color: #;
    font-size: 20px;
    font-weight: bold;
    float: left;
    margin-left: 20px;
    cursor: pointer;
    position: relative;
    z-index: 999;
}

.cardRow {
    margin-top: 10px;
    margin-left: 10px;
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

/deep/ #myChart1 canvas {
    width: 300px !important;
    height: 200px !important;
    top: 8px !important;
}

/deep/ #myChart2 canvas {
    width: 300px !important;
    height: 200px !important;
    top: 8px !important;
}

/deep/ #myChart3 canvas {
    width: 300px !important;
    height: 200px !important;
    // top: 8px !important;
}

/deep/ #myChart4 canvas {
    width: 300px !important;
    height: 200px !important;
    top: 8px !important;
}
</style>
