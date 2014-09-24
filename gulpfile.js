var pkg         = require('./package.json'),
    fs          = require('fs'),
    path        = require('path'),
    glob        = require('glob'),
    mkdirp      = require('mkdirp')
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    rimraf      = require('gulp-rimraf'),
    ignore      = require('gulp-ignore'),
    replace     = require('gulp-replace'),
    header      = require('gulp-header'),
    less        = require('gulp-less'),
    minifycss   = require('gulp-minify-css'),
    uglify      = require('gulp-uglify'),
    watch       = require('gulp-watch'),
    tap         = require('gulp-tap'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync');

var themes = (function(){

        var list = [];

        ["themes", "custom"].forEach(function(f){

            if(!fs.existsSync(f)) return;

            fs.readdirSync(f).forEach(function(t){
                var path = f+'/'+t, uikit = path + '/uikit.less', customizer = path + '/uikit-customizer.less';
                if (!(fs.lstatSync(path).isDirectory() && fs.existsSync(uikit))) return;
                list.push({"name": t, "path": f+'/'+t, "uikit": uikit});
            });
        });

        return list;
    })(),

    corejs = [
        './src/core/core.js',
        './src/core/touch.js',
        './src/core/utility/utility.js',
        './src/core/smooth-scroll/smooth-scroll.js',
        './src/core/scrollspy/scrollspy.js',
        './src/core/toggle/toggle.js',
        './src/core/alert/alert.js',
        './src/core/button/button.js',
        './src/core/dropdown/dropdown.js',
        './src/core/grid/grid.js',
        './src/core/modal/modal.js',
        './src/core/nav/nav.js',
        './src/core/offcanvas/offcanvas.js',
        './src/core/switcher/switcher.js',
        './src/core/tab/tab.js',
        './src/core/tooltip/tooltip.js'
    ];


gulp.task('dist', ['dist-themes-core'], function(done) {

    runSequence('sass', 'dist-core-minify', 'dist-core-header', 'browser-reload', function(){
        done();
    });
});

gulp.task('default', ['dist', 'build-docs', 'indexthemes']);


/*
 * development related tasks
 * ---------------------------------------------------------*/
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./",
            startPath: "/tests"
        }
    });
});

gulp.task('browser-reload', function () {
    browserSync.reload();
});

gulp.task('watch', ['browser-sync'], function(done) {
    gulp.watch('src/**/*', function(files) {
        runSequence('dist-themes-core', 'browser-reload');
    });
});

/*
 * dist core tasks
 * ---------------------------------------------------------*/
gulp.task('dist-clean', function() {
    return gulp.src('dist', {read: false}).pipe(rimraf());
});

gulp.task('dist-core-move', ['dist-clean'], function() {
    return gulp.src(['./src/**']).pipe(gulp.dest('./dist'));
});

gulp.task('dist-core-minify', function(done) {

    // minify css
    gulp.src('./dist/**/*.css').pipe(rename({ suffix: '.min' })).pipe(minifycss()).pipe(gulp.dest('./dist')).on('end', function(){

        // minify js
        gulp.src(['!./dist/core/*/*.js', './dist/**/*.js']).pipe(rename({ suffix: '.min' })).pipe(uglify()).pipe(gulp.dest('./dist')).on('end', function(){

            done();
        });
    });
});

gulp.task('dist-core-header', function() {
    return gulp.src(['./dist/**/*.css', './dist/**/*.js']).pipe(header("/*! <%= pkg.title %> <%= pkg.version %> | <%= pkg.homepage %> | (c) 2014 YOOtheme | MIT License */\n", { 'pkg' : pkg } )).pipe(gulp.dest('./dist/'));
});


/*
 * sass converter related tasks
 * ---------------------------------------------------------*/

gulp.task('sass-copy', function() {

    return gulp.src('./dist/**/*.less').pipe(rename(function (path) {
        path.extname = ".scss";
    })).pipe(gulp.dest('./dist'));
});

