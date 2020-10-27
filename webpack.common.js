const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
                oneOf: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@vue/babel-preset-jsx'],
                                    cacheDirectory: true
                                }
                            },
                        ],
                    },
                    {
                        test: /\.(gif|jpg|png|woff|svg|eot|ttf|mp3)\??.*$/,
                        use: ['url-loader?limit=1&name=images/[hash:8].[name].[ext]'],
                    },
                    {
                        test: /\.css$/,
                        use: [...commonCssLoader]
                    },
                    {
                        test: /\.scss$/,
                        use: [...commonCssLoader, 'sass-loader']
                    },
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.css', '.scss', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.min.js',
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
    ],
};