var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var glob = require('glob');


// create icons file
glob('src/images/symbols/*.svg', (er, files) => {

    var icons = [], contents;

    files.forEach((f) => {
        contents = fs.readFileSync(f).toString()
            .replace('<svg ', `<symbol id="${path.basename(f, '.svg')}" `)
            .replace('</svg>', '</svg>')
            .replace(/ stroke="(.*?)"/g, '')
            .replace(' xmlns="http://www.w3.org/2000/svg"', '');

        icons.push(contents);
    });

    fs.writeFileSync('images/icons.svg', `<svg xmlns="http://www.w3.org/2000/svg">\n\n${icons.join("\n\n")}\n\n</svg>`);

});

// copy images/*.svg
glob('src/images/*.svg', (er, files) => {
    files.forEach(f => fs.createReadStream(f).pipe(fs.createWriteStream(`images/${path.basename(f)}`)));
});


// copy images/*.svg
glob('src/images/components/*.svg', (er, files) => {

    var contents;

    files.forEach((f) => {
        contents = fs.readFileSync(f).toString().replace(/ stroke="#000000"/g, '');
        fs.writeFileSync(`images/${path.basename(f)}`, contents);
    })
});
