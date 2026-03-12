<template>
    <div class="navItem">
        <el-card>
            <div style="margin-top:20px;" class="boxStyle">本页可以上传升级包对密码设备执行升级操作，并可以回滚为备份版本。</div>
            <div style="margin-bottom:30px;margin-top:30px">
                <el-button type="primary" size="mini" icon="el-icon-upload" @click="uploadUpgrade">上传升级包</el-button>
                <el-button type="primary" size="mini" icon="el-icon-top" @click="Upgrade">升级</el-button>
                <el-button type="primary" size="mini" icon="el-icon-refresh-left" @click="rollBACK">回滚</el-button>
            </div>
            <div style="margin-top:30px;margin-left:50px;font-weight:bold">
                <span class="titleLabel" style="width:75px">升级信息</span>
            </div>
            <div style="margin-top:10px;margin-left:100px;">
                <span class="titleLabel" style="width:100px">-->版本信息</span>
            </div>
            <div style="margin-top:10px;margin-left:100px;margin-bottom:30px;">
                <span class="titleLabel" style="width:100px">当前版本:5.00.0003</span>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    methods: {
        uploadUpgrade() {
            this.$alert("上传升级包成功.", "信息", {
                confirmButtonText: "确定",
                type: "success"
            });
        },
        Upgrade() {},
        rollBACK() {}
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