var fs = require('fs');
var glob = require('glob');
var less = require('less');
var path = require('path');
var {read, write, writeSync} = require('./util');

var themes = {}, promises = [];

glob.sync('custom/*.less').forEach(file => {

    var theme = path.basename(file, '.less'),
        dist = `dist/css/uikit.${theme}.css`,
        data = fs.readFileSync(file, 'utf8');

    themes[theme] = {file: `../${dist}`};

    promises.push(less.render(data, {
        relativeUrls: true,
        rootpath: '../../dist',
        paths: ['custom/']
    }).then(
        output => writeSync(dist, output.css),
        error => console.log(error)
    ));

});

if (Object.keys(themes).length) {
    write('themes.json', JSON.stringify(themes));
}

Promise.all(promises).then(() => {
    glob(`dist/css/!(*.min).css`, (err, files) =>
        files.forEach(file =>
            read(file, data =>
                write(file, data.replace(/\.\.\/dist\//g, ''))
            )
        )
    );
});
