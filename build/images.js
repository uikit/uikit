var fs = require('fs');
var path = require('path');
var glob = require('glob');
var util = require('./util');

var src = 'src/images';
var dist = 'dist/images';

['dist', dist].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

// create icons file
glob(`${src}/symbols/*.svg`, (err, files) =>
    util.write(`${dist}/icons.svg`, `<svg xmlns="http://www.w3.org/2000/svg">\n\n${
        files.map(file => fs.readFileSync(file)
            .toString()
            .replace('<svg ', `<symbol id="${path.basename(file, '.svg')}" `)
            .replace('</svg>', '</symbol>')
            //.replace(/ stroke="(.*?)"/g, '')
            .replace(/<symbol(.*?) height="(.*?)"/g, '<symbol$1')
            .replace(/<symbol(.*?) width="(.*?)"/g, '<symbol$1')
            .replace(' xmlns="http://www.w3.org/2000/svg"', '')
        ).join("\n\n")
    }\n\n</svg>`)
);
