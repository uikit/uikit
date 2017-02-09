var fs = require('fs');
var glob = require('glob');
var less = require('less');
var util = require('./util');

glob('dist/**/*.css', (err, files) =>
    files.forEach(file =>
        fs.readFile(file, 'utf8', (err, data) => {

            less.render(`.uk-noconflict {\n${data}\n}`).then(output => {

                data = output.css.replace(/\.uk-noconflict \{(.|[\r\n])*?\}/, '')
                    .replace(`.uk-noconflict html`, `.uk-noconflict`)
                    .replace(/\.uk-noconflict\s(\.(uk-(drag|modal-page|offcanvas-page|offcanvas-flip)))/g, '$1');

                fs.writeFile(file, data, err => {

                    if (err) {
                        throw err;
                    }

                    console.log(`${util.cyan(file)} ${util.getSize(data)}`);

                });

            }, error => console.log(error));

        })
    )
);
