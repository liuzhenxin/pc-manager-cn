<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col>
                    <el-button size="mini" @click="jumpToInsert()" type="primary" icon="el-icon-plus">新增</el-button>
                    <!-- <el-button size="mini" @click="handleDelete1()" type="warning" icon="el-icon-delete">删除</el-button> -->
                </el-col>
            </el-row>
        </el-card>
        <!-- 列表 -->
        <el-card>
            <el-table :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" :data="menuList" style="width: 100%;margin-bottom: 20px;" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="type" label="菜单类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == '1'">菜单</span>
                        <span v-else-if="scope.row.type == '2'">目录</span>
                        <span v-else>按钮</span>
                    </template>
                </el-table-column>
                <el-table-column prop="path" label="URL"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == '1'" class="statusSuccess">启用</span>
                        <span v-else class="statusError">禁用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="icon" label="图标">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click.native.stop="xiangqing(scope.row,1,'insertChildren')" type="text" size="mini" class="el-icon-plus" style="color: #67C23A">增加子菜单</el-button>
                        <el-button @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                        <el-button @click.native.stop="handleDelete(scope.row)" type="text" size="mini" class="el-icon-delete" style="color: #da0909">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            icon: "",
            loading: false,
            total: 0,
            menuList: []
        };
    },
    created() {
        this.getmenuList();
    },
    methods: {
        // 查询列表
        getmenuList() {
            this.loading = true;
            this.$commonJs
                .getMethodData(this.$url.GetMenuTreeList, "POST", {
                    status: ""
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.menuList = res.data.data;
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                    console.log(res, "res");
                });
        },
        // 新增
        jumpToInsert() {
            this.$router.push({
                path: "/menuDetail",
                query: {
                    mode: 1
                }
            });
        },
        // 修改
        xiangqing(row, mode, type) {
            console.log(row, "w");
            this.$router.push({
                path: "/menuDetail",
                query: {
                    menuRow: JSON.stringify(row),
                    mode: mode,
                    id: row.id,
                    type: type
                }
            });
        },
        // 删除
        handleDelete(row) {
            console.log(row, "row");
            this.$confirm("是否永久删除此菜单?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(this.$url.GetdelMenu, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!");
                                this.getmenuList();
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
