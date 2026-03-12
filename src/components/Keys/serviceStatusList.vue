<template>
    <div class="navItem" v-loading="loading">
        <el-card>
            <!-- <div style="margin-top:20px;" class="boxStyle">本页可以上传升级包对密码设备执行升级操作，并可以回滚为备份版本。</div>
            <div style="margin-bottom:30px;margin-top:30px">
                <el-button type="primary" size="mini" icon="el-icon-upload" @click="uploadUpgrade">上传升级包</el-button>
                <el-button type="primary" size="mini" icon="el-icon-top" @click="Upgrade">升级</el-button>
                <el-button type="primary" size="mini" icon="el-icon-refresh-left" @click="rollBACK">回滚</el-button>
            </div> -->
            <div style="margin-top:30px;margin-left:100px;font-weight:bold">
                <span class="titleLabel" style="width:75px">服务名称:</span>
                <span class="titleLabel" style="margin-left:20px;">密码机</span>
            </div>
            <div style="margin-top:10px;margin-left:100px;font-weight:bold">
                <span class="titleLabel" style="width:100px">是否运行</span>
                <span style="margin-left:20px;" v-if="isRunning==true"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px"></i>是</span>
                <span style="margin-left:20px;" v-if="isRunning==false"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px"></i>否</span>
            </div>
            <div style="margin-bottom:30px;margin-top:30px;margin-left:100px">
                <el-button type="primary" size="mini" icon="el-icon-refresh" @click="uploadUpgrade">重启服务</el-button>
                <el-button type="primary" size="mini" icon="el-icon-top" @click="Upgrade" :disabled="isRunning">启动服务</el-button>
                <el-button type="primary" size="mini" icon="el-icon-video-pause" @click="rollBACK" :disabled="!isRunning">停止服务</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isRunning: true,
            loading: false
        };
    },
    created() {
        this.getStatus();
    },
    methods: {
        uploadUpgrade() {
            this.$commonJs
                .getMethodData(this.$url.ServiceRestart, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.$alert("重启服务成功.", "信息", {
                            confirmButtonText: "确定",
                            type: "success"
                        }).then(() => {
                            this.getStatus();
                        });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        getStatus() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.IsServerOpen, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        // this.$alert("重启服务成功.", "信息", {
                        //     confirmButtonText: "确定",
                        //     type: "success"
                        // });
                        this.isRunning = res.data.data;
                    } else if (res.data.code != 800000) {
                        this.isRunning = false;
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                });
        },
        Upgrade() {
            this.$commonJs
                .getMethodData(this.$url.ServiceStart, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");
                        this.$alert("启动服务成功.", "信息", {
                            confirmButtonText: "确定",
                            type: "success"
                        }).then(() => {
                            this.getStatus();
                        });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        rollBACK() {
            this.$commonJs
                .getMethodData(this.$url.ServiceStop, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res");

                        this.$alert("停止服务成功.", "信息", {
                            confirmButtonText: "确定",
                            type: "success"
                        }).then(() => {
                            this.getStatus();
                        });
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                });
        }
    }
};
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