var webpack = require('webpack');
var glob = require('glob');
var path = require('path');
var exec = require('child_process').exec;

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
        entry: './tests/js/uikit',
        output: {
            filename: 'dist/js/uikit-core.js',
            library: 'UIkit',
            libraryTarget: 'umd'
        },
        module: loaders,
        externals: {jquery: 'jQuery'},
        plugins: [
            new BuildAll()
        ]
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
        externals: {jquery: 'jQuery', uikit: 'UIkit'},
        plugins: [
            new BuildAll()
        ]
    }

];

function BuildAll(options) {}

BuildAll.prototype.apply = compiler =>
    compiler.plugin('done', () =>
        exec('node build/all'));
