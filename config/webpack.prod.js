const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'typechess.min.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'TypeChess',
            version: 'Production',
            template: './src/index.html',
            filename: './index.html' //relative to root of the output path
        })
    ]
});