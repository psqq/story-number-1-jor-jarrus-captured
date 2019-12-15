const path = require('path');
const webpack = require('webpack');
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, options) => {

    const config = {
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "[name].[chunkhash].js",
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Игра Лабиринт'
            })
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                { test: /\.tsx?$/, loader: "ts-loader" }
            ]
        }
    };

    if (options.mode === 'development') {
        config.devtool = 'source-map';
        config.watchOptions = {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: [/node_modules/, /\.git/],
        };
    }

    return config;
};
