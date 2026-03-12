<template>
    <div class="navItem" v-loading='loading'>
        <el-card>

            <el-row>
                <el-col :offset="1" style="margin-top:30px;margin-bottom:30px;">
                    <span class="titleLabel" style="width:35px;margin-right:10px">接入RA机构:</span>
                    <el-select v-model="RAdata" placeholder="请选择RA机构" class="searchInputClass">
                        <el-option v-for="item in RAList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            RAdata: "0",
            loading: false,
            RAList: [
                {
                    label: "内部RA",
                    value: "0"
                }
            ]
        };
    },
    methods: {}
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