/* eslint-env node */
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));

argv._.forEach(arg => {
    const tokens = arg.split('=');
    argv[tokens[0]] = tokens[1] || true;
});

var numArgs = Object.keys(argv).length;
argv.all = argv.all || numArgs <= 1; //no arguments passed, so compile all

const minify = !(argv.debug || argv.nominify || argv.nominify || argv.d);

//map component build jobs
var components = glob.sync('src/js/components/*.js').reduce((components, file) => {

    var name = path.basename(file).split('.')[0];

    components[name] = () => util.compile(file, `dist/${file.substring(4, file.length - 3)}`, ['uikit'], { uikit: 'UIkit' }, path.basename(file, '.js'), undefined, undefined, minify);
    return components;
}, {});

var steps = {

    core: () => util.compile('src/js/uikit-core.js', 'dist/js/uikit-core', undefined, undefined, undefined, undefined, undefined, minify),
    uikit: () => util.compile('src/js/uikit.js', 'dist/js/uikit', undefined, undefined, undefined, undefined, true, minify),
    icons: () => util.write('dist/icons.json', util.icons('{src/images,custom}/icons/*.svg'))
		.then(() => util.compile('src/js/icons.js', 'dist/js/uikit-icons', undefined, undefined, 'icons', { icons: 'dist/icons' }, undefined, minify))
		.then(() => fs.unlink('dist/icons.json', () => {})),
    tests: () => util.compile('tests/js/index.js', 'tests/js/test', undefined, undefined, 'test', undefined, undefined, minify)

};

function collectJobs() {

    var jobs = [];

	//if parameter components is set or all or none(implicit all), add all components
    if (argv.components || argv.all) {
        Object.assign(argv, components);
    }

	//if parameter components is set or all or none(implicit all), add all steps
    if (argv.all) {
        Object.assign(argv, steps);
    }

    Object.assign(steps, components);

	// Object.keys(argv).forEach(step => components[step] && componentJobs.push(components[step]()));
    Object.keys(argv).forEach(step => steps[step] && jobs.push(steps[step]()));

    return jobs;
}

if (argv.h || argv.help) {

    console.log(`
        usage:

        build.js [componentA, componentB, ...] [-d|debug|nominify|development]

        examples:

        build.js // builds all of uikit, including icons and does minification (implies 'all')
        build.js uikit icons -d // builds all of uikit and the icons, skipping the minification
        build.js core lightbox -d // builds uikit-core and the lightbox, skipping the minification

        available components:

        bundles: ${Object.keys(steps).join(', ')}
        components: ${Object.keys(components).join(', ')}

    `);

} else {

    var jobs = collectJobs();

    if (jobs.length === 0) {
        argv.all = true;
        jobs = collectJobs();
    }

}