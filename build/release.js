var fs = require('fs');
var archiver = require('archiver');
var util = require('./util');

var info = require('../package.json');
var file = `dist/uikit-${info.version}.zip`;
var output = fs.createWriteStream(file);

var archive = archiver('zip');

// listen for all archive data to be written
output.on('close', function() {
    console.log(`${util.cyan(file)} ${util.getSize(fs.readFileSync(file))}`);
});

// pipe archive data to the file
archive.pipe(output);

archive.file('dist/js/uikit.min.js', {name: '/js/uikit.min.js'});
archive.file('dist/css/uikit.min.css', {name: '/css/uikit.min.css'});
archive.directory('dist/images', '/images');

// finalize the archive (ie we are done appending files but streams have to finish yet)
archive.finalize();
