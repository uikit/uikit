var fs = require('fs');
var archiver = require('archiver');
var util = require('./util');

var info = require('../package.json');
var file = `dist/uikit-${info.version}.zip`;
var output = fs.createWriteStream(file).on('close', () => util.logFile(file));

var archive = archiver('zip');

archive.pipe(output);
archive.file('dist/js/uikit.js', {name: '/js/uikit.js'});
archive.file('dist/js/uikit.min.js', {name: '/js/uikit.min.js'});
archive.file('dist/js/uikit-icons.js', {name: '/js/uikit-icons.js'});
archive.file('dist/js/uikit-icons.min.js', {name: '/js/uikit-icons.min.js'});
archive.file('dist/css/uikit.css', {name: '/css/uikit.css'});
archive.file('dist/css/uikit.min.css', {name: '/css/uikit.min.css'});
archive.file('dist/css/uikit-rtl.css', {name: '/css/uikit-rtl.css'});
archive.file('dist/css/uikit-rtl.min.css', {name: '/css/uikit-rtl.min.css'});
archive.finalize();
