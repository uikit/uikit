var glob = require('glob');
var util = require('./util');

glob('dist/**/!(*.min).css', (err, files) =>
    files.forEach(file =>
        util.read(file, data =>
            util.renderLess(`.uk-scope {\n${data}\n}`).then(
                output => util.write(file, output
                    .replace(/\.uk-scope \{(.|[\r\n])*?}/, '')
                    .replace(/\.uk-scope\s((\.(uk-(drag|modal-page|offcanvas-page|offcanvas-flip)))|html)/g, '$1')
                ).then(util.minify),
                error => console.log(error)
            )
        )
    )
);
