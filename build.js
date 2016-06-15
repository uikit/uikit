var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var package = require('./package.json');
var version = process.env.VERSION || package.version;
var banner = "/*! UIkit " + version + " | http://www.getuikit.com | (c) 2014 - 2016 YOOtheme | MIT License */\n";

rollup.rollup({
  entry: 'src/js/uikit',
  external: ['jquery'],
  plugins: [
    babel({ presets: ['es2015-rollup'] }),
    resolve({ main: true, jsnext: true })
  ]
})
.then(function (bundle) {
  return write('js/uikit.js', bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'UIkit',
    globals: {
      jquery: 'jQuery'
    }
  }).code);
})
.then(function () {
  return write(
    'js/uikit.min.js',
    banner + '\n' + uglify.minify('js/uikit.js').code
  );
})
.catch(logError);

function write(dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(cyan(dest) + ' ' + getSize(code));
      resolve();
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function cyan(str) {
  return '\x1b[1m\x1b[36m' + str + '\x1b[39m\x1b[22m';
}
