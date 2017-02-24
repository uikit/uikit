// Renames files in the images directory
// Swaps "next" and "previous" graphics
// Run AFTER images have been created, but BEFORE less files are compiled
// This is needed because some images are inlined during less compilation

var path = require('path');
var glob = require('glob');
var util = require('./util');
var rtlcss = require('rtlcss');
var postcss = require('postcss');

var files = {
    'src/less/uikit.less': 'dist/css/uikit-core.rtl.css',
    'src/less/uikit.theme.less': 'dist/css/uikit.rtl.css'
};

glob.sync('custom/*.less').forEach(file => files[file] = `dist/css/uikit.${path.basename(file, '.less')}.rtl.css`);

for (let file in files) {
    util.read(file, data =>
        util.renderLess(data, {
            relativeUrls: true,
            rootpath: '../../',
            paths: ['src/less/', 'custom/'],
        })
            .then(util.makeRelative)
            .then(output => postcss([
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
            .then(output => util.write(files[file], output))
            .then(util.minify),
        error => console.log(error)
    );
}
