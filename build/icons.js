var fs = require('fs');
var util = require('./util');
var args = require('minimist')(process.argv);

var src = args.s || args.src || false;
var dest = args.d || args.dest || false;
var cwd = args.cwd;

if (cwd) {
    process.chdir(cwd);
}

if (!src || !dest) {
    return console.log('Invalid arguments');
}

util.write(dest, util.icons(src));
