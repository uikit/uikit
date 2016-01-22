var path = require("path");
var webpack = require("webpack");
var source = path.resolve(__dirname, 'src');

var loaders = {
    loaders: [
        {
            test: source,
            loader: "babel",
            query: { presets: ["es2015"] },
        }
    ]
};

var externals = {
    jquery: "jQuery"
};

module.exports = [

    {
        entry: "./src/js/uikit.js",
        output: {
            path: "./js",
            filename: "uikit.js",
            library: "UIkit",
            libraryTarget: "umd"
        },
        module: loaders,
        externals: externals
    },

    {
        entry: "./src/js/uikit.js",
        output: {
            path: "./js",
            filename: "uikit.min.js",
            library: "UIkit",
            libraryTarget: "umd"
        },
        module: loaders,
        externals: externals,
        plugins: [ new webpack.optimize.UglifyJsPlugin ]
    }

];
