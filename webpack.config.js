const path = require('path');
const webpack = require('webpack');
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {

    const config = {
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "[name].[chunkhash].js",
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Simple Skill Based Roguelike',
            })
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
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
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                }
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
