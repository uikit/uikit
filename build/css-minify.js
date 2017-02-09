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
        }).minify([file], (err, minified) => util.write(`${file.substr(0, file.length - 4)}.min${file.substr(-4)}`, minified.styles));
    })
});
