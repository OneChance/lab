const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

process.env.NODE_ENV = 'development';

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    devServer: {
        port: 8899,
        disableHostCheck: true,
        compress: true, //启动gzip压缩,加快启动速度
        hot: true,//开启HMR，只重新打包修改的模块
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',
        publicPath: 'http://192.168.1.200:8899/', //192.168.1.200:8899
        chunkFilename: 'js/[name].[hash].js'
    },
});