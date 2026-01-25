const { defineConfig } = require('@vue/cli-service');
// 引入webpack（Vue CLI 内置了webpack，无需额外安装）
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  // 核心：添加 configureWebpack 配置定义特性标志
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // 显式定义警告中提到的特性标志，设为false关闭
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
        // 可选：补充其他常用特性标志，避免后续同类警告
        __VUE_PROD_DEVTOOLS__: 'false', // 生产环境禁用devtools
        __VUE_OPTIONS_API__: 'true' // 保留Options API（只用组合式API可设为false）
      })
    ]
  },
  devServer: {
    port: 1234, // 自定义端口
    host: '0.0.0.0', // 允许局域网访问
    hot: true, // 热更新（修改代码无需刷新页面）
    open: false, // 启动后自动打开浏览器
    historyApiFallback: true, // 解决 Vue Router 历史模式的 404 问题
    proxy: {
      '/freeImg': {
        target: 'https://picsum.photos',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/freeImg': ''
        }
      }
    }
  },
});