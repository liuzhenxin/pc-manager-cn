<template>
    <div class="borderTitle1" v-if="type=='1'">
        <span style="">{{ title }}</span>
        <slot></slot>
    </div>
    <div class="borderTitle2" v-else>
        <span style="">{{ title }}</span>
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: () => {
                return ''
            }
        }, type: {
            type: String
        }
    }
}
</script>
<style lang="less" scoped>
.borderTitle1 {
    position: relative;
    border: 3px double rgb(194, 202, 204);
    border-radius: 4px;
    padding: 20px;
    margin: 10px;

    >span {
        position: absolute;
        left: 20px;
        top: -15px;
        width: 80px;
        text-align: center;
        font-size: 16px;
        color: goldenrod;
        font-weight: 900;
        background: #fff;
    }
}
.borderTitle2 {
    position: relative;
    border: 5px double powderblue;
    border-radius: 4px;
    padding: 20px;
    margin: 10px;

    >span {
        position: absolute;
        left: 20px;
        top: -15px;
        width: 80px;
        text-align: center;
        font-size: 16px;
        color: goldenrod;
        font-weight: 900;
        background: #fff;
    }
}
</style>