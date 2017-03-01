var fs = require('fs');
var path = require('path');
var glob = require('glob');
var util = require('./util');
var args = require('minimist')(process.argv);

var prefix = args.p || args.prefix || false;

if (!prefix) {
    return console.log('No prefix defined');
}

glob('dist/**/*.css', (err, files) =>
    files.forEach(file =>
        util.read(file, data =>
            util.write(file, data.replace(/uk-([a-z\d\-]+)/g, `${prefix}-$1`))
        )
    )
);

glob('dist/**/*.js', (err, files) =>
    files.forEach(file =>
        util.read(file, data =>
            util.write(file, data.replace(/uk-/g, `${prefix}-`).replace(/UIkit/g, `${prefix}UIkit`))
        )
    )
);
