import { args, compile, glob, icons } from './util.js';

if (args.h || args.help) {
    console.log(`

        Builds additional custom uikit icons found in './custom/*/icons'

        usage:

        icons.js [custom|name]

        -c|--custom
            Specify custom folder to look for icons (default: './custom/*/icons')
        -n|--name
            Specify name regex to match against folder (default: '([a-z]+)/icons$')

    `);
    process.exit(0);
}

const path = args.c || args.custom || 'custom/*/icons';
const match = args.n || args.name || '([a-z]+)/icons$';

await Promise.all((await glob(path)).map(compileIcons));

async function compileIcons(folder) {
    const [, name] = folder.toString().match(new RegExp(match, 'i'));
    return compile('build/wrapper/icons.js', `dist/js/uikit-icons-${name}`, {
        name,
        replaces: {
            ICONS: await icons(`{src/images/icons,${folder}}/*.svg`),
        },
    });
}
