<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>
<script>
import axios from "axios"

export default {
    name: "App",
    provide() {
        return {
            reload: this.reload,
            roleType: ""
        }
    },
    data() {
        return {
            isRouterAlive: true,
            num: 0,
            sysList: {}
        }
    },
    mounted() {},
    created() {
        // this.getInitStatus();
        this.getAioServiceExist()

        axios.interceptors.request.use((config) => {
            if (sessionStorage.getItem("Authorization")) {
                // this.roleType = window.sessionStorage.getItem("roleType");
                // if (this.roleType == undefined) {
                //     config.headers.common.currentRole = sessionStorage
                //         .getItem("userType")
                //         .charAt(0);
                // } else {
                //     config.headers.common.currentRole =
                //         sessionStorage.getItem("roleType");
                // }
                config.headers.common.Authorization =
                    sessionStorage.getItem("Authorization")
                // config.headers.common.fp = sessionStorage.getItem("fp");
                // this.instance.defaults.headers.common['tokens'] = token
            } else {
                // if (config.url == this.$url.GetAioStep) {
                // this.getInitStatus();
                if (this.num == 0) {
                    this.getInitStatus(config)
                    this.num++
                }
                // } else {
                //     this.$router.push("/GetLogin");
                // }
                // this.$router.push("/GetLogin");
            }
            return config
        })
    },

    methods: {
        reload() {
            this.isRouterAlive = false
            this.$nextTick(function () {
                this.isRouterAlive = true
            })
        },
        // 获取存在哪些系统
        getAioServiceExist() {
            this.$commonJs
                .getMethodData(this.$url.AioServiceExist, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        this.sysList = res.data.data
                        window.sessionStorage.setItem(
                            "sysList",
                            JSON.stringify(res.data.data)
                        )
                    } else if (res.data.code != 800000) {
                        this.$commonJs.getCloseLoading()
                        this.$message.error(res.data.msg)
                    } else {
                        this.$commonJs.getCloseLoading()
                    }
                })
        },
        getInitStatus() {
            this.$commonJs.getLoading()
            this.$commonJs
                .getMethodData(this.$url.GwLicenceTime, "POST", {})
                .then((res) => {
                    if (res.data.code == 100000) {
                        if (res.data.data == true) {
                            this.$commonJs
                                .getMethodData(this.$url.GetAioStep, "POST", {})
                                .then((res) => {
                                    if (res.data.code == 100000) {
                                        this.$commonJs.getCloseLoading()
                                        let aioStep = res.data.data
                                        if (aioStep != "99") {
                                            if (aioStep == "0") {
                                                this.$router.push({
                                                    name: "InitPassCard"
                                                })
                                            } else {
                                                if (
                                                    this.sysList.hsm == true ||
                                                    this.sysList.svs == true ||
                                                    this.sysList.ca == true
                                                ) {
                                                    this.$router.push({
                                                        name: "InitOneList",
                                                        query: {
                                                            aio_step: aioStep
                                                        }
                                                    })
                                                }
                                            }
                                        } else {
                                            console.log(
                                                this.$router.history.current
                                                    .path,
                                                "111111111111111111"
                                            )
                                            if (
                                                this.$router.history.current
                                                    .path == "/GetLogin" ||
                                                this.$router.history.current
                                                    .path == "/GetTypeLogin" ||
                                                this.$router.history.current
                                                    .path == "/GetStatistics"
                                            ) {
                                            } else {
                                                console.log(
                                                    this.$router.history.current
                                                        .path,
                                                    "2222222222222222222"
                                                )
                                                this.$router
                                                    .push("/GetLogin")
                                                    .catch((err) => {
                                                        console.log(
                                                            "输出报错",
                                                            err
                                                        )
                                                    })
                                            }
                                        }
                                        this.num = 0
                                    } else if (res.data.code != 800000) {
                                        this.$commonJs.getCloseLoading()
                                        this.$message.error(res.data.msg)
                                        // this.$router.push("/GetLogin");
                                    } else {
                                        this.$commonJs.getCloseLoading()
                                    }
                                    return
                                })
                                .catch((err) => {
                                    return
                                })
                        } else {
                            this.$router.push({
                                name: "LicenceList"
                            })
                            this.$message.error("许可证已过有效期!")
                            this.$commonJs.getCloseLoading()
                        }
                    } else if (res.data.code != 800000) {
                        this.$router.push({
                            name: "LicenceList"
                        })
                        this.$message.error("许可证已过有效期!")
                        this.$commonJs.getCloseLoading()
                    }
                })
        }
    }
}
</script>
 


