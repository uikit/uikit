var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var write = require('./util').write;


// build custom/*
if (!fs.existsSync('themes.json') && !fs.existsSync('custom')) {
    return write('themes.json', '{}');
}

if (!fs.existsSync('custom')) {
    return;
}

var themes = {};

fs.readdirSync('custom').filter(file => path.join('custom', file).match(/\.less$/)).forEach(theme => {

    theme = path.basename(theme, '.less');

    themes[theme] = {file: `../css/uikit.${theme}.css`};

    exec(`lessc --relative-urls --rootpath=../custom/ custom/${theme}.less > css/uikit.${theme}.css`, () => {
        console.log(`${'css/uikit.'+theme+'.css'} build`);
    });
});

if (Object.keys(themes).length) {
    write('themes.json', JSON.stringify(themes));
}
