var fs = require('fs');
var path = require('path');
var glob = require('glob');
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var package = require('./package.json');
var version = process.env.VERSION || package.version;
var banner = `/*! UIkit ${version} | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */\n`;

['js', 'js/components'].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

compile('src/js/uikit.js', 'js/uikit', ['jquery'], {jquery: 'jQuery'});
compile('tests/js/index.js', 'tests/js/test', ['jquery'], {jquery: 'jQuery'});
glob('src/js/components/**/*.js', (er, files) => files.forEach(file => compile(file, file.substring(4, file.length - 3), ['jquery', 'uikit'], {jquery: 'jQuery', uikit: 'UIkit'})));

function compile(file, dest, external, globals) {

    var entry = path.resolve(path.dirname(file), path.basename(file, '.js'));

    rollup.rollup({
        external,
        entry: `${entry}.js`,
        plugins: [
            babel({presets: ['es2015-rollup']}),
            resolve({main: true, jsnext: true})
        ]
    })
        .then(function (bundle) {
            return write(`${dest}.js`, bundle.generate({
                globals,
                format: 'umd',
                banner: banner,
                moduleName: 'UIkit'
            }).code);
        })
        .then(function () {
            return write(
                `${dest}.min.js`,
                `${banner}\n${uglify.minify(`${dest}.js`).code}`
            );
        })
        .catch(console.log);
}

function write(dest, code) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(dest, code, function (err) {
            if (err) return reject(err);
            console.log(`${cyan(dest)} ${getSize(code)}`);
            resolve();
        });
    });
}

function getSize(code) {
    return `${(code.length / 1024).toFixed(2)}kb`;
}

function cyan(str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
}
