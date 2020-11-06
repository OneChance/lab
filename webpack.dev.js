const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

process.env.NODE_ENV = 'development';

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    devServer: {
        port: 8893,
        disableHostCheck: true,
        compress: true,
        hot: true,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',
        publicPath: '//ssm.ceeg.cn/',
        chunkFilename: 'js/[name].[hash].js'
    },
});