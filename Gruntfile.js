module.exports = function(grunt) {

    "use strict";

    var pkginfo = grunt.file.readJSON("package.json");

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
            },
            grunt: {
                src: ["Gruntfile.js"]
            }
        },

        less: {
            dist: {
                options: {
                    paths: ["src/less"]
                },
                files: {
                    "dist/css/uikit.css": ["src/less/uikit.less"]
                }
            },
            distmin: {
                options: {
                    paths: ["src/less"],
                    yuicompress: true
                },
                files: {
                    "dist/css/uikit.min.css": ["src/less/uikit.less"]
                }
            },
            gradient: {
                options: {
                    paths: ["src/themes/gradient"]
                },
                files: {
                    "dist/css/uikit.gradient.css": ["src/themes/gradient/uikit.less"]
                }
            },
            gradientmin: {
                options: {
                    paths: ["src/themes/gradient"],
                    yuicompress: true
                },
                files: {
                    "dist/css/uikit.gradient.min.css": ["src/themes/gradient/uikit.less"]
                }
            },
            almostflat: {
                options: {
                    paths: ["src/themes/almost-flat"]
                },
                files: {
                    "dist/css/uikit.almostflat.css": ["src/themes/almost-flat/uikit.less"]
                }
            },
            almostflatmin: {
                options: {
                    paths: ["src/themes/almost-flat"],
                    yuicompress: true
                },
                files: {
                    "dist/css/uikit.almostflat.min.css": ["src/themes/almost-flat/uikit.less"]
                }
            },
            docsmin: {
                options: {
                    paths: ["docs/less"],
                    yuicompress: true
                },
                files: {
                    "docs/css/uikit.docs.min.css": ["docs/less/uikit.less"]
                }
            }
        },

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
                      "src/js/navbar.js",
                      "src/js/tooltip.js",
                      "src/js/switcher.js",
                      "src/js/tab.js",
                      "src/js/search.js",
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
                files: ["src/**/*.less", "src/js/*.js"],
                tasks: ["build"]
            }
        }

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
    grunt.registerTask("build", ["jshint", "less", "concat", "uglify", "usebanner", "copy"]);
    grunt.registerTask("default", ["build", "compress"]);

};