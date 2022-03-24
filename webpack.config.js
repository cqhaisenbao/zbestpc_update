const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CssminiPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
        login: './src/login.js',
    },
    mode: "development",
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        compress: true,
        port: 9000,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024,
                    }
                },
                generator: {
                    filename: 'images/[name].[hash:6].[ext]',
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin(),
            new CssminiPlugin()
        ],
        splitChunks: {  // 分离node_modules里的模块，减少index.js的体积
            minSize: 30 * 1024,  //大于30kb的库会被单独打包
            chunks: "all",
            name:'common', //指定公共代码打包后的名字
            cacheGroups: {
                //第三方库单独打包
                jquery:{
                    test: /jquery/,
                    name: 'jquery',
                    chunks: 'all',
                },
            }
        }
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: "index.html",
            template: './src/index.html',
            chunks: ['index']
        }),
        new htmlWebpackPlugin({
            filename: "login.html",
            template: './src/login.html',
            chunks: ['login']
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].chunk.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/img'),
                    to: path.resolve(__dirname, 'dist/img')
                }
            ]
        })
    ],
}
