<template>
    <div class="navDetailItem" v-loading="loading">
        <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:0px;" class="CardClass">
            <el-tab-pane label="系统信息">

                <el-card class="box-card cardHeader">
                    <div slot="header">
                        <span>服务器信息</span>
                    </div>
                    <div class="text item contextBody">
                        <el-table :data="tableData" border style="width: 100%" :header-cell-style="{
            'text-align': 'center',
            'font-size': '14px',
           
          }" :cell-style="{ 'text-align': 'center' }" stripe>
                            <el-table-column prop="date" label="参数"></el-table-column>
                            <el-table-column prop="name" label="值"></el-table-column>
                        </el-table>
                    </div>
                </el-card>
                <el-card class="box-card cardHeader">
                    <div slot="header">
                        <span>系统环境检测</span>
                    </div>

                    <div class="text item contextBody">
                        <el-table :data="tableData1" border style="width: 100%" :header-cell-style="{
            'text-align': 'center',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" stripe>
                            <el-table-column prop="date" label="参数"></el-table-column>
                            <el-table-column prop="name" label="要求"></el-table-column>
                            <el-table-column prop="status" label="实际状态"></el-table-column>

                        </el-table>
                    </div>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="数据源信息">
            </el-tab-pane>

        </el-tabs>
    </div>
</template>
<script>
export default {
    inject: ["reload"],
    props: {
        initNum: {
            type: Number
        }
    },
    data() {
        return {
            size: "small",
            form: {
                nicName: "",
                newGateway: "", // 新网关
                newInet: "", // 新IP
                newNetmask: "" // 新子网掩码
            },
            tableData: [
                {
                    date: "服务器操作系统",
                    name: "Linux"
                },
                {
                    date: "JDK版本",
                    name: "Java HotSpot(TM) 64-Bit Server VM 11.0.2"
                }
            ],
            tableData1: [
                {
                    date: "JDK版本",
                    name: "1.8.0",

                    status: "11.0.2"
                }
            ],
            NicList: [],
            loading: false
        };
    },
    created() {
        this.onSubmit(0);
    },
    mounted() {
        if (this.initNum == 1) {
            this.$(".CardClass").addClass("boxShadowNone");
        }
    },
    methods: {
        onSubmit(index) {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.ShowNic, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.NicList = res.data.data;
                        this.form.nicName = this.NicList[index];
                        this.getIpByNic(this.NicList[index]);
                        // this.formTraceRouteRes = res.data.data;
                        console.log(res, "formTraceRoute");
                        this.loading = false;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                        this.loading = false;
                    }
                });
            console.log("submit!");
        },
        getIpByNic(data) {
            this.$commonJs
                .getMethodData(this.$url.GetIpByNic, "POST", {
                    nicName: data
                })
                .then((res) => {
                    console.log(res.data.data, "GetIpByNic");
                    let dataList = res.data.data;
                    // dataList.ether = this.formnicName;
                    this.form.newGateway = dataList.gateway; // 新网关
                    this.form.newInet = dataList.inet; // 新IP
                    this.form.newNetmask = dataList.netmask; // 新子网掩码
                });
        },

        modifyIP(index) {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.ModifyIP, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "formTraceRoute");
                        this.onSubmit(index);
                        this.loading = false;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                        this.loading = false;
                        this.onSubmit(index);
                    }
                });
        },
        handleClick(tab, event) {
            let tabIndex = tab.label.split("网络")[1].split("配置")[0] - 1;
            this.form.nicName = this.NicList[tabIndex];
            this.getIpByNic(this.NicList[tabIndex]);

            console.log(tab.label, event, tabIndex, "999");
        },
        formReset() {
            this.form = {
                nicName: "",
                newGateway: "", // 新网关
                newInet: "", // 新IP
                newNetmask: "" // 新子网掩码
            };
        }
    }
};
</script>

<style lang="less" scoped>
// .box-card {
//     height: 50px;
//     line-height: 50px;
// }
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}
/deep/ .boxShadowNone {
    box-shadow: none !important;
    border: 1px solid #dcdfe6 !important;
    border-bottom: 0 !important;
    border-left: 0 !important;
    border-right: 0 !important;
}
/deep/ .cardHeader {
    border: 1px solid #ccc;
    margin-bottom: 20px;
    padding-bottom: 20px;
    .el-card__header {
        height: 40px;
        background: #ecf2ff !important;
        border-bottom: 1px solid #ccc;
        padding: 0 20px;
    }
    .contextBody {
        margin-left: 11px;
    }
}
</style>
