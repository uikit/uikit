var webpack = require('webpack');
var glob = require('glob');
var path = require('path');

var loaders = {
    loaders: [
        {loader: 'buble-loader', test: /(src|tests)(\/|\\).*\.js$/},
        {loader: 'json-loader', test: /\.json/}
    ]
};

var components = {};
glob.sync('./src/js/components/**/*.js').forEach(file => components[path.basename(file, '.js')] = file.substring(0, file.length - 3));

module.exports = [

    {
        entry: './src/js/uikit',
        output: {
            filename: 'dist/js/uikit-core.js',
            library: 'UIkit',
            libraryTarget: 'umd'
        },
        module: loaders,
        externals: {jquery: 'jQuery'}
    },

    {
        entry: {
            index: './tests/js/index'
        },
        output: {
            filename: 'tests/js/test.js'
        },
        module: loaders,
        externals: {jquery: 'jQuery', uikit: 'UIkit'}
    },

    {
        entry: components,
        output: {
            filename: 'dist/js/components/[name].js'
        },
        module: loaders,
        externals: {jquery: 'jQuery', uikit: 'UIkit'}
    }

];
