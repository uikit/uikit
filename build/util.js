import alias from '@rollup/plugin-alias';
import CleanCSS from 'clean-css';
import less from 'less';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs, styleText } from 'node:util';
import pLimit from 'p-limit';
import { rollup, watch as rollupWatch } from 'rollup';
import { default as esbuild, minify as esbuildMinify } from 'rollup-plugin-esbuild';
import { optimize } from 'svgo';

const limit = pLimit(Number(process.env.cpus || 2));

export const banner = `/*! UIkit ${await getVersion()} | https://www.getuikit.com | (c) 2014 - ${new Date().getFullYear()} YOOtheme | MIT License */\n`;

const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    strict: false,
});

export const args = positionals.reduce((args, arg) => {
    const tokens = arg.split('=');
    args[tokens[0]] = tokens[1] || true;
    return args;
}, values);

export function read(file) {
    return fs.readFile(file, 'utf8');
}

export async function write(dest, data) {
    await fs.mkdir(path.dirname(dest), { recursive: true });

    await fs.writeFile(dest, data);
    await logFile(dest);

    return dest;
}

export async function logFile(file) {
    const { size } = await fs.stat(file);
    console.log(`${styleText(['cyan', 'bold'], file)} ${formatSize(size)}`);
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

export async function compile(
    file,
    dest,
    { external, globals, name, aliases, virtualModules } = {},
) {
    const minify = !args.nominify;
    const debug = args.d || args.debug;
    const log = args.l || args.log;
    const watch = args.w || args.watch;

    name = (name || '').replace(/\W/g, '_');

    const inputOptions = {
        external,
        input: file,
        plugins: [
            virtualModulesPlugin({
                'virtual:version': `'${await getVersion()}'`,
                'virtual:log': String(!!log),
                ...virtualModules,
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
                supported: { 'template-literal': true, destructuring: true },
            }),

            !debug && {
                name: 'trim-whitespace',
                transform(source) {
                    return source.replaceAll(/(?<=>)\n\s+|\n\s+(?=<)/g, '  ');
                },
            },
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
                          supported: { 'template-literal': true, destructuring: true },
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
        for await (const file of fs.glob(pattern)) {
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

function ucfirst(str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export async function getVersion() {
    return JSON.parse(await fs.readFile('package.json', 'utf8')).version;
}

export async function replaceInFile(file, fn) {
    await write(file, await fn(await read(file)));
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

// @see https:rollupjs.org/plugin-development/#conventions for the \0 prefix convention
function virtualModulesPlugin(map) {
    return {
        name: 'virtual-modules',

        resolveId(id) {
            if (id in map) {
                return '\0' + id;
            }
        },

        load(id) {
            if (id.startsWith('\0')) {
                const key = id.slice(1);
                if (key in map) {
                    return `export default ${map[key]};`;
                }
            }
        },
    };
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
