<template>
    <div class="navDetailItem" v-loading="loading">
        <el-tabs type="border-card" @tab-click="handleClick" style="padding-bottom:0px;" class="CardClass">
            <el-tab-pane :label="'网络'+ + (index+1)  " v-for="(item,index) in NicList" :key=index>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form ref="form" :model="form" label-width="300px">
                            <el-form-item :label="'网络名称'">
                                <el-input v-model="form.name" style="width:50%" :placeholder="'请输入网络名称'" disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="'网络IP地址'">
                                <el-input v-model="form.inet" style="width:50%" :placeholder="'请输入网络IP地址'"></el-input>
                            </el-form-item>
                            <el-form-item :label="'网络子网掩码'">
                                <el-input v-model="form.mask" style="width:50%" :placeholder="'请输入网络子网掩码'"></el-input>
                            </el-form-item>
                            <el-form-item :label="'网络默认网关'">
                                <el-input v-model="form.gateway" style="width:50%" :placeholder="'请输入网络默认网关'"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <div style="margin-top:10px">
                                    <el-button type="primary" size="mini" @click="onSubmit(index)">{{'显示网络配置信息'}}</el-button>
                                    <el-button type="primary" size="mini" @click="modifyIP(index)">保存修改</el-button>
                                    <!-- <el-button size="mini" @click="formReset">重置</el-button> -->
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <div v-if="NicList.length==0" style="display: inline-grid; margin-bottom: 50px;display: flex;justify-content: center">
                <!-- <img style="margin-top: 50px" src="../../../public/img/empty.png" /> -->
                <el-empty description="暂无配置网络"></el-empty>
            </div>
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
            form: {
                name: "",
                gateway: "", // 新网关
                inet: "", // 新IP
                mask: "", // 新子网掩码
                mac: ""
            },
            NicList: [],
            loading: false
        }
    },
    created() {
        this.onSubmit(0)
    },
    mounted() {
        if (this.initNum == 1) {
            this.$(".CardClass").addClass("boxShadowNone")
        }
    },
    methods: {
        onSubmit(index) {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.ShowNic, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (res.data.data.length == 0) {
                            this.loading = false
                            this.$message.error("找不到网卡")
                            return
                        }
                        this.NicList = res.data.data
                        this.form.name = this.NicList[index].name
                        this.getIpByNic(this.NicList[index].name)
                        // this.formTraceRouteRes = res.data.data;

                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
        },
        getIpByNic(data) {
            this.$commonJs
                .getMethodData(this.$url.GetIpByNic, "POST", {
                    nicName: data
                })
                .then((res) => {
                    let dataList = res.data.data
                    // dataList.ether = this.formnicName;
                    this.form.gateway = dataList.gateway // 新网关
                    this.form.inet = dataList.inet // 新IP
                    this.form.mask = dataList.mask // 新子网掩码
                })
        },

        modifyIP(index) {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.ModifyIP, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.onSubmit(index)
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                        this.onSubmit(index)
                    }
                })
        },
        handleClick(tab, event) {
            let tabIndex = tab.label.split("网络")[1].split("配置")[0] - 1
            this.form.name = this.NicList[tabIndex].name
            this.getIpByNic(this.NicList[tabIndex].name)
        },
        formReset() {
            this.form = {
                name: "",
                newGateway: "", // 新网关
                inet: "", // 新IP
                mask: "", // 新子网掩码
                mac: ""
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
/deep/ .boxShadowNone {
    box-shadow: none !important;
    border: 1px solid #dcdfe6 !important;
    border-bottom: 0 !important;
    border-left: 0 !important;
    border-right: 0 !important;
}
/deep/ .el-empty__description p {
    font-size: 16px;
}
</style>
