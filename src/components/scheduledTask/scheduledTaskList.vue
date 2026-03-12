<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="4">
                    <span class="titleLabel" style="width:35px">名称:</span>
                    <el-input v-model="form.job_name" placeholder="请输入名称" class="searchInputClass"></el-input>
                </el-col>

                <el-col :span="20">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getJobList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增</el-button>
                    <!-- <el-button size="mini" @click="handleDelete1()" type="warning" icon="el-icon-delete">删除</el-button> -->
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="jobList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="名称">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">{{scope.row.job_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="编码" prop="code"></el-table-column>

                <el-table-column label="任务组名" prop="job_group"></el-table-column>
                <el-table-column label="请求类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.invoke_type=='10'">bean方法</span>
                        <span v-if="scope.row.invoke_type=='20'">http</span>
                    </template>
                </el-table-column>
                <el-table-column label="任务状态" prop="status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='1'">正常</span>
                        <span v-if="scope.row.status=='2'">暂停</span>
                    </template>
                </el-table-column>
                <el-table-column label="调用目标字符串" width="300" prop="invoke_target"></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column label="创建时间" prop="create_time" width="200"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                    </template>
                </el-table-column>
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
                job_name: "", //  角色名称
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            jobList: [],
            menuRoleId: ""
        };
    },
    created() {
        this.getJobList();
    },
    methods: {
        // 查询列表
        getJobList() {
            this.loading = true;
            // let data = form;
            this.$commonJs
                .getMethodData(this.$url.GetJobList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.jobList = res.data.page.receList;
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
                job_name: "", //  角色名称
                pageNow: 1,
                pageSize: 10
            };
            this.getJobList();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getJobList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getJobList();
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/scheduledTaskDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w");
            this.$router.push({
                path: "/scheduledTaskDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            });
        },
        // 删除
        handleDelete(row) {
            console.log(row, "row");
            this.$confirm("是否永久删除此条定时任务?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.GetJobDelOne, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!");
                                this.getJobList();
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
