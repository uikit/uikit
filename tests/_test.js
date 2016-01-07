(function(d, w){


    // include less
    ([
        '../less/uikit.less'
    ]).forEach(function(file) {
        //d.writeln('<link rel="stylesheet/less" type="text/css" href="'+file+'"/>');
    });


    // include needed scripts
    ([

        // vendor
        '../vendor/jquery.js',
        '../vendor/holder.js',
        '../vendor/less.js',

        // uikit
        '../js/uikit.js'

    ]).forEach(function(script) {
        d.writeln('<script src="'+script+'"></script>');
    });

})(document, window);
