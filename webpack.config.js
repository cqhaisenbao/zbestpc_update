const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/index.js'
    },
    mode: "development",
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test:/\.(png|svg|jpg|jpeg|gif)$/i,
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
    plugins: [
        new htmlWebpackPlugin({
            filename: "index.html",
            template: './src/index.html'
        }),
        new htmlWebpackPlugin({
            filename: "login.html",
            template: './src/login.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
}
