<template>
  <div class="navItem" v-loading="createdLoading">
    <el-card>
      <el-row>
        <el-col :span="10">
          <div style="margin-top:20px;" class="boxStyle">本页用于管理对称密钥，包括生成，删除对称密钥</div>
        </el-col>
        <el-col :span="14">
          <keyLogo :isMakeKey='1'></keyLogo>
        </el-col>
      </el-row>
      <div style="margin-bottom:10px;margin-top:30px">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addSymmetricKey">批量创建</el-button>
        <!-- <el-button type="primary" size="mini" icon="el-icon-upload" @click="importKey">导入</el-button> -->
        <!-- <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteKey">删除</el-button> -->
      </div>
    </el-card>
    <el-card>
      <el-table ref="symmetricTable" v-loading="loading" :data="symmetricKeyList" tooltip-effect="dark" :header-cell-style="{
            'text-align': 'center',
            'color': '#333',
            'font-size': '14px',
          }" :cell-style="{ 'text-align': 'center' }" border stripe>
        <el-table-column label="索引" prop="index"> </el-table-column>
        <el-table-column label="密钥长度">
          <template slot-scope="scope">
            <span v-if="scope.row.enc_bits=='0'">-</span>
            <span v-else>{{scope.row.enc_bits}}</span>

          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-if="scope.row.enc_bits =='0'" type="text" size="mini" class="el-icon-plus" style="color: #409EFF">生成</el-button>
            <el-button @click.native.stop="addSymmetricKey(1,scope.row)" v-else type="text" size="mini" class="el-icon-edit" style="color: #409EFF">更新</el-button>
            <el-button @click.native.stop="deleteKey(scope.row)" :disabled="scope.row.enc_bits =='0'" type="text" size="mini" class="el-icon-delete" style="color: #da0909">销毁</el-button>

          </template>
        </el-table-column>
        <div slot="empty" style="display: inline-grid; margin-bottom: 50px">
          <img style="width: 300px; margin-top: 50px" src="../../../public/img/noList.jpg" />
          <p style="font-size: 14px; margin: 0; line-height: 30px"></p>
        </div>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNow" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog :title="keyName" :visible.sync="dialogVisible" :width="dialogWidth">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="21%" style="margin-bottom:20px">
        <el-row :gutter="20" v-if="Isbatch!=1">
          <el-col :offset="2">
            <el-row>
              <el-col :span="13">
                <el-form-item label="密钥索引:" label-width="32%" prop="start">
                  <el-select style="width:120px;" v-model="form.start" @change="indexChange" placeholder="请选择索引">
                    <el-option v-for="item in indexValList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <span style="margin-left:10px">-</span>
                </el-form-item>

              </el-col>
              <el-col :span="8">
                <el-form-item id="indexStyle">
                  <el-select style="margin-left:-62%;width:120px" @change="indexChangeTwo" v-model="form.end" placeholder="请选择索引">
                    <el-option v-for="item in indexValList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col style="margin-left: 17%;margin-top: -12px;color:#d2cdcd"> (例: 从1到5 选: 1-5 默认值为: 1-1)</el-col>

            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:10px" v-if="isImport == '' && isImport !='2'">
          <el-col :offset="2">
            <!-- <span class="titleLabel" style="width:35px">模长:</span> -->
            <el-form-item label="密钥模长:" label-width="17%" prop="uiKeyBits">
              <el-radio style="margin-left:10px" v-model="form.uiKeyBits" :label="uiKeyBitsLabel" v-if="uiKeyBitsLabel!=''">{{uiKeyBitsLabel}}</el-radio>
              <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel1" v-if="uiKeyBitsLabel1!=''">{{uiKeyBitsLabel1}}</el-radio>
              <el-radio v-model="form.uiKeyBits" :label="uiKeyBitsLabel2" v-if="uiKeyBitsLabel2!=''">{{uiKeyBitsLabel2}}</el-radio>
              <!-- <el-radio v-model="form.uiKeyBits" label="192">192</el-radio> -->
              <!-- <el-radio v-model="form.uiKeyBits" label="256">256</el-radio> -->
              <!-- <el-select style="width:68.5%;" v-model="form.uiKeyBits" placeholder="请选择模长">
                  <el-option v-for="item in dieList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- <el-row :gutter="20" style="margin-top:10px" v-if="isImport == '' && isImport !='2'">
          <el-col :offset="3">
              <span class="titleLabel" style="width:35px">模长:</span>
              <el-select style="width:60%;margin-left:10px" v-model="pucKeyStr" placeholder="请选择模长">
                  <el-option v-for="item in dieList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
          </el-col>
      </el-row>
      <el-row :gutter="20" v-if="isImport == '1'&& isImport !='2'" style="margin-top:10px">
          <el-col :offset="3">
              <span class="titleLabel" style="width:35px">密钥:</span>
              <el-input style="width:60%;margin-left:10px" v-model="keyVal" placeholder="请输入密钥" class="searchInputClass"></el-input>
          </el-col>
      </el-row> -->
      <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()" size="mini" type="warning">取 消</el-button>
                <el-button type="primary" @click="addKey('form')" size="mini">确 定</el-button>

            </span>
    </el-dialog>
  </div>
