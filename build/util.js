var fs = require('fs');
var glob = require('glob');
var CleanCSS = require('clean-css');
var package = require('../package.json');
var version = process.env.VERSION || package.version;
var banner = `/*! UIkit ${version} | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */\n`;

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

exports.write = function (dest, code) {
    return new Promise((resolve, reject) =>
        fs.writeFile(dest, code, err => {
            if (err) {
                return reject(err);
            }
            console.log(`${exports.cyan(dest)} ${exports.getSize(code)}`);
            resolve(dest);
        })
    );
};

exports.getSize = function (code) {
    return `${(code.length / 1024).toFixed(2)}kb`;
};

exports.cyan = function (str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
};

exports.makeRelative = function (files) {
    return new Promise((resolve, reject) => {
        glob(files, (err, files) =>
            Promise.all(files.map(file =>
                exports.read(file).then(data =>
                    exports.write(file, data.replace(/\.\.\/dist\//g, ''))
                )
            )).then(resolve, reject)
        );
    });
};

exports.minify = function (files) {
    return new Promise((resolve, reject) => {
        glob(files, (err, files) => {
            Promise.all(files.map(file =>
                new Promise((resolve, reject) =>
                    new CleanCSS({
                        advanced: false,
                        keepSpecialComments: 0,
                        rebase: false
                    }).minify([file], (err, minified) => exports.write(`${file.substr(0, file.length - 4)}.min${file.substr(-4)}`, minified.styles).then(resolve, reject))
                )
            )).then(resolve, reject)
        });
    });
};

exports.ucfirst= function (str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};
