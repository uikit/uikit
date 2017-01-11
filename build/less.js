var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var write = require('./util').write;
var glob = require('glob');

glob(`dist/css/!(*.min).css`, (err, files) =>
    files.forEach(file =>
        fs.readFile(file, 'utf8', (err, data) =>
            fs.writeFile(file, data.replace(/\.\.\/dist\//g, ''), err =>
                err && console.log(err)
            )
        )
    )
);

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

    themes[theme] = {file: `../dist/css/uikit.${theme}.css`};

    exec(`lessc --relative-urls --rootpath=../custom/ custom/${theme}.less > dist/css/uikit.${theme}.css`, (error, stdout, stderr) => {

        if (stderr) {
            console.log(`Error building: dist/css/uikit.${theme}.css `, stderr);
        } else {
            console.log(`dist/css/uikit.${theme}.css build `);
        }
    });
});

if (Object.keys(themes).length) {
    write('themes.json', JSON.stringify(themes));
}
