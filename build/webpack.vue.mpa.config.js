const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CssminiPlugin = require('css-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require("webpack");
const {VueLoaderPlugin} = require('vue-loader');

const config = {
    mode: 'development',
    entry: {
        home: path.resolve(__dirname, '../src/mpa/home.js'),
        login: path.resolve(__dirname, '../src/mpa/login.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
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
                test: /\.vue$/,
                use: ['vue-loader']
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
            name: 'common', //指定公共代码打包后的名字
            cacheGroups: {
                //第三方库单独打包
                jquery: {
                    test: /jquery/,
                    name: 'jquery',
                    chunks: 'all',
                },
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false,
        }),
        new htmlWebpackPlugin({
            filename: "home.html",
            template: path.resolve(__dirname, '../public/index.html'),
            chunks: ['home']
        }),
        new htmlWebpackPlugin({
            filename: "login.html",
            template: path.resolve(__dirname, '../public/index.html'),
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
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../src/img'),
                    to: path.resolve(__dirname, '../dist/img')
                }
            ]
        }),
        new VueLoaderPlugin()
    ],
}

module.exports = config
