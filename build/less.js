import {basename} from 'path';
import rtlcss from 'rtlcss';
import postcss from 'postcss';
import {args, banner, glob, minify, pathExists, read, readJson, renderLess, write} from './util.js';

const rtl = args.rtl;
const develop = args.develop || args.debug || args.d || args.nominify;
const sources = [
    {src: 'src/less/uikit.less', dist: `dist/css/uikit-core${rtl ? '-rtl' : ''}.css`},
    {src: 'src/less/uikit.theme.less', dist: `dist/css/uikit${rtl ? '-rtl' : ''}.css`}
];

const themes = await pathExists('themes.json') ? await readJson('themes.json') : {};

for (const src of await glob('custom/*.less')) {
    const theme = basename(src, '.less');
    const dist = `dist/css/uikit.${theme}${rtl ? '-rtl' : ''}.css`;

    themes[theme] = {css: `../${dist}`};

    if (await pathExists(`dist/js/uikit-icons-${theme}.js`)) {
        themes[theme].icons = `../dist/js/uikit-icons-${theme}.js`;
    }

    sources.push({src, dist});
}

await Promise.all(sources.map(({src, dist}) => compile(src, dist, develop, rtl)))

if (!rtl && (Object.keys(themes).length || !await pathExists('themes.json'))) {
    await write('themes.json', JSON.stringify(themes));
}

async function compile(file, dist, develop, rtl) {

    const less = await read(file);

    let output = (await renderLess(less, {
        relativeUrls: true,
        rootpath: '../../',
        paths: ['src/less/', 'custom/']
    })).replace(/\.\.\/dist\//g, '');

    if (rtl) {
        output = postcss([
            css => {
                css.insertBefore(css.nodes[0], postcss.comment({text: 'rtl:begin:rename'}));
                css.insertAfter(css.nodes[css.nodes.length - 1], postcss.comment({text: 'rtl:end:rename'}));
            },
            rtlcss({
                stringMap: [{
                    name: 'previous-next',
                    priority: 100,
                    search: ['previous', 'Previous', 'PREVIOUS'],
                    replace: ['next', 'Next', 'NEXT'],
                    options: {
                        scope: '*',
                        ignoreCase: false
                    }
                }]
            })
        ]).process(output).css;

        output = output.replace(/stroke-dashoffset: (\d+)px/g, 'stroke-dashoffset: -$1px');
    }

    await write(dist, banner + output);

    if (!develop) {
        await minify(dist);
    }

}
