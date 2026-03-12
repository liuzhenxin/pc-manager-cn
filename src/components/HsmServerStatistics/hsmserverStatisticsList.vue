<template>
    <div style="margin-top:-5px">
        <el-backtop></el-backtop>
        <el-row>
            <el-col>
                <el-card class="search">
                    <el-row>
                        <el-col :span="5">
                            <el-button type="success" size="mini" style="margin-left:15px;float:left;" @click="HSMServerExport">导出</el-button>
                        </el-col>
                    </el-row>
                </el-card>

                <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="hsmServerList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="字段名" prop="key_label"></el-table-column>
                <el-table-column label="名称" prop="key_name"></el-table-column>
                <el-table-column label="请求次数" prop="num"></el-table-column>
               
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
        </el-card>
               
            </el-col>
        </el-row>
    </div>
</template>

<script>
let Echarts = require("echarts") //基础实例 注意不要使用import
// require("echarts/lib/chart/bar") //按需引入 bar = 柱状图

export default {
    inject: ["reload"],
    data() {
        return {
           hsmServerList: [],
           loading: false
        }
    },
    mounted() {
        
    },
    watch: {},
    created() {
        this.getList()
    },

    methods: {
        getList() {
            this.loading=true
                this.$commonJs
                    .getMethodData(this.$url.HSMServerList, "POST", {
                    })
                    .then((res) => {
                        this.hsmServerList=res.data.data
                        this.loading=false
                    })
        },
        HSMServerExport() {
            this.$commonJs
                .downLoadMethodData(
                    this.$url.HSMServerExport,
                    "POST",{})
                .then((res) => {
                    const link = document.createElement("a")
                    try {
                        let blob = res.data //如果后台返回的直接是blob对象类型，直接获取数据
                        let _fileName = "HsmStatistics"
                        link.style.display = "none"
                        const url =
                            window.URL || window.webkitURL || window.moxURL
                        link.href = window.URL.createObjectURL(blob)
                        link.download = _fileName //下载的文件名称
                        link.click()
                        window.URL.revokeObjectURL(url) // #URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建E
                    } catch (e) {
                        this.$message.error("下载失败!")
                    }
                })
        }
    }
}
</script>

<style lang="less" scoped>

.el-card {
    color: #686e75;
    background: #fff;
}
.cardRow {
    margin-top: 10px;
    margin-left: 10px;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
    width: 6px;
    height: 10px;
    background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #ccc;
}
</style>
