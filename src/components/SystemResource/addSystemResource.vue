<template>
    <div>
        <el-card class="navDetailItem">
            <span class="h1">{{ name }}</span>
            <router-link :to="{ path: '/systemResourceList' }">
                <el-button size="mini" class="el-button1" type="warning" style="float: right;margin-bottom:15px">返回</el-button>
            </router-link>
        </el-card>
        <el-card class="intanle" v-loading="loading">
            <el-form ref="form" :model="form" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="6">
                        <el-form-item label="页面名称:" label-width="21%">
                            <el-input class="inputwid" v-model="form.page" placeholder="请输入页面名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="页面位置:" label-width="21%">
                            <el-input class="inputwid" v-model="form.position" placeholder="请输入页面位置" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="类型:" label-width="21%">
                            <el-radio v-model="form.type" label="10" :disabled="isDisable">文字</el-radio>
                            <el-radio v-model="form.type" label="20" :disabled="isDisable">图片</el-radio>
                            <el-radio v-model="form.type" label="30" :disabled="isDisable">html标签</el-radio>
                            <el-radio v-model="form.type" label="40" :disabled="isDisable">文件</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="工程名称:" label-width="21%">
                            <el-input class="inputwid" v-model="form.name" placeholder="请输入名称" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="编码:" label-width="21%">
                            <el-input class="inputwid" v-model="form.code" placeholder="请输入编码" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="内容:" label-width="21%">
                            <el-input class="inputwid" v-model="form.content" placeholder="请输入内容" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="样式:" label-width="21%" prop="remark">
                            <el-input type="textarea" class="inputwid" v-model="form.style" placeholder="请输入样式" :disabled="isDisable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="6" v-if="mode != 2">
                        <el-form-item label="图片:" label-width="21%">
                            <el-upload class="upload-demo" style="display:inline-block" :show-file-list="true" :headers="MyHeader" :action="actionUrl" multiple :on-change="changeFile" :on-success="handleSuccess">
                                <el-button style="" type="primary" size="mini" icon="l-icon-plus">上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label-width="10%" style="margin-top:20px;margin-left:13%;">
                        <el-button size="mini" type="primary" @click="onUpdate()" v-if="mode != 2" style="margin-bottom:10px">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-form>

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: "",
            mode: this.$route.query.mode,
            resourceId: this.$route.query.id,
            dictionary_id: this.$route.query.dictionary_id,
            type: this.$route.query.type,
            isDisable: false,
            radio: "",
            loading: false,
            dialogVisible: false,
            form: {
                page: "", // 页面
                position: "", // 位置
                type: "", // 类型 10:文字 20:图片 30:html标签 40:文件
                name: "", //  名称
                code: "", // 编码
                content: "", // 内容
                style: "" // 样式
            },
            MyHeader: { Authorization: "" },
            actionUrl: "",
            fileList: []
        }
    },

    created() {
        if (this.mode != 1) {
            this.getResourceDetail()
            if (this.mode == 3) {
                this.name = "修改资源"
            } else {
                this.isDisable = true
                this.name = "资源详情"
            }
        } else {
            this.name = "新增资源"
        }

        this.$nextTick(() => {
            this.$refs.form.resetFields()
        })
    },
    methods: {
        // 获取详情
        getResourceDetail() {
            this.loading = true
            let url = this.$url.ResourceGetById
            this.$commonJs
                .getMethodData(url, "POST", {
                    id: this.resourceId
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        console.log(res, "res")
                        this.form = res.data.data
                        this.loading = false
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                        this.loading = false
                    }
                })
        },

        cancel() {
            this.$router.push("/systemResourceList")
        },
        changeFile(file, fileList) {
            this.fileList = fileList
        },
        handleSuccess(response, file, fileList) {
            this.fileList = fileList
        },
        onUpdate() {
            let formData = new FormData()
            //   <!-- 将上传的文件放到数据对象中 -->
            formData.append("page", this.form.page)
            formData.append("position", this.form.position)
            formData.append("type", this.form.type)
            formData.append("name", this.form.name)
            formData.append("code", this.form.code)
            formData.append("content", this.form.content)
            formData.append("style", this.form.style)

            if (this.fileList[0]) {
                formData.append("file_param", this.fileList[0].raw)
            }
            let url
            if (this.mode == 3) {
                url = this.$url.ResourceUpd
                formData.append("id ", this.resourceId)
            } else {
                url = this.$url.ResourceAdd
            }
            this.$http
                .post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.$message.success("上传成功!")
                        this.cancel()
                    } else if (res.data.code != 800000) {
                        this.$message.error(res.data.msg)
                    }
                })
            this.loading = false
        }
    }
}
</script>
