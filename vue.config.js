const CompressionWebpackPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
    // 公共路径(必须有的)
    publicPath: "./",
    // 输出文件目录
    outputDir: "dist",
    // 静态资源存放的文件夹(相对于ouputDir)
    assetsDir: "assets",
    // eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
    lintOnSave:false,
    // 我用的only，打包后小些
    runtimeCompiler: false,
    productionSourceMap: false, // 不需要生产环境的设置false可以减小dist文件大小，加速构建    
    // css相关配置(我暂时没用到)
    // css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // 开启 CSS source maps?
    // sourceMap: false,
    // css预设器配置项
    // loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    // modules: false
    // },
    // webpack-dev-server 相关配置
    devServer: {
      open: true,  // npm run serve后自动打开页面
      host: '0.0.0.0',  // 匹配本机IP地址(默认是0.0.0.0)
      port: 8080, // 开发服务器运行端口号
      proxy: null,
      // 注：目前本项目暂时没有写后台接口，没有跨域问题，暂时不配置proxy
    },
    configureWebpack: config => {
      const plugins = [];
      if (IS_PROD) {
        plugins.push(
          new CompressionWebpackPlugin({
            algorithm(input, compressionOptions, callback) {
              return zopfli.gzip(input, compressionOptions, callback);
            },
            compressionOptions: {
              numiterations: 15
            },
            minRatio: 0.99,
            test: productionGzipExtensions
          })
        );
        plugins.push(
          new BrotliPlugin({
            test: productionGzipExtensions,
            minRatio: 0.99
          })
        );
      }
    config.plugins = [...config.plugins, ...plugins];
  }
}