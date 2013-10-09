
module.exports = function(grunt) {

    "use strict";

    var fs = require('fs'), pkginfo = grunt.file.readJSON("package.json");

    grunt.initConfig({

        pkg: pkginfo,

        meta: {
          banner: "/*! <%= pkg.title %> <%= pkg.version %> | <%= pkg.homepage %> | (c) 2013 YOOtheme | MIT License */"
        },

        jshint: {
            src: {
                options: {
                    jshintrc: "src/.jshintrc"
                },
                src: ["src/js/*.js"]
            },
            tests: {
                options: {
                    jshintrc: "src/.jshintrc"
                },
                src: ["tests/js/unit/*.js"]
            }
        },

        less: (function(){

            var lessconf = {
                "docsmin": {
                    options: { paths: ["docs/less"], yuicompress: true },
                    files: { "docs/css/uikit.docs.min.css": ["docs/less/uikit.less"] }
                }
            };

            ["default", "custom"].forEach(function(f){

                if(fs.existsSync('themes/'+f)) {

                    fs.readdirSync('themes/'+f).forEach(function(t){

                        var themepath = 'themes/'+f+'/'+t,
                            distpath  = f=="default" ? "dist/css" : themepath+"/dist";

                        // Is it a directory?
                        if (fs.lstatSync(themepath).isDirectory() && t!=="blank") {

                            var files = {};

                            if(t=="uikit") {
                                files[distpath+"/uikit.css"] = [themepath+"/uikit.less"];
                            } else {
                                files[distpath+"/uikit."+t+".css"] = [themepath+"/uikit.less"];
                            }

                            lessconf[t] = {
                                "options": { paths: [themepath] },
                                "files": files
                            };

                            var filesmin = {};

                            if(t=="uikit") {
                                filesmin[distpath+"/uikit.min.css"] = [themepath+"/uikit.less"];
                            } else {
                                filesmin[distpath+"/uikit."+t+".min.css"] = [themepath+"/uikit.less"];
                            }

                            lessconf[t+"min"] = {
                                "options": { paths: [themepath], yuicompress: true},
                                "files": filesmin
                            };
                        }
                    });
                }
            });

            return lessconf;
        })(),

        copy: {
            fonts: {
                files: [{ expand: true, cwd: "src/fonts", src: ["*"], dest: "dist/fonts/" }]
            }
        },

        concat: {
            dist: {
                options: {
                    separator: "\n\n"
                },
                src: ["src/js/core.js",
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
                      "src/js/smooth-scroll.js"
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
                src: [ 'dist/css/*.css', 'dist/js/*.js' ]
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
            }
        },

        compress: {
            dist: {
                options: {
                    archive: ("dist/uikit-"+pkginfo.version+".zip")
                },
                files: [
                    { expand: true, cwd: "dist/", src: ["css/*", "js/*", "fonts/*"], dest: "" }
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
                   if (fs.lstatSync(themepath).isDirectory() && t!=="blank") {
                       themes.push({
                           "name"  : t.split("-").join(" ").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) { return $1.toUpperCase(); }),
                           "url"   : "../"+themepath+"/uikit.less",
                           "config": "../"+themepath+"/customizer.json"
                       });
                   }
               });
           }
       });

       grunt.log.writeln(themes.length+' themes found: ' + themes.map(function(theme){ return theme.name;}).join(", "));

       fs.writeFileSync("themes/themes.json", JSON.stringify(themes, " ", 4));
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-banner");

    // Register grunt tasks
    grunt.registerTask("build", ["jshint", "indexthemes", "less", "concat", "uglify", "usebanner", "copy"]);
    grunt.registerTask("default", ["build", "compress"]);

};