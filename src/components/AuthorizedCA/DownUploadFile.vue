<template>

    <div class="navItem" v-loading="loading">
        <el-card class="search" style="padding:4%">

            <!-- <div class="boxStyle"></div> -->
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :offset="5" :span="15">
                        <el-form-item label="组织机构:" label-width="140px" style="margin-left:-30px" prop="organization_id">
                            <el-cascader ref="cascaderHandle" :show-all-levels="false" :props="{ checkStrictly: true }" v-model="modifyForm.organizationArr" :options="organizationList" @change="handleChange" placeholder="请选择组织机构" style="width:75%"></el-cascader>
                        </el-form-item>

                        <el-form-item label="授权时间:" label-width="110px" prop="lictime">
                            <el-input style="width:75%" id="myInput" v-model="modifyForm.lictime" placeholder="请输入授权时间(单位: 天)" type="text">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="关联信息:" label-width="110px" prop="localMac">
                            <el-input style="width:75%" id="myInput" v-model="modifyForm.localMac" placeholder="请输入关联信息" type="text">
                            </el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :offset="10" style="padding-top:30px">
                        <el-button size="mini" type="primary" style="padding:5px 30px" @click="UploadFile('modifyForm')">生成授权文件</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>

</template>
<script>
export default {
    data() {
        return {
            modifyForm: {
                lictime: "",
                localMac: "",
                organization_id: "",
                organizationArr: []
            },
            loading: false,
            modifyRules: {
                lictime: [
                    {
                        required: true,
                        message: "请输入授权时间",
                        trigger: "blur"
                    }
                ],
                localMac: [
                    {
                        required: true,
                        message: "请输入关联信息",
                        trigger: "blur"
                    }
                ],
                organization_id: [
                    {
                        required: true,
                        message: "请选择组织机构",
                        trigger: "blur"
                    }
                ]
            },
            organizationList: []
        };
    },
    created() {
        this.getOrganizationTree();
    },

    methods: {
        UploadFile(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                this.loading = true;
                let data = this.$commonJs.getScreenValue(this.modifyForm);
                this.$delete(data, "organizationArr");
                this.$commonJs
                    .downLoadMethodData(this.$url.Setlicense, "POST", data)
                    .then((res) => {
                        // debugger;
                        console.log(
                            res,
                            res.headers["content-disposition"].split(
                                "filename="
                            )[1],
                            "resupdate"
                        );
                        const link = document.createElement("a");
                        try {
                            let blob = res.data; //如果后台返回的直接是blob对象类型，直接获取数据
                            let _fileName =
                                res.headers["content-disposition"].split(
                                    "filename="
                                )[1];
                            link.style.display = "none";
                            const url =
                                window.URL || window.webkitURL || window.moxURL;
                            link.href = window.URL.createObjectURL(blob);
                            link.download = _fileName; //下载的文件名称
                            link.click();
                            window.URL.revokeObjectURL(url); // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                            this.loading = false;
                        } catch (error) {
                            this.$message.error("下载失败!");
                            this.loading = false;
                        }
                    });
            });
        },

        getOrganizationTree(row) {
            this.$commonJs.GetOrgList().then((res) => {
                console.log(res, "组织机构");
                this.organizationList = res;
            });
        },
        handleChange(data) {
            this.$refs.cascaderHandle.dropDownVisible = false;
            this.modifyForm.organization_id = data[data.length - 1];
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
    margin-left: 12%;
    margin-bottom: 40px;
}
</style>
