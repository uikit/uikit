import path from 'path';
import camelize from 'camelcase';
import {__dirname, args, compile, glob, icons} from './util.js';

if (args.h || args.help) {

    console.log(`
        usage:

        build.js [componentA, componentB, ...] [-d|debug|nominify|development]

        examples:

        build.js // builds all of uikit, including icons and does minification (implies 'all')
        build.js uikit icons -d // builds all of uikit and the icons, skipping the minification
        build.js core lightbox -d // builds uikit-core and the lightbox, skipping the minification

        available components:

        bundles: ${Object.keys(steps).join(', ')}
        components: ${Object.keys(components).join(', ')}

    `);
    process.exit(0);
}

const minify = !(args.d || args.debug || args.nominify);
const uikit = getUIkitTasks(minify);
const components = await getComponentTasks(minify);

let tasks;
const allTasks = {...uikit, ...components};
if (args.all || Object.keys(args).length <= 1) {
    tasks = allTasks;
} else if (args.components) {
    tasks = components;
} else {
    tasks = Object.keys(args)
        .map(step => allTasks[step])
        .filter(t => t)
}

await Promise.all(Object.values(tasks).map(task => task()));

function getUIkitTasks(minify) {
    return {

        core: () => compile('src/js/uikit-core.js', 'dist/js/uikit-core', {minify}),

        uikit: () => compile('src/js/uikit.js', 'dist/js/uikit', {minify}),

        icons: async () => compile('build/wrapper/icons.js', 'dist/js/uikit-icons', {
                minify,
                name: 'icons',
                replaces: {ICONS: await icons('{src/images,custom}/icons/*.svg')}
            }
        ),

        tests: async () => compile('tests/js/index.js', 'tests/js/test', {
                minify,
                name: 'test',
                replaces: {TESTS: await getTestFiles()}
            }
        ),

    };
}

async function getComponentTasks(minify) {

    const components = await glob('src/js/components/!(index).js');

    return components.reduce((components, file) => {

        const name = path.basename(file, '.js');

        components[name] = () =>
            compile(`${__dirname}/wrapper/component.js`, `dist/js/components/${name}`, {
                name,
                minify,
                external: ['uikit', 'uikit-util'],
                globals: {uikit: 'UIkit', 'uikit-util': 'UIkit.util'},
                aliases: {component: path.resolve(__dirname, '../src/js/components', name)},
                replaces: {NAME: `'${camelize(name)}'`}
            });

        return components;

    }, {});
}

async function getTestFiles() {
    const files = await glob('tests/!(index).html', {nosort: true});
    return JSON.stringify(files.map(file => path.basename(file, '.html')));
}
