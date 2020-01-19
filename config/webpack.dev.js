const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');

module.exports = merge(common, {
    devServer: {
        contentBase: path.join(__dirname, "../dist/"),
        port: 3000
    },
    devtool: 'eval-source-map',
    mode: 'development',
    output: {
        filename: 'typechess.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'TypeChess',
            version: 'Development',
            template: './src/index.html',
            filename: './index.html' //relative to root of the output path
        })
    ],
    watch: true
});
