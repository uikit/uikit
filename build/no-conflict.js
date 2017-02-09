var fs = require('fs');
var glob = require('glob');
var less = require('less');
var {read, write} = require('./util');

glob('dist/**/*.css', (err, files) =>
    files.forEach(file =>
        read(file, data =>

            less.render(`.uk-noconflict {\n${data}\n}`).then(output => {

                write(file, output.css
                    .replace(/\.uk-noconflict \{(.|[\r\n])*?\}/, '')
                    .replace(`.uk-noconflict html`, `.uk-noconflict`)
                    .replace(/\.uk-noconflict\s(\.(uk-(drag|modal-page|offcanvas-page|offcanvas-flip)))/g, '$1')
                );

            }, error => console.log(error))

        )
    )
);
