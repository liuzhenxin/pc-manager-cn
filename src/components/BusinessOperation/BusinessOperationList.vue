<template>
    <div class="navItem">

        <commonAdmin :roleCode="roleCode" :roleSystemType="roleSystemType"></commonAdmin>

    </div>
</template>
<script>
import commonAdmin from "../commonAdmin/commonAdminList.vue";
export default {
    inject: ["reload"],
    components: { commonAdmin },

    data() {
        return {
            roleCode: "80030004",
            roleSystemType: "30"
        };
    },
    created() {},
    methods: {
        // 查询列表
    }
};
</script>

<style lang="less" scoped>
</style>
