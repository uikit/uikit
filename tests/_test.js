(function(d, w){

    var scriptest =  document.querySelector('script[src*="_test.js"]'),
        base      = '../'+ scriptest.attributes.src.value.replace('_test.js', '');

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

    var tests = [

        "::Core",

            "base",
            "grid",
            "subnav",
            "text",
            "typography"
    ];
    document.addEventListener("DOMContentLoaded", function(event) {

        $ = jQuery.noConflict();

        var $body      = $("body").css("visibility", "hidden"),
            $scriptest = $(scriptest),
            $controls  = $('<div class="uk-form uk-margin-top uk-margin-bottom uk-container uk-container-center"></div>');

       // test select

        var testfolder  = base + 'tests/',
            $testselect = $('<select><option value="">- Select Test -</option></select>').css("margin", "0 5px"),
            optgroup;

        $.each(tests, function(){

            var value = this, name = value.split("/").slice(-1)[0];

            name = name.charAt(0).toUpperCase() + name.slice(1);

            if (value.indexOf('::')===0) {
                optgroup = $('<optgroup label="'+value.replace('::', '')+'"></optgroup>').appendTo($testselect);
                return;
            }

            optgroup.append('<option value="'+value+'.html">'+name+'</option>');
        });

        $testselect.on("change", function(){
            if ($testselect.val()) location.href = testfolder+$testselect.val();
        });

        $controls.prepend($testselect);
        $body.prepend($controls).css("visibility", "");
    });

})(document, window);
