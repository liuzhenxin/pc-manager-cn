<template>
    <div v-loading="loading">
        <el-card class="cardStyle">
            <el-row style="margin-left:5.5%">
                <el-col :span="4" class="leftTitle">目标机器IP地址</el-col>
                <el-col :span="10">
                    <el-input class="inputwid" style="width:80%;margin-right:10px" v-model="form.ipStr" placeholder="请输入服务IP"></el-input>
                </el-col>
                <el-col :span="10" class="leftTitle">
                    <el-button type="primary" @click="synchronization()">同步</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
import { number } from "echarts"
import $ from "jquery"
export default {
    components: {},
    props: {},
    data() {
        return {
            loading: false,
            form: {
                ipStr: ""
            }
        }
    },
    created() {},
    methods: {
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
/deep/ .el-dialog {
    height: 300px;
    margin-top: 23vh !important;
    padding: 0 !important;
    border-radius: 5px !important;
    .el-dialog__body {
        padding: 0px 16px !important;
        padding-top: 5px !important;
    }
    .el-dialog__header {
        padding: 13px 15px 10px !important;
    }
}
/deep/ .colorStyle .el-input__inner {
    color: #d0cdcd;
}
.dialogDiv {
    text-align: center;
}
@media screen and (min-width: 1600px) {
    .cardStyle {
        font-size: 18px;
        line-height: 50px !important;
    }
}
@media screen and (max-width: 1600px) {
    .cardStyle {
        font-size: 14px;
        line-height: 30px !important;
        padding-right: 29px;
    }
}
.cardStyle {
    padding-bottom: 20px;
    margin-bottom: 20px;
    padding-top: 20px;
    // font-size: 22px;
    margin-right: 10px;
    // line-height: 50px !important;
    border: 1px solid #d3dae2;
}
.cardRow {
    margin-top: 10px;
    margin-left: 10px;
}
</style>