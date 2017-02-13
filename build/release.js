var fs = require('fs');
var archiver = require('archiver');
var util = require('./util');

var info = require('../package.json');
var file = `dist/uikit-${info.version}.zip`;
var output = fs.createWriteStream(file).on('close', () =>
    console.log(`${util.cyan(file)} ${util.getSize(fs.readFileSync(file))}`)
);

var archive = archiver('zip');

archive.pipe(output);
archive.file('dist/js/uikit.min.js', {name: '/js/uikit.min.js'});
archive.file('dist/css/uikit.min.css', {name: '/css/uikit.min.css'});
archive.file('dist/css/uikit.rtl.min.css', {name: '/css/uikit.rtl.min.css'});
archive.directory('dist/images', '/images');
archive.finalize();
