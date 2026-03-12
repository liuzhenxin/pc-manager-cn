<template>
    <div class="navItem">
        <el-card>
            <el-row :gutter="20">
                <el-col :span="12" :offset="6">
                    <div class="fontHeader">CA初始化配置平台</div>
                    <el-card class="box-card cardHeader">
                        <div slot="header">
                            <span>CA根证书初始化</span>
                        </div>
                        <div class="text item contextBody">
                            初始化根证书，可以是自签根，也可以产生请求后由其他CA签发后导入。
                        </div>
                    </el-card>
                    <el-card class="box-card cardHeader">
                        <div slot="header" class="clearfix">
                            <span>证书模板初始化</span>
                        </div>
                        <div class="text item contextBody">
                            初始化CA系统使用的模板。
                        </div>
                    </el-card>
                    <el-card class="box-card cardHeader">
                        <div slot="header" class="clearfix">
                            <span>服务器证书初始化</span>
                        </div>
                        <div class="text item contextBody">
                            初始化CA系统使用的服务器证书。
                        </div>
                    </el-card>
                    <el-card class="box-card cardHeader">
                        <div slot="header" class="clearfix">
                            <span>超级管理员证书初始化</span>
                        </div>
                        <div class="text item contextBody">
                            初始化CA系统使用的超级管理员证书。
                        </div>
                    </el-card>
                    <el-card class="box-card cardHeader" style="margin-bottom:100px">
                        <div slot="header" class="clearfix">
                            <span>审计管理员证书初始化</span>
                        </div>
                        <div class="text item contextBody">
                            初始化CA系统使用的审计管理员证书。
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>


    </div>
</template>
<script>
export default {
    inject: ["reload"],

    data() {
        return {};
    },
    created() {
        this.$commonJs.getLoading();
        setTimeout(() => {
            this.$commonJs.getCloseLoading();
        }, 1000);
    },
    methods: {
        getLogin() {
            if (this.pinContent6 == "") {
                this.$message.error("请输入PIN口令");
                return false;
            }
            this.$commonJs
                .getMethodData(this.$url.AddUser, "POST", {
                    // pucPasswordStr - 用户口令, 固定 16 字节
                    pucPasswordStr: this.pinContent6,
                    // uiUserIndex - 用户索引
                    uiUserIndex: "1",
                    // uiUserType *用户类型
                    uiUserType: "2"
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.isLogin = true;
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
    background: #f4f5f7;
    border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #67c23a;
    font-weight: 500;
}
.fontStyle {
    margin-top: 10px;
    font-size: 14px;
    width: 100%;
    line-height: 30px;
    // height: 32px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5f5;
    margin-bottom: 10px;
}
.fontHeader {
    font-size: 30px;
    border-bottom: 1px solid #ccc;
    margin: 20px 0;
    padding-bottom: 20px;
}
/deep/ .cardHeader {
    border: 1px solid #ccc;
    margin-bottom: 20px;
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