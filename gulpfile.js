var pkg         = require('./package.json'),
    fs          = require('fs'),
    path        = require('path'),
    glob        = require('glob'),
    mkdirp      = require('mkdirp'),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    concat      = require('gulp-concat'),
    ignore      = require('gulp-ignore'),
    rename      = require('gulp-rename'),
    rimraf      = require('gulp-rimraf'),
    replace     = require('gulp-replace'),
    header      = require('gulp-header'),
    less        = require('gulp-less'),
    minifycss   = require('gulp-minify-css'),
    uglify      = require('gulp-uglify'),
    watch       = require('gulp-watch'),
    tap         = require('gulp-tap'),
    zip         = require('gulp-zip'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    Promise     = require('promise');

var watchmode    = gutil.env._.length && gutil.env._[0] == 'watch',
    watchCache   = {},
    watchfolders = ['src/**/*', 'themes/**/*.less', 'custom/**/*.less'],
    getThemes    = function(theme, all) {

        var list = [], themefolders = ["themes"];

        if (theme || all) {
            themefolders.push("custom");
        }

        themefolders.forEach(function(f){

            if(!fs.existsSync(f)) return;

            fs.readdirSync(f).forEach(function(t){

                if (theme && t!=theme) return;

                var path = f+'/'+t, uikit = path + '/uikit.less', customizer = path + '/uikit-customizer.less';
                if (!((fs.lstatSync(path).isDirectory() || fs.lstatSync(path).isSymbolicLink()) && fs.existsSync(uikit))) return;
                list.push({"name": t, "path": f+'/'+t, "uikit": uikit});
            });
        });


        return list;
    },

    themes    = (function(){

        var theme = gutil.env.t || gutil.env.theme || false,
            all   = gutil.env.all || gutil.env.a || theme;

        return getThemes(theme, all);
    })(),

    corejs = [
        './src/js/core/core.js',
        './src/js/core/touch.js',
        './src/js/core/utility.js',
        './src/js/core/smooth-scroll.js',
        './src/js/core/scrollspy.js',
        './src/js/core/toggle.js',
        './src/js/core/alert.js',
        './src/js/core/button.js',
        './src/js/core/dropdown.js',
        './src/js/core/grid.js',
        './src/js/core/modal.js',
        './src/js/core/nav.js',
        './src/js/core/offcanvas.js',
        './src/js/core/switcher.js',
        './src/js/core/tab.js',
        './src/js/core/cover.js'
    ];


gulp.task('default', ['dist', 'build-docs', 'indexthemes'], function(done) {

    if(gutil.env.p || gutil.env.prefix) {
        runSequence('prefix', function(){
            done();
        });
    } else {
        done();
    }
});

gulp.task('dist', ['dist-themes-core'], function(done) {

    runSequence('sass', 'dist-core-minify', 'dist-core-header', 'dist-bower-file', function(){

        if (gutil.env.m || gutil.env.min) {
            gulp.src(['./dist/**/*.css', './dist/**/*.js', '!./dist/**/*.min.css', '!./dist/**/*.min.js'])
            .pipe(rimraf()).on('end', function(){
                done();
            });
        } else {
            done();
        }

    });
});

/*
 * development related tasks
 * ---------------------------------------------------------*/
gulp.task('sync', function() {

    function buildTheme(theme) {

        return new Promise(function(resolve){

            var tmp = themes;

            themes = getThemes(theme);

            runSequence('dist-themes-core', function(){
                themes = tmp;
                resolve();
            });
        });
    }

    var currenttheme,
        bs = browserSync({
        server: {

            baseDir    : "./",
            startPath  : "/tests",
            middleware : function (req, res, next) {

                var m, theme;

                if (m = req.url.match(/dist\/css\/components\/(.*)\.css/)) {
                    theme = m[1].split('.')[1] || 'default';
                } else if (m = req.url.match(/dist\/css\/(.*)\.css/)) {
                    theme = m[1].split('.')[1] || 'default';
                }

                if (theme) {

                    currenttheme = theme;

                    if (!watchCache[theme]) {

                        watchCache[theme] = buildTheme(theme);
                    }

                    watchCache[theme].then(function(){
                        next();
                    });

                } else {
                    next();
                }

            }
        },

        files: [{
            match: watchfolders,
            fn: function (event, file) {

                if (currenttheme) {

                    watchCache = {};
                    bs.reload();
                }
            }
        }]
    });

});

gulp.task('watch', ['dist-clean', 'indexthemes'], function(done) {

    gulp.watch(watchfolders, function(files) {
        runSequence('dist');
    });
});


gulp.task('help', function(done) {

    for(var p in {
        '-c, --clean': '',
        '-m, --min': '',
        '-a, --all': '',
        '-t, --theme': '',
        '-p, --prefix': ''
    }) {
        console.log(p);
    }

    done();
});


/*
 * dist core tasks
 * ---------------------------------------------------------*/
gulp.task('dist-clean', function(done) {

    if (gutil.env.c || gutil.env.clean) {
        return gulp.src('dist', {read: false}).pipe(rimraf());
    } else {
        done();
    }
});

gulp.task('dist-core-move', ['dist-clean'], function() {
    return gulp.src(['./src/**']).pipe(gulp.dest('./dist'));
});

gulp.task('dist-core-minify', function(done) {

    if (watchmode) {
        return done();
    }

    // minify css
    gulp.src(['!./dist/css/**/*.min.css', './dist/css/**/*.css']).pipe(rename({ suffix: '.min' })).pipe(minifycss({advanced:false})).pipe(gulp.dest('./dist/css')).on('end', function(){

        // minify js
        gulp.src(['!./dist/js/**/*.min.js', './dist/js/**/*.js']).pipe(rename({ suffix: '.min' })).pipe(uglify()).pipe(gulp.dest('./dist/js')).on('end', function(){
            done();
        });
    });
});

gulp.task('dist-core-header', function(done) {

    if (watchmode) {
        return done();
    }

    return gulp.src(['./dist/**/*.css', './dist/**/*.js']).pipe(header("/*! <%= pkg.title %> <%= pkg.version %> | <%= pkg.homepage %> | (c) 2014 YOOtheme | MIT License */\n", { 'pkg' : pkg } )).pipe(gulp.dest('./dist/'));
});

gulp.task('dist-bower-file', function(done) {
    var meta = {
        "name": "uikit",
        "version": pkg.version,
        "homepage": "http://getuikit.com",
        "main": [
            "css/uikit.min.css",
            "js/uikit.min.js",
            "fonts/fontawesome-webfont.ttf",
            "fonts/fontawesome-webfont.woff",
            "fonts/fontawesome-webfont.woff2",
            "fonts/FontAwesome.otf"
        ],
        "dependencies": {
            "jquery": "~2.1.0"
        },
        "ignore": [
            "node_modules",
            "bower_components",
            "docs",
            "vendor",
            "composer.json",
            "index.html"
        ],
        "private": true
    };

    fs.writeFile('./dist/bower.json', JSON.stringify(meta, " ", 4), function(){
        done();
    });
});

// generate dist zip file
gulp.task('build', ['dist-clean'], function (done) {

    runSequence('dist', function(){
        gulp.src(['./dist/**/*.css', './dist/**/*.js', './dist/*/[Ff]ont*', '!./dist/bower.json'])
            .pipe(zip('uikit-'+pkg.version+'.zip')).pipe(gulp.dest('dist')).on('end', done);
    });
});


/*
 * sass converter related tasks
 * ---------------------------------------------------------*/

gulp.task('sass-copy', function() {

    return gulp.src('./dist/less/**/*.less').pipe(rename(function (path) {
        path.extname = ".scss";
    })).pipe(gulp.dest('./dist/scss'));
});

gulp.task('sass-convert', ['sass-copy'], function() {

    return gulp.src('./dist/scss/**/*.scss')
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
           .pipe(gulp.dest('./dist/scss'));
});

gulp.task('sass', ['sass-convert'], function(done) {

    glob('./dist/scss/**/*.scss', function (err, files) {

        if (err) return;

        var re     = /\/\/ @mixin ([\w\-]*)\s*\((.*)\)\s*\{\s*\}/g,
            mixins = [],
            promises = [],
            cache = {};

        files.forEach(function(file) {

            promises.push(new Promise(function(resolve, reject){


                fs.readFile(file, {encoding: 'utf-8'},function read(err, content) {

                    if (err) throw err;

                    var matches, tmp;

                    while(matches = re.exec(content)) {

                        tmp = matches[0].replace(/\/\/\s*/, '');

                        if (!cache[tmp]) {
                            mixins.push(String(tmp));
                            cache[tmp] = true;
                        }
                    }

                    resolve();
                });

            }));
        });

        Promise.all(promises).then(function(){
            fs.writeFile('./dist/scss/uikit-mixins.scss', mixins.join('\n'), function (err) {
              if (err) throw err;
              done();
            });
        });
    });
});

/*
 * theme related tasks
 * ---------------------------------------------------------*/

gulp.task('dist-variables', ['dist-core-move'], function(done) {

    var regexp  = /(@[\w\-]+\s*:(.*);?)/g, variables = [], promises = [], cache = {};

    glob('./src/less/**/*.less', function (err, files) {

        files.forEach(function(file, index){

            promises.push(new Promise(function(resolve, reject) {

                fs.readFile(file, "utf-8", function(err, data) {

                    var matches, tmp;

                    while(matches = regexp.exec(data)) {
                        tmp = matches[0].split(':')[0].trim();

                        if (!cache[tmp]) {
                            variables.push(matches[0]);
                            cache[tmp] = true;
                        }
                    }

                    resolve();
                });
            }));
        });

        Promise.all(promises).then(function(){

            fs.writeFile('./dist/less/uikit-variables.less', variables.join('\n'), function (err) {
              if (err) throw err;
              done();
            });
        });
    });
});

gulp.task('dist-themes', ['dist-variables'], function(done) {

    var promises = [];

    glob('dist/less/components/*.less', function(globerr, files){

        files.forEach(function(file) {

            var component = path.basename(file),
                compname  = path.basename(file, '.less'),
                cpath     = path.dirname(file),
                content;

            themes.forEach(function(theme) {

                if (theme.path.match(/custom/)) return;

                var tplpath = [cpath, compname+'.'+theme.name+'.less'].join('/'),
                    csspath = ['./dist/css/components', compname+'.'+theme.name+'.css'].join('/'),

                    promise = new Promise(function(resolve, reject){

                        content = [
                            '@import "../uikit-variables.less";',
                            '@import "'+component+'";'
                        ];

                        if (fs.existsSync(theme.path+'/variables.less')) {
                            content.push('@import "../../../'+theme.path+'/variables.less";');
                        }

                        if (fs.existsSync(theme.path+'/'+component)) {
                            content.push('@import "../../../'+theme.path+'/'+component+'";');
                        }

                        fs.writeFile(tplpath, content.join('\n'), function(){

                            gulp.src(tplpath).pipe(less()).pipe(gulp.dest(path.dirname(csspath))).on('end', function(){

                                fs.unlink(tplpath, function(){

                                    if (csspath.match(/\.default\.css/)) {
                                        fs.rename(csspath, csspath.replace('.default.css', '.css'), resolve);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        });
                    });

                promises.push(promise);
            });
        });

        Promise.all(promises).then(function(){ done(); });
    });
});

gulp.task('dist-themes-core', ['dist-themes'], function(done) {

    var promises = [];

    themes.forEach(function(theme) {

        var modifyVars = {
            'global-image-path': ('"../../'+theme.path+'/images"'),
            'global-font-path': ('"../../'+theme.path+'/fonts"')
        };

        promises.push(new Promise(function(resolve, reject){

            gulp.src(theme.uikit).pipe(less({"modifyVars": modifyVars}).on('error', function(error) {

                gutil.log(gutil.colors.red('Error in ') + '\'' + gutil.colors.cyan(theme.uikit) + '\'\n', error.toString());
                resolve();

            })).pipe(rename({ suffix: ('.'+theme.name) })).pipe(gulp.dest('./dist/css')).on('end', function(){

                if (theme.name == 'default') {
                    fs.renameSync('./dist/css/uikit.default.css', './dist/css/uikit.css');
                }

                resolve();
            });
        }));
    });

    Promise.all(promises).then(function(){
        gulp.src(corejs).pipe(concat('uikit.js')).pipe(gulp.dest('./dist/js')).on('end', function(){
            done();
        });
    });
});

/*
 * misc tasks
 * ---------------------------------------------------------*/
gulp.task('build-docs', function(done) {

    // minify css
    gulp.src('./docs/less/uikit.less').pipe(less()).pipe(rename({ suffix: '.docs.min' })).pipe(minifycss({advanced:false})).pipe(gulp.dest('./docs/css')).on('end', function(){

        gulp.src(corejs).pipe(concat('uikit.min.js')).pipe(uglify()).pipe(gulp.dest('./docs/js')).on('end', function(){
            done();
        });
    });
});

gulp.task('build-site', ['indexthemes'], function(done) {

    gulp.src(['docs/js/docs.js', 'docs/js/analytics.js'])
        .pipe(concat('docs.js'))
        .pipe(gulp.dest('docs/js/')).on('end', done)
});

gulp.task('indexthemes', function() {

    var data = [];

    getThemes(false, true).forEach(function(theme) {

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

gulp.task('prefix', function(done) {
    var prefix = gutil.env.p || gutil.env.prefix || false;

    if(!prefix) {
        return done();
    }

    gutil.log("Replacing prefix 'uk' with '"+prefix+"'");

    gulp.src(['./dist/**/*.css', './dist/**/*.less', './dist/**/*.scss', './dist/**/*.js'])
        .pipe(replace(/(uk-([a-z\d\-]+))/g, prefix+'-$2'))
        .pipe(replace(/data-uk-/g, 'data-'+prefix+'-'))
        .pipe(replace(/UIkit2/g, 'UIkit2'+prefix))
        .pipe(gulp.dest('./dist'))
        .on('end', done);
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
        if ((i !== 0) && (i%20 === 0)) result.push("\n    ");
    });

    return "[" + result.join("") + "]";
};

// classes: uk-* from CSS files
gulp.task('sublime-css', function(done) {

    mkdirp("dist/sublime", function () {

        gulp.src(['dist/**/*.min.css', 'dist/uikit.min.css'])
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

                fs.writeFile("dist/sublime/tmp_css.py", pystring, done);

            }));
    });
});

// data attributes: data-uk-* from JS files
gulp.task('sublime-js', function(done) {

    mkdirp("dist/sublime", function(){

        gulp.src(['dist/**/*.min.js', 'dist/uikit.min.js']).pipe(concat('sublime_tmp_js.py')).pipe(tap(function(file) {

            var js       = file.contents.toString(),
                dataList = js.match(/data-uk-[a-z\d\-]+/g),
                dataSet  = {};

            dataList.forEach(function(s) { dataSet[s] = true; });

            pystring = 'uikit_data = ' + pythonList(Object.keys(dataSet)) + '\n';

            fs.writeFile("dist/sublime/tmp_js.py", pystring, done);

        }));
    });
});

gulp.task('sublime-snippets',  function(done) {

    var template = ["<snippet>",
                        "<content><![CDATA[{content}]]></content>",
                        "<tabTrigger>{trigger}</tabTrigger>",
                        "<scope>text.html</scope>",
                        "<description>{description}</description>",
                    "</snippet>"].join("\n");

    mkdirp.sync("dist/sublime/snippets");

    gulp.src("dist/**/*.less").pipe(tap(function(file) {

        var less = file.contents.toString(),
            regex = /\/\/\s*<!--\s*(.+)\s*-->\s*\n((\/\/.+\n)+)/g,
            match = null, name, content, description, snippet, i;

        while (match = regex.exec(less)) {

            name        = match[1].trim(); // i.e. uk-grid + trim
            content     = match[2].replace(/(\n?)(\s*)\/\/ ?/g,'$1$2'); // remove comment slashes from lines
            description = ["UIkit", name, "component"].join(" ");

            // place tab indices
            i = 1; // tab index, start with 1
            content = content.replace(/class="([^"]+)"/g, 'class="${{index}:$1}"') // inside class attributes
                             .replace(/(<[^>]+>)(<\/[^>]+>)/g, '$1${index}$2') // inside empty elements
                             .replace(/\{index\}/g, function() { return i++; });

            snippet = template.replace("{content}", content)
                              .replace("{trigger}", "uikit")
                              .replace("{description}", description);

            fs.writeFile('dist/sublime/snippets/'+name+'.sublime-snippet', snippet);

            // move to next match in loop
            regex.lastIndex = match.index + 1;
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
