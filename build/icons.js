import {args, compile, glob, icons} from './util.js';

const path = args.c || args.custom || 'custom/*/icons';
const match = args.n || args.name || '([a-z]+)/icons$';

await Promise.all((await glob(path)).map(compileIcons));

async function compileIcons(folder) {
    const [, name] = folder.toString().match(new RegExp(match, 'i'));
    const ICONS = await icons(`{src/images/icons,${folder}}/*.svg`);
    return compile('build/wrapper/icons.js', `dist/js/uikit-icons-${name}`, {name, replaces: {ICONS}});
}
