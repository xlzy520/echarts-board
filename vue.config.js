module.exports = {
  devServer: {
    proxy: {
      '/djfb': {
        target: 'http://192.168.2.80:8080/',
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
          antDesignVue: {
            name: 'chunk-ant-design-vue',
            priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
            test: /[\\/]node_modules[\\/]ant-design-vue|@ant-design[\\/]/
          },
          // echarts: {
          //   name: 'chunk-echarts', // 单独将 elementUI 拆包
          //   priority: 12, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          //   test: /[\\/]node_modules[\\/]echarts[\\/]/
          // }
        }
      },
      runtimeChunk: 'single'
    }
  }
}
