var fs = require('fs');
var glob = require('glob');
var concat = require('concat-files');
var uglify = require('uglify-js');
var util = require('./util');

var dist = 'dist/js';
var src = `${dist}/uikit.js`;

glob(`${dist}/components/**/!(*.min).js`, (err, files) => {

    concat([`${dist}/uikit-core.js`].concat(files), src, err => {

        if (err) {
            throw err;
        }

        console.log(`${util.cyan(src)} ${util.getSize(fs.readFileSync(src))}`);
        util.write(`${dist}/uikit.min.js`, `${util.banner}\n${uglify.minify(src).code}`);
    });

});
