var webpack = require("webpack");

var loaders = {
    loaders: [
        {
            test: /(src|tests)\/.*\.js$/,
            loader: "babel",
            query: { presets: ["es2015"] }
        }
    ]
};

var externals = {
    jquery: "jQuery"
};

module.exports = [

    {
        entry: "./src/js/uikit",
        output: {
            path: "./js",
            filename: "uikit.js",
            library: "UIkit",
            libraryTarget: "umd"
        },
        module: loaders,
        externals: externals
    },

    //{
    //    entry: "./src/js/uikit.js",
    //    output: {
    //        path: "./js",
    //        filename: "uikit.min.js",
    //        library: "UIkit",
    //        libraryTarget: "umd"
    //    },
    //    module: loaders,
    //    externals: externals,
    //    plugins: [ new webpack.optimize.UglifyJsPlugin ]
    //},

    {
        entry: {
            index: "./tests/js/index"
        },
        output: {
            filename: "./tests/js/test.js",
            library: "UIkit"
        },
        module: loaders,
        externals: externals
    }

];
