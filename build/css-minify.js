var fs = require('fs');
var CleanCSS = require('clean-css');
var glob = require('glob');
var util = require('./util');

glob('dist/css/{uikit-core,uikit}.css', (err, files) => {
    files.forEach(file => {
        new CleanCSS({
            advanced: false,
            keepSpecialComments: 0,
            rebase: false
        }).minify([file], (err, minified) => {

            var dist = `${file.substr(0, file.length - 4)}.min${file.substr(-4)}`;

            fs.writeFile(dist, minified.styles, err => {

                if (err) {
                    throw err;
                }

                console.log(`${util.cyan(dist)} ${util.getSize(fs.readFileSync(dist))}`);
            });
        });
    })
});
