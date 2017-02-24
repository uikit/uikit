var fs = require('fs');
var glob = require('glob');
var path = require('path');
var util = require('./util');

[

    {src: 'src/less/uikit.less', dist: 'dist/css/uikit-core.css'},
    {src: 'src/less/uikit.theme.less', dist: 'dist/css/uikit.css'}

].forEach(config => compile(config.src, config.dist));

var themes = {};

glob.sync('custom/*.less').forEach(file => {

    var theme = path.basename(file, '.less'),
        dist = `dist/css/uikit.${theme}.css`;

    themes[theme] = {file: `../${dist}`};

    return compile(file, dist);

});

if (Object.keys(themes).length || !fs.existsSync('themes.json')) {
    util.write('themes.json', JSON.stringify(themes));
}

function compile(file, dist) {
    return util.read(file).then(data =>
        util.renderLess(data, {
            relativeUrls: true,
            rootpath: '../../',
            paths: ['custom/', 'src/less/']
        })
            .then(util.makeRelative)
            .then(output => util.write(dist, output))
            .then(util.minify),
        error => console.log(error)
    );
}
