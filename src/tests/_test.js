(function(iniframe){

    window.CustomizerForceUpdate = true;

    window.less = { env: "development" };

    document.writeln('<script src="../../vendor/holder.js"></script>');
    document.writeln('<script src="../../vendor/less.js"></script>');
    document.writeln('<script src="../../vendor/jquery.less.js"></script>');
    document.writeln('<script src="../../vendor/jquery.rtl.js"></script>');
    document.writeln('<script src="../../src/js/core.js"></script>');
    document.writeln('<script src="../../src/js/component.js"></script>');
    document.writeln('<script src="../../src/js/utility.js"></script>');
    document.writeln('<script src="../../src/js/alert.js"></script>');
    document.writeln('<script src="../../src/js/button.js"></script>');
    document.writeln('<script src="../../src/js/dropdown.js"></script>');
    document.writeln('<script src="../../src/js/grid.js"></script>');
    document.writeln('<script src="../../src/js/modal.js"></script>');
    document.writeln('<script src="../../src/js/nav.js"></script>');
    document.writeln('<script src="../../src/js/offcanvas.js"></script>');
    document.writeln('<script src="../../src/js/scrollspy.js"></script>');
    document.writeln('<script src="../../src/js/smooth-scroll.js"></script>');
    document.writeln('<script src="../../src/js/touch.js"></script>');
    document.writeln('<script src="../../src/js/switcher.js"></script>');
    document.writeln('<script src="../../src/js/tab.js"></script>');
    document.writeln('<script src="../../src/js/tooltip.js"></script>');
    document.writeln('<script src="../../src/js/toggle.js"></script>');
    document.writeln('<link rel="stylesheet" href="../../dist/css/uikit.min.css" data-compiled-css>');
    document.writeln('<style>body{ visibility: hidden; }</style>');

    var tests = [
            "alert",
            "animation",
            "article",
            "badge",
            "base",
            "breadcrumb",
            "button",
            "close",
            "comment",
            "description-list",
            "dropdown",
            "form",
            "grid",
            "icon",
            "list",
            "modal",
            "nav",
            "navbar",
            "normalize",
            "offcanvas",
            "overlay",
            "pagination",
            "panel",
            "progress",
            "scrollspy",
            "smooth-scroll",
            "subnav",
            "switcher",
            "tab",
            "table",
            "text",
            "thumbnail",
            "toggle",
            "tooltip",
            "utility"
        ],
        themes = {
            "Default":"../../themes/default/default/uikit.less",
            "Almost Flat":"../../themes/default/almost-flat/uikit.less",
            "Gradient":"../../themes/default/gradient/uikit.less"
        },
        theme      = localStorage["uikit.theme"] || 'Default',
        direction  = localStorage["uikit.direction"] || 'ltr';


    $(function(){


        var incustomizer = (iniframe && !window.parent.themes);

        themes = $.extend(themes, window.parent.themes ? window.parent.themes:{});
        theme  = themes[theme] ? theme : 'Default';

        var testfolder = $("script[src$='_test.js']").attr("src").replace("_test.js", ""),

            testselect = $('<select><option value="">- Select Test -</option><option value="overview.html">Overview</option></select>').css("margin", "20px 5px"),
            optgroup   = $('<optgroup label="Components"></optgroup>').appendTo(testselect);


        $.each(tests.sort(), function(){
            var value = this, name  = value.charAt(0).toUpperCase() + value.slice(1);

            optgroup.append('<option value="'+value+'.html">'+name+'</option>');
        });

        testselect.val(testselect.find("option[value='"+location.href.split("/").slice(-1)[0]+"']").attr("value")).on("change", function(){
                if(testselect.val()) location.href = testfolder+testselect.val();
        });

        $(".uk-container").prepend(testselect);

        if(incustomizer) {
            $("body").css("visibility", "visible");
            return;
        }

        // themes

        $.get("../../themes/themes.json", {nocache:Math.random()}).always(function(data, type){

            if (type==="success") {

                themes = {
                    "UIkit": "../less/uikit.less"
                };

                data.forEach(function(item){
                    themes[item.name] = '../'+item.url;
                });
            }

            theme  = localStorage["uikit.theme"] || 'Default';
            theme  = themes[theme] ? theme : 'Default';

            render();
        });

        function render() {

                // themes
                var themeselect = $('<select></select>');

                $.each(themes, function(key){
                    themeselect.append('<option value="'+key+'">'+key+'</option>');
                });

                themeselect.val(theme).on("change", function(){
                    localStorage["uikit.theme"] = themeselect.val();
                    location.reload();
                });

                testselect.after(themeselect);

                // rtl
                var rtlcheckbox = $('<input type="checkbox">').on('change', function(e) {
                        localStorage['uikit.direction'] = ($(e.target).is(':checked') ? 'rtl' : 'ltr');
                        location.reload();
                    }).css("margin", "20px 5px").prop('checked', direction == 'rtl'),

                    rtlcheckbox_label = $("<label>RTL mode</label>").css("margin", "20px 10px 20px 3px").prepend(rtlcheckbox);

                if($.UIkit) $.UIkit.langdirection = rtlcheckbox.is(":checked") ? "right":"left";

                themeselect.after(rtlcheckbox_label);

                // less

                $.less.getCSS('@import "'+(themes[theme])+'";', {imports:true}).done(function(css) {

                    if (direction == 'rtl') {
                        css = $.rtl.convert2RTL(css);
                        $('html').prop('dir', 'rtl');
                    }

                    $("[data-compiled-css]").replaceWith('<style data-compiled-css>'+css+'</style>');

                    setTimeout(function() { $("body").css("visibility", "visible"); $(window).trigger("resize"); }, 50);

                }).fail(function(e) {
                    $(".uk-container").prepend('<div style="border: 1px solid rgb(238, 0, 0);background:rgb(238, 238, 238); border-radius: 5px; color: rgb(238, 0, 0); padding: 15px; margin-bottom: 15px;">'+e.message+" in file "+e.filename+'</div>');
                    $("body").css("visibility", "visible");
                });
        }
    });

})(window !== window.parent);