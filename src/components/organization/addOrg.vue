<template>
    <div>
        <el-row>
            <el-col :span="9" style="margin-bottom:0px;margin-left:0px;">
                <span style="margin-left: -16px;margin-right: 4px;color:#F56C6C" v-if="detail==1">*</span>
                <span class="demonstration" :style="{'margin-right':detail==1?'11px':'5px','letter-spacing': detail==1?'1px':''}">组织机构:</span>
                <!-- <span class="titleLabel" style="width:35px">姓名:</span> -->
                <el-cascader class="searchInputClass" :disabled="isDisable" ref="cascaderHandle" :show-all-levels="false" :props="{ checkStrictly: true }" v-model="organizationArr" :options="organizationList" @change="handleChange" placeholder="请选择组织机构" style="width:60%"></el-cascader>
                <!-- <span class="titleLabel" style="width:70px;" :style="{'margin-right':detail==1?'11px':'5px','letter-spacing': detail==1?'1px':''}">组织机构:</span>
                <el-input disabled @click.native.stop="getOrganizationTree" v-model="form.organizationFatherName" placeholder="请选择组织机构" style="width:60%" class="disabledInput"></el-input> -->
            </el-col>
        </el-row>

    </div>
</template>
<script>
export default {
    props: {
        detail: {
            type: Number
        },
        organizationId: {
            type: Number
        },
        isDisable: {
            type: Boolean
        }
    },
    data() {
        return {
            organizationArr: [],
            organizationList: [],
            form: {
                organizationFatherName: ""
            }
        };
    },
    watch: {
        organizationId(val) {
            if (this.organizationId != 0) {
                this.getOrganizationList();
            }
        }
    },
    created() {
        this.getOrganizationList("click");
    },
    mounted() {
        if (this.isDisable != true) {
            this.$(".disabledInput").addClass("disabledPointer");
        }
    },
    methods: {
        getOrganizationTree() {
            if (this.isDisable == true) {
                return;
            }
            this.getOrganizationList("click");
        },
        handleChange(data) {
            this.$refs.cascaderHandle.dropDownVisible = false;
            // this.form.organization_id = data[data.length - 1];
            this.$emit("organization_id", data[data.length - 1]);
        },

        getOrganizationList(type) {
            this.$commonJs.GetOrgList().then((res) => {
                console.log(res, "组织机构");
                this.organizationList = res;
                this.organizationArr = this.$commonJs.getFatherData(
                    res,
                    (data) => data.value == this.organizationId
                );
            });
        },
        getOrgData(data, newArr) {
            data.map((item, index) => {
                newArr.push({
                    value: item.id,
                    label: item.name
                });
                if (item.children != undefined) {
                    newArr[index].children = [];
                    this.getOrgData(item.children, newArr[index].children);
                }
            });
            this.organizationList = newArr;
        }
    }
};
</script>
<style lang="less" scoped>
/deep/ .disabledPointer.el-input.is-disabled .el-input__inner {
    cursor: pointer !important;
}
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
</style>