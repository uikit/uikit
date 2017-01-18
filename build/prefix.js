var fs = require('fs');
var path = require('path');
var glob = require('glob');
var args = require('minimist')(process.argv);

let prefix = args.p || args.prefix || false;

if (!prefix) {
    return console.log('No prefix defined');
}

glob('dist/**/*.css', (err, files) =>
    files.forEach(file =>
        fs.readFile(file, 'utf8', (err, data) =>
            fs.writeFile(file, data.replace(/(uk-([a-z\d\-]+))/g, `${prefix}-$2`), err => err && console.log(err))
        )
    )
);

glob('dist/**/*.js', (err, files) =>
    files.forEach(file =>
        fs.readFile(file, 'utf8', (err, data) => {

            data = data.replace(/(uk-([a-z\d\-]+))/g, `${prefix}-$2`)
                       .replace(/data-uk-/g, `data-${prefix}-`)
                       .replace(/UIkit/g, `${prefix}UIkit`);

            fs.writeFile(file, data, err => err && console.log(err));

        })
    )
);
