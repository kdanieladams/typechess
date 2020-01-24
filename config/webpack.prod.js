const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    output: {
        filename: 'typechess.min.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.min.css'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: 'TypeChess',
            version: 'Production',
            template: './src/index.html',
            filename: './index.html' //relative to root of the output path
        })
    ]
});
