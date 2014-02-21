module.exports = function(grunt) {

    "use strict";

    var fs = require('fs'), pkginfo = grunt.file.readJSON("package.json");

    grunt.initConfig({

        pkg: pkginfo,

        meta: {
            banner: "/*! <%= pkg.title %> <%= pkg.version %> | <%= pkg.homepage %> | (c) 2014 YOOtheme | MIT License */"
        },

        jshint: {
            src: {
                options: {
                    jshintrc: "src/.jshintrc"
                },
                src: ["src/js/*.js"]
            }
        },

        less: (function(){

            var lessconf = {
                "docsmin": {
                    options: { paths: ["docs/less"], cleancss: true },
                    files: { "docs/css/uikit.docs.min.css": ["docs/less/uikit.less"] }
                }
            },

            themes = [];

            //themes

            ["default", "custom"].forEach(function(f){

                if(fs.existsSync('themes/'+f)) {

                    fs.readdirSync('themes/'+f).forEach(function(t){

                        var themepath = 'themes/'+f+'/'+t,
                            distpath  = f=="default" ? "dist/css" : themepath+"/dist";

                        // Is it a directory?
                        if (fs.lstatSync(themepath).isDirectory() && t!=="blank" && t!=='.git') {

                            var files = {};

                            if(t=="default") {
                                files[distpath+"/uikit.css"] = [themepath+"/uikit.less"];
                            } else {
                                files[distpath+"/uikit."+t+".css"] = [themepath+"/uikit.less"];
                            }

                            lessconf[t] = {
                                "options": { paths: [themepath] },
                                "files": files
                            };

                            var filesmin = {};

                            if(t=="default") {
                                filesmin[distpath+"/uikit.min.css"] = [themepath+"/uikit.less"];
                            } else {
                                filesmin[distpath+"/uikit."+t+".min.css"] = [themepath+"/uikit.less"];
                            }

                            lessconf[t+"min"] = {
                                "options": { paths: [themepath], cleancss: true},
                                "files": filesmin
                            };

                            themes.push({ "path":themepath, "name":t, "dir":f });
                        }
                    });
                }
            });

            //addons

            fs.readdirSync('addons/src').forEach(function(f){

                var addon = 'addons/src/'+f+'/'+f+'.less';

                if(fs.existsSync(addon)) {

                  lessconf["addon-"+f] = {options: { paths: ['addons/src/'+f] }, files: {} };
                  lessconf["addon-"+f].files["dist/addons/css/"+f+".css"] = [addon];

                  lessconf["addon-min-"+f] = {options: { paths: ['addons/src/'+f], cleancss: true }, files: {} };
                  lessconf["addon-min-"+f].files["dist/addons/css/"+f+".min.css"] = [addon];

                  // look for theme overrides
                  themes.forEach(function(theme){

                     var override = theme.path+'/addon.'+f+'.less',
                         distpath = theme.dir=="default" ? "dist/addons/css" : theme.path+"/dist/addons";;

                     if(fs.existsSync(override)) {

                       if(theme.dir=="default" && theme.name=="default") {

                         lessconf["addon-"+f+"-"+theme.name] = {options: { paths: [theme.path] }, files: {} };
                         lessconf["addon-"+f+"-"+theme.name].files[distpath+"/"+f+".css"] = [override];

                         lessconf["addon-min-"+f+"-"+theme.name] = {options: { paths: [theme.path], cleancss: true }, files: {} };
                         lessconf["addon-min-"+f+"-"+theme.name].files[distpath+"/"+f+".min.css"] = [override];

                       } else {

                          lessconf["addon-"+f+"-"+theme.name] = {options: { paths: [theme.path] }, files: {} };
                          lessconf["addon-"+f+"-"+theme.name].files[distpath+"/"+f+"."+theme.name+".css"] = [override];

                          lessconf["addon-min-"+f+"-"+theme.name] = {options: { paths: [theme.path], cleancss: true }, files: {} };
                          lessconf["addon-min-"+f+"-"+theme.name].files[distpath+"/"+f+"."+theme.name+".min.css"] = [override];

                       }
                     }
                  });
                }
            });

            return lessconf;
        })(),

        copy: {
            fonts: {
                files: [{ expand: true, cwd: "src/fonts", src: ["*"], dest: "dist/fonts/" }]
            },
            addons: {
              files: [{ expand: true, src: ["addons/src/**/*.js"], dest: "dist/addons/js", flatten: true }]
            },
            scss: {
                files: [{ expand: true, cwd: "src/less", src: ["*"], dest: "src/scss/", ext: '.scss' }]
            },
            scssthemes: {
                files: [{ expand: true, src: "themes/**/*.less", ext: '.scss' }]
            }
        },

        // convert LESS to SCSS
        replace: {
            scss: {
                src: ['src/scss/*.scss', 'themes/**/*.scss'],  // source files array
                overwrite: true,
                // dest: 'build/text/',   // destination directory or file
                replacements: [ { // replace comments
                    from: ' LESS ', to: ' SCSS '
                }, { // change less/ dir to scss/ on imports
                    from: '/less/', to: '/scss/'
                }, { // change .less extensions to .scss on imports
                    from: '\.less', to: '\.scss'
                }, { // replace '@' with '$'
                    from: '@', to: '$'
                }, { // mixins
                    from: /\.([\w\-]*)\s*\((.*)\)\s*\{/g, to: '@mixin $1($2){'
                }, { // includes
                    from: /\.([\w\-]*\(.*\)\s*;)/g, to: '@include $1'
                }, { // replace valid '@' statements
                    from: /\$(import|media|font-face)/g, to: '@$1'
                }, { // string literals
                    // from: /~"(.*)"/g, to: '#{"$1"}'
                    from: /\$\{/g, to: '#{'
                }]
            }
        },

        concat: {
            dist: {
                options: {
                    separator: "\n\n"
                },
                src: ["src/js/core.js",
                      "src/js/utility.js",
                      "src/js/touch.js",
                      "src/js/alert.js",
                      "src/js/button.js",
                      "src/js/dropdown.js",
                      "src/js/grid.js",
                      "src/js/modal.js",
                      "src/js/offcanvas.js",
                      "src/js/nav.js",
                      "src/js/tooltip.js",
                      "src/js/switcher.js",
                      "src/js/tab.js",
                      "src/js/search.js",
                      "src/js/scrollspy.js",
                      "src/js/smooth-scroll.js",
                      "src/js/toggle.js",
                      ],
                dest: "dist/js/uikit.js"
            }
        },

        usebanner: {
            dist: {
              options: {
                position: 'top',
                banner: "<%= meta.banner %>\n"
              },
              files: {
                src: [ 'dist/css/*.css', 'dist/js/*.js', 'dist/addons/css/*.css', 'dist/addons/js/*.js' ]
              }
            }
        },

        uglify: {
            distmin: {
                options: {
                    //banner: "<%= meta.banner %>\n"
                },
                files: {
                    "dist/js/uikit.min.js": ["dist/js/uikit.js"]
                }
            },
            addonsmin: {
              files: (function(){

                  var files = {};

                  fs.readdirSync('addons/src').forEach(function(f){

                      var addon = 'addons/src/'+f+'/'+f+'.js';

                      if(fs.existsSync(addon)) {
                        files['dist/addons/js/'+f+'.min.js'] = [addon];
                      }
                  });

                  return files;
              })()
            }
        },

        compress: {
            dist: {
                options: {
                    archive: ("dist/uikit-"+pkginfo.version+".zip")
                },
                files: [
                    { expand: true, cwd: "dist/", src: ["css/*", "js/*", "fonts/*", "addons/css/*", "addons/js/*"], dest: "" }
                ]
            }
        },

        watch: {
            src: {
                files: ["src/**/*.less", "themes/**/*.less","src/js/*.js"],
                tasks: ["build"]
            }
        }

    });

    grunt.registerTask('indexthemes', 'Rebuilding theme index.', function() {

       var themes = [];

       ["default", "custom"].forEach(function(f){

           if(fs.existsSync('themes/'+f)) {

               fs.readdirSync('themes/'+f).forEach(function(t){

                   var themepath = 'themes/'+f+'/'+t;

                   // Is it a directory?
                   if (fs.lstatSync(themepath).isDirectory() && t!=="blank" && t!=='.git') {

                       var theme = {
                           "name"  : t.split("-").join(" ").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) { return $1.toUpperCase(); }),
                           "url"   : "../"+themepath+"/uikit.less",
                           "config": (fs.existsSync(themepath+"/customizer.json") ? "../"+themepath+"/customizer.json" : "../themes/default/uikit/customizer.json"),
                           "styles": {}
                       };

                       if(fs.existsSync(themepath+'/styles')) {

                          var styles = {};

                          fs.readdirSync(themepath+'/styles').forEach(function(sf){

                              var stylepath = [themepath, 'styles', sf, 'style.less'].join('/');

                              if(fs.existsSync(stylepath)) {
                                styles[sf] = "../"+themepath+"/styles/"+sf+"/style.less";
                              }
                          });

                          theme.styles = styles;
                       }

                       themes.push(theme);
                   }
               });
           }
       });

       grunt.log.writeln(themes.length+' themes found: ' + themes.map(function(theme){ return theme.name;}).join(", "));

       fs.writeFileSync("themes/themes.json", JSON.stringify(themes, " ", 4));
    });

    grunt.registerTask('sublime', 'Building Sublime Text Package', function() {
      var filepath = 'dist/css/uikit.css';
      if (!fs.existsSync(filepath)) {
        grunt.log.error("Not found: " + filepath);
        return;
      }
      var cssContent   = grunt.file.read(filepath),
          classesList = cssContent.match(/\.(uk-[a-z\d\-]+)/g),
          classesSet  = {},
          pystring    = '# copy & paste into sublime plugin code:\n';

      // use object as set (no duplicates)
      classesList.forEach(function(c) {
        c = c.substr(1); // remove leading dot
        classesSet[c] = true;
      });

      // convert set back to list
      /*
      classesList = [];
      for( var c in classesSet ) {
          if (classesSet.hasOwnProperty(c)){
             classesList.push(c);
          }
      }
      */
      classesList = Object.keys(classesSet);

      pystring += 'uikit_classes = ["' + classesList.join('", "') + '"]\n';

      filepath = 'dist/js/uikit.js';
      if (!fs.existsSync(filepath)) {
        grunt.log.error("Not found: " + filepath);
        return;
      }
      var jsContent = grunt.file.read(filepath),
        dataList    = jsContent.match(/data-uk-[a-z\d\-]+/g),
        dataSet     = {};

      dataList.forEach(function(s) { dataSet[s] = true; });
      /*
      dataList = [];
      for (var p in dataSet) {
        if (dataSet.hasOwnProperty(p)) {
          dataList.push(p);
        }
      }
      */
      dataList = Object.keys(dataSet);
      pystring += 'uikit_data = ["' + dataList.join('", "') + '"]\n';

      grunt.file.write('dist/uikit_completions.py', pystring);
      grunt.log.writeln('Written: dist/uikit_completions.py');
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-text-replace");
    grunt.loadNpmTasks("grunt-banner");

    // Register grunt tasks
    grunt.registerTask("build", ["jshint", "indexthemes", "less", "concat", "copy", "uglify", "usebanner"]);
    grunt.registerTask("build-scss", ["copy:scss", "copy:scssthemes", "replace:scss"]);
    grunt.registerTask("default", ["build", "compress"]);

};
