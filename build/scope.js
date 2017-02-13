var fs = require('fs');
var glob = require('glob');
var less = require('less');
var util = require('./util');

glob('dist/**/!(*.min).css', (err, files) =>
    files.forEach(file =>
        util.read(file, data =>

            less.render(`.uk-scope {\n${data}\n}`).then(output => {

                util.write(file, output.css
                    .replace(/\.uk-scope \{(.|[\r\n])*?}/, '')
                    .replace(/\.uk-scope\s((\.(uk-(drag|modal-page|offcanvas-page|offcanvas-flip)))|html)/g, '$1')
                );

            }, error => console.log(error))

        )
    )
);
