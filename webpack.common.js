const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader?importLoaders=1&minimize=true',
    {//css浏览器兼容性
        loader: "postcss-loader",
        options: {
            ident: 'postcss',
            plugins: () => [
                require('postcss-preset-env')()
            ]
        }
    }
]

module.exports = {
    entry: {
        index: './app/index.js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                oneOf: [//以下规则只要有一个匹配,就会终止匹配,不会遍历所有
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: [
                            /*{
                                loader: 'thread-loader',//开启多进程打包,若电脑本身运行其他程序,cpu繁忙,此方式会更慢
                                options: {
                                    workers: 4
                                }
                            },*/
                            {//es6语法兼容,备用补充@babel/polyfill
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        [
                                            '@vue/babel-preset-jsx',
                                            {
                                                //corejs按需加载兼容性解决方案,替代polyfill
                                                useBuiltIns: 'usage',
                                                corejs: {
                                                    version: 3
                                                },
                                                targets: { //具体向前兼容到哪一个版本
                                                    chrome: '60',
                                                    firefox: '60'
                                                }
                                            }
                                        ]
                                    ],
                                    cacheDirectory: true  //开启babel缓存,加快打包速度(不明显)
                                }
                            },
                            /*{//js语法规范检查
                                loader: 'eslint-loader',
                                options: {
                                    fix: true //自动修复
                                }
                            }*/
                        ],
                    },
                    {
                        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                        use: ['url-loader?limit=1&name=images/[hash:8].[name].[ext]'],
                        //如果是html(非vue)中引入图片 要设置options{esModule:false},配合html-loader,
                        // 因为html-loader将图片转为commonjs模块,es6模块无法识别
                    },
                    {
                        test: /\.css$/,
                        use: [...commonCssLoader]
                    },
                    {
                        test: /\.scss$/,
                        use: [...commonCssLoader, 'sass-loader']
                    },
                    /*{
                        //html-loader,用于处理html中引入的image
                        test:/\.html$/,
                        loader: 'html-loader'
                    }*/
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.css', '.scss', '.vue'],//省略后缀
        alias: {//路径别名
            'vue': 'vue/dist/vue.min.js',
            'svg': 'svg.js/dist/svg.min.js',
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].style.[contenthash:12].css',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'app/index.html'),
            inject: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery/dist/jquery.min.js',
            $: 'jquery/dist/jquery.min.js'
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dll/manifest.json'),
        }),
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, 'dll/vendor.js'),
        })
    ],
};