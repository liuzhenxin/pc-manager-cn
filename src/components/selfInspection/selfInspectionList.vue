<template>
    <div class="navItem" v-loading='loading'>
        <el-card>
            <div style="margin-top:20px;" class="boxStyle">本页面可以执行设备自检，查看自检情况。</div>
            <div style="margin-bottom:30px;margin-top:30px">
                <el-button type="primary" size="mini" icon="el-icon-video-play" @click="addSelf">设备自检</el-button>
                <!-- <el-button type="primary" plain size="mini" icon="el-icon-upload" @click="uploadSelf">下载自检文件</el-button> -->
            </div>
            <div style="margin-bottom:30px" v-if="isShow == 1">
                <div class="isSuccess"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px"></i>全部检测通过</div>
                <div class="isSuccess"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px"></i>随机数自检成功</div>
                <div class="isSuccess"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px"></i>密码算法自检成功</div>
                <!-- <div class="isSuccess"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px"></i>密钥完整性自检成功</div> -->
                <div class="isSuccess"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px"></i>数据完整性自检成功</div>
                <div class="isSuccess"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px"></i>软固件完整性自检成功</div>
            </div>
            <div style="margin-bottom:30px" v-if="isShow == 2">
                <div class="isSuccess1"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px"></i>全部检测未通过</div>
                <div class="isSuccess1"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px"></i>随机数自检失败</div>
                <div class="isSuccess1"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px"></i>密码算法自检失败</div>
                <!-- <div class="isSuccess"><i class="el-icon-circle-check" style="color:#67C23A;font-size:20px;margin-right:10px"></i>密钥完整性自检成功</div> -->
                <div class="isSuccess1"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px"></i>数据完整性自检失败</div>
                <div class="isSuccess1"><i class="el-icon-circle-close" style="color:#F56C6C;font-size:20px;margin-right:10px"></i>软固件完整性自检失败</div>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isShow: 0,
            loading: false
        }
    },
    methods: {
        addSelf() {
            // this.$commonJs.getLoading();
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.deviceSelfTest, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.isShow = 1
                    } else {
                        this.isShow = 2
                    }
                    this.loading = false
                    // this.$commonJs.getCloseLoading();
                })
        },
        uploadSelf() {}
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
.isSuccess {
    padding-left: 50px;
    margin-top: 10px;
    width: 300px;
    height: 50px;
    line-height: 50px;
    color: #67c23a;
    background: #3ac26a0d;
}
.isSuccess1 {
    padding-left: 50px;
    margin-top: 10px;
    width: 300px;
    height: 50px;
    line-height: 50px;
    color: #f56c6c;
    background: #f56c6c14;
}
</style>