<template>
  <div class="navItem" v-loading="loading">
    <el-card>
      <div class="boxStyle" style=" margin-top:10px;height:auto">
        <span>(1)请登录半数以上管理员,以满足恢复所需权限</span><br>
        <span>(2)密钥恢复过程会破坏密码设备内当前的密钥数据。请谨慎操作.</span>
      </div>

      <el-row style="margin-top:20px;">
        <el-col :span="12">
          <div style="margin-top:0px;color:#409EFF;border-left: 3px solid #4f7be2" class="boxStyle">
            分散管理员数: {{ adminCount }}
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin-top:0px;color:#409EFF;border-left: 3px solid #4f7be2" class="boxStyle">
            恢复需读取密钥数: {{ threshold }}
          </div>
        </el-col>
      </el-row>

      <div v-if="step === 1" style="margin-top: 20px;">
        <h3>第一步：请准备恢复所需的管理员USBKey。</h3>
        <p>系统检测到总管理员数为 {{ adminCount }}，恢复密钥需要读取其中 {{ threshold }} 个管理员的备份分量。</p>
        <el-button type="primary" @click="startReading" plain icon="el-icon-key">
            开始读取密钥
        </el-button>
      </div>

      <div v-if="step === 2" style="margin-top: 20px;">
        <h3>第二步：读取管理员备份分量</h3>
        <p>请插入第 {{ readCount + 1 }} 个参与恢复的管理员USBKey</p>

        <el-form>
            <el-form-item label="PIN口令">
                <el-input type="password" v-model="pinContent" placeholder="请输入PIN口令" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="readShare" icon="el-icon-key" plain>
                    读取第 {{ readCount + 1 }} 个备份分量
                </el-button>
            </el-form-item>
        </el-form>
        <p>已读取 {{ readCount }} / {{ threshold }}</p>
      </div>

      <div v-if="step === 3" style="margin-top: 20px;">
        <h3>第三步：上传备份文件恢复密钥</h3>
        <p>已成功读取所需的 {{ threshold }} 个备份分量，请上传之前备份的密钥文件以完成恢复。</p>

        <el-upload
          class="upload-demo"
          ref="upload"
          action=""
          :show-file-list="true"
          :on-change="changeAction"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          multiple
          :limit="1"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="success" plain>选择备份文件</el-button>
        </el-upload>

        <el-button style="margin-top: 20px;" size="small" type="primary" @click="addCopyKey" icon="el-icon-upload">
            恢复密钥
        </el-button>
      </div>

      <div v-if="step === 4" style="margin-top: 20px;">
          <h3>密钥恢复成功。</h3>
          <el-button type="primary" @click="reset" plain>
              完成
          </el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      loading: false,
      step: 1, // 1: start, 2: reading shares, 3: upload file, 4: done
      pinContent: "",
      fileList: [],
      fileStore: null,
      readCount: 0,
      adminCount: 0,
      shares: "",
    }
  },
  computed: {
      threshold() {
          if (this.adminCount === 0) return 0;
          return Math.floor(this.adminCount / 2) + 1;
      }
  },
  created() {
      this.getEnumUser();
  },
  methods: {
    reset() {
        this.step = 1;
        this.readCount = 0;
        this.pinContent = "";
        this.fileList = [];
        this.fileStore = null;
        this.shares = "";
        this.getEnumUser();
    },
    //获取已登录的管理员数
    getEnumUser() {
      this.loading = true;
      this.$commonJs.getMethodData(this.$url.GetEnumUser,"Post",{})
        .then((res)=>{
          if (res.data.code == 100000) {
            this.adminCount = res.data.data.managerRegister;
          }
        })
        .finally(() => {
            this.loading = false;
        });
    },
    startReading() {
        if (this.adminCount === 0) {
            this.$message.error("无法获取管理员数量，请检查系统状态");
            return;
        }
        this.step = 2;
    },
    readShare() {
      if (!this.pinContent) {
        this.$message.error("口令不能为空！");
        return;
      }

      this.loading = true;
      console.log("readshare 参数:", {
        passwd: this.pinContent,
        readCount: this.readCount,
        adminCount: this.adminCount
      });

      this.$commonJs
        .getMethodData(this.$url.readShare, "POST", {
          passwd: this.pinContent,
          readCount: this.readCount,
          adminCount: this.adminCount
        })
        .then((res) => {
          console.log("readshare 返回:", res.data);
          if (res.data.code == 100000) {
            // 调用 GetShares 接口获取已读取的分片数据
            return this.$commonJs.getMethodData(this.$url.GetShares, "POST", {});
          } else {
            this.$message.error(res.data.msg || "读取失败");
            this.loading = false;
            throw new Error("读取失败");
          }
        })
        .then((sharesRes) => {
          console.log("GetShares 返回:", sharesRes.data);
          if (sharesRes.data.code == 100000 && sharesRes.data.data) {
            // 获取到实际的分片数据
            this.shares = sharesRes.data.data;
            this.readCount++;
            this.pinContent = "";
            this.$message.success(`成功读取第 ${this.readCount} 个备份分量！`);

            if (this.readCount >= this.threshold) {
              this.step = 3;
            }
          } else {
            this.$message.error("获取分片数据失败");
          }
        })
        .catch(() => {
            this.$message.error("读取分量请求失败");
        })
        .finally(() => {
            this.loading = false;
        });
    },
    changeAction(file, fileList) {
      this.fileList = fileList;
      this.fileStore = fileList.length > 0 ? fileList[0].raw : null;
    },
    handleExceed() {
      this.$message.error("只能上传一个文件!");
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      this.fileStore = null;
    },
    addCopyKey() {
      if (!this.fileStore) {
        this.$message.error("请先选择备份文件！");
        return;
      }

      if (!this.shares || this.shares === "") {
        this.$message.error("请先读取密钥分量！");
        return;
      }

      this.loading = true;
      let formdata = new FormData();
      formdata.append("file", this.fileStore);
      formdata.append("m", this.adminCount); // Required by backend
      formdata.append("shares", this.shares); // Required by backend

      this.$http
        .post(this.$url.RestoryKey, formdata, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((res) => {
          if (res.data.code == 100000) {
            this.$message.success("恢复密钥成功");
            this.step = 4;
          } else {
            this.$message.error(res.data.msg || "恢复密钥失败");
          }
        })
        .catch(() => {
             this.$message.error("恢复密钥请求失败");
        })
        .finally(() => {
             this.loading = false;
        });
    }
  }
}
</script>

<style lang="less" scoped>
.boxStyle {
  width: 100%;
  height: 32px;
  line-height: 32px;
  border-left: 3px solid #4f7be2;
  padding-left: 10px;
  color: #e6a23c;
  font-weight: 500;
}
</style>
