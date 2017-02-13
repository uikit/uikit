var fs = require('fs');
var path = require('path');
var glob = require('glob');
var rollup = require('rollup');
var uglify = require('uglify-js');
var buble = require('rollup-plugin-buble');
var resolve = require('rollup-plugin-node-resolve');
var util = require('./util');

['dist', 'dist/js', 'dist/js/components'].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

compile('src/js/uikit.js', 'dist/js/uikit-core', ['jquery'], {jquery: 'jQuery'});
compile('tests/js/index.js', 'tests/js/test', ['jquery'], {jquery: 'jQuery'}, 'test');

glob('src/js/components/**/*.js', (er, files) =>
    files.forEach(file =>
        compile(file, `dist/${file.substring(4, file.length - 3)}`, ['jquery', 'uikit'], {jquery: 'jQuery', uikit: 'UIkit'}, path.basename(file, '.js').replace())));

function compile(file, dest, external, globals, name) {

    rollup.rollup({
        external,
        entry: `${path.resolve(path.dirname(file), path.basename(file, '.js'))}.js`,
        plugins: [
            buble()
        ]
    })
        .then(bundle => util.write(`${dest}.js`, bundle.generate({
            globals,
            format: 'umd',
            banner: util.banner,
            moduleName: `UIkit${name ? '' + util.ucfirst(name) : ''}`
        }).code))
        .then(() => util.write(`${dest}.min.js`, `${util.banner}\n${uglify.minify(`${dest}.js`).code}`))
        .catch(console.log);
}
