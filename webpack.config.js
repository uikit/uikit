/* eslint-env node */
const fs = require('fs');
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
            libraryExport: 'default'
        },
        mode: 'development',
        module: rules,
        plugins: [
            new circular,
            new webpack.DefinePlugin({
                BUNDLED: true,
                VERSION: `'${version}'`
            }),
            new webpack.optimize.ModuleConcatenationPlugin()
        ],
        resolve: {
            alias: {
                'uikit-mixin': resolve(__dirname, 'src/js/mixin'),
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
            libraryExport: 'default'
        },
        mode: 'production',
        module: rules,
        plugins: [
            new circular,
            new webpack.DefinePlugin({
                BUNDLED: true,
                VERSION: `'${version}'`
            }),
            new webpack.optimize.ModuleConcatenationPlugin()
        ],
        resolve: {
            alias: {
                'uikit-mixin': resolve(__dirname, 'src/js/mixin'),
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
            libraryExport: 'default'
        },
        mode: 'development',
        module: rules,
        plugins: [
            {

                apply(compiler) {

                    compiler.plugin('after-plugins', () => fs.writeFileSync('dist/icons.json', icons('src/images/icons/*.svg')));
                    compiler.plugin('done', () => fs.unlink('dist/icons.json', () => {}));

                }

            }
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
