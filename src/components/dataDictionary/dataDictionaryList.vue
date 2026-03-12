<template>
    <div class="navItem">
        <el-card class="search">
            <el-row>
                <el-col :span="4">
                    <span class="titleLabel" style="width:35px">名称:</span>
                    <el-input v-model="form.name" placeholder="请输入名称" class="searchInputClass"></el-input>
                </el-col>
                <!-- <el-col :span="5">
                    <span class="titleLabel">联系方式:</span>
                    <el-input v-model="form.tel" placeholder="请输入联系方式" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="5">
                    <span class="titleLabel">账号:</span>
                    <el-input v-model="form.username" placeholder="请输入账号" class="searchInputClass"></el-input>
                </el-col>
                <el-col :span="6">
                    <span class="titleLabel">类型:</span>
                    <el-select v-model="form.type" placeholder="请选择类型">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col> -->
                <el-col :span="20">
                    <el-button type="warning" size="mini" style="margin-left:5px;float:right;" @click="resultList">重置</el-button>
                    <el-button type="primary" size="mini" style="margin-left:15px;float:right;" @click="getDictionaryList">查询</el-button>
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
            <el-table ref="multipleTable" v-loading="loading" :data="dictionaryList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe row-key="code" :tree-props="{children: 'children'}">
                <el-table-column label="名称">
                    <template slot-scope="scope">
                        <span @click="xiangqing(scope.row,2)" style="color: #1890ff;cursor:pointer">{{scope.row.name}}</span>
                    </template>
                </el-table-column>


                <el-table-column label="编码" prop="code"></el-table-column>

                <el-table-column label="字典键值" prop="val"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='1'">正常</span>
                        <span v-if="scope.row.status=='0'">停用</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.children != undefined " @click.native.stop="xiangqing(scope.row,1,'isProject')" type="text" size="mini" class="el-icon-plus" style="color: #1890ff">新增项目</el-button>
                        <el-button v-if="scope.row.children != undefined " @click.native.stop="xiangqing(scope.row,3)" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
                        <el-button v-else @click.native.stop="xiangqing(scope.row,3,'isProject')" type="text" size="mini" class="el-icon-edit" style="color: #1890ff">修改</el-button>
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
                name: "", //  角色名称
                pageNow: 1,
                pageSize: 10
            },
            loading: false,
            total: 0,
            dictionaryList: [],
            menuRoleId: ""
        };
    },
    created() {
        this.getDictionaryList();
    },
    methods: {
        // 查询列表
        getDictionaryList() {
            this.loading = true;
            // let data = form;
            this.$commonJs
                .getMethodData(this.$url.GetDictionaryList, "POST", this.form)
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.total = res.data.page.totalRows;
                        res.data.page.receList.forEach((item, index) => {
                            item.children = item.sysDictionaryItemList;
                        });
                        this.dictionaryList = res.data.page.receList;
                        console.log(this.dictionaryList, "this.dictionaryList");
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
                name: "", //  角色名称
                pageNow: 1,
                pageSize: 10
            };
            this.getDictionaryList();
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize) {
            this.form.pageSize = newSize;
            this.getDictionaryList();
        },
        /* 监听页码值改变的事件 */
        handleCurrentChange(newPage) {
            this.form.pageNow = newPage;
            this.getDictionaryList();
        },
        // 新增
        jumpToInsert(type) {
            this.$router.push({
                path: "/dataDictionaryDetail",
                query: {
                    mode: 1,
                    type: type
                }
            });
        },
        // 修改
        xiangqing(row, mode, type) {
            console.log(row, "w");
            this.$router.push({
                path: "/dataDictionaryDetail",
                query: {
                    mode: mode,
                    id: row.id,
                    dictionary_id: row.dictionary_id,
                    type: type
                }
            });
        },
        // 删除
        handleDelete(row) {
            let url, name;
            if (row.sysDictionaryItemList != undefined) {
                url = this.$url.GetDictionaryDelOne;
                name = "数据字典";
            } else {
                url = this.$url.GetDictionaryItemDelOne;
                name = "字典项目";
            }
            console.log(row, "row");
            this.$confirm("是否永久删除此" + name + "?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$commonJs
                        .getMethodData(url, "POST", {
                            id: row.id
                        })
                        .then((res) => {
                            if (res.data.code == 100000) {
                                this.$message.success("删除成功!");
                                this.getDictionaryList();
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
