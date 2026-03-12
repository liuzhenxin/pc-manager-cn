module.exports = {
  lintOnSave: false, // 禁用ESlint
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    open: true,
    proxy: {
      "": {
        // target: "http://10.10.11.28:8000/stage-api",
        // target: "http://10.10.11.26:8000/stage-api",
        // target: "http://10.10.11.30:8080",
        // target: "http://10.10.11.50:8080",

        target: "stage-api", //本地地址

        changeOrigin: true
        // pathRewrite: {
        //   '^/api/management': ''
        // }
      }
    }
  }
};
