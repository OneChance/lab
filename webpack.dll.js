const {resolve} = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require("babili-webpack-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        vendor: [
            'jquery',
            'axios',
            'element-ui',
            'file-saver',
            'jszip',
            'qs',
            'svg.js',
            'vue',
            'vue-axios',
            'vue-cookie',
            'vue-router',
        ],
    },
    output: {
        filename: "[name].js",
        path: resolve(__dirname, 'dll'),
        library: '[name]_[hash]',
    },
    optimization: {
        minimizer: [
            new BabiliPlugin(),//js压缩
            new OptimizeCSSPlugin({}) //css压缩
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dll']), //build前清空dist目录
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: resolve(__dirname, 'dll/manifest.json')
        })
    ],
    mode: 'production'
}