const path = require("path");
const CopyrightWebpackPlugin = require("./plugin/copyright-webpack-plugin");
const HelloWorldPlugin = require("./plugin/helloWorldPlugin");

module.exports = {
    mode: "development",
    entry: {
        main: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: path.resolve(__dirname, "loader/option-name-loader.js"),
            options: {
                name: "jessie sun"
            }
        }]
    },
    plugins: [
        new CopyrightWebpackPlugin(),
        new HelloWorldPlugin()
    ]
};