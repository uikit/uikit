var fs = require('fs');
var path = require('path');
var glob = require('glob');

var src = 'src/images';
var dist = 'dist/images';

['dist', dist].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

// create icons file
glob(`${src}/symbols/*.svg`, (er, files) => {

    var icons = [], contents;

    files.forEach((f) => {
        contents = fs.readFileSync(f).toString()
            .replace('<svg ', `<symbol id="${path.basename(f, '.svg')}" `)
            .replace('</svg>', '</symbol>')
            //.replace(/ stroke="(.*?)"/g, '')
            .replace(/<symbol(.*?) height="(.*?)"/g, '<symbol$1')
            .replace(/<symbol(.*?) width="(.*?)"/g, '<symbol$1')
            .replace(' xmlns="http://www.w3.org/2000/svg"', '');

        icons.push(contents);
    });

    fs.writeFileSync(`${dist}/icons.svg`, `<svg xmlns="http://www.w3.org/2000/svg">\n\n${icons.join("\n\n")}\n\n</svg>`);

});

// copy images/*.svg
glob(`${src}/backgrounds/*.svg`, (er, files) => {
    files.forEach(f => fs.createReadStream(f).pipe(fs.createWriteStream(`${dist}/${path.basename(f)}`)));
});


// copy images/*.svg
glob(`${src}/components/*.svg`, (er, files) => {

    var contents;

    files.forEach((f) => {
        contents = fs.readFileSync(f).toString()
                    // .replace(/ stroke="(.*?)"/g, '')
                    // .replace(/<svg(.*?) height="(.*?)"/g, '<svg$1')
                    // .replace(/<svg(.*?) width="(.*?)"/g, '<svg$1')
                    // .replace(' xmlns="http://www.w3.org/2000/svg"', '');

        fs.writeFileSync(`${dist}/${path.basename(f)}`, contents);
    })
});
