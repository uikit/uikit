(function($) {

    var Customizer = function($element, $options) {

        var $select   = $($options.select, $element),
            $sidebar  = $($options.sidebar, $element),
            $advanced = $($options.advanced, $element),
            $style, memory = window.sessionStorage || {};

        this.$options = $options;
        this.$select  = $select;

        $element.on({
            "update": function(e, value, force) {

                if ($("option", $select).length != $options.styles.length) {
                    $select.html($.mustache($options.template.select, $options));

                    if(memory["uikit-customizer-last-theme"]) {
                        $select.val(memory["uikit-customizer-last-theme"]);
                    }
                }

                if (value) {
                    $select.val(value);
                }

                var name = $select.val(), current = $style;

                $.each($options.styles, function(i, style) {
                    if (name == style.name) {
                        $style = style;
                    }
                });

                if ($style !== current || force) {

                    $element.trigger("updating", $style);

                    loadStyle($style).done(function() {
                        renderSidebar($style);
                        $element.trigger("updated", $style);
                    });
                }
            },
            "updating": $options.updating,
            "updated": $options.updated
        });

        $select.on("change", function(e) {

            memory["uikit-customizer-last-theme"] = $select.val();

            setTimeout(function() {
                $element.trigger("update");
            }, 1);
        });

        $advanced.on("change", function(e) {
            $sidebar[$(this).prop("checked") ? "addClass" : "removeClass"]("cm-show-advanced");
        }).trigger("change");

        $element.on("click", "a.cm-more-link", function(e) {
            e.preventDefault();

            $(this).parents("fieldset:first").toggleClass("cm-show-more");
        });

        $element.on("change", "input[name=vars], select[name=vars]", function(e) {
            e.preventDefault();

            var name = $(this).attr('data-name'), value = $(this).val();

            if (value === "") {
                delete $style.variables[name];
            } else {
                $style.variables[name] = value;
            }

            $element.trigger("updated", $style);
        });

        function loadStyle(style) {

            var deferred = $.Deferred(),
                imports  = "";

            if (style.less) {
                return deferred.resolve();
            }

            if($.isArray(style.url)) {
                for (var i = 0; i < style.url.length; i++) {
                    imports += "@import url(" + style.url[i] + ");";
                }
            } else {
                imports  = "@import url(" + style.url + ");";
            }

            $.less.resolveImports(imports).done(function(less) {
                $.ajax({"url": style.config, "cache": false, "dataType": "json"}).done(function(config) {

                    var vars = $.less.getVars(less);

                    style.less = less;
                    style.config = config;
                    style.groups = [];
                    style.variables = style.variables || {};
                    style.matchName = matchName;

                    $.each(style.config.groups, function(i, grp) {

                        var variable, group = {label: grp.label, variables: [], advanced: grp.advanced || false, more: false};

                        $.each(grp.vars, function(i, opt) {
                            $.each(vars, function(name, value) {
                                if (matchName(opt, name)) {
                                    delete vars[name];

                                    variable = {
                                        "name": name,
                                        "default": value,
                                        "placeholder": value,
                                        "label": name.replace(/^@/, "").replace(/^\w+\-/, "").replace(/\-/g, " "),
                                        "more": value.indexOf("@") !== -1,
                                        "value": function() {
                                            return style.variables[name] ? style.variables[name] : "";
                                        }
                                    };

                                    if (variable.more) {
                                        group.more = true;
                                        variable.placeholder = "@";
                                    }

                                    group.variables.push(variable);
                                }
                            });
                        });

                        if (group.variables.length) {
                            style.groups.push(group);
                        }
                    });

                    deferred.resolve();
                });
            });

            return deferred.promise();
        }

        function renderSidebar(style) {

            $sidebar.html($.mustache($options.template.sidebar, style));

            $sidebar.find("input[data-name]").each(function() {

                var input = $(this), value = input.val() || input.data("default"), select, groups;

                if (input.attr("data-default").indexOf('@') !== -1) {
                    return;
                }

                $.each(style.config.controls, function(i, control) {
                    $.each(control.vars, function(i, pattern) {
                        if (matchName(pattern, input.attr("data-name"))) {
                            switch (control.type) {
                              case "color":

                                var placeholder = $('<div class="sp-placeholder"><div class="sp-placeholder-color"></div></div>').find("div").css("background-color", value).end().on("click", function() {

                                    input.spectrum({
                                        "showInput": true,
                                        "showAlpha": true,
                                        "preferredFormat": "hex",
                                        "color": (value=='inherit' ? '':value),
                                        "change": function(color) {
                                            if (color.toRgb().a < 1) {
                                                input.val(color.toRgbString()).trigger("change");
                                            }
                                        },
                                        "show": function(){

                                            if (!input.spectrum('container').find('.sp-reset').length) {

                                                input.spectrum('container').find('.sp-cancel').after($('<a href="#" class="sp-reset uk-margin-small-right">reset</a>').on("click", function(e) {
                                                    e.preventDefault();
                                                    input.spectrum('set', input.data("default")=="inherit" ? "rgba(0,0,0,0)":input.data("default"));
                                                    input.spectrum('hide');
                                                    input.val('').trigger('change');
                                                }));
                                            }
                                        }
                                    });

                                    placeholder.remove();

                                    setTimeout(function(){
                                        input.spectrum("show");
                                    }, 50);

                                });

                                input.hide().after(placeholder);

                                break;
                              case "font":

                                groups = [];

                                if ($.isArray(control.options)) {
                                    groups.push({"group": "", "options": control.options});
                                } else {
                                    $.each(control.options, function(group, options) {
                                        groups.push({"group": group, "options": options});
                                    });
                                }

                                select = $($.mustache('<select>{{#groups}}{{#group}}<optgroup label="{{group}}">{{/group}}{{#options}}<option value="{{value}}"{{#url}} data-url="{{url}}"{{/url}}>{{name}}</option>{{/options}}{{#group}}</optgroup>{{/group}}{{/groups}}</select>', {groups: groups}));

                                input.replaceWith(select.val(value).attr("class", input.attr("class")).attr("name", input.attr("name")).attr("data-name", input.attr("data-name")));

                                break;
                              case "select":

                                select = $($.mustache('<select>{{#options}}<option value="{{value}}">{{name}}</option>{{/options}}</select>', {options: control.options}));

                                input.replaceWith(select.val(value).attr("class", input.attr("class")).attr("name", input.attr("name")).attr("data-name", input.attr("data-name")));

                                break;
                            }
                        }
                    });
                });
            });
        }

        function matchName(pattern, path) {

            var parsedPattern = '^' + pattern.replace(/\//g, '\\/').
                replace(/\*\*/g, '(\\/[^\\/]+)*').
                replace(/\*/g, '[^\\/]+').
                replace(/((?!\\))\?/g, '$1.') + '$';

            parsedPattern = '^' + parsedPattern + '$';

            return (path.match(new RegExp(parsedPattern)) !== null);
        }

    };

    $.fn.customizer = function(options) {
        return this.each(function() {

            var defaults = {
                "updating": $.noop(),
                "updated": $.noop(),
                "select": "select[name=style]",
                "advanced": "input[name=advanced]",
                "sidebar": "section.cm-sidebar-content",
                "template": {
                    "select":
                        '{{#styles}}<option value="{{name}}">{{name}}</option>{{/styles}}',
                    "sidebar":
                        '<div class="cm-vars cm-form uk-form"> \
                            {{#groups}} \
                            <fieldset{{#advanced}} class="cm-advanced"{{/advanced}}> \
                                <h2 class="cm-form-title">{{label}}{{#more}} <a href="#" class="cm-more-link"></a>{{/more}}</h2> \
                                {{#variables}} \
                                <div class="uk-form-row{{#more}} cm-more{{/more}}"> \
                                    <label class="uk-form-label" title="{{name}}">{{label}}</label> \
                                    <div class="uk-form-controls"> \
                                        <input class="uk-form-small" name="vars" type="text"{{#value}} value="{{value}}"{{/value}} placeholder="{{placeholder}}" data-name="{{name}}" data-default="{{default}}"> \
                                    </div> \
                                </div> \
                                {{/variables}} \
                            </fieldset> \
                            {{/groups}} \
                        </div>'
                }
            },
            $this = $(this);

            $this.data("customizer", new Customizer($this, $.extend({}, defaults, options)));
        });
    };

})(jQuery);
