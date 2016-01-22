var webpack = require("webpack");

module.exports = [

    {
        entry: "./src/js/uikit.js",
        output: {
            path: "./js",
            filename: "uikit.js",
            library: "UIkit",
            libraryTarget: "umd"
        },
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel" }
            ]
        },
        externals: {
            "jquery": "jQuery"
        }
    },

    {
        entry: "./src/js/uikit.js",
        output: {
            path: "./js",
            filename: "uikit.min.js",
            library: "UIkit",
            libraryTarget: "umd"
        },
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel" }
            ]
        },
        externals: {
            "jquery": "jQuery"
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin
        ]
    }

];
