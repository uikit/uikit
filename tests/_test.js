(function(iniframe){

    window.CustomizerForceUpdate = iniframe;

    var scriptest =  document.querySelector('script[src*="_test.js"]'),
        base      = '../'+ scriptest.attributes.src.value.replace('_test.js', '');

    var styles = [

        // uikit core
        'dist/css/uikit{style}.css',

        // components
        'dist/css/components/autocomplete{style}.css',
        'dist/css/components/cover{style}.css',
        'dist/css/components/datepicker{style}.css',
        'dist/css/components/dotnav{style}.css',
        'dist/css/components/flex{style}.css',
        'dist/css/components/form-advanced{style}.css',
        'dist/css/components/form-file{style}.css',
        'dist/css/components/form-password{style}.css',
        'dist/css/components/form-select{style}.css',
        'dist/css/components/htmleditor{style}.css',
        'dist/css/components/nestable{style}.css',
        'dist/css/components/notify{style}.css',
        'dist/css/components/placeholder{style}.css',
        'dist/css/components/search{style}.css',
        'dist/css/components/slidenav{style}.css',
        'dist/css/components/sortable{style}.css',
        'dist/css/components/sticky{style}.css',
        'dist/css/components/upload{style}.css'
    ];


    // include needed scripts
    ([

        // vendor
        'vendor/jquery.js',
        'vendor/holder.js',

        // uikit
        'src/js/core/core.js',
        'src/js/core/touch.js',
        'src/js/core/utility.js',
        'src/js/core/smooth-scroll.js',
        'src/js/core/scrollspy.js',
        'src/js/core/toggle.js',
        'src/js/core/alert.js',
        'src/js/core/button.js',
        'src/js/core/dropdown.js',
        'src/js/core/grid.js',
        'src/js/core/modal.js',
        'src/js/core/nav.js',
        'src/js/core/offcanvas.js',
        'src/js/core/switcher.js',
        'src/js/core/tab.js',
        'src/js/core/tooltip.js'

    ]).forEach(function(script) {
        document.writeln('<script src="'+base+script+'"></script>');
    });


    if (iniframe) {
        document.writeln('<style data-compiled-css>@import url("../dist/css/uikit.css"); </style>');
    }

    var tests = [

        "::Core",

            "core/alert",
            "core/animation",
            "core/article",
            "core/badge",
            "core/base",
            "core/breadcrumb",
            "core/button",
            "core/close",
            "core/comment",
            "core/description-list",
            "core/dropdown",
            "core/form",
            "core/grid",
            "core/icon",
            "core/list",
            "core/modal",
            "core/nav",
            "core/navbar",
            "core/offcanvas",
            "core/overlay",
            "core/pagination",
            "core/panel",
            "core/progress",
            "core/scrollspy",
            "core/smooth-scroll",
            "core/subnav",
            "core/switcher",
            "core/tab",
            "core/table",
            "core/text",
            "core/thumbnail",
            "core/toggle",
            "core/tooltip",
            "core/utility",

        "::Components",

            "components/autocomplete",
            "components/cover",
            "components/datepicker",
            "components/dotnav",
            "components/flex",
            "components/form-advanced",
            "components/form-file",
            "components/form-password",
            "components/form-select",
            "components/htmleditor",
            "components/nestable",
            "components/notify",
            "components/pagination-js",
            "components/placeholder",
            "components/search",
            "components/slidenav",
            "components/sortable",
            "components/sticky",
            "components/timepicker",
            "components/upload"
    ];

    document.addEventListener("DOMContentLoaded", function(event) {

        var $body = $("body").css("visibility", "hidden"), $scriptest = $(scriptest);

        var controls = $('<div class="uk-form uk-margin-top uk-margin-bottom uk-container uk-container-center"></div>');

        // test select

        var testfolder = base + 'tests/',
            testselect = $('<select><option value="">- Select Test -</option><option value="overview.html">Overview</option></select>').css("margin", "0 5px"),
            optgroup;

        $.each(tests, function(){

            var value = this, name = value.split("/").slice(-1)[0];

            name  = name.charAt(0).toUpperCase() + name.slice(1);

            if (value.indexOf('::')===0) {
                optgroup   = $('<optgroup label="'+value.replace('::', '')+'"></optgroup>').appendTo(testselect);
                return;
            }

            optgroup.append('<option value="'+value+'.html">'+name+'</option>');
        });

        testselect.val(testselect.find("option[value$='"+((location.href.match(/overview/) ? '':'/') + location.href.split("/").slice(-1)[0])+"']").attr("value")).on("change", function(){
            if(testselect.val()) location.href = testfolder+testselect.val();
        });

        controls.prepend(testselect);

        if (!iniframe) {

            $.get(base+"themes.json", {nocache:Math.random()}).always(function(data, type){

                var theme      = localStorage["uikit.theme"] || 'default',
                    themes = {
                        "default"      : {"name": "Default", "url":"themes/default"},
                        "almost-flat"  : {"name": "Almost Flat", "url":"themes/default"},
                        "gradient"     : {"name": "Gradient", "url":"themes/default"}
                    };

                if (type==="success") {

                    themes = {};

                    data.forEach(function(item){
                        themes[item.id] = {"name": item.name, "url": item.url};
                    });
                }

                theme  = localStorage["uikit.theme"] || 'default';
                theme  = themes[theme] ? theme : 'default';

                // themes
                var themeselect = $('<select></select>');

                $.each(themes, function(key){
                    themeselect.append('<option value="'+key+'">'+themes[key].name+'</option>');
                });

                themeselect.val(theme).on("change", function(){
                    localStorage["uikit.theme"] = themeselect.val();
                    location.reload();
                });

                testselect.after(themeselect);

                var $style = $scriptest, style;

                styles.forEach(function(style) {

                    style = $('<link rel="stylesheet" href="'+base+(style.replace('{style}', theme=='default' ? '':'.'+theme))+'">');

                    $style.after(style);

                    $style = style;
                });


                setTimeout(function() { $body.css("visibility", ""); $(window).trigger("resize"); }, 500);
            });

        } else  {

            setTimeout(function() { $body.css("visibility", ""); $(window).trigger("resize"); }, 500);
        }

        $body.prepend(controls);
    });

    window.tests = tests;

})(window !== window.parent);
