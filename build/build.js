var fs = require('fs');
var path = require('path');
var glob = require('glob');
var util = require('./util');
var concat = require('concat');

util.write('dist/icons.json', util.icons('{src/images,custom}/icons/*.svg')).then(() =>

    Promise.all([

        util.compile('src/js/uikit-core.js', 'dist/js/uikit-core', ['jquery'], {jquery: 'jQuery'}),
        util.compile('src/js/uikit.js', 'dist/js/uikit', ['jquery'], {jquery: 'jQuery'}, undefined, undefined, true),
        util.compile('src/js/icons.js', 'dist/js/uikit-icons', ['jquery'], {jquery: 'jQuery'}, 'icons', {icons: 'dist/icons'}),
        util.compile('tests/js/index.js', 'tests/js/test', ['jquery'], {jquery: 'jQuery'}, 'test')

    ].concat(glob.sync('src/js/components/**/*.js').map(file => util.compile(
        file,
        `dist/${file.substring(4, file.length - 3)}`,
        ['jquery', 'uikit'],
        {jquery: 'jQuery', uikit: 'UIkit'},
        path.basename(file, '.js')
    ))))

).then(() => fs.unlink('dist/icons.json', () => {}));