gulp.task('sass-convert', ['sass-copy'], function() {

    return gulp.src('./dist/**/*.scss')
           .pipe(replace(/\/less\//g, '/scss/'))                              // change less/ dir to scss/ on imports
           .pipe(replace(/\.less/g, '.scss'))                                 // change .less extensions to .scss on imports
           .pipe(replace(/@/g, '$'))                                          // convert variables
           .pipe(replace(/ e\(/g, ' unquote('))                               // convert escape function
           .pipe(replace(/\.([\w\-]*)\s*\((.*)\)\s*\{/g, '@mixin $1($2){'))   // hook -> mixins
           .pipe(replace(/@mixin ([\w\-]*)\s*\((.*)\)\s*\{\s*\}/g, '// @mixin $1($2){}'))   // comment empty mixins
           .pipe(replace(/\.(hook[a-zA-Z\-\d]+);/g, '@include $1();'))        // hook calls
           .pipe(replace(/\$(import|media|font-face|page|-ms-viewport|keyframes|-webkit-keyframes)/g, '@$1')) // replace valid '@' statements
           .pipe(replace(/(\$[\w\-]*)\s*:(.*);\n/g, '$1: $2 !default;\n'))    // make variables optional
           .pipe(replace(/\$\{/g, '#{$'))                                      // string literals: from: /~"(.*)"/g, to: '#{"$1"}'
           .pipe(replace(/~("[^"]+")/g, 'unquote($1)'))                       // string literals: for real
           .pipe(gulp.dest('./dist'));
});

gulp.task('sass', ['sass-convert'], function(done) {

    glob('./dist/**/*.scss', function (err, files) {

        if (err) return;

        var re     = /\/\/ @mixin ([\w\-]*)\s*\((.*)\)\s*\{\s*\}/g,
            mixins = [],
            count  = files.length;

        files.forEach(function(file) {

            fs.readFile(file, {encoding: 'utf-8'},function read(err, content) {

                if (err) throw err;

                var matches;

                while(matches = re.exec(content)) {
                    mixins.push(matches[0].replace(/\/\/\s*/, ''));
                }

                count--;

                if (!count) {

                    fs.writeFile('./dist/uikit-mixins.scss', mixins.join('\n'), function (err) {
                      if (err) throw err;

                      done();
                    });
                }
            });
        });
    });
});

/*
 * theme related tasks
 * ---------------------------------------------------------*/

gulp.task('dist-variables', ['dist-core-move'], function(done) {

    var regexp  = /(@[\w\-]+\s*:(.*);?)/g,
        counter, variables = [];

    glob('./src/**/*.less', function (err, files) {

        counter = files.length;

        files.forEach(function(file, index){

            fs.readFile(file, "utf-8", function(err, data) {

                var matches;

                while(matches = regexp.exec(data)) {
                    variables.push(matches[0]);
                }

                counter = counter - 1;

                if (!counter) {

                    fs.writeFile('./dist/uikit-variables.less', variables.join('\n'), function (err) {
                      if (err) throw err;
                      done();
                    });
                }
            });
        });
    });
});

gulp.task('dist-themes', ['dist-variables'], function(done) {

    // compile themes
    var counter, lessfiles = [];

    glob('dist/*/*.less', function(globerr, files){

        counter = 1;

        files.forEach(function(file) {

            var component = path.basename(file),
                compname  = path.basename(file, '.less'),
                cpath     = path.dirname(file),
                content;

            themes.forEach(function(theme) {

                if (theme.path.match(/custom/)) return;

                var tplpath = [cpath, compname+'.'+theme.name+'.less'].join('/'),
                    csspath = [cpath, compname+'.'+theme.name+'.css'].join('/');

                content = [
                    '@import "../uikit-variables.less";',
                    '@import "'+component+'";'
                ];

                if (fs.existsSync(theme.path+'/variables.less')) {
                    content.push('@import "../../'+theme.path+'/variables.less";');
                }

                if (fs.existsSync(theme.path+'/'+component)) {
                    content.push('@import "../../'+theme.path+'/'+component+'";');
                }

                fs.writeFileSync(tplpath, content.join('\n'));

                lessfiles.push(tplpath);
            });

        });

        counter = lessfiles.length;

        lessfiles.forEach(function(tplpath){

            var csspath = tplpath.replace('.less', '.css');

            gulp.src(tplpath).pipe(less()).pipe(gulp.dest(path.dirname(tplpath))).on('end', function(){

                fs.unlinkSync(tplpath);

                if (csspath.match(/\.default\.css/)) {
                    fs.renameSync(csspath, csspath.replace('.default.css', '.css'));
                }

                counter = counter - 1;

                if (!counter) done();
            });
        });
    });
});

gulp.task('dist-themes-core', ['dist-themes'], function(done) {

    var counter = themes.length;

    themes.forEach(function(theme) {

        gulp.src(theme.uikit).pipe(less()).pipe(rename({ suffix: ('.'+theme.name) })).pipe(gulp.dest('./dist')).on('end', function(){

            if (theme.name == 'default') {
                fs.renameSync('./dist/uikit.default.css', './dist/uikit.css');
            }

            counter = counter - 1;

            if (!counter) {

                gulp.src(corejs).pipe(concat('uikit.js')).pipe(gulp.dest('./dist')).on('end', function(){
                    done();
                });
            }
        });
    });
});

/*
 * misc tasks
 * ---------------------------------------------------------*/
gulp.task('build-docs', function(done) {

    // minify css
    gulp.src('./docs/less/uikit.less').pipe(less()).pipe(rename({ suffix: '.docs.min' })).pipe(minifycss()).pipe(gulp.dest('./docs/css')).on('end', function(){

        gulp.src(corejs).pipe(concat('uikit.min.js')).pipe(uglify()).pipe(gulp.dest('./docs/js')).on('end', function(){
            done();
        })
    });
});

gulp.task('indexthemes', function() {

    var data = [];

    themes.forEach(function(theme) {

        var themepath = theme.path,
            theme     = {
                "id"    : theme.name,
                "name"  : theme.name.split("-").join(" ").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) { return $1.toUpperCase(); }),
                "url"   : themepath+"/uikit-customizer.less",
                "config": (fs.existsSync(themepath+"/customizer.json") ? themepath+"/customizer.json" : "themes/default/customizer.json"),
                "styles": {}
            };

        if (fs.existsSync(themepath+'/styles')) {

            var styles = {};

            fs.readdirSync(themepath+'/styles').forEach(function(sf){

                var stylepath = [themepath, 'styles', sf, 'style.less'].join('/');

                if (fs.existsSync(stylepath)) {
                    styles[sf] = themepath+"/styles/"+sf+"/style.less";
                }
            });

            theme.styles = styles;
        }

        data.push(theme);
    });

    console.log(data.length+' themes found: ' + data.map(function(theme){ return theme.name;}).join(", "));

    fs.writeFileSync("themes.json", JSON.stringify(data, " ", 4));
});

/*
 * sublime plugin tasks
 * ---------------------------------------------------------*/

// generates a python list (returns string representation)
var pythonList = function(classes) {

    var result = [];

    classes.forEach(function(cls, i) {
        // wrap class name in double quotes, add comma (except for last element)
        result.push(['"', cls, '"', (i !== classes.length-1 ? ", " : "")].join(''));

        // break lines every n elements
        if ((i !== 0) && (i%20 === 0)) {
            result.push("\n    ");
        }
    });

    return "[" + result.join("") + "]";
};

// classes: uk-*
gulp.task('sublime-css', function(done) {

    mkdirp.sync("dist/sublime");

    gulp.src(['dist/**/*.min.css', '!dist/core/**/*', 'dist/uikit.css'])
        .pipe(concat('sublime_tmp_css.py'))
        .pipe(tap(function(file) {
            var css         = file.contents.toString(),
                classesList = css.match(/\.(uk-[a-z\d\-]+)/g),
                classesSet  = {},
                pystring    = '# copy & paste into sublime plugin code:\n';

            // use object as set (no duplicates)
            classesList.forEach(function(c) {
                c = c.substr(1); // remove leading dot
                classesSet[c] = true;
            });

            // convert set back to list
            classesList = Object.keys(classesSet);

            pystring += 'uikit_classes = ' + pythonList(classesList) + '\n';

            // FIXME: same file as data-uk-* result. how to merge stream results?
            fs.writeFileSync("dist/sublime/tmp_css.py", pystring);

            done();
        }));
});

// data attributes: data-uk-*
gulp.task('sublime-js', function(done) {

    mkdirp.sync("dist/sublime");

    gulp.src(['dist/**/*.min.js', '!dist/core/**/*', 'dist/uikit.js'])
        .pipe(concat('sublime_tmp_js.py'))
        .pipe(tap(function(file) {
            var js       = file.contents.toString(),
                dataList = js.match(/data-uk-[a-z\d\-]+/g),
                dataSet  = {};

            dataList.forEach(function(s) { dataSet[s] = true; });

            dataList  = Object.keys(dataSet);
            pystring = 'uikit_data = ' + pythonList(dataList) + '\n';

            // FIXME: same file as uk-* result. how to merge stream results?
            fs.writeFileSync("dist/sublime/tmp_js.py", pystring);

            done();
        }));

});

    gulp.task('sublime-snippets',  function(done) {
        var template = "<snippet>\n\
    <content><![CDATA[{content}]]></content>\n\
    <tabTrigger>{trigger}</tabTrigger>\n\
    <scope>text.html</scope>\n\
    <description>{description}</description>\n\
</snippet>";

        mkdirp.sync("dist/sublime/snippets");

        gulp.src("dist/**/*.less")
            .pipe(tap(function(file) {

                var less = file.contents.toString(),
                    regex = /\/\/\s*<!--\s*(.+)\s*-->\s*\n((\/\/.+\n)+)/g,
                    match = null;

                while (match = regex.exec(less)) {
                    var name = match[1], // i.e. uk-grid
                        name = name.replace(/^\s+|\s+$/g, ''), // trim
                        content = match[2],
                        content = content.replace(/(\n?)(\s*)\/\/ ?/g,'$1$2'), // remove comment slashes from lines
                        description = ["UIkit", name, "component"].join(" ");

                    // place tab indices
                    var i = 1; // tab index, start with 1
                    content = content.replace(/class="([^"]+)"/g, 'class="${{index}:$1}"') // inside class attributes
                                    .replace(/(<[^>]+>)(<\/[^>]+>)/g, '$1${index}$2') // inside empty elements
                                    .replace(/\{index\}/g, function() { return i++; });

                    var snippet = template.replace("{content}", content)
                                    .replace("{trigger}", "uikit")
                                    .replace("{description}", description);

                    fs.writeFileSync('dist/sublime/snippets/'+name+'.sublime-snippet', snippet);

                    // move to next match in loop
                    regex.lastIndex = match.index+1;
                }

            }));

        done();

    });

gulp.task('sublime', ['sublime-css', 'sublime-js', 'sublime-snippets'], function(done) {
    var outfile = 'sublime_completions.py';

    gulp.src("dist/sublime/tmp_*.py")
        .pipe(concat(outfile))
        .pipe(gulp.dest('dist/sublime/'))
        .on('end', function(){
            gulp.src("dist/sublime/tmp_*.py", {read: false}).pipe(rimraf()).on('end', done);
        });
});
