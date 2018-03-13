/* eslint-env node */
const fs = require('fs');
const glob = require('glob');
const util = require('./util');
const shortid = require('shortid');
const args = require('minimist')(process.argv);

const custom = args.c || args.custom || 'custom/*/icons';
const match = args.n || args.name || '([a-z]+)/icons$';

glob(custom, (err, folders) =>
    folders.forEach(folder => {

        const [, name] = folder.toString().match(new RegExp(match, 'i'));
        const icons = `dist/${name}${shortid.generate()}`;

        util.write(`${icons}.json`, util.icons(`{src/images/icons,${folder}}/*.svg`)).then(() =>
            util.compile('src/js/icons.js', `dist/js/uikit-icons-${name}`, {name, aliases: {icons}}).then(() =>
                fs.unlink(`${icons}.json`, () => {})
            )
        );

    })
);
