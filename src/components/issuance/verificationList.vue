<template>
    <div class="navDetailItem" v-loading="loading">
        <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:30px">
            <el-tab-pane label="服务设置">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form ref="form" :model="form" label-width="300px">
                            <el-form-item label="服务名称">
                                <el-input v-model="form.nicName" placeholder="请输入服务名称" style="width:50%" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="服务端口">
                                <el-input v-model="form.newInet" placeholder="请输入服务端口" style="width:50%"></el-input>
                            </el-form-item>
                            <el-form-item label="是否运行">
                                <el-radio v-model="form.newNetmask" label="1">是</el-radio>
                                <el-radio v-model="form.newNetmask" label="2">否</el-radio>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="onSubmit">保存配置</el-button>
                                <el-button type="primary" size="mini" @click="modifyIP">启动服务</el-button>
                                <el-button size="mini" @click="formReset">停止服务</el-button>
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
            form: {
                nicName: "",
                newGateway: "", // 新网关
                newInet: "", // 新IP
                newNetmask: "1" // 新子网掩码
            },
            NicList: [],
            loading: false
        };
    },
    created() {
        this.onSubmit();
    },
    methods: {
        onSubmit() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.ShowNic, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.NicList = res.data.data;

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

        modifyIP() {
            this.$commonJs
                .getMethodData(this.$url.ModifyIP, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        // this.formTraceRouteRes = res.data.data;
                        console.log(res, "formTraceRoute");
                        this.onSubmit();
                    }
                });
        },
        handleClick(tab, event) {
            // let tabIndex = tab.label.split("服务设置")[1] - 1;
            // this.NicList.forEach((element) => {
            //     this.form.nicName = element;
            //     console.log(element, "element");
            //     this.getIpByNic(element);
            // });
            // console.log(tab.label, event, tabIndex, "999");
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
.box-card {
    height: 50px;
    line-height: 50px;
}
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}
</style>
