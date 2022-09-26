const path = require('path')
 
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = ["js", "css"];
let fileManagerPlugin = []
const moment = require('moment')
function resolve(dir) {
    return path.join(__dirname, dir)
  }
  function compressedFile() {
 
	let zipTitle =
			'dist-' +
			process.env.VUE_APP_ENV +
			'-随e签管理后台' +
			moment()
			.utc(8)
			.format('YYYY年MM月DD日 HH时mm分ss秒')
	 
	if (process.env.VUE_APP_ENV !== 'development') {
		fileManagerPlugin =  new FileManagerPlugin({
				events: {
					onEnd: {
						delete: ['./dist*.zip'],
						archive: [{
							source: path.join(__dirname, './dist'),
							destination: path.join(__dirname, `./${zipTitle}.zip`)
						}]
					}
				}
			})
		
	}
}
compressedFile()
module.exports = {
    // baseUrl: './',
    assetsDir: '',
    publicPath: './',
    outputDir: 'dist/m/views',//m在服务端自动生成了  这里的build就不管了
    productionSourceMap: false,
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {// 为生产环境修改配置...
            config.mode = 'production';
            config["performance"] = {//打包文件大小配置
                "maxEntrypointSize": 10000000,
                "maxAssetSize": 30000000
            }
            config.optimization.minimizer=[
                new UglifyJsPlugin({
					uglifyOptions: {
                        warnings: false,
						compress: {
							drop_console: true, //console
							drop_debugger: true,
							pure_funcs: ['console.log'] //移除console
						}
					}
				}),
                fileManagerPlugin,
                new CompressionWebpackPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"), //匹配文件名
                    threshold: 10240, //对10K以上的数据进行压缩
                    minRatio: 0.8,
                    deleteOriginalAssets: false //是否删除源文件
                  })
            ]
            // config.plugins.push(new UglifyJsPlugin())
        }
    },

    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
    chainWebpack(config) {
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();
    }
};
