var fs = require('fs');
var glob = require('glob');
var util = require('./util');
var shortid = require('shortid');
var args = require('minimist')(process.argv);

var custom = args.c || args.custom || 'custom/*/icons';
var match = args.n || args.name || '([a-z]+)/icons$';

glob(custom, (err, folders) =>
    folders.forEach(folder => {

        var name = folder.toString().match(new RegExp(match, 'i'))[1];
        var icons = `dist/${name}${shortid.generate()}`;

        util.write(`${icons}.json`, util.icons(`{src/images/icons,${folder}}/*.svg`)).then(() =>
            util.compile('src/js/icons.js', `dist/js/uikit-icons-${name}`, [], {}, name, {icons}).then(() =>
                fs.unlink(`${icons}.json`, () => {})
            )
        )

    })
);
