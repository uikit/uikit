var fs = require('fs-extra');
var path = require('path');
var glob = require('glob');
var less = require('less');
var rollup = require('rollup');
var uglify = require('uglify-js');
var CleanCSS = require('clean-css');
var html = require('rollup-plugin-html');
var json = require('rollup-plugin-json');
var buble = require('rollup-plugin-buble');
var replace = require('rollup-plugin-replace');
var alias = require('rollup-plugin-import-alias');
var version = require('../package.json').version;
var banner = `/*! UIkit ${version} | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */\n`;

exports.banner = banner;
exports.validClassName = /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/;

exports.read = async function (file, cb) {

    var data = await fs.readFile(file, 'utf8');
    cb && cb(data);
    return data;

};

exports.write = async function (dest, data) {

    var err = await fs.outputFile(dest, data);

    if (err) {
        console.log(err);
        throw err;
    }

    exports.logFile(dest);

    return dest;

};

exports.logFile = async function (file) {
    var data = await exports.read(file);
    console.log(`${exports.cyan(file)} ${exports.getSize(data)}`);
};

exports.getSize = function (data) {
    return `${(data.length / 1024).toFixed(2)}kb`;
};

exports.cyan = function (str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
};

exports.minify = async function (file) {
    var {styles} = await new CleanCSS({
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

exports.renderLess = function (data, options) {
    return less.render(data, options).then(output => output.css);
};

exports.compile = async function (file, dest, {external, globals, name, aliases, bundled, minify = true}) {

    name = (name || '').replace(/[^\w]/g, '_');

    var bundle = await rollup.rollup({
        external,
        input: `${path.resolve(path.dirname(file), path.basename(file, '.js'))}.js`,
        plugins: [
            replace({
                BUNDLED: bundled || false,
                VERSION: `'${version}'`
            }),
            alias({
                Paths: aliases || {},
                Extensions: ['js', 'json']
            }),
            html({
                include: '**/*.svg',
                htmlMinifierOptions: {
                    collapseWhitespace: true
                }
            }),
            json(),
            buble(),
        ]
    });

    var {code, map} = await bundle.generate({
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

exports.icons = function (src) {
    return JSON.stringify(glob.sync(src, {nosort: true}).reduce((icons, file) => {
        icons[path.basename(file, '.svg')] = fs.readFileSync(file).toString().trim().replace(/\n/g, '').replace(/>\s+</g, '> <');
        return icons;
    }, {}), null, '    ');
};

exports.ucfirst = function (str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};
