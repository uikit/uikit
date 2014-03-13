(function($, UI) {

    "use strict";

    var Nav = function(element, options) {

        var $this = this, $element = $(element);

        if($element.data("nav")) return;

        this.options = $.extend({}, Nav.defaults, options);
        this.element = $element.on("click", this.options.toggle, function(e) {
            e.preventDefault();

            var ele = $(this);

            $this.open(ele.parent()[0] == $this.element[0] ? ele : ele.parent("li"));
        });

        this.element.find(this.options.lists).each(function() {
            var $ele   = $(this),
                parent = $ele.parent(),
                active = parent.hasClass("uk-active");

            $ele.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>');
            parent.data("list-container", $ele.parent());

            if (active) $this.open(parent, true);
        });

        this.element.data("nav", this);
    };

    $.extend(Nav.prototype, {

        open: function(li, noanimation) {

            var element = this.element, $li = $(li);

            if (!this.options.multiple) {

                element.children(".uk-open").not(li).each(function() {
                    if ($(this).data("list-container")) {
                        $(this).data("list-container").stop().animate({height: 0}, function() {
                            $(this).parent().removeClass("uk-open");
                        });
                    }
                });
            }

            $li.toggleClass("uk-open");

            if ($li.data("list-container")) {
                if (noanimation) {
                    $li.data('list-container').stop().height($li.hasClass("uk-open") ? "auto" : 0);
                } else {
                    $li.data('list-container').stop().animate({
                        height: ($li.hasClass("uk-open") ? getHeight($li.data('list-container').find('ul:first')) : 0)
                    });
                }
            }
        }

    });

    Nav.defaults = {
        "toggle": ">li.uk-parent > a[href='#']",
        "lists": ">li.uk-parent > ul",
        "multiple": false
    };

    UI["nav"] = Nav;

    // helper

    function getHeight(ele) {
        var $ele = $(ele), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {
            var tmp = {
                position: $ele.css("position"),
                visibility: $ele.css("visibility"),
                display: $ele.css("display")
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-nav]").each(function() {
            var nav = $(this);

            if (!nav.data("nav")) {
                var obj = new Nav(nav, UI.Utils.options(nav.attr("data-uk-nav")));
            }
        });
    });

})(jQuery, jQuery.UIkit);