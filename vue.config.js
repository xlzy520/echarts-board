module.exports = {
  devServer: {
    proxy: {
      '/djcpsdocument': {
        target: 'https://www.easy-mock.com/mock/5c47cda4f513860f4ceef676/', // mock
        changeOrigin: true
      }
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {

  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // 只打包初始时依赖的第三方
          },
          elementUI: {
            name: 'chunk-ant-design-vue', // 单独将 elementUI 拆包
            priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
          }
        }
      },
      runtimeChunk: 'single'
    }
  }
}
