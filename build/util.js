const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const less = require('less');
const SVGO = require('svgo');
const rollup = require('rollup');
const uglify = require('uglify-js');
const CleanCSS = require('clean-css');
const html = require('rollup-plugin-html');
const json = require('rollup-plugin-json');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const alias = require('rollup-plugin-import-alias');
const {version} = require('../package.json');
const banner = `/*! UIkit ${version} | http://www.getuikit.com | (c) 2014 - 2018 YOOtheme | MIT License */\n`;

exports.banner = banner;
exports.validClassName = /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/;

exports.read = async function (file, cb) {

    const data = await fs.readFile(file, 'utf8');
    cb && cb(data);
    return data;

};

exports.write = async function (dest, data) {

    const err = await fs.outputFile(dest, data);

    if (err) {
        console.log(err);
        throw err;
    }

    exports.logFile(dest);

    return dest;

};

exports.logFile = async function (file) {
    const data = await exports.read(file);
    console.log(`${exports.cyan(file)} ${exports.getSize(data)}`);
};

exports.getSize = function (data) {
    return `${(data.length / 1024).toFixed(2)}kb`;
};

exports.cyan = function (str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
};

exports.minify = async function (file) {
    const {styles} = await new CleanCSS({
        advanced: false,
        keepSpecialComments: 0,
        rebase: false,
        returnPromise: true
    }).minify([file]);

    await exports.write(`${path.join(path.dirname(file), path.basename(file, '.css'))}.min.css`, styles);

    return styles;

};

exports.uglify = async function (file) {
    file = path.join(path.dirname(file), path.basename(file, '.js'));
    return exports.write(
        `${file}.min.js`,
        uglify.minify(
            await exports.read(`${file}.js`),
            {output: {preamble: exports.banner}}
        ).code
    );
};

exports.renderLess = async function (data, options) {
    return (await less.render(data, options)).css;
};

exports.compile = async function (file, dest, {external, globals, name, aliases, bundled, replaces, minify = true}) {

    name = (name || '').replace(/[^\w]/g, '_');

    const bundle = await rollup.rollup({
        external,
        input: `${path.resolve(path.dirname(file), path.basename(file, '.js'))}.js`,
        plugins: [
            replace(Object.assign({
                BUNDLED: bundled || false,
                VERSION: `'${version}'`
            }, replaces)),
            alias({
                Paths: Object.assign({
                    'uikit-util': './src/js/util/index',
                }, aliases),
                Extensions: ['js', 'json']
            }),
            html({
                include: '**/*.svg',
                htmlMinifierOptions: {
                    collapseWhitespace: true
                }
            }),
            json(),
            buble({namedFunctionExpressions: false}),
        ]
    });

    let {code, map} = await bundle.generate({
        globals,
        format: 'umd',
        banner: exports.banner,
        amd: {id: `UIkit${name}`.toLowerCase()},
        name: `UIkit${exports.ucfirst(name)}`,
        sourcemap: !minify ? 'inline' : false
    });

    code = code.replace(/(>)\\n\s+|\\n\s+(<)/g, '$1 $2');

    return await Promise.all([
        exports.write(`${dest}.js`, code + (!minify ? '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' + new Buffer(map.toString()).toString('base64') : '')),
        minify ? exports.write(`${dest}.min.js`, uglify.minify(code, {output: {preamble: exports.banner}}).code) : null
    ])[0];

};

exports.icons = async function (src) {

    const svgo = new SVGO({

        plugins: [
            {removeViewBox: false},
            {
                cleanupNumericValues: {
                    floatPrecision: 3
                }
            },
            {convertPathData: false},
            {convertShapeToPath: false},
            {mergePaths: false},
            {removeDimensions: false},
            {removeStyleElement: false},
            {removeScriptElement: false},
            {removeUnknownsAndDefaults: false},
            {removeUselessStrokeAndFill: false}
        ]

    });
    const files = glob.sync(src, {nosort: true});
    const icons = await Promise.all(files.map(async file => {
        const data = await exports.read(file);
        const {data: svg} = await svgo.optimize(data);
        return svg;
    }));

    return JSON.stringify(files.reduce((result, file, i) => {
        result[path.basename(file, '.svg')] = icons[i];
        return result;
    }, {}), null, '    ');

};

exports.ucfirst = function (str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};
