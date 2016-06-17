var webpack = require('webpack');
var glob = require('glob');
var path = require('path');

var loaders = {
    loaders: [
        {
            test: /(src|tests)(\/|\\).*\.js$/,
            loader: "babel",
            query: { presets: ["es2015"] }
        }
    ]
};

var components = {};
glob.sync('./src/js/components/**/*.js').forEach(file => components[path.basename(file, '.js')] = file.substring(0, file.length - 3));

module.exports = [

    {
        entry: "./src/js/uikit",
        output: {
            filename: "js/uikit.js",
            library: "UIkit",
            libraryTarget: "umd"
        },
        module: loaders,
        externals: {jquery: "jQuery"}
    },

    {
        entry: {
            index: "./tests/js/index"
        },
        output: {
            filename: "tests/js/test.js"
        },
        module: loaders,
        externals: {jquery: "jQuery", uikit: 'UIkit'}
    },

    {
        entry: components,
        output: {
            filename: 'js/components/[name].js'
        },
        module: loaders,
        externals: {jquery: "jQuery", uikit: "UIkit"}
    }

];
