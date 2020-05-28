const fs = require('fs');
const glob = require('glob');
const path = require('path');
const util = require('./util');
const rtlcss = require('rtlcss');
const postcss = require('postcss');
const argv = require('minimist')(process.argv);
const args = argv._;
const rtl = ~args.indexOf('rtl');

argv._.forEach(arg => {
    const tokens = arg.split('=');
    argv[tokens[0]] = tokens[1] || true;
});

const develop = argv.develop || argv.debug || argv.d || argv.nominify;

[
    {src: 'src/less/uikit.less', dist: `dist/css/uikit-core${rtl ? '-rtl' : ''}.css`},
    {src: 'src/less/uikit.theme.less', dist: `dist/css/uikit${rtl ? '-rtl' : ''}.css`}

].forEach(config => compile(config.src, config.dist));

const themes = fs.existsSync('themes.json') ? JSON.parse(fs.readFileSync('themes.json')) : {};

glob.sync('custom/*.less').forEach(file => {

    const theme = path.basename(file, '.less');
    const dist = `dist/css/uikit.${theme}${rtl ? '-rtl' : ''}.css`;

    themes[theme] = {css: `../${dist}`};

    if (fs.existsSync(`dist/js/uikit-icons-${theme}.js`)) {
        themes[theme].icons = `../dist/js/uikit-icons-${theme}.js`;
    }

    compile(file, dist)
        .catch(({message}) => {
            console.error(message);
            process.exitCode = 1;
        });

});

if (!rtl && (Object.keys(themes).length || !fs.existsSync('themes.json'))) {
    util.write('themes.json', JSON.stringify(themes));
}

async function compile(file, dist) {

    const less = await util.read(file);

    let output = (await util.renderLess(less, {
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

    const res = await util.write(dist, util.banner + output);

    if (!develop) {
        util.minify(res);
    }

}
