var fs = require('fs');
var concat = require('concat-files');;
var mkdirp = require('mkdirp');


// file paths
var fname_css = "dist/css/uikit.css";
var fname_js = "dist/js/uikit.js";
var outfile = "dist/sublime_completions.py";

if (!fs.existsSync(fname_css) || !fs.existsSync(fname_js)) {
    console.log("Make sure to build UIkit before running this task");
    return;
}

// returns the array with all duplicate elements removed
function remove_duplicates(arr) {
    var _set = {};
    arr.forEach(function(el) { _set[el] = true; });
    return Object.keys(_set);
}

// turn js array into a string of valid python code
function pylist(classes) {
    var result = [];
    classes.forEach(function(cls, i) {

        // wrap class name in double quotes, add comma (except for last element)
        result.push(['"', cls, '"', (i !== classes.length-1 ? ", " : "")].join(''));

        // break lines every n elements
        if ((i !== 0) && (i%20 === 0)) result.push("\n    ");
    });
    return "[" + result.join("") + "]";
};

// classes: uk-* from CSS
function css(done) {

    var css     = fs.readFileSync(fname_css).toString(),
        classes = css.match(/\.(uk-[a-z\d\-]+)/g),
        classes = remove_duplicates(classes).map(function(cls) { return cls.substr(1); }), // remove leading dot
        pylst   = pylist(classes),
        pystr   = `# copy & paste into sublime plugin code:\nuikit_classes = ${pylst}\n`;

    return pystr;
}

// data attributes: data-uk-* from JS
function js(done) {

    var js    = fs.readFileSync(fname_js).toString(),
        attrs = js.match(/uk-[a-z\d\-]+/g),
        pylst = pylist(remove_duplicates(attrs))
        pystr = `uikit_data = ${pylst}\n`;

    return pystr;
}

function sublime() {
    var _css = css(),
        _js  = js(),
        pystring = `${_css}\n${_js}`;

    fs.writeFileSync(outfile, pystring);
}

sublime();
