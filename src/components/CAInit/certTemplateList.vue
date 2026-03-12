<template>
    <div class="navItem">
        <el-card>
            <el-row :gutter="20" style="margin-bottom:100px">
                <el-col :span="18" :offset="3">
                    <div class="fontHeader">证书模板初始化</div>
                    <el-table ref="userLoginTable" style="margin-top:30px;margin-bottom:50px" v-loading="loading" :data="userLoginList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
            }" :cell-style="{ 'text-align': 'center' }" border stripe>
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="模板名称" prop="roleStatus"> </el-table-column>
                        <el-table-column label="模板文件名" prop="adminRole"> </el-table-column>
                        <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                            <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                            <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                        </div>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
import $ from "jquery";

export default {
    data() {
        return {
            userLoginList: [
                {
                    roleStatus: "根ca证书模板",
                    adminRole: "certprofile-rootca.json"
                },
                {
                    roleStatus: "子ca证书模板",
                    adminRole: "certprofile-subca.json"
                },
                {
                    roleStatus: "通用证书模板",
                    adminRole: "certprofile-general.json"
                },
                {
                    roleStatus: "邮件安全证书(SMIME)",
                    adminRole: "certprofile-smime.json"
                },
                {
                    roleStatus: "签名证书模板",
                    adminRole: "certprofile-sign.json"
                },
                {
                    roleStatus: "加密证书模板",
                    adminRole: "certprofile-enc.json"
                }
            ],
            loading: false
        };
    },
    created() {
        this.getList();
    },
    mounted() {},
    methods: {
        getList() {
            this.$commonJs.getLoading();
            this.$commonJs
                .getMethodData(this.$url.GetEnumUser, "POST", {})
                .then((res) => {
                    this.$commonJs.getCloseLoading();
                });
        }
    }
};
</script>
<style lang="less" scoped>
.fontHeader {
    font-size: 30px;
    border-bottom: 1px solid #ccc;
    margin: 20px 0;
    padding-bottom: 20px;
}
</style>