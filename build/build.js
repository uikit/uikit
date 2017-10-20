var fs = require('fs');
var path = require('path');
var glob = require('glob');
var util = require('./util');

util.write('dist/icons.json', util.icons('{src/images,custom}/icons/*.svg')).then(() =>

    Promise.all([

        util.compile('src/js/uikit-core.js', 'dist/js/uikit-core'),
        util.compile('src/js/uikit.js', 'dist/js/uikit', undefined, undefined, undefined, undefined, true),
        util.compile('src/js/icons.js', 'dist/js/uikit-icons', undefined, undefined, 'icons', {icons: 'dist/icons'}),
        util.compile('tests/js/index.js', 'tests/js/test', undefined, undefined, 'test')

    ]
        .concat(glob.sync('src/js/components/*.js').map(file => util.compile(
            file,
            `dist/${file.substring(4, file.length - 3)}`,
            ['uikit'],
            {uikit: 'UIkit'},
            path.basename(file, '.js')
        )))
    )

).then(() => fs.unlink('dist/icons.json', () => {}));
