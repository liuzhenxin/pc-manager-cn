<template>
    <div>
        <el-dialog :title="title" :visible.sync="modifyFormdialog" width="30%" :before-close="handleClose">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-position="right" label-width="21%" style="margin-bottom:20px">
                <el-row :gutter="20">
                    <el-col>
                        <el-form-item :label="PIN" label-width="170px" prop="PINStr" style="margin-left:-10px">
                            <el-input style="width:75%" v-model="modifyForm.PINStr" placeholder="请输入口令" prefix-icon="el-icon-lock" :type="flag3 ? 'password' : 'text'">
                                <!-- <i slot="suffix" :class="[flag3 ? 'el-icon-minus' : 'el-icon-view']" style="margin-top: 8px; font-size: 18px" autocomplete="auto" @click="flag3 = !flag3"></i> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleClose('modifyForm')">取 消</el-button>
                <el-button size="mini" type="primary" @click="addPINStr('modifyForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        isOpen: {
            typeof: Boolean
        }
    },
    data() {
        return {
            modifyFormdialog: false,
            modifyForm: {
                PINStr: ""
            },
            title: "请输入口令",
            PIN: "PIN",
            flag3: true,
            modifyRules: {
                PINStr: [
                    {
                        required: true,
                        message: "请输入口令",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        handleClose() {
            this.$refs.modifyForm.resetFields();
            this.$emit("PIN", "false");
            this.modifyFormdialog = false;
        },
        addPINStr(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                console.log(this.modifyForm.PINStr, "this.modifyForm.PINStr");
                this.$emit("PIN", this.modifyForm.PINStr);
                this.modifyFormdialog = false;
            });
        }
    }
};
</script>