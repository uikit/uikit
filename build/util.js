var fs = require('fs');
var path = require('path');
var glob = require('glob');
var less = require('less');
var mkdirp = require('mkdirp');
var uglify = require('uglify-js');
var CleanCSS = require('clean-css');
var package = require('../package.json');
var version = process.env.VERSION || package.version;
var banner = `/*! UIkit ${version} | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */\n`;

exports.banner = banner;

exports.read = function (file, callback) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {

            if (err) {
                return reject(err);
            }

            resolve(data);
            callback && callback(data);

        });
    });
};

exports.write = function (dest, data) {
    return new Promise((resolve, reject) =>
        mkdirp(path.dirname(dest), err => {

            if (err) {
                reject(err);
            }

            fs.writeFile(dest, data, err => {
                if (err) {
                    return reject(err);
                }
                exports.logFile(dest);
                resolve(dest);
            })

        })
    );
};

exports.logFile = function (file) {
    exports.read(file).then(data => console.log(`${exports.cyan(file)} ${exports.getSize(data)}`));
};

exports.getSize = function (data) {
    return `${(data.length / 1024).toFixed(2)}kb`;
};

exports.cyan = function (str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
};

exports.minify = function (file) {
    return new CleanCSS({
        advanced: false,
        keepSpecialComments: 0,
        rebase: false,
        returnPromise: true
    }).minify([file]).then(minified => exports.write(`${path.join(path.dirname(file), path.basename(file, '.css'))}.min.css`, minified.styles));
};

exports.uglify = function (file) {
    file = path.join(path.dirname(file), path.basename(file, '.js'));
    return exports.write(`${file}.min.js`, `${exports.banner}\n${uglify.minify(`${file}.js`).code}`);
};

exports.renderLess = function (data, options) {
    return less.render(data, options).then(output => output.css);
};

exports.icons = function (src) {
    return JSON.stringify(glob.sync(src).reduce((icons, file) => {
        icons[path.basename(file, '.svg')] = fs.readFileSync(file).toString().trim().replace(/\n/g, '').replace(/>\s+</g, '><');
        return icons;
    }, {}), null, '    ');
};

exports.makeRelative = function (data) {
    return data.replace(/\.\.\/dist\//g, '');
};

exports.ucfirst = function (str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};
