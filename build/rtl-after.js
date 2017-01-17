// Takes a built version and changes the CSS files to be an RTL version.
// Run this script AFTER less files have been compiled to css

var rtl = require('../src/js/util/rtl');

var fs = require('fs');
var glob = require('glob');


// CSS
// ----------------

glob('dist/css/!(*.rtl).css', (err, files) =>
    files.forEach(file =>
        fs.readFile(file, 'utf8', (err, data) => {

            var target = file.replace(/(.min)?\.css/, '.rtl$1.css');

            fs.writeFile(target, rtl.convert(data), err => {
                if (err) {
                    throw err;
                }
                console.log(`${target} build`);
            })
        })
    )
);


