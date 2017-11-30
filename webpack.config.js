/* eslint-env node */
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var webpack = require('webpack');
var util = require('./build/util');
var version = require('./package.json').version;
var uglify = require('uglifyjs-webpack-plugin');
var circular = require('circular-dependency-plugin');

var loaders = {
    loaders: [
        {loader: 'buble-loader', test: /(src|tests)[\/\\].*\.js$/},
        {loader: 'json-loader', test: /\.json$/},
        {loader: 'html-loader', test: /\.svg$/, options: {minimize: false}}
    ]
};

var components = {};
glob.sync('./src/js/components/*.js').forEach(file => components[path.basename(file, '.js')] = file.substring(0, file.length - 3));

module.exports = [

    {
        entry: './tests/js/uikit',
        output: {
            filename: 'dist/js/uikit.js',
            library: 'UIkit',
            libraryTarget: 'umd'
        },
        module: loaders,
        resolve: {
            alias: {
                'components$': __dirname + '/dist/icons/components.json',
            }
        },
        plugins: [
            // new circular,
            new webpack.DefinePlugin({
                BUNDLED: true,
                VERSION: `'${version}'`
            }),
            new webpack.optimize.ModuleConcatenationPlugin()
        ]
    },

    {
        entry: './tests/js/uikit',
        output: {
            filename: 'dist/js/uikit.min.js',
            library: 'UIkit',
            libraryTarget: 'umd'
        },
        module: loaders,
        resolve: {
            alias: {
                'components$': __dirname + '/dist/icons/components.json',
            }
        },
        plugins: [
            // new circular,
            new webpack.DefinePlugin({
                BUNDLED: true,
                VERSION: `'${version}'`
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new uglify
        ]
    },

    {
        entry: './src/js/icons',
        output: {
            filename: 'dist/js/uikit-icons.js',
            library: 'UIkitIcons',
            libraryTarget: 'umd'
        },
        module: loaders,
        plugins: [
            {

                apply(compiler) {

                    compiler.plugin('after-plugins', () => fs.writeFileSync('dist/icons.json', util.icons('src/images/icons/*.svg')));
                    compiler.plugin('done', () => fs.unlink('dist/icons.json', () => {}));

                }

            }
        ],
        resolve: {
            alias: {
                'icons$': __dirname + '/dist/icons.json',
            }
        }
    },

    {
        entry: {
            index: './tests/js/index'
        },
        output: {
            filename: 'tests/js/test.js'
        },
        module: loaders,
        externals: {uikit: 'UIkit'}
    }

];
