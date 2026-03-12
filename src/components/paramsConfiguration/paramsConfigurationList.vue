<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="6">
                    <span class="titleLabel" style="width:35px">名称:</span>
                    <el-input v-model="form.name" placeholder="请输入名称" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="6">
                    <span class="titleLabel" style="width:35px">编码:</span>
                    <el-input v-model="form.code" placeholder="请输入名称" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="12">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getParamsList">查询</el-button>
                </el-col>
            </el-row>
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="paramsList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="名称" prop="name">
                    <template slot-scope="scope">
                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="编码" prop="code"></el-table-column>
                <el-table-column label="参数键值" prop="val"></el-table-column>
                <el-table-column label="说明" prop="illustrate"></el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="操作">
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
                name: "", // 名称
                code: "",
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            paramsList: []
        };
    },
    created() {
        this.getParamsList();
    },
    methods: {
        // 查询列表
        getParamsList() {
            this.loading = true;
            // let data = form;
            this.$commonJs
                .getMethodData(this.$url.GetParamsList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.paramsList = res.data.page.receList;
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
                name: "", // 名称
                code: "",
                pageNow: 1,
                pageSize: 10
            };
            this.getParamsList();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getParamsList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getParamsList();
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/paramsConfigurationDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w");
            this.$router.push({
                path: "/paramsConfigurationDetail",
                query: {
                    mode: mode,
                    id: row.id
                }
            });
        },
        // 删除
        handleDelete(row) {
            console.log(row, "row");
            this.$confirm("是否永久删除此参数配置?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.GetdelParams, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!");
                                this.getParamsList();
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
</style>
