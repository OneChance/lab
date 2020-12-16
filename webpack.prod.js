const merge = require('webpack-merge');
const common = require('./webpack.common.js');
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
        publicPath: 'http://tyjp.ntu.edu.cn/',
        chunkFilename: 'js/[name].[chunkhash].js' //其他js
    },
    optimization: {
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
        new OptimizeCSSPlugin({}),
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