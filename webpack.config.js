/* eslint-env node */
const {resolve} = require('path');
const webpack = require('webpack');
const {icons} = require('./build/util');
const {version} = require('./package.json');
const circular = require('circular-dependency-plugin');

const rules = {
    rules: [
        {
            test: /\.svg$/,
            use: 'raw-loader'
        }
    ]
};

module.exports = [

    {
        entry: './src/js/uikit',
        output: {
            path: __dirname,
            filename: 'dist/js/uikit.js',
            library: 'UIkit',
            libraryExport: 'default',
            libraryTarget: 'umd'
        },
        mode: 'development',
        module: rules,
        plugins: [
            new circular(),
            new webpack.DefinePlugin({
                BUNDLED: true,
                VERSION: `'${version}'`
            }),
            new webpack.optimize.ModuleConcatenationPlugin()
        ],
        resolve: {
            alias: {
                'uikit-util': resolve(__dirname, 'src/js/util')
            }
        }
    },

    {
        entry: './src/js/uikit',
        output: {
            path: __dirname,
            filename: 'dist/js/uikit.min.js',
            library: 'UIkit',
            libraryExport: 'default',
            libraryTarget: 'umd'
        },
        mode: 'production',
        module: rules,
        plugins: [
            new circular(),
            new webpack.DefinePlugin({
                BUNDLED: true,
                VERSION: `'${version}'`
            }),
            new webpack.optimize.ModuleConcatenationPlugin()
        ],
        resolve: {
            alias: {
                'uikit-util': resolve(__dirname, 'src/js/util')
            }
        }
    },

    {
        entry: './src/js/icons',
        output: {
            path: __dirname,
            filename: 'dist/js/uikit-icons.js',
            library: 'UIkitIcons',
            libraryExport: 'default',
            libraryTarget: 'umd'
        },
        mode: 'development',
        module: rules,
        plugins: [
            new webpack.DefinePlugin({
                ICONS: icons('src/images/icons/*.svg')
            })
        ],
        resolve: {
            alias: {
                'icons$': resolve(__dirname, 'dist/icons.json'),
            }
        }
    },

    {
        entry: {
            index: './tests/js/index'
        },
        output: {
            path: __dirname,
            filename: 'tests/js/test.js'
        },
        mode: 'development',
        externals: {uikit: 'UIkit'},
        resolve: {
            alias: {
                'uikit-util': resolve(__dirname, 'src/js/util')
            }
        }
    }

];
