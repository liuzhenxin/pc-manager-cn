<template>
    <div class="navItem">
        <el-card class="search">
            <el-row style="margin-top:15px;">
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table ref="multipleTable" v-loading="loading" :data="resouceList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
                <el-table-column label="工程名称">
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor:pointer" @click="xiangqing(scope.row,2)">
                            <span>
                                {{scope.row.name}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="页面" prop="page"></el-table-column>
                <el-table-column label="位置" prop="position"></el-table-column>
                <el-table-column label="编码" prop="code"></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <span style="" v-if="scope.row.type =='10'">文字</span>
                        <span style="" v-else-if="scope.row.type =='20'">图片</span>
                        <span style="" v-else-if="scope.row.type =='30'">html标签</span>
                        <span style="" v-else-if="scope.row.type =='40'">文件</span>
                    </template>
                </el-table-column>
                <el-table-column label="内容" prop="content"></el-table-column>
                <el-table-column label="样式" prop="style"></el-table-column>
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
                pageNow: 1,
                pageSize: 20
            },
            loading: false,
            total: 10,
            resouceList: [],
            menuRoleId: ""
        }
    },
    created() {
        this.getResourceList()
    },
    methods: {
        // 查询列表
        getResourceList() {
            this.loading = true
            // let data = form;
            this.$commonJs
                .getMethodData(this.$url.ResourceList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.resouceList = res.data.page.receList
                        this.total = res.data.page.totalRows
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                    this.loading = false
                    console.log(res, "res")
                })
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize
            this.getResourceList()
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage
            this.getResourceList()
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/addSystemResource",
                query: {
                    mode: 1
                }
            })
        },
        // 修改
        xiangqing(row, mode) {
            console.log(row, "w")
            this.$router.push({
                path: "/addSystemResource",
                query: {
                    mode: mode,
                    id: row.id
                }
            })
        },
        // 删除
        handleDelete(row) {
            console.log(row, "row")
            this.$confirm("是否永久删除资源?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.ResourceDelOne, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!")
                                this.getResourceList()
                                console.log(res, "res")
                            } else if (res.data.code != 800000) {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    })
                })
        }
    }
}
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
