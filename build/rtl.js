// Renames files in the images directory
// Swaps "next" and "previous" graphics
// Run AFTER images have been created, but BEFORE less files are compiled
// This is needed because some images are inlined during less compilation

var exec = require('child_process').exec;
var fs = require('fs');
var glob = require('glob');
var less = require('less');
var {read, makeRelative, write} = require('./util');
var postcss = require('postcss');
var rtlcss = require('rtlcss');
var path = require('path');

exec('npm run images', (error, stdout, stderr) => {

    stdout && console.log(stdout);
    stderr && console.log(stderr);

    if (error) {
        console.log(error);
        return;
    }

    glob.sync('dist/images/*-next.svg').forEach(file => {
        fs.renameSync(file, `${file}_`);
        fs.renameSync(file.replace('next', 'previous'), file);
        fs.renameSync(`${file}_`, file.replace('next', 'previous'));
    });

    if (!fs.existsSync('dist/css')) {
        fs.mkdirSync('dist/css');
    }

    var files = {
        'src/less/uikit.less': 'dist/css/uikit-core.rtl.css',
        'src/less/uikit.theme.less': 'dist/css/uikit.rtl.css'
    };

    glob.sync('custom/*.less').forEach(file => {
        files[file] = `dist/css/uikit.${path.basename(file, '.less')}.rtl.css`;
    });

    for (let file in files) {
        read(file, data => {
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
                    rtlcss()
                ]).process(output.css).css;

                write(files[file], css).then(makeRelative);

            }, error => console.log(error))
        })
    }

});
