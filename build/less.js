/* eslint-env node */
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

    return compile(file, dist);

});

if (!rtl && (Object.keys(themes).length || !fs.existsSync('themes.json'))) {
    util.write('themes.json', JSON.stringify(themes));
}

function compile(file, dist) {
    return util.read(file).then(data =>
        util.renderLess(data, {
            relativeUrls: true,
            rootpath: '../../',
            paths: ['src/less/', 'custom/']
        })
            .then(output => output.replace(/\.\.\/dist\//g, ''))
            .then(output => !rtl && output || postcss([
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
            ]).process(output).css)
            .then(output => util.write(dist, util.banner + output))
            .then(res => !develop && util.minify(res)),
        error => console.log(error)
    );
}
