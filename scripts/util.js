var fs = require('fs');
var package = require('../package.json');
var version = process.env.VERSION || package.version;
var banner = `/*! UIkit ${version} | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */\n`;

exports.banner = banner;

exports.write = function (dest, code) {
    return new Promise((resolve, reject) =>
        fs.writeFile(dest, code, err => {
            if (err) {
                return reject(err);
            }
            console.log(`${exports.cyan(dest)} ${exports.getSize(code)}`);
            resolve();
        })
    );
};

exports.getSize = function (code) {
    return `${(code.length / 1024).toFixed(2)}kb`;
};

exports.cyan = function (str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
};
