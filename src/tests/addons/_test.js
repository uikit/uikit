(function(iniframe){

    window.CustomizerForceUpdate = true;

    window.less = { env: "development" };

    document.writeln('<script src="../../../vendor/holder.js"></script>');
    document.writeln('<script src="../../../vendor/less.js"></script>');
    document.writeln('<script src="../../../vendor/jquery.less.js"></script>');
    document.writeln('<script src="../../../vendor/jquery.rtl.js"></script>');
    document.writeln('<script src="../../../dist/js/uikit.js"></script>');
    document.writeln('<link rel="stylesheet" href="../../../dist/css/uikit.min.css" data-compiled-css>');
    document.writeln('<style>body{ visibility: hidden; }</style>');

    var tests = [
            "autocomplete",
            "datepicker",
            "dotnav",
            "form-advanced",
            "form-file",
            "form-password",
            "form-select",
            "htmleditor",
            "nestable",
            "notify",
            "pagination",
            "placeholder",
            "search",
            "slidenav",
            "sortable",
            "sticky",
            "timepicker",
            "upload"
        ],
        themes = {
            "Default":"../../../themes/default/default/uikit.less",
            "Almost Flat":"../../../themes/default/almost-flat/uikit.less",
            "Gradient":"../../../themes/default/gradient/uikit.less",
            "UIkit": "../../less/uikit.less"
        },
        theme      = localStorage["uikit.theme"] || 'Default',
        direction  = localStorage["uikit.direction"] || 'ltr',
        addon      = location.href.match(/tests\/addons\/(.+?)\.html/)[1];

    $(function(){

        $.get("../../../themes/themes.json", {nocache:Math.random()}).always(function(data, type){

            if (type==="success") {

                themes = {
                    "UIkit": "../../less/uikit.less"
                };

                data.forEach(function(item){
                    themes[item.name] = '../../'+item.url;
                });
            }

            theme  = themes[theme] ? theme : 'Default';

            render();
        });

    });

    function render() {

        theme  = themes[theme] ? theme : 'Default';

        var testfolder = $("script[src$='_test.js']").attr("src").replace("_test.js", ""),
            testselect = $('<select><option value="">- Select Test -</option></select>').css("margin", "20px 5px")


        $.each(tests.sort(), function(){
            var value = this, name  = value.charAt(0).toUpperCase() + value.slice(1);

            testselect.append('<option value="'+value+'.html">'+name+'</option>');
        });

        testselect.val(testselect.find("option[value='"+location.href.split("/").slice(-1)[0]+"']").attr("value")).on("change", function(){
                if(testselect.val()) location.href = testfolder+testselect.val();
        });

        // rtl

        var rtlcheckbox = $('<input type="checkbox">').on('change', function(e) {
                localStorage['uikit.direction'] = ($(e.target).is(':checked') ? 'rtl' : 'ltr');
                location.reload();
            }).css("margin", "20px 5px").prop('checked', direction == 'rtl'),

            rtlcheckbox_label = $("<label>RTL mode</label>").css("margin", "20px 10px 20px 3px").prepend(rtlcheckbox);

        if($.UIkit) $.UIkit.langdirection = rtlcheckbox.is(":checked") ? "right":"left";

        $(".uk-container").prepend(rtlcheckbox_label);


        //themes

        var themeselect = $('<select></select>');

        $.each(themes, function(key){
            themeselect.append('<option value="'+key+'">'+key+'</option>');
        });

        themeselect.val(theme).on("change", function(){
            localStorage["uikit.theme"] = themeselect.val();
            location.reload();
        });

        $(".uk-container").prepend(themeselect).prepend(testselect);

        var lessparser = new less.Parser({paths: [], env: "development"}),
            lesscode   = [],
            compile    = function() {

                $.less.getCSS(lesscode.join("\n"), {imports:true}).done(function(css) {

                    if (direction == 'rtl') {
                        css = $.rtl.convert2RTL(css);
                        $('html').prop('dir', 'rtl');
                    }

                    $("[data-compiled-css]").replaceWith('<style data-compiled-css>'+css+'</style>');

                    setTimeout(function() { $("body").css("visibility", "visible"); }, 50);

                }).fail(function(e) {
                    $(".uk-container").prepend('<div style="border: 1px solid rgb(238, 0, 0);background:rgb(238, 238, 238); border-radius: 5px; color: rgb(238, 0, 0); padding: 15px; margin-bottom: 15px;">'+e.message+" in file "+e.filename+'</div>');
                    $("body").css("visibility", "visible");
                });
            };

        lesscode.push('@import "'+(themes[theme])+'";');

        var addonoverride = [themes[theme].match(/(.+)\/uikit\.less$/)[1], "uikit-addons.less"].join("/");

        $.get(addonoverride, {nc:Math.random()}).always(function(data, type){

            if (type==="success") {

                lesscode.push('@import "'+addonoverride+'";');
                compile();

            } else {

                $.get('../../less/uikit-addons.less', {nc:Math.random()}).always(function(data, type){

                    if (type==="success") {
                        lesscode.push('@import "../../less/uikit-addons.less";');
                    }

                    compile();
                });
            }
        });
    }

})(window !== window.parent);