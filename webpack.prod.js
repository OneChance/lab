const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BabiliPlugin = require("babili-webpack-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash].js', //manifest
        publicPath: 'http://demo.ceeg.cn/', //192.168.1.200:8888   //demo.ceeg.cn
        chunkFilename: 'js/[name].[chunkhash].js' //其他js
    },
    optimization: {
        minimizer: [
            new BabiliPlugin({}),//js压缩
            new OptimizeCSSPlugin({}) //css压缩
        ],
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                plugin: {
                    test: /[\\/]plugin[\\/]/,
                    priority: 0,
                },
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.HashedModuleIdsPlugin(),
        new ImageminPlugin({
            plugins: [
                ImageminMozjpeg({
                    quality: 80,
                    progressive: true
                })
            ]
        }),
    ],
});