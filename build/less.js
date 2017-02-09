var fs = require('fs');
var util = require('./util');
var glob = require('glob');
var less = require('less');

var write = util.write;

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

glob.sync('custom/*.less').forEach(file => {

    var theme = file.match(/custom\/(.*)\.less$/)[1],
        dist = `dist/css/uikit.${theme}.css`;

    themes[theme] = {file: `../${dist}`};

    fs.readFile(file, 'utf8', (err, data) => {

        less.render(data, {
            relativeUrls: true,
            rootpath: '../custom/',
            paths: ['custom/']
        }).then(output => {

            file = file.replace(/\.less$/, '.css');

            fs.writeFile(dist, output.css, err => {

                if (err) {
                    throw err;
                }

                console.log(`${util.cyan(dist)} ${util.getSize(output.css)}`);

            });

        }, error => console.log(error))
    })
    }
);

if (Object.keys(themes).length) {
    write('themes.json', JSON.stringify(themes));
}