</template>
<script>
import keyLogo from "./keyLogo.vue"
export default {
  components: {
    keyLogo
  },
  data() {
    return {
      keyName: "",
      dialogVisible: false,
      loading: false,
      isImport: "",
      indexValList: [],
      indexVal: "1",
      indexVal1: "1",
      keyVal: "",
      pucKeyStr: "",
      Isbatch: "",
      symmetricKeyList: [],
      dieList: [
        {
          value: "",
          label: ""
        },
        {
          value: "0",
          label: "128"
        },
        {
          value: "1",
          label: "192"
        },
        {
          value: "2",
          label: "256"
        }
      ],
      rules: {
        start: [
          {
            required: true,
            message: "请选择索引",
            trigger: "blur"
          }
        ],
        // end: [
        //     {
        //         required: true,
        //         message: "请选择索引",
        //         trigger: "blur"
        //     }
        // ],
        uiKeyBits: [
          {
            required: true,
            message: "请选择模长",
            trigger: "blur"
          }
        ]
      },
      form: {
        start: "1",
        end: "1",
        uiKeyBits: "128",
        type: "kek"
        // pucPINStr: "12345678" // 私钥控制码
      },
      pageNow: 1,
      pageSize: 10,
      total: 0,
      dialogWidth: "30%",
      createdLoading: false,
      rowList: {},
      uiKeyBitsLabel: "128",
      uiKeyBitsLabel1: "",
      uiKeyBitsLabel2: ""
    }
  },
  created() {
    if (this.$commonJs.getScreenWidth() <= 1600) {
      this.dialogWidth = "42%"
    }
    this.getKeyState(1)
  },
  methods: {
    // 获取详情
    getResourceDetail() {
      this.loading = true
      let url = this.$url.ResourceGetByCode
      this.$commonJs
        .getMethodData(url, "POST", {
          page: "initInstallList",
          code: "3"
        })
        .then((res) => {
          if (res.data.code == 100000) {
            let result = res.data.data.content
            let resultArr = result.split(",")
            this.uiKeyBitsLabel = resultArr[0]
            this.uiKeyBitsLabel1 = resultArr[1]
            this.uiKeyBitsLabel2 = resultArr[2]
          }
          this.loading = false
        })
    },
    getKeyState(type) {
      if (type != 1) {
        this.loading = true
      } else {
        this.createdLoading = true
      }
      this.$commonJs
        .getMethodData(this.$url.GetKeyStateByType, "POST", {
          // keyNum *密钥个数
          keyNum: this.pageSize,
          pageNum: this.pageNow,
          type: "kek"
        })
        .then((res) => {
          if (res.data.code == 100000) {
            // this.symmetricKeyList = [res.data.data];
            this.symmetricKeyList = res.data.data
            this.$commonJs.deviceConfGet().then((res) => {
              this.total = res.data.data.kek_count
              // console.log(dataList, "res");
            })
            this.loading = false
            this.createdLoading = false
          } else if (res.data.code != 800000) {
            this.loading = false
            this.createdLoading = false
            this.$message.error(res.data.msg)
          } else {
            this.loading = false
            this.createdLoading = false
          }
          console.log(res, "res")
        })
    },
    generateKEKKey() {
      this.$commonJs
        .getMethodData(this.$url.GenerateKeyByType, "POST", this.form)
        .then((res) => {
          if (res.data.code == 100000) {
            console.log(res, "res")
            this.$message.success("生成对称密钥成功.")
            // this.$alert("生成对称密钥成功.", "提示", {
            //     confirmButtonText: "确定",
            //     type: "success"
            // })
            //     .then((res) => {
            this.getKeyState()
            // })
            // .catch((err) => {
            //     this.getKeyState();
            // });
          } else if (res.data.code != 800000) {
            this.$message.error(res.data.msg)
          }
          this.form.start = "1"
          this.form.end = "1"
        })
    },
    /* 监听pagesize改变的事件 */
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getKeyState()
    },
    /* 监听页码值改变的事件 */
    handleCurrentChange(newPage) {
      this.pageNow = newPage
      this.getKeyState()
    },
    addSymmetricKey(type, row) {
      this.getResourceDetail()
      this.isImport = ""
      this.dialogVisible = true
      this.keyName = "生成密钥"
      this.indexValList = []
      for (var i = 1; i <= this.total; i++) {
        this.indexValList.push({
          label: i,
          value: i
        })
      }
      this.Isbatch = type
      this.rowList = row
      if (type == 1) {
        if (this.rowList.enc_bits != 0) {
          this.form.uiKeyBits = this.rowList.enc_bits.toString()
        }
      }
    },
    addKey(formName) {
      if (this.isImport == "") {
        this.$refs[formName].validate((valid) => {
          if (!valid) return
          let keyAddName = "生成"
          if (this.Isbatch == 1) {
            this.form.start = this.rowList.index
            this.form.end = this.rowList.index

            if (this.rowList.enc_bits != 0) {
              keyAddName = "覆盖原来的"
            }
          }
          this.dialogVisible = false
          setTimeout(() => {
            this.$confirm(
              "是否确定要" + keyAddName + "密钥?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then((res) => {
                this.generateKEKKey()
                this.handleClose()
              })
              .catch((err) => {
                this.handleClose()
              })
          }, 500)
        })
      } else if (this.isImport == "1") {
        this.$alert("导入对称密钥成功.", "提示", {
          confirmButtonText: "确定",
          type: "success"
        })
        this.dialogVisible = false
      } else if (this.isImport == "2") {
        this.$confirm("是否永久删除密钥?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then((res) => {
            this.dialogVisible = false
          })
          .catch((err) => err)
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.form = {
        start: "1",
        end: "1",
        uiKeyBits: "128",
        type: "kek"
      }
      this.$refs.form.clearValidate()
    },
    indexChange(data) {
      this.form.end = data
    },
    indexChangeTwo(data) {
      if (data < this.form.start) {
        this.form.end = this.form.start
        this.$message.error("输入范围有误!")
      }
    },
    importKey() {
      this.isImport = "1"
      this.dialogVisible = true
      this.keyName = "导入密钥"
    },
    deleteKey(row) {
      this.$confirm("是否永久销毁对称密钥?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then((res) => {
          this.$commonJs
            .getMethodData(this.$url.DelUserKey, "POST", {
              //alg:算法 sig_sm2:SM2签名 enc_sm2:SM2加密 sig_rsa:RSA签名 enc_rsa:RSA加密 kek:对称密钥
              alg: "kek",
              // uiKeyIndex - 密钥内部索引号
              uiKeyIndex: row.index,
              // 密钥类型:类型 sig_sm2:SM2签名 enc_sm2:SM2加密 sig_rsa:RSA签名 enc_rsa:RSA加密 kek:对称密钥
              type: "kek"
            })
            .then((res) => {
              if (res.data.code == 100000) {
                console.log(row, res, "row")
                this.getKeyState()
              } else if (res.data.code != 800000) {
                this.$message.error(res.data.msg)
              }
            })
          this.dialogVisible = false
        })
        .catch((err) => err)

      // this.isImport = "2";
      // this.dialogVisible = true;
      // this.keyName = "删除密钥";
    }
  }
}
</script>
<style lang="less" scoped>
.boxStyle {
  width: 100%;
  height: 32px;
  line-height: 32px;
  // background: #f4f5f7;
  border-left: 3px solid #4f7be2;
  padding-left: 10px;
  color: #e6a23c;
  font-weight: 500;
}
</style>



