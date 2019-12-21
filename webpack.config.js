const path = require('path');
const webpack = require('webpack');
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {

    const config = {
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "[name].js",
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Simple Skill Based Roguelike',
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".css"]
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader"
                        }
                    ]
                },
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                  test: /\.css$/i,
                  use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ]
        },
    };

    if (options.mode === 'development') {
        config.devtool = 'eval-source-map';
        config.watchOptions = {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: [/node_modules/, /\.git/],
        };
    }

    return config;
};
