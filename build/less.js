import { glob } from 'glob';
import rtlcss from 'rtlcss';
import { basename } from 'path';
import { args, banner, minify, pathExists, read, readJson, renderLess, write } from './util.js';

const { rtl } = args;
const develop = args.develop || args.debug || args.d || args.nominify;
const sources = [
    { src: 'src/less/uikit.less', dist: `dist/css/uikit-core${rtl ? '-rtl' : ''}.css` },
    { src: 'src/less/uikit.theme.less', dist: `dist/css/uikit${rtl ? '-rtl' : ''}.css` },
];

const themes = (await pathExists('themes.json')) ? await readJson('themes.json') : {};

for (const src of await glob('custom/*.less')) {
    const theme = basename(src, '.less');
    const dist = `dist/css/uikit.${theme}${rtl ? '-rtl' : ''}.css`;

    themes[theme] = { css: `../${dist}` };

    if (await pathExists(`dist/js/uikit-icons-${theme}.js`)) {
        themes[theme].icons = `../dist/js/uikit-icons-${theme}.js`;
    }

    sources.push({ src, dist });
}

await Promise.all(sources.map(({ src, dist }) => compile(src, dist, develop, rtl)));

if (!rtl && (Object.keys(themes).length || !(await pathExists('themes.json')))) {
    await write('themes.json', JSON.stringify(themes));
}

async function compile(file, dist, develop, rtl) {
    const less = await read(file);

    let output = (
        await renderLess(less, {
            rewriteUrls: 'all',
            rootpath: '../../',
            paths: ['src/less/', 'custom/'],
        })
    ).replace(/\.\.\/dist\//g, '');

    if (rtl) {
        output = rtlcss.process(
            output,
            {
                stringMap: [
                    {
                        name: 'previous-next',
                        priority: 100,
                        search: ['previous', 'Previous', 'PREVIOUS'],
                        replace: ['next', 'Next', 'NEXT'],
                        options: {
                            scope: '*',
                            ignoreCase: false,
                        },
                    },
                ],
            },
            [
                {
                    name: 'customNegate',
                    priority: 50,
                    directives: {
                        control: {},
                        value: [],
                    },
                    processors: [
                        {
                            expr: ['--uk-position-translate-x', 'stroke-dashoffset'].join('|'),
                            action(prop, value, context) {
                                return { prop, value: context.util.negate(value) };
                            },
                        },
                    ],
                },
            ],
            {
                pre(root, postcss) {
                    root.prepend(postcss.comment({ text: 'rtl:begin:rename' }));
                    root.append(postcss.comment({ text: 'rtl:end:rename' }));
                },
            }
        );
    }

    await write(dist, banner + output);

    if (!develop) {
        await minify(dist);
    }
}
