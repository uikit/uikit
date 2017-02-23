var fs = require('fs');
var glob = require('glob');
var util = require('./util');

['dist', 'dist/icons'].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});

fs.writeFileSync('dist/icons/components.json', util.icons('src/images/components/*.svg'));
fs.writeFileSync('dist/icons/icons.json', util.icons('src/images/icons/*.svg'));
