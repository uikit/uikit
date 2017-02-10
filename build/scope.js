var fs = require('fs');
var glob = require('glob');
var less = require('less');
var {read, write} = require('./util');

glob('dist/**/*.css', (err, files) =>
    files.forEach(file =>
        read(file, data =>

            less.render(`.uk-scope {\n${data}\n}`).then(output => {

                write(file, output.css
                    .replace(/\.uk-scope \{(.|[\r\n])*?\}/, '')
                    .replace(`.uk-scope html`, `.uk-scope`)
                    .replace(/\.uk-scope\s(\.(uk-(drag|modal-page|offcanvas-page|offcanvas-flip)))/g, '$1')
                );

            }, error => console.log(error))

        )
    )
);
