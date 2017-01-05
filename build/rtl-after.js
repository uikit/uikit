// Takes a built version and changes the CSS files to be an RTL version.
// Run this script AFTER less files have been compiled to css

var rtl = require('../src/js/util/rtl');

var fs = require('fs');
var glob = require('glob');


// CSS
// ----------------

glob('dist/css/*.css', (er, files) => {

    files.forEach((f) => {
        contents = fs.readFileSync(f).toString();
        contents = rtl.convert(contents);
        if (!f.match('.rtl.css$')) { // don't do it twice
            fs.writeFileSync(f.replace('.css', '.rtl.css'), contents);
        }
    });

});


