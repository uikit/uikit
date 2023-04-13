import less from 'less';
import fs from 'fs-extra';
import pLimit from 'p-limit';
import { glob } from 'glob';
import { optimize } from 'svgo';
import { promisify } from 'util';
import minimist from 'minimist';
import CleanCSS from 'clean-css';
import alias from '@rollup/plugin-alias';
import modify from 'rollup-plugin-modify';
import replace from '@rollup/plugin-replace';
import { basename, dirname, join } from 'path';
import { exec as execImport } from 'child_process';
import { rollup, watch as rollupWatch } from 'rollup';
import { default as esbuild, minify as esbuildMinify } from 'rollup-plugin-esbuild';

const limit = pLimit(Number(process.env.cpus || 2));

export const exec = promisify(execImport);
export const { pathExists, readJson } = fs;

export const banner = `/*! UIkit ${await getVersion()} | https://www.getuikit.com | (c) 2014 - ${new Date().getFullYear()} YOOtheme | MIT License */\n`;
export const validClassName = /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/;

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
    const err = await fs.writeFile(dest, data);

    if (err) {
        console.log(err);
        throw err;
    }

    await logFile(dest);

    return dest;
}

export async function logFile(file) {
    const data = await read(file);
    console.log(`${cyan(file)} ${getSize(data)}`);
}

export async function minify(file) {
    const { styles } = await limit(() =>
        new CleanCSS({
            advanced: false,
            keepSpecialComments: 0,
            rebase: false,
            returnPromise: true,
        }).minify([file])
    );

    await write(`${join(dirname(file), basename(file, '.css'))}.min.css`, styles);

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

    name = (name || '').replace(/[^\w]/g, '_');

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
                    'uikit-util': './src/js/util/index.js',
                    ...aliases,
                },
            }),

            svgPlugin(),

            esbuild({
                target: 'safari12',
                sourceMap: !!debug,
                minify: false,
            }),

            !debug &&
                modify({
                    find: /(>)\n\s+|\n\s+(<)/,
                    replace: (m, m1, m2) => `${m1 || ''} ${m2 || ''}`,
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

export async function icons(src) {
    const files = await glob(src);
    const icons = await Promise.all(
        files.map((file) => limit(async () => optimizeSvg(await read(file))))
    );

    return JSON.stringify(
        files.reduce((result, file, i) => {
            result[basename(file, '.svg')] = icons[i];
            return result;
        }, {}),
        null,
        '    '
    );
}

export async function run(cmd, options) {
    const { stdout, stderr } = await limit(() => exec(cmd, options));

    stdout && console.log(stdout.trim());
    stderr && console.log(stderr.trim());

    return stdout;
}

export function ucfirst(str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export async function getVersion() {
    return (await readJson('package.json')).version;
}

export async function replaceInFile(file, fn) {
    await write(file, await fn(await read(file)));
}

function cyan(str) {
    return `\x1b[1m\x1b[36m${str}\x1b[39m\x1b[22m`;
}

function getSize(data) {
    return `${(data.length / 1024).toFixed(2)}kb`;
}

async function optimizeSvg(svg) {
    const options = {
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        removeViewBox: false,
                        cleanupNumericValues: {
                            floatPrecision: 3,
                        },
                        convertPathData: false,
                        convertShapeToPath: false,
                        mergePaths: false,
                        minifyStyles: false,
                        removeUnknownsAndDefaults: false,
                        removeUselessStrokeAndFill: false,
                        sortAttrs: false,
                    },
                },
            },
            { name: 'removeXMLNS', active: true },
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
