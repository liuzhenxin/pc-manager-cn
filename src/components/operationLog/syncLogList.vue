<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="8">
                    <span class="titleLabel" style="width:93px">同步状态:</span>
                    <el-radio label="1" v-model="form.sync_status" style="margin-left:10px">成功</el-radio>
                    <el-radio label="0" v-model="form.sync_status">失败</el-radio>
                </el-col>

                <el-col :span="16">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getNtpSyncLogList">查询</el-button>
                </el-col>
            </el-row>

        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="ntpSyncLogList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="NTPIP">
                    <template slot-scope="scope">
                        <!-- <span style="color: #1890ff;cursor:pointer"> -->
                        {{scope.row.ntp_ip}}
                        <!-- </span> -->
                    </template>
                </el-table-column>
                <el-table-column label="同步状态" prop="sync_status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sync_status=='1'" class="statusSuccess">成功</span>
                        <span v-if="scope.row.sync_status=='0'" class="statusError">失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="NTP服务时间" prop="ntp_time"></el-table-column>
                <el-table-column label="日志时间" prop="log_time"></el-table-column>
                <el-table-column label="同步时系统时间" prop="system_time"></el-table-column>
                <!-- <el-table-column label="操作" width="300">
                    <template slot-scope="scope"  >
                        <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                    </template>
                </el-table-column> -->
                <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
                    <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
                    <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
                </div>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNow" :page-sizes="[10, 20, 50]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                sync_status: "1", // 同步状态
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            ntpSyncLogList: [],
            menuRoleId: ""
        };
    },
    created() {
        this.getNtpSyncLogList();
    },
    methods: {
        // 查询列表
        getNtpSyncLogList() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.GetNtpSyncLoglist, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.ntpSyncLogList = res.data.page.receList;
                        // this.ntpSyncLogList = res.data1.rece;

                        this.total = res.data.page.totalRows;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                });
        },

        // 重置搜索框
        resultList() {
            this.form = {
                sync_status: "1",
                pageNow: 1,
                pageSize: 10
            };
            this.getNtpSyncLogList();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getNtpSyncLogList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getNtpSyncLogList();
        },

        // 删除
        handleDelete(row) {
            this.$confirm("是否永久此条时间同步日志?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.GetNtpSyncLogDelOne, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!");
                                this.getNtpSyncLogList();
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                })
                .catch((err) => err);
        }
    }
};
</script>

<style lang="less" scoped>
.box-card {
    height: 50px;
    line-height: 50px;
}
.searchInputClass {
    width: 60%;
    margin-left: 5px;
}
// 防止勾选多选框 子节点上移
/deep/ .el-tree-node .el-tree-node__content .el-radio {
    line-height: 50px;
}
/deep/ .el-tree-node__content {
    height: 50px !important;
}
</style>
