<template>
    <div>
        <el-row style="margin-top:20px;" v-if="isMakeKey == 1">
            <el-col :span="12">
                <div style="margin-left:20px;color:#409EFF" class="boxStyle">生成密钥权限:
                    <i class="el-icon-circle-check iconStyle" style="" v-if="EnumUserList.allAdminStateslogin!=0"></i>
                    <i class="el-icon-circle-close iconStyle" style="color:#F56C6C" v-else></i>
                </div>
            </el-col>
            <el-col :span="12">
                <div style="margin-top:0px;color:#67C23A" class="boxStyle">管理员数目: {{EnumUserList.managerRegister}}, 已登录人数: {{EnumUserList.managerLogin}}。 操作员数目: {{EnumUserList.operatorRegister}}, 已登录人数: {{EnumUserList.operatorLogin}}。</div>
            </el-col>
        </el-row>
        <el-row v-else>
            <div style="margin-top:0px;color:#409EFF;border-left: 3px solid #4f7be2" class="boxStyle">管理员数目: {{EnumUserList.managerRegister}}, 已登录人数: {{EnumUserList.managerLogin}}。 操作员数目: {{EnumUserList.operatorRegister}}, 已登录人数: {{EnumUserList.operatorLogin}}。</div>
        </el-row>
    </div>
</template>
<script>
export default {
    props: {
        isMakeKey: {
            type: Number
        }
    },
    data() {
        return {
            EnumUserList: {},
            loginNum: 0,
            register: 0
        }
    },
    created() {
        this.getEnumUser()
    },
    mounted() {},
    methods: {
        getEnumUser() {
            this.$commonJs.getEnumUser().then((res) => {
                this.EnumUserList = res.data.data
                this.$emit("keyNum", this.EnumUserList.managerRegister)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.boxStyle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    // background: #f4f5f7;
    // border-left: 3px solid #4f7be2;
    padding-left: 10px;
    color: #e6a23c;
    font-weight: 500;
}
.iconStyle {
    margin-left: 5px;
    font-size: 20px;
}
</style>