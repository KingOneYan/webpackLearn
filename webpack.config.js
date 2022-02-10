/**
 webpack.config.js webpack的配置文件(当运行webpack指令时，会加载里面的配置)
 所有构建工具都是基于nodejs平台运行的~模块化默认采用commonjs
 loader: 1.下载,2.配置
 plugins: 1.下载 2.引入 3.使用
 */
//resolve用来拼接绝对路径的方法,而join的话是相对路径
const {resolve} = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin') // 构造函数
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// process.env.NODE_ENV='development' // 临时设置nodejs环境变量
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    //webpack配置
    //入口七点
    entry: './src/index.js',
    //输出
    output: {
        //输出文件名
        filename: 'js/built.js',
        //输出路径
        //_dirname ->nodejs的变量,代表当前文件的目录绝对路径
        path: resolve(__dirname, 'build')
    },
    //loader的配置
    module: {
        rules: [
            //详细loader配置
            {
                //匹配哪些文件
                test: /\.css$/,
                //使用哪些loader进行处理，使用多个loader要用use
                use: [
                    //use数组中loader执行顺序:从右到左，从下到上 依次执行
                    //style-loader创建style标签,将js中的样式资源插入进行，添加到header中生效
                    // 'style-loader',
                    //使用minicss插件不能使用styleLoader
                    //提取js中的css成单独文件
                    MiniCssExtractPlugin.loader,
                    //css-loader将css文件以字符串的形式变成commonjs模块加载js中
                    'css-loader',
                    /*
                    * css兼容性处理: postcss --> postcss-loader postcss-preset-env
                    * 帮助postcss找到package.json中browserslist里面的配置，通过
                    * 配置加载指定的css兼容性样式
                    * */
                    //使用loader的默认配置
                    // 'postcss-loader'
                    {
                        loader: 'postcss-loader',
                        options: {
                            // ident: 'postcss', // webpack5不需要加这个
                            postcssOptions: {
                                //或者将插件引入写在单独的配置js中
                                //config: './config/postcss.config.js',
                                plugins: [
                                    require('postcss-preset-env')
                                ]
                                //不出现兼容性代码的写法，估计是webpack4写法
                                // plugins: () => [
                                //   require('postcss-preset-env')()
                                // ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.less/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    //将less文件编译成css文件
                    //需要下载less-loader和less
                    'less-loader'
                ]
            },
            {
                //处理图片资源
                //问题:默认处理不了html的img,因此需要html-loader
                test: /\.(jpg|png|gif)$/,
                //使用一个loader
                //下载两个包，url-loader,file-loader
                loader: 'url-loader',
                options: {
                    //图片大小小于8kb，就会被base64处理
                    //优点:减少请求数量(降低服务器请求压力)
                    //缺点:图片体积会更大(文件请求速度更慢)
                    //因此一般8-12kb使用base64解析会比较好
                    limit: 8 * 1024,
                    //问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    //解析会出问题：<img src=[object Module]>
                    //解决:关闭url-loader的es6模块话，使用commonjs解析
                    //ps：新版本webpack已经解决了这个问题，但是会出现图片路径无法识别的问题(oﾟvﾟ)ノ
                    //解决方案：在html-loader与url-loader都配置esModule:false
                    esModule: false,
                    //给图片重命名
                    //[hash:10]去图片的hash前10位
                    //[ext]-> 扩展名
                    name: '[hash:10].[ext]',
                    outputPath:'imgs'
                }
            },
            {
                test: /\.html$/,
                //处理html文件的img图片(负责引入img,从而能被url-loader处理)
                loader: 'html-loader',
                options: {
                    esModule: false
                }
            },
            //打包其他资源(除指定以外的一资源)
            {
                exclude: /\.(css|js|html|less|jpg|png|gif|json)$/,
                loader: 'file-loader',
                options:{
                    name: '[hash:10].[ext]',
                    outputPath:'media'
                }
            }
        ]
    },
    //plugins的配置
    plugins: [
        //详细plugins配置
        // html-webpack-plugin
        //功能:默认创建一个空的html,自动引入打包输出的所有资源(JS/CSS)
        //需求:需要有结构的html
        new htmlWebpackPlugin({
            //复制指定路径的html文件，并自动引入资源
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            ignoreOrder: true
        }),
        //压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    //模式
    mode: 'development', //开发模式
    //mode:'production',

    //开发服务器 devServer:用来自动化(自动编译，自动打开浏览器，自动刷新浏览器)
    //特点:只会在内存中编译打包，而不会有任何输出
    //启动devServe指令为:npx webpack-dev-server
    //webpack-cli4v以上的本地服务器的启动命令为  webpack serve  否则报找不到 webpack-cli的错误
    devServer: {
        contentBase:resolve(__dirname,'build'),
        //启动gzip压缩
        compress:true,
        port:3000,
        //自动打开浏览器
        open:true
    }
}
