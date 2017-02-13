// Renames files in the images directory
// Swaps "next" and "previous" graphics
// Run AFTER images have been created, but BEFORE less files are compiled
// This is needed because some images are inlined during less compilation

var fs = require('fs');
var glob = require('glob');
var less = require('less');
var util = require('./util');
var postcss = require('postcss');
var rtlcss = require('rtlcss');
var path = require('path');

['dist', 'dist/css'].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

var files = {
    'src/less/uikit.less': 'dist/css/uikit-core.rtl.css',
    'src/less/uikit.theme.less': 'dist/css/uikit.rtl.css'
};

glob.sync('custom/*.less').forEach(file => {
    files[file] = `dist/css/uikit.${path.basename(file, '.less')}.rtl.css`;
});

for (let file in files) {
    util.read(file, data => {
        less.render(data, {
            relativeUrls: true,
            rootpath: '../../',
            paths: ['src/less/', 'custom/'],
        }).then(output => {

            var css = postcss([
                css => {
                    css.insertBefore(css.nodes[0], postcss.comment({text: 'rtl:begin:rename'}));
                    css.insertAfter(css.nodes[css.nodes.length - 1], postcss.comment({text: 'rtl:end:rename'}));
                },
                rtlcss({
                    stringMap: [{
                        name    : 'previous-next',
                        priority: 100,
                        search  : ['previous', 'Previous', 'PREVIOUS'],
                        replace : ['next', 'Next', 'NEXT'],
                        options : {
                            scope : '*',
                            ignoreCase : false
                        }
                    }]
                })
            ]).process(output.css).css;

            util.write(files[file], css).then(util.makeRelative);

        }, error => console.log(error))
    })
}
