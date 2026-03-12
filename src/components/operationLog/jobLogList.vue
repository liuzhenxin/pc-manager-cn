<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="4">
                    <span class="titleLabel" style="width:35px">名称:</span>
                    <el-input v-model="form.job_name" placeholder="请输入名称" class="searchInputClass" style="width:80%"></el-input>
                </el-col>

                <el-col :span="20">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getJobLogList">查询</el-button>
                </el-col>
            </el-row>


        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="jobLogList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="名称">
                    <template slot-scope="scope">
                        <!-- <span style="color: #1890ff;cursor:pointer"> -->
                        {{scope.row.job_name}}
                        <!-- </span> -->
                    </template>
                </el-table-column>
                <el-table-column label="任务组名" prop="job_group"></el-table-column>
                <!-- <el-table-column label="请求类型" prop=""></el-table-column> -->
                <el-table-column label="任务状态" prop="status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='1'" class="statusSuccess">正常</span>
                        <span v-if="scope.row.status=='2'" class="statusError">暂停</span>
                    </template>
                </el-table-column>
                <el-table-column label="日志信息" width="300" prop="job_message"></el-table-column>
                <el-table-column label="调用目标字符串" width="400" prop="invoke_target"></el-table-column>
                <!-- <el-table-column label="备注" prop="remark"></el-table-column> -->
                <el-table-column label="创建时间" prop="create_time" width="200"></el-table-column>
                <!-- <el-table-column label="操作">
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
                job_name: "", // 同步状态
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            jobLogList: [],
            menuRoleId: ""
        };
    },
    created() {
        this.getJobLogList();
    },
    methods: {
        // 查询列表
        getJobLogList() {
            // let data = form;
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.GetJobLogList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.jobLogList = res.data.page.receList;
                        this.total = res.data.page.totalRows;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                    console.log(res, "res");
                });
        },

        // 重置搜索框
        resultList() {
            this.form = {
                job_name: "",
                pageNow: 1,
                pageSize: 10
            };
            this.getJobLogList();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getJobLogList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getJobLogList();
        },

        // 删除
        handleDelete(row) {
            console.log(row, "row");
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
                                this.getJobLogList();
                                console.log(res, "res");
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg);
                            }
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
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
