import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import CleanCSS from 'clean-css';
import fs from 'fs-extra';
import { glob } from 'glob';
import less from 'less';
import minimist from 'minimist';
import pLimit from 'p-limit';
import path from 'path';
import { rollup, watch as rollupWatch } from 'rollup';
import { default as esbuild, minify as esbuildMinify } from 'rollup-plugin-esbuild';
import modify from 'rollup-plugin-modify';
import { optimize } from 'svgo';

const limit = pLimit(Number(process.env.cpus || 2));

export const banner = `/*! UIkit ${await getVersion()} | https://www.getuikit.com | (c) 2014 - ${new Date().getFullYear()} YOOtheme | MIT License */\n`;

const argv = minimist(process.argv.slice(2));

argv._.forEach((arg) => {
    const tokens = arg.split('=');
    argv[tokens[0]] = tokens[1] || true;
});

export const args = argv;

export function read(file) {
    return fs.readFile(file, 'utf8');
}

export async function write(dest, data) {
    fs.ensureDir(path.dirname(dest));

    await fs.writeFile(dest, data);
    await logFile(dest);

    return dest;
}

export async function logFile(file) {
    const { size } = await fs.stat(file);
    console.log(`${cyan(file)} ${formatSize(size)}`);
}

export async function minify(file) {
    const { styles } = await limit(() =>
        new CleanCSS({
            advanced: false,
            keepSpecialComments: 0,
            rebase: false,
            returnPromise: true,
        }).minify([file]),
    );

    await write(`${path.join(path.dirname(file), path.basename(file, '.css'))}.min.css`, styles);

    return styles;
}

export function renderLess(data, options) {
    return limit(async () => (await less.render(data, options)).css);
}

export async function compile(file, dest, { external, globals, name, aliases, replaces } = {}) {
    const minify = !args.nominify;
    const debug = args.d || args.debug;
    const log = args.l || args.log;
    const watch = args.w || args.watch;

    name = (name || '').replace(/\W/g, '_');

    const inputOptions = {
        external,
        input: file,
        plugins: [
            replace({
                preventAssignment: true,
                values: {
                    VERSION: `'${await getVersion()}'`,
                    LOG: !!log,
                    ...replaces,
                },
            }),
            alias({
                entries: {
                    'uikit-util': path.resolve('./src/js/util/index.js'),
                    ...aliases,
                },
            }),

            svgPlugin(),

            esbuild({
                target: 'safari12',
                sourceMap: !!debug,
                minify: false,
                supported: { 'template-literal': true },
            }),

            !debug &&
                modify({
                    find: /(?<=>)\n\s+|\n\s+(?=<)/,
                    replace: ' ',
                }),
        ],
    };

    const outputOptions = {
        globals,
        banner,
        format: 'umd',
        amd: { id: `UIkit${name}`.toLowerCase() },
        name: `UIkit${ucfirst(name)}`,
        sourcemap: debug ? 'inline' : false,
    };

    const output = [
        {
            ...outputOptions,
            file: `${dest}.js`,
        },
    ];

    if (minify) {
        output.push({
            ...outputOptions,
            file: `${dest}.min.js`,
            plugins: [
                debug
                    ? undefined
                    : esbuildMinify({
                          target: 'safari12',
                          supported: { 'template-literal': true },
                      }),
            ],
        });
    }

    if (!watch) {
        const bundle = await rollup(inputOptions);

        for (const options of output) {
            await limit(() => bundle.write(options));
            logFile(options.file);
        }

        await bundle.close();
    } else {
        console.log('UIkit is watching the files...');

        const watcher = rollupWatch({
            ...inputOptions,
            output,
        });

        watcher.on('event', ({ code, result, output, error }) => {
            if (result) {
                result.close();
            }
            if (code === 'BUNDLE_END' && output) {
                output.map(logFile);
            }
            if (error) {
                console.error(error);
            }
        });

        await watcher.close();
    }
}

export async function icons(...src) {
    let files = {};
    for (const pattern of src) {
        for (const file of await glob(pattern)) {
            files[path.basename(file, '.svg')] ??= limit(
                async () => await optimizeSvg(await read(file)),
            );
        }
    }

    const sorted = {};
    for (const key of Object.keys(files).sort()) {
        sorted[key] = await files[key];
    }

    return JSON.stringify(sorted, null, '    ');
}

export function ucfirst(str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export async function getVersion() {
    return (await fs.readJson('package.json')).version;
}

export async function replaceInFile(file, fn) {
    await write(file, await fn(await read(file)));
}

function cyan(str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
}

function formatSize(bytes) {
    return `${(bytes / 1024).toFixed(2)}kb`;
}

async function optimizeSvg(svg) {
    const options = {
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        cleanupNumericValues: {
                            floatPrecision: 3,
                        },
                        convertPathData: false,
                        convertShapeToPath: false,
                        mergePaths: false,
                        minifyStyles: false,
                        removeUnknownsAndDefaults: false,
                        removeUselessStrokeAndFill: false,
                        sortAttrs: {
                            order: [
                                'id',
                                'width',
                                'height',
                                'fill',
                                'stroke',
                                'x',
                                'y',
                                'x1',
                                'y1',
                                'x2',
                                'y2',
                                'cx',
                                'cy',
                                'r',
                                'marker',
                                'd',
                                'points',
                            ],
                        },
                    },
                },
            },
            'removeXMLNS',
            'removeXlink',
            {
                name: 'removeAttributesBySelector',
                params: {
                    selector: 'svg',
                    attributes: ['id', 'version'],
                },
            },
            {
                name: 'removeAttributesBySelector',
                params: {
                    selector: '*',
                    attributes: ['data-name'],
                },
            },
        ],
    };

    return (await optimize(svg, options)).data;
}

function svgPlugin() {
    return {
        name: 'svg-import',

        transform: async (code, id) => {
            if (!id.endsWith('.svg')) {
                return;
            }

            return {
                code: `export default ${JSON.stringify(await optimizeSvg(code))};`,
                map: { mappings: '' },
            };
        },
    };
}
