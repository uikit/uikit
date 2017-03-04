var fs = require('fs');
var glob = require('glob');
var path = require('path');
var util = require('./util');
var args = require('minimist')(process.argv);

var custom = args.c || args.custom || 'custom/*/icons';
var match = args.n || args.name || '([a-z]+)/icons$';

glob(custom, (err, folders) =>
    folders.forEach(folder => {
        var name = folder.toString().match(new RegExp(match, 'i'))[1];
        util.write(`dist/${name}.json`, util.icons(`{src/images/icons,${folder}}/*.svg`)).then(file =>
            util.compile('src/js/icons.js', `dist/js/uikit-icons-${name}`, [], {}, name, {icons: `dist/${name}`}).then(() =>
                fs.unlink(`dist/${name}.json`, () => {})
            )
        )
    })
);
