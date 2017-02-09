var fs = require('fs');
var path = require('path');
var glob = require('glob');
var args = require('minimist')(process.argv);
var {read, write} = require('./util');

let prefix = args.p || args.prefix || false;

if (!prefix) {
    return console.log('No prefix defined');
}

glob('dist/**/*.css', (err, files) =>
    files.forEach(file =>
        read(file, data =>
            write(file, data.replace(/(uk-([a-z\d\-]+))/g, `${prefix}-$2`)
            )
        )
    )
);

glob('dist/**/*.js', (err, files) =>
    files.forEach(file =>
        read(file, data =>
            write(file, data.replace(/uk-/g, `${prefix}-`).replace(/UIkit/g, `${prefix}UIkit`))
        )
    )
);
