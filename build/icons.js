const {compile, glob, icons} = require('./util');
const args = require('minimist')(process.argv);

const path = args.c || args.custom || 'custom/*/icons';
const match = args.n || args.name || '([a-z]+)/icons$';

run();

async function run() {
    const folders = await glob(path);
    return Promise.all(folders.map(compileIcons));
}

async function compileIcons(folder) {
    const [, name] = folder.toString().match(new RegExp(match, 'i'));
    const ICONS = await icons(`{src/images/icons,${folder}}/*.svg`);
    return compile('src/js/icons.js', `dist/js/uikit-icons-${name}`, {name, replaces: {ICONS}});
}
