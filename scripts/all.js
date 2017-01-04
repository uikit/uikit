var fs = require('fs');
var glob = require('glob');
var concat = require('concat-files');
var uglify = require('uglify-js');
var util = require('./util');

glob('js/components/**/!(*.min).js', (err, files) => {

    concat(['js/uikit-core.js'].concat(files), 'js/uikit.js', err => {
        if (err) {
            throw err;
        }

        console.log(`${util.cyan('js/uikit.js')} ${util.getSize(fs.readFileSync('js/uikit.js'))}`);
        util.write(`js/uikit.min.js`, `${util.banner}\n${uglify.minify('js/uikit.js').code}`);
    });

});
