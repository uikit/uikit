var path = require('path');
var glob = require('glob');
var util = require('./util');
var rollup = require('rollup');
var concat = require('concat');
var html = require('rollup-plugin-html');
var json = require('rollup-plugin-json');
var buble = require('rollup-plugin-buble');
var alias = require('rollup-plugin-import-alias');
var resolve = require('rollup-plugin-node-resolve');

util.write('dist/icons/icons.json', util.icons('{src/images,custom}/icons/*.svg')).then(() =>

    Promise.all([

        compile('src/js/uikit.js', 'dist/js/uikit-core', ['jquery'], {jquery: 'jQuery'}),
        compile('src/js/icons.js', 'dist/js/uikit-icons', ['jquery'], {jquery: 'jQuery'}, 'icons'),
        compile('tests/js/index.js', 'tests/js/test', ['jquery'], {jquery: 'jQuery'}, 'test')

    ].concat(glob.sync('src/js/components/**/*.js').map(file => compile(
        file,
        `dist/${file.substring(4, file.length - 3)}`,
        ['jquery', 'uikit'],
        {jquery: 'jQuery', uikit: 'UIkit'},
        path.basename(file, '.js').replace()
    ))))
    .then(() =>

        glob('dist/js/components/**/!(*.min).js', (err, files) =>
            concat(['dist/js/uikit-core.js'].concat(files))
                .then(data => util.write('dist/js/uikit.js', data))
                .then(util.uglify)
        )

    )

);

function compile(file, dest, external, globals, name) {
    return rollup.rollup({
        external,
        entry: `${path.resolve(path.dirname(file), path.basename(file, '.js'))}.js`,
        plugins: [
            alias({
                Paths: {
                    components: 'dist/icons/components',
                    icons: 'dist/icons/icons'
                },
                Extensions: ['json']
            }),
            html({
                include: '**/*.svg',
                htmlMinifierOptions: {
                    collapseWhitespace: true
                }
            }),
            json(),
            buble()
        ]
    })
        .then(bundle => util.write(`${dest}.js`, bundle.generate({
            globals,
            format: 'umd',
            banner: util.banner,
            moduleId: `UIkit${name}`.toLowerCase(),
            moduleName: `UIkit${name ? util.ucfirst(name) : ''}`,
        }).code))
        .then(util.uglify)
        .catch(console.log);
}
