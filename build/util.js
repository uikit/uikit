import fs from 'fs-extra';
import less from 'less';
import { URL } from 'url';
import postcss from 'postcss';
import globImport from 'glob';
import {rollup} from 'rollup';
import {optimize} from 'svgo';
import uglify from 'uglify-js';
import {promisify} from 'util';
import minimist from 'minimist';
import CleanCSS from 'clean-css';
import html from 'rollup-plugin-html';
import buble from '@rollup/plugin-buble';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import {basename, dirname, resolve} from 'path';
import {exec as execImport} from 'child_process';

export const exec = promisify(execImport);
export const glob = promisify(globImport);
export const readJson = fs.readJson;
export const pathExists = fs.pathExists;
export const __dirname = new URL('.', import.meta.url).pathname;

export const banner = `/*! UIkit ${await getVersion()} | https://www.getuikit.com | (c) 2014 - ${new Date().getFullYear()} YOOtheme | MIT License */\n`;
export const validClassName = /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/;

const argv = minimist(process.argv.slice(2));

argv._.forEach(arg => {
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
    console.log(`${cyan(resolve(file))} ${getSize(data)}`);
}

export async function minify(file) {

    const {styles} = await new CleanCSS({
        advanced: false,
        keepSpecialComments: 0,
        rebase: false,
        returnPromise: true
    }).minify([file]);

    await write(`${resolve(dirname(file), basename(file, '.css'))}.min.css`, styles);

    return styles;

}

export async function renderLess(data, options) {
    return postcss()
        .use({
            postcssPlugin: 'calc',
            Once(root) {
                root.walk(node => {
                    const {type} = node;
                    if (type === 'decl') {
                        node.value = postcss.list.space(node.value).map(value =>
                            value.startsWith('calc(')
                                ? value.replace(/(.)calc/g, '$1')
                                : value
                        ).join(' ');
                    }
                });
            }
        })
        .process((await less.render(data, options)).css)
        .css;
}

export async function compile(file, dest, {external, globals, name, aliases, replaces, minify = true}) {

    name = (name || '').replace(/[^\w]/g, '_');

    const bundle = await rollup({
        external,
        input: resolve(file),
        plugins: [
            replace({
                preventAssignment: true,
                values: Object.assign({
                    VERSION: `'${await getVersion()}'`
                }, replaces)}
            ),
            alias({
                entries: Object.assign({
                    'uikit-util': './src/js/util/index.js'
                }, aliases)
            }),
            html({
                include: '**/*.svg',
                htmlMinifierOptions: {
                    collapseWhitespace: true
                }
            }),
            buble({namedFunctionExpressions: false})
        ]
    });

    let {output: [{code, map}]} = await bundle.generate({
        globals,
        banner,
        format: 'umd',
        amd: {id: `UIkit${name}`.toLowerCase()},
        name: `UIkit${ucfirst(name)}`,
        sourcemap: !minify ? 'inline' : false
    });

    code = code.replace(/(>)\\n\s+|\\n\s+(<)/g, '$1 $2');

    return Promise.all([
        write(`${dest}.js`, code + (!minify ? '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' + Buffer.from(map.toString()).toString('base64') : '')),
        minify ? write(`${dest}.min.js`, uglify.minify(code, {output: {preamble: banner}}).code) : null
    ])[0];

}

export async function icons(src) {

    const options = {
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        removeViewBox: false,
                        cleanupNumericValues: {
                            floatPrecision: 3
                        },
                        convertPathData: false,
                        convertShapeToPath: false,
                        mergePaths: false,
                        removeDimensions: false,
                        removeStyleElement: false,
                        removeScriptElement: false,
                        removeUnknownsAndDefaults: false,
                        removeUselessStrokeAndFill: false
                    }
                }
            }
        ]
    };

    const files = await glob(src, {nosort: true});
    const icons = await Promise.all(files.map(async file =>
        (await optimize(await read(file), options)).data
    ));

    return JSON.stringify(files.reduce((result, file, i) => {
        result[basename(file, '.svg')] = icons[i];
        return result;
    }, {}), null, '    ');

}

export async function run(cmd) {
    const {stdout, stderr} = await exec(cmd);

    stdout && console.log(stdout.trim());
    stderr && console.log(stderr.trim());
}

export function ucfirst(str) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export async function getVersion() {
    return JSON.parse(await read(resolve(__dirname, '../package.json'))).version;
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
