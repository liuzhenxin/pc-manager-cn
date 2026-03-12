<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <!-- <router-link :to="{ path: '/certificateList' }"> -->
            <el-button size="mini" class="el-button1" type="warning" @click="cancel()" style="float: right;margin-bottom:15px">返回</el-button>
            <!-- </router-link> -->
        </el-card>
        <el-card class="intanle" v-loading="loading">
            <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <div>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="序列号:" label-width="21%">
                                <el-input class="inputwid" v-model="form.cert_sn" placeholder="请输入序列号" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="颁发者:" label-width="21%">
                                <el-input v-model="form.issuer" class="inputwid" placeholder="请输入颁发者" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="公钥算法:" label-width="21%">
                                <el-input class="inputwid" v-model="form.key_algorithm" placeholder="请输入公钥算法" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :offset="6">
                            <el-form-item label="有效期:" label-width="21%">
                                <el-input class="inputwid" v-model="form.not_before" placeholder="请输入有效期" :disabled="isDisable"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                </el-row>

                <el-col :span="12" :offset="6" style="margin-bottom:30px">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" @click="cancel" type="warning" style="margin-bottom:10px">取消</el-button>
                    </el-form-item>
                </el-col>
            </el-form>

        </el-card>
    </div>

</template>
<script>
import { JKunitrust } from "../../assets/js/JKunitrust.js"
export default {
    inject: ["reload"],
    components: {},
    data() {
        return {
            name: "",
            mode: this.$route.query.mode,
            certSn: this.$route.query.certSn,
            roleId: this.$route.query.roleId,
            isDisable: true,
            form: {
                id: "",
                key_algorithm: "", //  公钥算法
                not_before: "", // 证书有效期开始时间
                not_after: "", // 证书有效期结束时间
                issuer: "", // 颁发者
                serial_number: "" // 序列号
            },
            rules: {
                code: [
                    {
                        required: true,
                        message: "请输入版本",
                        trigger: "blur"
                    }
                ],

                issuer: [
                    {
                        required: true,
                        message: "请输入颁发者",
                        trigger: "blur"
                    }
                ]
            },
            id_cert_serial: "", // 序列号
            MiMaVal: "",
            id_con_select: [],
            g_cert: "",
            ukey: "",
            id_cert_date: "", // 有效期
            num: 1, // 防抖
            id_con_count: "", // 应用数量
            loading: false,
            organization_id: ""
        }
    },

    created() {
        this.organization_id = this.$commonJs.getStorage().organization_id
        //this.roleId = sessionStorage.getItem("certRoleId")
        this.getCertDetail()
        this.name = "证书详情"
    },
    mounted() {},
    methods: {
        // 获取详情
        getCertDetail() {
            this.loading = true
            this.$commonJs
                .getMethodData(this.$url.GetByCert, "POST", {
                    serial_number: this.certSn
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res.data.data, "res")
                        this.form = res.data.data
                        this.form.not_before =
                            this.form.not_before + "~" + this.form.not_after
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
        },
        cancel() {
            if (this.roleId != undefined) {
                this.$router.push({
                    name: "certificateList",
                    query: {
                        roleId: this.roleId
                    }
                })
            } else {
                this.$router.push("/certificateList")
            }
        }
    }
}
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
</style>
