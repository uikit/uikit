// Takes a built version and changes the CSS files to be an RTL version.
// Run this script AFTER less files have been compiled to css

var fs = require('fs');
var glob = require('glob');
var {read, write} = require('./util');
var rtl = require('../src/js/util/rtl');

// CSS
// ----------------

glob('dist/css/!(*.rtl).css', (err, files) =>
    files.forEach(file =>
        read(file, data =>
            write(file.replace(/(.min)?\.css/, '.rtl$1.css'), rtl.convert(data))
        )
    )
);


