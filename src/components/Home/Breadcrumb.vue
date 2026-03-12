<template>
    <el-card>
        <div style="margin:15px">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item, index) in $route.meta.breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

    </el-card>

</template>

<script>
export default {
    name: "Breadcrumb",
    data() {
        return {};
    }
};
</script>

<style scoped>
</style>
