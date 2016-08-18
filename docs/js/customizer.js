jQuery(function($) {

    var $rtl, $style,
        $customizer = $("#customizer"),
        $iframe     = $("#cm-theme-preview"),
        $spinner    = $("i.cm-spinner"),
        $error      = $(".cm-error"),
        $minify     = $("input[name=minify]"),
        $modal      = $("#modal"),
        $download   = (typeof document.createElement('a').download != "undefined"),
        $url        = window.URL || window.webkitURL,
        loaded      = false,
        coptions    = {
            "styles": [
                {"name": "Default", "url": ["../themes/default/uikit-customizer.less"], "config": "../themes/default/customizer.json"},
                {"name": "Gradient", "url": ["../themes/gradient/uikit-customizer.less"], "config": "../themes/gradient/customizer.json"},
                {"name": "Almost Flat", "url": ["../themes/almost-flat/uikit-customizer.less"], "config": "../themes/almost-flat/customizer.json"}
            ]
        },
        memory = window.sessionStorage || {};

    // navigate the iframe to the latest page
    if (memory["uikit-customizer-last-test"]) {
        $iframe.attr('src', memory["uikit-customizer-last-test"]);
    }

    $iframe.css("opacity", "0");
    $spinner.show();

    $.get("../themes.json", {nocache:Math.random()}).always(function(data, type){

        if (type==="success") {

            coptions.styles = [];

            for (var i = 0; i < data.length; i++) {

                data[i].url    = "../"+data[i].url;
                data[i].config = "../"+data[i].config

                coptions.styles.push(data[i]);

                // theme styles?
                if (data[i].styles) {
                    for(var style in data[i].styles) {
                        coptions.styles.push({
                            "name" : data[i].name+" - "+style,
                            "url"  : [data[i].url, "../"+data[i].styles[style]],
                            "config": data[i].config
                        });
                    }
                }
            }
        }

        $customizer.customizer($.extend({
            "updating": function(e, style) {
                $iframe.css("opacity", "0");
                $spinner.show();
            },
            "updated": function(e, style) {

                var url;

                style.fonts = "";

                $("option[data-url]:selected", $customizer).each(function(){
                    if ((url = $(this).data("url")) && style.fonts.indexOf("'" + url + "'") == -1) {
                        style.fonts += "@import '" + url + "';\n";
                    }
                });

                renderPreview($style = style);
            }
        }, coptions));

        $iframe.on("load", function() {
            $customizer.trigger("update", [false, $iframe[0].contentWindow["CustomizerForceUpdate"]]);

            // save the latest page displayed by the iframe
            memory["uikit-customizer-last-test"] = $iframe[0].contentWindow.location.href;
        });
    });

    $error.on({
        "show": function(e, error) {
            $error.html($.mustache("<h1 class=\"uk-h3\">Less {{type}} Error</h1><p>{{message}}</p>", error)).show();
            $iframe.css("opacity", "0");
        },
        "hide": function() {
            $error.hide();
            $iframe.css("opacity", "1");
        }
    });

    $("input[name=rtl]").on("change", function(e) {
        $rtl = $(this).prop("checked");
        renderPreview($style);
    });

    $("a[download='uikit.css']").on("click", function(e) {
        downloadCSS($(this), $style);
    });

    $("a[download='style.less']").on("click", function(e) {
        downloadLess($(this), $style);
    });

    if (!$download) {
        $("a[download]").attr("href", "#modal").uk("modal");
    } else {
        $("a[download]").attr("href", $url.createObjectURL(new Blob([''], {type: "application/force-download"})));
    }

    if (window.FileReader) {

       $customizer.on("change", ".cm-file-import input", function(){

            var f = this.files[0], input = this;

            if (f && f.name) {

                var r = new FileReader();

                r.onload = function(e) {

                    if (!f.name.match(/\.less$/i)) {
                        alert("Please select a Less file!");
                        return;
                    }

                    var contents = e.target.result, lessvar, vars = {}, $options = $customizer.data("customizer").$options, theme;

                    contents.split("\n").forEach(function(line){

                        if (line.match(/\/\* theme\: (.+) \*\//)) {
                            theme = line.match(/\/\* theme\: (.+) \*\//)[1];
                            return;
                        }


                        lessvar = line.match(/(@[\w\-]+)\s*:\s*([^;]*);/i);

                        if (lessvar) {
                            vars[lessvar[1]] = lessvar[2];
                        }
                    });

                    if (Object.keys(vars).length) {

                        var name = theme ? theme : $customizer.data("customizer").$select.val();

                        $.each($options.styles, function(i, style) {
                            if (name == style.name) {
                                $options.styles[i].variables = $.extend({}, $options.styles[i].variables, vars);
                            }
                        });

                        if (theme) {
                            $customizer.data("customizer").$select.val(theme);
                        }

                        $customizer.trigger("update", [false, true]);

                        $(input).replaceWith(input.outerHTML);
                    }
                  };

                r.readAsText(f);
            }
        });

    } else {

    }

    function renderPreview(style) {

        style.variables = style.variables || {};

        style.variables['@icon-font-path'] = '"../../fonts"';

        $.less.getCSS(style.less, {id: style.name, variables: style.variables, compress: true}).done(function(css) {

            if (style.fonts) {
                css = style.fonts + "\n" + css;
            }

            $iframe[0].contentWindow.jQuery.UIkit.langdirection = $rtl ? "right" : "left";
            $iframe.contents().find("html").attr("dir", $rtl ? "rtl" : "ltr");
            $iframe.contents().find("[data-compiled-css]").replaceWith('<style data-compiled-css>'+($rtl ? $.rtl.convert2RTL(css) : css)+'</style>');
            $spinner.hide();
            $error.trigger("hide");

        }).fail(function(e) {
            $error.trigger("show", e);
        });
    }

    function downloadCSS(a, style) {

        var options = $minify.prop("checked") ? {compress: true} : {};

        $.less.getCSS(style.less, $.extend(options, {id: style.name, variables: style.variables})).done(function(css) {

            if (style.fonts) {
                css = style.fonts + "\n" + css;
            }

            if ($rtl) {
                css = $.rtl.convert2RTL(css);
            }

            css = css.replace(/http(.+?)\/fonts\/?/g, function(){
                return "../fonts/";
            });

            if ($download) {
                a.attr("href", $url.createObjectURL(new Blob([css], {type: "application/force-download"})));
            } else {
                $("h2", $modal).text("CSS Code");
                $("textarea", $modal).val(css);
            }
        });
    }

    function downloadLess(a, style) {

        var source = [], first, cache = {};

        if (style.fonts) {
            source.push(style.fonts);
        }

        source.push("/* theme: "+$customizer.data("customizer").$select.val()+" */\n")

        $.each(style.config.groups, function(i, grp) {
            first = true;
            $.each(grp.vars, function(i, opt) {
                $.each(style.variables, function(name, value) {
                    if (style.matchName(opt, name)) {

                        if (!cache[name]) {

                            if (first) source.push("\n//\n// "+grp.label+"\n//\n");
                            source.push(name + ": " + value + ";");
                            first = false;
                            cache[name] = true;
                        }
                    }
                  });
             });
        });

        if ($download && source.length) {
            a.attr("href", $url.createObjectURL(new Blob([source.join("\n")], {type: "application/force-download"})));
        } else {
            $("h2", $modal).text("Less Variables");
            $("textarea", $modal).val(source.join("\n"));
        }
    }

});
